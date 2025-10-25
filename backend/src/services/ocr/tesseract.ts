export async function runTesseractOCR(buffer: Buffer): Promise<{ text: string }> {
  // TODO: integrate tesseract.js or native binary.
  return { text: buffer.toString('utf8') };
}
