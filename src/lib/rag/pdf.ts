import * as PDFParse from 'pdf-parse';

export async function fetchPdfText(url: string): Promise<{ text: string; numpages: number; info?: any; }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch PDF: ${res.status} ${res.statusText}`);
  const arrayBuffer = await res.arrayBuffer();
  const dataBuffer = Buffer.from(arrayBuffer);
  const data = await (PDFParse as any)(dataBuffer);
  // data.numpages contains total pages; data.text is full text
  return { text: data.text || '', numpages: (data as any).numpages || (data as any).pdfInfo?.Pages || 1, info: (data as any).pdfInfo };
}

export async function parsePdfBuffer(dataBuffer: Buffer): Promise<{ text: string; numpages: number; info?: any; }> {
  const data = await (PDFParse as any)(dataBuffer);
  return { text: data.text || '', numpages: (data as any).numpages || (data as any).pdfInfo?.Pages || 1, info: (data as any).pdfInfo };
}
