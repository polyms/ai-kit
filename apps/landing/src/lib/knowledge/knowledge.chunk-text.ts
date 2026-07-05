import type { KnowledgeChunk } from './knowledge.types'

const MAX_EMBED_CHARS = 8_000

/** Text sent to the embedding model — title + structured fields, not raw JSON-only bodies. */
export function chunkToEmbedText(chunk: KnowledgeChunk): string {
  const parts = [
    chunk.title,
    chunk.intent,
    chunk.chunkType,
    chunk.artifactFilename ?? '',
    chunk.symptom ?? '',
    ...chunk.cause,
    ...chunk.fix,
    ...chunk.verify,
    ...chunk.triggerPhrases,
    ...chunk.checklistItems,
    chunk.body,
  ].filter(Boolean)

  const text = parts.join('\n')
  return text.length > MAX_EMBED_CHARS ? text.slice(0, MAX_EMBED_CHARS) : text
}
