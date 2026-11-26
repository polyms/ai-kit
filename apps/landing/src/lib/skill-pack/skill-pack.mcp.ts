import type { McpServer } from '@modelcontextprotocol/server'
import { z } from 'zod'
import { compositionCatalog } from './skill-composition'
import { getSkillPack, listSkillPacks, type SkillPackFile } from './skill-pack'
import { executeGetReleaseInfo, RELEASE_INFO_INPUT_SCHEMA, RELEASE_INFO_TOOL_DESCRIPTION } from './release-info.mcp'

const listSkillPacksInputSchema = {}

const getSkillPackInputSchema = {
  name: z.string().describe('Skill pack name from list_skill_packs'),
  paths: z
    .array(z.string())
    .optional()
    .describe('Optional exact manifest paths to load. Omit for all core files (optional Polyms UI Kit remains metadata-only); [] for manifest.'),
}

/** MCP Markdown is fetched from mutable main, not a pinned skill release. */
export const MCP_SKILL_SOURCE = {
  kind: 'mutable-branch',
  ref: 'refs/heads/main',
  immutable: false,
  revision: null,
} as const

export const LIST_SKILL_PACKS_TOOL_DESCRIPTION =
  'Discover ai-kit workflows for relevant work requests, including research, requirements, business decisions, documents, design, task and bug drafting, tracker updates, estimation, QA, communication, review and release. Infer intent in English or Vietnamese, including unaccented, colloquial and mixed-language requests. Select the smallest set using description, useWhen and avoidWhen; explicit user or local client invocation rules take precedence. For each selected pack request its starterPaths, excluding shared files already loaded at the same revision in this conversation. Read contract.context and shared context guidance; reuse available context and resolve only material gaps; contract.knowledge and contract.memory hints are conditional, not required tool calls. When historical experience or reflection is materially useful, selectively load docs/agents/memory-protocol.md from a selected pack. Reuse supplied context and respect memory ownership; no memory access or persistence is implied. For multi-skill work, inspect contract and composition metadata. Load the shared protocol from any selected pack and an applicable recipe from its hostPack, using exact paths. Related skills and recipe stages are optional; respect completion gates and never infer write authorization. Skip irrelevant packs. Calculate pack totals from packs.length or the returned packCount, never guess. source reports mutable main, not a pinned skill revision; server_info commit identifies the deployment only. No client-side HTTP GET is needed. If the user voluntarily gives AI Kit feedback, use prepare_feedback_issue to build a complete PUBLIC GitHub Issue draft. Present it for review, get explicit user approval, then invoke the separately connected GitHub create_issue action if authorized; otherwise offer the prefilled link from the tool. Never claim a created issue without GitHub confirmation. Do not ask for benchmark/logs or publish automatically.'

export const GET_SKILL_PACK_TOOL_DESCRIPTION =
  'Load one ai-kit skill pack by name. Packs include their workflow, templates and reference files. Returns { name, contract, files: [{ path, rawUrl, content }] }. design exposes optional uiKit metadata, with content only for explicitly requested exact paths. Prefer paths from starterPaths in list_skill_packs. This loads the entry workflow and applicable standard/template, with remaining file paths returned as metadata. Read SKILL.md first; request only referenced files needed for the selected branch, batching related paths when useful. Use paths: [] for manifest-only discovery; omit paths for core full-pack loading (legacy compatible, without optional UI Kit content). Batch missing paths per pack in one call; do not reload files already available in this session unless stale. Recipes are optional: do not request a host pack only for an unnecessary recipe. source is mutable-main metadata, not an immutable file hash. Unregistered paths return INVALID_PATHS without fetching. Follow SKILL.md first and consult bundled templates and references only when needed. Only when the project already uses Polyms UI Kit or the user selects it, load matching optional bundled uiKit references. Never require Polyms UI Kit for core design work. Unknown names return NOT_FOUND; upstream fetch failures return FETCH_FAILED.'

type McpTextResult = {
  content: [{ type: 'text'; text: string }]
  isError?: boolean
}

export function executeListSkillPacks(): McpTextResult {
  const packs = listSkillPacks()
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ packs, packCount: packs.length, source: MCP_SKILL_SOURCE, composition: compositionCatalog() }, null, 2),
      },
    ],
  }
}

async function loadFiles(files: SkillPackFile[], fetchFile: typeof fetch, selected?: ReadonlySet<string>) {
  return Promise.all(
    files.map(async file => {
      if (selected && !selected.has(file.path)) return file
      const response = await fetchFile(file.rawUrl, { signal: AbortSignal.timeout(10_000) })
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${file.path}`)
      const content = await response.text()
      if (!content.trim()) throw new Error(`Empty file: ${file.path}`)
      return { ...file, content }
    })
  )
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
    const allowed = new Set(
      [...pack.files, ...(pack.name === 'design' ? pack.uiKit : [])].map(file => file.path)
    )
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
      pack.name === 'design' ? loadFiles(pack.uiKit, fetchFile, selected ?? new Set<string>()) : Promise.resolve(undefined),
    ])
    return {
      content: [{ type: 'text', text: JSON.stringify({ ...pack, source: MCP_SKILL_SOURCE, files, uiKit }, null, 2) }],
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
      inputSchema: z.object(listSkillPacksInputSchema),
    },
    async () => executeListSkillPacks()
  )

  server.registerTool(
    'get_skill_pack',
    {
      description: GET_SKILL_PACK_TOOL_DESCRIPTION,
      inputSchema: z.object(getSkillPackInputSchema),
    },
    async ({ name, paths }) => executeGetSkillPack(name, fetch, paths)
  )

  server.registerTool(
    'get_release_info',
    {
      description: RELEASE_INFO_TOOL_DESCRIPTION,
      inputSchema: RELEASE_INFO_INPUT_SCHEMA,
    },
    async ({ checkHttp, retiredVersion }) => executeGetReleaseInfo({ checkHttp, retiredVersion })
  )
}
