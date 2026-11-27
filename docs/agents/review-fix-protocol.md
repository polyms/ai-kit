# Review-Fix Protocol

Host-executed guidance for source changes. AI Kit supplies methodology, not an autonomous runtime.
Use `dev` for implementation and `code-review` for independent Standards, Spec and Simplify
passes. This protocol does not replace either skill, functional QA, E2E, or release gates.

## Activation and authority

- Enter after an authorized implementation or bug fix when pre-merge review is required by the
  project or requested by the user, or when the user requests code review AND fixes.
- Review-only, draft-only and diagnosis-only requests retain their original mode. Review-only
  stops with findings; a draft may be revised in context but never written without authority.
- Do not expand approved requirements, change unrelated code, weaken tests, suppress valid
  errors, change permissions, or assume commit, PR, merge, deploy or publication authority.
- The parent host coordinates the loop; delegated reviewers are read-only and return findings,
  and authorized implementers fix them. Prefer independent review context when available; use
  separate inline axes otherwise and disclose that limitation.

## 1. Establish the baseline

Pin the target project, approved requirements (or explicit bounded user ask), fixed comparison
base, current head/worktree and applicable verification gates. Include authorized uncommitted
changes in the review snapshot; never silently exclude them or include unrelated user edits.
Use equivalent remote comparison and source tools where available. If the target changes
externally, reconcile before continuing; do not overwrite someone else's work.

Keep a compact session-local ledger: iteration, reviewed revision or worktree snapshot, finding
ID, axis, severity, evidence, disposition, fix, verification receipt and remaining blockers.
This is the executing agent's own working context, not a memory service or persistent store.
Reuse already retrieved methodology and stable evidence; refresh changed diffs and check results.

**Completion criterion:** Target, comparison, authority, criteria and required gates are known;
material missing evidence or permissions block the affected action.

## 2. Review, fix, verify, repeat

1. Run a fresh `code-review` on the entire in-scope change set against the pinned comparison base
   and original requirements. Do not merely recheck the previous fixes. Include regression,
   security and scope risks in the applicable axes. Assign stable IDs to actionable findings.
2. Validate findings against actual evidence. Fix confirmed, in-scope blockers and actionable
   suggestions through `dev`; do not chase cosmetic nits, speculative improvements or rejected
   findings. Record why any remaining finding is deferred, rejected or blocked. Escalate
   decisions that would change scope; do not silently mark them resolved.
3. Run affected verification after each fix batch and the required full gate set before readiness.
   Use actual commands or matching authorized CI evidence. A failed check becomes a finding;
   missing execution or stale evidence is not a pass.
4. Refresh the entire comparison and repeat the review on the changed snapshot. A fix or a green
   test alone never completes the loop. Continue without asking for approval again for fixes
   already authorized in scope. Do not recursively start another loop inside the fixer or reviewer.

**Completion criterion:** Each fix batch has a fresh review of its resulting snapshot; verification
receipts and finding dispositions refer to the current changes, not an earlier head.

## 3. Stop conditions and readiness

Default budget: at most five fix batches, with a final review after the fifth batch. Honor
a tighter user/project limit and allow an explicit larger finite limit. Stop earlier after two
consecutive batches without material progress (the same unresolved finding or failed gate,
or an oscillating fix), exhausted host/tool budget, or a blocker requiring a human decision.
A blocked finding need not prevent independent safe fixes within the remaining budget.

- **Ready for approval:** Fresh review of the final snapshot completed, no confirmed actionable
  in-scope findings remain, and every required gate passes on that snapshot (or has an explicit,
  justified not-applicable disposition). Missing required review evidence is not clean.
- **Blocked / incomplete:** A required gate is failed, unknown or unverified; findings remain,
  the scope needs approval, or the loop budget is exhausted before readiness. Report the reason.
- A clean result is not authorization to merge or deploy. No required review or verification gate
  may be downgraded to achieve readiness. Do not claim independent review if performed inline.

Return the number of fix batches and review passes, resolved and remaining findings with reasons,
actual check results and revision, review isolation limitations, and final readiness. End with the
owning workflow's single preferred next step. If the host cannot complete the loop, report the
last verified state and next permitted action rather than promising background work.
