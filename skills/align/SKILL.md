---
name: align
description: Align on a plan before building — relentless grill (design tree, lettered options), sharpen domain language, update CONTEXT.md and ADRs as you go. Invoke with /align, grill, làm rõ kế hoạch, chốt hướng.
disable-model-invocation: true
---

# Align — Align Before You Build

Run **align-loop** using **domain-modeling** — the same pairing as Matt `grill-with-docs`: grill the plan **and** write vocabulary and hard decisions down as they land.

Close the communication gap before `/reqs`, `/to-prd`, `/design`, or `/dev`. Do not substitute `/reqs` discovery, a PRD draft, or a feature list for the grill.

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
- Open-questions audit runs before a leaving skill — `## Open Questions` is never silently empty when
  implementer-facing gaps remain
- No PRD and no user stories during the grill. An open branch's next step is continue `/align`, not silence
- Every turn that records a decision ends with `## Next Step`

## Handoff

`## Next Step` closes every turn that records a decision, and any turn where the user asks what is next
(`what next?`, bước tiếp). Do not wait for the final summary. The grill-format shape rule must not drop
this block — see [Turn closer](../align-loop/GRILL-FORMAT.md#turn-closer).

**Open questions gate** — before pointing to `/to-prd`: if the audit found unsettled items, list them under
`## Open Questions` and ask the **open-questions confirmation** turn
([GRILL-FORMAT.md](../align-loop/GRILL-FORMAT.md)). `/to-prd` is valid only when open questions are **zero**,
or the user picked **B** and confirmed the deferred list — never with a silently empty section while
implementer-facing gaps remain (that is how `/to-prd` surfaces markers the user never saw). While a branch
is still open, the preferred next step is `→ /align`.

## When `/reqs` vs `/to-prd` vs `/align`

Same decision tree in `/reqs` and `/to-prd` — keep in sync:

```
Decisions / problem statement clear?
├─ Yes, aligned chat ready to ship a PRD → tell user to invoke `/to-prd`
│     (lean template, publish to tracker — `/reqs` does NOT publish)
├─ No — need design-tree grill (tech forks, domain terms) → continue `/align` (or restart)
└─ No — need requirements discovery, enterprise PRD, stories, or prioritization → tell user to invoke `/reqs`
      (draft in chat or docs/prd/; does NOT create tracker issues)
```

When suggesting `/to-prd`, say so explicitly (e.g. gõ `/to-prd`) — do not say only "viết PRD" (easy to
confuse with `/reqs`).

| Next step | When                                                                                  |
| --------- | ------------------------------------------------------------------------------------- |
| `/align`  | A branch is still open — name the next decision; do not ask that question in this turn |
| `/to-prd` | Decisions confirmed; open questions resolved **or** user confirmed deferral to PRD    |
| `/reqs`   | Need discovery interview, enterprise PRD (chat), stories, or prioritization           |
| `/dev`    | Small, well-bounded change with clear seams                                           |
| `/design` | UI flows or design specs needed before implementation                                 |

Pick **one** preferred next skill from the table (at most two if the fork is genuinely
ambiguous — each line with when/why). Do **not** paste a `|`-joined menu.

Mid-grill (the common turn):

```
## Next Step
→ /align — next decision: whether an editor may change the graph from chat
```

Final close — tree settled and the user confirmed the summary. Other leaving skills: see the when-table.

```
## Decisions
- [bullet list]

## Open Questions
- [each item — or "none" only after audit confirms zero unsettled implementer-facing details]

## Next Step
→ /to-prd
```

Two-option example only when continue vs leave is a real fork:

```
## Next Step
→ /align — the write-permission branch is still open
→ /dev — read-only scope is enough to implement now
```

**Completion criterion:** Every decision turn, and every "what next?" turn, ends with `## Next Step`;
`## Open Questions` matches the audit before a leaving skill (not silently empty); user confirmed
deferral before `## Next Step` → `/to-prd` when any item remains; the closer names one preferred skill
(two max with when/why). `/align` counts: it names the next branch and does not ask that question.

Alignment is **interactive** — stay in this chat for the whole grill. There is no `align-agent` subagent; subagents run autonomously and cannot wait for one answer per turn.
