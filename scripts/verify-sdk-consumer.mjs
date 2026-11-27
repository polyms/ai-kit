import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const contextPath = 'docs/agents/context-contract.md'
const memoryPath = 'docs/agents/memory-protocol.md'
const qaPath = 'skills/qa/SKILL.md'
const shaPattern = /^[0-9a-f]{40}$/

// Reference consumer for SDK retrieval and safe domain extension, not an Astra
// deployment probe. It never authenticates to, reads from, or writes to Astra.
export async function verifySdkConsumer({ endpoint, release, createProvider, extendSkill }) {
  assert.ok(release && /^\d+\.\d+\.\d+$/.test(release.version) &&
    shaPattern.test(release.revision), 'Expected immutable release metadata')
  assert.equal(typeof createProvider, 'function', 'SDK factory is required')
  assert.equal(typeof extendSkill, 'function', 'SDK extension method is required')

  const provider = createProvider({ endpoint, version: 'latest', timeoutMs: 15000 })
  const latest = await provider.list()
  const pinned = await provider.list(release.version)
  for (const [label, catalog] of [['latest', latest], ['pinned', pinned]]) {
    assert.equal(catalog.schemaVersion, 1, label + ' schemaVersion')
    assert.equal(catalog.version, release.version, label + ' version')
    assert.equal(catalog.revision, release.revision, label + ' revision')
  }
  assert.deepEqual(latest, pinned, 'latest and pinned catalogs differ')
  const summary = latest.packs.find(pack => pack.name === 'qa')
  assert.ok(summary, 'QA skill pack missing from catalog')

  const starter = await provider.getSkill('qa')
  assert.equal(starter.version, release.version, 'QA starter version')
  assert.equal(starter.revision, release.revision, 'QA starter revision')
  assert.deepEqual(starter.contract, summary.contract, 'QA contract changed during delivery')
  const getContent = (bundle, path) => bundle.files.find(file => file.path === path)?.content
  const context = getContent(starter, contextPath)
  const qa = getContent(starter, qaPath)
  assert.ok(starter.starterPaths.includes(contextPath), 'Context guidance not in QA starter')
  assert.ok(context?.includes('Feature lifecycle and environment-aware context'),
    'Missing environment-aware context governance')
  assert.ok(context?.includes('Never substitute Dev evidence for Production'),
    'Missing environment separation guard')
  assert.ok(qa?.includes('cannot self-approve'), 'Missing QA approval guard')

  const selected = await provider.getSkill('qa', { version: release.version, paths: [memoryPath] })
  assert.equal(selected.revision, release.revision, 'Selected reference revision')
  assert.deepEqual(selected.contract, starter.contract, 'Selected reference changed QA contract')
  assert.ok(getContent(selected, memoryPath)?.startsWith('# Memory Protocol'),
    'Lazy memory reference was not loaded')
  assert.equal(selected.files.filter(file => file.content).length, 1,
    'Exact-path selection loaded unrelated content')

  const original = structuredClone(starter.contract)
  const extension = extendSkill(starter, {
    name: 'reference-consumer-qa',
    extends: 'ai-kit/qa@' + release.version,
    instructions: 'Use only authorized consumer evidence; never self-approve decisions.',
    context: [{
      key: 'consumer-policy',
      importance: 'recommended',
      description: 'Trusted consumer-side authorization policy, resolved by the host.',
    }],
  })
  assert.deepEqual(starter.contract, original, 'SDK domain extension mutated core contract')
  assert.deepEqual(extension.base.contract, original, 'SDK domain extension replaced core contract')
  assert.deepEqual(extension.domainContext.map(item => item.key), ['consumer-policy'])
  return {
    status: 'passed',
    kind: 'generic-sdk-reference-consumer',
    version: release.version,
    revision: release.revision,
    checkedPack: 'qa',
    checkedReferences: [contextPath, qaPath, memoryPath],
    checks: ['latest-and-pinned', 'environment-governance', 'qa-approval',
      'exact-path-reference', 'additive-domain-extension'],
  }
}

const scriptFile = fileURLToPath(import.meta.url)
if (process.argv[1] && resolve(process.argv[1]) === scriptFile) {
  const args = process.argv.slice(2)
  const versionFlag = args.indexOf('--version')
  const endpointFlag = args.indexOf('--endpoint')
  if (versionFlag < 0 || !args[versionFlag + 1] ||
      endpointFlag < 0 || !args[endpointFlag + 1]) {
    console.error('Usage: node scripts/verify-sdk-consumer.mjs --version 0.3.5 --endpoint https://ai-kit.polyms.dev')
    process.exitCode = 2
  } else {
    try {
      const version = args[versionFlag + 1]
      assert.match(version, /^\d+\.\d+\.\d+$/, 'Invalid release version')
      const release = JSON.parse(readFileSync(resolve('registry/releases', version, 'release.json'), 'utf8'))
      const { createSkillProvider, extendSkill } = await import('../sdk/dist/skill-provider.js')
      const result = await verifySdkConsumer({
        endpoint: args[endpointFlag + 1], release,
        createProvider: createSkillProvider, extendSkill,
      })
      const sdkVersion = JSON.parse(readFileSync(new URL('../sdk/package.json', import.meta.url), 'utf8')).version
      console.log(JSON.stringify({ ...result, sdkVersion, sdkSource: 'ai-kit-workspace-build' }, null, 2))
    } catch (error) {
      console.error('SDK reference consumer verification FAILED:', error.message)
      process.exitCode = 1
    }
  }
}
