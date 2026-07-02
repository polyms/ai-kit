# Issue tracker: Local markdown

Issues live as files under `.scratch/<feature>/` in this repo.

## Conventions

```
.scratch/
└── <feature-slug>/
    ├── issue.md          # problem + context
    ├── prd.md            # optional, from /pm
    └── notes.md          # running log
```

- **Create**: write `.scratch/<feature>/issue.md` with title, problem, status
- **Read**: read the markdown file directly
- **List**: glob `.scratch/*/issue.md`
- **Close**: set `status: done` in frontmatter

## Skill conventions

- **Publish to tracker** → write or update `.scratch/<feature>/prd.md`
- **Fetch ticket** → read `.scratch/<feature>/issue.md`
