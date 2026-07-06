import { prisma } from '../src/lib/db.server.ts'
import { upsertKnowledgeArticle } from '../src/lib/knowledge/knowledge.mutation.server.ts'
import type { KnowledgeArticle } from '../src/lib/knowledge/knowledge.types'
import { buildKN001 } from './kn-001-data'
import { buildRB001 } from './rb-001-data'
import { assertNoForbiddenSeedLiterals, collectAuthoringSeedText } from './seed-placeholders'
import { buildSG001 } from './sg-001-data'

function validateSeedArticles(articles: KnowledgeArticle[]) {
  const blob = collectAuthoringSeedText(articles)
  assertNoForbiddenSeedLiterals(blob, 'knowledge articles')
}

async function main() {
  const articles = [buildKN001(), buildRB001(), buildSG001()]

  validateSeedArticles(articles)

  for (const article of articles) {
    await upsertKnowledgeArticle(article)
    console.log(`Seeded knowledge article ${article.id} with ${article.chunks.length} chunks`)
  }
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
