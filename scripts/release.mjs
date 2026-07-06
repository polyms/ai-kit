#!/usr/bin/env zx
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { $, argv, chalk } from 'zx'

$.verbose = false

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkgPath = resolve(__dirname, '..', 'package.json')

const BUMPS = new Set(['patch', 'minor', 'major'])
const SEMVER_RE = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/

if (argv.help || argv.h) {
  printUsage()
  process.exit(0)
}

const arg = String(argv._[0] ?? 'patch')
if (arg === '--help' || arg === '-h') {
  printUsage()
  process.exit(0)
}

const pkg = JSON.parse(await readFile(pkgPath, 'utf8'))
const current = pkg.version
const next = computeNext(current, arg)
const tag = `v${next}`

console.log(chalk.cyan(`Current version: ${current}`))
console.log(chalk.green(`   Next version: ${next}  (tag: ${tag})`))

const existingTag = (await $`git tag --list ${tag}`.nothrow()).stdout.trim()
if (existingTag) {
  console.error(chalk.red(`\nTag ${tag} already exists. Aborting.`))
  process.exit(1)
}

pkg.version = next
await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)

await $`git add -- ${pkgPath}`
await $`git commit -m ${`chore(release): ${tag}`}`
await $`git tag -a ${tag} -m ${`Release ${tag}`}`

console.log(chalk.green(`\nDone. Committed package.json + tagged ${tag}.`))
console.log(chalk.gray('Other dirty files (if any) were left untouched.'))
console.log(chalk.gray('Push with:'))
console.log(chalk.bold('  git push --follow-tags'))

function printUsage() {
  console.log(`Usage: pnpm release [patch|minor|major|x.y.z]

Bump root package.json version, commit, and create annotated tag vX.Y.Z.
Default bump: patch. Only package.json is staged; other dirty files stay untouched.`)
}

function computeNext(version, input) {
  if (SEMVER_RE.test(input)) return input
  if (!BUMPS.has(input)) {
    throw new Error(`Unknown argument: "${input}". Use patch | minor | major | x.y.z`)
  }
  const [maj, min, pat] = version.split('.').map(n => Number.parseInt(n, 10))
  if (Number.isNaN(maj) || Number.isNaN(min) || Number.isNaN(pat)) {
    throw new Error(`Invalid current version in package.json: "${version}"`)
  }
  if (input === 'major') return `${maj + 1}.0.0`
  if (input === 'minor') return `${maj}.${min + 1}.0`
  return `${maj}.${min}.${pat + 1}`
}
