import { preprocessImage, runVisionOCR, runTesseractOCR } from '../ocr';
import { parseReceiptWithClaude } from '../llm/claudeClient';
import { validateParsedReceipt } from '../../utils/validation';
import type { ParsedReceipt } from '@shared/schemas';

export type TipMode = 'fixed' | 'percent';

export type PipelineInput = {
  fileBuffer: Buffer;
  fileKey: string;
  guests: unknown;
  payerId?: string;
  tipMode: TipMode;
  tipPercent: number;
};

export async function runReceiptPipeline(input: PipelineInput): Promise<{ receipt: ParsedReceipt }> {
  const processed = await preprocessImage(input.fileBuffer);
  const primary = await runVisionOCR(processed);
  const ocrText = primary.text.length ? primary.text : (await runTesseractOCR(processed)).text;
  const parsed = await parseReceiptWithClaude(ocrText);
  if ('error' in parsed && parsed.error) {
    throw new Error(parsed.error);
  }
  const validated = validateParsedReceipt(parsed);
  return { receipt: validated };
}
