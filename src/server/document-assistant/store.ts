type Chunk = {
  id: string;
  text: string;
  page: number;
  chunkIndex: number;
  tokens: Set<string>;
};

export type DocSession = {
  id: string;
  docName: string;
  numpages: number;
  chunks: Chunk[];
};

const SESSIONS = new Map<string, DocSession>();

function genId(): string {
  try {
    // @ts-ignore
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  } catch {}
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { randomUUID } = require('crypto');
    if (randomUUID) return randomUUID();
  } catch {}
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function tokenize(text: string): Set<string> {
  return new Set((text.toLowerCase().match(/[a-z0-9]+/g) || []).filter(Boolean));
}

export function createSession(params: { docName: string; numpages: number; chunks: { text: string; page: number; chunkIndex: number }[] }): DocSession {
  const id = genId();
  const chunks: Chunk[] = params.chunks.map((c) => ({ ...c, id: `c-${c.chunkIndex}`, tokens: tokenize(c.text) }));
  const session: DocSession = { id, docName: params.docName, numpages: params.numpages, chunks };
  SESSIONS.set(id, session);
  return session;
}

export function getSession(id: string): DocSession | undefined {
  return SESSIONS.get(id);
}

export function scoreChunks(question: string, session: DocSession, topK = 5): Chunk[] {
  const qTokens = tokenize(question);
  const results = session.chunks.map((c) => {
    let score = 0;
    // token overlap
    for (const t of qTokens) if (c.tokens.has(t)) score += 1;
    // phrase boost
    const textLower = c.text.toLowerCase();
    const qLower = question.toLowerCase();
    if (qLower.length > 0 && textLower.includes(qLower.slice(0, Math.min(qLower.length, 64)))) score += 2;
    return { c, score };
  });
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, topK).map(r => r.c);
}