import { readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it, vi } from 'vitest'
import {
  DESIGN_SKILL_PATHS,
  getSkillPack,
  listSkillPacks,
  REQS_SKILL_PATHS,
  SKILL_PACK_RAW_BASE,
  skillPackRawUrl,
  UI_KIT_SKILL_PATHS,
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
    expect(packs).toEqual([
      { name: 'reqs', skillRawUrl: `${SKILL_PACK_RAW_BASE}skills/reqs/SKILL.md` },
      { name: 'design', skillRawUrl: `${SKILL_PACK_RAW_BASE}skills/design/SKILL.md` },
    ])

    const reqs = getSkillPack('reqs')
    const design = getSkillPack('design')
    expect(reqs?.files.map(file => file.rawUrl)).toEqual(REQS_SKILL_PATHS.map(skillPackRawUrl))
    expect(design && 'uiKit' in design ? design.uiKit.map(file => file.rawUrl) : []).toEqual(
      UI_KIT_SKILL_PATHS.map(skillPackRawUrl)
    )
    expect(JSON.stringify({ packs, reqs, design })).not.toMatch(/# Design|# Reqs/)
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
    expect(JSON.parse(result.content[0]!.text)).toEqual({ packs: listSkillPacks() })
  })

  it('returns NOT_FOUND for an unknown pack name', () => {
    const result = executeGetSkillPack('craft')
    expect(result.isError).toBe(true)
    expect(JSON.parse(result.content[0]!.text)).toEqual({ error: 'NOT_FOUND', name: 'craft' })
  })

  it('returns design files and uiKit URLs on refs/heads/main', () => {
    const result = executeGetSkillPack('design')
    const body = JSON.parse(result.content[0]!.text) as {
      files: { rawUrl: string }[]
      uiKit: { rawUrl: string }[]
    }
    expect(result.isError).toBeUndefined()
    for (const file of [...body.files, ...body.uiKit]) {
      expect(file.rawUrl.startsWith(SKILL_PACK_RAW_BASE)).toBe(true)
    }
  })
})
