export const KNOWLEDGE_EMBEDDING_DIMENSIONS = 1536
export const OPENROUTER_EMBEDDINGS_URL = 'https://openrouter.ai/api/v1/embeddings'

export type EmbeddingProvider = 'none' | 'openrouter'

export type EmbeddingConfig = {
  provider: EmbeddingProvider
  model: string
  apiKey?: string
}

function resolveOpenRouterApiKey(): string | undefined {
  return process.env.OPENROUTER_API_KEY
}

function resolveEmbeddingModel(): string {
  const model = process.env.KNOWLEDGE_EMBEDDING_MODEL ?? 'openai/text-embedding-3-small'
  return model.includes('/') ? model : `openai/${model}`
}

export function getEmbeddingConfig(): EmbeddingConfig {
  const apiKey = resolveOpenRouterApiKey()
  if (!apiKey) {
    return { provider: 'none', model: '' }
  }

  return {
    provider: 'openrouter',
    model: resolveEmbeddingModel(),
    apiKey,
  }
}

export function isEmbeddingEnabled(): boolean {
  return getEmbeddingConfig().provider === 'openrouter'
}

type EmbeddingResponse = {
  data: Array<{ embedding: number[] }>
}

/** Batch-embed texts via OpenRouter (OpenAI-compatible /embeddings). */
export async function embedTexts(texts: string[]): Promise<number[][] | null> {
  const config = getEmbeddingConfig()
  if (config.provider !== 'openrouter' || !config.apiKey || texts.length === 0) {
    return null
  }

  const response = await fetch(OPENROUTER_EMBEDDINGS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      input: texts,
      dimensions: KNOWLEDGE_EMBEDDING_DIMENSIONS,
    }),
  })

  if (!response.ok) {
    console.error('Knowledge embedding OpenRouter error:', response.status, await response.text())
    return null
  }

  const payload = (await response.json()) as EmbeddingResponse
  return payload.data.map(row => row.embedding)
}

/*
 * Previous provider: Vercel AI Gateway (commented — switched to OpenRouter).
 *
 * export const AI_GATEWAY_EMBEDDINGS_URL = 'https://ai-gateway.vercel.sh/v1/embeddings'
 *
 * function resolveGatewayApiKey(): string | undefined {
 *   return process.env.AI_GATEWAY_API_KEY ?? process.env.VERCEL_OIDC_TOKEN
 * }
 *
 * function resolveGatewayModel(): string {
 *   const model = process.env.KNOWLEDGE_EMBEDDING_MODEL ?? 'openai/text-embedding-3-small'
 *   return model.includes('/') ? model : `openai/${model}`
 * }
 *
 * // getEmbeddingConfig returned provider: 'gateway' when AI_GATEWAY_API_KEY set
 * // embedTexts posted to AI_GATEWAY_EMBEDDINGS_URL with Bearer gateway key
 */
