import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const statuses = new Set(['pass', 'fail', 'unverified', 'error'])
const modes = ['baseline', 'assisted']
const suites = ['routing', 'output', 'composition', 'memory']

function percentile(values, fraction) {
  if (!values.length) return null
  const sorted = [...values].sort((a, b) => a - b)
  return Math.round(sorted[Math.ceil(sorted.length * fraction) - 1] * 100) / 100
}
const countStatus = rows => Object.fromEntries(
  [...statuses].map(status => [status, rows.filter(r => r.status === status).length])
)
const validUsage = row => row.usage && Number.isFinite(row.usage.inputTokens) &&
  row.usage.inputTokens >= 0 && Number.isFinite(row.usage.outputTokens) &&
  row.usage.outputTokens >= 0

export function summarizeEvaluation(report) {
  assert.equal(report?.schemaVersion, 1, 'Unsupported evaluation report schema')
  assert.ok(Array.isArray(report.rows), 'Missing evaluation rows')
  assert.ok(typeof report.revision === 'string' && typeof report.fixtureHash === 'string' &&
    typeof report.model === 'string' && report.model.trim(), 'Missing model or fixture provenance')
  const grouped = new Map()
  for (const row of report.rows) {
    assert.ok(suites.includes(row.suite) && typeof row.id === 'string' && row.id &&
      Number.isInteger(row.repeat) && row.repeat >= 1 && modes.includes(row.mode) &&
      statuses.has(row.status), 'Invalid evaluation row identity or status')
    const key = JSON.stringify([row.suite, row.id, row.repeat])
    const pair = grouped.get(key) ?? {}
    assert.ok(!pair[row.mode], 'Duplicate evaluation row: ' + key + ':' + row.mode)
    pair[row.mode] = row
    pair.suite = row.suite
    grouped.set(key, pair)
  }
  const summary = {}
  for (const suite of suites) {
    const all = report.rows.filter(row => row.suite === suite)
    if (!all.length) continue
    const pairs = [...grouped.values()].filter(pair => pair.suite === suite)
    const completed = pairs.filter(pair => pair.baseline && pair.assisted)
    const compared = { assistedWins: 0, assistedLosses: 0, ties: 0, unverified: 0 }
    const pairedLatency = []
    const pairedTokens = []
    for (const pair of completed) {
      const { baseline, assisted } = pair
      if (['pass', 'fail'].includes(baseline.status) && ['pass', 'fail'].includes(assisted.status)) {
        if (baseline.status === 'fail' && assisted.status === 'pass') compared.assistedWins++
        else if (baseline.status === 'pass' && assisted.status === 'fail') compared.assistedLosses++
        else compared.ties++
      } else compared.unverified++
      if (Number.isFinite(baseline.elapsedMs) && baseline.elapsedMs >= 0 &&
          Number.isFinite(assisted.elapsedMs) && assisted.elapsedMs >= 0) {
        pairedLatency.push(assisted.elapsedMs - baseline.elapsedMs)
      }
      if (validUsage(baseline) && validUsage(assisted)) {
        pairedTokens.push(
          assisted.usage.inputTokens + assisted.usage.outputTokens -
          baseline.usage.inputTokens - baseline.usage.outputTokens
        )
      }
    }
    const byMode = {}
    for (const mode of modes) {
      const rows = all.filter(row => row.mode === mode)
      const times = rows.filter(row => Number.isFinite(row.elapsedMs) && row.elapsedMs >= 0)
        .map(row => row.elapsedMs)
      const tokenRows = rows.filter(validUsage)
      const traceRows = rows.filter(row => Array.isArray(row.trace))
      byMode[mode] = {
        samples: rows.length,
        statuses: countStatus(rows),
        traceFailures: rows.filter(row => row.traceScore?.status === 'fail').length,
        hardGateFailures: rows.reduce((n, row) => n + (row.grade?.hardGates?.fail ?? 0), 0),
        latencySamples: times.length,
        p50Ms: percentile(times, .5),
        p95Ms: percentile(times, .95),
        usageSamples: tokenRows.length,
        totalInputTokens: tokenRows.reduce((n, row) => n + row.usage.inputTokens, 0),
        totalOutputTokens: tokenRows.reduce((n, row) => n + row.usage.outputTokens, 0),
        traceSamples: traceRows.length,
        payloadBytes: traceRows.reduce((n, row) =>
          n + row.trace.reduce((sum, call) => sum + (Number.isFinite(call.bytes) ? call.bytes : 0), 0), 0),
      }
    }
    summary[suite] = {
      uniqueCases: new Set(all.map(row => row.id)).size,
      pairs: pairs.length,
      completedPairs: completed.length,
      incompletePairs: pairs.length - completed.length,
      compared,
      pairedMedianLatencyDeltaMs: percentile(pairedLatency, .5),
      pairedLatencySamples: pairedLatency.length,
      pairedMedianTokenDelta: percentile(pairedTokens, .5),
      pairedTokenSamples: pairedTokens.length,
      byMode,
    }
  }
  return { report, summary }
}

const statusString = counts => ['pass', 'fail', 'unverified', 'error']
  .map(k => counts[k]).join('/')
