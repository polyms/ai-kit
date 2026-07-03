# Grill Question Format

Used by **align-loop** (and any skill that delegates to it: `/align`, `/triage`, `/arch-refactor`).

Voice: [docs/agents/voice.md](../../docs/agents/voice.md) — one short lead-in sentence, then **Q:** and A–D; no formal doc headings in chat turns.

## Shape

Every grill turn is **one decision**, **one question**, **3–4 lettered options**:

```markdown
**Q:** [One sentence — the decision in plain language]

**A.** [Option — trade-off named]
**B.** [Option] **(Recommended)** — [one-line why: codebase, CONTEXT.md, constraint, prior pick]
**C.** [Option]
**D.** [Option — include a real alternative, not a straw man]
```

Rules:

- Exactly one **(Recommended)** — user reacts to your proposal, not a blank prompt
- Options must be **mutually exclusive** outcomes or clearly different strategies
- After user picks or refines, **do not** ask the next question in the same turn
- User may answer with a letter, "B but…", or a new option **E**

## Codebase-first

When code or `CONTEXT.md` can narrow the answer:

1. Read the relevant files (brief search is fine)
2. Report findings in **one short paragraph** — paths or symbols if helpful
3. Offer A–D **grounded in what you found**

```markdown
**Found:** `OrderService.cancel()` always voids the whole order — no partial path in `src/ordering/`.

**Q:** Do we need line-item cancellation in this change?

**A.** Yes — extend model and API **(Recommended)** — matches how support talks about "cancel line 2"
**B.** No — whole-order only; document the limit
**C.** UI-only — show cancelled lines without backend change
**D.** Defer — ship whole-order first; partial in v2
```

Vietnamese (same shape, natural em/anh):

```markdown
Em vừa xem `OrderService.cancel()` — hiện chỉ hủy cả đơn, chưa hủy từng dòng.

**Q:** Lần này mình có cần hủy từng dòng hàng không?

**A.** Có — mở rộng model + API **(Recommended)** — support hay mô tả kiểu "hủy dòng 2"
**B.** Không — chỉ hủy cả đơn; ghi rõ giới hạn
**C.** Chỉ UI — hiển thị dòng đã hủy, backend giữ nguyên
**D.** Để v2 — ship hủy cả đơn trước
```

## Domain boundary scenarios

When terms or relationships are fuzzy, invent a **concrete scenario** and put the boundary call in A–D. Pair with **domain-modeling** — update `CONTEXT.md` inline when the user picks.

```markdown
**Q:** Customer cancels one line from a shipped order. What happens to the remaining lines?

**A.** Remaining lines stay shipped — partial cancel is refund-only
**B.** Whole order re-enters fulfillment — cancel is all-or-nothing **(Recommended)** — matches current `Order` aggregate
**C.** Split into child orders — each line is its own fulfillment unit going forward
**D.** Block partial cancel — force full order cancel or nothing
```

## Anti-patterns

| Avoid                                      | Do instead                                          |
| ------------------------------------------ | --------------------------------------------------- |
| Prose recommendation without A–D           | Always lettered options                             |
| Multiple questions in one turn             | One decision per turn                               |
| Ask what code already shows                | Explore, report, then A–D                           |
| Dump the whole decision tree upfront       | Descend the tree; parent before child               |
| Robotic listing without a lead-in sentence | One line why this decision is up now, then **Q:**   |
| Batch glossary updates at the end          | `domain-modeling` writes each term when it resolves |
