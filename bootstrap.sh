#!/usr/bin/env bash
set -euo pipefail

REPO="$(cd "$(dirname "$0")" && pwd)"
CURSOR="$HOME/.cursor"
CLAUDE="$HOME/.claude"

mkdir -p "$CURSOR" "$CLAUDE/skills"

link_dir() {
  local source="$1"
  local target="$2"

  if [ -d "$target" ] && [ ! -L "$target" ]; then
    echo "Backup: $target -> ${target}.bak"
    mv "$target" "${target}.bak"
  fi

  ln -sfn "$source" "$target"
  echo "Linked: $target -> $source"
}

link_dir "$REPO/agents" "$CURSOR/agents"
link_dir "$REPO/skills" "$CURSOR/skills"
link_dir "$REPO/.cursor/rules" "$CURSOR/rules"

for skill in "$REPO"/skills/*/; do
  name="$(basename "$skill")"
  ln -sfn "$skill" "$CLAUDE/skills/$name"
  echo "Linked: $CLAUDE/skills/$name -> $skill"
done

echo ""
echo "Done. Restart your editor or start a new chat session."
