# Augmentation architecture principles

Status: product direction and implementation boundaries, not a new runtime specification.
[Positioning](positioning.md) is the canonical product and ownership decision.

## Architecture and responsibilities

The host AI is the reasoning and execution layer. AI Kit is a reusable methodology and reference
layer. Independently owned systems supply actual context and perform authorized actions.

```text
Host AI / coding agent / business assistant
  | selects skills, resolves context, reasons, verifies results
  |
  +-- AI Kit delivery: local skills / MCP / SDK / compatible plugins
  |     +-- Skills, templates, quality gates
  |     +-- Knowledge (published technical guidance)
  |     +-- Context Contract and Skill Composition
  |     +-- Memory Protocol and Reflection guidance (planned)
  |
  +-- Authorized tools and data
        +-- Repository, tracker, documents, business state and APIs
        +-- Agent-native, business or external memory (optional)
```

| Concern | AI Kit | Host / connected system |
| --- | --- | --- |
| Methodology | Define and version reusable methods | Select and apply |
| Expertise | Maintain reusable Knowledge | Retrieve and verify applicability |
| Context | Declare information needs and source rules | Resolve available evidence and gaps |
| Composition | Define optional recipes and artifact gates | Choose stages and execute |
| Experience | Define memory-use guidance (planned) | Own or access memory under its policy |
| Reflection | Define lesson and feedback methodology (planned) | Analyze and propose; owners approve changes |
| Actions | No permission granted by a skill | Authenticate, authorize, execute, verify |
| Quality | Fixtures, rubrics and service diagnostics | Client behavior and actual work evidence |

Do not reproduce inference, model routing, conversation management, context orchestration,
memory infrastructure, agent scheduling or workflow execution. Do not require a server-side LLM
to perform user work. An optional evaluation model or Knowledge embedding service used for
indexing is not a host execution runtime. Use static delivery and deterministic checks where
possible. Do not add a database merely to deliver Skills.

## Context Contract: a lightweight semantic contract

The existing remote contracts describe accepted and produced artifact kinds, readiness, advisory
context requirements and optional Knowledge hints. Preserve that foundation rather than inventing
a second context model. Required means needed for the requested complete outcome, not a universal
schema validation rule; recommended helps confidence; optional is only used when relevant.

Useful context categories include identity and permissions, environment and stack, intent, domain
rules, Knowledge, historical memory, live state, constraints, capabilities and evidence. These are
concepts, not required fields for every skill. Scope and provenance matter more than exhaustiveness.

For example, plan needs a goal and scope for effort estimation; capacity is essential for a
credible calendar commitment but not an effort-only estimate. Bug may draft from an observed
symptom while marking reproduction, expected behavior and impact unknown. QA cannot declare a
pass merely from a test plan; release cannot declare readiness from a different build's evidence.

Before work, reuse the supplied context, then resolve material gaps through authorized sources.
During work, distinguish facts, approved decisions, proposals, assumptions and unresolved conflicts.
Prefer authoritative live records for mutable state. After work, report limitations and optionally
suggest useful lessons. Do not load every source or persist session data by default.

Discover, retrieve, validate, reconcile, prioritize and compose are host behaviors, not AI Kit
services. Context budget decisions and semantic conflict resolution remain with the host. Do not
introduce a Context Resolver Engine or provider adapter requirement.

See [existing context guidance](../agents/context-contract.md).

## Skill Composition

Use dynamic composition: the host selects the smallest useful route, honors explicit invocation
and skips stages whose outputs already exist. For instance, approved requirements can feed plan,
task and qa without running research, business, reqs or design again. Recipes are advisory; a
single-skill request should not load an entire recipe.

Artifact handoff preserves the source, version, status, agreed scope, requirements, acceptance
criteria, assumptions, blockers and actual receipts. The receiving skill checks its own needs,
keeps approved facts separate from proposals and stops affected work if a material gap remains.
Session-local context is sufficient; do not create a persistent ledger merely for composition.

Domain composition is additive: AI Kit provides general methodology; the business supplies trusted
domain rules, context requirements, destination templates and authorized actions. Core safeguards
and quality gates cannot be weakened. Keep private values in the consumer, not in AI Kit.
Astra issue authoring illustrates this boundary: generic bug/task/reqs methodology plus Astra's
own issue rules and template; applying a skill does not grant permission to create an issue.

See [existing composition guidance](../agents/skill-composition.md).

## Two delivery environments, shared methodology

| Dimension | Remote MCP / SDK skills | Local engineering skills |
| --- | --- | --- |
| Typical work | Research, requirements, tickets, planning, QA | Repo-aware architecture, implementation, review, E2E |
| Data | Conversation, business tools, documents | Source code, ADRs, Git, stack profile, feature map |
| Composition | Optional business/workflow recipes | Existing invocation, principal agents and engineering pipeline |
| Execution | Host-authorized business tools | Host-authorized repository and terminal tools |
| Shared principles | Context integrity, evidence, quality, selective recall | Same principles; local conventions remain intact |

Skills such as reqs, design and docs can serve both. Offline/local means installation in the
workspace, not necessarily no network. Do not migrate the engineering pipeline into remote
orchestration or force a common runtime. Remote packs are the immediate focus of contract evolution;
local skills can reference shared methods when useful.

## Distribution and ecosystem

- Existing outward SDK consumption is the foundation: business MCP servers reuse curated AI Kit
  skills without requiring a separate AI Kit connection in the end-user client.
- Deliver entry/starter content first; load only required references. Preserve release/revision
  provenance, immutable published snapshots, bounded caches and explicit version selection.
- Compatibility is proven for actual adapters and host clients, not inferred from shared syntax.
  Forward relevant contract and guidance in consumer responses. Preserve independence of SDK and
  skill release versions; early experimental snapshots may be retired by explicit decision.
- Future inward external skill sources may reuse the same packaging, discovery and quality
  principles. Do not make an external registry or aggregator mandatory. Check provenance,
  licensing, dependency closure and exact revision before any import.
- External Memory is not an ecosystem integration that AI Kit must host. Clients and businesses
  choose their own provider, retrieval, synchronization and access rules.
- Keep AI Kit internals unobtrusive for ordinary business users; expose version/source diagnostics
  when technically requested, without hiding failures or inventing compatibility.

See [external skill provider](../agents/external-skill-provider.md) and
[external skill licensing](../agents/external-skill-references.md).

## Design review principles

Evidence first; context-aware; temporally aware; associative where useful; reflective; selective;
governed; portable. Treat them as criteria for small product improvements, not justification for
infrastructure. Validate useful outcomes against [quality strategy](quality-strategy.md).
