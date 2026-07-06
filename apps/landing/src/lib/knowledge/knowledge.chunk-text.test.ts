import { describe, expect, it } from 'vitest'
import { chunkToEmbedText } from './knowledge.chunk-text'
import type { KnowledgeChunk } from './knowledge.types'

const chunk: KnowledgeChunk = {
  id: 'RB-001-03',
  slug: 'rb-001-03',
  intent: 'incident',
  chunkType: 'incident',
  title: 'Wrong outputDirectory',
  body: 'symptom body',
  axisTags: ['vercel'],
  symptom: 'No Output Directory named ".output"',
  cause: ['outputDirectory set in vercel.json'],
  fix: ['Remove outputDirectory'],
  verify: ['vercel build'],
  triggerPhrases: ['No Output Directory'],
  artifactFilename: null,
  artifactType: null,
  checklistItems: [],
  parentChunkId: null,
  partIndex: null,
  sortOrder: 0,
}

describe('knowledge.chunk-text', () => {
  it('includes structured incident fields in embed text', () => {
    const text = chunkToEmbedText(chunk)
    expect(text).toContain('No Output Directory')
    expect(text).toContain('Remove outputDirectory')
    expect(text).toContain('vercel build')
  })
})
