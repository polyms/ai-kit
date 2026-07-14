# Status report — multi-slice /dev

Use on **long** implement or debug sessions (multi-slice feature, `dev-agent`, or when
the user asks for progress). Do **not** spam on every single-line fix.

Pairs with the Implement workflow in [SKILL.md](SKILL.md): refresh at seam confirmation,
after each green slice, and before ship checklist.

## Template

```markdown
## /dev status

**Phase:** Orient | Seams | Ladder | Red-green | Ship | Blocked
**Feature / issue:** [link or title]
**Spec:** [PRD / docs/design/… / issue #]

### Progress
| Slice | Seam | Status | Note |
| ----- | ---- | ------ | ---- |
| 1 …   | …    | pass / in progress / blocked | … |
| 2 …   | …    | …      | … |

**Current:** slice [N] of [M] — [one line]

### Quality gates
- Tests: [green / red — which]
- Scope self-check: [pending / filled]
- Visual ship (UI): [n/a / pending / passed + evidence]
- Open 🔴 from `/code-review`: [none / list]

### Blockers
- [none | escalate to `/pm` | `/design` | `/devops` | user decision]

### Next
[Exactly one next action]
```

## Rules

- One **Next** only — no option menus.
- Blockers name the upstream skill; do not relitigate PM/design in `/dev`.
- When **Blocked** phase: stop coding; report and wait.
- After all slices pass ship checklist → hand off `→ /code-review` (or ship if user said so).
