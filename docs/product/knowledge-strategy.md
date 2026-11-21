# Knowledge evolution and continuous improvement

Status: existing catalog foundation plus proposed directions. No CMS changes are made by this PR.

## Existing foundation

AI Kit already has a Knowledge system; do not build a separate knowledge store for memory.
The Ops CMS/Postgres catalog maintains articles and ordered chunks. Published content is available
through the site and authorized MCP reads. The current intents are incident (deploy/CI/infra),
design (technical stack seams) and toolchain (reusable setup recipes). Hybrid keyword/vector
retrieval is optional, with stack-profile axis filtering; keyword-only retrieval remains supported.

Current retrieval is search → open matching article → obtain relevant chunks. Use
get_knowledge_chunk before copying a config artifact; get_knowledge_coverage checks intentional
axis subsets. IDs must come from live results, not hardcoded references. Coverage indicates a
matching published article, not proof that a specific solution applies. Authoring uses existing
admin authorization; placeholder policy keeps content generic and removes project-specific values.

See [agent Knowledge guidance](../agents/knowledge.md) for current behavior.

## Ownership and purpose

| Layer | Role |
| --- | --- |
| Skills | Reviewed methods and quality gates |
| Knowledge | Reusable, validated technical guidance |
| External memory | Owner-scoped experiences, decisions, preferences and lessons |
| Live workspace/business data | Current authoritative state, domain requirements and evidence |

Knowledge must not absorb private memory, become a replacement for an ADR, or be used as the
source of a user's live business status. Architecture decisions specific to a repository belong
in its ADRs; reusable technical guidance may be documented in Knowledge after validation.
Context-driven retrieval is already part of the current skill contract; it should stay selective,
not force the catalog into every task.

## Proposed Knowledge capabilities

| Direction | Why |
| --- | --- |
| Versioning | Make substantive changes and superseded advice traceable |
| Relationships | Connect related incidents, stack seams, recipes and alternatives |
| Provenance | Record source, applicability, evidence and verification basis |
| Lifecycle | Distinguish candidate, reviewed/published and deprecated guidance |
| Gap detection | Identify unresolved technical questions and coverage gaps without inventing articles |
| Contribution | Propose missing or improved general guidance from validated experience |

These are enhancement goals. Existing published filtering, axes, coverage and admin authoring
already support parts of them; do not imply all are greenfield or that every proposed status
or field exists today. Prefer incremental change to the existing catalog and retrieval foundation.
A relationship does not require a graph database, and a revision does not mandate a new history
service. Verify the need and current schema when planning implementation.

## Continuous improvement without model training

```text
Experience and actual evidence
  -> host-led Reflection
  -> authorized external Memory, when useful
  -> reviewed Knowledge candidate, if generalized and verified
  -> reviewed Skill change, if methodology itself needs improvement
```

This is a conceptual route with optional branches, not a mandatory pipeline. A candidate may be
discarded, remain private to its owner, or be proposed directly from independently verified
evidence. Memory is not a required intermediary. The host does the reasoning; AI Kit supplies
methodology. The owner decides memory capture; authorized maintainers decide Knowledge and Skill
changes. No model weights are trained; no automatic promotion, self-editing skills or hosted
reflection process follows from this strategy.

Reflection should distinguish: what happened, what was expected, evidence, what may explain
the difference, and what can be reused. Do not generalize one incident into a universal rule.
For a contribution, remove private context; verify version, applicability and repeatable steps;
check existing articles for overlap; preserve provenance; propose a bounded change for review.
Publication requires existing authorization and quality gates. If there is no relevant reusable
lesson, stop; do not create work merely to demonstrate learning.

Example: when a business MCP upgrade reveals a transport or authorization issue, the project
retains its own incident record and decisions. Only a verified generic transport/configuration
lesson may be proposed for the appropriate Knowledge intent. A recurring, verified omission
in validation could motivate a skill checklist improvement and a regression case.
No actual new incident article or skill change is implied by this example.

## Success criteria for future work

More applicable, traceable guidance; fewer repeated verified mistakes; fewer irrelevant retrievals;
clearer gaps and less stale advice. Measure with [quality strategy](quality-strategy.md) before
claiming effectiveness. Do not use contribution volume, memory record count or raw search hits
as proxies for successful learning.
