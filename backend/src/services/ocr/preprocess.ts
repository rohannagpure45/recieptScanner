import sharp from 'sharp';

export type Preprocessed = { buffer: Buffer; mime: string };

// Downscale and normalize images for LLM vision parsing.
// - Max width: 1600px (keep aspect ratio)
// - Auto-rotate using EXIF
// - Convert HEIC/HEIF to JPEG
// - Re-compress JPEG (quality ~75) / PNG (compressionLevel 9)
export async function preprocessImage(buffer: Buffer, mime: string): Promise<Preprocessed> {
  try {
    // Use sharp defaults for failure behavior; do not suppress errors.
    const src = sharp(buffer).rotate();

    const heicLike = /heic|heif/i.test(mime);
    const isPng = /png/i.test(mime);
    const isJpeg = /jpe?g/i.test(mime);

    const pipeline = src.resize({ width: 1600, withoutEnlargement: true, fit: 'inside' });

    if (heicLike || isJpeg) {
      const out = await pipeline
        .jpeg({ quality: 75, chromaSubsampling: '4:2:0', mozjpeg: true })
        .toBuffer();
      return { buffer: out, mime: 'image/jpeg' };
    }

    if (isPng) {
      const out = await pipeline.png({ compressionLevel: 9 }).toBuffer();
      return { buffer: out, mime: 'image/png' };
    }

    // Default to JPEG for unknown-but-image types
    const out = await pipeline
      .jpeg({ quality: 75, chromaSubsampling: '4:2:0', mozjpeg: true })
      .toBuffer();
    return { buffer: out, mime: 'image/jpeg' };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    // Log for observability; propagate a clean error for callers
    console.error('preprocessImage: sharp processing failed:', msg);
    throw new Error(`Image preprocessing failed: ${msg}`);
  }
}
