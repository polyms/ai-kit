import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const versionPattern = /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$/
const shaPattern = /^[0-9a-f]{40}$/
const memoryPacks = ['reqs', 'plan', 'bug', 'qa', 'review']
const checkedPacks = ['reqs', 'plan', 'bug']
const memoryPath = 'docs/agents/memory-protocol.md'

function endpointUrl(value) {
  const url = new URL(value)
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
  assert.ok(url.protocol === 'https:' || (url.protocol === 'http:' && local),
    'Use HTTPS or localhost HTTP')
  assert.ok(!url.username && !url.password && !url.search && !url.hash &&
    url.pathname === '/', 'Provide a clean origin URL')
  return url
}

function sameRelease(data, expected, label) {
  assert.equal(data.schemaVersion, 1, label + ': schemaVersion')
  assert.equal(data.version, expected.version, label + ': version')
  assert.equal(data.revision, expected.revision, label + ': revision')
}

export async function verifySkillRelease({ endpoint, release, retiredVersions = [], fetchImpl = fetch }) {
  const origin = endpointUrl(endpoint)
  assert.ok(release && versionPattern.test(release.version) &&
    shaPattern.test(release.revision), 'Expected a pinned release manifest')
  assert.ok(Array.isArray(retiredVersions) && retiredVersions.every(version =>
    typeof version === 'string' && versionPattern.test(version) && version !== release.version) &&
    new Set(retiredVersions).size === retiredVersions.length && retiredVersions.length <= 8,
    'Retired versions must be distinct valid versions other than the active release')
  const counters = { requests: 0 }
  async function request(path, init) {
    counters.requests++
    const response = await fetchImpl(new URL(path, origin), {
      ...init,
      redirect: 'error',
      signal: AbortSignal.timeout(15_000),
    })
    assert.equal(response.status, 200, path + ': expected HTTP 200, got ' + response.status)
    assert.match(response.headers.get('content-type') ?? '', /json/i, path + ': JSON required')
    return response.json()
  }
  const latest = await request('/skill-bundles/latest.json')
  const pinned = await request('/skill-bundles/' + release.version + '/catalog.json')
  sameRelease(latest, release, 'latest catalog')
  sameRelease(pinned, release, 'pinned catalog')
  assert.deepEqual(latest, pinned, 'latest and pinned catalog must match')
  assert.ok(Array.isArray(latest.packs) && latest.packs.length > 0, 'Nonempty catalog required')
  assert.equal(new Set(latest.packs.map(p => p.name)).size, latest.packs.length,
    'Duplicate pack in catalog')
  for (const name of memoryPacks) {
    const pack = latest.packs.find(p => p.name === name)
    assert.ok(pack, 'Missing catalog pack ' + name)
    assert.ok(pack.contract?.memory?.recall?.length && pack.contract?.memory?.capture?.length,
      'Missing P2 Memory hints: ' + name)
  }
  const fileUrl = path =>
    'https://raw.githubusercontent.com/polyms/ai-kit/' + release.revision + '/' + path
  for (const name of checkedPacks) {
    const summary = latest.packs.find(p => p.name === name)
    const path = '/skill-bundles/' + release.version + '/' + name + '/'
    const manifest = await request(path + 'manifest.json')
    const starter = await request(path + 'starter.json')
    for (const [label, bundle] of [['manifest', manifest], ['starter', starter]]) {
      sameRelease(bundle, release, name + ' ' + label)
      assert.equal(bundle.namespace, 'ai-kit', name + ': namespace')
      assert.equal(bundle.name, name, name + ': name')
      assert.equal(bundle.entry, 'skills/' + name + '/SKILL.md', name + ': entry')
      assert.deepEqual(bundle.contract, summary.contract, name + ': contract mismatch')
      assert.deepEqual(bundle.starterPaths, summary.starterPaths, name + ': starter paths mismatch')
      assert.ok(Array.isArray(bundle.files) && bundle.files.length > 0, name + ': files missing')
      assert.equal(new Set(bundle.files.map(f => f.path)).size, bundle.files.length,
        name + ': duplicate paths')
      for (const file of bundle.files) {
        assert.equal(file.rawUrl, fileUrl(file.path), name + ': non-pinned raw URL')
        const shouldHaveContent = label === 'starter' && bundle.starterPaths.includes(file.path)
        if (shouldHaveContent) assert.ok(typeof file.content === 'string' && file.content.trim(),
          name + ': missing starter content ' + file.path)
        else assert.equal(file.content, undefined, name + ': unexpected content ' + file.path)
      }
    }
    assert.deepEqual(manifest.files.map(f => f.path), starter.files.map(f => f.path),
      name + ': starter/manifest file mismatch')
  }
  const plan = await request('/skill-bundles/' + release.version + '/plan/manifest.json')
  assert.ok(plan.files.some(f => f.path === memoryPath),
    'Memory Protocol reference missing from plan manifest')
  const selected = await request('/api/skills', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: 'plan', version: release.version, paths: [memoryPath] }),
  })
  sameRelease(selected, release, 'exact reference')
  assert.equal(selected.name, 'plan')
  assert.deepEqual(selected.contract, plan.contract, 'Exact reference changed contract')
  assert.deepEqual(selected.files.map(f => f.path), plan.files.map(f => f.path),
    'Exact reference changed manifest')
  for (const file of selected.files) {
    assert.equal(file.rawUrl, fileUrl(file.path), 'Exact reference URL mismatch')
    if (file.path === memoryPath) {
      assert.ok(file.content?.startsWith('# Memory Protocol'),
        'Memory Protocol reference was not loaded')
    } else assert.equal(file.content, undefined, 'Unrequested reference was loaded')
  }
  // A stale CDN or API proxy must not silently serve current content for a retired release.
  for (const retiredVersion of retiredVersions) {
    const checks = [
      ['/skill-bundles/' + retiredVersion + '/catalog.json'],
      ['/skill-bundles/' + retiredVersion + '/qa/starter.json'],
      ['/api/skills', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: 'qa', version: retiredVersion }),
      }],
    ]
    for (const [path, init] of checks) {
      counters.requests++
      const response = await fetchImpl(new URL(path, origin), {
        ...init, redirect: 'error', signal: AbortSignal.timeout(15_000),
      })
      assert.equal(response.status, 404,
        'Retired ' + retiredVersion + ' must return HTTP 404 for ' + path +
        ', got ' + response.status)
    }
  }
  return {
    status: 'passed',
    version: release.version,
    revision: release.revision,
    endpoint: origin.origin,
    catalogPacks: latest.packs.length,
    checkedBundles: checkedPacks,
    selectedReference: memoryPath,
    requests: counters.requests,
    retiredVersionsChecked: retiredVersions,
  }
}

