import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, posix } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it, vi } from 'vitest'
import {
  ARTIFACT_KINDS,
  COMPOSITION_PROTOCOL,
  MEMORY_PROTOCOL,
  CONTEXT_PROTOCOL,
  compositionCatalog,
  compositionPaths,
  SKILL_CONTRACTS,
  WORKFLOW_RECIPES,
} from './skill-composition'
import {
  DESIGN_REFERENCE_PATHS,
  DESIGN_SKILL_PATHS,
  getSkillPack,
  listSkillPacks,
  REQS_REFERENCE_PATHS,
  REQS_SKILL_PATHS,
  SKILL_PACK_RAW_BASE,
  type SkillPackName,
  skillPackRawUrl,
  starterPaths,
  UI_KIT_SKILL_PATHS,
  WORK_ARTIFACT_STANDARD,
  WORK_SKILL_PATHS,
  ENGINEERING_SKILL_PATHS,
  LEGACY_SKILL_ALIASES,
  WORK_REFERENCE_PATHS,
  PORTABLE_SKILL_STANDARD,
} from './skill-pack'
import { executeGetSkillPack, executeListSkillPacks, MCP_SKILL_SOURCE, registerSkillPackMcpTools } from './skill-pack.mcp'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '../../../../..')

function markdownPaths(dir: string): string[] {
  return readdirSync(join(repoRoot, dir))
    .filter(name => name.endsWith('.md'))
    .map(name => `${dir}/${name}`)
    .sort()
}

