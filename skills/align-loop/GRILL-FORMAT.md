# Grill Question Format

Used by **align-loop** (and any skill that delegates to it: `/align`, `/triage`, `/arch-refactor`).

Shape only — one short lead-in sentence, then **Q:** and lettered options. No section headings in the
grill body. Do not append `## Next Step` to a grill question; that closer is only for a turn that leaves
the grill. Persona (if any) is opt-in via `/setup` → `.cursor/rules/agent-voice.mdc`, not this file.

## Shape

Every grill turn is **one decision**, **one question**, **2–4 lettered options** — as many as the decision actually has, not always four:

```markdown
**Q:** [One sentence — the decision in plain language]

**A.** [Option — trade-off named]

**B.** [Option] **(Recommended)** — [one-line why: codebase, CONTEXT.md, constraint, prior pick]

**C.** [Option — only when a third real strategy exists]
```

Rules:

- **Count by quality, not quota** — two sharp options beat four with filler; three is common; four only
  when a fourth is a real alternative
- Exactly one **(Recommended)** — user reacts to your proposal, not a blank prompt
- Options must be **mutually exclusive** outcomes or clearly different strategies — no straw men to pad
  the list
- **One paragraph per option** — blank line between **A.** / **B.** / **C.**. Chat markdown joins
  consecutive lines into one unreadably long paragraph. Persona density rules do not collapse options onto
  one line, and do not inline "pick A, B, or C?" in the lead-in
- After the user picks or refines, record it in one short line. While a branch is open, ask that next
  grill question in the same reply. One question, and no `## Next Step` on that reply. If the pick
  settles the tree, the same reply is the leaving block, not another question
- User may answer with a letter, "B but…", or propose the next letter if their pick wasn't listed

### How many options?

| Situation                                   | Count           | Example                            |
| ------------------------------------------- | --------------- | ---------------------------------- |
| Binary decision                             | **2**           | ship now vs defer; allow vs block  |
| Clear third path (defer, hybrid, scope cut) | **3**           | yes / no / defer to v2             |
| Genuinely four distinct strategies          | **4**           | calibration dial, multi-module cut |
| Would need a weak D                         | **Stop at 2–3** | user adds the next letter in reply |

## Codebase-first

When code or `CONTEXT.md` can narrow the answer:

1. Read the relevant files (brief search is fine)
2. Report findings in **one short paragraph** — paths or symbols if helpful
3. Offer lettered options **grounded in what you found** — only as many as the finding supports

```markdown
**Found:** `OrderService.cancel()` always voids the whole order — no partial path in `src/ordering/`.

**Q:** Do we need line-item cancellation in this change?

**A.** Yes — extend model and API **(Recommended)** — matches how support talks about "cancel line 2"

**B.** No — whole-order only; document the limit

**C.** Defer — ship whole-order first; partial in v2
```

Binary (two options only):

```markdown
**Found:** Feature flag `partial_cancel` is off in prod and no callers reference line-level cancel.

**Q:** Block partial cancel at the API until v2?

**A.** Yes — reject at API; whole-order only **(Recommended)** — matches current code path

**B.** No — add partial cancel in this change
```

