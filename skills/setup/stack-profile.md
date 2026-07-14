# Stack profile

Per-repo **Stack manifest** — axes that filter Knowledge search (`search_knowledge`
`axes`). Written by `/setup`; consumed by `/dev`, `/devops`, `/arch`. Pointer only; live recipes
stay in Ops CMS — see [knowledge.md](../../docs/agents/knowledge.md).

## Axes

List lowercase tags matching Ops CMS `axisTags` vocabulary (not repo or path names):

```yaml
axes:
  - tanstack-start
  - tanstack-router
  - zustand
  - vercel
  - pnpm
  - nx
  - monorepo
```

**Rules:**

- Prefer tags that already appear on Knowledge articles (e.g. `vercel`, `tanstack-start`,
  `nitro`, `biome`)
- Omit axes the repo does not use — do not invent project-specific labels
- When unsure, ask the user once; prefer a short accurate list over a long guess
- Org-default / kit-only repos may use a single axis such as `polyms-default`

## Detected from

Summarize how axes were chosen (package.json deps, `vercel.json`, workspace layout, user
confirm):

- …

## Coverage

Optional bootstrap from MCP **`get_knowledge_coverage`** after axes are confirmed. Not live SSOT —
`/arch` and `/arch-refactor` re-call MCP for the subset under work.

### Axis heuristics (per intent)

Do **not** pass the full axes list in one shot. For each intent:

1. `subset = intersection(profile.axes, POOL)`
2. Keep tags in **core priority** order, max ~3–4
3. If subset empty → **skip** that intent (never call with empty `axes`)
4. Call `get_knowledge_coverage({ axes: subset, intents: [intent] })`

| Intent      | Pool                                                                                                                           | Core priority                                               |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| `incident`  | vercel, tanstack-start, nitro, pnpm, nx, monorepo, postgres, prisma, ssr, build-output-api, github-packages, ci, github-actions | vercel → tanstack-start → nitro → (pnpm\|nx)                |
| `design`    | tanstack-start, tanstack-router, nitro, zustand, pnpm, nx, monorepo, prisma, typescript                                        | tanstack-start → tanstack-router → zustand → (nx\|monorepo) |
| `toolchain` | biome, prettier, typescript, polyms-default, markdown, formatting                                                              | biome → prettier → (polyms-default if present)              |

### Example section (fill from MCP; omit intents you skipped)

```markdown
## Coverage

Bootstrap only — re-call `get_knowledge_coverage` in `/arch` / `/arch-refactor`.

| Intent      | Axes subset                              | Covered | Article ids |
| ----------- | ---------------------------------------- | ------- | ----------- |
| incident    | vercel, tanstack-start, nitro            | yes/no  | …           |
| design      | tanstack-start, tanstack-router, zustand | yes/no  | …           |
| toolchain   | biome, prettier                          | yes/no  | …           |
```

## Notes

Optional stack notes for agents (deploy host, package manager, SSR yes/no) — not a substitute for
axes.
