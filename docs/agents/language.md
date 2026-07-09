# Language

The language skills write into persistent repo docs for **this** repo (ai-kit).

## Scope

**Applies to:** `CONTEXT.md`, `docs/adr/`, PRDs, `docs/design/*.md`, `docs/agents/*.md`.

**Does not apply to:** chat replies — those match whichever language the user is typing in for that session (see `docs/agents/voice.md`). Code, identifiers, file paths, commit messages, and technical vocabulary stay in English regardless of this setting.

## Language

English — matches this repo's existing `CONTEXT.md` and `docs/adr/`.

## Consumers

`domain-modeling`, `pm`, `to-prd`, `design`, `arch`, `to-issues` read this file and write in English.

## Rules

- One language per repo — do not mix within a single artifact
- Headings, prose, and comments in English; code and identifiers in English
- If a contributor writes in Vietnamese, still write the artifact in English — flag the mismatch rather than silently switching