const measure = value => value === null ? 'n/a' : String(value)
const safe = value => String(value ?? 'n/a').replaceAll('|', '\\|').replaceAll('\n', ' ')

export function renderEvaluationReport(report) {
  const { summary } = summarizeEvaluation(report)
  const lines = [
    '# AI Kit measured evaluation report',
    '',
    '> Generated from an actual runner report. CI fixture tests and dry runs are **not** model-quality results.',
    '',
    '| Provenance | Value |',
    '| --- | --- |',
    '| Model | ' + safe(report.model) + ' |',
    '| Judge | ' + safe(report.judgeModel ?? 'none (semantic outcomes unverified)') + ' |',
    '| Revision | ' + safe(report.revision) + ' |',
    '| Fixture hash | ' + safe(report.fixtureHash) + ' |',
    '| Run timestamp | ' + safe(report.createdAt) + ' |',
    '| Endpoint host | ' + safe(report.endpointHost) + ' |',
    '| Rows recorded | ' + report.rows.length + ' |',
    '',
    '## Paired outcomes',
    '',
    'A win means baseline **failed** and assisted **passed**. Incomplete, error and unverified pairs are not counted as wins or ties.',
    '',
    '| Suite | Complete/total pairs | Baseline P/F/U/E | Assisted P/F/U/E | Wins / losses / ties / unverified |',
    '| --- | ---: | --- | --- | --- |',
  ]
  for (const [suite, value] of Object.entries(summary)) {
    const c = value.compared
    lines.push('| ' + suite + ' | ' + value.completedPairs + '/' + value.pairs +
      ' | ' + statusString(value.byMode.baseline.statuses) +
      ' | ' + statusString(value.byMode.assisted.statuses) + ' | ' +
      [c.assistedWins, c.assistedLosses, c.ties, c.unverified].join(' / ') + ' |')
  }
  lines.push('', '## Latency, token reporting and retrieval', '',
    'Percentiles use only samples with observed latency. Tokens are totals from rows where the endpoint reported both input and output counts; **do not interpret partial coverage as total cost**.', '',
    '| Suite / mode | p50 / p95 ms (n) | Tokens input / output (n/rows) | Trace failures | Hard-gate failures | Payload bytes (trace n) |',
    '| --- | --- | --- | ---: | ---: | --- |')
  for (const [suite, value] of Object.entries(summary)) {
    for (const mode of modes) {
      const v = value.byMode[mode]
      lines.push('| ' + suite + ' / ' + mode + ' | ' +
        measure(v.p50Ms) + ' / ' + measure(v.p95Ms) + ' (' + v.latencySamples + ')' +
        ' | ' + v.totalInputTokens + ' / ' + v.totalOutputTokens + ' (' +
        v.usageSamples + '/' + v.samples + ')' +
        ' | ' + v.traceFailures + ' | ' + v.hardGateFailures + ' | ' +
        v.payloadBytes + ' (' + v.traceSamples + ') |')
    }
  }
  lines.push('', '## Paired efficiency deltas', '',
    'Assisted minus baseline. Positive values mean the assisted condition used more latency or tokens. These are descriptive, not significance tests.', '',
    '| Suite | Median latency delta ms (paired n) | Median token delta (paired n) |',
    '| --- | --- | --- |')
  for (const [suite, value] of Object.entries(summary)) {
    lines.push('| ' + suite + ' | ' + measure(value.pairedMedianLatencyDeltaMs) +
      ' (' + value.pairedLatencySamples + ') | ' +
      measure(value.pairedMedianTokenDelta) + ' (' + value.pairedTokenSamples + ') |')
  }
  lines.push('', '## Interpretation and limits', '',
    '- A pass in routing is deterministic route accuracy; non-routing semantic quality needs an independent judge and evidence review.',
    '- Unverified and errored cases are never counted as successful. Review failed hard gates and tool traces before considering a release decision.',
    '- Compare different runs only when their fixture hash, model, judge, client setup and evaluation parameters are comparable.',
    '- This simulation does not prove behavior in native ChatGPT, Claude, Cursor, Codex or other clients.',
    '- No user data, private memory, or real write operations were used by the synthetic evaluation runner.', '')
  return lines.join('\n')
}

const mainFile = fileURLToPath(import.meta.url)
if (process.argv[1] && resolve(process.argv[1]) === mainFile) {
  const args = process.argv.slice(2)
  const reportPath = args[0]
  const outIndex = args.indexOf('--out')
  if (!reportPath || reportPath.startsWith('--') || (outIndex >= 0 && !args[outIndex + 1])) {
    console.error('Usage: node evals/report.mjs evals/results/RUN.json [--out docs/quality/RUN.md]')
    process.exitCode = 2
  } else {
    try {
      const input = JSON.parse(readFileSync(reportPath, 'utf8'))
      const content = renderEvaluationReport(input)
      if (outIndex >= 0) {
        writeFileSync(args[outIndex + 1], content, { flag: 'wx' })
        console.log('Wrote ' + args[outIndex + 1])
      } else console.log(content)
    } catch (error) {
      console.error('Evaluation report failed:', error.message)
      process.exitCode = 1
    }
  }
}
