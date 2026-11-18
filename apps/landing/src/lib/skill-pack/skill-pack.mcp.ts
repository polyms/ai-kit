import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { getSkillPack, listSkillPacks, type SkillPackFile } from './skill-pack'

const listSkillPacksInputSchema = {}

const getSkillPackInputSchema = {
  name: z.string().describe('Skill pack name: reqs or design'),
}

export const LIST_SKILL_PACKS_TOOL_DESCRIPTION = `List available ai-kit skill packs (reqs and design). Returns names and raw URLs. Call get_skill_pack to load the Markdown directly; no client-side HTTP GET is required.`

export const GET_SKILL_PACK_TOOL_DESCRIPTION = `Load one ai-kit skill pack: reqs or design. Returns { name, files: [{ path, rawUrl, content }] }. design also returns uiKit files with content. Follow SKILL.md first and consult sibling content only when referenced. When design invokes /ui-kit, use the returned uiKit content. Unknown names return NOT_FOUND; upstream fetch failures return FETCH_FAILED.`

type McpTextResult = {
  content: [{ type: 'text'; text: string }]
  isError?: boolean
}

export function executeListSkillPacks(): McpTextResult {
  return {
    content: [{ type: 'text', text: JSON.stringify({ packs: listSkillPacks() }, null, 2) }],
  }
}

async function loadFiles(files: SkillPackFile[], fetchFile: typeof fetch) {
  return Promise.all(files.map(async file => {
    const response = await fetchFile(file.rawUrl, { signal: AbortSignal.timeout(10_000) })
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${file.path}`)
    return { ...file, content: await response.text() }
  }))
}

export async function executeGetSkillPack(
  name: string,
  fetchFile: typeof fetch = fetch
): Promise<McpTextResult> {
  const pack = getSkillPack(name)
  if (!pack) {
    return {
      content: [{ type: 'text', text: JSON.stringify({ error: 'NOT_FOUND', name }) }],
      isError: true,
    }
  }
  try {
    const [files, uiKit] = await Promise.all([
      loadFiles(pack.files, fetchFile),
      pack.name === 'design' ? loadFiles(pack.uiKit, fetchFile) : Promise.resolve(undefined),
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
    async ({ name }) => executeGetSkillPack(name)
  )
}
