---
name: track
description: Inspect, summarize and update existing work items across issue trackers. Use for ticket
  reviews, backlog queries, bulk assignments, status changes, deadlines, kiểm tra và cập nhật ticket.
---

# Track

Use the [tracking templates](tracking-templates.md) and shared work artifact standard
(`docs/agents/work-artifact-standard.md`).

## Inspect

1. Resolve the project, tracker, ticket IDs, filters and time range from the request.
2. Retrieve current ticket fields and relevant comments; follow pagination for claimed totals.
   Separate confirmed decisions, proposals and unresolved questions. Do not infer status from comments.
3. Summarize using the appropriate template. Report the snapshot time, scope and incomplete results.

**Done when:** Each cited ticket has a real ID/link, latest known status and relevant next action.

## Update

1. Resolve each exact target and intended field or content change. Read its current state first.
2. Preserve existing scope, decisions, acceptance criteria, links and unrelated fields. When changing
   prose, modify the relevant section instead of replacing the ticket with an abbreviated summary.
3. Map requested statuses, users and priorities to real tracker values. For bulk actions, enumerate
   the exact affected set and disclose ambiguous targets before changing those targets.
4. Execute only the requested changes with authorized tools. Verify resulting values by reading
   back where supported; report successes, failures and skipped items separately.

**Done when:** Requested changes are verified or their verification limitations are explicit.

Use `task` for new work, `bug` for defects and `triage` for the configured engineering triage
state machine. Never interpret a read-only review or a proposed change as write authorization.
