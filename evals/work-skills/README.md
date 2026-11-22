# Work skill evaluations

These fixtures measure output quality, not merely retrieval. They contain synthetic prompts and
expected criteria, not third-party skill content or real customer data.

For each case in cases.json, prioritize the everyday ChatGPT Instant client, then use Medium and High as contrast. For causal evaluation use the exact same input in two isolated sessions of the same model:
first without the skill, then with the relevant skill and bundled templates. Use mock tracker/tool
responses for side-effect tests; never publish fixtures to real projects. Repeat on compatible clients
and record model, client, date, skill revision, available tools, output, token usage and elapsed time
when exposed. Do not invent measurements.

Grade each criterion pass/fail/unobservable, cite the exact output evidence, and treat a failed hard
gate as an overall fail. Compare skill and baseline results rather than claiming causality from a
single run. Record inconsistent behavior across multiple runs when possible. An unobservable
criterion remains unverified; report it separately from pass rate.

Use the rubric and cases as starting points. Add a regression case whenever a skill fails in real use,
with anonymized inputs and explicit expected behavior. Use the [evaluation runner](../README.md) for opt-in paired model runs and deterministic scores.

## Instant-first regression

Use RT-39 and CP-18/CP-19 with ChatGPT Instant to check whether a daily-use client
can complete an owner-only Team Invitation draft with a minimal route, security-oriented
QA, safe estimate and reliable provenance. Check actual calls when a host trace is
accessible; model-authored tool lists are not independent audit records. Do not
award a speed/cost benefit just from fewer calls without measured tokens, bytes and latency.

## Routing and selective retrieval

Use `routing-cases.json` in fresh client sessions with the same catalog version. Give the prompt
without naming a skill; enable only read-only/mock integrations. Record chosen packs and order,
request paths, loaded files/response sizes when available, and final outcome. Compare expected
skills (ordered when the prompt requires a sequence), unnecessary packs and explicitly avoided packs.
Skip cases should not trigger any remote work pack. Judge the route before judging the final output.
Report unexpected packs, full-pack calls, unnecessary reloads and unsupported actions separately.
Fixture validation in Vitest does not execute the LLM or score its actual behavior.

For multi-skill handoffs and conditional gates, see `evals/composition/cases.json` and
`evals/composition/rubric.md`. The shared runner supports all three suites.
