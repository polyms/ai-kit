import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { KnowledgeArticle, KnowledgeChunk } from '../src/lib/knowledge/knowledge.types'
import {
  APP_ROOT,
  assertNoForbiddenSeedLiterals,
  TAILWIND_CONFIG_FILE,
} from './seed-placeholders'

/** Repo root from `apps/{project}/prisma/` when seeding the kit site. */
export function defaultRepoRoot(): string {
  return join(dirname(fileURLToPath(import.meta.url)), '../../..')
}

function readRepoFile(repoRoot: string, relativePath: string): string {
  return readFileSync(join(repoRoot, relativePath), 'utf8').trimEnd()
}

/** KN-001 CMS body — repo settings with project-specific Tailwind path replaced by placeholder. */
export function vscodeSettingsForKn001(repoRoot: string = defaultRepoRoot()): string {
  const raw = readRepoFile(repoRoot, '.vscode/settings.json')
  return raw.replace(
    /"tailwindCSS\.experimental\.configFile":\s*"[^"]*"/,
    `"tailwindCSS.experimental.configFile": "${TAILWIND_CONFIG_FILE}"`
  )
}

type BiomeJson = {
  assist?: { includes?: string[] }
  javascript?: { globals?: string[]; [key: string]: unknown }
  [key: string]: unknown
}

/**
 * KN-001 biome.json — verbatim from repo root, sanitized for org-wide CMS:
 * - `apps/landing` → `apps/{project}` (keep kit biome.json untouched)
 * - drop kit-only `javascript.globals` injects
 */
export function biomeJsonForKn001(repoRoot: string = defaultRepoRoot()): string {
  const parsed = JSON.parse(readRepoFile(repoRoot, 'biome.json')) as BiomeJson
  if (parsed.assist?.includes) {
    parsed.assist.includes = parsed.assist.includes.map(entry =>
      entry.replaceAll('apps/landing', APP_ROOT)
    )
  }
  if (parsed.javascript && 'globals' in parsed.javascript) {
    delete parsed.javascript.globals
  }
  const body = JSON.stringify(parsed, null, 2)
  assertNoForbiddenSeedLiterals(body, 'KN-001 biome.json')
  return body
}

function packageJsonScriptsBlock(repoRoot: string): string {
  const pkg = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8')) as {
    scripts: Record<string, string>
    devDependencies: Record<string, string>
  }
  return JSON.stringify(
    {
      scripts: {
        lint: pkg.scripts.lint,
        'lint:fix': pkg.scripts['lint:fix'],
        format: pkg.scripts.format,
        'format:fix': pkg.scripts['format:fix'],
        check: pkg.scripts.check,
        'check:fix': pkg.scripts['check:fix'],
      },
      devDependencies: {
        '@biomejs/biome': pkg.devDependencies['@biomejs/biome'],
        prettier: pkg.devDependencies.prettier,
      },
    },
    null,
    2
  )
}

