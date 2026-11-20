# Context contract

Context is information needed to apply a skill, not an execution engine or storage layer.
The client remains responsible for reasoning, retrieval and authorized actions.

## Before work

- Resolve the user's goal, scope and requested artifact. Honor explicit invocation policy.
- Read the selected skill and its context requirements. Required means necessary for the requested
  complete outcome; recommended improves confidence; optional is useful only when relevant.
- Reuse reliable supplied context before retrieving more. Resolve only material gaps. Context
  keys are semantic hints, not fixed JSON fields, tool names or permissions.
- Prefer current authoritative workspace/business records for mutable facts, published Knowledge
  for reusable guidance, and authorized Memory for past decisions, preferences and lessons.
  Conversation context establishes the current request. Memory is optional and may be unavailable.
- Search Knowledge only for relevant gaps; open matching articles/chunks before applying them.
  Never invent a source, assume access, bypass permissions or upload private context to a public
  Knowledge catalog. Do not confuse historical memory with current state.

## Context-aware Knowledge retrieval

The existing Knowledge catalog contains technical incident, design and toolchain articles. It is
not the canonical source of product requirements, business rules, current tracker state or user
memory. A skill's optional `contract.knowledge` lists intents and when a search is useful.

1. Identify the unresolved question from the current goal or handoff. Skip search if supplied
   evidence already answers it or the question is outside the catalog.
2. If Knowledge access is available, use `search_knowledge` with a minimal, non-sensitive topic
   or symptom, the matching intent and known stack-profile axes only. Do not send raw customer
   data, internal logs, tokens or project identifiers to a shared/public service.
3. Open the best relevant result using `get_knowledge`; use `get_knowledge_chunk` before copying
   a config artifact. Confirm applicability to the environment, version and scope. Preserve
   its actual reference and distinguish guidance from verified application evidence.
4. If no relevant match or no access, proceed with authorized local sources or clearly state
   the gap; do not invent a match or force another connector. Do not publish private context.

Local engineering skills retain their existing stack-profile and Knowledge retrieval workflow.
Remote business MCP consumers may expose an authorized Knowledge adapter or let the client use
its own connection. The SDK skill bundle is read-only and does not retrieve user context.

## During work

- Preserve provenance, scope, version or date where material. Separate observed facts, approved
  decisions, proposals, assumptions and unknowns. Current evidence may supersede old memory;
  conflicting approved rules require resolution, not an arbitrary choice.
- If information is missing, proceed with a clearly bounded draft or assumption if useful; ask
  only for blocking decisions. Never claim a verified result, approval or write without evidence.
- Load additional skills only when the requested outcome needs another distinct workflow. Reuse
  accessible artifacts and preserve scope and evidence across handoffs.

## After work

Return the requested artifact and material limitations. If a reusable lesson is evident, suggest
capturing it only when useful and authorized. Do not persist conversations, create memory records,
publish Knowledge or modify Skills by default.

Local engineering clients continue to use repository context, invocation and verification rules.
This guidance supplements those rules; it does not change the engineering pipeline.
