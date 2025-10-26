import type { ParsedReceipt } from '@shared/schemas';

type ClaudeResponse = ParsedReceipt | { error: string };

export async function parseReceiptWithClaude(ocrText: string): Promise<ClaudeResponse> {
  // Helper to generate a v4-like UUID for local/dev use
  const uuidv4 = () =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });

  if (!process.env.CLAUDE_API_KEY) {
    const receiptId = uuidv4();
    const itemId = uuidv4();
    const subtotalCents = 1299;
    const taxCents = 117;
    const tipCents = 0;
    const totalCents = subtotalCents + taxCents + tipCents;
    const mock: ParsedReceipt = {
      receiptId,
      merchant: 'Sample Cafe',
      transactionDate: new Date().toISOString().slice(0, 10),
      currency: 'USD',
      lineItems: [
        {
          id: itemId,
          name: 'Latte',
          quantity: 1,
          unitPriceCents: subtotalCents,
          totalCents: subtotalCents
        }
      ],
      subtotalCents,
      taxCents,
      tipCents,
      totalCents
    };
    return mock;
  }

  // TODO: call Anthropic Claude API using OCR text and prompt template.
  try {
    return JSON.parse(ocrText) as ParsedReceipt;
  } catch {
    // As a safety net, return a valid minimal receipt if OCR text is not JSON
    const receiptId = '00000000-0000-4000-8000-000000000000';
    const itemId = '00000000-0000-4000-8000-000000000001';
    return {
      receiptId,
      merchant: 'Unknown',
      transactionDate: new Date().toISOString().slice(0, 10),
      currency: 'USD',
      lineItems: [
        { id: itemId, name: 'Item', quantity: 1, unitPriceCents: 0, totalCents: 0 }
      ],
      subtotalCents: 0,
      taxCents: 0,
      tipCents: 0,
      totalCents: 0
    };
  }
}
