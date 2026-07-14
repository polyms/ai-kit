# Language

The language skills write into persistent repo docs.

## Scope

**Applies to:** `CONTEXT.md`, `docs/adr/`, PRDs, `docs/design/*.md`, `docs/agents/*.md`, and other files that outlive the conversation.

**Does not apply to:** chat replies — match the user's session language and IDE/user rules (or
`.cursor/rules/agent-voice.mdc` when `/setup` voice was opted in). Code, identifiers, file paths, commit
messages, and technical vocabulary (seam, ADR, PRD, sortOrder, …) stay in English regardless of this setting.

## Language

[Vietnamese | English | other — set during `/setup`]

## Consumers

Skills that write persistent docs read this file and write in the confirmed language:

- `domain-modeling` — `CONTEXT.md`, glossary entries
- `reqs`, `to-prd` — PRDs, user stories, acceptance criteria
- `design` — `docs/design/<feature>.md`
- `arch` — ADRs in `docs/adr/`
- `to-issues` — issue bodies on the tracker

No `docs/agents/language.md`: skills match the language of the existing docs they're editing; if none exist, ask the user once and note the answer here.

## Rules

- One language per repo — do not mix within a single artifact
- Headings, prose, and comments in the confirmed language; code and identifiers in English
- If a user writes in a different language than this file specifies, still write the artifact in the confirmed language — flag the mismatch rather than silently switching
