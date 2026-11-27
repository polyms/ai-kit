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

Use [context contract](context-contract.md) to identify material gaps before each stage. Reuse the
shared context and source-backed artifacts; do not reload or retrieve unrelated context. For multi-skill
work, read this protocol once. Choose a relevant recipe only if it helps; use a
custom minimal route otherwise. Approved scope requiring estimates, implementation tasks and QA
can use `plan`, `task` and `qa` without fetching a recipe from `reqs`. In remote MCP, the catalog lists each recipe's hostPack and path.
Request the protocol through any selected pack, and the recipe through its hostPack using exact
paths. The host is only a retrieval location, not a required first stage. Load starterPaths of
selected skills, then relevant references. Batch missing exact paths per selected pack when
already known, instead of fetching templates in a second round; do not reload known files. Local clients
read these files from the kit. Do not use all recipes for a single request.

## Shared execution context

Maintain a compact session-local ledger in the agent's current conversation/context, or a
user-requested handover artifact. This is ordinary reasoning context, not a memory-system operation.
Do not create a persistent workspace record merely to orchestrate a task. Record only what is relevant:

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
Target context: <project / feature / environment / build / time when relevant>
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

For feature lifecycle handoffs, retain the **approved specification revision** separately from
**environment-specific map/observations**, deployment state and QA evidence. Include the source
owner and observed/verified time if available. Do not turn a QA-confirmed behavior into business
approval, or an approved requirement into a claim that a feature is deployed or available.
When the requested environment has no reliable evidence, carry `Unknown` forward; a recipient
must not fill that gap with another environment's results. Consumer-specific QA and PM/PO roles
remain enforced by the owning integration; a handoff never carries confirmation authority.

At a material handoff, the receiving skill checks its own contract against the supplied artifact:

- Map accepted artifact kinds and context needs to the actual accessible sources. Preserve stable
  requirement/criterion IDs, source revision, environment and observed status where relevant.
- Carry forward satisfied context, unresolved needs and the affected scope. Fetch only changed or
  missing evidence, not the entire original discovery conversation.
- Separate a proposed artifact from an approved baseline and a test plan from execution receipts.
  Do not downgrade an upstream blocker to a mere assumption when it still affects the next stage.
- If the source is unavailable, transfer an authorized excerpt or mark the dependent branch
  conditional/blocked. Never invent its contents or treat a handoff as write authorization.

Example: an approved requirement R-9 and a proposed estimate go from plan to task and QA. Tasks
retain R-9, effort assumptions and dependencies; QA tests R-9, not the estimate. Without execution
evidence, test cases remain Not run. No stage may claim that a draft was published.

## Domain composition

A consumer may extend a core skill with trusted local domain instructions and additive context
requirements. Keep the base skill name/version, core contract, domain rules and runtime facts
distinct. Domain rules may narrow scope or strengthen gates, never replace the core methodology,
weaken evidence requirements, override user authorization or silently rewrite approved scope.

Domain context keys must be distinct from core keys. Resolve them from the authorized consumer,
not the public skill registry. If a domain requirement conflicts with core safety or a confirmed
business decision, report the conflict and block the affected branch. Missing domain context
permits only a bounded draft when appropriate. Never send private runtime values to AI Kit.

The SDK exposes these as separate domain context metadata in `extendSkill`. Direct MCP consumers
may attach the same metadata in their own tool response. The client remains the reasoning and
execution layer; no cross-domain data access is implied.

## Conditional execution and completion

1. Select only stages needed to produce the requested outputs; skip a stage if a suitable verified
   artifact already exists or if the stage is irrelevant. Respect manual-only invocation rules.
2. Before a stage, check its inputs and unresolved blockers. Proceed when ready; use clearly labeled
   conditional drafts or estimates for nonblocking unknowns. Stop the affected branch when a
   blocking decision, missing evidence, authorization or capability prevents valid output.
3. When reviewing a proposed artifact, return concrete issues upstream. Revise only when the user
   requested revision or it is within a requested draft's scope. Never silently alter approved
   requirements, commercial decisions, tracker state or commitments.
4. Recheck affected criteria once after a permitted artifact revision; if the blocker persists or
   resolving it requires a user decision, report the issue and stop that branch. Authorized source
   changes with applicable review use the bounded [Review-Fix Protocol](review-fix-protocol.md)
   instead. Do not loop indefinitely.
5. Parallelize only independent read-only/drafting stages with stable inputs. Do not parallelize
   conflicting writes or downstream work that needs unsettled upstream decisions.
6. Before writing, resolve the destination, exact targets and authorization. Preserve unrelated
   fields, verify results where supported, and record successes, failures and unknowns individually.
   After a partial failure reconcile actual state before retry; never blindly repeat successful writes.
7. Complete when requested artifacts are delivered or their blockers are explained. Report
   meaningful completed, skipped, conditional and blocked stages; recommend only the next useful
   action. Never claim tests, deployments, approval or external writes that did not occur.

## Gate semantics

| Gate        | Meaning                                                                             |
| ----------- | ----------------------------------------------------------------------------------- |
| Ready       | Sufficient inputs and evidence for the next requested action. Not approval.         |
| Conditional | A draft or bounded analysis is useful, with assumptions and exclusions visible.     |
| Blocked     | A material missing decision, source, capability or permission prevents this action. |

Examples: a draft requirement with an unknown optional copy string may still support estimates;
an unsettled access-control rule blocks final permission acceptance criteria. A passing preview
build is not production QA. A recommendation can be sent as a proposal but not as an approved
decision. Test case design is not evidence of a passing test.

## Recipes

The catalog provides optional recipe paths under `workflows/`: product development, bug lifecycle,
business decision, sprint planning and release readiness. Each documents stage inputs, outputs,
skip conditions and stop gates. They do not prescribe every stage for every request.
