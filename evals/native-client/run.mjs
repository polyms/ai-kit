import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { evaluateNativeCapture, renderNativeAudit } from './workflow-audit.mjs'

const args = process.argv.slice(2)
// pnpm may preserve the conventional argument separator before script args.
if (args[0] === '--') args.shift()
if (!args.length || args.includes('--help')) {
  console.log('Usage: node evals/native-client/run.mjs <capture.json> [more-captures.json] [--out report.md]')
  console.log('No network or model calls. Input is evaluation metadata only; redact sensitive references.')
  process.exit(args.includes('--help') ? 0 : 1)
}
const outIndex = args.indexOf('--out')
let out
if (outIndex !== -1) {
  if (!args[outIndex + 1] || outIndex !== args.length - 2)
    throw new Error('--out requires a final Markdown path')
  out = resolve(args[outIndex + 1])
  args.splice(outIndex, 2)
}
if (!args.length || args.some(a => a.startsWith('--'))) throw new Error('Provide capture JSON files')
const spec = JSON.parse(readFileSync(fileURLToPath(new URL('./team-invitation.case.json', import.meta.url)), 'utf8'))
const results = args.map(input => {
  const capture = JSON.parse(readFileSync(resolve(input), 'utf8'))
  return evaluateNativeCapture(spec, capture)
})
const text = renderNativeAudit(results)
if (out) {
  // Never silently replace previously reviewed evidence.
  writeFileSync(out, text + '\n', { flag: 'wx' })
  console.log('Wrote ' + out)
} else console.log(text)
