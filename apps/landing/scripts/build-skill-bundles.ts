import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getSkillPack, listSkillPacks } from '../../../registry/releases/0.3.0/manifest/skill-pack'

const app = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const version = '0.3.0'
const revision = 'b94b59a78dd0704d801a7097ddd4ced19ed2d2dc'
const source = resolve(app, '../../registry/releases', version, 'content')
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
    const content = readFileSync(resolve(source, path), 'utf8')
    if (!content.trim() || content.length > 500_000) throw new Error('Invalid snapshot file: ' + path)
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
console.log('Generated ' + packs.length + ' immutable skill bundles without network access')
