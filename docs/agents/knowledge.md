# Knowledge pointer (agents)

How agents retrieve **Knowledge** — unified Ops CMS content (incident, design, toolchain) via
MCP. Pointer only; body lives in **Ops CMS** (Postgres), not in this file.

**Do not hardcode article or chunk ids.** Live catalog can change any time. Seed fixtures under
`apps/landing/prisma/*-data.ts` are **sample data** for kit tests and local CMS — not retrieval
targets for skills.

## Canonical source

| Store                  | Role                                                                                      |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| **Ops CMS / Postgres** | Live **Knowledge** articles + chunks — canonical                                          |
| Kit site               | Public browse/search at `/knowledge/*`                                                    |
| **MCP**                | [Ops CMS MCP](./ops-cms-mcp.md) at `https://ai-kit.polyms.dev/mcp` — read + write (OAuth) |

Legacy public paths `/runbooks/*` and `/guides/*` redirect to `/knowledge/*`.

## Knowledge intents

| Intent      | Agent role                     | Use when                                     |
| ----------- | ------------------------------ | -------------------------------------------- |
| `incident`  | `/devops`, deploy-aware `/dev` | Deploy/CI symptom → cause → fix → verify     |
| `design`    | `/arch`, design-slice `/dev`   | Stack-combo seams (routing, state, modules)  |
| `toolchain` | `/dev`                         | Org-wide setup recipes (formatters, tooling) |

## Retrieval (`/dev`, `developer`, `/devops`, `/arch`, `techlead`)

Always **search → open match → use chunks**. Same process for every intent.

1. Read **`docs/agents/stack-profile.md`** when present — pass manifest `axes` to search
   (optional; omit for org defaults like `polyms-default`). Coverage notes there are
   **bootstrap only** — not live SSOT (see [Knowledge coverage](#knowledge-coverage)).
2. Connect MCP with OAuth (polyms.dev) — see [ops-cms-mcp.md](./ops-cms-mcp.md).
3. Call **`search_knowledge`** with:
   - `q` — symptom, seam topic, tool/config name, or user phrasing
   - `intent` — `incident` | `design` | `toolchain`
   - `axes` — only when the stack manifest names them
4. No MCP: browse `/knowledge?q=…&intent=…` on the kit site.
5. Open **`get_knowledge`** on the best match — chunks in **`sortOrder`** (checklist / overview
   first, config artifacts after). Do not assume a fixed article id.
6. Open **`get_knowledge_chunk`** for a config artifact before copying — confirm
   `artifactFilename` and verbatim `body`.
7. No useful match: document `q` + `intent` (+ `axes`) tried; follow the intent-specific fallback
   below — do not invent config from memory.

### Incident (`intent: incident`) — `/devops`, deploy-aware `/dev`

1. Search with `q` (symptom or trigger phrase).
2. Confirm **symptom** and **cause** on incident chunks before **fix**.
3. Apply **fix** minimally; run **verify** from the same chunk.
4. No match: report search terms; do not invent Vercel/Nx/CI config.

SEV / status / post-mortem templates (not CMS body):

- [incident-templates.md](../../skills/devops/incident-templates.md)

Per-app context: `apps/*/DEPLOY.md`.

### Design (`intent: design`) — `/arch`, design-slice `/dev`

1. Search with `q` (seam keyword: routing, state, modules, …).
2. Open seam chunks in `sortOrder`.
3. No match: fall back to [stack-defaults.md](../../skills/dev/stack-defaults.md). Irreversible
   **why** stays in `docs/adr/`.

### Toolchain (`intent: toolchain`) — `/dev`

1. Search with `q` (formatter / linter / tooling need — e.g. biome, prettier, eslint).
2. Open match in `sortOrder`; pull config chunks via `get_knowledge_chunk` before copying.
3. No match: report search terms; do not invent org formatter/tooling config.

### Search shape (illustrative)

```
get_knowledge_coverage({ axes: [...], intents? })  # gap/hit for a subset — optional first step
search_knowledge({ q: "<topic or symptom>", intent: "<incident|design|toolchain>", axes? })
→ pick best hit from results
→ get_knowledge({ id: <id from hit> })
→ get_knowledge_chunk({ chunkId: <id from article chunks> })  # when copying config
```

Ids come from search results — never from skill memory or seed fixtures.

## Knowledge coverage

Gap/hit check for intentional axis **subsets** — complements `search_knowledge`, does not replace
it. Soft-required for `/setup` (persist into stack-profile), `/arch`, and `/arch-refactor`
(those two **re-call MCP** for the subset under work; do not trust stale stack-profile alone).

### Tool: `get_knowledge_coverage`

| Arg       | Required                      | Notes                                                                 |
| --------- | ----------------------------- | --------------------------------------------------------------------- |
| `axes`    | **yes**, non-empty `string[]` | Empty, missing, or blank (trim) entries → validation tool error       |
| `intents` | optional                      | Omit/`undefined` → all three; `[]` → validation error                 |

**Match rule:** an article **covers** when `axes ⊆ article.axisTags` (case-insensitive). Only
**published** articles (same filter as public search / `listKnowledgeArticlesFromDb`).

**Auth:** OAuth any connected user (same as `search_knowledge`) — not admin-only.

**Response shape:**

```json
{
  "axes": ["vercel", "tanstack-start", "nitro"],
  "intents": ["incident", "design", "toolchain"],
  "byIntent": {
    "incident": { "covered": true, "articleIds": ["RB-001"] },
    "design": { "covered": false, "articleIds": [] },
    "toolchain": { "covered": false, "articleIds": [] }
  }
}
```

Echoes `axes` + resolved `intents`. Per intent: `{ covered, articleIds }` only — no titles or
summaries. Use hits as a signal to search/open; do not invent seams when coverage already lists a
hit.

### Setup axis heuristics

`/setup` does **not** call coverage with the full profile axes list. Pool + core-priority tables and
Coverage section format: [stack-profile.md](../../skills/setup/stack-profile.md).

## Authoring via MCP (admin)

JWT claim **`role: admin`** (polyms.dev) unlocks `upsert_knowledge` and `delete_knowledge` on MCP.

**Placeholder policy — agent responsibility, not server validation:**

- Knowledge is org-wide — no project-specific paths (`apps/landing`, `localhost:6300`, …)
- Use `{project}`, `apps/{project}`, `http://localhost:{port}`, `{your tailwindCSS configFile}`,
  `{route}`
- Config chunks: replace or remove project-specific values before upsert
- `sortOrder`: checklist/overview first (0), config artifacts after
- `axisTags`: stack manifest tags, not repo names

The MCP tool description mirrors this policy. Runtime mutation validates structure only (Zod).
Seed pipeline in this repo additionally enforces forbidden literals via
`prisma/seed-placeholders.ts` — that module is **seed-only**, not used by MCP.

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

`pnpm db:seed` and MCP `upsert_knowledge` embed published chunks via
`https://openrouter.ai/api/v1/embeddings`. Hybrid rank: keyword pre-score + pgvector cosine boost
on chunks.

## Related

- **MCP setup:** [ops-cms-mcp.md](./ops-cms-mcp.md)
- **Glossary:** **Knowledge** in [CONTEXT.md](../../CONTEXT.md)
- **PRD:** GitHub issue #2
