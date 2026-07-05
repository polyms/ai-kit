import { afterEach, describe, expect, it } from 'vitest'
import {
  getEmbeddingConfig,
  isEmbeddingEnabled,
  OPENROUTER_EMBEDDINGS_URL,
} from './knowledge.embedding.server'

const ENV_KEYS = ['OPENROUTER_API_KEY', 'KNOWLEDGE_EMBEDDING_MODEL'] as const

describe('knowledge.embedding.server', () => {
  afterEach(() => {
    for (const key of ENV_KEYS) {
      delete process.env[key]
    }
  })

  it('disables embeddings when OPENROUTER_API_KEY is unset', () => {
    expect(isEmbeddingEnabled()).toBe(false)
    expect(getEmbeddingConfig().provider).toBe('none')
  })

  it('enables OpenRouter embeddings when OPENROUTER_API_KEY is set', () => {
    process.env.OPENROUTER_API_KEY = 'or-test-key'
    expect(isEmbeddingEnabled()).toBe(true)
    expect(getEmbeddingConfig()).toMatchObject({
      provider: 'openrouter',
      model: 'openai/text-embedding-3-small',
      apiKey: 'or-test-key',
    })
  })

  it('prefixes bare model names with openai/ for OpenRouter', () => {
    process.env.OPENROUTER_API_KEY = 'or-test-key'
    process.env.KNOWLEDGE_EMBEDDING_MODEL = 'text-embedding-3-small'
    expect(getEmbeddingConfig().model).toBe('openai/text-embedding-3-small')
  })

  it('uses the OpenRouter embeddings endpoint', () => {
    expect(OPENROUTER_EMBEDDINGS_URL).toBe('https://openrouter.ai/api/v1/embeddings')
  })
})
