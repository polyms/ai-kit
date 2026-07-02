# Issue tracker: GitLab

Issues and PRDs live as GitLab issues. Use [`glab`](https://gitlab.com/gitlab-org/cli) CLI.

## Commands

| Action  | Command                                               |
| ------- | ----------------------------------------------------- |
| Create  | `glab issue create --title "..." --description "..."` |
| Read    | `glab issue view <number> --comments`                 |
| List    | `glab issue list -F json`                             |
| Comment | `glab issue note <number> --message "..."`            |
| Label   | `glab issue update <number> --label "..."`            |
| Close   | `glab issue note` then `glab issue close <number>`    |

Merge requests: `glab mr create`, `glab mr view`, `glab mr note`, etc.

Infer repo from `git remote -v` — `glab` auto-detects inside a clone.

## MRs as request surface

**MRs as request surface: no.** _(Set to `yes` if external MRs enter the same triage queue as issues.)_

When `yes`: use `glab mr list -F json`, filter to non-maintainer authors, label/comment/close with `glab mr` equivalents.

## Skill conventions

- **Publish to tracker** → create GitLab issue
- **Fetch ticket** → `glab issue view <number> --comments`
- Reference issues in commits: `Refs #123` / `Closes #123`
