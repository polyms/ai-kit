# Evaluation, governance and observability

Status: deterministic evaluation foundation and 92 synthetic scenarios are implemented. A
release smoke verifier and measured-run report generator are documented in
[Quality Baseline](../quality/baseline.md). Workflow-augmentation effectiveness and final thresholds remain unverified; AI Kit does not claim to increase model intelligence.

## Primary target: everyday, latency-sensitive AI workflows

AI Kit is client- and model-agnostic. Prioritize reliable, low-overhead execution
on each host's **everyday/default/fast configuration**: select the smallest useful
skill set, batch known exact-path retrieval, avoid unnecessary recipes, retain
critical QA coverage and report honest provenance. Do not require an advertised
reasoning level or a particular provider, product, client or model name.
Compare against higher-reasoning configurations **within the same host** where
they exist and are available. Measure quality, overhead and failure rates separately;
a longer response is not inherently a better one.

ChatGPT's **Instant** is the everyday configuration used in the
[2026-11-22 Team Invitation manual evaluation](../../evals/manual/2026-11-22-team-invitation.md).
Instant/Medium/High are **ChatGPT-specific labels**, not portable tiers for
Claude, Cursor, Codex or other hosts. This three-session observation does not
establish causal uplift, latency savings or statistical model rankings.

AI Kit may reference **Polyms UI Kit** (`@polyms/ui-kit`) as an optional
integration. Respect the host project's existing design system, stack and
explicit user choice; neither Polyms UI Kit nor any other design library is a
dependency for applying the core AI Kit methodology. If a project has no system,
Polyms UI Kit may be suggested as a candidate with explicit user approval
before adoption; never install or replace a stack automatically.

## Evaluation: does augmentation support the workflow?

Evaluate **what AI Kit provides**, rather than implying it changes model intelligence:
appropriate skill discovery, correct workflow and templates, Context Contract reuse,
requirement traceability, evidence and authorization boundaries, dependable handoffs,
and selective retrieval overhead. The host model owns reasoning and content quality.
Output comparisons can detect workflow effects, but cannot establish that AI Kit
enhances a model's inherent ability to reason. More tasks or QA cases are not
proof of product value.

The existing evaluation runner compares baseline and skill-assisted outputs using synthetic
fixtures and an explicitly configured compatible model endpoint. It tests routing, output and
composition and native-memory guidance; it can record retrieval traces and optional judge scores. At the PR #12 foundation there were 68 scenarios; use the current runner dry-run count rather than a fixed total. Scenario counts,
fixture validity, successful CI and dry runs are not measured model quality. Native clients
need separate integration tests. See [evaluation runner](../../evals/README.md).

| Dimension | What to evaluate |
| --- | --- |
| Skill adherence | Correct method, minimal routing, respected invocation, quality and authorization gates |
| Template / artifact adherence | Required structure, traceable evidence, correct acceptance fields, explicit limitations; don't equate length with quality |
| Context continuity | Approved scope, IDs, decisions and evidence retained through handoffs |
| Knowledge utilization | Relevant search, opened source, applicable version, fewer invented recipes |
| Host-native memory use | Relevant already available recollections, accurate use of past facts, handling of stale/conflicting context, zero unnecessary external memory calls |
| Capture / reflection | Supported lessons, no fabricated outcomes or persistence; host settings and privacy respected |
| Efficiency | Tool calls, reloaded bytes, latency, reported tokens; no unnecessary context inflation |
| Compatibility | Real behavior across tested models, clients, versions and tool capabilities |

For memory cases, give baseline and assisted conditions the same simulated host-native remembered context and current evidence. Only the assisted arm receives current guidance. No real memory provider is used. External synthetic lookup traps expect zero calls in both arms; test missing/disabled memory, irrelevant or stale recollections, approved versus proposed decisions, cross-scope privacy and no persistence. The actual trace checks external tool calls; it cannot observe internal recollection. Mock protocol checks and dry runs are not model-quality measurements.

Run deterministic contract, manifest, retrieval, scoring and fixture checks before model tests.
Compare like-for-like model and client configurations across repeated runs. Record revision,
selected route, actual retrieved references, elapsed time, payload bytes and reported token usage
where measured. Use independent review or a separate judge when possible. Mark unobservable gates
unverified; never fabricate verification. Preserve evidence of hard-gate violations, such as
unauthorized writes, invented QA evidence or leaked context. Choose benchmarks and release criteria
only after measurement and agreement. Do not run paid model calls without explicit configuration.

## Observability: understand what happened

Monitoring answers whether a service is healthy; observability helps interpret why a request or
component behaved as it did using emitted evidence. Logs record events, metrics summarize
measurements over time, and traces connect related operations and their timing.

| Signal | Possible AI Kit-owned observations |
| --- | --- |
| Logs | Skill delivery/version, route or endpoint status, error category, Knowledge operation outcome |
| Metrics | Request volume, latency distributions, error rates, payload sizes, SDK cache hits where measured |
| Traces | Correlated delivery and Knowledge-service steps, time spent and failed operation |

Separate operational health from quality. A successful response proves delivery only, not that the
host chose the correct skill, appropriately used its own memory or completed the user's task.
A Knowledge match is not proof of applicability. A service trace is not the model's hidden reasoning.

An illustrative timing chain could measure catalog resolution, bundle fetch and Knowledge search/open
when performed by AI Kit services or a supported opt-in harness. The trace may show a slow retrieval
step, but cannot observe uninstrumented host calls, external memory operations or inference.
Do not label host reasoning as an AI Kit trace span without observable evidence.
Do not prescribe central collection of consumer-side cache metrics. The SDK benchmark can measure
cold/warm p50/p95 from the consuming host; targets are not production results.

## Data governance

Collect only low-sensitivity, necessary operational metadata from surfaces AI Kit owns. Avoid
raw prompts, conversations, private workspace data, memory contents, secrets, identity tokens,
and unnecessary identifiers. Use authorized, minimized evidence for opt-in client evaluation.
Define retention/access and redaction before implementing collection. Telemetry is not Memory;
it may inform an authorized investigation or a synthetic regression case, but must never be
automatically converted into memory, Knowledge or self-training data. Do not add a cross-client
tracking or monitoring platform.

Governance is cross-cutting: obey host authorization, keep domain boundaries, track public content
provenance, distinguish proposals from approvals, review contributions and verify actual results.
Versioned delivery and deterministic checks are within AI Kit's responsibility; model-side
inference, private memory access and external execution are not.

## Voluntary public feedback

People using AI Kit do **not** have to run evaluation tools or send model traces.
If they voluntarily want to comment on skills, workflows or templates, let
AI Kit `prepare_feedback_issue` draft a public GitHub Issue and follow the
[conversation and GitHub handoff workflow](../feedback.md). The user reviews
and explicitly authorizes publication through the host's independent GitHub
integration. Without GitHub integration, use a prefilled URL.
The user decides whether to submit;
the maintainer reviews feedback manually. Only validated, generalized
observations may motivate subsequent reviewed methodology changes. No automatic
feedback ingestion, tracking or user-data collection.

## Improvement cycle

Review observable failures or user feedback, reproduce with a minimized synthetic case, identify
whether the issue belongs to skill guidance, Knowledge applicability, host behavior or consumer
integration, and make the smallest reviewed improvement. Re-evaluate the case and neighboring
regressions. A confirmed **workflow/process improvement** must be supported by comparable
measured evidence, not a bigger catalog, more telemetry, more test cases or more complex orchestration.
