---
name: to-prd
description: Synthesize the current conversation into a lean PRD and publish it to the issue tracker — no interview. Invoke with /to-prd, publish PRD, đẩy PRD lên GitHub, tổng hợp PRD, or chốt PRD.
disable-model-invocation: true
---

# To PRD

Synthesize the **current conversation** and codebase understanding into a PRD and **publish** it to the issue tracker.

**Do NOT interview** — synthesize from conversation + codebase context already in session.

## When `/reqs` vs `/to-prd` vs `/align`

Same decision tree in `/align` handoff and `/reqs` — keep in sync:

```
Decisions / problem statement clear?
├─ Yes, aligned chat ready to ship a PRD → `/to-prd` (this skill)
│     (lean template, publish to tracker)
├─ No — need design-tree grill (tech forks, domain terms) → user invokes `/align`
└─ No — need requirements discovery, enterprise PRD, stories, or prioritization → user invokes `/reqs`
      (draft in chat or docs/prd/; `/reqs` does NOT create tracker issues)
```

**Audience:** Follow [lean-prd-template.md](lean-prd-template.md). Do **not** ship executive-summary
rollups or agent-only shorthand (e.g. `"W1 P0 #1–9: tenancy..."`).

**Boundary vs `/reqs`:**

| Skill     | When                                     | Behavior                                                                                                  |
| --------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `/reqs`   | Discovery, formal PRD, stories, priority | May interview; enterprise-prd-template in `/reqs`; **does not publish**                                   |
| `/to-prd` | "We've talked enough — ship the PRD"     | **Synthesize only** — no discovery interview; [lean-prd-template.md](lean-prd-template.md); **publishes** |

**Upstream:** `/align` + `align-loop` (+ `domain-modeling` when terms resolve) sharpen decisions and domain language before synthesis.

**Downstream:** `/to-issues` breaks the published PRD into vertical-slice issues.

**Prerequisites:** Run `/setup` if `docs/agents/issue-tracker.md` or `docs/agents/triage-labels.md` is missing. Read `docs/agents/language.md` when present — publish the PRD in that language.

## References

| Topic           | Read when                                                                                      |
| --------------- | ---------------------------------------------------------------------------------------------- |
| Issue tracker   | [docs/agents/issue-tracker.md](../../docs/agents/issue-tracker.md) — create/read commands      |
| Triage labels   | [docs/agents/triage-labels.md](../../docs/agents/triage-labels.md) — `ready-for-agent` mapping |
| PRD body        | [lean-prd-template.md](lean-prd-template.md)                                                   |
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

### 3. Open-questions gate (before write)

Scan conversation, align handoff, and codebase for details an implementer still needs — same bar as
`[NEEDS CLARIFICATION]` in [lean-prd-template.md](lean-prd-template.md).

If any would appear in **Open Questions**: list them, **do not draft or publish yet**, and ask the
**open-questions confirmation** turn ([GRILL-FORMAT.md](../align-loop/GRILL-FORMAT.md)) — **A** here means
run `/align` on the listed items; **B** proceeds to step 4 with confirmed markers. If `/align` already
deferred the same items with **B**, restate the list and proceed only after explicit yes.

**Completion criterion:** Zero unsettled markers, or user explicitly chose **B** and confirmed the deferred list.

### 4. Write the PRD

Fill every section of [lean-prd-template.md](lean-prd-template.md) from conversation context and codebase understanding. No empty headers.

**User Stories** must be an extensive, **prioritized** numbered list (per template) — P0 stories independently testable, with Given/When/Then acceptance scenarios. Include test seams from step 2 under **Testing Decisions** and relevant ADRs under **Implementation Decisions**.

**Synthesize, don't invent:** this skill has no interview step — when the conversation didn't settle a detail, mark it `[NEEDS CLARIFICATION: …]` inline and collect markers under **Open Questions**. Inventing an answer here ships it straight to `/dev` unreviewed. Markers may appear only after step 3 **B** confirmation.

**Human-readable check (before publish):** re-read the draft as a PM unfamiliar with the codebase — every
template section filled; no one-line wave summaries; Given/When/Then per P0 story; body stands alone without
opening the repo.

**Completion criterion:** PRD draft complete; every template section filled; every unsettled detail carries a
marker instead of a guess; markers match the step 3 confirmed deferral list when any exist; human-readable check
passed.

### 5. Publish

Create an issue titled `PRD: <feature>` per
[docs/agents/issue-tracker.md](../../docs/agents/issue-tracker.md). Apply the mapped `ready-for-agent` label
string from [docs/agents/triage-labels.md](../../docs/agents/triage-labels.md). Also write the same body to
`docs/prd/<feature-slug>.md` (create `docs/prd/` if missing). Tracker issue is canonical; the repo file is the
mirror (header/links may differ; prose and stories must match).

```bash
gh issue create --title "PRD: <feature>" --body "$(cat <<'EOF'
<body from lean-prd-template.md>
EOF
)" --label "<mapped label string>"
```

(`gh` example — follow `issue-tracker.md` when the tracker is not GitHub.)

Skip `/triage` — this skill publishes a pre-aligned spec from conversation (`/align` upstream), not a raw
inbound issue. No agent brief needed; the PRD body is the AFK contract.

**Completion criterion:** Issue created on tracker with full PRD body and mapped `ready-for-agent` label;
matching `docs/prd/<feature-slug>.md` written.

### 6. Handoff

Summarize what was published (issue number + title). End with `## Next Step` pointing to exactly one skill — typically `/to-issues` on the published PRD issue.

_Future:_ a dedicated `prd-view` skill for reading and presenting PRDs from issues is planned — for now, fetch via `issue-tracker.md` read commands.

**Completion criterion:** Summary delivered; `## Next Step` names one next skill.