const mainFile = fileURLToPath(import.meta.url)
if (process.argv[1] && resolve(process.argv[1]) === mainFile) {
  const args = process.argv.slice(2)
  const versionFlag = args.indexOf('--version')
  const endpointFlag = args.indexOf('--endpoint')
  const retiredFlag = args.indexOf('--retired')
  if (versionFlag === -1 || !args[versionFlag + 1] ||
      endpointFlag === -1 || !args[endpointFlag + 1]) {
    console.error('Usage: node scripts/verify-skill-release.mjs --version 0.3.5 --endpoint https://ai-kit.polyms.dev [--retired 0.3.4]')
    process.exitCode = 2
  } else {
    const version = args[versionFlag + 1]
    try {
      assert.match(version, versionPattern, 'Invalid release version')
      const file = resolve('registry/releases', version, 'release.json')
      const release = JSON.parse(readFileSync(file, 'utf8'))
      const retiredVersions = retiredFlag === -1 ? [] : (args[retiredFlag + 1] ?? '').split(',')
      const result = await verifySkillRelease({ endpoint: args[endpointFlag + 1], release, retiredVersions })
      console.log(JSON.stringify(result, null, 2))
    } catch (error) {
      console.error('Skill release verification FAILED:', error.message)
      process.exitCode = 1
    }
  }
}
