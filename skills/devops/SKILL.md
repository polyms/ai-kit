---
name: devops
description: Deploy, CI, and infra — symptom → fix via Knowledge retrieval. Use when a deploy/CI/infra symptom is reported cold (no `/dev` slice in progress) — deploy failure, Vercel build failed, CI broken, sửa deploy, lỗi build, infra fix. Invoke with /devops, or use developer (executor) / techlead (SEV) for long incident sessions.
---

# DevOps — Deploy, CI & Infra

Resolve deploy/CI/infra incidents via **Knowledge** retrieval — symptom → cause → fix → verify. Do not guess config.

**Boundary vs `/dev`:** a deploy/CI symptom reported cold — no `/dev` slice already in progress — routes here automatically. One surfacing mid-slice (deploy-aware `/dev` touching infra config inside a feature slice) stays in `/dev`. **`/devops`** owns operational incidents end-to-end otherwise. Hand off app feature work to `/dev`.

**Boundary vs `/e2e`:** flaky or slow **test** jobs, Playwright config, sharding → **`/e2e`**
(`tester`). Deploy/build/install Knowledge matches stay here.

**Boundary vs `arch`:** design seams and module shape → **`arch`** + `intent: design`. Irreversible **why** → `docs/adr/`. This skill applies **symptom → fix** only.

## Quick Router

| Intent                        | Workflow                                                                                      |
| ----------------------------- | --------------------------------------------------------------------------------------------- |
| Deploy/build/CI failure       | [Incident workflow](#incident-workflow)                                                       |
| Proactive infra or CI change  | [Incident workflow](#incident-workflow) — search first                                        |
| Post-fix confirmation         | Re-run **verify** steps from matched Knowledge chunk                                          |
| SEV classify / status / close | [Close & communicate](#5-close--communicate) + [incident-templates.md](incident-templates.md) |
| Flaky Playwright / E2E job    | User invokes `/e2e` — not this skill                                                          |

## Incident Workflow

**Goal:** Verified green deploy/CI state from a confirmed Knowledge match — not an invented fix.

### 1. Orient

- Capture the **symptom** exactly — error message, failing step, platform (Vercel, GitHub Actions, …)
- Classify **severity** when user impact is unclear — [incident-templates.md](incident-templates.md)
- Read **`docs/agents/stack-profile.md`** when present — pass manifest `axes` to search
- Read per-app **`apps/*/DEPLOY.md`** when the incident is app-scoped — env vars, project paths, local repro commands
- Read [runbook pointer](../../docs/agents/runbooks.md) and [Knowledge pointer](../../docs/agents/knowledge.md) — MCP setup at [ops-cms-mcp.md](../../docs/agents/ops-cms-mcp.md)

**Completion criterion:** Symptom stated; severity noted when impact unclear; stack axes noted when
manifest exists; app deploy guide located when applicable.

### 2. Retrieve

Call **`search_knowledge`** with `q` (symptom or trigger phrase) and `intent: "incident"` — pass `axes` only when a stack manifest names them. No MCP connection: browse `/knowledge?q=…&intent=incident` on the kit site instead.

Open **`get_knowledge`** for the best match.

**Completion criterion:** At least one candidate article returned, or explicit search exhausted with documented query terms.

### 3. Confirm before fix

For incident chunks (`chunkType: incident`):

- **Symptom** matches what the user sees
- **Cause** is plausible for this repo's stack profile
- Only then read **fix** steps

Use **`get_knowledge_chunk`** to pull a config artifact on its own.

Do **not** apply fixes from a partial symptom match. If no match: say so; do not invent Vercel/Nx/CI config.

**Completion criterion:** User or agent confirms symptom + cause alignment with the chosen Knowledge article.

### 4. Apply + verify

1. Apply **fix** steps minimally — smallest config change that addresses the confirmed cause
2. Run **verify** steps from the same chunk (build, deploy preview, CI green, curl check, …)
3. If verify fails, return to **Retrieve** — do not stack speculative changes

**Completion criterion:** Verify steps from Knowledge pass, or gap documented with next search terms.

### 5. Close & communicate

After verify is green (or when the incident is SEV1/SEV2 even mid-flight):

1. Send a [status update](incident-templates.md#status-update) when stakeholders need cadence
2. Run the [close checklist](incident-templates.md#close-checklist)
3. Draft a [post-mortem](incident-templates.md#post-mortem) for SEV1/SEV2 (or repeated same class)
   within 48h — blameless; action items have owners

**Completion criterion:** Close checklist done; post-mortem drafted when required.

## References

| Topic             | Read when                                                                                          |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| Retrieval policy  | [runbooks.md](../../docs/agents/runbooks.md)                                                       |
| MCP tools + OAuth | [knowledge.md](../../docs/agents/knowledge.md), [ops-cms-mcp.md](../../docs/agents/ops-cms-mcp.md) |
| SEV / post-mortem | [incident-templates.md](incident-templates.md)                                                     |
| Example article   | [RB-001](https://ai-kit.polyms.dev/knowledge/RB-001) — Vercel + TanStack Start monorepo            |
| App context       | `apps/*/DEPLOY.md`                                                                                 |
| Design seams      | **`arch`** + [stack-guides.md](../../docs/agents/stack-guides.md) — not this skill                 |

## Agent

For long incident sessions or multi-step deploy debugging — primary executor is **`developer`**; **`techlead`** for SEV / infra ownership:

```
Use the developer to [symptom]
```

```
Use the techlead to [symptom] — SEV ownership
```

The agent reads this skill when invoked.
