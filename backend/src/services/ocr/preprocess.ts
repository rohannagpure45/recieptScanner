export async function preprocessImage(buffer: Buffer): Promise<Buffer> {
  // TODO: add rotation/contrast/orientation fixes before OCR.
  return buffer;
}
