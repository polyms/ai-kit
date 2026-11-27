# Execution profile: AI Kit

## Canonical sources

- Source code, issues, PRs, domain docs and ADRs: `polyms/ai-kit` on GitHub, at the relevant revision.
- Knowledge: AI Kit Ops CMS, not repository fixtures.
- CI: GitHub Actions; landing deployment: Vercel. Match project, commit and environment.

## Operation routes

| Operation | Preferred | Fallback |
| --- | --- | --- |
| Read/search repo | Verified checkout when present | GitHub MCP / gh API |
| Read PR/issue/diff | GitHub MCP when available | gh / verified local git comparison |
| Edit files/create branch, commit, PR | Verified workspace + git | Authorized GitHub MCP |
| Tracker mutation | GitHub MCP when available | gh |
| Read CI/deployment | GitHub / Vercel MCP | Provider CLI |
| Run tests/builds | Matching checkout | Authorized CI on matching revision |
| Knowledge | AI Kit MCP | Published Knowledge site |
| Review delegation | Host subagents if available | Separate inline axes |

## Policy

Follow repository rules and user scope. Use a branch and PR for proposed changes; do not assume
merge/deploy approval. Confirm actual source/ref, tool and permission per run. Verify receipts,
reconcile ambiguous outcomes and disclose missing evidence. No credentials recorded; this profile
is guidance, not proof that tools are available in every host.
