import type { Request, Response } from 'express';
import { runReceiptPipeline } from '../services/pipeline/receiptPipeline';
import { persistUpload } from '../services/storage/storageService';
import { sendReceiptEmails } from '../services/email/emailService';
import type { ComputationOutput } from '@shared/schemas';

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

export async function sendEmails(req: Request, res: Response) {
  const payload = req.body as {
    computation?: ComputationOutput;
    guests?: Array<{ id: string; name: string; email?: string }>;
  };
  if (!payload || !payload.computation || !Array.isArray(payload.guests)) {
    return res.status(400).json({ error: 'Invalid email payload.' });
  }
  try {
    await sendReceiptEmails(payload.computation, payload.guests);
    return res.status(202).json({ ok: true });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Failed to send emails' });
  }
}
