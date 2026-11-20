import type { McpServer } from '@modelcontextprotocol/server'
import { z } from 'zod'
import { compositionCatalog } from './skill-composition'
import { getSkillPack, listSkillPacks, type SkillPackFile } from './skill-pack'

const listSkillPacksInputSchema = {}

const getSkillPackInputSchema = {
  name: z.string().describe('Skill pack name from list_skill_packs'),
  paths: z
    .array(z.string())
    .optional()
    .describe('Optional exact manifest paths to load. Omit for all content; empty array for manifest only.'),
}

export const LIST_SKILL_PACKS_TOOL_DESCRIPTION =
  'Discover ai-kit workflows for relevant work requests, including research, requirements, business decisions, documents, design, task and bug drafting, tracker updates, estimation, QA, communication, review and release. Infer intent in English or Vietnamese, including unaccented, colloquial and mixed-language requests. Select the smallest set using description, useWhen and avoidWhen; explicit user or local client invocation rules take precedence. For each selected pack request its starterPaths, excluding shared files already loaded at the same revision in this conversation. Read contract.context and shared context guidance; reuse available context and resolve only material gaps; contract.knowledge hints are conditional, not required tool calls. For multi-skill work, inspect contract and composition metadata. Load the shared protocol from any selected pack and an applicable recipe from its hostPack, using exact paths. Related skills and recipe stages are optional; respect completion gates and never infer write authorization. Skip irrelevant packs. No client-side HTTP GET is needed.'

export const GET_SKILL_PACK_TOOL_DESCRIPTION =
  'Load one ai-kit skill pack by name. Packs include their workflow, templates and reference files. Returns { name, contract, files: [{ path, rawUrl, content }] }. design also returns uiKit files with content. Prefer paths from starterPaths in list_skill_packs. This loads the entry workflow and applicable standard/template, with remaining file paths returned as metadata. Read SKILL.md first; request only referenced files needed for the selected branch, batching related paths when useful. Use paths: [] for manifest-only discovery; omit paths only for intentional full-pack loading (legacy compatible). Do not reload files already available in this session unless stale. Unregistered paths return INVALID_PATHS without fetching. Follow SKILL.md first and consult bundled templates and references only when needed. When design invokes /ui-kit, use the returned uiKit content. Unknown names return NOT_FOUND; upstream fetch failures return FETCH_FAILED.'

type McpTextResult = {
  content: [{ type: 'text'; text: string }]
  isError?: boolean
}

export function executeListSkillPacks(): McpTextResult {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ packs: listSkillPacks(), composition: compositionCatalog() }, null, 2),
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
}
