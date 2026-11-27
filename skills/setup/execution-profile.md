# Execution profile

Project-owned guidance written or updated by /setup. Fill confirmed choices; use Unknown for gaps.
Do not copy sample destinations into a real project or record credentials, tokens or secret values.

## Canonical sources

| Artifact | System / target identifier or path | Authority / notes |
| --- | --- | --- |
| Source code / PRs | Unknown | Confirm repository and revision |
| Engineering issues | Unknown | Tracker policy and label mapping |
| Approved requirements / PRDs | Unknown | Approval owner and revision |
| Domain glossary / ADRs | Unknown | Canonical owner and path |
| Feature map / QA evidence | Unknown | Owner, environment and build |
| Deployments / CI | Unknown | Project and environment |

## Operation routes

Confirm preferred and allowed fallback routes to the SAME target. Examples are options, not
mandatory tools or permission grants. Resolve actual tool names/schemas at runtime.

| Operation | Preferred | Allowed fallback / limitations |
| --- | --- | --- |
| Read/search repository at target ref | Unknown | e.g. checkout, GitHub MCP, gh API |
| Read PR / compare changes | Unknown | e.g. GitHub MCP, gh, local git |
| Read/search issues and comments | Unknown | e.g. tracker MCP, gh/glab |
| Create/update/comment/label/close issues | Unknown | e.g. tracker MCP or CLI, authorized actions only |
| Edit files / create branch, commit, PR | Unknown | e.g. verified workspace or repository connector |
| Read CI/deployment logs | Unknown | e.g. provider MCP or CLI |
| Execute tests/builds | Unknown | e.g. matching checkout or authorized CI |
| Retrieve Knowledge | Unknown | e.g. AI Kit MCP, published site |
| Delegate review | Unknown | e.g. host delegation or independent inline passes |

## Write and verification policy

- Destination, branch protection, PR/commit strategy: Unknown.
- Tracker labels, approval authority, publication/mirroring rules: Unknown.
- Required checks, environment, QA and product approval: Unknown.
- Missing tools: use permitted equivalent routes; if source or authority cannot be verified, draft
  or report the affected blocker. No silent source switch or automatic credential changes.
- Reconcile ambiguous writes against actual target state before retrying.

## Validation

Record read-only checks performed, verified target/ref and available routes. Mark inaccessible or
unverified routes explicitly. Do not perform sample mutations to test access unless separately
authorized. Revalidate actual capabilities each run; update only affected sections on reconfiguration.
