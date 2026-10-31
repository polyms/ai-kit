# Tool and command choice

Choose the tool that already fits the task. Use available workspace tools for file operations,
search, and web research. Use the shell for git, the package manager, and the project toolchain.
When a dedicated tool is unavailable, use the simplest shell command that does the job.

## Workspace and research

- Find files and search text with workspace search tools when available; otherwise use `rg`.
- Read and edit files with workspace tools when available; otherwise use `sed` to inspect and
  `apply_patch` to make focused changes.
- Use the web tools for web research. Do not use shell networking tools as a substitute when a
  web tool is available.
- Do not use `python`, `python3`, `node -e`, or a temporary script to search, list, count, or read
  repository files when a workspace tool or `rg` can do it.

## Project commands

Before invoking a binary directly (`biome`, `vitest`, `prisma`, `npx`, `npm`, `yarn`), inspect
`package.json` scripts and `packageManager`, plus the lockfile. Prefer the script the repository
already defines.

- `pnpm-lock.yaml`, or `packageManager` starts with `pnpm` → use `pnpm <script>`, `pnpm exec`, or
  `pnpm dlx`. Do not use `npm`, `npx`, or `yarn` in a pnpm repository.
- `package-lock.json` → use npm.
- `yarn.lock` → use yarn.
- `bun.lock` or `bun.lockb` → use bun.

For example, a pnpm repository uses `pnpm check`, `pnpm test`, and `pnpm dev` instead of
`npx biome check` or `npm run test`.
