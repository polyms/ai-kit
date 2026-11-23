import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { evaluateNativeCapture, renderNativeAudit } from './workflow-audit.mjs'

const spec = JSON.parse(readFileSync(new URL('./team-invitation.case.json', import.meta.url), 'utf8'))
const allGrades = () => Object.fromEntries(Object.values(spec.criteria).flat().map(item =>
  [item.id, { status: 'pass', evidence: 'Reviewer referenced a concrete task or testcase in the artifact' }]
))
const capture = (override = {}) => ({
  schemaVersion: 1, caseId: spec.id, promptId: spec.promptId, client: 'chatgpt',
  configuration: 'Instant', runId: 'test-01', mode: 'assisted',
  promptProvenance: 'user-confirmed', artifactRef: 'synthetic local test fixture',
  grades: allGrades(),
  trace: { source: 'host-export', complete: true, calls: [
    { name: 'mcp__AI_Kit__list_skill_packs', ok: true, args: {}, loaded: [], bytes: 200 },
    ...['plan', 'task', 'qa'].map(name => ({
      name: 'mcp__AI_Kit__get_skill_pack', args: { name, paths: ['skills/' + name + '/SKILL.md'] },
      ok: true, loaded: ['skills/' + name + '/SKILL.md'], bytes: 500,
    })),
  ] },
  ...override,
})

test('full host-export evidence grades correct route, templates and selective retrieval', () => {
  const result = evaluateNativeCapture(spec, capture())
  assert.equal(result.status, 'pass')
  assert.equal(result.trace.routeStatus, 'pass')
  assert.equal(result.trace.retrievalStatus, 'pass')
  assert.equal(result.trace.responseBytes, 1700)
  assert.deepEqual(result.trace.selected, ['plan', 'task', 'qa'])
  assert.equal(result.dimensions.template.pass, 4)
})

test('model-authored tool calls stay unverified even if they look perfect', () => {
  const x = capture()
  x.trace.source = 'model-report'
  const r = evaluateNativeCapture(spec, x)
  assert.equal(r.trace.routeStatus, 'unverified')
  assert.equal(r.trace.retrievalStatus, 'unverified')
  assert.equal(r.trace.responseBytes, null)
  assert.equal(r.status, 'unverified')
  assert.match(renderNativeAudit([r]), /Model-reported tool calls NEVER/)
})

test('missing, incomplete and non-content retrieval cannot earn verified success', () => {
  const x = capture()
  x.trace.complete = false
  assert.equal(evaluateNativeCapture(spec, x).trace.routeStatus, 'unverified')
  x.trace.complete = true
  x.trace.calls[2].loaded = undefined
  assert.equal(evaluateNativeCapture(spec, x).trace.routeStatus, 'unverified')
  assert.equal(evaluateNativeCapture(spec, x).trace.retrievalStatus, 'unverified')
})

test('duplicate catalog, full pack and repeated loads fail retrieval efficiency', () => {
  const x = capture()
  x.trace.calls.push({ name: 'list_skill_packs', args: {}, ok: true, loaded: [], bytes: 100 })
  x.trace.calls.push({ name: 'get_skill_pack', args: { name: 'qa' }, ok: true,
    loaded: ['skills/qa/SKILL.md'], bytes: 120 })
  const r = evaluateNativeCapture(spec, x)
  assert.equal(r.trace.listCalls, 2)
  assert.equal(r.trace.fullLoads, 1)
  assert.deepEqual(r.trace.repeatedPaths, ['skills/qa/SKILL.md'])
  assert.equal(r.trace.retrievalStatus, 'fail')
  assert.equal(r.status, 'fail')
})

test('wrong and avoided packs fail the host route even with a perfect document grade', () => {
  const x = capture()
  x.trace.calls = x.trace.calls.filter(c => c.args?.name !== 'qa')
  x.trace.calls.push({ name: 'get_skill_pack', args: { name: 'design', paths: ['skills/design/SKILL.md'] },
    ok: true, loaded: ['skills/design/SKILL.md'], bytes: 200 })
  const r = evaluateNativeCapture(spec, x)
  assert.deepEqual(r.trace.missing, ['qa'])
  assert.deepEqual(r.trace.skipped, ['design'])
  assert.equal(r.trace.routeStatus, 'fail')
  assert.equal(r.status, 'fail')
})

test('missing manual grade is unverified; claimed pass without evidence is rejected', () => {
  const x = capture()
  delete x.grades.task_structure
  const r = evaluateNativeCapture(spec, x)
  assert.equal(r.dimensions.template.unverified, 1)
  assert.equal(r.status, 'unverified')
  x.grades.task_structure = { status: 'pass', evidence: '' }
  assert.throws(() => evaluateNativeCapture(spec, x), /Missing reviewed evidence/)
  x.grades.unknown = { status: 'pass', evidence: 'x' }
  assert.throws(() => evaluateNativeCapture(spec, x), /Unknown criterion/)
})

test('baseline does not require AI Kit calls, but a host-observed accidental retrieval fails', () => {
  const x = capture({ mode: 'baseline', trace: { source: 'none', complete: false, calls: [] } })
  const absent = evaluateNativeCapture(spec, x)
  assert.equal(absent.trace.routeStatus, 'not-applicable')
  assert.equal(absent.status, 'pass')
  const y = capture({ mode: 'baseline' })
  assert.equal(evaluateNativeCapture(spec, y).trace.routeStatus, 'fail')
  assert.equal(evaluateNativeCapture(spec, y).status, 'fail')
})

test('client labels are generic; prompt identity, names and contradictory provenance validated', () => {
  const x = capture({ client: 'cursor', configuration: 'everyday/default',
    promptProvenance: 'unknown' })
  assert.equal(evaluateNativeCapture(spec, x).identity.client, 'cursor')
  assert.throws(() => evaluateNativeCapture(spec, capture({ promptId: 'different' })), /Prompt fixture mismatch/)
  assert.throws(() => evaluateNativeCapture(spec, capture({ client: '' })), /Missing client/)
  assert.throws(() => evaluateNativeCapture(spec, capture({
    trace: { source: 'none', complete: false, calls: [{ name: 'list_skill_packs' }] },
  })), /No-trace record cannot have calls/)
  assert.throws(() => evaluateNativeCapture(spec, capture({
    trace: { source: 'host-export', complete: true, calls: [{ name: 'list_skill_packs', bytes: -3 }] },
  })), /Invalid response bytes/)
})

test('example provided in repository is marked unverified and never a real client benchmark', () => {
  const x = JSON.parse(readFileSync(new URL('./examples/instant-model-reported.example.json', import.meta.url), 'utf8'))
  const r = evaluateNativeCapture(spec, x)
  assert.equal(r.status, 'unverified')
  assert.equal(r.trace.callCount, 4)
  assert.equal(r.trace.responseBytes, null)
  assert.ok(renderNativeAudit([r]).includes('unverified'))
})
