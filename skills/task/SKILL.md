---
name: task
description: Draft or create actionable work tickets for features, technical work, operations and
  follow-ups. Use for task creation, task breakdown, acceptance criteria, viết task, tạo ticket. Unaccented Vietnamese examples include viet task, tao ticket.
---

# Task

**Codex / GitHub Copilot:** Apply [client compatibility](../../docs/agents/client-compatibility.md) before this workflow.

**All hosts:** Read [portable skill standard](../../docs/agents/portable-skills.md) and the target execution profile.

Choose standard task creation or [vertical slicing](vertical-slicing.md) for an approved spec with end-to-end
slices, prefactoring and dependency-ordered publication. Legacy `/to-issues` selects vertical slicing.
Do not publish without explicit action authorization and approved breakdown.

Use [task-template.md](task-template.md) and the shared work artifact standard
(`docs/agents/work-artifact-standard.md`). These references may be bundled by a skill provider.

1. Read the user's request and available parent requirement, decision or related tickets.
2. Identify one accountable outcome; split independent outcomes into separate tasks only when helpful.
3. Establish context, scope, deliverables, dependencies and verifiable acceptance criteria.
4. Distinguish agreed scope from assumptions; mark unknowns rather than inventing implementation details.
5. Use the template. For vertical-slice engineering issues from a PRD, use [vertical slicing](vertical-slicing.md)
   and its [slice template](vertical-slice-template.md) instead of drafting duplicate tasks.
6. Apply the shared quality check. Draft or publish according to the user's requested action.
   For publishing, use the connected tracker, search for duplicates, and return the actual ticket link.

Do not use this skill to report a defect; use `bug`. Do not create issues merely because a draft was requested.
