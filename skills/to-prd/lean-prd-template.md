# Lean PRD Template

Lean template for `/to-prd` — synthesize from conversation, publish to the issue tracker. Enterprise discovery
PRD (chat only, no publish) uses `/reqs`'s [enterprise-prd-template.md](../reqs/enterprise-prd-template.md).

**Audience:** A PM or stakeholder reading the **tracker issue** must understand the product without opening
the repo. Agents may consume the same body — structure helps them; **prose serves humans first**.

**Canonical home:** Tracker issue body. `docs/prd/` is a mirror of the same prose (links may differ; stories
and decisions must match). Do **not** put a "repo canonical / glossary / align notes" banner under the title —
that belongs in **Repo references** at the end, if at all.

**Cross-references:**

| Prefer (main body)                       | Defer to end (`## Repo references`)                            |
| ---------------------------------------- | -------------------------------------------------------------- |
| Tracker issues (`#12`, `SPROMPT-2`, URL) | Repo paths (`docs/…`, `CONTEXT.md`, `apps/…`, `lib/…`)         |
| Named decisions in plain language        | ADR file paths — summarize the decision; path only in appendix |
| Glossary meaning written once in prose   | “see CONTEXT.md” as a substitute for definition                |

**Voice:** Full sentences in `docs/agents/language.md`'s confirmed language — natural register, not
EN/VI collage. Keep English only for **pure-tech tokens** (invokes, protocols, identifiers, canonical
glossary terms); rewrite ordinary adjectives and clauses into the prose language. Name who hurts and what
changes in product terms. Do **not** ship wave rollups, code-identifier laundry lists, or agent-only
shorthand (e.g. `"W1 P0 #1–9: tenancy..."`). Bold glossary tokens sparingly — define the idea in a sentence
first.

**Anti-patterns (seen on bad tracker PRDs):**

| Avoid                                                         | Do instead                                                |
| ------------------------------------------------------------- | --------------------------------------------------------- |
| Banner of `docs/prd/…` · `CONTEXT.md` · align notes under H1  | Start with **Related Issues** or **Problem Statement**    |
| Mid-body “Tài liệu tham chiếu” / “see docs/…” as requirements | Write the requirement; path only in **Repo references**   |
| Story titled only `US#17` / `§8.5` / `Wave W3`                | Title the human outcome; section refs secondary if useful |
| Strikethrough archaeology for cut scope                       | Delete it, or list under **Out of Scope**                 |
| Related issue links to the project issues **index**           | Link the specific issue key or URL                        |

**Ambiguity rule:** never guess silently. When the conversation did not settle a detail the implementer will
need — a threshold, a method, a behavior on failure — write `[NEEDS CLARIFICATION: the specific question]`
inline where the gap is. A PRD with honest markers beats a PRD with invented answers: markers get resolved in
review; invented answers get shipped.

Copy this structure when writing a PRD. Replace bracketed placeholders. Do not leave empty headers.

---

# PRD: [Feature / Initiative Name]

## Related Issues

Tracker issues this PRD depends on, extends, or supersedes. Use issue keys or URLs — not repo file paths, not
the project issues index.

- [SPROMPT-2](…) — [relationship: depends on / extends / supersedes / related]

Omit this section only when there are no related tracker issues.

## Problem Statement

The problem the user (or operator) faces, from **their** perspective. 1–3 short paragraphs. Who is blocked,
what they do today, why that is costly. Avoid dumping architecture or file layout here.

## Solution

What we will ship, from the user's perspective. Describe outcomes and capabilities in plain language.
Technical shape belongs under **Implementation Decisions**, still in readable prose — not a path inventory.
If you phase work into waves, name each wave in product terms and link child issues when they exist — do not
make “Wave W3 / §8.5” the only explanation.

## Success Criteria

How we know the feature works — measurable and technology-agnostic. 2–4 criteria, each checkable after ship (a
number, a threshold, or a binary outcome — not "works well").

1. [e.g. User can complete X in under N steps]
2. [e.g. Zero manual steps remain in workflow Y]

## User Stories

Prioritized, numbered user stories. Format:

`As an <actor>, I want a <feature>, so that <benefit>`

**Actors:** Prefer human roles a stakeholder recognizes (engineer, ops author, on-call, maintainer, student).
If the consumer is an agent skill, say so in plain language ("an engineer running `/dev` in Cursor") — not
bare backtick role ids as the only framing.

Rules that make the list useful downstream (`/to-issues` slices along these lines):

- **Prioritize:** tag each story **P0** (core — the feature is pointless without it), **P1** (important), or
  **P2** (nice-to-have). One line of _why this priority_ for each P0.
- **Independent:** each story must be independently testable — implementing only the P0 stories should still
  yield a viable, deployable slice. If a story only makes sense together with another, merge them.
- **Extensive:** cover all aspects of the feature, including error, empty, and permission states.
- **Readable:** each story is a full sentence a PM can skim; no packed identifier lists; no `US#n`-only
  titles.

For each P0 story, add acceptance scenarios:

```
Given [initial state], when [action], then [outcome]
```

## Implementation Decisions

Decisions already made — enough for `/to-issues` and `/dev` without inventing product intent. Prefer short
paragraphs or bullets that state **what** and **why**.

May include: modules or seams to touch (by capability name), interface changes, schema or API contracts,
architectural choices, specific interactions.

Do **not** make this section a file-tree or path dump. Do **not** rely on "see `docs/…`" as the decision —
write the decision here; put the path under **Repo references** if useful for someone with the repo open.

Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state
machine, reducer, schema, type shape), inline it within the relevant decision and note briefly that it came
from a prototype. Trim to the decision-rich parts — not a working demo.

## Testing Decisions

Testing decisions that were made. Include:

- What makes a good test for this feature (prefer external behavior over implementation details)
- Which capabilities or modules will be tested
- Prior art (similar tests already in the codebase — describe by behavior; path optional under
  **Repo references**)

## Out of Scope

What this PRD explicitly does **not** cover, with a brief reason when helpful. Put cut or deferred work here —
do not leave struck-through leftovers in **Solution** or **User Stories**.

## Open Questions

Collect every `[NEEDS CLARIFICATION]` marker from the sections above here, as a checklist. Empty section = no
markers = the conversation settled everything.

`/align` and `/to-prd` both gate on this section — markers appear only after the user confirms deferral in the
open-questions audit (align handoff or `/to-prd` step 3).

- [ ] [question — where it blocks]

## Further Notes

Optional product notes that did not fit above (phasing suggestions for `/to-issues`, migration caution,
stakeholder context). Keep this human-readable. Prefer linking related **issues** here if they did not fit in
**Related Issues**.

## Repo references

Optional appendix for readers who have the repository open. **Not required** to understand the PRD on the
tracker. List paths, ADR filenames, or glossary file pointers that extend the prose above — do not move
primary requirements into this section.

Examples:

- `docs/prd/<slug>.md` — repo mirror of this tracker PRD
- `CONTEXT.md` — glossary terms already defined in prose above
- `docs/adr/000N-….md` — ADR that records [decision summary in one clause]
- `docs/agents/….md` — agent pointer docs touched by this work

Omit the entire section when there is nothing useful to add.
