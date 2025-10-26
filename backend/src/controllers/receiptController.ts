import type { Request, Response } from 'express';
import { runReceiptPipeline } from '../services/pipeline/receiptPipeline';
import { persistUpload } from '../services/storage/storageService';

export async function createReceiptJob(
  req: Request & { file?: Express.Multer.File },
  res: Response
) {
  if (!req.file) {
    return res.status(400).json({ error: 'Missing receipt upload.' });
  }

  const guests = JSON.parse(req.body.guests ?? '[]');
  const payerId = req.body.payerId;
  const tipMode = req.body.tipMode ?? 'fixed';
  const tipPercent = Number(req.body.tipPercent ?? 0);

  const fileKey = await persistUpload(req.file);
  const result = await runReceiptPipeline({
    fileBuffer: req.file.buffer,
    fileKey,
    guests,
    payerId,
    tipMode,
    tipPercent
  });

  return res.status(202).json(result);
}

export async function getReceiptStatus(_req: Request, res: Response) {
  return res.json({ status: 'pending' });
}