describe('skill pack manifest', () => {
  it('lists every markdown file in reqs, design, and ui-kit', () => {
    expect([...REQS_SKILL_PATHS].sort()).toEqual(markdownPaths('skills/reqs'))
    expect([...DESIGN_SKILL_PATHS].sort()).toEqual(markdownPaths('skills/design'))
    expect([...UI_KIT_SKILL_PATHS].sort()).toEqual(markdownPaths('.cursor/skills/ui-kit'))
  })

  it('builds raw URLs on refs/heads/main and does not embed file bodies', () => {
    const packs = listSkillPacks()
    expect(packs.map(pack => pack.name)).toEqual([
      'reqs',
      'design',
      'research',
      'business',
      'docs',
      'task',
      'bug',
      'track',
      'plan',
      'qa',
      'comms',
      'review',
      'release',
      'devops',
      'setup',
      'align',
      'arch',
      'dev',
      'craft',
      'build-feature-map',
    ])
    for (const pack of packs) {
      expect(pack.skillRawUrl).toBe(skillPackRawUrl(`skills/${pack.name}/SKILL.md`))
      expect(pack.description.length).toBeGreaterThan(0)
    }

    const reqs = getSkillPack('reqs')
    const design = getSkillPack('design')
    expect(reqs?.files.map(file => file.rawUrl)).toEqual(
      [...REQS_SKILL_PATHS, ...REQS_REFERENCE_PATHS, WORK_ARTIFACT_STANDARD, ...compositionPaths('reqs')].map(
        skillPackRawUrl
      )
    )
    expect(design && 'uiKit' in design ? design.uiKit.map(file => file.rawUrl) : []).toEqual(
      UI_KIT_SKILL_PATHS.map(skillPackRawUrl)
    )
    expect(JSON.stringify({ packs, reqs, design })).not.toMatch(/# Design|# Reqs/)
    expect(design?.files.map(file => file.path)).toEqual([
      ...DESIGN_SKILL_PATHS,
      ...DESIGN_REFERENCE_PATHS,
      ...compositionPaths('design'),
    ])
  })
})

describe('skill pack MCP tools', () => {
  it('registers list_skill_packs and get_skill_pack', () => {
    const registerTool = vi.fn()
    registerSkillPackMcpTools({ registerTool } as never)
    expect(registerTool.mock.calls.map(call => call[0])).toEqual(['list_skill_packs', 'get_skill_pack'])
  })

  it('exposes explicit mutable provenance and a derived pack count for everyday clients', () => {
    const response = JSON.parse(executeListSkillPacks().content[0]!.text)
    expect(response.packCount).toBe(response.packs.length)
    expect(response.source).toEqual({
      kind: 'mutable-branch', ref: 'refs/heads/main', immutable: false, revision: null,
    })
  })

  it('returns pack URLs from list_skill_packs', () => {
    const result = executeListSkillPacks()
    expect(result.isError).toBeUndefined()
    expect(JSON.parse(result.content[0]!.text)).toEqual({
      packs: listSkillPacks(),
      packCount: listSkillPacks().length,
      source: MCP_SKILL_SOURCE,
      composition: compositionCatalog(),
    })
  })

  it('returns NOT_FOUND for an unknown pack name', async () => {
    const fetchFile = vi.fn<typeof fetch>()
    const result = await executeGetSkillPack('unknown-skill', fetchFile)
    expect(fetchFile).not.toHaveBeenCalled()
    expect(result.isError).toBe(true)
    expect(JSON.parse(result.content[0]!.text)).toEqual({ error: 'NOT_FOUND', name: 'unknown-skill' })
  })

  it('returns design and uiKit Markdown with existing raw URLs', async () => {
    const fetchFile = vi.fn<typeof fetch>(async () => new Response('# Skill content'))
    const result = await executeGetSkillPack('design', fetchFile)
    const body = JSON.parse(result.content[0]!.text) as {
      files: { rawUrl: string; content: string }[]
      uiKit: { rawUrl: string; content: string }[]
    }
    expect(result.isError).toBeUndefined()
    for (const file of body.files) {
      expect(file.rawUrl.startsWith(SKILL_PACK_RAW_BASE)).toBe(true)
      expect(file.content).toBe('# Skill content')
    }
    for (const file of body.uiKit) {
      expect(file.rawUrl.startsWith(SKILL_PACK_RAW_BASE)).toBe(true)
      expect(file.content).toBeUndefined()
    }
    expect(fetchFile).toHaveBeenCalledTimes(body.files.length)
  })
  it('does not fetch optional Polyms UI Kit unless its exact path is requested', async () => {
    const fetchFile = vi.fn<typeof fetch>(async () => new Response('# Selected'))
    const meta = await executeGetSkillPack('design', fetchFile)
    const first = JSON.parse(meta.content[0]!.text).uiKit[0].path
    expect(fetchFile.mock.calls.map(call => call[0])).not.toContain(skillPackRawUrl(first))
    fetchFile.mockClear()
    const selected = await executeGetSkillPack('design', fetchFile, [first])
    const result = JSON.parse(selected.content[0]!.text)
    expect(result.uiKit.find((file: { path: string }) => file.path === first).content).toBe('# Selected')
    expect(fetchFile).toHaveBeenCalledTimes(1)
  })
  it('returns reqs Markdown without uiKit', async () => {
    const fetchFile = vi.fn<typeof fetch>(async () => new Response('# Reqs'))
    const result = await executeGetSkillPack('reqs', fetchFile)
    expect(result.isError).toBeUndefined()
    expect(JSON.parse(result.content[0]!.text)).toEqual({
      name: 'reqs',
      contract: SKILL_CONTRACTS.reqs,
      source: MCP_SKILL_SOURCE,
      files: [
        ...REQS_SKILL_PATHS,
        ...REQS_REFERENCE_PATHS,
        WORK_ARTIFACT_STANDARD,
        ...compositionPaths('reqs'),
      ].map(path => ({ path, rawUrl: skillPackRawUrl(path), content: '# Reqs' })),
    })
  })

  it('bundles every work skill with its templates and shared standard', async () => {
    const fetchFile = vi.fn<typeof fetch>(async () => new Response('# Work artifact'))
    for (const [name, paths] of Object.entries(WORK_SKILL_PATHS)) {
      expect([...paths].sort()).toEqual(markdownPaths(`skills/${name}`))
      const result = await executeGetSkillPack(name, fetchFile)
      expect(result.isError).toBeUndefined()
      const references = WORK_REFERENCE_PATHS[name as keyof typeof WORK_SKILL_PATHS] ?? []
      expect(JSON.parse(result.content[0]!.text)).toEqual({
        name,
        contract: SKILL_CONTRACTS[name as SkillPackName],
        source: MCP_SKILL_SOURCE,
        files: [
          ...paths,
          ...references,
          WORK_ARTIFACT_STANDARD,
          ...compositionPaths(name as SkillPackName),
        ].map(path => ({
          path,
          rawUrl: skillPackRawUrl(path),
          content: '# Work artifact',
        })),
      })
    }
  })

  it('returns a manifest without fetching when paths is empty', async () => {
    const fetchFile = vi.fn<typeof fetch>()
    const result = await executeGetSkillPack('design', fetchFile, [])
    expect(result.isError).toBeUndefined()
    expect(fetchFile).not.toHaveBeenCalled()
    expect(JSON.parse(result.content[0]!.text)).toEqual({ ...getSkillPack('design'), source: MCP_SKILL_SOURCE })
  })

  it('fetches only selected paths including uiKit and retains other metadata', async () => {
    const fetchFile = vi.fn<typeof fetch>(async () => new Response('# Selected'))
    const paths = [DESIGN_SKILL_PATHS[0], UI_KIT_SKILL_PATHS[0]]
    const result = await executeGetSkillPack('design', fetchFile, [...paths, paths[0]])
    expect(result.isError).toBeUndefined()
    expect(fetchFile).toHaveBeenCalledTimes(2)
    const body = JSON.parse(result.content[0]!.text)
    for (const file of [...body.files, ...body.uiKit]) {
      expect(file.content).toBe(paths.some(path => path === file.path) ? '# Selected' : undefined)
    }
  })

  it('rejects unregistered paths before any fetch', async () => {
    const fetchFile = vi.fn<typeof fetch>()
    const result = await executeGetSkillPack('task', fetchFile, [
      'skills/task/SKILL.md',
      'https://example.com/private',
    ])
    expect(result.isError).toBe(true)
    expect(fetchFile).not.toHaveBeenCalled()
    expect(JSON.parse(result.content[0]!.text)).toMatchObject({ error: 'INVALID_PATHS' })
  })

  it('rejects empty upstream content', async () => {
    const fetchFile = vi.fn<typeof fetch>(async () => new Response(' '))
    const result = await executeGetSkillPack('task', fetchFile)
    expect(result.isError).toBe(true)
    expect(JSON.parse(result.content[0]!.text)).toMatchObject({ error: 'FETCH_FAILED' })
  })

  it('returns FETCH_FAILED when upstream fails', async () => {
    const fetchFile = vi.fn<typeof fetch>(async () => new Response('', { status: 503 }))
    const result = await executeGetSkillPack('reqs', fetchFile)
    expect(result.isError).toBe(true)
    expect(JSON.parse(result.content[0]!.text)).toEqual({ error: 'FETCH_FAILED', name: 'reqs' })
  })
})

describe('consolidated engineering packs', () => {
  it('lists exactly the canonical native skill entries and resolves retired names without duplicate catalog entries', async () => {
    const names = listSkillPacks().map(pack => pack.name)
    expect(names).toHaveLength(20)
    const nativeNames = readdirSync(join(repoRoot, 'skills')).filter(name => existsSync(join(repoRoot, 'skills', name, 'SKILL.md'))).sort()
    expect([...names].sort()).toEqual(nativeNames)
    for (const [alias, canonical] of Object.entries(LEGACY_SKILL_ALIASES)) {
      expect(names).not.toContain(alias)
      expect(getSkillPack(alias)).toEqual(getSkillPack(canonical))
      const response = await executeGetSkillPack(alias, vi.fn<typeof fetch>(), [])
      expect(JSON.parse(response.content[0]!.text)).toMatchObject({ name: canonical, requestedName: alias })
    }
  })
})
describe('portable engineering packs', () => {
  it('delivers starter content and explicit invocation metadata for all engineering packs', async () => {
    const catalog = listSkillPacks()
    const manual = ['setup', 'craft', 'build-feature-map']
    for (const name of Object.keys(ENGINEERING_SKILL_PATHS)) {
      const summary = catalog.find(pack => pack.name === name)!
      expect(summary.invocation).toBe(manual.includes(name) ? 'explicit' : 'model')
      expect(summary.starterPaths).toContain(PORTABLE_SKILL_STANDARD)
      const fetchFile = vi.fn<typeof fetch>(async () => new Response('# Methodology'))
      const result = await executeGetSkillPack(name, fetchFile, summary.starterPaths)
      expect(result.isError).toBeUndefined()
      expect(JSON.parse(result.content[0]!.text).invocation).toBe(summary.invocation)
      expect(fetchFile.mock.calls.map(call => call[0]).sort()).toEqual(summary.starterPaths.map(skillPackRawUrl).sort())
    }
    expect(getSkillPack('review')?.files.map(file => file.path)).toContain('skills/review/standards-baseline.md')
    expect(getSkillPack('review')?.files.map(file => file.path)).toContain('skills/review/simplify-baseline.md')
    expect(starterPaths('setup')).toContain('skills/setup/execution-profile.md')
  })
})

describe('skill intelligence', () => {
  it('advertises valid minimal starter paths and known optional handoffs for every pack', () => {
    const catalog = listSkillPacks()
    const names = new Set(catalog.map(pack => pack.name))
    for (const summary of catalog) {
      const pack = getSkillPack(summary.name)!
      const files = [...pack.files, ...('uiKit' in pack ? pack.uiKit : [])]
      const allowed = new Set(files.map(file => file.path))
      expect(summary.useWhen.length).toBeGreaterThanOrEqual(2)
      expect(summary.avoidWhen.length).toBeGreaterThan(0)
      expect(summary.starterPaths[0]).toBe(`skills/${summary.name}/SKILL.md`)
      expect(new Set(summary.starterPaths).size).toBe(summary.starterPaths.length)
      expect(summary.starterPaths.every(path => allowed.has(path))).toBe(true)
      if (summary.name !== 'design') expect(summary.starterPaths).toContain(WORK_ARTIFACT_STANDARD)
      expect(summary.relatedSkills.every(name => name !== summary.name && names.has(name))).toBe(true)
    }
    expect(starterPaths('design')).toEqual(['skills/design/SKILL.md', CONTEXT_PROTOCOL])
    expect(starterPaths('reqs')).toEqual(['skills/reqs/SKILL.md', WORK_ARTIFACT_STANDARD, CONTEXT_PROTOCOL, PORTABLE_SKILL_STANDARD])
    expect(starterPaths('task')).toEqual([
      'skills/task/SKILL.md',
      WORK_ARTIFACT_STANDARD,
      CONTEXT_PROTOCOL,
      PORTABLE_SKILL_STANDARD,
      'skills/task/task-template.md',
    ])
  })

  it('loads only advertised starter content and can request a design dependency afterwards', async () => {
    const fetchFile = vi.fn<typeof fetch>(async () => new Response('# Starter'))
    const initial = await executeGetSkillPack('design', fetchFile, starterPaths('design'))
    expect(initial.isError).toBeUndefined()
    expect(fetchFile.mock.calls.map(call => call[0])).toEqual(starterPaths('design').map(skillPackRawUrl))
    const next = await executeGetSkillPack('design', fetchFile, ['skills/dev/visual-ship.md'])
    expect(next.isError).toBeUndefined()
    expect(fetchFile.mock.calls.map(call => call[0])).toEqual([
      ...starterPaths('design').map(skillPackRawUrl),
      skillPackRawUrl('skills/dev/visual-ship.md'),
    ])
  })

  it('keeps every registered file nonempty and resolves relative Markdown links inside each pack', () => {
    for (const summary of listSkillPacks()) {
      const pack = getSkillPack(summary.name)!
      const files = [...pack.files, ...('uiKit' in pack ? pack.uiKit : [])]
      const allowed = new Set(files.map(file => file.path))
      expect(allowed.size).toBe(files.length)
      for (const file of files) {
        const path = join(repoRoot, file.path)
        expect(existsSync(path), file.path).toBe(true)
        const body = readFileSync(path, 'utf8')
        expect(body.trim().length, file.path).toBeGreaterThan(0)
        // Relative markdown document links are bundled; external URLs and project context are not.
        for (const [, target] of body.matchAll(/\]\(([^)\s#]+\.md)(?:#[^)]*)?\)/g)) {
          if (/^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(target)) continue
          const resolved = posix.normalize(posix.join(posix.dirname(file.path), target))
          // These exact template links refer to files generated in the target project, not AI Kit references.
          if (file.path === 'skills/setup/context-format.md' && ['./src/ordering/CONTEXT.md', './src/billing/CONTEXT.md'].includes(target)) continue
          if (file.path === 'skills/build-feature-map/repo-skill-template.md' && target === 'references/features/README.md') continue
          if (file.path === 'skills/build-feature-map/index-template.md' && target === 'slug.md') continue
          // Shared policy documentation links are navigation, not workflow dependencies; resolve via the owning pack.
          if (['docs/agents/invocation.md', 'docs/agents/knowledge.md', 'docs/adr/0001-skill-setup-dependencies.md'].includes(file.path)) continue
          expect(allowed.has(resolved), `${summary.name}: ${file.path} -> ${resolved}`).toBe(true)
        }
      }
    }
  })

  it('keeps routing evaluation fixtures valid and covers every published pack', () => {
    const names = new Set(listSkillPacks().map(pack => pack.name))
    const cases = JSON.parse(
      readFileSync(join(repoRoot, 'evals/work-skills/routing-cases.json'), 'utf8')
    ) as {
      id: string
      prompt: string
      expected: SkillPackName[]
      avoid: SkillPackName[]
    }[]
    expect(new Set(cases.map(item => item.id)).size).toBe(cases.length)
    for (const item of cases) {
      expect(item.prompt.trim().length).toBeGreaterThan(0)
      expect(item.expected.every(name => names.has(name) && !item.avoid.includes(name))).toBe(true)
      expect(item.avoid.every(name => names.has(name))).toBe(true)
    }
    for (const name of names) expect(cases.some(item => item.expected.includes(name))).toBe(true)
    expect(cases.some(item => item.expected.length === 0)).toBe(true)
    expect(cases.some(item => item.expected.length > 1)).toBe(true)
  })
})

describe('skill composition', () => {
  it('publishes a meaningful bounded contract for every pack', () => {
    const kinds = new Set(ARTIFACT_KINDS)
    const catalog = listSkillPacks()
    expect(Object.keys(SKILL_CONTRACTS).sort()).toEqual(catalog.map(pack => pack.name).sort())
    for (const summary of catalog) {
      const contract = summary.contract
      expect(contract).toEqual(SKILL_CONTRACTS[summary.name])
      expect(contract.accepts.length).toBeGreaterThan(0)
      expect(contract.produces.length).toBeGreaterThan(0)
      expect(contract.readyWhen.trim().length).toBeGreaterThan(20)
      expect([...contract.accepts, ...contract.produces].every(kind => kinds.has(kind))).toBe(true)
      const pack = getSkillPack(summary.name)!
      expect(pack.files.some(file => file.path === COMPOSITION_PROTOCOL)).toBe(true)
      expect(summary.starterPaths).not.toContain(COMPOSITION_PROTOCOL)
      expect(summary.starterPaths).toContain(CONTEXT_PROTOCOL)
      expect(contract.context.some(item => item.importance === 'required')).toBe(true)
      expect(new Set(contract.context.map(item => item.key)).size).toBe(contract.context.length)
      for (const item of contract.context) {
        expect(item.key).toMatch(/^[a-z][a-z0-9-]*$/)
        expect(item.description.trim().length).toBeGreaterThan(0)
        expect(['required', 'recommended', 'optional']).toContain(item.importance)
      }
      expect(pack.contract).toEqual(contract)
      for (const hint of contract.knowledge ?? []) {
        expect(['incident', 'design', 'toolchain']).toContain(hint.intent)
        expect(hint.when.trim().length).toBeGreaterThan(0)
      }
    }
    expect(SKILL_CONTRACTS.qa.produces).toContain('test-plan')
    expect(SKILL_CONTRACTS.qa.produces).toContain('test-report')
  })

  it('keeps memory guidance optional and pilot hints conditional', () => {
    const pilots = ['bug', 'plan', 'qa', 'reqs', 'review']
    const catalog = listSkillPacks()
    expect(catalog.filter(pack => pack.contract.memory).map(pack => pack.name).sort()).toEqual(pilots)
    for (const summary of catalog) {
      expect(getSkillPack(summary.name)?.files.map(file => file.path)).toContain(MEMORY_PROTOCOL)
      expect(summary.starterPaths).not.toContain(MEMORY_PROTOCOL)
      const memory = summary.contract.memory
      if (!memory) continue
      for (const hints of [memory.recall ?? [], memory.capture ?? []]) {
        expect(hints.length).toBeGreaterThan(0)
        expect(new Set(hints.map(hint => hint.topic)).size).toBe(hints.length)
        for (const hint of hints) {
          expect(hint.topic).toMatch(/^[a-z][a-z0-9-]*$/)
          expect(hint.when.trim().length).toBeGreaterThan(0)
        }
      }
    }
  })

  it('loads the memory protocol selectively and preserves contract metadata', async () => {
    const fetchFile = vi.fn<typeof fetch>(async () => new Response('# Memory Protocol'))
    const result = await executeGetSkillPack('plan', fetchFile, [MEMORY_PROTOCOL])
    expect(result.isError).toBeUndefined()
    expect(fetchFile.mock.calls.map(call => call[0])).toEqual([skillPackRawUrl(MEMORY_PROTOCOL)])
    const body = JSON.parse(result.content[0]!.text)
    expect(body.contract.memory).toEqual(SKILL_CONTRACTS.plan.memory)
    expect(body.files.filter((file: { content?: string }) => file.content)).toHaveLength(1)
  })

  it('validates the manual memory evaluation fixtures', () => {
    const cases = JSON.parse(readFileSync(join(repoRoot, 'evals/memory/cases.json'), 'utf8')) as {
      id: string
      skills: SkillPackName[]
      prompt: string
      context: string
      expected: string
      forbidden: string
    }[]
    const names = new Set(listSkillPacks().map(pack => pack.name))
    expect(cases).toHaveLength(15)
    expect(new Set(cases.map(item => item.id)).size).toBe(cases.length)
    for (const item of cases) {
      expect(item.id).toMatch(/^MP-\d{2}$/)
      expect(item.skills.length).toBeGreaterThan(0)
      expect(item.skills.every(name => names.has(name))).toBe(true)
      for (const value of [item.prompt, item.context, item.expected, item.forbidden]) {
        expect(value.trim().length).toBeGreaterThan(0)
      }
    }
  })

  it('advertises five unique recipes with valid stages and allowlisted hosts', () => {
    const names = new Set(listSkillPacks().map(pack => pack.name))
    expect(WORKFLOW_RECIPES).toHaveLength(5)
    expect(new Set(WORKFLOW_RECIPES.map(recipe => recipe.id)).size).toBe(WORKFLOW_RECIPES.length)
    expect(new Set(WORKFLOW_RECIPES.map(recipe => recipe.path)).size).toBe(WORKFLOW_RECIPES.length)
    for (const recipe of WORKFLOW_RECIPES) {
      expect(names.has(recipe.hostPack)).toBe(true)
      expect(recipe.skills.length).toBeGreaterThan(1)
      expect(recipe.skills.every(name => names.has(name))).toBe(true)
      expect(recipe.skills).toContain(recipe.hostPack)
      expect(recipe.path).toBe(`workflows/${recipe.id}.md`)
      for (const name of names) {
        const pack = getSkillPack(name)!
        expect(pack.files.some(file => file.path === recipe.path)).toBe(name === recipe.hostPack)
        expect(starterPaths(name)).not.toContain(recipe.path)
      }
    }
  })

  it('selectively retrieves a composition protocol and recipe without loading other files', async () => {
    const recipe = WORKFLOW_RECIPES[0]!
    const fetchFile = vi.fn<typeof fetch>(async () => new Response('# Composition'))
    const selected = [COMPOSITION_PROTOCOL, recipe.path]
    const result = await executeGetSkillPack(recipe.hostPack, fetchFile, selected)
    expect(result.isError).toBeUndefined()
    expect(fetchFile.mock.calls.map(call => call[0])).toEqual(selected.map(skillPackRawUrl))
    const body = JSON.parse(result.content[0]!.text) as { files: { path: string; content?: string }[] }
    expect(body.files.filter(file => file.content !== undefined).map(file => file.path)).toEqual(selected)
    fetchFile.mockClear()
    const invalid = await executeGetSkillPack('design', fetchFile, [recipe.path])
    expect(invalid.isError).toBe(true)
    expect(fetchFile).not.toHaveBeenCalled()
  })

  it('protects setup, subagent and invocation from forcing a vendor UI library', () => {
    const setup = readFileSync(join(repoRoot, 'skills/setup/SKILL.md'), 'utf8')
    const setupDesign = readFileSync(join(repoRoot, 'skills/setup/design.md'), 'utf8')
    const designer = readFileSync(join(repoRoot, 'agents/designer.md'), 'utf8')
    const invocation = readFileSync(join(repoRoot, 'docs/agents/invocation.md'), 'utf8')
    const projectGuidance = readFileSync(join(repoRoot, 'AGENTS.md'), 'utf8')
    expect(setup).toMatch(/Detect and preserve/)
    expect(setup).toMatch(/no auto-install/)
    expect(setupDesign).toMatch(/record \*\*not selected\*\*/)
    expect(setupDesign).toMatch(/\*\*Suggest\*\* Polyms UI Kit/)
    expect(designer).toMatch(/existing project's design system/)
    expect(designer).toMatch(/never block a design/)
    expect(invocation).toMatch(/preserve the project's existing library/)
    expect(projectGuidance).toMatch(/optional.*candidate/)
    for (const content of [setup, setupDesign, designer, invocation, projectGuidance]) {
      expect(content).not.toMatch(/(?:must|require|before component mapping,? user invokes).{0,55}(?:@polyms\/ui-kit|\/ui-kit)/i)
    }
  })

  it('keeps design and dev independent of Polyms UI Kit', () => {
    const design = readFileSync(join(repoRoot, 'skills/design/SKILL.md'), 'utf8')
    const dev = readFileSync(join(repoRoot, 'skills/dev/SKILL.md'), 'utf8')
    const template = readFileSync(join(repoRoot, 'skills/design/design-spec-template.md'), 'utf8')
    const readme = readFileSync(join(repoRoot, 'README.md'), 'utf8')
    const collab = readFileSync(join(repoRoot, 'skills/dev/feature-preparation.md'), 'utf8')
    const redesign = readFileSync(join(repoRoot, 'skills/design/REDESIGN.md'), 'utf8')
    expect(design).toMatch(/vendor-neutral|existing design system/i)
    expect(design).toMatch(/optional Polyms products/)
    expect(dev).toMatch(/optional integration/)
    expect(template).toMatch(/optionally suggest Polyms UI Kit/)
    expect(readme).toMatch(/Optional Polyms integration/)
    expect(collab).toMatch(/optional/)
    expect(redesign).toMatch(/optional/)
    for (const content of [design, dev, template, collab, redesign]) {
      expect(content).not.toMatch(/must (?:install|invoke|use) .{0,40}(?:ui-kit|polyms\/ui-kit)/i)
    }
  })

  it('keeps everyday-mode authorization and minimal routing regression fixtures', () => {
    const routing = JSON.parse(readFileSync(join(repoRoot, 'evals/work-skills/routing-cases.json'), 'utf8'))
    const r = routing.find((item: { id: string }) => item.id === 'RT-39')
    expect(r.expected).toEqual(['plan', 'task', 'qa'])
    expect(r.avoid).toContain('reqs')
    const composition = JSON.parse(readFileSync(join(repoRoot, 'evals/composition/cases.json'), 'utf8'))
    const whole = composition.find((item: { id: string }) => item.id === 'CP-18')
    const security = composition.find((item: { id: string }) => item.id === 'CP-19')
    expect(whole.requiredSkills).toEqual(['plan', 'task', 'qa'])
    expect(whole.criteria.join(' ')).toMatch(/cross-team/)
    expect(whole.criteria.join(' ')).toMatch(/provenance|revision/)
    expect(security.requiredSkills).toEqual(['qa'])
    expect(security.criteria.join(' ')).toMatch(/forged-owner-role/)
    expect(security.criteria.join(' ')).toMatch(/Not run/)
    const optional = composition.find((item: { id: string }) => item.id === 'CP-21')
    expect(optional.requiredSkills).toEqual(['design'])
    expect(optional.criteria.join(' ')).toMatch(/optional candidate/)
    expect(optional.hardGates.join(' ')).toMatch(/automatically install or adopt/)
  })

  it('keeps composition fixtures valid, covering every recipe, single and custom routes', () => {
    const names = new Set(listSkillPacks().map(pack => pack.name))
    const recipes = new Set(WORKFLOW_RECIPES.map(recipe => recipe.id))
    const cases = JSON.parse(readFileSync(join(repoRoot, 'evals/composition/cases.json'), 'utf8')) as {
      id: string
      recipe: string | null
      prompt: string
      requiredSkills: SkillPackName[]
      skipSkills: SkillPackName[]
      criteria: string[]
      hardGates: string[]
    }[]
    expect(new Set(cases.map(item => item.id)).size).toBe(cases.length)
    for (const item of cases) {
      expect(item.recipe === null || recipes.has(item.recipe)).toBe(true)
      expect(item.prompt.trim().length).toBeGreaterThan(0)
      expect(item.requiredSkills.length).toBeGreaterThan(0)
      expect(item.requiredSkills.every(name => names.has(name) && !item.skipSkills.includes(name))).toBe(true)
      expect(item.skipSkills.every(name => names.has(name))).toBe(true)
      expect(item.criteria.length).toBeGreaterThan(0)
      expect(item.hardGates.length).toBeGreaterThan(0)
    }
    for (const id of recipes) expect(cases.some(item => item.recipe === id)).toBe(true)
    expect(cases.some(item => item.recipe === null && item.requiredSkills.length === 1)).toBe(true)
    expect(cases.some(item => item.recipe === null && item.requiredSkills.length > 1)).toBe(true)
  })
})
