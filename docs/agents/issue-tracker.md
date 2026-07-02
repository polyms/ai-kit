# Issue tracker: GitHub

Issues and PRDs live as GitHub issues. Use `gh` CLI.

## Commands

| Action  | Command                                      |
| ------- | -------------------------------------------- |
| Create  | `gh issue create --title "..." --body "..."` |
| Read    | `gh issue view <number> --comments`          |
| List    | `gh issue list --json number,title,labels`   |
| Comment | `gh issue comment <number> --body "..."`     |
| Label   | `gh issue edit <number> --add-label "..."`   |
| Close   | `gh issue close <number>`                    |

Pull requests: `gh pr create`, `gh pr view`, `gh pr comment`, etc.

## PRs as request surface

**PRs as request surface: no.**

## Skill conventions

- **Publish to tracker** → create GitHub issue
- **Fetch ticket** → `gh issue view <number> --comments`
- Reference issues in commits: `Refs #123` / `Closes #123`
