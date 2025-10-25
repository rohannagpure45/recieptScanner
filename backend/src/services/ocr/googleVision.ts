export async function runVisionOCR(buffer: Buffer): Promise<{ text: string }> {
  if (!process.env.GOOGLE_CREDENTIALS_JSON) {
    return { text: '' };
  }
  // TODO: integrate with Google Cloud Vision API.
  return { text: buffer.toString('base64').slice(0, 10) };
}
