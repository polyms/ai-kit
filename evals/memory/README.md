# Host-agent memory evaluation

The 18 synthetic scenarios use the existing paired evaluation runner.

```sh
pnpm eval:run --suite memory --dry-run
pnpm eval:run --suite memory --case MP-16 --model YOUR_MODEL --judge-model YOUR_JUDGE
```

Both arms receive the same historical P0/P1 skill contracts and starter content, verified against
the content-addressed Git blobs in baseline.json. Only the assisted arm receives the current
live Memory Protocol and optional hints. The fixture supplies simulated host-native remembered
context directly; it is not fetched from a real provider. A full Git checkout containing the
historical baseline blobs is required. Missing blobs fail closed. Fixture fingerprints cover the
actual guidance, so these revised cases are not comparable to the older 0.3.5 memory pilot.
Immutable SDK snapshots are unchanged.

MP-16 and MP-17 expose an optional synthetic external lookup to both arms as a trap: expected
calls are zero. The trace must not contain a memory call, and semantic grading checks that no
connection, enablement, persistence or invented history is requested. Other scenarios have no
lookup tool. No real memory provider, memory writes, or workspace integration is involved.

Dry runs, structural tests and the localhost mock are not measured model quality. Run actual
models only with an explicitly configured endpoint, synthetic records and appropriate authorization.
Report paired token, latency, trace and semantic results. Native agent behavior and actual
host-memory availability require separate client verification.
