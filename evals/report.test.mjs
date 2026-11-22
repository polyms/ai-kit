import assert from 'node:assert/strict'
import { test } from 'node:test'
import { renderEvaluationReport, summarizeEvaluation } from './report.mjs'

const make = (rows, more = {}) => ({
  schemaVersion: 1, model: 'example-model', judgeModel: 'example-judge',
  createdAt: '2026-11-22T00:00:00Z', revision: 'a'.repeat(40),
  fixtureHash: 'b'.repeat(64), endpointHost: 'example.test', rows, ...more,
})
const row = (id, mode, status, extra = {}) => ({
  suite: 'output', id, mode, repeat: 1, status, elapsedMs: 100,
  trace: [], ...extra,
})
test('summarizes complete paired results, latency, tokens and hard gates', () => {
  const data = make([
    row('OUT-1', 'baseline', 'fail', { usage: { inputTokens: 10, outputTokens: 5 } }),
    row('OUT-1', 'assisted', 'pass', { elapsedMs: 200, usage: { inputTokens: 15, outputTokens: 10 },
      traceScore: { status: 'pass' }, grade: { hardGates: { fail: 0 } } }),
    row('OUT-2', 'baseline', 'unverified', { usage: null }),
    row('OUT-2', 'assisted', 'fail', { usage: null, grade: { hardGates: { fail: 1 } } }),
  ])
  const s = summarizeEvaluation(data).summary.output
  assert.equal(s.pairs, 2)
  assert.equal(s.completedPairs, 2)
  assert.deepEqual(s.compared, { assistedWins: 1, assistedLosses: 0, ties: 0, unverified: 1 })
  assert.equal(s.byMode.assisted.hardGateFailures, 1)
  assert.equal(s.byMode.baseline.usageSamples, 1)
  assert.equal(s.pairedTokenSamples, 1)
  assert.equal(s.pairedMedianTokenDelta, 10)
  assert.equal(s.pairedMedianLatencyDeltaMs, 50)
  const markdown = renderEvaluationReport(data)
  assert.match(markdown, /OUT-1|output/)
  assert.match(markdown, /1 \/ 0 \/ 0 \/ 1/)
  assert.match(markdown, /not counted as wins/)
})
test('incomplete and unverified results are never counted as wins', () => {
  const s = summarizeEvaluation(make([row('X', 'baseline', 'pass')])).summary.output
  assert.equal(s.incompletePairs, 1)
  assert.equal(s.completedPairs, 0)
  assert.equal(s.compared.assistedWins, 0)
})
test('duplicate samples fail instead of inflating the score', () => {
  const sample = row('X', 'baseline', 'pass')
  assert.throws(() => summarizeEvaluation(make([sample, sample])), /Duplicate evaluation row/)
})
test('malformed rows and missing provenance fail closed', () => {
  assert.throws(() => summarizeEvaluation(make([row('X', 'baseline', 'pass', { mode: 'unknown' })])),
    /Invalid evaluation row/)
  assert.throws(() => summarizeEvaluation(make([], { fixtureHash: null })),
    /Missing model or fixture provenance/)
})

test('reports unstarted planned pairs as missing and never as wins', () => {
  const data = make([row('X', 'baseline', 'pass'), row('X', 'assisted', 'pass')], {
    plan: { pairedRuns: 83 },
  })
  const result = summarizeEvaluation(data)
  assert.equal(result.coverage.expectedPairs, 83)
  assert.equal(result.coverage.completedPairs, 1)
  assert.equal(result.coverage.missingOrIncomplete, 82)
  assert.match(renderEvaluationReport(data), /Missing or incomplete planned pairs \| 82/)
})
test('rejects inconsistent planned paired-run counts', () => {
  const data = make([row('X', 'baseline', 'pass')], { plan: { pairedRuns: 0 } })
  assert.throws(() => summarizeEvaluation(data), /Runner plan has fewer paired runs/)
})
