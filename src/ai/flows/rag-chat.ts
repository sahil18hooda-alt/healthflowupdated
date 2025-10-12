"use server";

import { z } from 'genkit';
import { ai } from '@/ai/genkit';
import { embedQuery } from '@/lib/rag/embeddings';
import { queryRAG } from '@/lib/rag/pinecone';
import Groq from 'groq-sdk';

function getGroq() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('Missing GROQ_API_KEY');
  return new Groq({ apiKey });
}

const RAGChatInputSchema = z.object({
  query: z.string().describe('User question'),
  userId: z.string().describe('Firebase user ID'),
  docId: z.string().describe('Document ID (namespace will be derived with userId)'),
});
export type RAGChatInput = z.infer<typeof RAGChatInputSchema>;

const CitationSchema = z.object({
  page: z.number(),
  chunkIndex: z.number(),
  score: z.number(),
  textPreview: z.string(),
});

const RAGChatOutputSchema = z.object({
  answer: z.string(),
  citations: z.array(CitationSchema),
});
export type RAGChatOutput = z.infer<typeof RAGChatOutputSchema>;

export async function ragChat(input: RAGChatInput): Promise<RAGChatOutput> {
  return ragChatFlow(input);
}

const ragChatFlow = ai.defineFlow(
  {
    name: 'ragChatFlow',
    inputSchema: RAGChatInputSchema,
    outputSchema: RAGChatOutputSchema,
  },
  async (input) => {
    const { query, userId, docId } = input;
    const namespace = `user-${userId}::doc-${docId}`;

    // 1) Embed query
    const qvec = await embedQuery(query);

    // 2) Retrieve topK matches
    const matches = await queryRAG({ namespace, vector: qvec, topK: 5 });

    // 3) Build context with short previews
    const contextItems = matches.map((m) => {
      const preview = (m.metadata.text || '').trim().replace(/\s+/g, ' ').slice(0, 400);
      return `- [Page ${m.metadata.page}] ${preview}`;
    });
    const context = contextItems.join('\n');

    // 4) Ask Groq LLM constrained to context
    const groq = getGroq();
    const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

    const system = [
      'You are a careful, precise medical document assistant.',
      'Answer ONLY using the provided context from the patient\'s document.',
      'Quote exact values (units, ranges) when relevant.',
      'Cite the source after each fact as [Page N].',
      'If the answer is not present, say you do not know based on the provided document.',
      'Add a one-line non-diagnostic disclaimer at the end.'
    ].join(' ');

    const userPrompt = `Question: ${query}\n\nContext from the document (with page numbers):\n${context}`;

    const completion = await groq.chat.completions.create({
      model,
      temperature: 0.2,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userPrompt },
      ],
    });

    const answer = completion.choices?.[0]?.message?.content || 'Sorry, I could not generate an answer.';

    const citations = matches.map((m) => ({
      page: m.metadata.page,
      chunkIndex: m.metadata.chunkIndex,
      score: m.score,
      textPreview: (m.metadata.text || '').trim().replace(/\s+/g, ' ').slice(0, 200),
    }));

    return { answer, citations };
  }
);
