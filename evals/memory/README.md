# Memory Protocol evaluation pilot

The 15 synthetic scenarios run through the existing paired evaluation runner:

```sh
pnpm eval:run --suite memory --dry-run
pnpm eval:run --suite memory --case MP-01 --model YOUR_MODEL --judge-model YOUR_JUDGE --max-requests 8
```

Actual model calls require the existing explicitly configured endpoint. A full Git checkout with both referenced revisions is required. No real workspace, memory provider or write tool is involved.

Both arms receive the same P0/P1 contract fields from the pinned 0.3.3 manifest with memory
hints removed, and historical starter files verified against a pre-P2 Git revision in
`baseline.json`. This baseline is a test fixture, not an available skill release. Only the
assisted arm receives the P2 hints and protocol from the pinned 0.3.3 source. In this targeted suite the skill route is fixed
to isolate memory behavior rather than routing accuracy. Fixture fingerprints include the actual
guidance. Never use private records or run paid calls without explicit configuration.

Four fixtures expose the same narrow synthetic read-only lookup to both arms. The actual
trace verifies one necessary recall, no redundant recalls, and denied scope requests.
Other cases have no lookup capability. The judge receives the same user evidence and actual
lookup trace when available; mark tool behavior unobservable where it cannot be checked.
Semantic output and hard gates use the existing blinded judge. No memory writes are enabled;
a model must not claim persistence or external execution.

Dry runs and structural tests are not measured quality. Compare paired runs and record actual
token, latency, tool and semantic results. Native client and Astra compatibility require
separate verification.