/** Reading order: checklist → rationale → config artifacts. */
const STATIC_CHUNKS: Omit<KnowledgeChunk, 'body'>[] = [
  {
    id: 'KN-001-checklist',
    slug: 'kn-001-checklist',
    intent: 'toolchain',
    chunkType: 'checklist',
    title: 'Setup checklist',
    axisTags: ['biome', 'prettier'],
    symptom: null,
    cause: [],
    fix: [],
    verify: [],
    triggerPhrases: ['biome prettier setup checklist'],
    artifactFilename: null,
    artifactType: null,
    checklistItems: [
      'Install devDependencies: @biomejs/biome@2.5.2, prettier@~3.9.4',
      'Copy biome.json, .prettierrc.yml, .prettierignore, .vscode/settings.json into the target repo root',
      'Wire package.json scripts: lint, format, check, check:fix',
      'Install editor extensions: biomejs.biome, esbenp.prettier-vscode',
      'Verify: pnpm check passes (biome check . && prettier -l .)',
      'Verify CI runs pnpm check on pull requests',
    ],
    parentChunkId: null,
    partIndex: null,
    sortOrder: 0,
  },
  {
    id: 'KN-001-rationale',
    slug: 'kn-001-rationale',
    intent: 'toolchain',
    chunkType: 'prose',
    title: 'Rationale',
    axisTags: ['biome', 'prettier'],
    symptom: null,
    cause: [],
    fix: [],
    verify: [],
    triggerPhrases: ['biome prettier split', 'dual formatter', 'which tool formats'],
    artifactFilename: null,
    artifactType: null,
    checklistItems: [],
    parentChunkId: null,
    partIndex: null,
    sortOrder: 1,
  },
  {
    id: 'KN-001-biome-json',
    slug: 'kn-001-biome-json',
    intent: 'toolchain',
    chunkType: 'config',
    title: 'biome.json',
    axisTags: ['biome'],
    symptom: null,
    cause: [],
    fix: [],
    verify: [],
    triggerPhrases: ['biome.json', 'biome config'],
    artifactFilename: 'biome.json',
    artifactType: 'config',
    checklistItems: [],
    parentChunkId: null,
    partIndex: null,
    sortOrder: 2,
  },
  {
    id: 'KN-001-prettierrc',
    slug: 'kn-001-prettierrc',
    intent: 'toolchain',
    chunkType: 'config',
    title: '.prettierrc.yml',
    axisTags: ['prettier'],
    symptom: null,
    cause: [],
    fix: [],
    verify: [],
    triggerPhrases: ['.prettierrc.yml', 'prettier config'],
    artifactFilename: '.prettierrc.yml',
    artifactType: 'config',
    checklistItems: [],
    parentChunkId: null,
    partIndex: null,
    sortOrder: 3,
  },
  {
    id: 'KN-001-prettierignore',
    slug: 'kn-001-prettierignore',
    intent: 'toolchain',
    chunkType: 'config',
    title: '.prettierignore',
    axisTags: ['prettier', 'biome'],
    symptom: null,
    cause: [],
    fix: [],
    verify: [],
    triggerPhrases: ['.prettierignore', 'prettier ignore biome files'],
    artifactFilename: '.prettierignore',
    artifactType: 'config',
    checklistItems: [],
    parentChunkId: null,
    partIndex: null,
    sortOrder: 4,
  },
  {
    id: 'KN-001-package-scripts',
    slug: 'kn-001-package-scripts',
    intent: 'toolchain',
    chunkType: 'config',
    title: 'package.json scripts',
    axisTags: ['biome', 'prettier'],
    symptom: null,
    cause: [],
    fix: [],
    verify: [],
    triggerPhrases: ['package.json lint format check scripts'],
    artifactFilename: 'package.json',
    artifactType: 'config',
    checklistItems: [],
    parentChunkId: null,
    partIndex: null,
    sortOrder: 5,
  },
  {
    id: 'KN-001-vscode-settings',
    slug: 'kn-001-vscode-settings',
    intent: 'toolchain',
    chunkType: 'config',
    title: 'VS Code settings',
    axisTags: ['biome', 'prettier'],
    symptom: null,
    cause: [],
    fix: [],
    verify: [],
    triggerPhrases: ['.vscode/settings.json', 'editor default formatter'],
    artifactFilename: '.vscode/settings.json',
    artifactType: 'config',
    checklistItems: [],
    parentChunkId: null,
    partIndex: null,
    sortOrder: 6,
  },
]

const RATIONALE_BODY = `Biome handles JS/TS/CSS/HTML/JSON/JSONC formatting and linting — one fast binary, no plugin ecosystem needed for these languages. Prettier handles MD/MDX/YAML — file types Biome does not format.

This is a deliberate split, not redundancy: each tool owns file extensions the other never touches. \`.prettierignore\` excludes every extension Biome owns (see the ignore-file chunk); Biome's \`files.includes\` only matches its own language set. Never let both tools claim the same file type.

Run \`check\` (\`biome check . && prettier --check .\`) in CI — read-only, never mutates. Run \`check:fix\` (or \`format:fix\`) locally before committing to auto-fix both tools' domains in one command.`

const CHECKLIST_BODY = 'Verify steps for applying the Biome + Prettier Polyms default to a target repo.'

const CHECKLIST_ITEMS = STATIC_CHUNKS.find(c => c.id === 'KN-001-checklist')?.checklistItems ?? []

/** Build KN-001 from repo-root config files sanitized for org-wide CMS (kit biome.json stays as-is). */
export function buildKN001(repoRoot: string = defaultRepoRoot()): KnowledgeArticle {
  const bodies: Record<string, string> = {
    'KN-001-rationale': RATIONALE_BODY,
    'KN-001-biome-json': biomeJsonForKn001(repoRoot),
    'KN-001-prettierrc': readRepoFile(repoRoot, '.prettierrc.yml'),
    'KN-001-prettierignore': readRepoFile(repoRoot, '.prettierignore'),
    'KN-001-package-scripts': packageJsonScriptsBlock(repoRoot),
    'KN-001-vscode-settings': vscodeSettingsForKn001(repoRoot),
    'KN-001-checklist': CHECKLIST_BODY,
  }

  return {
    id: 'KN-001',
    slug: 'biome-prettier-polyms-default',
    title: 'Biome + Prettier — Polyms default',
    summary:
      'Toolchain recipe for the Biome + Prettier dual-tool split: Biome owns JS/TS/CSS/HTML/JSON, Prettier owns MD/MDX/YAML.',
    intent: 'toolchain',
    axisTags: ['typescript', 'polyms-default', 'biome', 'prettier'],
    checklist: [...CHECKLIST_ITEMS],
    chunks: STATIC_CHUNKS.map(chunk => ({
      ...chunk,
      body: bodies[chunk.id] ?? '',
    })),
  }
}
