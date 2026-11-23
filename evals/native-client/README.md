# Native-client workflow audit (offline)

This pilot checks **AI Kit's workflow and template support**, not model intelligence.
It is separate from the 88 synthetic evaluation scenarios and does not call
ChatGPT, Claude, Cursor, Codex, an LLM endpoint, a live MCP server or a workspace.

## Record evidence from a real host

Use the exact [neutral Team Invitation prompt](../manual/2026-11-23-team-invitation-neutral-prompt.md)
in a fresh session with the host's normal/default configuration. Preserve
the original prompt and an output artifact privately. When possible, capture
native host tool requests/responses, which AI Kit packs were actually read,
and the setup (host, model/mode if visible, installed tools and skill source).

The case is in [team-invitation.case.json](team-invitation.case.json).
Create a copy of [the example capture](examples/instant-model-reported.example.json)
and edit the metadata: client (e.g., chatgpt, cursor, claude, codex),
configuration, runId, promptId, promptProvenance, mode, artifactRef and grades.
The same checks apply across clients; ChatGPT Instant is **not** an assumed
tier on other hosts.

Grade each listed rubric criterion \`pass\`, \`fail\` or \`unverified\`. A
pass/fail requires a **specific reference to visible artifact evidence**
(e.g. \`TI-05 API contract dependency\`, \`TC-09 cross-team negative\`).
No answer is guaranteed better merely because it contains more tasks/tests.
Missing evidence must stay \`unverified\`. These are **human-supplied grades**,
not proof that a program inspected or executed the work.

Trace provenance is independently represented:
- \`host-export\`: tool calls and loaded paths captured through a host's
  own observable log. Set \`complete:true\` only when the relevant full
  session was captured. This attribution is still user-supplied: the
  validator cannot authenticate an export.
- \`model-report\`: tool calls **written by the model in its answer**. They
  may be recorded for context but **cannot pass** route or efficiency checks,
  even if the list looks perfect.
- \`none\`: no trace; \`calls\` must be \`[]\`. Unknown bytes/loads remain
  unverified, not zero.

For each \`get_skill_pack\` host call, record the actual \`args.name\`,
\`args.paths\` and exact \`loaded\` file paths containing content, plus \`ok\`.
\`bytes\` is optional; only complete host traces with every call's measured
byte count earn a reported total. The scorer detects unexpected/missing packs,
extra catalog discovery, implicit full-pack retrieval and duplicate file loads.
It never infers server activity from the written artifact.

## Commands

Run from repository root (Node.js 24+; no package install needed):

~~~sh
node --test evals/native-client/workflow-audit.test.mjs
node evals/native-client/run.mjs evals/native-client/examples/instant-model-reported.example.json
node evals/native-client/run.mjs my-baseline.json my-assisted.json --out my-review.md
~~~

The included example is **not an actual host trace or model run**. It
intentionally reports tool invocations as \`model-report\` with all manual
grades absent; the result must remain unverified. Generated reports default
to stdout; \`--out\` creates a new Markdown file and refuses overwrites.
Do not commit private prompts, raw tool responses, credentials or customer
conversation history. Prefer brief redacted evidence references. No automated
outbound data transfers or paid-model requests occur.

## Pass boundaries

- **Workflow adherence:** preserve approved scope, dependencies, context
  and uncertainty with no invented schedule; host-traced minimal routing.
- **Template compliance:** developer-day estimate and assumptions, task IDs
  with dependencies/effort/acceptance, positive/negative/API/auth QA cases,
  and BR/AC traceability.
- **Governance:** no invented historical effort, no claimed test execution,
  no unauthorized ticket creation, publish or persistence.
- **Retrieval efficiency:** only host-observed complete traces may receive
  pass/fail; show catalog count, full-load calls, loaded-path duplicates,
  and transferred bytes when available.

A reviewer grade and a route/efficiency trace grade are **separate axes**.
Mark unavailable capabilities unverified rather than making cross-client
compatibility claims. Compare configurations **within the same host**; do
not compare native tools as if they expose identical mode and logging
features. Use repeated same-prompt sessions before treating an observed
workflow difference as reliable. This pilot does not assert CI-tested
compatibility with any named native AI client.
