# AI Augmentation Layer roadmap

Status: product and architecture direction, not an implementation specification or release promise.
[Product positioning](positioning.md) is the canonical ownership boundary.

## Strategy references

- [Architecture principles](architecture-principles.md)
- [Memory strategy and research rationale](memory-strategy.md)
- [Knowledge strategy and continuous improvement](knowledge-strategy.md)
- [Quality strategy: evaluation, governance and observability](quality-strategy.md)

## Product outcomes

- Consistency: apply the right skill and preserve agreed requirements, evidence and quality gates.
- Expertise: use relevant, reviewed Knowledge instead of improvising reusable technical practices.
- Continuity: use relevant prior experience already available to the executing host agent.
- Evolution: learn from observed outcomes and feedback through host-led reflection, without model training.

## Foundation: P0 and P1

PR #12 merged the context-aware composition foundation into main. It delivered advisory context
requirements for the 13 remote skill packs, shared guidance, routing refinements, evidence-preserving
handoffs, optional Knowledge search hints, SDK recipe discovery, and additive domain context.

The host selects the smallest useful skill set and resolves meaning, scope and permissions.
Context requirements describe information needs rather than a mandatory JSON input schema.
Recipes and handoffs are guidance, not executable graphs. Existing engineering invocation policies,
workspace rules and verification gates remain unchanged. Local and remote clients share methodology
where useful; they do not need a common runtime. Build and fixture checks are not proof of native
client quality; production integration and model effectiveness require separate verification.

## P2 Memory Integration

PR #14 shipped the provider-neutral Memory Protocol, optional hints for five skill packs,
immutable skill release 0.3.3, and 15 synthetic memory evaluation scenarios. Production MCP and
Astra Stg template retrieval have been smoke-tested at 0.3.3 / revision 2617cd6 after deployment.
This verifies delivery, not measured model effectiveness or full native-client behavior.

Decision: **AI Kit standardizes how an agent uses its own available memory, not memory ownership.** Live hints prompt native recall and reflection, not access to a memory system. Business records remain separate task evidence. No memory database, API, provider engine, vector index, synchronization service, agent runtime or background extraction service is planned in AI Kit.

| Planned capability | Direction |
| --- | --- |
| Memory Vocabulary | Distinguish past decisions, preferences, experiences, lessons and current facts |
| Memory Awareness | Identify memory that may materially improve a selected skill |
| Memory Recall | Consider the host agent's own already available memory and context; no external lookup |
| Memory Integrity | Preserve source, scope and time; reconcile stale or disputed recollections |
| Memory Reflection | Interpret observed results and feedback; distinguish a lesson from a hypothesis |
| Memory Capture | Reflect on durable lessons; native retention follows host settings, no external write |
| Memory Governance | Respect owner-specific access, consent, retention, correction and deletion rules |

The workflow is Recall → Apply → Reflect → Capture, only when useful. The host carries it out
using its own capabilities; AI Kit supplies guidance. Missing access to memory does not block a
skill by itself. Never imply persistence when it cannot be verified. Do not copy raw conversations,
private context, secrets or sensitive business data into AI Kit.

### Skill-level examples (five pilot skills shipped; others illustrative)

| Skill | Recall candidates | Capture candidates |
| --- | --- | --- |
| reqs | Prior approved decisions and rationale | Newly confirmed decisions and constraints |
| design | Design preferences and prior UI decisions | Accepted design decisions and lessons |
| plan | Historical estimates, actual effort | Verified estimation corrections and delivery lessons |
| bug / qa | Similar incidents and regression history | Confirmed reproduction insights and missed coverage |
| review | Previous review findings and recurring mistakes | Verified patterns and preventive lessons |
| business | Previous pricing and commercial choices | Approved commercial decisions and rationale |
| comms | Confirmed audience and communication preferences | Explicitly confirmed preferences |
| release / dev | Previous release or implementation outcomes | Validated operational or engineering lessons |

The same principle applies to other skills when memory has a material benefit. Avoid mandatory
recall before every request, indiscriminate capture, or any dependency on a particular provider.

### Delivered P2 scope and remaining verification

Delivered in 0.3.3: shared guidance, optional `contract.memory` recall/capture hints for reqs,
plan, bug, qa and review, versioned MCP/SDK delivery, and synthetic paired evaluation scenarios.
The live Memory Protocol reference is selectively retrievable. Full model-quality measurement,
client-specific behavior and SDK stable-release verification remain separate follow-ups.

## Later directions

The earlier product vision considered expanding Skills, Knowledge, Memory awareness, Reflection,
Governance, Evaluation and Observability while preserving external execution. These directions are
captured in the strategy documents, not assigned release numbers or a fixed delivery sequence.

- Reflection and Knowledge contribution: host identifies candidate lessons from evidence. Only
  generalized, verified, authorized material may be proposed for the existing Knowledge catalog.
  Publication and skill changes require their existing review/authorization process; no automatic
  promotion or modification of Skills. Keep personal and project-specific facts outside public
  Knowledge. No new model runtime or self-training loop.
- Evaluation: extend existing routing, output and composition evaluations with memory use,
  source integrity, cross-client behavior and regression tests. Compare assisted versus baseline
  on identical synthetic inputs; report actual measurements and limitations. Test local/native
  and remote clients independently; do not claim compatibility by protocol alone.
- Observability: consider minimal AI Kit-owned delivery and Knowledge-service telemetry (requests,
  release/version, latency, failures, cache behavior where measurable). Evaluate host behavior
  via authorized external evidence or opt-in synthetic harnesses. No inspection of hidden model
  reasoning, no collection of private conversations or memory records, no central agent telemetry
  platform. Separate operational telemetry from memory and Knowledge.
- Ecosystem: support authorized external skill sources and consumer-specific extensions where
  they add value, preserving licensing, version/provenance and quality boundaries. Avoid a
  mandatory registry, orchestration engine or vendor-specific runtime.

Next focus: [Quality Baseline and Release Verification](../quality/baseline.md).
Prioritize repeatable production delivery checks, real paired model evaluation with reviewed
hard gates, then cross-client traces and SDK stable-release evidence. No new memory storage,
agent runtime or release dates are committed by this roadmap.
