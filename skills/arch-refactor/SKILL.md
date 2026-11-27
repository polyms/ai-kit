---
name: arch-refactor
description: Scan codebase for deepening opportunities, present visual HTML report, then grill the candidate you pick. Invoke with /arch-refactor, architecture review, refactor architecture, rà soát kiến trúc, refactor kiến trúc, cải thiện kiến trúc code.
disable-model-invocation: true
---

# Arch Refactor

Use `arch` for module/interface design vocabulary alone; this skill owns repository-wide evidence-led deepening assessment, candidate reports and selection, not implementation.

**All hosts:** Read [portable skill standard](../../docs/agents/portable-skills.md). Resolve the target project's execution profile and actual authorized tools. A local CLI, workspace or delegation is not mandatory to read methodology; use verified equivalent evidence, or report unavailable operations. Do not infer approval or claim unperformed writes/tests.

**Codex / GitHub Copilot:** Apply [client compatibility](../../docs/agents/client-compatibility.md) before this workflow.

Surface architectural friction and propose **deepening opportunities** — refactors that turn shallow modules into deep ones. The aim is testability and AI-navigability.

**Maintenance skill** — outside the daily ship pipeline (`/align` → … → `/code-review`). Complements `/align` (product alignment) and `/dev` (implementation).

This command is _informed_ by the project's domain model and built on shared design vocabulary:

- Use **`arch`** for architecture vocabulary and principles. Don't drift into "component," "service," "API," or "boundary."
- The domain language in `CONTEXT.md` gives names to good seams; ADRs in `docs/adr/` record decisions this command should not re-litigate.

## References

| Topic           | Read when                                                                             |
| --------------- | ------------------------------------------------------------------------------------- |
| Arch vocabulary | `arch` skill — glossary, principles, design-it-twice                                  |
| HTML report     | [HTML-REPORT.md](HTML-REPORT.md) — scaffold, diagrams, tone                           |
| Domain glossary | `CONTEXT.md` at repo root                                                             |
| ADRs            | `docs/adr/` — decisions in the area you are touching                                  |
| Grill           | `align-loop` skill — one question, lettered options + `(Recommended)` (model-invoked) |
| Domain terms    | `domain-modeling` skill — update `CONTEXT.md` inline                                  |

## Process

### 1. Explore

Read the project's domain glossary (`CONTEXT.md`) and any ADRs in the area you're touching first.

When deepening touches **stack-combo seams** (routing, state, module layout), soft-require Knowledge
MCP — [knowledge.md](../../docs/agents/knowledge.md):

1. Read **`docs/agents/stack-profile.md`** when present. Coverage notes are bootstrap only — not
   live SSOT.
2. Re-call **`get_knowledge_coverage`** for the design-intent axis **subset under work** (heuristic
   subset from [setup stack-profile](../setup/stack-profile.md), or a tighter subset for this review).
3. Follow with **`search_knowledge`** (`intent: "design"`) before inventing module conventions when
   coverage reports a hit.

Then explore the relevant codebase through the actual authorized host tools; delegate exploration when supported, otherwise inspect directly and disclose reduced isolation. Don't follow rigid
heuristics — explore organically and note where you experience friction:

- Where does understanding one concept require bouncing between many small modules?
- Where are modules **shallow** — interface nearly as complex as the implementation?
- Where have pure functions been extracted just for testability, but the real bugs hide in how they're called (no **locality**)?
- Where do tightly-coupled modules leak across their seams?
- Which parts of the codebase are untested, or hard to test through their current interface?

Apply the **deletion test** to anything you suspect is shallow: would deleting it concentrate complexity, or just move it? A "yes, concentrates" is the signal you want.

**Completion criterion:** Friction notes captured; `CONTEXT.md` vocabulary and relevant ADRs noted.

### 2. Present candidates as an HTML report

When the host can produce an authorized HTML artifact, use the report template. Otherwise provide the
same complete report structure in chat as Markdown, with evidence and limitations; do not invent a file.

If supported and appropriate, create the self-contained HTML as a user-accessible artifact or in the local OS temp directory outside the repo. On a local host resolve `$TMPDIR` (or the OS equivalent), use `xdg-open`, `open` or `start` only if available, and provide the actual accessible link/path. On a remote host without an artifact tool use the complete Markdown report. Never require a shell, filesystem or graphical viewer to complete the assessment.

Each candidate gets a card with files, problem, solution, benefits, before/after diagram, and recommendation strength (`Strong`, `Worth exploring`, `Speculative`). End with a **Top recommendation** section.

**Use `CONTEXT.md` vocabulary for the domain, and `arch` vocabulary for the architecture.** If `CONTEXT.md` defines "Order," talk about "the Order intake module" — not "the FooBarHandler," and not "the Order service."

**ADR conflicts**: if a candidate contradicts an existing ADR, only surface it when the friction is real enough to warrant revisiting the ADR. Mark it clearly in the card (e.g. a warning callout: _"contradicts ADR-0007 — but worth reopening because…"_). Don't list every theoretical refactor an ADR forbids.

See [HTML-REPORT.md](HTML-REPORT.md) for scaffold, diagram patterns, styling, and tone.

Do NOT propose interfaces yet. After the report is delivered, ask the user: "Which of these would you like to explore?"

**Completion criterion:** Candidate report delivered in an accessible format (HTML artifact or equivalent Markdown), including evidence, trade-offs, diagrams where useful and top recommendation; no interface proposals in report. Claim file creation/opening only if verified; no shell or temp path required.

### 3. Grilling loop

Once the user picks a candidate, run **`align-loop`** with **`domain-modeling`** to walk the design tree — constraints, dependencies, the shape of the deepened module, what sits behind the seam, what tests survive. One question, lettered options + `(Recommended)`; see [GRILL-FORMAT.md](../align-loop/GRILL-FORMAT.md).

Run **`domain-modeling`** inline as terms resolve.

- **User rejects the candidate with a load-bearing reason?** Offer an ADR, framed as: _"Want me to record this as an ADR so future architecture reviews don't re-suggest it?"_ Only offer when the reason would actually be needed by a future explorer to avoid re-suggesting the same thing — skip ephemeral reasons ("not worth it right now") and self-evident ones.
- **Want to explore alternative interfaces for the deepened module?** Use **`arch`** design-it-twice (parallel sub-agents when available, otherwise separate independent passes).

**Completion criterion:** Decision tree resolved for chosen candidate, or explicit handoff (typically `/dev` to implement deepening).

## Hard constraints

- HTML **never** lands in the repo workspace.
- **Do not** use Cursor Canvas instead of temp HTML.
- **Do not** publish to GitHub Issues.

## Handoff

After grilling resolves the design: end with `## Next Step` — preferred `→ /dev` to implement the
deepening at confirmed seams. Second option only when scope is still fuzzy: `→ /align` with when.
Never a 3+ menu.

## Agent

For long deepening scans or multi-module refactor planning:

```
Use the techlead to [arch-refactor task]
```

The agent reads this skill when invoked.
