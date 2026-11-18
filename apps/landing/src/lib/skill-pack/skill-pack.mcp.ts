import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { getSkillPack, listSkillPacks, type SkillPackFile } from './skill-pack'

const listSkillPacksInputSchema = {}

const getSkillPackInputSchema = {
  name: z.string().describe('Skill pack name from list_skill_packs'),
  paths: z.array(z.string()).optional().describe('Optional exact manifest paths to load. Omit for all content; empty array for manifest only.'),
}

export const LIST_SKILL_PACKS_TOOL_DESCRIPTION = `List available ai-kit skill packs. Returns names, descriptions and raw URLs. Call get_skill_pack to load the Markdown directly; no client-side HTTP GET is required.`

export const GET_SKILL_PACK_TOOL_DESCRIPTION = `Load one ai-kit skill pack by name. Packs include their workflow, templates and reference files. Returns { name, files: [{ path, rawUrl, content }] }. design also returns uiKit files with content. For large packs use paths: [] to discover files without content, then request exact paths (e.g. skills/design/SKILL.md); unselected files remain metadata only. Omit paths to preserve full-pack behavior. Unregistered paths return INVALID_PATHS without fetching. Follow SKILL.md first and consult bundled templates and references only when needed. When design invokes /ui-kit, use the returned uiKit content. Unknown names return NOT_FOUND; upstream fetch failures return FETCH_FAILED.`

type McpTextResult = {
  content: [{ type: 'text'; text: string }]
  isError?: boolean
}

export function executeListSkillPacks(): McpTextResult {
  return {
    content: [{ type: 'text', text: JSON.stringify({ packs: listSkillPacks() }, null, 2) }],
  }
}

async function loadFiles(files: SkillPackFile[], fetchFile: typeof fetch, selected?: ReadonlySet<string>) {
  return Promise.all(files.map(async file => {
    if (selected && !selected.has(file.path)) return file
    const response = await fetchFile(file.rawUrl, { signal: AbortSignal.timeout(10_000) })
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${file.path}`)
    const content = await response.text()
    if (!content.trim()) throw new Error(`Empty file: ${file.path}`)
    return { ...file, content }
  }))
}

export async function executeGetSkillPack(
  name: string,
  fetchFile: typeof fetch = fetch,
  paths?: string[]
): Promise<McpTextResult> {
  const pack = getSkillPack(name)
  if (!pack) {
    return {
      content: [{ type: 'text', text: JSON.stringify({ error: 'NOT_FOUND', name }) }],
      isError: true,
    }
  }
  const selected = paths === undefined ? undefined : new Set(paths)
  if (selected) {
    const allowed = new Set([...pack.files, ...(pack.name === 'design' ? pack.uiKit : [])].map(file => file.path))
    const invalid = [...selected].filter(path => !allowed.has(path))
    if (invalid.length) {
      return {
        content: [{ type: 'text', text: JSON.stringify({ error: 'INVALID_PATHS', name, paths: invalid }) }],
        isError: true,
      }
    }
  }
  try {
    const [files, uiKit] = await Promise.all([
      loadFiles(pack.files, fetchFile, selected),
      pack.name === 'design' ? loadFiles(pack.uiKit, fetchFile, selected) : Promise.resolve(undefined),
    ])
    return {
      content: [{ type: 'text', text: JSON.stringify({ ...pack, files, uiKit }, null, 2) }],
    }
  } catch {
    return {
      content: [{ type: 'text', text: JSON.stringify({ error: 'FETCH_FAILED', name }) }],
      isError: true,
    }
  }
}

export function registerSkillPackMcpTools(server: McpServer): void {
  server.registerTool(
    'list_skill_packs',
    {
      description: LIST_SKILL_PACKS_TOOL_DESCRIPTION,
      inputSchema: listSkillPacksInputSchema,
    },
    async () => executeListSkillPacks()
  )

  server.registerTool(
    'get_skill_pack',
    {
      description: GET_SKILL_PACK_TOOL_DESCRIPTION,
      inputSchema: getSkillPackInputSchema,
    },
    async ({ name, paths }) => executeGetSkillPack(name, fetch, paths)
  )
}
