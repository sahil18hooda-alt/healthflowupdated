export type RAGChunk = {
  id: string;
  text: string;
  page: number; // approximated page number
  chunkIndex: number;
  start: number; // start char offset in full text
  end: number;   // end char offset in full text
};

/**
 * Splits text into overlapping chunks and assigns each chunk an approximated page number
 * based on proportional position in the document when exact per-page text is unavailable.
 */
export function chunkTextWithPageApprox(params: {
  text: string;
  numpages: number;
  chunkSize?: number; // characters
  overlap?: number;   // characters
}): RAGChunk[] {
  const { text, numpages, chunkSize = 1000, overlap = 200 } = params;
  const total = text.length;
  const step = Math.max(1, chunkSize - overlap);

  const chunks: RAGChunk[] = [];
  let i = 0;
  let idx = 0;
  while (i < total) {
    const start = i;
    const end = Math.min(total, i + chunkSize);
    const chunkText = text.slice(start, end);

    // Approximate page by proportional position
    const posCenter = start + Math.floor((end - start) / 2);
    const page = clamp(1 + Math.floor((posCenter / Math.max(1, total)) * numpages), 1, numpages);

    chunks.push({
      id: `chunk-${idx}`,
      text: chunkText,
      page,
      chunkIndex: idx,
      start,
      end,
    });

    i += step;
    idx += 1;
  }

  return chunks;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
