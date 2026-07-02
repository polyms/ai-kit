---
name: align
description: Align on a plan before building — clarify decisions, sharpen domain language via domain-modeling, update CONTEXT.md and ADRs. Invoke with /align, grill, làm rõ kế hoạch, chốt hướng, or when requirements are still fuzzy.
disable-model-invocation: true
---

# Align — Align Before You Build

Run an [`align-loop`](../align-loop/SKILL.md) session. Use [`domain-modeling`](../domain-modeling/SKILL.md) when engineering or overloaded terms are involved.

Close the communication gap before `/pm`, `/ux`, or `/dev`. Follow [`align-loop`](../align-loop/SKILL.md) pacing.

Run `/setup` first if `docs/agents/` is missing.

## Quick Router

| Intent                           | Mode                                                                         |
| -------------------------------- | ---------------------------------------------------------------------------- |
| Plan alignment (no domain terms) | [`align-loop`](../align-loop/SKILL.md)                                       |
| Engineering + domain terms       | [`align-loop`](../align-loop/SKILL.md) + [`domain-modeling`](../domain-modeling/SKILL.md) |

## Handoff

Enter when align-loop (+ domain-modeling, if used) completion criteria are met.

| Next step | When                                        |
| --------- | ------------------------------------------- |
| `/pm`     | Need PRD, user stories, or formal spec      |
| `/dev`    | Small, well-bounded change with clear seams |
| `/ux`     | UI flows or design specs needed first       |

End with:

```
## Decisions
- [bullet list]

## Open Questions
- [if any]

## Next Step
→ /pm | /ux | /dev
```

**Completion criterion:** Handoff block delivered with `## Next Step` pointing to exactly one of `/pm`, `/ux`, or `/dev`.

## Agent

For long alignment sessions in isolated context:

```
Use the align agent to [task]
```

The agent reads this skill when invoked.
