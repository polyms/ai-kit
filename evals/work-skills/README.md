# Work skill evaluations

These fixtures measure output quality, not merely retrieval. They contain synthetic prompts and
expected criteria, not third-party skill content or real customer data.

For each case in cases.json, use the exact same input in two isolated sessions of the same model:
first without the skill, then with the relevant skill and bundled templates. Use mock tracker/tool
responses for side-effect tests; never publish fixtures to real projects. Repeat on compatible clients
and record model, client, date, skill revision, available tools, output, token usage and elapsed time
when exposed. Do not invent measurements.

Grade each criterion pass/fail/unobservable, cite the exact output evidence, and treat a failed hard
gate as an overall fail. Compare skill and baseline results rather than claiming causality from a
single run. Record inconsistent behavior across multiple runs when possible. An unobservable
criterion remains unverified; report it separately from pass rate.

Use the rubric and cases as starting points. Add a regression case whenever a skill fails in real use,
with anonymized inputs and explicit expected behavior. No automated runner is included in this change.
