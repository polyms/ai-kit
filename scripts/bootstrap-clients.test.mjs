import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..')

test('checkout includes the compatibility guide and production MCP configurations advertised by the site', () => {
  assert.ok(existsSync(join(repo, 'docs/agents/client-compatibility.md')))
  const codex = readFileSync(join(repo, '.codex/config.toml'), 'utf8')
  assert.match(codex, /\[mcp_servers\.aikit\]/)
  assert.match(codex, /url\s*=\s*"https:\/\/ai-kit\.polyms\.dev\/mcp"/)
  const vscode = JSON.parse(readFileSync(join(repo, '.vscode/mcp.json'), 'utf8'))
  assert.equal(vscode.servers.aikit.type, 'http')
  assert.equal(vscode.servers.aikit.url, 'https://ai-kit.polyms.dev/mcp')
})

function fixture(t) {
  const home = mkdtempSync(join(tmpdir(), 'ai-kit-codex-'))
  t.after(() => rmSync(home, { recursive: true, force: true }))
  const codexHome = join(home, 'custom-codex')
  const run = (target = 'codex') =>
    spawnSync('bash', [join(repo, 'bootstrap.sh'), target], {
      cwd: tmpdir(),
      encoding: 'utf8',
      env: { ...process.env, HOME: home, CODEX_HOME: codexHome },
    })
  return { home, codexHome, run }
}

test('Codex target installs every skill and role, honors CODEX_HOME, and is idempotent', t => {
  const { home, codexHome, run } = fixture(t)
  let result = run()
  assert.equal(result.status, 0, result.stderr)
  const names = readdirSync(join(repo, 'skills')).filter(name =>
    existsSync(join(repo, 'skills', name, 'SKILL.md'))
  )
  for (const name of names) {
    assert.equal(readlinkSync(join(home, '.agents/skills', name)), join(repo, 'skills', name))
  }
  const roles = readdirSync(join(repo, 'agents')).filter(name => name.endsWith('.md'))
  assert.equal(readdirSync(join(codexHome, 'agents')).length, roles.length)
  for (const file of roles) {
    const toml = readFileSync(join(codexHome, 'agents', file.replace(/\.md$/, '.toml')), 'utf8')
    assert.ok(toml.includes(JSON.stringify(join(repo, 'agents', file)).slice(1, -1)))
    assert.ok(toml.includes('developer_instructions = '))
  }
  assert.equal(existsSync(join(home, '.cursor')), false)
  assert.equal(existsSync(join(home, '.claude')), false)
  result = run()
  assert.equal(result.status, 0, result.stderr)
  assert.equal(result.stdout.includes('Backup:'), false)
  assert.equal(result.stdout.includes('Installed:'), false)
})

test('installation preserves existing skill folders, role files, broken links, and previous backups', t => {
  const { home, codexHome, run } = fixture(t)
  const skills = join(home, '.agents/skills')
  mkdirSync(join(skills, 'dev'), { recursive: true })
  writeFileSync(join(skills, 'dev', 'personal.md'), 'keep')
  const backups = join(home, '.agents/ai-kit-backups/skills')
  mkdirSync(join(backups, 'dev.bak'), { recursive: true })
  symlinkSync('/missing/old-skill', join(skills, 'reqs'))
  mkdirSync(join(codexHome, 'agents'), { recursive: true })
  writeFileSync(join(codexHome, 'agents/pm.toml'), 'personal role')
  writeFileSync(join(skills, 'unrelated'), 'keep too')
  const result = run()
  assert.equal(result.status, 0, result.stderr)
  assert.equal(readFileSync(join(backups, 'dev.bak.1/personal.md'), 'utf8'), 'keep')
  assert.ok(lstatSync(join(backups, 'reqs.bak')).isSymbolicLink())
  assert.equal(readFileSync(join(codexHome, 'ai-kit-backups/agents/pm.toml.bak'), 'utf8'), 'personal role')
  assert.equal(
    readdirSync(skills).some(name => name.includes('.bak')),
    false
  )
  assert.equal(readFileSync(join(skills, 'unrelated'), 'utf8'), 'keep too')
})

test('unknown bootstrap targets fail before creating configuration', t => {
  const { home, run } = fixture(t)
  const result = run('unknown')
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /Usage:/)
  assert.deepEqual(readdirSync(home), [])
})

test('all target also preserves Cursor and Claude installation paths', t => {
  const { home, run } = fixture(t)
  const result = run('all')
  assert.equal(result.status, 0, result.stderr)
  assert.equal(readlinkSync(join(home, '.cursor/skills')), join(repo, 'skills'))
  assert.equal(readlinkSync(join(home, '.cursor/agents')), join(repo, 'agents'))
  assert.equal(readlinkSync(join(home, '.claude/skills/dev')), `${join(repo, 'skills/dev')}/`)
  assert.equal(readlinkSync(join(home, '.claude/agents/pm.md')), join(repo, 'agents/pm.md'))
  assert.ok(existsSync(join(home, '.copilot/agents/pm.agent.md')))
})

