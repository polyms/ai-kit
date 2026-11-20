# AI Kit product positioning

> **Canonical positioning:** AI Kit is an **AI Augmentation Layer** for existing LLMs and AI tools.
> It extends their capabilities with reusable skills, structured methodologies, domain knowledge,
> templates, context contracts, and composable workflow guidance.

## Who AI Kit serves

AI Kit helps **end users** accomplish specialized work in the AI tools they already use: research,
business decisions, requirements, planning, documents, QA, and related workflows. It also helps
developers and teams apply consistent practices in coding assistants. Builders can consume the same
skill methodology in their own authorized AI/MCP integrations.

The product is an augmentation layer, **not** a separate AI assistant or platform. A user should
not need to know MCP, skill pack names, or workflow internals to benefit from a compatible client.

## Ownership boundaries

| AI Kit provides | The host AI/client owns |
| --- | --- |
| Skills, playbooks, templates, standards | Reasoning and model inference |
| Knowledge retrieval and reference content | Conversation, session context and memory |
| Context requirements and artifact contracts | Interpreting intent and selecting when to use a skill |
| Optional composition recipes and handoff guidance | Orchestrating steps and making tool calls |
| Versioned content and delivery through MCP, SDK, plugins, or local skills | Authenticated access to project data and external services |
| Evaluation cases, rubrics and compatibility guidance | Execution, permissions, confirmations and actual result verification |

AI Kit may host content delivery endpoints and an authenticated Knowledge CMS. Those services
serve and maintain instructions/reference material; they **do not run an LLM to perform user work**.
Local, opt-in evaluation tooling may call an explicitly configured model endpoint to measure skill
effectiveness. That is testing infrastructure, not product-side inference.

## Architectural non-goals

- No server-side LLM inference, hosted chat assistant, or replacement model runtime.
- No autonomous agent runtime, server-side orchestration engine, or model-based skill router.
- No central store of end-user conversation memory or private project context for skill execution.
- No execution proxy that assumes control of the host AI's external integrations.
- No mandatory workflow chain: the host selects the smallest useful skill set for the user's goal.

Metadata-driven discovery, static retrieval, caching, versioning and deterministic validation **are**
within AI Kit's scope because they make augmentation dependable without duplicating host AI features.

## Distribution is not execution

MCP, the TypeScript SDK, native/local skill installation and client plugins are delivery or integration
methods for the **same version-controlled methodology**. Each client can have different discovery,
invocation, context and tool capabilities. Client support must be tested, never inferred from model
names or implied by a shared protocol alone.

Instructions do not grant permission to publish, send, commit, deploy or change external data.
The host client uses its own authorized tools, follows the user's scope, and verifies receipts.
If a tool or data source is unavailable, a skill may produce a bounded draft instead of claiming an
action occurred.

## Product language

**Use:** "AI Augmentation Layer", "extend the AI tools you already use",
"reusable skills and methodology", "host AI", "skill delivery", "AI Chat Tools" and
"AI Development Tools".

**Avoid as product positioning:** "AI platform", "AI agent runtime", "new AI chatbot",
"AI orchestration service", "server-side intelligent router" or "AI Kit executes your workflow".
"Pipeline" may describe a **host-executed sequence** of skills, not a server-side AI Kit service.
"Agent" is valid for optional role files used by coding clients; it is not an AI Kit-hosted agent.

## Review gate for future work

Before proposing a feature, documentation change or landing-page claim, ask:

1. Does this **augment an existing host AI** or recreate its reasoning, memory or execution?
2. Is the result useful to an end user without requiring knowledge of the internal skill catalog?
3. Is it independent of a specific LLM vendor, with client-specific adaptations only where needed?
4. Does it preserve the boundary between public methodology, Knowledge and private user context?
5. Are performance, quality and cross-client compatibility claims backed by actual tests?

Keep this document, the README, the landing introduction and agent-facing instructions consistent.
