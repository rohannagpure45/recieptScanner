import type { ParsedReceipt } from '@shared/schemas';

type ClaudeResponse = ParsedReceipt | { error: string };

export async function parseReceiptWithClaude(ocrText: string): Promise<ClaudeResponse> {
  if (!process.env.CLAUDE_API_KEY) {
    return {
      receiptId: 'mock',
      merchant: 'Unknown',
      transactionDate: new Date().toISOString().slice(0, 10),
      currency: 'USD',
      lineItems: [
        {
          id: 'mock-line',
          name: 'Placeholder Item',
          quantity: 1,
          unitPriceCents: 0,
          totalCents: 0
        }
      ],
      subtotalCents: 0,
      taxCents: 0,
      tipCents: 0,
      totalCents: 0
    };
  }
  // TODO: call Anthropic Claude API using OCR text and prompt template.
  return JSON.parse(ocrText) as ParsedReceipt;
}
