import type { ParsedReceipt } from '@shared/schemas';
import { ParsedReceiptSchema } from '@shared/schemas';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = process.env.CLAUDE_MODEL ?? 'claude-3-haiku-20240307';

type ClaudeJSON = ParsedReceipt | { error: string };

async function callClaude(prompt: string): Promise<string> {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    throw new Error('CLAUDE_API_KEY is not configured.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 2048,
        temperature: 0,
        system:
          'You are a meticulous receipts parsing assistant. Output only valid JSON that matches the requested schema. Do not include markdown fences or commentary.',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '<unable to read body>');
      throw new Error(`Claude API error ${response.status}: ${text}`);
    }

    const json = (await response.json()) as {
      error?: { message: string };
      content?: Array<{ type: string; text: string }>;
    };

    if (json.error) {
      throw new Error(`Claude API responded with error: ${json.error.message}`);
    }

    const firstText = json.content?.find((block) => block.type === 'text')?.text;
    if (!firstText) {
      throw new Error('Claude API response did not include text content.');
    }

    return firstText.trim();
  } finally {
    clearTimeout(timeout);
  }
}

function buildPrompt(ocrText: string): string {
  const schemaInstructions = `Return JSON strictly matching this TypeScript schema:
{
  "receiptId": string (UUID v4),
  "merchant": string,
  "transactionDate": string (ISO-8601 date),
  "currency": string (three-letter ISO code),
  "lineItems": Array<{
    "id": string (UUID v4),
    "name": string,
    "quantity": integer >= 1,
    "unitPriceCents": integer >= 0,
    "totalCents": integer >= 0,
    "category"?: string,
    "notes"?: string
  }> (at least one item),
  "subtotalCents": integer >= 0,
  "taxCents": integer >= 0,
  "tipCents": integer >= 0,
  "totalCents": integer >= 0
}`;

  return `You are given OCR text captured from a restaurant or store receipt.
${schemaInstructions}

Rules:
- Derive all monetary amounts in cents (no decimals) and ensure subtotal + tax + tip = total when possible.
- If data is missing, infer conservatively or use 0; never fabricate extra line items.
- Generate new UUID v4 identifiers for the receipt and each line item if not present.
- Ensure the output is parseable JSON without comments or trailing commas.

OCR TEXT START
${ocrText}
OCR TEXT END`;
}

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

  const prompt = buildPrompt(ocrText);

  try {
    const rawText = await callClaude(prompt);
    const sanitized = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(sanitized) as ClaudeJSON;

    const validation = ParsedReceiptSchema.safeParse(parsed);
    if (!validation.success) {
      const issues = validation.error.issues.map((issue) => issue.message).join('; ');
      return {
        error: `Claude response failed validation: ${issues}`
      };
    }

    return validation.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Claude integration error';
    return { error: `Failed to parse receipt with Claude: ${message}` };
  }
}
