import { Pinecone } from '@pinecone-database/pinecone';

let _pc: Pinecone | null = null;

function getClient() {
  if (_pc) return _pc;
  const apiKey = process.env.PINECONE_API_KEY;
  const indexName = process.env.PINECONE_INDEX;
  if (!apiKey) throw new Error('Missing PINECONE_API_KEY');
  if (!indexName) throw new Error('Missing PINECONE_INDEX');
  _pc = new Pinecone({ apiKey });
  return _pc;
}

export function getIndex() {
  const indexName = process.env.PINECONE_INDEX;
  if (!indexName) throw new Error('Missing PINECONE_INDEX');
  const pc = getClient();
  return pc.Index(indexName);
}

export type RAGMetadata = {
  userId: string;
  docId: string;
  docName: string;
  page: number;
  chunkIndex: number;
  text: string;
};

export async function upsertRAGChunks(params: {
  namespace: string;
  embeddings: number[][];
  metadatas: RAGMetadata[];
}) {
  const { namespace, embeddings, metadatas } = params;
  const index = getIndex();
  const vectors = embeddings.map((values, i) => ({
    id: `${metadatas[i].docId}::chunk-${metadatas[i].chunkIndex}`,
    values,
    metadata: metadatas[i] as any,
  }));
  const ns = (index as any).namespace ? (index as any).namespace(namespace) : null;
  if (ns) {
    await ns.upsert(vectors);
  } else {
    await (index as any).upsert(vectors, { namespace });
  }
}

export type RAGMatch = {
  id: string;
  score: number;
  metadata: RAGMetadata;
};

export async function queryRAG(params: {
  namespace: string;
  vector: number[];
  topK?: number;
}): Promise<RAGMatch[]> {
  const { namespace, vector, topK = 5 } = params;
  const index = getIndex();
  let res: any;
  const ns = (index as any).namespace ? (index as any).namespace(namespace) : null;
  if (ns) {
    res = await ns.query({ topK, vector, includeMetadata: true });
  } else {
    res = await (index as any).query({ topK, vector, includeMetadata: true, namespace });
  }
  return (res.matches || []).map((m: any) => ({
    id: m.id as string,
    score: (m.score as number) || 0,
    metadata: m.metadata as unknown as RAGMetadata,
  }));
}
