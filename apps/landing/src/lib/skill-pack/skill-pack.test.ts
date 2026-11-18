import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, posix } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it, vi } from 'vitest'
import {
  ARTIFACT_KINDS,
  COMPOSITION_PROTOCOL,
  compositionCatalog,
  compositionPaths,
  SKILL_CONTRACTS,
  WORKFLOW_RECIPES,
} from './skill-composition'
import {
  DESIGN_REFERENCE_PATHS,
  DESIGN_SKILL_PATHS,
  DOCS_REFERENCE_PATHS,
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
} from './skill-pack'
import { executeGetSkillPack, executeListSkillPacks, registerSkillPackMcpTools } from './skill-pack.mcp'

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

  it('returns pack URLs from list_skill_packs', () => {
    const result = executeListSkillPacks()
    expect(result.isError).toBeUndefined()
    expect(JSON.parse(result.content[0]!.text)).toEqual({
      packs: listSkillPacks(),
      composition: compositionCatalog(),
    })
  })

  it('returns NOT_FOUND for an unknown pack name', async () => {
    const fetchFile = vi.fn<typeof fetch>()
    const result = await executeGetSkillPack('craft', fetchFile)
    expect(fetchFile).not.toHaveBeenCalled()
    expect(result.isError).toBe(true)
    expect(JSON.parse(result.content[0]!.text)).toEqual({ error: 'NOT_FOUND', name: 'craft' })
  })

  it('returns design and uiKit Markdown with existing raw URLs', async () => {
    const fetchFile = vi.fn<typeof fetch>(async () => new Response('# Skill content'))
    const result = await executeGetSkillPack('design', fetchFile)
    const body = JSON.parse(result.content[0]!.text) as {
      files: { rawUrl: string; content: string }[]
      uiKit: { rawUrl: string; content: string }[]
    }
    expect(result.isError).toBeUndefined()
    for (const file of [...body.files, ...body.uiKit]) {
      expect(file.rawUrl.startsWith(SKILL_PACK_RAW_BASE)).toBe(true)
      expect(file.content).toBe('# Skill content')
    }
  })
  it('returns reqs Markdown without uiKit', async () => {
    const fetchFile = vi.fn<typeof fetch>(async () => new Response('# Reqs'))
    const result = await executeGetSkillPack('reqs', fetchFile)
    expect(result.isError).toBeUndefined()
    expect(JSON.parse(result.content[0]!.text)).toEqual({
      name: 'reqs',
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
      const references = name === 'docs' ? DOCS_REFERENCE_PATHS : []
      expect(JSON.parse(result.content[0]!.text)).toEqual({
        name,
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
    expect(JSON.parse(result.content[0]!.text)).toEqual(getSkillPack('design'))
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
    expect(starterPaths('design')).toEqual(['skills/design/SKILL.md'])
    expect(starterPaths('reqs')).toEqual(['skills/reqs/SKILL.md', WORK_ARTIFACT_STANDARD])
    expect(starterPaths('task')).toEqual([
      'skills/task/SKILL.md',
      WORK_ARTIFACT_STANDARD,
      'skills/task/task-template.md',
    ])
  })

  it('loads only advertised starter content and can request a design dependency afterwards', async () => {
    const fetchFile = vi.fn<typeof fetch>(async () => new Response('# Starter'))
    const initial = await executeGetSkillPack('design', fetchFile, starterPaths('design'))
    expect(initial.isError).toBeUndefined()
    expect(fetchFile.mock.calls.map(call => call[0])).toEqual([skillPackRawUrl('skills/design/SKILL.md')])
    const next = await executeGetSkillPack('design', fetchFile, ['skills/dev/visual-ship.md'])
    expect(next.isError).toBeUndefined()
    expect(fetchFile.mock.calls.map(call => call[0])).toEqual([
      skillPackRawUrl('skills/design/SKILL.md'),
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
    }
    expect(SKILL_CONTRACTS.qa.produces).toContain('test-plan')
    expect(SKILL_CONTRACTS.qa.produces).toContain('test-report')
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
