# Skill intelligence (V0.3)

## Baseline and scope

V0.2 is merged (PR #5, commit 85dacd4). Its production smoke tests returned content for all
13 packs, and manifest-only, selected, duplicate and invalid paths behaved as expected. The design
pack's full response contained 207,654 characters; entry-only contained 15,522 characters in that
session. These are payload sizes, not token counts or latency measurements.

V0.3 starts with metadata-driven client routing, entry-first loading, known reference closure and
routing evaluation fixtures. It does not introduce a server-side classifier, model calls, vector
search, orchestration runtime, analytics database or a new MCP tool.

## Client discovery contract

`list_skill_packs` retains the existing name, description and raw URL and adds:

- `useWhen`: compact English/Vietnamese intent examples.
- `avoidWhen`: boundary against neighboring skills.
- `starterPaths`: trusted manifest paths for the first retrieval.
- `nativeInvocation`: installed skill policy (`explicit` or `model`); `mcpSelection`: conversational routing (`intent` or `explicit-intent`). Ordinary natural-language intent can select reqs/design/docs; special workflows require a clearly requested outcome or bounded assignment, not literal slash syntax. Neither grants write authority.
- `relatedSkills`: optional handoffs, not dependency or execution authorization.
- `contract`: accepted/produced artifact kinds, a semantic completion gate, context needs and
  optional Knowledge search hints. SDK catalogs also expose composition recipes.

The top-level `composition` catalog advertises a shared protocol path and optional recipe metadata
(hostPack, path and suggested stages). Existing packs and retrieval calls stay compatible.

When a relevant request arrives, select the smallest set of matching packs. Honor explicit user
selection and the client's invocation policy. For trivial questions or out-of-catalog work, do not
force a work pack. The client reasons about user intent; the server returns deterministic metadata.

```ts
const catalog = await list_skill_packs()
// After selecting design from catalog.packs:
await get_skill_pack({ name: 'design', paths: ['skills/design/SKILL.md'] })
// After reading the workflow, load only the references for the active branch:
await get_skill_pack({
  name: 'design',
  paths: ['skills/design/REDESIGN.md', 'skills/design/ANTI-SLOP.md'],
})
```

The first call already returns other files' metadata; a separate manifest-only call is usually
unnecessary. Short work packs start with workflow, shared standard, context guidance and default template;
reqs/docs start with workflow, standard and context guidance; design starts with workflow and context
guidance. Load additional templates/references
before the step that needs them. Reuse files within the current session. No server-side session state.
Omitted paths preserve legacy full-pack retrieval; empty arrays remain manifest-only.

## Dependency closure

All direct relative Markdown links in published packs should resolve inside their own manifest.
The manifest's explicit references include design's client compatibility and visual-ship documents,
and docs' client compatibility document. Cross-skill workflows and project-owned ADRs, requirements,
and repo context are not copied into the pack; retrieve those only when available and appropriate.
Avoid adding arbitrary fetch URLs. Vitest checks file existence, nonempty contents, relative Markdown
links and starter-path allowlisting. These checks do not prove completeness of prose-only references.

## Composition and evaluation

See [capabilities](skill-capabilities.md), [context contract](context-contract.md) and
[composition protocol](skill-composition.md).
For multi-skill work, load the protocol through any selected pack and only the applicable recipe
through its hostPack. Keep a shared session-local context and use evidence-backed handoffs,
conditional gates and bounded revision. The recipe host is only a retrieval location.
Do not treat related skills as a chain or duplicate accepted decisions. Draft by default and verify
authorized writes.

The 13 output cases, 38 routing fixtures and 17 composition cases in `evals/` cover work intent,
overlap, composition and opt-out. The [local evaluation runner](../../evals/README.md) runs paired
baseline/assisted cases with an explicitly configured compatible model endpoint, records local
retrieval traces and optional blind-judge scores. It does not test native client integrations. Unit tests validate fixture integrity and retrieval behavior; actual client
routing, quality, token consumption and latency require separate evaluation runs. Record the model,
client, revision, chosen route, requests and evidence. See the evaluation README.

## Handoff

This V0.3 slice includes composition contracts, protocol and five recipes. After merge/deploy, confirm catalog metadata in actual MCP tools,
load starter paths for representative packs, then test real natural-language routing and multi-skill
handoffs across compatible clients. Remaining scope: landing-site catalog, comparative eval runs
on real models/native clients and any measured improvement needs. Do not claim automatic invocation works on every client.
