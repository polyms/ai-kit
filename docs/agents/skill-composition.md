# Skill composition

## Scope

Compose skills only when the requested outcome needs multiple distinct workflows. A recipe is an
advisory route, not an execution engine. Honor explicit skill selection and the client's invocation
policy. A skill's own instructions still govern its work. Related skills and contracts do not
authorize side effects, and no recipe implies approval to implement, publish, send or deploy.

## Discover and load

Use catalog contracts to select a route: accepts lists alternative useful input kinds; produces lists
possible outputs; readyWhen describes a completion gate. These are semantic hints, not all mandatory
inputs or a data validator. Read the selected workflow to determine actual prerequisites.

For multi-skill work, read this protocol once. Choose a relevant recipe only if it helps; use a
custom minimal route otherwise. In remote MCP, the catalog lists each recipe's hostPack and path.
Request the protocol through any selected pack, and the recipe through its hostPack using exact
paths. The host is only a retrieval location, not a required first stage. Load starterPaths of
selected skills, then relevant references; avoid reloading files already in context. Local clients
read these files from the kit. Do not use all recipes for a single request.

## Shared execution context

Maintain a compact session-local ledger, in memory or a user-requested handover artifact. Do not
create a persistent workspace record merely to orchestrate a task. Record only what is relevant:

- Goal, requested deliverables, explicit exclusions, destination, language and relevant constraints.
- Confirmed requirements and decisions, each with its source or version; proposals and assumptions
  remain separately labeled.
- Evidence and artifact references: stable source IDs/URLs/paths where real, or clear session-local
  labels for draft artifacts. A local label is never a tracker ID.
- Open questions, blockers, stage status, authorization scope and observed write/test receipts.

Keep the latest approved baseline distinct from proposed revisions. Reuse prior work; retrieve the
latest source when state may have changed. Do not pass secrets or unnecessary personal data.

## Handoff envelope

For each material transfer, retain the artifact itself or a sufficient accessible reference, plus:

```text
From / to: <producer> -> <consumer>
Goal and scope: <requested outcome>
Artifacts: <kind; draft label or real reference; version/status>
Confirmed facts and decisions: <source-backed statements>
Open assumptions and blockers: <impact / affected scope>
Gate: ready | conditional | blocked
Next action: <specific permitted action>
Authorization / receipt: <draft-only, read, explicitly requested write; result if any>
```

Use compact prose or this shape. Do not force JSON into user-facing documents or expose the internal
ledger unless useful. Validate the receiver can access the artifact; pass the relevant excerpt if
not. A handoff preserves original acceptance criteria and references; it does not reapprove them.
Artifact readiness is independent of publication, execution and approval status.

## Conditional execution and completion

1. Select only stages needed to produce the requested outputs; skip a stage if a suitable verified
   artifact already exists or if the stage is irrelevant. Respect manual-only invocation rules.
2. Before a stage, check its inputs and unresolved blockers. Proceed when ready; use clearly labeled
   conditional drafts or estimates for nonblocking unknowns. Stop the affected branch when a
   blocking decision, missing evidence, authorization or capability prevents valid output.
3. When reviewing a proposed artifact, return concrete issues upstream. Revise only when the user
   requested revision or it is within a requested draft's scope. Never silently alter approved
   requirements, commercial decisions, tracker state or commitments.
4. Recheck affected criteria once after a permitted revision; if the blocker persists or resolving
   it requires a user decision, report the issue and stop that branch. Do not loop indefinitely.
5. Parallelize only independent read-only/drafting stages with stable inputs. Do not parallelize
   conflicting writes or downstream work that needs unsettled upstream decisions.
6. Before writing, resolve the destination, exact targets and authorization. Preserve unrelated
   fields, verify results where supported, and record successes, failures and unknowns individually.
   After a partial failure reconcile actual state before retry; never blindly repeat successful writes.
7. Complete when requested artifacts are delivered or their blockers are explained. Report
   meaningful completed, skipped, conditional and blocked stages; recommend only the next useful
   action. Never claim tests, deployments, approval or external writes that did not occur.

## Gate semantics

| Gate | Meaning |
| --- | --- |
| Ready | Sufficient inputs and evidence for the next requested action. Not approval. |
| Conditional | A draft or bounded analysis is useful, with assumptions and exclusions visible. |
| Blocked | A material missing decision, source, capability or permission prevents this action. |

Examples: a draft requirement with an unknown optional copy string may still support estimates;
an unsettled access-control rule blocks final permission acceptance criteria. A passing preview
build is not production QA. A recommendation can be sent as a proposal but not as an approved
decision. Test case design is not evidence of a passing test.

## Recipes

The catalog provides optional recipe paths under `workflows/`: product development, bug lifecycle,
business decision, sprint planning and release readiness. Each documents stage inputs, outputs,
skip conditions and stop gates. They do not prescribe every stage for every request.
