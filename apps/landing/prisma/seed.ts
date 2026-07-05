import { prisma } from '../src/lib/db.server.ts'
import type { KnowledgeArticle } from '../src/lib/knowledge/knowledge.types'
import { buildKN001 } from './kn-001-data'
import { buildRB001 } from './rb-001-data'
import { assertNoForbiddenSeedLiterals, collectAuthoringSeedText } from './seed-placeholders'
import { buildSG001 } from './sg-001-data'

function validateSeedArticles(articles: KnowledgeArticle[]) {
  const blob = collectAuthoringSeedText(articles)
  assertNoForbiddenSeedLiterals(blob, 'knowledge articles')
}

async function upsertKnowledgeArticle(article: KnowledgeArticle) {
  const { chunks, ...articleFields } = article
  await prisma.knowledgeArticle.upsert({
    where: { id: articleFields.id },
    create: {
      ...articleFields,
      status: 'published',
      chunks: { create: chunks },
    },
    update: {
      ...articleFields,
      status: 'published',
      chunks: { deleteMany: {}, create: chunks },
    },
  })
  console.log(`Seeded knowledge article ${articleFields.id} with ${chunks.length} chunks`)
}

async function main() {
  const articles = [buildKN001(), buildRB001(), buildSG001()]

  validateSeedArticles(articles)

  for (const article of articles) {
    await upsertKnowledgeArticle(article)
  }

  const { embedPublishedKnowledgeChunks } = await import('../src/lib/knowledge/knowledge.embed-chunks.server')
  await embedPublishedKnowledgeChunks()
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
