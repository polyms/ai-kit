import { describe, expect, it } from 'vitest'
import { getMcpServerInfo, getMcpServerInstructions, MCP_SERVER_NAME } from './mcp-server-info.server'

describe('MCP server identity', () => {
  it('uses the landing release version and build metadata', () => {
    expect(
      getMcpServerInfo('0.3.0-beta.1', {
        VERCEL_GIT_COMMIT_SHA: 'abc123',
        VERCEL_ENV: 'production',
      })
    ).toEqual({
      name: MCP_SERVER_NAME,
      version: '0.3.0-beta.1',
      commit: 'abc123',
      environment: 'production',
    })
  })

  it('omits unavailable deployment metadata instead of fabricating it', () => {
    expect(getMcpServerInfo('0.3.0-beta.1', {})).toEqual({
      name: MCP_SERVER_NAME,
      version: '0.3.0-beta.1',
    })
  })

  it('provides version during initialization instructions and points to server_info', () => {
    const info = getMcpServerInfo('0.3.0-beta.1', {})
    const instructions = getMcpServerInstructions(info)
    expect(instructions).toContain('0.3.0-beta.1')
    expect(instructions).toContain('server_info')
  })
})
