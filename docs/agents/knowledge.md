# Knowledge pointer (agents)

How agents retrieve **Knowledge** — unified Ops CMS content (incident, design, toolchain) via MCP. Pointer only; body lives in **Ops CMS** (Postgres), not in this file.

## Canonical source

| Store                  | Role                                                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------------------- |
| **Ops CMS / Postgres** | Live **Knowledge** articles + chunks — canonical                                                         |
| Kit site               | Public read at `/knowledge/*` (e.g. [KN-001](https://ai-kit.polyms.dev/knowledge/KN-001))                |
| **MCP**                | [Ops CMS MCP](./ops-cms-mcp.md) at `https://ai-kit.polyms.dev/mcp` — read + write tools (OAuth required) |
| `docs/runbooks/*.md`   | Import snapshot only — **not** agent retrieval target                                                    |

## Knowledge intents

| Intent      | Agent role | Use when                                                  |
| ----------- | ---------- | --------------------------------------------------------- |
| `incident`  | `/devops`  | Deploy/CI symptom → fix → verify                          |
| `design`    | `/arch`    | Stack-combo seams (routing, state, modules)               |
| `toolchain` | `/dev`     | Org-wide setup recipes (e.g. **KN-001** Biome + Prettier) |

## Retrieval (`/dev`, `dev-agent`, `/devops`, `/arch`)

1. Read **`docs/agents/stack-profile.md`** when present — pass manifest `axes` to search (optional; omit for org defaults like `polyms-default`).
2. Connect MCP with OAuth (polyms.dev) — see [ops-cms-mcp.md](./ops-cms-mcp.md).
3. Search by topic, symptom, or config name:
   - **MCP (preferred):** `search_knowledge` with `q`, optional `intent`, and `axes`
   - **Kit site (browse):** `/knowledge?q=…`
4. Open **`get_knowledge`** for full article — chunks return in **`sortOrder`** (checklist / overview first, config artifacts after).
5. Open **`get_knowledge_chunk`** for config artifacts before copying into a target repo — confirm `artifactFilename` and verbatim `body`.
6. For toolchain setup in a greenfield repo, retrieve **KN-001** (`intent: toolchain`, `q: biome prettier`) before inventing formatter config.

### Toolchain example (`dev-agent`)

```
search_knowledge({ q: "biome prettier", intent: "toolchain" })
→ get_knowledge({ id: "KN-001" })   # read chunks in sortOrder — start with KN-001-checklist
→ get_knowledge_chunk({ chunkId: "KN-001-biome-json" })
… (copy verbatim bodies; wire package.json scripts chunk)
```

## Authoring via MCP (admin)

JWT claim **`role: admin`** (polyms.dev) unlocks `upsert_knowledge` and `delete_knowledge` on MCP.

**Placeholder policy — agent responsibility, not server validation:**

- Knowledge is org-wide — no project-specific paths (`apps/landing`, `localhost:6300`, …)
- Use `{project}`, `apps/{project}`, `http://localhost:{port}`, `{your tailwindCSS configFile}`, `{route}`
- Config chunks: replace or remove project-specific values before upsert
- `sortOrder`: checklist/overview first (0), config artifacts after
- `axisTags`: stack manifest tags, not repo names

The MCP tool description mirrors this policy. Runtime mutation validates structure only (Zod). Seed pipeline in this repo additionally enforces forbidden literals via `prisma/seed-placeholders.ts` — that module is **seed-only**, not used by MCP.

## Boundaries

| Owns                                           | Does not own                                                  |
| ---------------------------------------------- | ------------------------------------------------------------- |
| Retrievable recipes, incidents, design seams   | Irreversible **why** → `docs/adr/`                            |
| Verbatim config chunks for agent copy          | Timeless greenfield defaults → `skills/dev/stack-defaults.md` |
| Hybrid keyword + vector search when configured | Keyword-only fallback when embeddings disabled                |

## Embeddings (optional)

| Env                         | Role                                                |
| --------------------------- | --------------------------------------------------- |
| `OPENROUTER_API_KEY`        | OpenRouter key — enables hybrid search when set     |
| `KNOWLEDGE_EMBEDDING_MODEL` | Default `openai/text-embedding-3-small` (1536 dims) |

`pnpm db:seed` and MCP `upsert_knowledge` embed published chunks via `https://openrouter.ai/api/v1/embeddings`. Hybrid rank: keyword pre-score + pgvector cosine boost on chunks.

## Related

- **MCP setup:** [ops-cms-mcp.md](./ops-cms-mcp.md)
- **Incidents workflow:** [runbooks.md](./runbooks.md) — `/devops`
- **Design workflow:** [stack-guides.md](./stack-guides.md) — `/arch`
- **Glossary:** **Knowledge** in [CONTEXT.md](../../CONTEXT.md)
- **PRD:** GitHub issue #2
