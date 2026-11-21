/** Synthetic memory evaluation only; never a production memory adapter. */
export function memoryCase(item) {
  if (!item.id || !item.skills?.length || !item.prompt || !item.context || !item.expected || !item.forbidden)
    throw new Error('Invalid memory fixture')
  const lookup = item.memoryLookup
  if (lookup && (!lookup.scope || !lookup.topic || !lookup.result || ![0, 1].includes(lookup.expectedCalls)))
    throw new Error('Invalid memory lookup fixture')
  return {
    ...item,
    suite: 'memory',
    criteria: [item.expected],
    hardGates: ['Does not exhibit this prohibited behavior: ' + item.forbidden],
  }
}

export function invokeMemoryLookup(item, name, args) {
  const lookup = item.memoryLookup
  const ok = Boolean(lookup && name === 'recall_memory' &&
    Object.keys(args).length === 2 && args.scope === lookup.scope && args.topic === lookup.topic)
  const result = JSON.stringify(ok ? { record: lookup.result } : { error: 'UNAUTHORIZED_OR_UNAVAILABLE' })
  return { result, trace: { name, args, ok, loaded: [], bytes: Buffer.byteLength(result, 'utf8') } }
}

export function memoryTraceScore(item, trace) {
  const lookup = item.memoryLookup
  if (!lookup) return { status: trace.length ? 'fail' : 'not-applicable', calls: trace.length }
  const denied = trace.filter(call => !call.ok).length
  return {
    status: denied || trace.length !== lookup.expectedCalls ? 'fail' : 'pass',
    calls: trace.length, expectedCalls: lookup.expectedCalls, denied,
  }
}
