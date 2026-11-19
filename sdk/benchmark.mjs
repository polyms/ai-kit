import { performance } from 'node:perf_hooks'
import { createSkillProvider } from './dist/skill-provider.js'

const endpoint = process.argv[2] ?? 'https://ai-kit.polyms.dev'
const version = process.argv[3] ?? '0.3.1'
const count = Number(process.argv[4] ?? 20)
if (!Number.isInteger(count) || count < 2 || count > 100) throw new Error('Sample count must be 2–100')
if (version === 'latest') throw new Error('Pin a release for comparable timings')
let requests = 0
const create = () => createSkillProvider({
  endpoint, version,
  fetch: async (...args) => { requests++; return fetch(...args) },
})
async function measure(operation) {
  const samples = []
  const before = requests
  for (let i = 0; i < count; i++) {
    const t = performance.now()
    await operation()
    samples.push(performance.now() - t)
  }
  const sorted = [...samples].sort((a, b) => a - b)
  const percentile = p => Number(sorted[Math.ceil(p * count) - 1].toFixed(3))
  return { samples: count, p50Ms: percentile(.5), p95Ms: percentile(.95), requests: requests - before }
}
const cold = await measure(async () => create().getSkill('reqs'))
const provider = create()
await provider.preload(['reqs'])
const warm = await measure(async () => provider.getSkill('reqs'))
const path = 'skills/reqs/enterprise-prd-template.md'
const start = performance.now()
const beforeReference = requests
await provider.getSkill('reqs', { paths: [path] })
const reference = { ms: Number((performance.now() - start).toFixed(3)), requests: requests - beforeReference }
const warmReference = await measure(async () => provider.getSkill('reqs', { paths: [path] }))
console.log(JSON.stringify({
  endpoint, version, node: process.version, timestamp: new Date().toISOString(),
  cold, warm, reference, warmReference,
  note: 'Cold means empty SDK cache, not cold CDN or DNS. Timings include JSON parsing and cloning.',
}, null, 2))
if (cold.requests !== count || warm.requests !== 0 || reference.requests !== 1 || warmReference.requests !== 0) {
  process.exitCode = 1
}
