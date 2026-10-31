# Tool and command choice

Use the tool that already fits the task. Prefer Claude Code's file, search, and web tools for
workspace operations and research. Use Bash for git, the package manager, and the project
toolchain. Use Bash for file operations only when the dedicated tools cannot express the task.

## Built-in tools

- Find files → Glob
- Search file contents → Grep
- Read a file → Read
- Edit a file → Edit / Write
- Web research → WebSearch / WebFetch
- Lint diagnostics → ReadLints, when available

Do not use Bash with `python`, `python3`, `node -e`, or a temporary script to search, list, count,
or read repository files when the built-in tools above can do it.

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
