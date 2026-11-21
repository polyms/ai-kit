import test from 'node:test'
import assert from 'node:assert/strict'
import { scoreRoute, gradeOutput, scoreTrace, summarize } from './scoring.mjs'

const route = { expected: ['research', 'business'], avoid: ['task'], ordered: true }
const names = ['research', 'business', 'task']
test('routing scores exact selection, opt-out, duplicates and required order', () => {
  assert.equal(scoreRoute(route, '{"skills":["research","business"]}', names).status, 'pass')
  assert.equal(scoreRoute(route, '{"skills":["business","research"]}', names).status, 'fail')
  assert.equal(scoreRoute(route, '{"skills":["research","business","research"]}', names).status, 'fail')
  assert.deepEqual(scoreRoute(route, '{"skills":["research","task"]}', names).avoided, ['task'])
  assert.equal(scoreRoute({ expected: [], avoid: names }, '{"skills":[]}', names).status, 'pass')
  assert.throws(() => scoreRoute(route, '{"skills":["unknown"]}', names))
})
const item = { criteria: ['quality'], hardGates: ['scope preserved'] }
const result = (a, b) =>
  JSON.stringify({
    grades: [
      { index: 0, status: a, evidence: 'observed A' },
      { index: 1, status: b, evidence: 'observed B' },
    ],
  })
test('hard gates and unknown evidence never become a pass', () => {
  assert.equal(gradeOutput(item, result('pass', 'pass')).status, 'pass')
  assert.equal(gradeOutput(item, result('pass', 'fail')).status, 'fail')
  assert.equal(gradeOutput(item, result('pass', 'unobservable')).status, 'unverified')
  assert.equal(gradeOutput(item, result('fail', 'pass')).status, 'fail')
  assert.throws(() => gradeOutput(item, '{"grades":[]}'))
  assert.throws(() =>
    gradeOutput(
      item,
      '{"grades":[{"index":1,"status":"pass","evidence":"x"},{"index":0,"status":"pass","evidence":"y"}]}'
    )
  )
})
test('trace aggregates actual loads and does not count manifest-only calls', () => {
  const trace = [
    { name: 'get_skill_pack', ok: true, args: { name: 'task', paths: [] }, loaded: [] },
    {
      name: 'get_skill_pack',
      ok: true,
      args: { name: 'qa', paths: ['skills/qa/SKILL.md'] },
      loaded: ['skills/qa/SKILL.md'],
    },
    { name: 'get_skill_pack', ok: true, args: { name: 'qa' }, loaded: ['skills/qa/SKILL.md'] },
  ]
  const grade = scoreTrace({ requiredSkills: ['task'], skipSkills: ['qa'] }, trace, 'assisted')
  assert.deepEqual(grade.missing, ['task'])
  assert.deepEqual(grade.avoided, ['qa'])
  assert.equal(grade.fullLoads, 1)
  assert.equal(grade.reloads, 1)
  assert.equal(grade.status, 'fail')
  assert.equal(scoreTrace({ skill: 'task' }, [], 'baseline').status, 'not-applicable')
})
test('summary records unknown usage and unresolved scores separately', () => {
  const rows = [
    { suite: 'output', mode: 'baseline', status: 'unverified', elapsedMs: 10, usage: null },
    { suite: 'output', mode: 'baseline', status: 'error', elapsedMs: 5, usage: null },
    {
      suite: 'output',
      mode: 'assisted',
      status: 'pass',
      elapsedMs: 20,
      usage: { inputTokens: 10, outputTokens: 5 },
      trace: [{ bytes: 22 }],
      traceScore: { status: 'pass' },
    },
  ]
  const s = summarize(rows)
  assert.equal(s['output:baseline'].usageReported, 0)
  assert.equal(s['output:baseline'].unverified, 1)
  assert.equal(s['output:baseline'].error, 1)
  assert.equal(s['output:assisted'].inputTokens, 10)
  assert.equal(s['output:assisted'].payloadBytes, 22)
})

import { memoryCase, memoryTraceScore, invokeMemoryLookup } from './memory/scoring.mjs'

test('memory suite distinguishes observable retrieval from unavailable capability', () => {
  const item = memoryCase({
    id: 'MP-X', skills: ['plan'], prompt: 'Estimate', context: 'Synthetic context',
    expected: 'Use evidence', forbidden: 'Invent effort',
    memoryLookup: { scope: 'A', topic: 'effort', result: 'verified actual 5 days', expectedCalls: 1 },
  })
  assert.equal(item.suite, 'memory')
  assert.equal(item.hardGates.length, 1)
  const allowed = invokeMemoryLookup(item, 'recall_memory', { scope: 'A', topic: 'effort' })
  assert.equal(allowed.trace.ok, true)
  assert.equal(memoryTraceScore(item, [allowed.trace]).status, 'pass')
  assert.equal(memoryTraceScore(item, []).status, 'fail')
  assert.equal(memoryTraceScore(item, [allowed.trace, allowed.trace]).status, 'fail')
  const denied = invokeMemoryLookup(item, 'recall_memory', { scope: 'B', topic: 'effort' })
  assert.equal(denied.trace.ok, false)
  assert.doesNotMatch(denied.result, /verified actual/)
  assert.equal(memoryTraceScore(item, [denied.trace]).status, 'fail')
  const noLookup = { ...item, memoryLookup: undefined }
  assert.equal(memoryTraceScore(noLookup, []).status, 'not-applicable')
  assert.equal(invokeMemoryLookup(noLookup, 'recall_memory', {}).trace.ok, false)
  assert.throws(() => memoryCase({ ...item, memoryLookup: { ...item.memoryLookup, expectedCalls: 2 } }))
})
