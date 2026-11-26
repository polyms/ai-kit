# Feature map

Repo-local skill that routes behavior questions to one area file. Author and repair it with
`/build-feature-map`. Other skills read the paths below. They do not invoke that skill.

Skill: .agents/skills/feature-map/SKILL.md
Index: .agents/skills/feature-map/references/features/README.md
Harness: none

Cursor: `.cursor/skills/feature-map` links to the package above.
Claude: `.claude/skills/feature-map` links to the package above.
Keep one directory; preserve any existing contents before establishing a link.

This repo-local convention applies when the repository owns its feature map. If an authorized
product/QA system is explicitly the canonical map owner, retrieve that system's
environment- and version-specific snapshot through its supported integration. A repo map or
generated Markdown bundle can then be an E2E/test-run input, not a second editable source of
truth. Never overwrite the external canonical map from an older export or infer verified
feature availability solely from the presence of a local area file.
