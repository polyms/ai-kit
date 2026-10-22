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
- No PRD and no user stories during the grill. An open branch is the next **Q:**, not a `## Next Step`
- After each pick, the same reply asks the next question while a branch is open. The settling reply is
  the leaving block, not another question

## Handoff

Grill turns are questions while a branch is open. After the user picks, record the decision and ask the
next open question in that same reply. Do not close that reply with `## Next Step`. If they ask what is
next while a branch is open, ask that question. The reply that settles the tree does not add a question.

`## Next Step` is only the leaving reply: the tree just settled, the user asked to close, or they confirmed
deferral. That same reply carries `## Decisions`, `## Open Questions`, and `## Next Step`. Do not stop on
a summary that asks them to confirm later. See [Turn closer](../align-loop/GRILL-FORMAT.md#turn-closer).

**Open questions gate** — before pointing to `/to-prd`: if the audit found unsettled items, list them under
`## Open Questions` and ask the **open-questions confirmation** turn
([GRILL-FORMAT.md](../align-loop/GRILL-FORMAT.md)). `/to-prd` is valid only when open questions are **zero**,
or the user picked **B** and confirmed the deferred list — never with a silently empty section while
implementer-facing gaps remain (that is how `/to-prd` surfaces markers the user never saw). An open branch
is still a grill question, not `→ /align`.

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

| Next step | When                                                                               |
| --------- | ---------------------------------------------------------------------------------- |
| `/to-prd` | Decisions confirmed; open questions resolved **or** user confirmed deferral to PRD |
| `/reqs`   | Need discovery interview, enterprise PRD (chat), stories, or prioritization        |
| `/dev`    | Small, well-bounded change with clear seams                                        |
| `/design` | UI flows or design specs needed before implementation                              |

Pick **one** preferred leaving skill (at most two if the fork is genuinely ambiguous — each line with
when/why). Do **not** paste a `|`-joined menu. Do **not** list `/align` here: an open branch is the next
**Q:**.

```
## Decisions
- [bullet list]

## Open Questions
- [each item — or "none" only after audit confirms zero unsettled implementer-facing details]

## Next Step
→ /to-prd
```

(Example assumes lean publish is ready. Other picks: see the when-table.)

Two leaving skills only when that fork is real:

```
## Next Step
→ /to-prd — decisions confirmed; ready to publish a lean PRD
→ /design — UI-heavy; flows must land before tracker publish
```

**Completion criterion:** While a branch is open, the reply asks the next question and has no
`## Next Step`. The leaving reply names one preferred skill (two max with when/why). `## Open Questions`
on that reply matches the audit (not silently empty). `→ /to-prd` only when that audit is empty, or the
deferral pick is the message this reply answers.

Alignment is **interactive** — stay in this chat for the whole grill. There is no `align-agent` subagent; subagents run autonomously and cannot wait for one answer per turn.
