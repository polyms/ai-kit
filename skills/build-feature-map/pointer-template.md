# Feature map

Repo-local skill that routes behavior questions to one area file. Author and repair it with
`/build-feature-map`. Other skills read the paths below. They do not invoke that skill.

Skill: .agents/skills/{slug}/SKILL.md
Index: .agents/skills/{slug}/references/features/README.md
Harness: none

Cursor: `.cursor/skills/{slug}` links to the package above.
Claude: `.claude/skills/{slug}` links to the package above.
Keep one directory; preserve any existing contents before establishing a link.
