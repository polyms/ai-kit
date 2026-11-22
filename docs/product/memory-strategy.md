# Memory strategy: provider-neutral usage

Status: ownership decision agreed; Memory Protocol and five optional skill hints shipped in
immutable skill release 0.3.3. Production MCP and Astra template retrieval were smoke-tested
after PR #14; model-quality and full native-client behavior remain unmeasured.
AI Kit does not own, implement or operate memory. See [positioning](positioning.md).

## Research rationale

The November 2026 discussion examined five approaches to agent memory. The comparison below
summarizes their architectural ideas and qualitative trade-offs for AI Kit, not a reproduced
benchmark, endorsement or selection of a provider.

| Approach | Principle | Strength | Trade-off |
| --- | --- | --- | --- |
| MemPalace | Verbatim-first, spatial organization and scoped recall | Preserves original evidence and context | More retained material; retrieval is not truth validation |
| Mem0 | Extract and consolidate durable facts | Compact useful recall, reduced redundant context | Extraction can omit nuance; model calls and updates have cost |
| Letta / MemGPT | Hierarchical working and archival memory | Selective context loading across long sessions | Agent-managed state can couple behavior to a runtime |
| Zep / Graphiti | Temporal entity relationships and knowledge graphs | Distinguishes past and current relationships | Graph ingestion, entity resolution and temporal reasoning add complexity |
| A-MEM | Zettelkasten-inspired notes, links and evolution | Connects experiences and supports new associations | Generated links and revisions require evidence and conflict checks |

MemPalace introduced a memory-palace metaphor (wings, rooms, drawers, compressed navigation
and links); the principle relevant to AI Kit is source-preserving scoped retrieval, not the
metaphor or a mandate to keep full transcripts. A critical analysis examined its retrieval claims
and the relative contribution of verbatim text, embeddings and spatial organization. A retrieval
score such as Recall@5 measures evidence retrieval, not answer correctness or useful workflow
completion. Published scores from different systems are not directly comparable without aligned
datasets, metrics, settings and evaluation methods. AI Kit has run no independent provider benchmark.

The earlier hybrid design idea combined evidence-first recall, selective fact extraction, temporal
awareness, linked lessons and tiered context. **The later ownership decision supersedes building
that hybrid inside AI Kit.** Borrow these behavioral principles without adopting storage engines,
graph models, memory tiers, extraction pipelines or a vendor-specific adapter. The host uses the
memory source it already has; a business can choose any approach for itself.

### Research references

- [MemPalace project](https://github.com/MemPalace/mempalace) and
  [palace concepts](https://github.com/MemPalace/mempalace/blob/develop/website/concepts/the-palace.md).
- [Spatial Metaphors for LLM Memory: A Critical Analysis (2026)](https://arxiv.org/abs/2604.21284).
- [Mem0: Building Production-Ready AI Agents with Scalable Long-Term Memory (2025)](https://arxiv.org/abs/2504.19413).
- [MemGPT: Towards LLMs as Operating Systems (2023)](https://arxiv.org/abs/2310.08560).
- [Zep: A Temporal Knowledge Graph Architecture for Agent Memory (2025)](https://arxiv.org/abs/2501.13956).
- [A-MEM: Agentic Memory for LLM Agents (2025)](https://arxiv.org/abs/2502.12110).

These are research references only. No third-party implementation is imported, no deployment
dependency is introduced, and no external memory provider is selected.

## Concepts, not a storage schema

Working context is the immediate task and artifacts. Episodic memory concerns prior events and
outcomes. Semantic memory concerns learned facts, decisions and preferences. Procedural learning
concerns learned methods. These useful distinctions do not dictate an owner's representation:
an external provider may blend them, while AI Kit Skills remain reviewed reusable methodology
and AI Kit Knowledge remains curated general technical guidance.

Memory may be personal, project-scoped, team-scoped or organization-scoped; experiences and lessons
can occur in any scope. The actual owner determines isolation, retention, search, revision and
access. A current approved requirement or live business status must come from the relevant
authoritative source when verification is material. Memory is neither always true nor always
available. A past inference is not a confirmed fact.

## Shipped Memory Protocol (advisory)

The protocol guides behavior at the skill level, not transport, database, records or tool names.

1. **Recall:** identify a relevant gap. Reuse supplied context. Seek narrow authorized historical
   evidence when available; do not search everything or demand a provider.
2. **Apply:** use relevant evidence in the skill, preserve source/scope/time when available, and
   distinguish a preference, decision, reported experience, proposal and factual observation.
   Revalidate mutable claims; surface material contradictions rather than silently picking a memory.
3. **Reflect:** compare intended and observed outcomes, evidence and feedback. Identify a useful
   lesson or correction; distinguish a verified lesson from an untested hypothesis.
4. **Capture:** suggest a supported and durable fact, confirmed preference, decision or lesson only
   if worthwhile. Persist or correct it using the owner's available capability and applicable
   permissions/policies; never claim an unavailable write succeeded.

Use the minimum relevant context, preserve source evidence over lossy summaries when material,
respect changed circumstances, and avoid indiscriminate capture. Related events can inspire
hypotheses; links alone do not prove causation. Memory absence by itself is not a blocker: produce
a bounded result, verify from live sources when possible, or report the specific unresolved gap.

### Skill-aware recall and capture

The shipped 0.3.3 contract uses optional semantic `topic` / `when` objects, not a provider
query or persistence instruction. Example from the plan skill:

```yaml
memory:
  recall:
    - topic: actual-effort
      when: Calibrating an estimate using comparable, verified delivery outcomes.
  capture:
    - topic: estimation-corrections
      when: Comparable actual effort is verified against an earlier estimate.
```

This is an illustrative subset of the shipped plan hints; inspect the versioned catalog for
the full contract. Hosts may ignore hints when memory is irrelevant or unavailable.

The host must be free to use native memory, business APIs, authorized local notes, external
memory tools or no memory at all. No provider interface, common storage schema, mandatory
retrieval middleware, synchronization service or automatic cross-agent portability is required.
A shared external source can enable continuity between clients only if each has authorized access.

### Governance

- Respect the owner's access, scope, consent, retention, correction and deletion mechanisms.
  Do not bypass permission or infer write permission from discovery metadata.
- Avoid storing secrets, unnecessary personal data, raw conversations or irrelevant project
  context in AI Kit. Never export private memory into its public Knowledge catalog or logs.
- Avoid unnecessary repeated retrieval, capture or asking for details the host already knows.
  Do not invent a memory identifier or imply persistence from a capture suggestion.
- Reconcile conflicting decisions through authoritative sources and the owner; a recalled old
  state does not override newer verified evidence.
- Keep outcome evidence separate from interpretation; only reviewed, generalized, authorized
  lessons may enter [Knowledge contribution](knowledge-strategy.md).

See [Memory Protocol](../agents/memory-protocol.md) for the source pilot guidance. Optional
`contract.memory` hints use `topic` and `when`; the five pilot skills are reqs, plan, bug, qa and
review. The existing live MCP source manifest exposes the guidance as an optional reference.
Skill release 0.3.3 is distributed and deployed; the runner includes paired memory scenarios.
Delivery has been verified; model-quality and native-client execution still require measured evidence.
No memory storage, ingestion, embedding, retrieval engine or host-side hooks.
