# To PRD

**Codex / GitHub Copilot:** Apply [client compatibility](../../docs/agents/client-compatibility.md) before this workflow.

**All hosts:** Read [portable skill standard](../../docs/agents/portable-skills.md). Resolve target
project context and execution routes from `docs/agents/execution-profile.md` when available. CLI
commands are operation examples, not mandatory tools. Retain evidence and approval gates; use a
bounded draft or blocked handoff for unavailable actions.

Synthesize confirmed decisions into a lean PRD; publish to the issue tracker only when requested and authorized.

**Do NOT interview** — synthesize from available decisions, source artifacts and codebase context.
Reuse approved alignment handoffs across sessions; do not assume missing prior chat.

## Selection

Use only for aligned decisions; draft unless publication is explicitly requested. Do not restart discovery.

**Audience:** Follow [lean-prd-template.md](lean-prd-template.md). The published issue is for **humans on the
tracker first** — any role skimming the issue without opening the repo. Agents reuse the same body. Do **not**
ship executive-summary rollups or agent-only shorthand (e.g. `"W1 P0 #1–9: tenancy..."`).

**References on the tracker:**

- **Main body** cross-links other **issues** (`#n`, `SPROMPT-2`, full URL) under **Related Issues**. Opaque
  ids (open-question markers) are fine.
- **Repo paths** (`CONTEXT.md`, `docs/prd/…`, `docs/adr/…`, source files) — omit by default. Add
  **Repo references** only when the user asked; never as a banner under the title, never as a substitute for
  writing the decision in prose.

**Upstream:** `/align` with `align-loop` and `domain-modeling` sharpen decisions and domain
language before synthesis.

**Downstream:** `/task` (vertical slicing) breaks the published PRD into vertical-slice issues.

**Prerequisites:** Resolve confirmed tracker and label mapping from project setup or authorized context.
Missing policy blocks publication, not a bounded draft; propose setup only if needed. Read `docs/agents/language.md` when present — publish the PRD in that language (**one prose
language**; **English thrift** — prefer confirmed language for ordinary words; only pure-tech / specialty
tokens stay English — no mid-sentence EN/VI mix; VI SSOT `skills/setup/language.md`).

## References

| Topic            | Read when                                                                                                       |
| ---------------- | --------------------------------------------------------------------------------------------------------------- |
| Issue tracker    | `docs/agents/issue-tracker.md` — create/read commands                       |
| Triage labels    | `docs/agents/triage-labels.md` — `ready-for-agent` mapping                  |
| PRD body         | [lean-prd-template.md](lean-prd-template.md)                                                                    |
| Template default | `docs/agents/requirements.md` when present                                                                      |
| Domain glossary  | `CONTEXT.md` — use terms in **prose**; do not cite the file as main PRD content                                 |
| ADRs             | `docs/adr/` — fold decisions into **Implementation Decisions**; path only if user asked for **Repo references** |

When that file's default is **AI-optimized**, carry each phase's testable output and the prohibitions into
**Implementation Decisions** and **Testing Decisions**. Missing file: lean body only.

Apply the shared work artifact standard. For a draft-only request, stop before step 5.

## Process

### 1. Explore the codebase

If you have not already explored the codebase, do so to understand current state. Use glossary vocabulary from
`CONTEXT.md` **in the PRD prose** (define each term once in a sentence). Respect ADRs in the area you are
touching — state the decision in **Implementation Decisions**, do not replace that prose with a bare path.

Scan the tracker for related issues (prior PRDs, blockers, superseded work) so **Related Issues** can be
filled with real issue keys or URLs (not the project issues index).

**Completion criterion:** Glossary terms and relevant ADRs noted for prose; related tracker issues listed, confirmed none, or explicitly inaccessible (publication waits if required).

### 2. Sketch test seams

Sketch the seams at which you will test the feature:

- Prefer **existing seams** to new ones
- Use the **highest seam possible**
- If new seams are needed, propose them at the highest point you can
- The fewer seams across the codebase, the better — the ideal number is **one**

Present the proposed seams to the user and **check that they match expectations** before writing the PRD. User
may explicitly defer confirmation.

**Completion criterion:** User confirmed seams (including existing approved decisions) or explicitly deferred. If unavailable in a delegated run, return proposed seams as a blocker, not approval.

### 3. Open-questions gate (before write)

Scan conversation, align handoff, and codebase for details an implementer still needs — same bar as
`[NEEDS CLARIFICATION]` in [lean-prd-template.md](lean-prd-template.md).

