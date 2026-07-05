export type OpsKnowledgeRow = {
  id: string
  slug: string
  title: string
  status: string
  intent: string
  axisTags: string[]
  updatedAt: string
}

export const KNOWLEDGE_INTENTS = ['incident', 'design', 'toolchain'] as const

export function countByIntent(rows: Array<{ intent: string }>): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const intent of KNOWLEDGE_INTENTS) counts[intent] = 0
  for (const row of rows) {
    counts[row.intent] = (counts[row.intent] ?? 0) + 1
  }
  return counts
}

export type MatrixAxisCombo = {
  key: string
  label: string
  tags: string[]
}

export function buildAxisCombos(rows: Array<{ axisTags: string[] }>): MatrixAxisCombo[] {
  const combos = new Map<string, MatrixAxisCombo>()

  for (const row of rows) {
    const sorted = [...row.axisTags].sort()
    if (sorted.length === 0) continue
    const key = sorted.join('+')
    if (!combos.has(key)) {
      combos.set(key, { key, label: sorted.join(' · '), tags: sorted })
    }
  }

  return [...combos.values()].sort((a, b) => a.key.localeCompare(b.key))
}

export function axisComboMatches(tags: string[], combo: MatrixAxisCombo): boolean {
  const tagSet = new Set(tags.map(t => t.toLowerCase()))
  return combo.tags.every(tag => tagSet.has(tag.toLowerCase()))
}
