# Incident templates

Process artifacts for `/devops` — classify severity, communicate, close with a
blameless post-mortem. Use after (or alongside) Knowledge **symptom → fix → verify**.

These are **templates**, not live Runbook retrieval. Stack-specific fix steps still
come from MCP `search_knowledge` (`intent: incident`).

## When to use

| Situation                            | Template                                                       |
| ------------------------------------ | -------------------------------------------------------------- |
| Active outage / deploy red for users | [Severity](#severity-matrix) + [Status update](#status-update) |
| Fix verified, need formal close      | [Post-mortem](#post-mortem)                                    |
| SEV1/SEV2 or repeated same class     | Post-mortem required within 48h                                |

## Severity matrix

Classify before deep troubleshooting when user impact is unclear:

| Level    | Criteria                                     | Response          | Update cadence  |
| -------- | -------------------------------------------- | ----------------- | --------------- |
| **SEV1** | Full outage, data loss risk, security breach | Immediate         | Every 15 min    |
| **SEV2** | Degraded for >25% users, key feature down    | < 15 min          | Every 30 min    |
| **SEV3** | Minor feature broken, workaround exists      | < 1 hour          | Every 2 hours   |
| **SEV4** | Cosmetic / no user impact                    | Next business day | Daily / backlog |

**Auto-upgrade:** impact doubles; SEV1 no root cause in 30 min; data integrity concern →
SEV1; paying customers blocked → minimum SEV2.

## Status update

Fill in chat (or incident channel). Honest unknowns beat false confidence.

```markdown
## Incident status — SEV[N]

**Status:** Investigating | Identified | Mitigating | Resolved
**Impact:** [who / % / which surface]
**Current understanding:** [cause or "unknown — ruled out X"]
**Actions taken:** […]
**Next steps:** […]
**Next update:** [time or trigger]
**Knowledge match:** [RB-xxx / none — search terms]
```

## Post-mortem

Default after SEV1/SEV2. Blameless: frame _system_ gaps, not people.

```markdown
# Post-mortem: [title]

**Date:** YYYY-MM-DD · **Severity:** SEV[N] · **Duration:** [start–end]
**Status:** Draft | Review | Final

## Executive summary

[2–3 sentences: what happened, who was affected, how resolved]

## Impact

- Users / revenue / SLO budget: […]
- Support tickets: […]

## Timeline (UTC)

| Time  | Event |
| ----- | ----- |
| HH:MM | …     |

## Root cause

**Immediate:** […]
**Underlying:** […]
**Systemic:** […]

### 5 Whys

1. … →
2. … →
3. … →
4. … →
5. → [systemic issue]

## What went well

- …

## What went poorly

- …

## Action items

| ID  | Action | Owner | Priority | Due | Status |
| --- | ------ | ----- | -------- | --- | ------ |
| 1   | …      | @…    | P1       | …   | Open   |

## Lessons

[Architectural / process changes this incident demands]
```

## Close checklist

- [ ] Severity recorded
- [ ] Knowledge article applied or gap filed (search terms + stack axes)
- [ ] Verify steps green
- [ ] Status all-clear sent (SEV1/SEV2)
- [ ] Post-mortem drafted when required; action items have owners

Hand off app-code follow-ups to `/dev`. Hand off irreversible **why** to ADR / `/align`.
