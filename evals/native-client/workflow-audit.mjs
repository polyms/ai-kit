import assert from 'node:assert/strict'

// Offline, client-neutral evidence scoring. This code never calls a model or an MCP server.
const gradeStates = new Set(['pass', 'fail', 'unverified'])
const traceSources = new Set(['host-export', 'model-report', 'none'])
const modes = new Set(['baseline', 'assisted'])
const safeIdentity = value => typeof value === 'string' && value.trim().length > 0

function totalStatus(values) {
  if (values.includes('fail')) return 'fail'
  if (values.includes('unverified')) return 'unverified'
  return 'pass'
}

function normalizeName(name) {
  if (name === 'list_skill_packs' || name.endsWith('__list_skill_packs')) return 'list_skill_packs'
  if (name === 'get_skill_pack' || name.endsWith('__get_skill_pack')) return 'get_skill_pack'
  return name
}

function readTrace(capture, spec) {
  const trace = capture.trace
  assert.ok(trace && traceSources.has(trace.source), 'Invalid trace provenance')
  assert.ok(typeof trace.complete === 'boolean', 'Trace completeness must be explicit')
  assert.ok(Array.isArray(trace.calls), 'Missing trace calls array')
  if (trace.source === 'none') assert.equal(trace.calls.length, 0, 'No-trace record cannot have calls')
  const calls = trace.calls.map(call => {
    assert.ok(call && safeIdentity(call.name), 'Missing tool call name')
    assert.ok(call.args === undefined || (call.args && typeof call.args === 'object' && !Array.isArray(call.args)), 'Invalid call arguments')
    assert.ok(call.ok === undefined || typeof call.ok === 'boolean', 'Invalid call outcome')
    assert.ok(call.loaded === undefined || (Array.isArray(call.loaded) && call.loaded.every(safeIdentity)), 'Invalid loaded paths')
    assert.ok(call.bytes === undefined || (Number.isSafeInteger(call.bytes) && call.bytes >= 0), 'Invalid response bytes')
    return { ...call, name: normalizeName(call.name) }
  })
  const listCalls = calls.filter(call => call.name === 'list_skill_packs').length
  const gets = calls.filter(call => call.name === 'get_skill_pack')
  const hasAllLoadEvidence = gets.every(call => call.ok !== undefined && Array.isArray(call.loaded))
  const loaded = gets.flatMap(call => call.ok ? call.loaded ?? [] : [])
  const selected = [...new Set(gets.filter(call => call.ok && call.loaded?.includes('skills/' + call.args?.name + '/SKILL.md')).map(call => call.args.name))]
  const missing = spec.requiredSkills.filter(name => !selected.includes(name))
  const extra = selected.filter(name => !spec.requiredSkills.includes(name))
  const skipped = selected.filter(name => spec.avoidSkills.includes(name))
  const repeatedPaths = loaded.filter((path, i) => loaded.indexOf(path) !== i)
  const fullLoads = gets.filter(call => call.ok && !Object.hasOwn(call.args ?? {}, 'paths')).length
  const allByteValuesKnown = calls.every(call => Number.isSafeInteger(call.bytes) && call.bytes >= 0)
  const report = {
    provenance: trace.source,
    complete: trace.complete,
    callCount: calls.length,
    listCalls,
    getCalls: gets.length,
    selected,
    missing,
    extra,
    skipped,
    fullLoads,
    repeatedPaths: [...new Set(repeatedPaths)],
    responseBytes: allByteValuesKnown && trace.source === 'host-export' && trace.complete
      ? calls.reduce((n, call) => n + call.bytes, 0) : null,
    routeStatus: 'unverified',
    retrievalStatus: 'unverified',
  }
  if (capture.mode === 'baseline') {
    report.routeStatus = trace.source === 'host-export' && trace.complete
      ? (gets.length ? 'fail' : 'not-applicable') : 'not-applicable'
    report.retrievalStatus = 'not-applicable'
  } else if (trace.source === 'host-export' && trace.complete && hasAllLoadEvidence) {
    report.routeStatus = missing.length || extra.length || skipped.length ? 'fail' : 'pass'
    report.retrievalStatus = listCalls > 1 || fullLoads > 0 || repeatedPaths.length > 0
      ? 'fail' : 'pass'
  }
  return report
}

