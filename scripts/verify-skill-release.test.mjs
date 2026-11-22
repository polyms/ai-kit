import assert from 'node:assert/strict'
import { test } from 'node:test'
import { verifySkillRelease } from './verify-skill-release.mjs'

const version = '0.3.3'
const revision = 'a'.repeat(40)
const release = { version, revision }
const names = ['reqs', 'plan', 'bug', 'qa', 'review']
const memoryPath = 'docs/agents/memory-protocol.md'
const origin = 'https://raw.githubusercontent.com/polyms/ai-kit/' + revision + '/'
const hint = { recall: [{ topic: 'prior-decisions', when: 'Relevant' }],
  capture: [{ topic: 'confirmed-lessons', when: 'Authorized' }] }
const packs = names.map(name => ({
  name, starterPaths: ['skills/' + name + '/SKILL.md'],
  contract: { context: [{ key: 'goal', importance: 'required', description: 'Goal' }],
    accepts: ['context'], produces: ['requirements'], readyWhen: 'Done', memory: hint },
}))
const catalog = { schemaVersion: 1, version, revision, packs }
function makeBundle(name, strategy, changed = {}) {
  const starter = 'skills/' + name + '/SKILL.md'
  const files = [starter, memoryPath].map(path => ({
    path, rawUrl: origin + path,
    ...(strategy === 'starter' && path === starter ? { content: '# Skill' } : {}),
    ...(strategy === 'selected' && path === memoryPath ? { content: '# Memory Protocol\n\nGuide' } : {}),
  }))
  return { schemaVersion: 1, namespace: 'ai-kit', name, version, revision,
    entry: starter, starterPaths: [starter], contract: packs.find(p => p.name === name).contract,
    files, ...changed }
}
function fakeFetch({ staleLatest = false, badStarter = false, noMemory = false } = {}) {
  return async (url, init) => {
    const path = new URL(url).pathname
    const response = (value, status = 200) => Response.json(value, { status })
    if (path === '/skill-bundles/latest.json') {
      return response({ ...catalog, ...(staleLatest ? { version: '0.3.2' } : {}),
        packs: noMemory ? packs.map(p => ({ ...p, contract: { ...p.contract, memory: undefined } })) : packs })
    }
    if (path === '/skill-bundles/0.3.3/catalog.json') return response(noMemory ? {
      ...catalog, packs: packs.map(p => ({ ...p, contract: { ...p.contract, memory: undefined } })),
    } : catalog)
    if (path === '/api/skills') {
      const body = JSON.parse(init.body)
      return response(makeBundle(body.name, 'selected'))
    }
    const match = path.match(/^\/skill-bundles\/0\.3\.3\/(reqs|plan|bug)\/(starter|manifest)\.json$/)
    if (match) {
      const bundle = makeBundle(match[1], match[2])
      if (badStarter && match[1] === 'plan' && match[2] === 'starter') {
        bundle.files[0].content = undefined
      }
      return response(bundle)
    }
    return response({ error: 'NOT_FOUND' }, 404)
  }
}
test('production release smoke validates all expected metadata and content', async () => {
  const result = await verifySkillRelease({
    endpoint: 'https://ai-kit.polyms.dev', release, fetchImpl: fakeFetch(),
  })
  assert.equal(result.status, 'passed')
  assert.equal(result.requests, 10)
  assert.deepEqual(result.checkedBundles, ['reqs', 'plan', 'bug'])
})
test('fails on outdated latest catalog', async () => {
  await assert.rejects(verifySkillRelease({
    endpoint: 'https://ai-kit.polyms.dev', release, fetchImpl: fakeFetch({ staleLatest: true }),
  }), /latest catalog: version/)
})
test('fails if a required starter file is missing', async () => {
  await assert.rejects(verifySkillRelease({
    endpoint: 'https://ai-kit.polyms.dev', release, fetchImpl: fakeFetch({ badStarter: true }),
  }), /missing starter content/)
})
test('fails if memory hint metadata is absent', async () => {
  await assert.rejects(verifySkillRelease({
    endpoint: 'https://ai-kit.polyms.dev', release, fetchImpl: fakeFetch({ noMemory: true }),
  }), /Missing P2 Memory hints/)
})
test('rejects non-HTTPS production endpoint', async () => {
  await assert.rejects(verifySkillRelease({
    endpoint: 'http://example.com', release, fetchImpl: fakeFetch(),
  }), /Use HTTPS/)
})
