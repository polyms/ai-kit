import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * End-to-end wire protocol regression only. This is a deterministic MOCK,
 * not a quality evaluation, independent judge or external model request.
 */
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const temp = mkdtempSync(join(tmpdir(), 'ai-kit-eval-smoke-'))
const reportPath = join(temp, 'runner.json')
const markdownPath = join(temp, 'summary.md')
const generationModel = 'local-smoke-generation'
const judgeModel = 'local-smoke-judge'
const counters = { generation: 0, judge: 0, recalls: 0, responses: 0 }
const requests = []

const server = createServer(async (req, res) => {
  const reply = (status, body) => {
    res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify(body))
  }
  try {
    if (req.url !== '/v1/chat/completions' || req.method !== 'POST') {
      reply(404, { error: { message: 'Unknown endpoint' } })
      return
    }
    const chunks = []
    let length = 0
    for await (const chunk of req) {
      length += chunk.length
      if (length > 1_000_000) throw new Error('Request too large')
      chunks.push(chunk)
    }
    const body = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    assert.ok(Array.isArray(body.messages) && body.messages.length > 0)
    const usage = { prompt_tokens: 29, completion_tokens: 17, total_tokens: 46 }
    let message
    if (body.model === judgeModel) {
      counters.judge++
      const record = JSON.parse(body.messages.at(-1).content)
      assert.ok(Array.isArray(record.criteria) && record.criteria.length === 2)
      message = {
        role: 'assistant',
        content: JSON.stringify({
          grades: record.criteria.map((_, index) => ({
            index, status: 'pass',
            evidence: 'Synthetic protocol stub. This is NOT a real quality judgment.',
          })),
        }),
      }
    } else if (body.model === generationModel) {
      counters.generation++
      assert.ok(Array.isArray(body.tools) && body.tools.length === 1,
        'Memory fixture must expose the external memory trap')
      assert.equal(body.tools[0].function.name, 'recall_memory')
      assert.equal(body.messages.some(m => m.role === 'tool'), false)
      message = {
        role: 'assistant',
        content: 'Synthetic draft: estimate using bounded assumptions and uncertainty; draft tasks and QA cases from supplied requirements. No external memory access or publishing.',
      }
    } else throw new Error('Unexpected local model name')
    counters.responses++
    requests.push({ model: body.model, toolCalls: message.tool_calls?.length ?? 0 })
    reply(200, { id: 'mock-protocol-smoke', object: 'chat.completion',
      choices: [{ index: 0, finish_reason: message.tool_calls ? 'tool_calls' : 'stop', message }],
      usage })
  } catch (error) {
    reply(400, { error: { message: error instanceof Error ? error.message : 'Invalid mock request' } })
  }
})

function runCommand(command, args, env) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { cwd: root, env: { ...process.env, ...env },
      stdio: ['ignore', 'pipe', 'pipe'] })
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', data => { stdout += data.toString() })
    child.stderr.on('data', data => { stderr += data.toString() })
    const timeout = setTimeout(() => child.kill('SIGKILL'), 90_000)
    child.once('error', error => { clearTimeout(timeout); reject(error) })
    child.once('close', (code, signal) => {
      clearTimeout(timeout)
      if (code === 0) resolvePromise({ stdout, stderr })
      else reject(new Error(command + ' exited ' + code + ' (' + signal + ')\n' +
        stdout.slice(-3500) + '\n' + stderr.slice(-3500)))
    })
  })
}

try {
  await new Promise((resolveListen, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolveListen)
  })
  const address = server.address()
  assert.ok(address && typeof address !== 'string')
  const url = 'http://127.0.0.1:' + address.port + '/v1/chat/completions'
  await runCommand('pnpm', [
    'eval:run', '--suite', 'memory', '--case', 'MP-16', '--repeat', '1',
    '--model', generationModel, '--judge-model', judgeModel, '--out', reportPath,
  ], { EVAL_CHAT_URL: url, EVAL_API_KEY: '' })

  const report = JSON.parse(readFileSync(reportPath, 'utf8'))
  assert.equal(report.model, generationModel)
  assert.equal(report.judgeModel, judgeModel)
  assert.equal(report.plan.cases, 1)
  assert.equal(report.plan.pairedRuns, 1)
  assert.equal(report.rows.length, 2)
  assert.deepEqual(report.rows.map(row => row.mode), ['baseline', 'assisted'])
  for (const row of report.rows) {
    assert.equal(row.id, 'MP-16')
    assert.equal(row.status, 'pass')
    assert.equal(row.trace.length, 0)
    assert.equal(row.traceScore.status, 'pass')
    assert.equal(row.grade.hardGates.fail, 0)
    assert.ok(row.usage?.inputTokens > 0)
  }
  assert.equal(counters.generation, 2)
  assert.equal(counters.judge, 2)
  assert.equal(counters.recalls, 0)
  assert.equal(counters.responses, 4)
  assert.deepEqual(requests.map(r => r.toolCalls), [0, 0, 0, 0])
  await runCommand(process.execPath, [
    'evals/report.mjs', reportPath, '--out', markdownPath,
  ])
  const markdown = readFileSync(markdownPath, 'utf8')
  assert.match(markdown, /Complete pairs \| 1/)
  assert.match(markdown, /Missing or incomplete planned pairs \| 0/)
  assert.match(markdown, /memory/)
  console.log('PASS: localhost model protocol, zero external memory calls, judge and report CLI.')
  console.log('This was a MOCK smoke test, not a measured model-quality benchmark.')
} finally {
  await new Promise(resolveClose => server.close(resolveClose))
  rmSync(temp, { recursive: true, force: true })
}
