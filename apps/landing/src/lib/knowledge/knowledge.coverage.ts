import type { KnowledgeArticle, KnowledgeIntent } from './knowledge.types'

export const KNOWLEDGE_COVERAGE_INTENTS = ['incident', 'design', 'toolchain'] as const

export type KnowledgeCoverageIntentResult = {
  covered: boolean
  articleIds: string[]
}

export type KnowledgeCoverageResult = {
  axes: string[]
  intents: KnowledgeIntent[]
  byIntent: Partial<Record<KnowledgeIntent, KnowledgeCoverageIntentResult>>
}

export type ComputeKnowledgeCoverageParams = {
  axes: string[]
  intents?: KnowledgeIntent[]
}

export class KnowledgeCoverageValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'KnowledgeCoverageValidationError'
  }
}

function normalize(tag: string): string {
  return tag.toLowerCase().trim()
}

/** True when every required axis is present on the article (axes ⊆ article.axisTags). */
export function articleCoversAxes(article: KnowledgeArticle, axes: string[]): boolean {
  const tagSet = new Set(article.axisTags.map(normalize))
  return axes.every(axis => tagSet.has(normalize(axis)))
}

function resolveIntents(intents?: KnowledgeIntent[]): KnowledgeIntent[] {
  if (intents === undefined) return [...KNOWLEDGE_COVERAGE_INTENTS]
  if (intents.length === 0) {
    throw new KnowledgeCoverageValidationError(
      'intents must be a non-empty array when provided (omit to evaluate all three)'
    )
  }
  return [...intents]
}

export function computeKnowledgeCoverage(
  articles: KnowledgeArticle[],
  params: ComputeKnowledgeCoverageParams
): KnowledgeCoverageResult {
  const { axes } = params
  if (!Array.isArray(axes) || axes.length === 0) {
    throw new KnowledgeCoverageValidationError(
      'axes is required and must be a non-empty string array'
    )
  }
  if (axes.some(axis => typeof axis !== 'string' || axis.trim() === '')) {
    throw new KnowledgeCoverageValidationError(
      'axes must not contain empty or whitespace-only strings'
    )
  }

  const intents = resolveIntents(params.intents)
  const byIntent: KnowledgeCoverageResult['byIntent'] = {}

  for (const intent of intents) {
    const articleIds = articles
      .filter(article => article.intent === intent && articleCoversAxes(article, axes))
      .map(article => article.id)
      .sort((a, b) => a.localeCompare(b))

    byIntent[intent] = {
      covered: articleIds.length > 0,
      articleIds,
    }
  }

  return { axes, intents, byIntent }
}
