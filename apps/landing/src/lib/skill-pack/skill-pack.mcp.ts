import type { McpServer } from '@modelcontextprotocol/server'
import { z } from 'zod'
import { compositionCatalog } from './skill-composition'
import { getSkillPack, listSkillPacks, legacyWorkflow, LEGACY_SKILL_ALIASES, starterPaths, type SkillPackFile } from './skill-pack'
import { executeGetReleaseInfo, RELEASE_INFO_INPUT_SCHEMA, RELEASE_INFO_TOOL_DESCRIPTION } from './release-info.mcp'

const listSkillPacksInputSchema = {
  view: z.enum(['routing', 'full']).optional()
    .describe('Use routing for skill selection; omit or use full for the legacy catalog with all contracts.'),
}

const getSkillPackInputSchema = {
  name: z.string().describe('Canonical skill pack name or legacy workflow alias'),
  strategy: z.enum(['starter', 'full', 'manifest']).optional()
    .describe('Use starter for a known skill without discovery; full is the legacy default; manifest fetches no content. Mutually exclusive with paths.'),
  paths: z
    .array(z.string())
    .optional()
    .describe('Exact manifest paths; [] for manifest. Omit both paths and strategy for legacy core loading. Optional UI Kit requires exact paths.'),
}

/** MCP Markdown is fetched from mutable main, not a pinned skill release. */
export const MCP_SKILL_SOURCE = {
  kind: 'mutable-branch',
  ref: 'refs/heads/main',
  immutable: false,
  revision: null,
} as const

export const LIST_SKILL_PACKS_TOOL_DESCRIPTION =
  'Discover AI Kit work and engineering skills in English or Vietnamese (including unaccented, colloquial and mixed-language intent). Use view: routing for ordinary discovery; full only if all contracts are needed. For a known single skill skip discovery and call get_skill_pack with strategy: starter. Select the smallest relevant set via description, useWhen and avoidWhen; honor explicit choices and nativeInvocation for installed clients. For conversational MCP, mcpSelection: intent permits ordinary natural-language requests; explicit-intent requires a clearly requested special outcome or bounded assignment, not slash syntax. Neither grants action authority. Keep reqs (discovery/lean PRD), task (standard/vertical slicing), track (inspect/update/triage) branches distinct. Use review for artifacts, code-review for code, qa for functional verification, e2e for automation; align, align-loop, domain-modeling, arch, arch-refactor, collab and dev remain distinct. Legacy names select the canonical branch via legacyWorkflows; load its starterPaths including workflowPath, not the default workflow. Request selected starterPaths minus still-applicable shared files already loaded; refresh if freshness matters. Read the selected pack contract; reuse available context, resolve material gaps, use Knowledge only when relevant. Memory means your own host agent memory and available context, not an external system; recall considers what you already remember, capture is optional native reflection. Never discover, connect to, or call a memory service or connector because of these hints; never ask to enable memory. If no relevant memory exists, continue normally. Verify historical facts against authoritative evidence when needed; native retention follows host settings. Load docs/agents/memory-protocol.md selectively via its exact manifest path. For composition, load the shared protocol from a selected pack and only the relevant recipe via its hostPack; related skills and recipe stages are optional. Use actual authorized tools and project execution profile; no checkout required for skill retrieval. Respect completion gates and explicit publication/state-change authorization. source is mutable main, not a pinned revision; server_info identifies deployment only. Use packCount or packs.length. No client-side HTTP GET. For voluntary AI Kit feedback, use prepare_feedback_issue for a PUBLIC GitHub draft; show it, get explicit approval, then use separately authorized GitHub create_issue or provide the prefilled link. Never claim creation without confirmation, request benchmarks/logs or publish automatically.'

