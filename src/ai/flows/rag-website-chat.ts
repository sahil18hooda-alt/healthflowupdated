'use server';

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

const RAGWebsiteChatInputSchema = z.object({
  query: z.string().describe('User question'),
});
export type RAGWebsiteChatInput = z.infer<typeof RAGWebsiteChatInputSchema>;

const RAGWebsiteChatOutputSchema = z.object({
  answer: z.string(),
});
export type RAGWebsiteChatOutput = z.infer<typeof RAGWebsiteChatOutputSchema>;

export async function ragWebsiteChat(input: RAGWebsiteChatInput): Promise<RAGWebsiteChatOutput> {
  return ragWebsiteChatFlow(input);
}

const ragWebsiteChatFlow = ai.defineFlow(
  {
    name: 'ragWebsiteChatFlow',
    inputSchema: RAGWebsiteChatInputSchema,
    outputSchema: RAGWebsiteChatOutputSchema,
  },
  async (input) => {
    const { query } = input;
    const namespace = 'website-content';

    // 1) Embed query
    const qvec = await embedQuery(query);

    // 2) Retrieve topK matches
    const matches = await queryRAG({ namespace, vector: qvec, topK: 5 });

    // 3) Build context with short previews
    const contextItems = matches.map((m) => {
      const preview = (m.metadata.text || '').trim().replace(/\s+/g, ' ').slice(0, 400);
      return `- ${preview}`;
    });
    const context = contextItems.join('\n');

    // 4) Ask Groq LLM constrained to context
    const groq = getGroq();
    const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

    const system = [
      'You are a helpful AI assistant for the HealthFlow website.',
      'Answer the user\'s question based on the provided context from the website.',
      'If the answer is not present in the context, say you do not know.',
    ].join(' ');

    const userPrompt = `Question: ${query}\n\nContext from the website:\n${context}`;

    const completion = await groq.chat.completions.create({
      model,
      temperature: 0.2,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userPrompt },
      ],
    });

    const answer = completion.choices?.[0]?.message?.content || 'Sorry, I could not generate an answer.';

    return { answer };
  }
);
