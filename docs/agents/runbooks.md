# Runbooks (agents)

Before changing deploy/CI/infra config, check **`docs/runbooks/`**.

## Retrieval

1. Read [docs/runbooks/README.md](../runbooks/README.md) — index by symptom
2. Open the matching runbook; search by **trigger phrases** in the metadata block
3. Apply **fix** only after confirming **symptom** and **cause** match logs

## DevOps agent

When acting as deploy/infra owner:

- Prefer runbook **verify** steps over guessing config
- Do not set `outputDirectory` for TanStack Start + Nitro unless the runbook says otherwise
- Do not append secrets to committed `.npmrc` — use install scripts + env vars (see RB-001)
- Escalate to ADR if the fix requires reversing an accepted architecture decision (`docs/adr/`)

## Related

- App quick start: `apps/landing/DEPLOY.md`
- Architecture: `docs/adr/` (note ADR-0002 is partially superseded by Vercel + Start stack — see RB-001)
