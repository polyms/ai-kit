export function parseObject(value) {
  const text = value.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  const parsed = JSON.parse(text)
  if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') throw new Error('Expected a JSON object')
  return parsed
}

export function scoreRoute(item, value, allowed) {
  const selected = parseObject(value).skills
  if (!Array.isArray(selected) || selected.some(name => typeof name !== 'string' || !allowed.includes(name))) throw new Error('Invalid selected skills')
  const unique = [...new Set(selected)]
  const missing = item.expected.filter(name => !unique.includes(name))
  const extra = unique.filter(name => !item.expected.includes(name))
  const avoided = unique.filter(name => item.avoid.includes(name))
  const duplicate = selected.length - unique.length
  const orderCorrect = !item.ordered || item.expected.every((name, index) => selected[index] === name)
  return { selected, missing, extra, avoided, duplicate, orderCorrect, status: !missing.length && !extra.length && !duplicate && orderCorrect ? 'pass' : 'fail' }
}

export function gradeOutput(item, value) {
  const parsed = parseObject(value)
  const expected = [...item.criteria, ...item.hardGates]
  const grades = parsed.grades
  if (!Array.isArray(grades) || grades.length !== expected.length) throw new Error('Wrong number of grades')
  for (let i = 0; i < expected.length; i++) {
    const grade = grades[i]
    if (grade.index !== i || !['pass','fail','unobservable'].includes(grade.status) || typeof grade.evidence !== 'string' || !grade.evidence.trim()) throw new Error('Invalid criterion grade')
  }
  const criteria = grades.slice(0, item.criteria.length)
  const hardGates = grades.slice(item.criteria.length)
  const count = values => ({ pass: values.filter(x => x.status === 'pass').length, fail: values.filter(x => x.status === 'fail').length, unobservable: values.filter(x => x.status === 'unobservable').length })
  const counts = count(criteria)
  const gates = count(hardGates)
  return { grades, criteria: counts, hardGates: gates, status: gates.fail || counts.fail ? 'fail' : gates.unobservable || counts.unobservable ? 'unverified' : 'pass' }
}

export function scoreTrace(item, trace, mode) {
  const selected = [...new Set(trace.filter(call => call.name === 'get_skill_pack' && call.ok && call.loaded?.length && call.loaded.includes('skills/' + call.args.name + '/SKILL.md')).map(call => call.args.name))]
  const allLoaded = trace.flatMap(call => call.loaded ?? [])
  const avoided = (item.skipSkills ?? []).filter(name => selected.includes(name))
  const missing = (item.requiredSkills ?? (item.skill ? [item.skill] : [])).filter(name => !selected.includes(name))
  const unexpected = item.requiredSkills ? selected.filter(name => !item.requiredSkills.includes(name)) : selected.filter(name => name !== item.skill)
  const fullLoads = trace.filter(call => call.name === 'get_skill_pack' && call.ok && call.args.paths === undefined).length
  const reloads = allLoaded.length - new Set(allLoaded).size
  const recipeLoads = allLoaded.filter(path => path.startsWith('workflows/'))
  const protocolLoads = allLoaded.filter(path => path === 'docs/agents/skill-composition.md').length
  const listCalls = trace.filter(call => call.name === 'list_skill_packs').length
  const singleCompositionLoad = item.requiredSkills?.length === 1 && (recipeLoads.length > 0 || protocolLoads > 0)
  const status = mode === 'baseline' ? 'not-applicable' : missing.length || avoided.length || singleCompositionLoad ? 'fail' : 'pass'
  return { selected, missing, avoided, unexpected, fullLoads, reloads, recipeLoads, protocolLoads, listCalls, status }
}

export function summarize(rows) {
  const result = {}
  for (const row of rows) {
    const key = row.suite + ':' + row.mode
    const group = result[key] ??= { runs:0, pass:0, fail:0, unverified:0, error:0, elapsedMs:0, usageReported:0, inputTokens:0, outputTokens:0, tracePass:0, traceFail:0, payloadBytes:0 }
    group.runs++
    group[row.status]++
    if (Number.isFinite(row.elapsedMs)) group.elapsedMs += row.elapsedMs
    if (row.usage) {
      group.usageReported++
      group.inputTokens += row.usage.inputTokens
      group.outputTokens += row.usage.outputTokens
    }
    if (row.traceScore?.status === 'pass') group.tracePass++
    if (row.traceScore?.status === 'fail') group.traceFail++
    group.payloadBytes += (row.trace ?? []).reduce((sum, call) => sum + (call.bytes ?? 0), 0)
  }
  return result
}
