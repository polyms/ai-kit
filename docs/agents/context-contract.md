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
