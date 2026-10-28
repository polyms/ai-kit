#!/usr/bin/env bash
set -euo pipefail

REPO="$(cd "$(dirname "$0")" && pwd)"
CURSOR="$HOME/.cursor"
CLAUDE="$HOME/.claude"

TARGET="${1:-all}"
case "$TARGET" in
  all|codex|copilot|cursor|claude) ;;
  *) echo "Usage: bash bootstrap.sh [all|codex|copilot|cursor|claude]" >&2; exit 1 ;;
esac

if [ "$TARGET" = all ] || [ "$TARGET" = codex ] || [ "$TARGET" = copilot ]; then
  node "$REPO/scripts/bootstrap-clients.mjs" "$TARGET"
fi

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

if [ "$TARGET" = all ] || [ "$TARGET" = cursor ]; then
  mkdir -p "$CURSOR"
  link_dir "$REPO/agents" "$CURSOR/agents"
  link_dir "$REPO/skills" "$CURSOR/skills"
  link_dir "$REPO/.cursor/rules" "$CURSOR/rules"
fi

if [ "$TARGET" = all ] || [ "$TARGET" = claude ]; then
  mkdir -p "$CLAUDE/skills" "$CLAUDE/agents"
  for skill in "$REPO"/skills/*/; do
    name="$(basename "$skill")"
    ln -sfn "$skill" "$CLAUDE/skills/$name"
    echo "Linked: $CLAUDE/skills/$name -> $skill"
  done

  for agent in "$REPO"/agents/*.md; do
    name="$(basename "$agent")"
    ln -sfn "$agent" "$CLAUDE/agents/$name"
    echo "Linked: $CLAUDE/agents/$name -> $agent"
  done
fi

echo ""
echo "Done. Restart your editor or start a new chat session."
