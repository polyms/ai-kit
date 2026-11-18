# Client-agnostic skill capabilities

A skill describes the work, not a vendor-specific API. The agent selects available authorized
integrations at runtime. These names are capability concepts, not new MCP tools or required connectors.

| Capability | Typical operations | Example integration classes |
| --- | --- | --- |
| project-tracker | Read, search, create or update work items | Astra, Jira, ClickUp, GitHub |
| knowledge-base | Find, read or publish documents | Notion, Confluence, Drive |
| communication | Draft or send messages | Email, Slack, Teams |
| source-control | Read repository, inspect changes, update PR when authorized | GitHub, GitLab |
| web-research | Retrieve and verify public evidence | Search, browser |
| data-analysis | Inspect tables, calculate, validate | Local runtimes, analytics systems |
| test-execution | Execute and collect actual test evidence | Browser, CI, test harness |
| design | Inspect or author design artifacts | Figma, local design resources |
| deployment | Check status, deploy only with authorization | CI/CD provider |

Resolve the actual destination and supported actions from the client. Read before write. Missing
capabilities degrade to a draft, a partial report or explicit inability to verify, never a fabricated result.

## Composition

Use handoffs when an output is a meaningful input to another skill. Example: research evidence ->
business decision -> requirements -> review -> plan -> task -> QA -> release.

This is an optional route, not a mandatory pipeline or automatic authorization. Load only skills
needed for the user's goal. Carry the artifact, linked sources, agreed scope and open questions across
handoffs. Do not repeat discovery or mutate prior artifacts without a requested change.
Manual-only local skills retain existing invocation policies; use the client's explicit selection
where required. The MCP provider delivers content, not an orchestration engine.

For remote discovery, see [skill intelligence](skill-intelligence.md). Related skill metadata describes
optional handoffs. It is not a dependency graph, a mandatory chain or automatic write authorization.
