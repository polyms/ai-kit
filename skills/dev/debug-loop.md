# Debug Loop

Discipline for hard bugs. Skip phases only when explicitly justified.

## Phase 1 — Build a tight loop

**This is the skill.** A tight pass/fail signal that goes red on _this_ bug finds the cause.

Try in order:

1. Failing test at the seam that reaches the bug
2. Curl / HTTP script against dev server
3. CLI with fixture input, diff stdout
4. Headless browser (Playwright) — DOM/console/network assertions
5. Replay captured trace (HAR, payload, event log)
6. Throwaway harness — minimal subset, one function call
7. Property / fuzz — 1000 random inputs
8. Bisection harness — `git bisect run`
9. Differential — old vs new version, diff outputs
10. HITL script — last resort for human-required clicks

### Tighten

- Faster? (cache setup, skip unrelated init)
- Sharper signal? (assert exact symptom, not "didn't crash")
- Deterministic? (pin time, seed RNG, isolate filesystem)

### Non-deterministic bugs

Raise reproduction rate until debuggable. 50% flake is workable; 1% is not.

### Completion criterion

One command you've already run that is:

- [ ] **Red-capable** — drives bug path, asserts user's exact symptom
- [ ] **Deterministic** — same verdict every run
- [ ] **Fast** — seconds, not minutes
- [ ] **Agent-runnable** — unattended

No red-capable command → no Phase 2. Stop hypothesising.

## Phase 2 — Reproduce + minimise

- [ ] Loop produces the failure the **user** described
- [ ] Reproducible across runs (or high enough rate)
- [ ] Symptom captured for later verification

Shrink repro one cut at a time. Done when every remaining element is load-bearing.

## Phase 3 — Hypothesise

3–5 ranked hypotheses before testing. Each must be falsifiable:

> "If X is the cause, then changing Y will make the bug disappear."

Show list to user before testing.

## Phase 4 — Instrument

One variable at a time. Preference: debugger > targeted logs > never "log everything".

Tag debug logs: `[DEBUG-a4f2]` — cleanup is one grep.

**Perf branch:** measure baseline first, then bisect. Logs are usually wrong for perf.

## Phase 5 — Fix + regression test

Only if a **correct seam** exists — test exercises real bug pattern at call site.

1. Failing test from minimised repro
2. Fix
3. Pass
4. Re-run original (un-minimised) loop

No correct seam → document the architectural gap.

## Phase 6 — Cleanup

- [ ] Original repro no longer reproduces
- [ ] Regression test passes (or seam gap documented)
- [ ] All `[DEBUG-...]` removed
- [ ] Hypothesis stated in commit message
