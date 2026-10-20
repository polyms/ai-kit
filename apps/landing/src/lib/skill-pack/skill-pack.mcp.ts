import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { getSkillPack, listSkillPacks } from './skill-pack'

const listSkillPacksInputSchema = {}

const getSkillPackInputSchema = {
  name: z.string().describe('Skill pack name: reqs or design'),
}

export const LIST_SKILL_PACKS_TOOL_DESCRIPTION = `List ai-kit skill packs published as GitHub raw URLs on the main branch.

Returns { packs: [{ name, skillRawUrl }] } for reqs and design. skillRawUrl points at skills/<name>/SKILL.md. HTTP GET that URL and read its frontmatter before choosing a pack. This tool does not return markdown bodies.`

export const GET_SKILL_PACK_TOOL_DESCRIPTION = `Get GitHub raw URLs for one ai-kit skill pack: reqs or design.

Returns { name, files: [{ path, rawUrl }] }. design also returns uiKit: the @polyms/ui-kit skill files. HTTP GET each rawUrl. Follow SKILL.md as the workflow and open a sibling file only when that skill points at it. When the design SKILL.md says to invoke /ui-kit, GET the uiKit URLs instead of asking the user to run a local skill. This tool does not return markdown bodies. An unknown name returns NOT_FOUND.`

type McpTextResult = {
  content: [{ type: 'text'; text: string }]
  isError?: boolean
}

export function executeListSkillPacks(): McpTextResult {
  return {
    content: [{ type: 'text', text: JSON.stringify({ packs: listSkillPacks() }, null, 2) }],
  }
}

export function executeGetSkillPack(name: string): McpTextResult {
  const pack = getSkillPack(name)
  if (!pack) {
    return {
      content: [{ type: 'text', text: JSON.stringify({ error: 'NOT_FOUND', name }) }],
      isError: true,
    }
  }
  return {
    content: [{ type: 'text', text: JSON.stringify(pack, null, 2) }],
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
