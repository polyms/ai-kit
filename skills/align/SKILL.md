---
name: align
description: Align on a plan before building — relentless grill (design tree, lettered options), sharpen domain language, update CONTEXT.md and ADRs as you go. Invoke with /align, grill, làm rõ kế hoạch, chốt hướng.
disable-model-invocation: true
---

# Align — Align Before You Build

Run **align-loop** using **domain-modeling** — the same pairing as Matt `grill-with-docs`: grill the plan **and** write vocabulary and hard decisions down as they land.

Close the communication gap before `/pm`, `/to-prd`, `/design`, or `/dev`. Do not substitute `/pm` discovery, a PRD draft, or a feature list for the grill.

Run `/setup` first if `docs/agents/` is missing.

## Session

Chat tone: ambient IDE/user rules. If `.cursor/rules/agent-voice.mdc` exists (opt-in `/setup`), follow it.

1. Read `CONTEXT.md` if present
2. Run **align-loop** — one question, lettered options (2–4 real forks), one **(Recommended)**, codebase-first when possible
3. Run **domain-modeling** throughout — challenge terms in questions, probe edge-case scenarios, update `CONTEXT.md` inline when a term resolves (show the user the line), offer ADRs only when the three-part test passes

## It's working if

- Calibration lands early (or is skipped when level is obvious) — grill depth matches knowledge and pressure
- One question at a time with lettered options and **(Recommended)** — count matches real forks, not a fixed four; user reacts to a proposal, not a blank prompt
- Terms land in `CONTEXT.md` the moment they resolve — not batched at the end
- The agent reads the codebase to answer its own questions where it can, then reports findings before options
- ADRs stay rare — reversible choices are not rubber-stamped
- Open-questions audit runs before handoff — `## Open Questions` is never silently empty when implementer-facing gaps remain
- No PRD, no user stories, no premature handoff while branches are still open

## Handoff

Enter only when align-loop completion criteria are met and the user confirms the decision summary.

**Open questions gate** — before pointing to `/to-prd`: if the audit found unsettled items, list them under
`## Open Questions` and ask the **open-questions confirmation** turn
([GRILL-FORMAT.md](../align-loop/GRILL-FORMAT.md)). `/to-prd` is valid only when open questions are **zero**,
or the user picked **B** and confirmed the deferred list — never with a silently empty section while
implementer-facing gaps remain (that is how `/to-prd` surfaces markers the user never saw).

## When `/pm` vs `/to-prd` vs `/align`

Same decision tree in `/pm` and `/to-prd` — keep in sync:

```
Decisions / problem statement clear?
├─ Yes, aligned chat ready to ship a PRD → tell user to invoke `/to-prd`
│     (lean template, publish to tracker — `/pm` does NOT publish)
├─ No — need more design-tree grill → continue `/align` (or restart)
└─ No — need PM discovery, enterprise PRD, stories, or prioritization → tell user to invoke `/pm`
      (enterprise template in chat; does not publish)
```

When suggesting `/to-prd`, say so explicitly (e.g. gõ `/to-prd`) — do not say only "viết PRD" (easy to
confuse with `/pm`).

| Next step | When                                                                              |
| --------- | --------------------------------------------------------------------------------- |
| `/to-prd` | Decisions confirmed; open questions resolved **or** user confirmed deferral to PRD |
| `/pm`     | Need discovery interview, enterprise PRD (chat), stories, or prioritization         |
| `/dev`    | Small, well-bounded change with clear seams                                         |
| `/design` | UI flows or design specs needed before implementation                               |

End with:

```
## Decisions
- [bullet list]

## Open Questions
- [each item — or "none" only after audit confirms zero unsettled implementer-facing details]

## Next Step
→ /to-prd | /pm | /design | /dev
```

**Completion criterion:** Handoff block delivered; `## Open Questions` matches the audit (not silently empty); user confirmed
deferral before `## Next Step` → `/to-prd` when any item remains; `## Next Step` points to exactly one skill.

Alignment is **interactive** — stay in this chat for the whole grill. There is no `align-agent` subagent; subagents run autonomously and cannot wait for one answer per turn.
