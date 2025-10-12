export type OpenAIEmbeddingModel =
  | 'text-embedding-3-small'
  | 'text-embedding-3-large'
  | 'text-embedding-ada-002';

export type GeminiEmbeddingModel = 'text-embedding-004';

async function embedWithGemini(texts: string[], model?: GeminiEmbeddingModel): Promise<number[][]> {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GOOGLE_GENAI_API_KEY in environment for Gemini embeddings');
  }
  const resolvedModel: GeminiEmbeddingModel = (model as GeminiEmbeddingModel) || (process.env.RAG_EMBEDDING_MODEL as GeminiEmbeddingModel) || 'text-embedding-004';
  const modelPath = `models/${resolvedModel}`;

  // Call embedContent per text to avoid batch request format issues
  const responses = await Promise.all(texts.map(async (t) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/${modelPath}:embedContent?key=${apiKey}`;
    const body = {
      content: { parts: [{ text: t }] },
    } as any;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const msg = await res.text().catch(() => res.statusText);
      throw new Error(`Gemini embedding error ${res.status}: ${msg}`);
    }
    const data = await res.json();
    const values = data.embedding?.values || data.embedding?.value || data.values;
    if (!Array.isArray(values)) {
      throw new Error('Gemini embedding response malformed');
    }
    return values as number[];
  }));

  return responses;
}

// Fallback OpenAI support if explicitly requested and key exists
async function embedWithOpenAI(texts: string[], model?: OpenAIEmbeddingModel): Promise<number[][]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY for OpenAI embeddings');
  }
  const { default: OpenAI } = await import('openai');
  const client = new OpenAI({ apiKey });
  const resolvedModel: OpenAIEmbeddingModel = (model as OpenAIEmbeddingModel) || (process.env.RAG_EMBEDDING_MODEL as OpenAIEmbeddingModel) || 'text-embedding-3-small';
  const res = await client.embeddings.create({ input: texts, model: resolvedModel });
  return res.data.map((v: any) => v.embedding as number[]);
}

export async function embedTexts(texts: string[], opts?: { model?: string }): Promise<number[][]> {
  if (texts.length === 0) return [];
  // Prefer Gemini if key present; otherwise fallback to OpenAI if permitted
  if (process.env.GOOGLE_GENAI_API_KEY) {
    return embedWithGemini(texts, opts?.model as GeminiEmbeddingModel);
  }
  if (process.env.OPENAI_API_KEY) {
    return embedWithOpenAI(texts, opts?.model as OpenAIEmbeddingModel);
  }
  throw new Error('No embedding provider configured. Set GOOGLE_GENAI_API_KEY to use Gemini (preferred).');
}

export async function embedQuery(text: string, opts?: { model?: string }): Promise<number[]> {
  const [e] = await embedTexts([text], opts);
  return e;
}