If any would appear in **Open Questions**: list them, **do not finalize or publish yet**; a bounded draft with unconfirmed markers is allowed only as a clearly labeled draft, and ask the
**open-questions confirmation** turn ([GRILL-FORMAT.md](../align-loop/GRILL-FORMAT.md)) — **A** here means
run `/align` on the listed items; **B** proceeds to step 4 with confirmed markers. If `/align` already
deferred the same items with **B**, restate the list and proceed only after explicit yes.

**Completion criterion:** Zero unsettled markers, or user explicitly chose **B** and confirmed the deferred
list.

### 4. Write the PRD

Fill every section of [lean-prd-template.md](lean-prd-template.md) from conversation context and codebase
understanding. No empty headers. Omit **Related Issues** when empty. Omit **Repo references** unless the user
asked for repo refs.

**User Stories** must be an extensive, **prioritized** numbered list (per template) — P0 stories independently
testable, with Given/When/Then acceptance scenarios. Title each story with the human outcome (not `US#17` /
`§8.5` alone). Include test seams from step 2 under **Testing Decisions** and aligned technical choices under
**Implementation Decisions** (prose first).

**Synthesize, don't invent:** this skill has no interview step — when the conversation didn't settle a detail,
mark it `[NEEDS CLARIFICATION: …]` inline and collect markers under **Open Questions**. Inventing an answer
here ships it straight to `/dev` unreviewed. Markers may appear only after step 3 **B** confirmation.

**Human-readable check (before publish):** re-read the draft as an outsider / non-builder (any role, no repo
knowledge). When prose is Vietnamese, also run the English-thrift read-aloud test in
`skills/setup/language.md`:

- [ ] Every required template section filled (including **Success Criteria** and **Open Questions**)
- [ ] No repo-path banner under the title (`docs/prd/…`, `CONTEXT.md`, align notes)
- [ ] Problem / Solution / stories read as full prose — not identifier dumps or wave rollups
- [ ] Story titles name the outcome; Given/When/Then on every P0 story
- [ ] Related tracker work uses issue keys / URLs in **Related Issues** (or section correctly omitted)
- [ ] No internal repo links unless the user asked — **Repo references** omitted by default
- [ ] Cut scope is deleted or listed under **Out of Scope** — no strikethrough archaeology
- [ ] Body stands alone on the tracker without opening the repo
- [ ] Prose reads native in `docs/agents/language.md` — **English thrift** (prefer confirmed language for
      ordinary words; only pure-tech / specialty tokens left in English)

**Completion criterion:** PRD draft complete; every template section filled or correctly omitted; every
unsettled detail carries a marker instead of a guess; markers match the step 3 confirmed deferral list when
any exist; human-readable check passed.

### 5. Publish (only when explicitly authorized)

Do not create or mirror anything for draft-only requests. Search for duplicates before creating and
reconcile ambiguous writes. If any gate remains unconfirmed, return the blocker; do not publish.

Create an issue titled `PRD: <feature>` per
`docs/agents/issue-tracker.md`. Apply the mapped `ready-for-agent` label
string from `docs/agents/triage-labels.md`. Use the configured tracker route and verify the returned issue. Mirror the same body to the
configured repository path (default `docs/prd/<feature-slug>.md`) when project policy requires it
and an authorized write route exists. The tracker is canonical by default; respect confirmed project
ownership. Report a required mirror as pending if it cannot be written; do not claim completion.

```bash
gh issue create --title "PRD: <feature>" --body "$(cat <<'EOF'
<body from lean-prd-template.md>
EOF
)" --label "<mapped label string>"
```

(`gh` example — follow `issue-tracker.md` when the tracker is not GitHub.)

Skip `/track` (triage) — this skill publishes a pre-aligned spec from conversation (`/align` upstream), not a raw
inbound issue. No agent brief needed; the PRD body is the AFK contract.

**Completion criterion:** Issue created on tracker with full PRD body and mapped `ready-for-agent` label;
required mirror verified or explicitly pending; never claim full completion for a pending required write.

### 6. Handoff

Summarize what was published (issue number + title). End with `## Next Step` — prefer **exactly one** next
skill (typically `/task` (vertical slicing) on the published PRD). Second option only when UI-heavy and design should land
before slicing (`→ /design` with when). Never a 3+ menu.

**Completion criterion:** Summary delivered; `## Next Step` names one preferred skill (two max with
when/why).

_Future:_ a dedicated `prd-view` skill for reading and presenting PRDs from issues is planned — for now, fetch
via `issue-tracker.md` read commands.
