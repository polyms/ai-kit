import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getSkillPack, listSkillPacks } from '../../../registry/releases/0.3.0/manifest/skill-pack'

const app = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const root = resolve(app, '../..')
const release = JSON.parse(readFileSync(resolve(root, 'registry/releases/0.3.0/release.json'), 'utf8')) as {
  version: string; revision: string; files: Record<string, string>
}
const { version, revision } = release
if (!/^[a-f0-9]{40}$/.test(revision)) throw new Error('Invalid release revision')
const contentByPath = new Map<string, string>()
async function load(path: string) {
  const expected = release.files[path]
  if (!/^[a-f0-9]{40}$/.test(expected ?? '')) throw new Error('Unregistered snapshot path: ' + path)
  let bytes: Buffer | undefined
  try {
    bytes = execFileSync('git', ['show', revision + ':' + path], { cwd: root, stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 2_000_000 })
  } catch {
    // Shallow/Vercel checkouts may not have historical Git objects. Build-time fallback only.
    const response = await fetch('https://raw.githubusercontent.com/polyms/ai-kit/' + revision + '/' + path, {
      signal: AbortSignal.timeout(20_000), redirect: 'error',
    })
    if (!response.ok) throw new Error('Release source unavailable: ' + path + ' HTTP ' + response.status)
    bytes = Buffer.from(await response.arrayBuffer())
  }
  const hash = createHash('sha1').update('blob ' + bytes.length).update(Buffer.from([0])).update(bytes).digest('hex')
  if (hash !== expected) throw new Error('Release blob mismatch: ' + path + ' expected=' + expected + ' actual=' + hash)
  const content = bytes.toString('utf8')
  if (!content.trim() || content.length > 500_000) throw new Error('Invalid snapshot file: ' + path)
  contentByPath.set(path, content)
}
const releasePaths = Object.keys(release.files)
for (let i = 0; i < releasePaths.length; i += 8) {
  await Promise.all(releasePaths.slice(i, i + 8).map(load))
}
const output = resolve(app, 'public/skill-bundles')
function write(path: string, data: unknown) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, JSON.stringify(data))
}
const raw = (path: string) => 'https://raw.githubusercontent.com/polyms/ai-kit/' + revision + '/' + path
const packs = listSkillPacks().map(pack => ({ ...pack, skillRawUrl: raw('skills/' + pack.name + '/SKILL.md') }))
const catalog = { schemaVersion: 1, version, revision, packs }
const bundles = Object.fromEntries(packs.map(summary => {
  const pack = getSkillPack(summary.name)
  if (!pack) throw new Error('Unknown pack: ' + summary.name)
  const files = [...pack.files, ...(pack.name === 'design' ? pack.uiKit : [])].map(({ path }) => {
    const content = contentByPath.get(path)
    if (!content) throw new Error('Missing release content: ' + path)
    return { path, rawUrl: raw(path), content }
  })
  const bundle = {
    schemaVersion: 1, namespace: 'ai-kit', name: pack.name, version, revision,
    entry: 'skills/' + pack.name + '/SKILL.md', starterPaths: summary.starterPaths,
    contract: summary.contract, files,
  }
  for (const strategy of ['starter', 'manifest', 'full']) {
    const selected = new Set(strategy === 'starter' ? bundle.starterPaths : [])
    write(resolve(output, version, pack.name, strategy + '.json'), {
      ...bundle,
      files: files.map(file => strategy === 'full' || selected.has(file.path)
        ? file : { path: file.path, rawUrl: file.rawUrl }),
    })
  }
  return [pack.name, bundle]
}))
write(resolve(output, version, 'catalog.json'), catalog)
write(resolve(output, 'latest.json'), catalog)
write(resolve(app, 'src/lib/skill-pack/release-snapshot.generated.json'), { catalog, bundles })
console.log('Generated ' + packs.length + ' immutable skill bundles from verified Git blobs')
