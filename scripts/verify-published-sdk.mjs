/**
 * Opt-in integration check: install the published SDK from the Polyms registry
 * into an empty project, then run the existing read-only release consumer probe.
 * This intentionally does not run in CI and is not an Astra runtime diagnostic.
 */
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { verifySdkConsumer } from './verify-sdk-consumer.mjs'

const registry = 'https://registry.polyms.dev/npm'
const endpoint = 'https://ai-kit.polyms.dev'
const packageName = '@polyms/ai-kit-sdk'
const candidate = JSON.parse(readFileSync(new URL('../sdk/package.json', import.meta.url), 'utf8'))
const release = JSON.parse(readFileSync(new URL('../registry/releases/0.3.5/release.json', import.meta.url), 'utf8'))

assert.equal(candidate.name, packageName)
assert.match(candidate.version, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/)
assert.match(release.version, /^\d+\.\d+\.\d+$/)
assert.match(release.revision, /^[0-9a-f]{40}$/)
if (Number(process.versions.node.split('.')[0]) < 24) {
  throw new Error('Published SDK verification requires Node.js 24 or later')
}

const root = mkdtempSync(join(tmpdir(), 'ai-kit-published-sdk-'))
try {
  // Do not inherit the user's npm config, auth token or workspace node_modules.
  const userconfig = join(root, '.npmrc')
  writeFileSync(userconfig, '')
  const globalconfig = join(root, '.npm-globalrc')
  writeFileSync(globalconfig, '')
  writeFileSync(join(root, 'package.json'), JSON.stringify({
    name: 'ai-kit-sdk-independent-check', private: true, type: 'module',
  }))
  execFileSync('npm', [
    'install', packageName + '@' + candidate.version,
    '--registry=' + registry,
    '--userconfig=' + userconfig,
    '--cache=' + join(root, '.npm-cache'),
    '--ignore-scripts', '--no-audit', '--no-fund', '--no-save',
  ], {
    cwd: root,
    encoding: 'utf8',
    timeout: 120_000,
    stdio: 'pipe',
    env: {
      // A separate HOME and minimal environment prevent accidental use of
      // personal npm auth, repository .npmrc, and custom npm config variables.
      PATH: process.env.PATH ?? '',
      HOME: root,
      USERPROFILE: root,
      CI: 'true',
      npm_config_userconfig: userconfig,
      npm_config_globalconfig: globalconfig,
      npm_config_registry: registry,
      npm_config_cache: join(root, '.npm-cache'),
    },
  })

  const installed = JSON.parse(readFileSync(
    join(root, 'node_modules', '@polyms', 'ai-kit-sdk', 'package.json'), 'utf8'))
  assert.equal(installed.name, packageName)
  assert.equal(installed.version, candidate.version, 'Registry did not resolve the exact candidate')
  // Bare import from a clean .mjs consumer is stronger than importing workspace dist.
  const consumer = join(root, 'consumer.mjs')
  writeFileSync(consumer,
    "export { createSkillProvider, extendSkill } from '@polyms/ai-kit-sdk'\n")
  const { createSkillProvider, extendSkill } = await import(pathToFileURL(consumer).href)
  const result = await verifySdkConsumer({
    endpoint, release, createProvider: createSkillProvider, extendSkill,
  })
  console.log(JSON.stringify({
    ...result,
    sdk: { name: installed.name, version: installed.version, source: 'published-polyms-registry' },
    registry, endpoint, node: process.version,
    evidence: 'Fresh install and public HTTP from this host, not Astra runtime',
  }, null, 2))
} catch (error) {
  // A failed external probe must not masquerade as a CI success or a proven SDK bug.
  console.error('Published SDK verification NOT PASSED:', error instanceof Error ? error.message : String(error))
  process.exitCode = 1
} finally {
  rmSync(root, { recursive: true, force: true })
}
