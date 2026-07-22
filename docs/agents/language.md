# Language

The language skills write into persistent repo docs for **this** repo (ai-kit).

## Scope

**Applies to:** `CONTEXT.md`, `docs/adr/`, PRDs, `docs/design/*.md`, `docs/agents/*.md`.

**Does not apply to:** chat replies — match the user's session language and IDE/user rules (or
`.cursor/rules/agent-voice.mdc` when `/setup` voice was opted in).

## Language

English — matches this repo's existing `CONTEXT.md` and `docs/adr/`.

## Consumers

`domain-modeling`, `reqs`, `to-prd`, `design`, `arch`, `to-issues` read this file and write in English.

## Rules

### One prose language

Headings, sentences, stories, success criteria, and comments use **English** — natural register a stakeholder
can skim. If a contributor writes in Vietnamese, still write the artifact in English — flag the mismatch
rather than silently switching. Do **not** sprinkle Vietnamese clauses mid-sentence; keep VI only for required
product copy strings (locale samples, quoted UI).

### Pure-tech tokens

Code, identifiers, paths, skill invokes (`/reqs`), protocols (OAuth, WCAG), product proper nouns, and
canonical `CONTEXT.md` glossary tokens stay as written — do not invent translated spellings for them.

When a consumer repo sets Language to Vietnamese (or another non-English language) via `/setup`, apply the
full prose-vs-token rules and anti-mix examples in the template at `skills/setup/language.md` — **SSOT** for
that case: prose in the confirmed language; only pure-tech tokens stay English.