export const GET_SKILL_PACK_TOOL_DESCRIPTION =
  'Load one AI Kit pack and its full contract; no prior catalog or client download required. For a known single skill use strategy: starter (entry, shared guidance and applicable template, including the alias workflow if selected). For relevant multi-skill composition, discover routing/recipe metadata if not already available. Use exact paths from starterPaths for selective reuse; batch missing references and avoid reloading still-applicable files. strategy: manifest or paths: [] returns metadata only. Omitting strategy and paths or strategy: full preserves legacy core loading. Never combine strategy and paths (INVALID_SELECTION). Read SKILL.md first, then needed templates/references. Returns files with path/rawUrl/content; unselected files have metadata only. For legacy names follow requestedWorkflow.workflowPath and starterPaths, not the default workflow. Honor nativeInvocation and conversational mcpSelection; a clearly requested special outcome suffices for explicit-intent, not a required slash command. Retrieval never authorizes external actions. Read contract.context, reuse available context, resolve only material gaps and use Knowledge only when relevant. Memory hints refer only to your own host agent memory and available context; never discover, connect to, or call a memory service or connector, or ask to enable memory. Recall considers existing memory; capture is optional native reflection under host settings. If no relevant memory exists, continue. Recipes are optional; do not load a host pack just for an unnecessary recipe. Optional design uiKit files are metadata-only unless requested by exact path and the project uses or user selects Polyms UI Kit; never require it. source is mutable main, not a pinned revision; refresh when freshness matters. Unregistered paths fail with INVALID_PATHS before fetch, unknown names NOT_FOUND, upstream failures FETCH_FAILED.'

type McpTextResult = {
  content: [{ type: 'text'; text: string }]
  isError?: boolean
}

type CatalogView = 'routing' | 'full'
type RetrievalStrategy = 'starter' | 'full' | 'manifest'

export function executeListSkillPacks(view: CatalogView = 'full'): McpTextResult {
  const packs = listSkillPacks()
  const selected = view === 'routing'
    ? packs.map(({ name, description, useWhen, avoidWhen, starterPaths: paths, relatedSkills, nativeInvocation, mcpSelection }) => ({
        name, description, useWhen, avoidWhen, starterPaths: paths, relatedSkills, nativeInvocation, mcpSelection,
      }))
    : packs
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          ...(view === 'routing' ? { view } : {}),
          packs: selected,
          packCount: packs.length,
          source: MCP_SKILL_SOURCE,
          composition: compositionCatalog(),
          legacyWorkflows: Object.keys(LEGACY_SKILL_ALIASES).map(name => legacyWorkflow(name)),
        }),
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
  paths?: string[],
  strategy?: RetrievalStrategy
): Promise<McpTextResult> {
  const pack = getSkillPack(name)
  const requestedWorkflow = legacyWorkflow(name)
  if (!pack) {
    return {
      content: [{ type: 'text', text: JSON.stringify({ error: 'NOT_FOUND', name }) }],
      isError: true,
    }
  }
  if (paths !== undefined && strategy !== undefined) {
    return {
      content: [{ type: 'text', text: JSON.stringify({ error: 'INVALID_SELECTION', name }) }],
      isError: true,
    }
  }
  const requestedPaths = strategy === 'starter'
    ? requestedWorkflow?.starterPaths ?? starterPaths(pack.name)
    : strategy === 'manifest' ? [] : paths
  const selected = requestedPaths === undefined ? undefined : new Set(requestedPaths)
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
      content: [{ type: 'text', text: JSON.stringify({ ...pack, ...(requestedWorkflow ? { requestedName: name, requestedWorkflow } : {}), source: MCP_SKILL_SOURCE, files, uiKit }) }],
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
    async ({ view }) => executeListSkillPacks(view)
  )

  server.registerTool(
    'get_skill_pack',
    {
      description: GET_SKILL_PACK_TOOL_DESCRIPTION,
      inputSchema: z.object(getSkillPackInputSchema),
    },
    async ({ name, paths, strategy }) => executeGetSkillPack(name, fetch, paths, strategy)
  )

  server.registerTool(
    'get_release_info',
    {
      description: RELEASE_INFO_TOOL_DESCRIPTION,
      inputSchema: RELEASE_INFO_INPUT_SCHEMA,
    },
    async ({ checkHttp, retiredVersion, expectedVersion }) =>
      executeGetReleaseInfo({ checkHttp, retiredVersion, expectedVersion })
  )
}
