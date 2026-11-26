import { describe, expect, it, vi } from 'vitest'
import metadata from './release-info.generated.json'
import { executeGetReleaseInfo } from './release-info.mcp'

const latest = metadata.latest
const revision = metadata.releases[latest as keyof typeof metadata.releases].revision
const packCount = metadata.releases[latest as keyof typeof metadata.releases].packCount
const catalog = { schemaVersion: 1, version: latest, revision, packs: Array.from({ length: packCount }, (_, i) => ({ name: String(i) })) }
const read = async (result: Awaited<ReturnType<typeof executeGetReleaseInfo>>) => JSON.parse(result.content[0].text)

function fakeFetch({ staleLatest = false, missingQa = false, blocked = false, unreachable = false } = {}) {
  return vi.fn<typeof fetch>(async (url, init) => {
    expect(new URL(String(url)).origin).toBe('https://ai-kit.polyms.dev')
    expect(init?.redirect).toBe('error')
    if (unreachable) throw new Error('NETWORK_UNAVAILABLE')
    if (blocked) return new Response(null, { status: 403 })
    const path = new URL(String(url)).pathname
    if (path === '/skill-bundles/latest.json') {
      return Response.json(staleLatest ? { ...catalog, version: '0.3.4' } : catalog)
    }
    if (path === '/skill-bundles/' + latest + '/catalog.json') return Response.json(catalog)
    if (path === '/skill-bundles/' + latest + '/qa/starter.json') {
      return Response.json({
        name: 'qa', version: latest, revision,
        files: [{ path: 'skills/qa/SKILL.md', content: missingQa ? '# QA' : '# QA\nAn assistant cannot self-approve.' }],
      })
    }
    if (path === '/api/skills') {
      const body = JSON.parse(String(init?.body))
      if (body.version === '0.3.4') return new Response(null, { status: 404 })
      expect(body).toEqual({
        name: 'qa', version: latest, paths: ['docs/agents/context-contract.md'],
      })
      return Response.json({
        name: 'qa', version: latest, revision,
        files: [{ path: 'docs/agents/context-contract.md',
          content: '# Feature lifecycle and environment-aware context\nNever substitute Dev evidence for Production',
        }],
      })
    }
    if (path === '/skill-bundles/0.3.4/catalog.json') return new Response(null, { status: 404 })
    return new Response(null, { status: 404 })
  })
}

describe('MCP get_release_info', () => {
  it('returns configured release metadata without any network request by default', async () => {
    const mock = fakeFetch()
    const result = await read(await executeGetReleaseInfo({}, mock))
    expect(mock).not.toHaveBeenCalled()
    expect(result.activeRelease).toEqual({ version: latest, revision, packCount })
    expect(result.releaseMetadataStatus).toBe('configured')
    expect(result.mcpSkillContent).toEqual({
      kind: 'mutable-branch', ref: 'refs/heads/main', pinned: false,
    })
    expect(result.httpVerification.status).toBe('not-run')
  })

  it('verifies public HTTP delivery and retired 404s using allowlisted requests', async () => {
    const mock = fakeFetch()
    const result = await read(await executeGetReleaseInfo({
      checkHttp: true, retiredVersion: '0.3.4',
    }, mock))
    expect(result.httpVerification.status).toBe('passed')
    expect(result.httpVerification.checks).toHaveLength(6)
    expect(result.httpVerification.checks.every((check: { status: string }) => check.status === 'passed')).toBe(true)
    expect(mock).toHaveBeenCalledTimes(6)
    expect(mock.mock.calls.map(call => new URL(String(call[0])).pathname)).not.toContain('/api/private')
  })

  it('marks mismatched or missing deployed content as failed', async () => {
    for (const options of [{ staleLatest: true }, { missingQa: true }]) {
      const result = await read(await executeGetReleaseInfo({ checkHttp: true }, fakeFetch(options)))
      expect(result.httpVerification.status).toBe('failed')
    }
  })

  it('labels access protection and network failures unverified rather than passed', async () => {
    for (const options of [{ blocked: true }, { unreachable: true }]) {
      const result = await read(await executeGetReleaseInfo({ checkHttp: true }, fakeFetch(options)))
      expect(result.httpVerification.status).toBe('unverified')
    }
  })

  it('rejects the active version as retired before network work', async () => {
    const mock = fakeFetch()
    const response = await executeGetReleaseInfo({ checkHttp: true, retiredVersion: latest }, mock)
    const result = await read(response)
    expect(response.isError).toBe(true)
    expect(result.error).toBe('INVALID_RETIRED_VERSION')
    expect(mock).not.toHaveBeenCalled()
  })
})
