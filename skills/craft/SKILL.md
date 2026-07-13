---
name: craft
description: Reference for writing and editing ai-kit skills — predictability, invocation, pruning. Invoke with /craft, viết skill, chỉnh skill, audit skill, review skill, rà soát skill, authoring SKILL.md, or editing skills in this repo.
disable-model-invocation: true
---

# Craft — Writing Great Skills

Adapted from [Matt Pocock's `writing-great-skills`](https://github.com/mattpocock/skills/tree/main/skills/productivity/writing-great-skills). A skill wrangles determinism out of a stochastic system. **Predictability** — same _process_ every run, not same output — is the root virtue.

**Bold terms** are defined in [glossary.md](glossary.md).

## ai-kit Conventions

When authoring skills in this repo:

| Rule                       | Example                                                                         |
| -------------------------- | ------------------------------------------------------------------------------- |
| Short invoke name          | `/pm`, `/align`, `/dev` — not `/product-management`                             |
| Slash in invoke context    | `/name` in pipeline, handoffs, Invoke column — all skills                       |
| No slash in delegation     | `Run align-loop`, `Use arch`, reaches `dev` — model-invoked only                |
| Folder = skill name        | `skills/pm/SKILL.md` → `name: pm`                                               |
| Optional agent             | `agents/<name>-agent.md` for isolated deep work (`pm-agent`, `design-agent`, …) |
| Templates in sibling files | `enterprise-prd-template.md`, linked from `SKILL.md`                            |
| User-invoked by default    | `disable-model-invocation: true` unless agent must auto-reach                   |
| Bilingual descriptions     | WHAT in English; triggers in EN + VI (users mix both languages)                 |
| No Cursor built-ins        | Do not copy `skills-cursor/` content                                            |

Structure:

```
skills/<name>/
├── SKILL.md          # required
├── *.md              # optional reference/templates
└── scripts/          # optional utilities
```

## Invocation

Repo rules: [docs/agents/invocation.md](../../docs/agents/invocation.md). Setup deps: [ADR-0001](../../docs/adr/0001-skill-setup-dependencies.md).

See **User-invoked by default** in ai-kit Conventions above. Vocabulary: [glossary.md](glossary.md) — **Model-invoked**, **User-invoked**, **Context load**, **Router skill**.

Pick model-invocation only when the agent must reach the skill on its own, or another skill must. Classify **hard vs soft** `/setup` dependency before writing prerequisites.

When user-invoked skills multiply, add a **router skill** — one user-invoked skill naming others and when to reach each.

## Writing the Description

**Bilingual triggers (ai-kit):** State WHAT in English for precision. Add WHEN triggers in **both English and Vietnamese** — users switch languages mid-session. One trigger per branch; collapse synonyms.

Model-invoked descriptions do two jobs — state what the skill is, list **branches** that trigger it:

- **Front-load the leading word**
- **One trigger per branch** — collapse synonym duplication
- **Cut identity already in the body** — triggers + "when another skill needs…" reach clauses only

## Information Hierarchy

Content ranked by how immediately the agent needs it:

1. **In-skill step** — ordered action in `SKILL.md`. Each step ends on a **completion criterion** — checkable and, where it matters, exhaustive.
2. **In-skill reference** — definition, rule, or fact in `SKILL.md`, consulted on demand.
3. **External reference** — sibling file reached by **context pointer**, loaded only when pointer fires.

**Progressive disclosure** — push reference down the ladder so the top stays legible. Inline what every **branch** needs; pointer what only some branches reach.

**Co-location** — keep a concept's definition, rules, and caveats under one heading.

## When to Split

Split only when the cut earns its load cost:

- **By invocation** — distinct **leading word** needs its own model-invoked skill
- **By sequence** — later **post-completion steps** tempt **premature completion** on the current step

## Pruning

- **Single source of truth** — one authoritative place per meaning
- **Relevance** — does the line still bear on what the skill does?
- **No-op test** — does the line change behaviour vs the default? Delete whole sentences that fail.

## Leading Words

Compact pretrained concepts the agent thinks with (_tight_, _red_, _tracer bullets_). Anchor execution in the body; anchor invocation in the description. Collapse restated triads into one token.

## Failure Modes

| Mode                     | Cure                                                                     |
| ------------------------ | ------------------------------------------------------------------------ |
| **Premature completion** | Sharpen completion criterion first; split sequence only if still rushing |
| **Duplication**          | Single source of truth                                                   |
| **Sediment**             | Prune stale layers aggressively                                          |
| **Sprawl**               | Disclose reference behind pointers; split by branch or sequence          |
| **No-op**                | Stronger leading word or delete the line                                 |

## Workflow — Edit or Create a Skill

1. Read existing skill if editing; match its voice and structure

   **Completion criterion:** Existing patterns and voice identified, or greenfield scope confirmed.

2. Draft `name` + `description` (third person, WHAT + WHEN)

   **Completion criterion:** Frontmatter has valid `name`, bilingual WHEN triggers, and correct invoke mode.

3. Outline steps with completion criteria, or flat reference if no sequence

   **Completion criterion:** Every step has a checkable completion criterion, or reference-only layout is justified.

4. Push detail to sibling files — keep `SKILL.md` under 500 lines

   **Completion criterion:** `SKILL.md` under 500 lines; references one level deep.

5. Run failure-mode checklist above before finishing

   **Completion criterion:** Failure-mode checklist passed with no unresolved duplication, sprawl, or no-op issues.
