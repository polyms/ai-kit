# Ops CMS MCP (agents)

How agents retrieve and author **Knowledge** via MCP on the kit site. Pointer only — content lives in **Ops CMS** (Postgres).

**Primary pointer:** [knowledge.md](./knowledge.md) — unified retrieval workflow.

## Endpoint

| Setting    | Value                                                                    |
| ---------- | ------------------------------------------------------------------------ |
| **URL**    | `https://ai-kit.polyms.dev/mcp`                                          |
| Transport  | MCP SDK default (Streamable HTTP on `/mcp`)                              |
| Auth       | **OAuth required** — Bearer JWT from polyms.dev (`openid profile email`) |
| Rate limit | Same edge rule as the kit site (shared quota)                            |

Local dev: `http://localhost:6300/mcp` when `pnpm dev` is running in `apps/landing/`.

OAuth authenticates the user; **write tools** are gated server-side by JWT claim `role: admin` (not a custom OAuth scope). Non-admin users get `ADMIN_REQUIRED` tool errors — no OAuth step-up.

## OAuth discovery

| Path                                        | Role                                                                      |
| ------------------------------------------- | ------------------------------------------------------------------------- |
| `/.well-known/oauth-protected-resource`     | Resource metadata — MCP URL, authorization servers, OIDC scopes           |
| `/.well-known/oauth-protected-resource/mcp` | Same metadata (path advertised in `401 WWW-Authenticate`)                 |
| `/.well-known/oauth-authorization-server`   | Authorization server metadata (proxied from polyms.dev, read scopes only) |

OAuth **resource/audience** is `{origin}/mcp`. Discovery uses **request origin** when present.

**IdP (polyms.dev):** registers `…/mcp` in `validAudiences`. Admin users receive `role: admin` in the access token.

**Stale DCR client:** Remove the MCP server in Cursor Settings and add it again after IdP changes.

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

| Tool                  | Auth                      |
| --------------------- | ------------------------- |
| `search_knowledge`    | OAuth (any user)          |
| `get_knowledge`       | OAuth                     |
| `get_knowledge_chunk` | OAuth                     |
| `upsert_knowledge`    | OAuth + JWT `role: admin` |
| `delete_knowledge`    | OAuth + JWT `role: admin` |

## Env

| Variable             | Default                                               | Role                                                         |
| -------------------- | ----------------------------------------------------- | ------------------------------------------------------------ |
| `APP_URL`            | request `origin`                                      | Kit site public URL                                          |
| `OIDC_ISSUER`        | `https://polyms.dev` (local: `http://localhost:6200`) | IdP issuer — JWT `iss` + JWKS                                |
| `OPS_SESSION_SECRET` | dev fallback when `pnpm dev`                          | Ops **browser** session + OAuth state cookies only — not MCP |

Dev sign-in on `/ops/login` is available automatically when running `pnpm dev` (`import.meta.env.DEV`).

## Related

- [knowledge.md](./knowledge.md)
- [runbooks.md](./runbooks.md)
- [stack-guides.md](./stack-guides.md)
