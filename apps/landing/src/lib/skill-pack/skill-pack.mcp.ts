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
  'Use view: routing for ordinary discovery; it retains routing, starter paths, recipes and aliases but defers contracts to get_skill_pack. Use full only when all contracts are needed. If a skill is already known, skip discovery and call get_skill_pack with strategy: starter. Discover ai-kit workflows for relevant work requests, including engineering implementation, architecture, alignment, project integration, skill authoring, feature maps, DevOps and research, requirements, business decisions, documents, design, task and bug drafting, tracker updates, estimation, QA, communication, review and release. Infer intent in English or Vietnamese, including unaccented, colloquial and mixed-language requests. Select the smallest set using description, useWhen and avoidWhen; honor explicit user choices and native invocation rules of the client. nativeInvocation is the installed skill policy, not a slash-command requirement for conversational MCP. Use mcpSelection for conversational routing: intent permits ordinary relevant natural-language requests (including reqs, design and docs); explicit-intent requires a clearly requested special workflow/outcome or bounded authorized assignment, not a literal slash command. Neither selection mode grants write or execution authority. Legacy invocation metadata on engineering packs is retained for compatibility. Select one branch within reqs (discovery/lean PRD), task (standard/vertical slicing), track (inspect/update/triage), and use independent skills for align (combined session), align-loop (decision questioning), domain-modeling (glossary/ADR), arch (seam design), arch-refactor (assessment), collab (feature packet), dev (implementation), qa (functional verification), and e2e (automation harness). Use review for non-code artifacts and code-review for source changes. Legacy names resolve to canonical packs and explicitly select the branch in legacyWorkflows; request its starterPaths, including workflowPath. Do not run the default workflow branch or duplicate methodologies. A legacy alias never grants write authority. Publication and state mutations still require explicit authorization. Use the target project execution profile and actual available tools; do not require a local checkout merely to read a skill. For each selected pack request its starterPaths, excluding shared files already loaded for the same task when still applicable; mutable main is not a pinned revision, so refresh when freshness matters. Read contract.context from the selected pack and shared context guidance; reuse available context and resolve only material gaps; contract.knowledge hints are conditional. Memory means your own host agent memory and already available conversation or remembered context, not a memory system to access. contract.memory.recall means consider relevant context you already remember; capture means reflect on a durable lesson under your native host settings. Never discover, connect to, or call a memory service or connector because of these hints; never ask the user to enable memory. If no relevant native memory is available, continue normally. For materially useful guidance, selectively load docs/agents/memory-protocol.md from a selected pack. Verify historical claims against authoritative project evidence when needed for the task; native retention is controlled by the host, not AI Kit. For multi-skill work, inspect contract and composition metadata. Load the shared protocol from any selected pack and an applicable recipe from its hostPack, using exact paths. Related skills and recipe stages are optional; respect completion gates and never infer write authorization. Skip irrelevant packs. Calculate pack totals from packs.length or the returned packCount, never guess. source reports mutable main, not a pinned skill revision; server_info commit identifies the deployment only. No client-side HTTP GET is needed. If the user voluntarily gives AI Kit feedback, use prepare_feedback_issue to build a complete PUBLIC GitHub Issue draft. Present it for review, get explicit user approval, then invoke the separately connected GitHub create_issue action if authorized; otherwise offer the prefilled link from the tool. Never claim a created issue without GitHub confirmation. Do not ask for benchmark/logs or publish automatically.'

export const GET_SKILL_PACK_TOOL_DESCRIPTION =
  'Load one ai-kit skill pack by name. If the skill is already known, call this directly with strategy: starter; no prior catalog or client-side download is required. Packs include their workflow, templates and reference files. Returns { name, nativeInvocation, mcpSelection, contract, files: [{ path, rawUrl, content }] }. Honor nativeInvocation for installed skills and mcpSelection for conversational selection; natural-language intent suffices where relevant, including a clearly requested explicit-intent outcome. Skill retrieval itself grants no action authority. design exposes optional uiKit metadata, with content only for explicitly requested exact paths. Prefer paths from starterPaths in list_skill_packs. This loads the entry workflow and applicable standard/template, with remaining file paths returned as metadata. For a legacy name, follow requestedWorkflow.workflowPath; request requestedWorkflow.starterPaths if needed. Exact paths selection still applies; alias selection is not authorization. Memory hints refer only to your own host agent memory and already available context; they never request external memory tools or persistence. If nothing relevant is remembered, proceed normally. Read SKILL.md first; request only referenced files needed for the selected branch, batching related paths when useful. Use strategy: starter for the standard starter paths (including alias workflow), strategy: manifest or paths: [] for metadata only, and exact paths for selective reuse. Do not combine strategy with paths. Omitting both retains legacy core full-pack loading (without optional UI Kit content). Batch missing paths per pack in one call; do not reload files already available in this session unless stale. Recipes are optional: do not request a host pack only for an unnecessary recipe. source is mutable-main metadata, not an immutable file hash. Unregistered paths return INVALID_PATHS without fetching. Follow SKILL.md first and consult bundled templates and references only when needed. Only when the project already uses Polyms UI Kit or the user selects it, load matching optional bundled uiKit references. Never require Polyms UI Kit for core design work. Unknown names return NOT_FOUND; upstream fetch failures return FETCH_FAILED.'

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
