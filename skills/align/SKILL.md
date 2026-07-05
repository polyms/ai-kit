---
name: align
description: Align on a plan before building — relentless grill (design tree, A–D options), sharpen domain language, update CONTEXT.md and ADRs as you go. Invoke with /align, grill, làm rõ kế hoạch, chốt hướng.
disable-model-invocation: true
---

# Align — Align Before You Build

Run **align-loop** using **domain-modeling** — the same pairing as Matt `grill-with-docs`: grill the plan **and** write vocabulary and hard decisions down as they land.

Close the communication gap before `/pm`, `/to-prd`, `/design`, or `/dev`. Do not substitute `/pm` discovery, a PRD draft, or a feature list for the grill.

Run `/setup` first if `docs/agents/` is missing.

## Session

Follow [voice.md](../../docs/agents/voice.md) in chat — natural assistant, plain language.

1. Read `CONTEXT.md` if present
2. Run **align-loop** — one question, A–D, one **(Recommended)**, codebase-first when possible
3. Run **domain-modeling** throughout — challenge terms in questions, probe edge-case scenarios, update `CONTEXT.md` inline when a term resolves (show the user the line), offer ADRs only when the three-part test passes

## It's working if

- One question at a time with **A–D** and **(Recommended)** — user reacts to a proposal, not a blank prompt
- Terms land in `CONTEXT.md` the moment they resolve — not batched at the end
- The agent reads the codebase to answer its own questions where it can, then reports findings before A–D
- ADRs stay rare — reversible choices are not rubber-stamped
- No PRD, no user stories, no premature handoff while branches are still open

## Handoff

Enter only when align-loop completion criteria are met and the user confirms the decision summary.

| Next step | When                                                                       |
| --------- | -------------------------------------------------------------------------- |
| `/pm`     | Need discovery interview, formal PRD, stories, or prioritization           |
| `/to-prd` | Conversation is aligned — synthesize lean PRD and publish to issue tracker |
| `/dev`    | Small, well-bounded change with clear seams                                |
| `/design` | UI flows or design specs needed before implementation                      |

End with:

```
## Decisions
- [bullet list]

## Open Questions
- [if any]

## Next Step
→ /pm | /to-prd | /design | /dev
```

**Completion criterion:** Handoff block delivered with `## Next Step` pointing to exactly one of `/pm`, `/to-prd`, `/design`, or `/dev`.

Alignment is **interactive** — stay in this chat for the whole grill. There is no `align-agent` subagent; subagents run autonomously and cannot wait for one answer per turn.
