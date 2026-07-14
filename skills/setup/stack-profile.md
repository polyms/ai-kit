# Stack profile

Per-repo **Stack manifest** — axes that filter Knowledge search (`search_knowledge`
`axes`). Written by `/setup`; consumed by `/dev`, `/devops`, `/arch`. Pointer only; live recipes
stay in Ops CMS — see [knowledge.md](./knowledge.md).

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

## Notes

Optional stack notes for agents (deploy host, package manager, SSR yes/no) — not a substitute for
axes.
