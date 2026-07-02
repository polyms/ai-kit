# Glossary — Crafting Great Skills

Domain model for what makes a skill great. Root virtue: **Predictability**. Disclosed reference for [`craft`](SKILL.md).

Terms grouped by axis: **Invocation**, **Information Hierarchy**, **Steering**, **Pruning**. Each **failure mode** lives beside the lever that cures it.

## Predictability

Same _way_ on every run — same process, not same output. Root virtue every other term serves.

_Avoid_: consistency, reliability, robustness, output-determinism

## Invocation

### Model-Invoked

Keeps **description**; agent fires autonomously; human can still type name. Pays **context load** every turn. Other skills can reach it.

### User-Invoked

`disable-model-invocation: true` — invisible to agent; human-only. Zero **context load**; pays **cognitive load**.

### Description

Machine-readable trigger for model-invoked skills. Source of **context load**. Delete it → user-invoked.

### Context Pointer

Reference naming out-of-context material + condition for reaching it. Wording decides _when_ and _how reliably_.

### Context Load

Cost of model-invoked **description** always loaded. Brake on splitting into more model-invoked skills.

### Cognitive Load

Cost on human to remember user-invoked skills. Price of human agency — spend where judgement matters.

### Router Skill

User-invoked skill pointing at other user-invoked skills. Cure for cognitive load when skills multiply.

### Granularity

How finely skills are divided. More model-invoked → more **context load**. More user-invoked → more **cognitive load**.

## Information Hierarchy

### Steps

Ordered actions — primary tier when present. Each ends on **completion criterion**.

### Reference

Material consulted on demand. Prime candidate for **progressive disclosure**.

### External Reference

Reference outside skill system — plain file, not invocable. Shared home for user-invoked skills.

### Progressive Disclosure

Move **reference** behind **context pointer** so top stays legible.

### Co-location

Definition, rules, caveats under one heading — not scattered.

### Sprawl

_Failure mode._ Skill too long. Cure: hierarchy + split by branch or sequence.

## Steering

### Branch

Distinct invocation path through a skill.

### Leading Word

Pretrained concept anchoring behaviour (_tight_, _red_, _tracer bullets_). Serves predictability in body (execution) and description (invocation).

### Completion Criterion

Done condition for a unit of work. **Clarity** resists **premature completion**. **Demand** sets **legwork**.

### Legwork

Behind-the-scenes work within a step — reading, exploring, digging. Controlled by criterion demand and leading words.

### Post-Completion Steps

Steps after current step. Visible → pull toward **premature completion**. Hide by splitting sequence.

### Premature Completion

_Failure mode._ Ending step before genuinely done. Sharpen criterion first; hide later steps only if still rushing.

## Pruning

### Single Source of Truth

Each meaning in exactly one authoritative place.

### Duplication

_Failure mode._ Same meaning in multiple places. Costs maintenance and tokens.

### Relevance

Does the line still bear on what the skill does?

### Sediment

_Failure mode._ Stale layers never cleared. Default fate without pruning discipline.

### No-Op

_Failure mode._ Instruction that changes nothing vs default. Test: does it change behaviour?
