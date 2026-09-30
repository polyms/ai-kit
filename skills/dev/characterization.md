# Characterization — safety net before legacy change

Use when changing **existing, shipping behavior** that has **no test covering the
area about to be touched**. Skip for greenfield seams with clear acceptance criteria
and no prior behavior to preserve.

Pairs with [tdd-guide.md](tdd-guide.md): characterization captures **as-is**; red-green
drives **desired**. Inspired by Feathers — *Working Effectively with Legacy Code*.

## When the pointer fires

- Bug fix or feature touch on a module/path with no automated coverage of current
  behavior at the confirmed seam
- Refactor or seam-creating change required to make the area testable

Does **not** fire: new vertical slice on a new seam; pure docs; one-line copy.

## Procedure

1. At the confirmed seam, write a test that asserts **current** observable behavior
   (even if that behavior looks wrong).
2. Run it — must **PASS** before any production edit. Fail → fix the test, not the
   product code (you mis-captured as-is).
3. Make the intentional change (bug fix / AC).
4. Characterization fails only where behavior intentionally changed → update those
   assertions; unintended fails → regression, revert or fix.
5. Behavior meant to stay the same → characterization still PASS.

## WRITE delta · RUN full suite

- **WRITE** new tests only for the delta (+ characterization of the touched area).
- **RUN** the whole automated suite already in the repo (or the package/workspace
  that owns the change) before declaring the slice done — green full suite is the
  proof that untouched callers stayed intact.

Do not retrofit characterization for the entire codebase in one pass.

## Vs greenfield TDD

| | Characterization | Red-green TDD |
| --- | --- | --- |
| Asserts | Behavior **as it runs now** | Behavior **as required** |
| First run | GREEN | RED |
| Purpose | Detect unintentional change | Drive implementation |

## Completion criterion

Characterization at the touched seam PASSed before the first production edit;
intentional assertion updates listed; full suite (WRITE-delta / RUN-all) green or
gap documented.
