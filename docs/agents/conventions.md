# Project conventions

## Markdown formatting

When editing Markdown prose in this repo:

- Wrap lines to **110 characters max**, matching `.prettierrc.yml` `printWidth` and
  `biome.json` `lineWidth`.
- Prefer natural sentence breaks and do not split inline code tokens.
- Keep tables when they improve human scanability. Do not force table-to-list conversion.

## Commit messages

Use `<type>[scope]: <imperative summary>`: lowercase after `:`, no period, and at most 72 characters.

Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `ci`, `style`, `perf`, `build`.

- Scope is optional and lowercase, for example `feat(reqs): add user story guide`.
- An optional body explains why, not the diff.
- Use `Refs #123` or `Closes #123` for issue footers.
- Mark breaking changes with `type!:` and a `BREAKING CHANGE:` footer.
- MR title matches the commit subject; MR description states purpose, changes, tests, and issues.
- Avoid vague subjects (`update`, `WIP`) and past tense (`added` → `add`). Commit only when asked.

```text
feat(reqs): add user story guide
fix(auth): handle expired sessions
chore(release): v0.1.38
```
