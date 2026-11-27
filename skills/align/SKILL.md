---
name: align
description: Align on a plan before building — relentless grill (design tree, lettered options), sharpen domain language, update CONTEXT.md and ADRs as you go. Invoke with /align, grill, làm rõ kế hoạch, chốt hướng.
disable-model-invocation: true
---

# Align — Align Before You Build

**All hosts:** Read [portable skill standard](../../docs/agents/portable-skills.md) and the target execution profile. Use actual authorized tools and verified target revision. If a gate cannot be performed, report it as blocked; do not invent execution, approval or delegation.

Use `/align` for the combined alignment session only. For decision-tree questioning alone use `align-loop`; for glossary or ADR changes alone use `domain-modeling`. Do not repeat approved decisions.

**Codex / GitHub Copilot:** Apply [client compatibility](../../docs/agents/client-compatibility.md) before this workflow.

Run `align-loop` using `domain-modeling` — the same pairing as Matt `grill-with-docs`: grill the plan **and** write vocabulary and hard decisions down as they land.

Close the communication gap before `/reqs`, `/design`, or `/dev`. Do not substitute `/reqs` discovery, a PRD draft, or a feature list for the grill.

Read confirmed context if available; missing setup is not a reason to auto-run it. Block only actions requiring unresolved policy.

## Session

Chat tone: ambient IDE/user rules. If `.cursor/rules/agent-voice.mdc` exists (opt-in `/setup`), follow it.

1. Read `CONTEXT.md` if present
2. Run `align-loop` — one question, lettered options (2–4 real forks), one **(Recommended)**, codebase-first when possible
3. Run `domain-modeling` throughout — challenge terms in questions, probe edge-case scenarios, update `CONTEXT.md` inline when a term resolves (show the user the line), offer ADRs only when the three-part test passes

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

**Open questions gate** — before pointing to `/reqs` (lean synthesis/publication): if the audit found unsettled items, list them under
`## Open Questions` and ask the **open-questions confirmation** turn
([GRILL-FORMAT.md](../align-loop/GRILL-FORMAT.md)). `/reqs` (lean synthesis/publication) is valid only when open questions are **zero**,
or the user picked **B** and confirmed the deferred list — never with a silently empty section while
implementer-facing gaps remain (that is how `/reqs` (lean synthesis/publication) surfaces markers the user never saw). An open branch
is still a grill question, not `→ /align`.

## Choose the next reqs workflow or continue alignment

Use the routing rules in reqs:

```
Decisions / problem statement clear?
├─ Yes, aligned chat ready to ship a PRD → tell user to invoke `/reqs` (lean synthesis/publication)
│     (lean template; publish only when authorized)
├─ No — need design-tree grill (tech forks, domain terms) → continue `/align` (or restart)
└─ No — need requirements discovery, enterprise PRD, stories, or prioritization → tell user to invoke `/reqs`
      (draft in chat or docs/prd/; does NOT create tracker issues)
```

When suggesting `/reqs` (lean synthesis/publication), say so explicitly (e.g. gõ `/reqs` (lean synthesis/publication)) — do not say only "viết PRD" (easy to
confuse with `/reqs`).

| Next step | When                                                                               |
| --------- | ---------------------------------------------------------------------------------- |
| `/reqs` (lean synthesis/publication) | Decisions confirmed; open questions resolved **or** user confirmed deferral to PRD |
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
→ /reqs
```

(Example assumes lean publish is ready. Other picks: see the when-table.)

Two leaving skills only when that fork is real:

```
## Next Step
→ /reqs — decisions confirmed; ready to publish a lean PRD
→ /design — UI-heavy; flows must land before tracker publish
```

**Completion criterion:** While a branch is open, the reply asks the next question and has no
`## Next Step`. The leaving reply names one preferred skill (two max with when/why). `## Open Questions`
on that reply matches the audit (not silently empty). `→ /reqs` only when that audit is empty, or the
deferral pick is the message this reply answers.

Interactive alignment stays in the conversation. For delegated runs without an interactive user, use the decision-loop handoff: resolve from approved evidence, report the highest blocking fork and stop dependent work. Never invent a decision.