test('Copilot installs native role files and shared skills without changing other client installs', t => {
  const { home, codexHome, run } = fixture(t)
  for (const client of ['.cursor', '.claude', 'custom-codex']) {
    mkdirSync(join(home, client), { recursive: true })
    writeFileSync(join(home, client, 'keep'), 'existing configuration')
  }
  mkdirSync(join(home, '.copilot'), { recursive: true })
  writeFileSync(join(home, '.copilot/config.json'), '{"personal":true}')
  let result = run('copilot')
  assert.equal(result.status, 0, result.stderr)
  const roles = readdirSync(join(repo, 'agents')).filter(name => name.endsWith('.md'))
  for (const file of roles) {
    const name = file.slice(0, -3)
    const content = readFileSync(join(home, '.copilot/agents', `${name}.agent.md`), 'utf8')
    const header = parse(content.match(/^---\n([\s\S]*?)\n---/)[1])
    assert.equal(header.name, name)
    assert.equal(typeof header.description, 'string')
    assert.equal(header.tools, undefined)
    assert.equal(header.model, undefined)
    assert.ok(content.includes(join(repo, 'agents', file)))
    assert.ok(content.includes('client-compatibility.md'))
  }
  assert.equal(readlinkSync(join(home, '.agents/skills/dev')), join(repo, 'skills/dev'))
  for (const client of ['.cursor', '.claude', 'custom-codex']) {
    assert.deepEqual(readdirSync(join(home, client)), ['keep'])
  }
  assert.equal(existsSync(join(codexHome, 'agents')), false)
  assert.equal(readFileSync(join(home, '.copilot/config.json'), 'utf8'), '{"personal":true}')
  result = run('copilot')
  assert.equal(result.status, 0, result.stderr)
  assert.equal(result.stdout.includes('Backup:'), false)
})

test('Copilot preserves replaced role files outside discovery and keeps earlier backups', t => {
  const { home, run } = fixture(t)
  const agents = join(home, '.copilot/agents')
  const backups = join(home, '.copilot/ai-kit-backups/agents')
  mkdirSync(agents, { recursive: true })
  mkdirSync(backups, { recursive: true })
  writeFileSync(join(agents, 'pm.agent.md'), 'personal role')
  writeFileSync(join(backups, 'pm.agent.md.bak'), 'older backup')
  const result = run('copilot')
  assert.equal(result.status, 0, result.stderr)
  assert.equal(readFileSync(join(backups, 'pm.agent.md.bak'), 'utf8'), 'older backup')
  assert.equal(readFileSync(join(backups, 'pm.agent.md.bak.1'), 'utf8'), 'personal role')
  assert.equal(
    readdirSync(agents).some(name => name.includes('.bak')),
    false
  )
})

for (const client of ['cursor', 'claude']) {
  test(`${client} target does not install or change Codex/Copilot files`, t => {
    const { home, codexHome, run } = fixture(t)
    const result = run(client)
    assert.equal(result.status, 0, result.stderr)
    assert.equal(existsSync(join(home, '.agents')), false)
    assert.equal(existsSync(join(home, '.copilot')), false)
    assert.equal(existsSync(codexHome), false)
    if (client === 'cursor') {
      assert.equal(readlinkSync(join(home, '.cursor/rules')), join(repo, '.cursor/rules'))
      assert.equal(existsSync(join(home, '.claude')), false)
    } else {
      assert.equal(readlinkSync(join(home, '.claude/agents/pm.md')), join(repo, 'agents/pm.md'))
      assert.equal(existsSync(join(home, '.cursor')), false)
    }
  })
}

test('every manual-only skill has matching Codex policy while retaining legacy frontmatter', () => {
  for (const root of ['skills', '.agents/skills']) {
    // A skill-library checkout need not contain app-specific project skills.
    if (!existsSync(join(repo, root))) continue
    for (const name of readdirSync(join(repo, root))) {
      const directory = join(repo, root, name)
      const file = join(directory, 'SKILL.md')
      if (!existsSync(file)) continue
      const content = readFileSync(file, 'utf8')
      const header = parse(content.match(/^---\n([\s\S]*?)\n---/)[1])
      assert.equal(header.name, name)
      assert.match(header.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      assert.ok(header.description.length <= 1024, name)
      const metadataFile = join(directory, 'agents/openai.yaml')
      if (header['disable-model-invocation'] === true) {
        assert.equal(parse(readFileSync(metadataFile, 'utf8')).policy.allow_implicit_invocation, false, name)
      } else if (existsSync(metadataFile)) {
        assert.notEqual(
          parse(readFileSync(metadataFile, 'utf8')).policy?.allow_implicit_invocation,
          false,
          name
        )
      }
      if (root === 'skills') {
        assert.ok(content.includes('../../docs/agents/client-compatibility.md'), name)
      }
    }
  }
})
