-- Ops CMS Knowledge layer — initial schema (KnowledgeArticle + KnowledgeChunk).

CREATE EXTENSION IF NOT EXISTS vector;

-- CreateTable
CREATE TABLE "knowledge_articles" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "intent" TEXT NOT NULL,
    "axisTags" TEXT[],
    "checklist" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'published',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "knowledge_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_chunks" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "intent" TEXT NOT NULL,
    "chunkType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "axisTags" TEXT[],
    "symptom" TEXT,
    "cause" TEXT[],
    "fix" TEXT[],
    "verify" TEXT[],
    "triggerPhrases" TEXT[],
    "artifactFilename" TEXT,
    "artifactType" TEXT,
    "checklistItems" TEXT[],
    "parentChunkId" TEXT,
    "partIndex" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "embedding" vector(1536),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "knowledge_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "knowledge_articles_slug_key" ON "knowledge_articles"("slug");

-- CreateIndex
CREATE INDEX "knowledge_articles_status_idx" ON "knowledge_articles"("status");

-- CreateIndex
CREATE INDEX "knowledge_articles_intent_idx" ON "knowledge_articles"("intent");

-- CreateIndex
CREATE UNIQUE INDEX "knowledge_chunks_slug_key" ON "knowledge_chunks"("slug");

-- CreateIndex
CREATE INDEX "knowledge_chunks_articleId_idx" ON "knowledge_chunks"("articleId");

-- CreateIndex
CREATE INDEX "knowledge_chunks_articleId_sortOrder_idx" ON "knowledge_chunks"("articleId", "sortOrder");

-- CreateIndex
CREATE INDEX "knowledge_chunks_intent_idx" ON "knowledge_chunks"("intent");

-- CreateIndex
CREATE INDEX "knowledge_chunks_parentChunkId_idx" ON "knowledge_chunks"("parentChunkId");

-- AddForeignKey
ALTER TABLE "knowledge_chunks" ADD CONSTRAINT "knowledge_chunks_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "knowledge_articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_chunks" ADD CONSTRAINT "knowledge_chunks_parentChunkId_fkey" FOREIGN KEY ("parentChunkId") REFERENCES "knowledge_chunks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