export function evaluateNativeCapture(spec, capture) {
  assert.equal(spec.schemaVersion, 1, 'Unsupported case schema')
  assert.equal(capture?.schemaVersion, 1, 'Unsupported capture schema')
  assert.equal(capture.caseId, spec.id, 'Wrong evaluation case')
  assert.equal(capture.promptId, spec.promptId, 'Prompt fixture mismatch')
  for (const field of ['client', 'configuration', 'runId', 'artifactRef']) {
    assert.ok(safeIdentity(capture[field]), 'Missing ' + field)
  }
  assert.ok(modes.has(capture.mode), 'Unknown evaluation mode')
  assert.ok(['user-confirmed', 'host-record', 'unknown'].includes(capture.promptProvenance), 'Missing prompt provenance')
  const allIds = Object.values(spec.criteria).flatMap(items => items.map(item => item.id))
  assert.equal(new Set(allIds).size, allIds.length, 'Duplicate criterion ID in case')
  const authored = capture.grades ?? {}
  assert.ok(authored && typeof authored === 'object' && !Array.isArray(authored), 'Invalid manual grades')
  for (const id of Object.keys(authored)) assert.ok(allIds.includes(id), 'Unknown criterion: ' + id)
  const dimensions = {}
  for (const [dimension, items] of Object.entries(spec.criteria)) {
    const grades = items.map(item => {
      const supplied = authored[item.id] ?? { status: 'unverified', evidence: '' }
      assert.ok(gradeStates.has(supplied.status), 'Invalid grade for ' + item.id)
      if (supplied.status !== 'unverified') assert.ok(safeIdentity(supplied.evidence), 'Missing reviewed evidence for ' + item.id)
      return { id: item.id, status: supplied.status, evidence: supplied.evidence ?? '' }
    })
    dimensions[dimension] = {
      status: totalStatus(grades.map(grade => grade.status)),
      grades,
      pass: grades.filter(grade => grade.status === 'pass').length,
      fail: grades.filter(grade => grade.status === 'fail').length,
      unverified: grades.filter(grade => grade.status === 'unverified').length,
    }
  }
  const trace = readTrace(capture, spec)
  return {
    identity: { caseId: capture.caseId, client: capture.client, configuration: capture.configuration,
      mode: capture.mode, runId: capture.runId, artifactRef: capture.artifactRef,
      promptId: capture.promptId, promptProvenance: capture.promptProvenance },
    dimensions, trace,
    // A human-reviewed rubric pass is not independent proof of model reasoning quality.
    status: totalStatus(Object.values(dimensions).map(value => value.status)
      .concat(capture.mode === 'assisted' ? [trace.routeStatus, trace.retrievalStatus] : [])),
  }
}

const cell = value => String(value ?? 'n/a').replaceAll('|', '\\|').replaceAll('\n', ' ')
export function renderNativeAudit(results) {
  const lines = [
    '# AI Kit native-client workflow audit', '',
    '> Offline evidence summary. Manual criterion grades are reviewer attestations, not independent runtime checks. Model-reported tool calls NEVER receive a verified route or retrieval pass.', '',
    '| Client | Configuration | Arm | Prompt evidence | Workflow | Template | Governance | Route | Retrieval |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ]
  for (const result of results) {
    const x = result.identity
    const d = result.dimensions
    lines.push('| ' + [cell(x.client), cell(x.configuration), x.mode, x.promptProvenance,
      d.workflow.status, d.template.status, d.governance.status,
      result.trace.routeStatus, result.trace.retrievalStatus].join(' | ') + ' |')
  }
  lines.push('', '## Evidence and overhead', '',
    '| Client / run | Trace source | Calls | Catalog calls | Loaded packs | Full pack calls | Repeated paths | Response bytes |',
    '| --- | --- | ---: | ---: | --- | ---: | ---: | ---: |')
  for (const r of results) {
    const t = r.trace
    lines.push('| ' + [cell(r.identity.client + ' / ' + r.identity.runId), t.provenance,
      t.provenance === 'none' ? 'n/a' : String(t.callCount),
      t.provenance === 'none' ? 'n/a' : String(t.listCalls),
      t.provenance === 'none' ? 'unverified' : cell(t.selected.join(', ') || 'none observed'),
      t.provenance === 'none' ? 'n/a' : String(t.fullLoads),
      t.provenance === 'none' ? 'n/a' : String(t.repeatedPaths.length),
      t.responseBytes ?? 'unverified'].join(' | ') + ' |')
  }
  lines.push('', '## Limits', '',
    '- Client and configuration names are descriptive, not claims of integration certification.',
    '- A prompt identified by a fixture ID may be user-confirmed without a trusted client-side transcript.',
    '- A self-reported call list can show what was claimed, but cannot verify actual tool use, reloads, bytes or time.',
    '- This audit measures workflow/template/process support. It does not measure or improve model intelligence.',
    '- Missing rubric evidence is unverified, not a pass. No external mutation, QA execution or live model request occurs in this validator.', '')
  return lines.join('\n')
}
