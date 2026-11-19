---
name: review
description: Challenge product requirements, business decisions, delivery plans and other work artifacts
  against evidence. Use for adversarial review, gap analysis, risk review, rà soát tài liệu, phản biện. Unaccented Vietnamese examples include ra soat proposal, phan bien.
---

# Review

Use [review-template.md](review-template.md) and the shared work artifact standard
(`docs/agents/work-artifact-standard.md`).

1. Establish the artifact, its version, intended audience and review goal. Read source requirements
   and agreed decisions before judging the artifact; mark unavailable evidence.
2. Identify ambiguity, contradictions, scope gaps, unverifiable claims, missed exceptions and
   untested assumptions. Check security, accessibility, privacy, migration and cost where relevant.
3. Challenge the strongest premise: what evidence would contradict it, what breaks if it is wrong,
   and what is the smallest useful validation? Consider the status quo and alternatives.
4. Record each material finding with a location or source, impact, confidence, and actionable fix.
   Distinguish blockers, important improvements and optional suggestions. Do not manufacture findings.
5. Recommend proceed, proceed with conditions, revise, or insufficient evidence. Do not imply approval.
   Revise the artifact only if asked; preserve established scope and track suggested changes.

**Done when:** Findings are grounded, prioritized, actionable and independent of the author's intent.

Use `code-review` for source-code changes. Use `qa` to execute or assess tests, not to review prose.
