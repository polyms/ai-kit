import { z } from 'zod'
import snapshot from './release-info.generated.json'

/** Deployment metadata is not a claim that public HTTP delivery has passed. */
export const RELEASE_INFO_INPUT_SCHEMA = z.object({
  checkHttp: z.boolean().optional().describe(
    'Opt-in live read-only HTTP checks against the fixed public AI Kit endpoint. Never checks Astra runtime.'
  ),
  retiredVersion: z.string().regex(/^\d+\.\d+\.\d+$/).optional().describe(
    'Optional retired release to check for HTTP 404; only used when checkHttp=true.'
  ),
})

export const RELEASE_INFO_TOOL_DESCRIPTION =
  'Report the active immutable HTTP skill release and its pinned revision from the deployed AI Kit build, separately from mutable-main MCP skill content. By default this reports configured metadata only, not a successful public HTTP check. Set checkHttp=true to verify live latest/pinned catalogs, QA content and an exact-path reference through the fixed public https://ai-kit.polyms.dev endpoint; optionally give retiredVersion such as 0.3.4 to confirm catalog/API routes return 404. Read-only, bounded and safe: no user-supplied URLs, credentials, private workspace access or business writes. HTTP failures distinguish FAILED from UNVERIFIED (network, protection or timeout). This does NOT establish the installed SDK version, Grok bot behavior or QA/PM approvals in Astra; request separate evidence from the actual consumer.'

type CheckStatus = 'passed' | 'failed' | 'unverified'
type Check = { name: string; status: CheckStatus; observed: string }

const publicOrigin = 'https://ai-kit.polyms.dev'
const publicBase = new URL(publicOrigin)
const contextPath = 'docs/agents/context-contract.md'

export async function executeGetReleaseInfo(
  input: { checkHttp?: boolean; retiredVersion?: string } = {},
  fetchImpl: typeof fetch = fetch
) {
  const latest = snapshot.latest
  const current = snapshot.releases[latest as keyof typeof snapshot.releases]
  const releases = Object.entries(snapshot.releases).map(([version, release]) => ({
    version,
    revision: release.revision,
    packCount: release.packCount,
  }))
  const base = {
    activeRelease: { version: latest, revision: current.revision, packCount: current.packCount },
    supportedReleases: releases,
    releaseMetadataStatus: 'configured',
    mcpSkillContent: { kind: 'mutable-branch', ref: 'refs/heads/main', pinned: false },
    publicEndpoint: publicOrigin,
    note: 'Configured immutable HTTP release is distinct from mutable MCP skill content. Use server_info separately for deployment commit; Astra SDK version needs consumer-side evidence.',
  }

  const version = input.retiredVersion
  if (version !== undefined && (!/^\d+\.\d+\.\d+$/.test(version) || version === latest)) {
    return { content: [{ type: 'text' as const, text: JSON.stringify({
      ...base, error: 'INVALID_RETIRED_VERSION',
    }) }], isError: true }
  }
  if (!input.checkHttp) {
    return { content: [{ type: 'text' as const, text: JSON.stringify({
      ...base, httpVerification: { status: 'not-run', reason: 'Set checkHttp=true for live read-only HTTP checks.' },
    }) }] }
  }

  async function check(
    name: string,
    path: string,
    expectStatus: number,
    validate?: (value: unknown) => boolean,
    init?: RequestInit
  ): Promise<Check> {
    let response: Response
    try {
      response = await fetchImpl(new URL(path, publicBase), {
        ...init,
        redirect: 'error',
        signal: AbortSignal.timeout(6000),
      })
    } catch {
      return { name, status: 'unverified', observed: 'HTTP request failed, timed out or was blocked' }
    }
    if (response.status === 401 || response.status === 403) {
      return { name, status: 'unverified', observed: 'HTTP access restricted (' + response.status + ')' }
    }
    if (response.status !== expectStatus) {
      return { name, status: 'failed', observed: 'HTTP ' + response.status + ', expected ' + expectStatus }
    }
    if (!validate) return { name, status: 'passed', observed: 'HTTP ' + response.status }
    try {
      const body: unknown = await response.json()
      return validate(body)
        ? { name, status: 'passed', observed: 'HTTP 200, identity and content match' }
        : { name, status: 'failed', observed: 'HTTP 200, release metadata or content mismatch' }
    } catch {
      return { name, status: 'failed', observed: 'HTTP 200, invalid JSON' }
    }
  }

  function catalogMatches(value: unknown): boolean {
    if (!value || typeof value !== 'object') return false
    const data = value as Record<string, unknown>
    return data.schemaVersion === 1 && data.version === latest &&
      data.revision === current.revision && Array.isArray(data.packs) &&
      data.packs.length === current.packCount
  }
  function qaMatches(value: unknown): boolean {
    if (!value || typeof value !== 'object') return false
    const data = value as Record<string, unknown>
    const files = data.files
    if (data.version !== latest || data.revision !== current.revision ||
        data.name !== 'qa' || !Array.isArray(files)) return false
    const qa = (files as Array<{ path?: string; content?: string }>).find(
      file => file.path === 'skills/qa/SKILL.md'
    )
    return !!qa?.content?.includes('cannot self-approve')
  }
  function contextMatches(value: unknown): boolean {
    if (!value || typeof value !== 'object') return false
    const data = value as Record<string, unknown>
    if (data.version !== latest || data.revision !== current.revision ||
        data.name !== 'qa' || !Array.isArray(data.files)) return false
    const content = (data.files as Array<{ path?: string; content?: string }>).find(
      file => file.path === contextPath
    )?.content
    return !!content?.includes('Feature lifecycle and environment-aware context') &&
      content.includes('Never substitute Dev evidence for Production')
  }
  const post = (releaseVersion: string): RequestInit => ({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: 'qa', version: releaseVersion, paths: [contextPath] }),
  })
  const checks: Promise<Check>[] = [
    check('latest-catalog', '/skill-bundles/latest.json', 200, catalogMatches),
    check('pinned-catalog', '/skill-bundles/' + latest + '/catalog.json', 200, catalogMatches),
    check('qa-starter', '/skill-bundles/' + latest + '/qa/starter.json', 200, qaMatches),
    check('exact-context', '/api/skills', 200, contextMatches, post(latest)),
  ]
  if (version) {
    checks.push(
      check('retired-catalog', '/skill-bundles/' + version + '/catalog.json', 404),
      check('retired-api', '/api/skills', 404, undefined, post(version))
    )
  }
  const results = await Promise.all(checks)
  const status: CheckStatus = results.some(item => item.status === 'failed') ? 'failed'
    : results.some(item => item.status === 'unverified') ? 'unverified' : 'passed'
  return { content: [{ type: 'text' as const, text: JSON.stringify({
    ...base,
    httpVerification: {
      status, checkedFrom: 'ai-kit-mcp-server', checks: results,
      scope: 'Public HTTP delivery only; not independent external vantage and not Astra SDK runtime.',
    },
  }) }] }
}
