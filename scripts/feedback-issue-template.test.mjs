import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { parse } from 'yaml'

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8')
const form = parse(read('.github/ISSUE_TEMPLATE/feedback.yml'))
const url = 'https://github.com/polyms/ai-kit/issues/new?template=feedback.yml'

test('feedback GitHub Issue Form has essential fields and public consent', () => {
  assert.match(form.name, /AI Kit/)
  assert.ok(Array.isArray(form.body))
  const fields = Object.fromEntries(form.body.filter(item => item.id).map(item => [item.id, item]))
  assert.equal(fields.category.type, 'dropdown')
  assert.equal(fields.category.validations.required, true)
  assert.equal(fields.feedback.type, 'textarea')
  assert.equal(fields.feedback.validations.required, true)
  assert.equal(fields.privacy.type, 'checkboxes')
  assert.equal(fields.privacy.attributes.options[0].required, true)
  assert.equal(fields.client.validations, undefined)
  assert.equal(fields.example.validations, undefined)
  for (const id of ['category', 'feedback', 'client', 'skill', 'example']) {
    assert.ok(fields[id], 'GitHub Issue Form URL parameter missing field: ' + id)
  }
  const tool = read('apps/landing/src/lib/feedback/feedback.mcp.ts')
  assert.ok(tool.includes("url.searchParams.set('template', 'feedback.yml')"))
  assert.ok(tool.includes("url.searchParams.set('feedback', feedback)"))
  const options = fields.category.attributes.options
  for (const option of options) assert.ok(tool.includes(option), 'Unmapped issue form category: ' + option)
})
test('assistant-driven feedback and issue links hidden in landing footer', () => {
  assert.ok(read('README.md').includes('prepare_feedback_issue'))
  assert.ok(read('docs/feedback.md').includes('prepare_feedback_issue'))
  assert.ok(read('apps/landing/src/lib/mcp.server.ts').includes('registerFeedbackMcpTools'))
  const footer = read('apps/landing/src/components/home/HomeFooter.tsx')
  assert.equal(footer.includes('/issues/new'), false)
  assert.equal(footer.includes('${GITHUB_REPO}/issues'), false)
  assert.equal(footer.includes('footer_link_issues()'), false)
  assert.equal(footer.includes('footer_link_feedback()'), false)
})
