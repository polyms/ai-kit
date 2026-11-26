# Ops CMS MCP (agents)

How agents retrieve and author **Knowledge** and retrieve reusable **skill packs** via MCP on the kit site.
Knowledge content lives in Ops CMS (Postgres); skill files live in GitHub.

**Primary pointer:** [knowledge.md](./knowledge.md) — unified retrieval workflow.

## Endpoint

| Setting    | Value                                                                                   |
| ---------- | --------------------------------------------------------------------------------------- |
| **URL**    | `https://ai-kit.polyms.dev/mcp`                                                         |
| Transport  | MCP SDK default (Streamable HTTP on `/mcp`)                                             |
| Auth       | **OAuth required** — Bearer JWT from polyms.dev (`openid profile email offline_access`) |
| Rate limit | Same edge rule as the kit site (shared quota)                                           |

Local dev: `http://localhost:6300/mcp` when `pnpm dev` is running in `apps/landing/`.

OAuth authenticates the user; **write tools** are gated server-side by JWT claim `role: admin` (not a custom OAuth scope). Non-admin users get `ADMIN_REQUIRED` tool errors — no OAuth step-up.

### Refresh tokens (`offline_access`)

MCP discovery advertises **`offline_access`** so clients request a **refresh token** at connect time. polyms.dev SSO issues refresh tokens for this scope; the client silently exchanges them for new access tokens — no browser re-auth on every MCP call.

| Discovery field         | Value                                          |
| ----------------------- | ---------------------------------------------- |
| `scopes_supported`      | `openid`, `profile`, `email`, `offline_access` |
| `grant_types_supported` | `authorization_code`, `refresh_token`          |

**After deploying scope changes:** remove the MCP server in Cursor Settings → MCP, then add it again so DCR + consent include `offline_access`. Existing connections without refresh tokens will keep prompting until reconnected.

## OAuth discovery

| Path                                        | Role                                                                                |
| ------------------------------------------- | ----------------------------------------------------------------------------------- |
| `/.well-known/oauth-protected-resource`     | Resource metadata — MCP URL, authorization servers, OIDC scopes                     |
| `/.well-known/oauth-protected-resource/mcp` | Same metadata (path advertised in `401 WWW-Authenticate`)                           |
| `/.well-known/oauth-authorization-server`   | Authorization server metadata (proxied from polyms.dev; MCP scopes + refresh grant) |

OAuth **resource/audience** is `{origin}/mcp` (RFC 8707). Discovery uses **request origin** when present.

**IdP (polyms.dev):** Better Auth 1.7+ — the same path-exact resource URL must exist as an **`oauthResource`** row on the IdP (not the removed `validAudiences` option). If authorize fails with `invalid_target`, the IdP is missing that identifier. Access tokens for admin users include JWT claim `role: admin` (write tools); the resource server still enforces `aud` + `role`.

**Stale DCR client / missing refresh token:** Remove the MCP server in Cursor Settings and add it again after IdP or scope changes (e.g. first deploy of `offline_access`).

## Codex setup

The repo's `.codex/config.toml` declares the production server:

```toml
[mcp_servers.aikit]
url = "https://ai-kit.polyms.dev/mcp"
```

Codex loads project MCP configuration for trusted projects. Run `codex mcp login aikit`
to complete OAuth when needed, and `codex mcp list` to inspect the configured servers.
For another repo without this configuration, run
`codex mcp add aikit --url https://ai-kit.polyms.dev/mcp` first.
Bootstrap installs skills and principal roles; it does not edit global MCP configuration.

## GitHub Copilot in VS Code

The repo's `.vscode/mcp.json` declares the same production endpoint:

```json
{
  "servers": {
    "aikit": {
      "type": "http",
      "url": "https://ai-kit.polyms.dev/mcp"
    }
  }
}
```

Use **MCP: List Servers**, select `aikit`, and start the server. Complete OAuth in
the browser when requested. Do not copy tokens from Cursor or Codex configuration.
Select the Copilot harness for skills installed by `pnpm bootstrap copilot`.
VS Code's [MCP configuration reference](https://code.visualstudio.com/docs/agents/reference/mcp-configuration)
documents workspace files and server options.

## Cursor setup

```json
{
  "mcpServers": {
    "ai-kit-ops-cms": {
      "url": "https://ai-kit.polyms.dev/mcp"
    }
  }
}
```

## Tools

