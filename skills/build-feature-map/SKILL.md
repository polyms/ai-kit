---
name: build-feature-map
description: Author the repo-local feature-map skill and its behavior index. Invoke with
  /build-feature-map, build feature map, dựng bản đồ vùng, or maintain the feature map.
disable-model-invocation: true
---

# Build feature map

**Codex / GitHub Copilot:** Apply [client compatibility](../../docs/agents/client-compatibility.md) before this workflow.

Write and keep a **repo-local** skill that routes behavior questions to one file. This kit skill
holds the playbook and the templates. It does not hold the map.

The map lives in the app repo:

```text
.cursor/skills/<slug>/
  SKILL.md
  agents/openai.yaml
  references/features/README.md
  references/features/<area>.md
```

Codex/Copilot: also follow **Feature map publication** in the client compatibility
guide. Keep the existing canonical package and publish it through `.agents/skills`;
do not create an independent map. Include the shared link and Codex invocation policy
in the Seed completion check.

Default `<slug>` is `feature-map`. Never use `build-feature-map` — that name is this kit skill, and
a project skill with the same name would hide the global symlink. If `.cursor/skills/feature-map/`
already exists for something else, ask once for a different slug and record it.

Long sessions: **`tester`**. This skill does not write product code or seam tests.

## Soft setup dependency

No `/setup` gate. When `docs/agents/feature-map.md` exists, trust its `Skill`, `Index`, and
`Harness` paths. When it does not, write that pointer anyway. Prose in feature files follows
`docs/agents/language.md` when present. The four H2 headings stay English.

## What counts as an area

An area is a markdown link in `references/features/README.md` whose target is a sibling `*.md`. A
README that only has preconditions and the entry contract has **no areas**. Missing pointer, missing
index, or no area links → other skills treat the map as absent. A pointer that says
`Status: declined` is absent too, and other skills stop suggesting the map; running this skill
means the user changed their mind, so Seed replaces that pointer.

The **journeys file** (`journeys.md`) is the one area for flows that cross areas — sessions,
shortcuts, drag-and-drop. It uses the same four H2s and is always last in the index.

## Quick router

| State                                                  | Branch                                  |
| ------------------------------------------------------ | --------------------------------------- |
| No area links (or a declined pointer)                  | [Seed](#seed)                           |
| Area links exist, and the user named drift             | [Maintain](#maintain)                   |
| User asked for a full regression pass                  | [Maintain](#maintain) — sweep the index |
| Area links exist, and the user named a surface or flow | [Add area](#add-area)                   |
| Area links exist, and the user named nothing           | List the areas, ask once which branch   |

## Seed

**Goal:** One journey, up to three area files, a router skill, and a pointer. Stop there.

1. Read routes, screens, and existing tests. Propose **one** user journey. Ask once: keep it, or
   name another. Do not ask the user to list the app's features.
2. Cut that journey into **at most three** areas — fewer when the journey has fewer surfaces. Show
   the index lines. Ask once which line mixes two preconditions. Split a struck line while the
   total stays at three. Leave the rest.
3. For each area, draft [feature-file-template.md](feature-file-template.md) from labels, routes,
   and tests already in the repo. Show the draft. The user edits **Gotchas** and paths the harness
   cannot drive. Write the file before starting the next area.
4. Write `SKILL.md` from [repo-skill-template.md](repo-skill-template.md), replacing `{slug}`.
   Write `agents/openai.yaml` with `policy: { allow_implicit_invocation: false }`. Write the index
   from [index-template.md](index-template.md) with the areas in sweep order. Ask once for a
   harness command; record `none` when there is no command.
5. Write `docs/agents/feature-map.md` from [pointer-template.md](pointer-template.md), replacing
   `{slug}`. Link Claude at `.claude/skills/<slug>` and Codex at `.agents/skills/<slug>`, both →
   `../../.cursor/skills/<slug>`. When either path already exists and is not that symlink, stop:
   diff it against the package, keep a backup outside any skill folder, and reconcile with the
   user — `ln -sfn` on a real directory nests the link inside it. One copy of the map; never copy
   it into either folder.

**Completion criterion:** Pointer exists with a `Skill` line; index lists one to three area links;
each area file has the four H2s; repo `SKILL.md` routes to `references/features/`; no `{slug}`
remains; `agents/openai.yaml` disables implicit invocation; slug is not `build-feature-map`;
`.claude/skills/<slug>` and `.agents/skills/<slug>` are symlinks to the Cursor package.

Tell the user the keep rule: the next UI change that touches an area updates that one file in the
same PR. A later audit is `/build-feature-map` on the Maintain branch.

## Maintain

**Goal:** The area the change touches matches the product. Do not re-seed.

1. Read the pointer and the index. Missing areas → Seed, and say why.
2. Sweep only when the user asked for a broad pass. Walk the index top to bottom. The journeys
   file, when present, is last.
3. Otherwise open the one area file the diff or the user named. Refresh its four H2s. Split into a
   new file only when a section needs its own precondition. Update the index line in the same turn.
4. Do not slash-invoke this skill from `/dev`. `/dev` may edit the one area file during ship. This
   branch is for drift, audit, and splits.

**Completion criterion:** Every touched area file still has the four H2s; the index link matches;
untouched areas were not rewritten.

## Add area

**Goal:** One new area for a surface or flow the index does not cover yet. Do not re-seed.

1. Read the pointer and the index. An existing area already covers the surface → Maintain, and
   say which file.
2. A flow that crosses areas (sessions, shortcuts, drag-and-drop) goes in `journeys.md`. Create it
   when missing; otherwise add the flow to it. Any other surface gets its own `<area>.md`.
3. Draft from [feature-file-template.md](feature-file-template.md) using labels, routes, and tests
   already in the repo. Show the draft. The user edits **Gotchas** and paths the harness cannot
   drive. Write the file.
4. Add one index line in sweep order. `journeys.md` stays last.

**Completion criterion:** The new or extended file has the four H2s; exactly one index line was
added (none when `journeys.md` already existed); other area files were not rewritten.

## Handoff

End with `## Next Step` — one preferred skill:

- A product slice is in progress → `→ /dev`
- This session just walked a journey → `→ /e2e`
- Neither → state the map path and stop

## Agent

```
Use the tester to [task]
```

The agent reads this skill when the task is building or repairing the map. Journey flake and CI
sharding stay on `/e2e`.
