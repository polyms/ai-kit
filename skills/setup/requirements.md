# Requirements templates

Per-repo default for which PRD shape `/reqs` drafts. `/setup` writes this file to
`docs/agents/requirements.md` and sets **Confirmed default**.

Reference set, same layout as
[PRD templates](https://thehuman2ai.com/product/templates/prd) — pick one shape, fill it, delete the
prompts. Full index: [Templates](https://thehuman2ai.com/product/templates).

Confirmed default: Standard

Every variant is a shape of one file: `skills/reqs/enterprise-prd-template.md` in ai-kit. `/to-prd`
publishes `skills/to-prd/lean-prd-template.md` on every variant. Do not open a second BRD, FRD, MRD, SRD,
TRD, or QRD.

## Variants

### Standard

New product, full spec. The enterprise template as written.

### MVP

Hypothesis, short launch. Keep these enterprise sections and delete the rest, one Appendix line per deletion:

| Keep                   | Shape                                                                         |
| ---------------------- | ----------------------------------------------------------------------------- |
| §2 Problem Statement   | No evidence yet: we believe [users] struggle with [problem] because [signal]. |
| §3 Goals & Metrics     | Each metric checkable within two to four weeks of launch.                     |
| §4 Users               | Primary persona as the pilot segment, plus who is not in this MVP.            |
| §6 Solution — Overview | What the user can do and what they get. Drop flows and screens.               |
| §7 Functional Reqs     | P0 rows only. Keep **Model behavior** when the same input can be wrong.       |
| §12 Scope              | In / out. The out list is about three to four times the in list.              |
| §15 Open Questions     | Markers land here.                                                            |
| §16 Appendix           | Deletions noted here.                                                         |

### AI-optimized

An agent (Cursor, Claude Code, or the same) will implement. The Standard body, with two changes:

- §14 Timeline & Milestones becomes **§14 Phases**. For each phase: name, dependencies, scope, out of
  scope, tasks, and a testable output (a command, a status code, or a test).
- §9 Assumptions & Constraints gains **Agent prohibitions**: do not modify files the current phase does not
  name; do not install dependencies unless the phase says so; do not create files outside the directories the
  phase names. Stack versions, existing files, and API contracts sit in the same section as constraints.

Architecture choices stay in `/align`, not a technical-approach chapter. `/to-prd` carries each phase's
testable output into **Testing Decisions** and the prohibitions into **Implementation Decisions**.

## Other families

| Family     | Site variants               | In this kit                                                                       |
| ---------- | --------------------------- | --------------------------------------------------------------------------------- |
| [PRD][prd] | Standard, MVP, AI-Optimized | Variants above.                                                                   |
| [BRD][brd] | Standard, Lean              | AS-IS, TO-BE, and objectives inside the PRD. No cost-benefit chapter.             |
| [FRD][frd] | Standard, API               | FR section. An API also names input, output, and error codes on each row.         |
| [MRD][mrd] | Standard, Startup           | Do not write one. Evidence the user gave stays in the problem.                    |
| [SRD][srd] | Standard, Agile             | Behavior and quantified NFRs in the PRD. Architecture is `/align`.                |
| [TRD][trd] | Standard                    | Do not write one. Stack axes: `docs/agents/stack-profile.md`. Hard choices: ADRs. |
| [QRD][qrd] | Standard                    | NFR rows with a target and a blocking or advisory ship gate.                      |

[prd]: https://thehuman2ai.com/product/templates/prd
[brd]: https://thehuman2ai.com/product/templates/brd
[frd]: https://thehuman2ai.com/product/templates/frd
[mrd]: https://thehuman2ai.com/product/templates/mrd
[srd]: https://thehuman2ai.com/product/templates/srd
[trd]: https://thehuman2ai.com/product/templates/trd
[qrd]: https://thehuman2ai.com/product/templates/qrd