| Tool                     | Auth                      |
| ------------------------ | ------------------------- |
| `search_knowledge`       | OAuth (any user)          |
| `get_knowledge_coverage` | OAuth (any user)          |
| `get_knowledge`          | OAuth                     |
| `get_knowledge_chunk`    | OAuth                     |
| `upsert_knowledge`       | OAuth + JWT `role: admin` |
| `delete_knowledge`       | OAuth + JWT `role: admin` |
| `list_skill_packs`       | OAuth (any user)          |
| `get_skill_pack`         | OAuth (any user)          |
| `prepare_feedback_issue` | OAuth (any user, read-only draft) |

## Conversational GitHub feedback

If the user asks to report AI Kit feedback, call `prepare_feedback_issue`
to build a complete title and Markdown body for the **public**
`polyms/ai-kit` repository. Reuse context, ask questions only when needed,
show the exact draft and obtain explicit publication approval.

After approval, a host AI client with its **own separately authenticated**
GitHub tool can call `create_issue` and report the real URL/number.
AI Kit's OAuth bearer token **cannot** be used as GitHub authorization.
Without a connected GitHub write action, use the returned **prefilled**
Issue Form link and let the user review/submit. If
`prefilledUrlTruncated` is true, note clearly that the URL contains an
excerpt; the complete draft remains available in chat. GitHub still requires
public-consent confirmation. No blank Issue template required for the
normal chat flow. Do not claim issue creation from a draft or user approval.

See [feedback flow and privacy](../feedback.md).

## Skill packs (MCP clients)

See [MCP skill provider](mcp-skill-provider.md) for architecture, pack catalog, maintenance and rollout.

The MCP server fetches Markdown for `reqs`, `design`, `research`, `business`, `docs`, `task`, `bug`, `track`, `plan`, `qa`, `comms`, `review` and `release` from GitHub raw URLs on `main`.
Existing paths and URLs are preserved. Cursor and Claude keep reading the same files locally.

| Tool               | Returns                                                                                                                                                                                         |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `list_skill_packs` | `{ packs: [{ name, skillRawUrl, description, useWhen, avoidWhen, starterPaths, relatedSkills, contract }], composition: { protocol, recipes } }`.                                               |
| `get_skill_pack`   | `{ name, files: [{ path, rawUrl, content }] }`. Design also returns `uiKit` with content. Unknown name: `NOT_FOUND`. Upstream failure: `FETCH_FAILED`. Invalid selected paths: `INVALID_PATHS`. |

Any MCP-capable AI client or agent can connect to `https://ai-kit.polyms.dev/mcp` using the
supported transport and OAuth flow. Call `list_skill_packs` to discover available packs and
`get_skill_pack` to load the selected pack directly. No client-side HTTP GET is needed.
Client-specific MCP availability, authentication, and invocation behavior may vary.

- Prefer `paths: starterPaths` from the selected catalog entry, then load only needed references.
- For multi-skill work, retrieve the composition protocol from any pack and a selected recipe via
  its hostPack. See [skill composition](skill-composition.md).
- Optional `paths` selects exact pack files; `[]` returns metadata only. Omit for the full pack.
- Unselected files have no `content` field; only manifest paths may be requested.
- Follow `SKILL.md` first; consult bundled templates and references when relevant.
- Work skills include the shared work artifact standard and their applicable templates.
- Skill loading is read-only; publishing tickets or documents uses the client's authorized integrations.
- For design, use the returned `uiKit` content when the skill invokes `/ui-kit`.

Files are fetched in parallel without an application cache, with a ten-second timeout per file.
Content edits to already registered files on `main` do not require a site redeploy; GitHub CDN
propagation may delay visibility. New packs or manifest changes require a deployment.
Local MCP stays `http://localhost:6300/mcp`.

## Env

| Variable             | Default                                               | Role                                                         |
| -------------------- | ----------------------------------------------------- | ------------------------------------------------------------ |
| `APP_URL`            | request `origin`                                      | Kit site public URL                                          |
| `OIDC_ISSUER`        | `https://polyms.dev` (local: `http://localhost:6200`) | IdP issuer — JWT `iss` + JWKS                                |
| `OPS_SESSION_SECRET` | dev fallback when `pnpm dev`                          | Ops **browser** session + OAuth state cookies only — not MCP |

Dev sign-in on `/ops/login` is available automatically when running `pnpm dev` (`import.meta.env.DEV`).

## Related

- [knowledge.md](./knowledge.md)
- [mcp-skill-provider.md](./mcp-skill-provider.md)
- [work-artifact-standard.md](./work-artifact-standard.md)
