# Language

The language skills write into persistent repo docs.

## Scope

**Applies to:** `CONTEXT.md`, `docs/adr/`, PRDs, `docs/design/*.md`, `docs/agents/*.md`, and other files
that outlive the conversation.

**Does not apply to:** chat replies — match the user's session language and IDE/user rules (or
`.cursor/rules/agent-voice.mdc` when `/setup` voice was opted in).

## Language

[Vietnamese | English | other — set during `/setup`]

## Consumers

Skills that write persistent docs read this file and write in the confirmed language:

- `domain-modeling` — `CONTEXT.md`, glossary entries
- `reqs`, `to-prd` — PRDs, user stories, acceptance criteria
- `design` — `docs/design/<feature>.md`
- `arch` — ADRs in `docs/adr/`
- `to-issues` — issue bodies on the tracker

No `docs/agents/language.md`: skills match the language of the existing docs they're editing; if none exist,
ask the user once and note the answer here.

## Rules

### One prose language

Headings, sentences, stories, success criteria, and comments use the **confirmed language** — natural
register a stakeholder can skim without translating mid-sentence. If a user writes in a different language
than this file specifies, still write the artifact in the confirmed language — flag the mismatch rather than
silently switching.

### Pure-tech tokens stay English

Keep English **only** for tokens that have no natural prose substitute (or that `CONTEXT.md` defines as
canonical domain terms):

| Keep English                                                          | Translate / rewrite into the confirmed language               |
| --------------------------------------------------------------------- | ------------------------------------------------------------- |
| Code, identifiers, paths, env keys, commit subjects                   | Ordinary adjectives, verbs, clauses ("confident")             |
| Skill invokes and pipeline names (`/reqs`, `/to-prd`, `handoff`)      | Half-English marketing phrases ("living diagram")             |
| Protocols & standards (OAuth, WCAG, HTTP, CI)                         | Soft product description ("information-rich")                 |
| Product/vendor proper nouns (GitHub, Cursor, Umami)                   | Full English sentences inside confirmed-language body         |
| Canonical glossary tokens from `CONTEXT.md` (e.g. PRD, ADR, **seam**) | Restating glossary meaning — write that meaning once in prose |

**Test:** if removing the English word and reading aloud still sounds like native prose in the confirmed
language, the English word was not a pure-tech token — rewrite it.

### Anti-mix (Vietnamese example)

When Language is Vietnamese, do **not** sprinkle English for flavor:

| Avoid (mix)                                                | Do (natural VI + tech tokens)                                             |
| ---------------------------------------------------------- | ------------------------------------------------------------------------- |
| Landing có personality rõ — IDE-adjacent, information-rich | Landing có tính cách rõ — gần IDE/terminal, đậm thông tin                 |
| Motion: Purposeful — pipeline activate khi scroll          | Chuyển động có chủ đích — pipeline sáng khi người dùng scroll             |
| Confident, slightly irreverent — «align trước khi build»   | Tự tin, hơi ngang — «align trước khi build»                               |
| Agents là principals; prompts là contract                  | Agent là chủ sở hữu process; sample prompt là contract để copy vào Cursor |

Same rule inverted when Language is English: no Vietnamese clauses mid-sentence; keep VI only for required
product copy strings (locale samples, quoted UI).
