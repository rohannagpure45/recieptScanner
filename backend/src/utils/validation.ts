import { ParsedReceiptSchema } from '@shared/schemas';
import type { ParsedReceipt } from '@shared/schemas';

export function validateParsedReceipt(payload: unknown): ParsedReceipt {
  const parsed = ParsedReceiptSchema.parse(payload);
  const delta = Math.abs(parsed.subtotalCents + parsed.taxCents + parsed.tipCents - parsed.totalCents);
  if (delta > 50) {
    throw new Error('Totals do not reconcile within 50 cents.');
  }
  return parsed;
}
