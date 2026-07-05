-- Ops CMS: runbooks + known_issues + stack_guides (single initial migration)

-- CreateTable
CREATE TABLE "runbooks" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "axisTags" TEXT[],
    "relatedFiles" TEXT[],
    "stackProfileMarkdown" TEXT NOT NULL,
    "greenfieldChecklist" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'published',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "runbooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "known_issues" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "runbookId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "symptom" TEXT NOT NULL,
    "cause" TEXT[],
    "fix" TEXT[],
    "verify" TEXT[],
    "triggerPhrases" TEXT[],
    "relatedFiles" TEXT[],
    "axisTags" TEXT[],
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "known_issues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stack_guides" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "audience" TEXT NOT NULL DEFAULT 'arch',
    "axisTags" TEXT[],
    "designChecklist" TEXT[],
    "seamSections" JSONB NOT NULL DEFAULT '[]',
    "relatedRunbookId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'published',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "stack_guides_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "runbooks_slug_key" ON "runbooks"("slug");

-- CreateIndex
CREATE INDEX "runbooks_status_idx" ON "runbooks"("status");

-- CreateIndex
CREATE UNIQUE INDEX "known_issues_slug_key" ON "known_issues"("slug");

-- CreateIndex
CREATE INDEX "known_issues_runbookId_idx" ON "known_issues"("runbookId");

-- CreateIndex
CREATE UNIQUE INDEX "stack_guides_slug_key" ON "stack_guides"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "stack_guides_relatedRunbookId_key" ON "stack_guides"("relatedRunbookId");

-- CreateIndex
CREATE INDEX "stack_guides_status_idx" ON "stack_guides"("status");

-- CreateIndex
CREATE INDEX "stack_guides_relatedRunbookId_idx" ON "stack_guides"("relatedRunbookId");

-- AddForeignKey
ALTER TABLE "known_issues" ADD CONSTRAINT "known_issues_runbookId_fkey" FOREIGN KEY ("runbookId") REFERENCES "runbooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stack_guides" ADD CONSTRAINT "stack_guides_relatedRunbookId_fkey" FOREIGN KEY ("relatedRunbookId") REFERENCES "runbooks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
