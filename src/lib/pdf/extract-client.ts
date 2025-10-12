"use client";

import type { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";

export async function extractPdfTextClient(
  file: File,
  opts?: { onProgress?: (info: { page: number; total: number }) => void; timeoutMs?: number }
): Promise<{ text: string; numpages: number }> {
  const timeoutMs = opts?.timeoutMs ?? 20000; // 20s default cap
  const start = Date.now();

  // Use pdfjs-dist via dynamic import to keep bundle light
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf");
  // Try primary worker CDN; if fails to load quickly, fall back
  (pdfjs as any).GlobalWorkerOptions.workerSrc =
    "https://unpkg.com/pdfjs-dist@4.4.168/legacy/build/pdf.worker.min.js";

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = (pdfjs as any).getDocument({ data: arrayBuffer });

  let doc: PDFDocumentProxy;
  try {
    doc = await loadingTask.promise;
  } catch (e) {
    // Fallback worker
    (pdfjs as any).GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.js";
    const retryTask = (pdfjs as any).getDocument({ data: arrayBuffer });
    doc = await retryTask.promise;
  }

  const numpages = doc.numPages;

  let fullText = "";
  for (let i = 1; i <= numpages; i++) {
    // Timeout guard
    if (Date.now() - start > timeoutMs) {
      break; // return partial text
    }
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const strings = (content.items || []).map((it: any) => ("str" in it ? it.str : ""));
    fullText += strings.join(" ") + "\n";
    opts?.onProgress?.({ page: i, total: numpages });
  }

  return { text: fullText.trim(), numpages };
}
