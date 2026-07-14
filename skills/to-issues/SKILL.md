---
name: to-issues
description: Break a plan, spec, or PRD into independently-grabbable GitHub issues using tracer-bullet vertical slices. Invoke with /to-issues, tách issue, vertical slice, break down PRD, bẻ PRD thành issues, publish issues, đẩy issues lên GitHub, or splitting a spec into implementation tickets.
disable-model-invocation: true
---

# To Issues

Break a plan, spec, or PRD into independently-grabbable GitHub issues using **tracer bullet** vertical slices.

**Upstream:** `/reqs` or `/to-prd` produces PRDs and user stories. This skill turns approved specs into implementation-ready issues — it does not rewrite stories or acceptance criteria from scratch.

**Audience:** Follow [issue-template.md](issue-template.md). Do **not** pass a parent PRD executive summary
into slices or ship agent-only shorthand (e.g. `"US#1–9: tenancy..."`) — expand enough context per wave.

**Prerequisites:** Issue tracker and domain docs should already be configured — run `/setup` if `docs/agents/issue-tracker.md` is missing. Read `docs/agents/language.md` when present — write issue bodies in that language.

## References

| Topic           | Read when                                                                                      |
| --------------- | ---------------------------------------------------------------------------------------------- |
| Issue tracker   | [docs/agents/issue-tracker.md](../../docs/agents/issue-tracker.md) — `gh` CLI commands         |
| Triage labels   | [docs/agents/triage-labels.md](../../docs/agents/triage-labels.md) — `ready-for-agent` mapping |
| Domain glossary | `CONTEXT.md` at repo root                                                                      |
| ADRs            | `docs/adr/` — decisions in the area you are touching                                           |
| Issue body      | [issue-template.md](issue-template.md)                                                         |

## Process

### 1. Gather context

Work from whatever is already in the conversation. If the user passes an issue reference (number, URL, or path), fetch it — PRDs from `/to-prd` use title `PRD: <feature>`:

```bash
gh issue view <number> --comments
```

Read the full body and comments. If the source is a PRD or plan in chat, use that directly.

**Completion criterion:** Source material (issue, PRD, or plan) is fully read; parent issue identified if one exists.

### 2. Explore the codebase (optional)

If you have not already explored the codebase, do so to understand current state. Issue titles and descriptions must use glossary vocabulary from `CONTEXT.md` and respect ADRs in the area you are touching.

Look for opportunities to prefactor — "make the change easy, then make the easy change." Prefactoring slices belong first in the breakdown.

**Completion criterion:** Domain vocabulary and relevant ADRs noted; prefactoring opportunities flagged or explicitly skipped with reason.

### 3. Draft vertical slices

Break the plan into **tracer bullet** issues. Each issue is a thin vertical slice through ALL integration layers end-to-end — NOT a horizontal slice of one layer.

- Each slice delivers a narrow but **complete** path through every layer (schema, API, UI, tests)
- A completed slice is demoable or verifiable on its own
- Any prefactoring should come first
- When the source PRD prioritizes stories (P0/P1/P2), order slices so the P0 set completes first — P0 slices alone should be a shippable MVP; a `[NEEDS CLARIFICATION]` marker inside a slice's stories blocks that slice until resolved

Do not re-run `/reqs` user-story workflows here. Map slices to existing user stories from the source material when present; do not invent new stories unless the source has gaps the user confirms.

**Completion criterion:** Numbered slice list drafted; each slice has title, blocked-by, and user stories covered (if applicable).

### 4. Quiz the user

Present the proposed breakdown as a numbered list. For each slice, show:

- **Title**: short descriptive name
- **Blocked by**: which other slices (if any) must complete first
- **User stories covered**: which user stories this addresses (if the source material has them)

Ask the user:

- Does the granularity feel right? (too coarse / too fine)
- Are the dependency relationships correct?
- Should any slices be merged or split further?

Iterate until the user approves the breakdown.

**Completion criterion:** User explicitly approves the slice list and dependencies.

### 5. Publish issues

For each approved slice, create a GitHub issue using [issue-template.md](issue-template.md). Publish in
dependency order (blockers first) so you can reference real issue numbers in **Blocked by**.

**Human-readable check (before each create):** body stands alone without the parent PRD; acceptance is
Given/When/Then or a specific checklist (not a wave rollup); prose is clear to a human reading the tracker.

```bash
gh issue create --title "..." --body "$(cat <<'EOF'
<body from template>
EOF
)"
```

After each create, capture the issue number for cross-references in later issues.

**Labels:** If `docs/agents/triage-labels.md` exists, apply the `ready-for-agent` state label from that file's
mapping (Matt behavior — slices are AFK-ready on publish):

```bash
gh issue edit <number> --add-label "ready-for-agent"
```

Use the actual label string from the mapping table, not the canonical role name, when they differ. If
`triage-labels.md` is missing, publish without labels — do not block.

Do **not** close or modify any parent issue.

**Completion criterion:** Every approved slice exists as a GitHub issue with filled template sections;
human-readable check passed per issue; blocker references use real issue numbers.

### 6. Handoff

Summarize what was published (issue numbers + titles). End with `## Next Step` pointing to exactly one skill — typically `/dev` for the first unblocked slice.

**Completion criterion:** Summary table delivered; `## Next Step` names one next skill.
