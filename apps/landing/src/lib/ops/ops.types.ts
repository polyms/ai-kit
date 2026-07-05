export type OpsRunbookRow = {
  id: string
  slug: string
  title: string
  status: string
  axisTags: string[]
  updatedAt: string
}

export type OpsGuideRow = {
  id: string
  slug: string
  title: string
  status: string
  axisTags: string[]
  updatedAt: string
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
