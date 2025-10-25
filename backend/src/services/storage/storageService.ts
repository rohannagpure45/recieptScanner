import type { Express } from 'express';

export async function persistUpload(file: Express.Multer.File): Promise<string> {
  // TODO: upload to S3-compatible storage.
  return `local://${file.originalname}`;
}
