"use server";

import { z } from 'genkit';
import { ai } from '@/ai/genkit';
import { fetchPdfText, parsePdfBuffer } from '@/lib/rag/pdf';
import { chunkTextWithPageApprox } from '@/lib/rag/chunk';
import { embedTexts } from '@/lib/rag/embeddings';
import { upsertRAGChunks, RAGMetadata } from '@/lib/rag/pinecone';

const RAGIngestInputSchema = z.object({
  // Provide either a fileUrl or a base64-encoded PDF, or pre-extracted text
  fileUrl: z.string().optional().describe('Public URL for the uploaded PDF (optional if fileBase64 or text is provided)'),
  fileBase64: z.string().optional().describe('Base64-encoded PDF content (no data: prefix)'),
  text: z.string().optional().describe('Pre-extracted full text of the PDF'),
  numpages: z.number().optional().describe('Number of pages when text is provided'),
  userId: z.string().describe('Authenticated Firebase user ID'),
  docName: z.string().describe('Human-readable document name'),
  docId: z.string().optional().describe('Optional document ID; if omitted a UUID will be generated on the client'),
});
export type RAGIngestInput = z.infer<typeof RAGIngestInputSchema>;

const RAGIngestOutputSchema = z.object({
  docId: z.string(),
  chunkCount: z.number(),
  numpages: z.number(),
});
export type RAGIngestOutput = z.infer<typeof RAGIngestOutputSchema>;

export async function ragIngestPdf(input: RAGIngestInput): Promise<RAGIngestOutput> {
  return ragIngestPdfFlow(input);
}

const ragIngestPdfFlow = ai.defineFlow(
  {
    name: 'ragIngestPdfFlow',
    inputSchema: RAGIngestInputSchema,
    outputSchema: RAGIngestOutputSchema,
  },
  async (input) => {
    const { fileUrl, fileBase64, text: inText, numpages: inPages, userId, docName, docId: inDocId } = input;

    const docId = inDocId || `doc-${Date.now()}`;
    const namespace = `user-${userId}::doc-${docId}`;

    // 1) Load and parse PDF text
    let text: string = '';
    let numpages: number = 1;

    if (inText && inText.length > 0) {
      text = inText;
      numpages = inPages || 1;
    } else if (fileBase64 && fileBase64.length > 0) {
      const dataBuffer = Buffer.from(fileBase64, 'base64');
      const parsed = await parsePdfBuffer(dataBuffer);
      text = parsed.text;
      numpages = parsed.numpages;
    } else if (fileUrl && fileUrl.length > 0) {
      const parsed = await fetchPdfText(fileUrl);
      text = parsed.text;
      numpages = parsed.numpages;
    } else {
      throw new Error('No PDF provided. Provide text, fileBase64, or fileUrl.');
    }

    if (!text || text.trim().length === 0) {
      throw new Error('Extracted PDF text is empty');
    }

    // 2) Chunk with approximate page mapping
    const chunks = chunkTextWithPageApprox({ text, numpages, chunkSize: 1000, overlap: 200 });

    // 3) Create embeddings
    const embeddings = await embedTexts(chunks.map(c => c.text));

    // 4) Upsert into Pinecone
    const metadatas: RAGMetadata[] = chunks.map((c) => ({
      userId,
      docId,
      docName,
      page: c.page,
      chunkIndex: c.chunkIndex,
      text: c.text,
    }));

    await upsertRAGChunks({ namespace, embeddings, metadatas });

    return { docId, chunkCount: chunks.length, numpages };
  }
);
