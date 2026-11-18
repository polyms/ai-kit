# Client compatibility

Apply these adaptations only in **Codex** or **GitHub Copilot in VS Code**. Cursor and
Claude Code retain their existing paths, invocation flags, and tool instructions. Identify
the active agent harness from session capabilities, not from the selected model name.

## Skills and explicit invocation

The kit uses `/name` as its pipeline notation. In Codex CLI/IDE, explicitly select `$name`
or use `/skills`; in Copilot, select `/name` from the skill menu. In desktop clients, use
the available skill picker. Natural-language authorization already given in the conversation
still applies; changing client syntax does not require another approval.

Keep `name`, `description`, and `disable-model-invocation` in `SKILL.md` for existing
clients and Copilot. For every manual-only skill, also ship `agents/openai.yaml` with:

```yaml
policy:
  allow_implicit_invocation: false
```

This controls automatic selection in Codex. A principal explicitly delegated a workflow
can read its playbook as a reference; do not confuse reading a file with implicitly
selecting a manual-only skill. Reading another skill's reference does not authorize
publishing, implementation, or a scope change.

An installed model-invoked `ui-kit` skill may be read directly for component mapping in
Codex/Copilot. The design pre-flight's availability check is satisfied by reading that
installed catalog; do not stop to request a second invocation. If it is missing or
explicitly manual-only, request the skill through the current client's picker. The
existing `collab` exception and all design/spec quality checks remain in effect.

## Files and project setup

Codex and Copilot discover project skills in `.agents/skills/` and personal skills in
`~/.agents/skills/`. Bootstrap links kit skills there once, shared by both clients.
Generated principal adapters live in `$CODEX_HOME/agents/*.toml` (default `~/.codex`)
and `~/.copilot/agents/*.agent.md`. Adapters point back to `agents/*.md` in this checkout.
Do not copy a second role body or force a model/tool allowlist in the adapter.

When setup runs for Codex/Copilot, update `AGENTS.md`. If only `CLAUDE.md` exists, preserve
it and create a small `AGENTS.md` that directs the agent to read it, then add the approved
`Agent skills` block to `AGENTS.md`. This is the client-specific exception to setup's
legacy single-config-file rule. If neither exists, use `AGENTS.md`. Preserve unrelated
instructions and never replace a working Cursor or Claude configuration.

For opt-in chat voice, keep the existing Cursor rule and Claude symlink. Add a pointer
in the `AGENTS.md` Voice subsection telling Codex/Copilot to read the Markdown body of
`.cursor/rules/agent-voice.mdc`; those clients do not automatically apply `.mdc` flags.
When voice is not selected, do not add that pointer.

## Feature map publication

The map is one directory at `.agents/skills/<slug>/` (default slug `feature-map`).
`docs/agents/feature-map.md` names that path in `Skill` and `Index`. Codex and Copilot
discover it there. Cursor and Claude do not, so publish the same package with relative
symlinks:

```bash
ln -sfn ../../.agents/skills/<slug> .cursor/skills/<slug>
ln -sfn ../../.agents/skills/<slug> .claude/skills/<slug>
```

Ship `agents/openai.yaml` inside the `.agents` package. Keep `SKILL.md` frontmatter for
Copilot, Cursor, and Claude.

A legacy map whose real files still sit in `.cursor/skills/<slug>` moves to `.agents` on
the next `/build-feature-map` run. Do not leave two copies. If a tool path already holds
independent content, compare it first. Do not force-replace it or discard differences.
Reconcile authorized changes and preserve a backup outside skill discovery before
converting it to a shared link.

The completion criterion includes discovery from `.agents` plus the two tool symlinks.
Other workflows follow the pointer, including when a repository still has the older
Cursor directory until that move runs.

## Subagents and runtime tools

`Agent tool`, `Task`, `subagent_type=Explore`, and `general-purpose` describe legacy
client calls. Translate the intent using the **actual tool schema in this session**:

- Codex: use the available spawn tool (`collaboration.spawn_agent` in desktop sessions
  that expose it), with `explorer` for exploration and `default` for general work, or
  the named principal when available. Use the session's send/wait controls.
- Copilot harness: use its native `task` delegation tool. In the VS Code Local harness,
  use `runSubagent` when exposed. Their argument schemas differ; do not copy arguments
  from another client. Local subagent calls are stateless: pass prior results into a
  fresh call rather than attempting a resume the client does not support.
- Preserve independent review/design briefs, role ownership, and disk verification.
  Launch independent work concurrently only up to available slots; queue the remainder.
  Do not require three tool calls in a single message if the client cannot express it.
  For a pure scan or review with no delegation tool, apply its checklists in the parent
  and disclose the missing isolation. For `collab`, do not impersonate absent principals;
  report the missing capability before starting that delegated packet.

Use the current client's question, browser, preview, and shell capabilities. Do not
invent unavailable tools, require Plan mode for a conversation, or change permissions
to satisfy a playbook. Existing user authorization takes precedence over repeated
confirmation steps. MCP server aliases and tool prefixes can differ; resolve tools by
their actual name and schema in the session.

## Sources and verification

Checked against [Codex skills](https://learn.chatgpt.com/docs/build-skills),
[Codex instructions](https://learn.chatgpt.com/docs/agent-configuration/agents-md),
[VS Code skills](https://code.visualstudio.com/docs/agent-customization/agent-skills),
[VS Code custom agents](https://code.visualstudio.com/docs/agent-customization/custom-agents),
and [VS Code subagents](https://code.visualstudio.com/docs/agents/run/subagents).

Installer tests verify files, policies, safe replacement, idempotence, and legacy client
isolation. End-to-end activation still requires a new session in each installed client:
check skill/agent discovery, explicitly select one manual skill, and confirm a principal
reads its source role. OAuth and enterprise policies remain client/account specific.

Run `pnpm test:clients` after installing dependencies. Before publishing installation
instructions, run it from a clean export of the exact Git revision being released;
untracked adapters or configuration files in a working checkout are not release evidence.