Vietnamese (same shape; match the user's address forms):

```markdown
Em vừa xem `OrderService.cancel()` — hiện chỉ hủy cả đơn, chưa hủy từng dòng.

**Q:** Lần này mình có cần hủy từng dòng hàng không?

**A.** Có — mở rộng model + API **(Recommended)** — support hay mô tả kiểu "hủy dòng 2"

**B.** Không — chỉ hủy cả đơn; ghi rõ giới hạn

**C.** Để v2 — ship hủy cả đơn trước
```

## Calibration (session start)

One turn — when to ask, dials, defaults, and adaptation live in the **align-loop** skill body. Four levels are
real forks here. Vietnamese: same shape; match the user's address forms.

```markdown
**Q:** Before I grill deep — how comfortable are you with this topic, and how hard should I push?

**A.** New — brief teach on gaps, light pressure

**B.** Working knowledge — tradeoffs, standard pressure **(Recommended)**

**C.** Expert — skip basics; probe failure modes and reversibility

**D.** Expert + hard — sharp edge cases; demand observable validation
```

Free-text answers ("softer", "I wrote the ADR, grill hard") map to the align-loop dials.

## Domain boundary scenarios

When terms or relationships are fuzzy, invent a **concrete scenario** and put the boundary call in lettered
options. Pair with **domain-modeling** — update `CONTEXT.md` inline when the user picks.

```markdown
**Q:** Customer cancels one line from a shipped order. What happens to the remaining lines?

**A.** Remaining lines stay shipped — partial cancel is refund-only

**B.** Whole order re-enters fulfillment — cancel is all-or-nothing **(Recommended)** — matches current
`Order` aggregate

**C.** Split into child orders — each line is its own fulfillment unit going forward

**D.** Block partial cancel — force full order cancel or nothing
```

## Open-questions confirmation (handoff)

Used by `/align` handoff and `/to-prd` step 3 when the audit finds unsettled implementer-facing details.
List the items first, then one confirmation turn — three real forks:

```markdown
**Q:** These details are still unsettled: [list]. Resolve before the PRD?

**A.** Grill now — resolve before PRD **(Recommended)** when alignment looked "done" but gaps remain

**B.** Defer — each item ships as `[NEEDS CLARIFICATION]` in the published PRD; confirm the list

**C.** Cut — drop the feature aspect that depends on the unsettled detail
```

## Turn closer

Not part of a grill question. While a branch is open, ask it and do not append `## Next Step`. The reply
that settles the tree carries `## Next Step` and no further **Q:** (`/reqs`, `/to-prd`, `/design`, `/dev`
— when-table in the parent skill). Do not end on a summary that waits for another confirmation.

```markdown
## Next Step
→ /dev — seams are clear; no open branch left
```

## Anti-patterns

| Avoid                                               | Do instead                                                |
| --------------------------------------------------- | --------------------------------------------------------- |
| Prose recommendation without lettered options       | Always lettered options — count matches real forks        |
| Options stacked with no blank line (markdown joins) | Blank line between each **A.** / **B.** / **C.**          |
| Inline "pick A, B, or C?" in the lead-in            | Lead-in, then **Q:**, then separate option paragraphs     |
| Padding to four options with straw men              | Stop at 2–3; user can add the next letter in reply        |
| Two **Q:** blocks in one reply                      | One **Q:**; last pick is one line above it                |
| Ask what code already shows                         | Explore, report, then lettered options                    |
| Dump the whole decision tree upfront                | Descend the tree; parent before child                     |
| Robotic listing without a lead-in sentence          | One line why this decision is up now, then **Q:**         |
| Batch glossary updates at the end                   | `domain-modeling` writes each term when it resolves       |
| Hand off with "no open questions" while gaps remain | Open-questions audit; defer only with explicit user **B** |
| `## Next Step` instead of the next question         | Ask the next **Q:**; closer only when leaving the grill   |
| Glossary update, then stop                          | Next **Q:**, or the leaving block if the tree settled |
| Terse fragments on security or irreversible ops     | Auto-clarity — full warning, explicit order               |

## Auto-clarity

Stay concise by default — but **drop brevity** when compression would cost safety or clarity. Use full
sentences and explicit ordering; no fragments.

Switch to auto-clarity when:

- **Security** — auth flaws, injection, secret exposure, privilege escalation, unsafe defaults
- **Irreversible actions** — data loss, destructive migrations, force-push, prod config that cannot roll
  back cleanly
- **Ordered multi-step work** — deploy/migrate/run sequences where step order or prerequisites must not be
  misread
- **Ambiguity from terseness** — a shorter phrasing could be read two ways; spell out the intended reading

After the risky or ambiguous part is clear, return to normal grill turns (one lead-in, then **Q:**).

Example — destructive SQL:

> **Warning:** This permanently deletes every row in `users` and cannot be undone.
>
> ```sql
> DROP TABLE users;
> ```
>
> Verify a backup before running. After this step, continue the grill.
