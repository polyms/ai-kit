# PRD Interview

Discovery script for `/reqs` when the problem statement or scope boundary is missing. Questions 1–9, then
confirmation, then the behavior pass, then [enterprise-prd-template.md](enterprise-prd-template.md).

Adapted from the interviews on
[AI PRD Generator](https://thehuman2ai.com/product/prompts/prd-generator),
[FRD](https://thehuman2ai.com/product/prompts/frd-generator),
[BRD](https://thehuman2ai.com/product/prompts/brd-generator),
[SRD](https://thehuman2ai.com/product/prompts/srd-generator), and
[QRD](https://thehuman2ai.com/product/prompts/qrd-generator). Kit rules win on conflict: one enterprise
PRD, `[NEEDS CLARIFICATION]` markers, prose language from `docs/agents/language.md`.

## How to ask

- One numbered question per turn. Do not paste the list. Skip a question the conversation already settled.
- When the answer lacks a specific — who, how often, a number, an exclusion, a non-user — ask one
  follow-up, then move on.
- Record "no data yet" as the user said it. The gap becomes `[NEEDS CLARIFICATION]` in the draft. Do not
  invent a metric, a persona, or a deadline.
- When question 7 or 8 opens a real technical fork, stop and tell the user to invoke `/align`. Do not offer
  lettered options here.

## Questions

1. What is the product or feature called? One sentence.
2. What do people do today, what problem does that cause, who suffers, how often, and what evidence or
   quantity exists (hours, error rate, cost)? "No number yet" is a valid answer.
3. Who is the target user — role, context, team or company size? Who is explicitly not a user? Who must
   approve, or is affected, besides that user?
4. What key actions can that user perform?
5. What is definitely out of scope for this version? Push until the exclusion list is specific. A long out
   list makes a sharper PRD.
6. How will we know it worked? Metric, target, and how it is measured. A metric name without a target is a
   valid answer — record it that way.
7. What constraints apply — stack, integrations, performance, security, compliance, budget? When they name
   a performance, security, or availability target, ask whether missing it blocks release or is only tracked.
   A named quality concern with no number stays `[NEEDS CLARIFICATION]`. Do not fill an industry default.
8. What risks do you see, and what does success depend on? If they have not said so, one follow-up: has this
   already failed, and what would have caught it?
9. Is there a deadline? Is it hard?

## Confirmation

Restate, in one short block: product sentence, problem and who suffers, primary user, who is not a user, in
scope (from the key actions), out of scope. Ask the user to confirm.

If the PRD author is unknown, ask for the name once in this same turn.

Confirmation completes the Discovery Workflow in [SKILL.md](SKILL.md). Do not draft yet.

## Behavior pass

Run from the PRD workflow, after confirmation. Gate: business rules, error behavior, stored data,
integrations, or model-output behavior are still unknown. Same asking rules as above. "None" is a valid
answer — delete the matching template subsection and note that deletion in the Appendix.

1. What business rules apply? Push until the rule names a threshold, a role, or a time window. "Refunds need
   approval" is not done. "Refunds above $200 require a user with the manager role" is.
2. For each main workflow, what goes wrong — invalid input, lost connectivity, a dependent system down?
3. What data is stored or processed? Entities and fields. "None" when the feature stores nothing.
4. Which other systems does this talk to, and what data moves each way? "None" when it is isolated.
5. Does any user-facing behavior come from a model, so the same input can be wrong or different each time?
   If no, stop this question. If yes, ask the rest one at a time. "None" deletes that bullet in **Model
   behavior**:
   - Would a rule or a simpler screen remove the same friction?
   - Does the model act, or does a person confirm before anything changes?
   - When the answer is wrong, how does the user know, and how do they recover?
   - What does the model read, how old may that data be, and whose permissions apply?
   - What must it refuse, and when does a human take over?
   - How will we know the output is good enough for the user?

Then fill the enterprise template.
