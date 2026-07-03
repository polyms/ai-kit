---
name: to-prd
description: Synthesize the current conversation into a lean PRD and publish it to the issue tracker — no interview. Invoke with /to-prd, publish PRD, đẩy PRD lên GitHub, tổng hợp PRD, or chốt PRD.
disable-model-invocation: true
---

# To PRD

Synthesize the **current conversation** and codebase understanding into a PRD and **publish** it to the issue tracker.

**Do NOT interview** — synthesize from conversation + codebase context already in session.

**Boundary vs `/pm`:**

| Skill     | When                                             | Behavior                                                                                         |
| --------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `/pm`     | Discovery, formal PRD writing, stories, priority | May interview; enterprise template via `/pm`                                                     |
| `/to-prd` | "We've talked enough — ship the PRD"             | **Synthesize only** — no discovery interview; [prd-template.md](prd-template.md) (lean template) |

**Upstream:** `/align` + `align-loop` (+ `domain-modeling` when terms resolve) sharpen decisions and domain language before synthesis.

**Downstream:** `/to-issues` breaks the published PRD into vertical-slice issues.

**Prerequisites:** Run `/setup` if `docs/agents/issue-tracker.md` or `docs/agents/triage-labels.md` is missing.

## References

| Topic           | Read when                                                                                      |
| --------------- | ---------------------------------------------------------------------------------------------- |
| Issue tracker   | [docs/agents/issue-tracker.md](../../docs/agents/issue-tracker.md) — create/read commands      |
| Triage labels   | [docs/agents/triage-labels.md](../../docs/agents/triage-labels.md) — `ready-for-agent` mapping |
| PRD body        | [prd-template.md](prd-template.md)                                                             |
| Domain glossary | `CONTEXT.md` at repo root                                                                      |
| ADRs            | `docs/adr/` — decisions in the area you are touching                                           |

## Process

### 1. Explore the codebase

If you have not already explored the codebase, do so to understand current state. Use glossary vocabulary from `CONTEXT.md` throughout the PRD and respect ADRs in the area you are touching.

**Completion criterion:** Glossary terms and relevant ADRs noted.

### 2. Sketch test seams

Sketch the seams at which you will test the feature:

- Prefer **existing seams** to new ones
- Use the **highest seam possible**
- If new seams are needed, propose them at the highest point you can
- The fewer seams across the codebase, the better — the ideal number is **one**

Present the proposed seams to the user and **check that they match expectations** before writing the PRD. User may explicitly defer confirmation.

**Completion criterion:** User confirmed seams (or explicitly deferred).

### 3. Write the PRD

Fill every section of [prd-template.md](prd-template.md) from conversation context and codebase understanding. No empty headers.

**User Stories** must be an extensive numbered list (per template). Include test seams from step 2 under **Testing Decisions** and relevant ADRs under **Implementation Decisions**.

**Completion criterion:** PRD draft complete; every template section filled.

### 4. Publish to issue tracker

Create an issue titled `PRD: <feature>` per [docs/agents/issue-tracker.md](../../docs/agents/issue-tracker.md). Apply the mapped `ready-for-agent` label string from [docs/agents/triage-labels.md](../../docs/agents/triage-labels.md):

```bash
gh issue create --title "PRD: <feature>" --body "$(cat <<'EOF'
<body from prd-template.md>
EOF
)" --label "<mapped label string>"
```

(`gh` example — follow `issue-tracker.md` when the tracker is not GitHub.)

Skip `/triage` — this skill publishes a pre-aligned spec from conversation (`/align` upstream), not a raw inbound issue. No agent brief needed; the PRD body is the AFK contract.

**Completion criterion:** Issue created on tracker with full PRD body and mapped `ready-for-agent` label applied.

### 5. Handoff

Summarize what was published (issue number + title). End with `## Next Step` pointing to exactly one skill — typically `/to-issues` on the published PRD issue.

_Future:_ a dedicated `prd-view` skill for reading and presenting PRDs from issues is planned — for now, fetch via `issue-tracker.md` read commands.

**Completion criterion:** Summary delivered; `## Next Step` names one next skill.
