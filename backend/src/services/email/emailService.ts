import type { ComputationOutput } from '@shared/schemas';

export async function sendReceiptEmails(
  computation: ComputationOutput,
  guests: Array<{ id: string; name: string; email?: string }>
) {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('sendReceiptEmails (dry-run):', {
      receiptId: computation.receiptId,
      recipients: guests.filter((g) => g.email).map((g) => ({ id: g.id, email: g.email }))
    });
    return { status: 'skipped' };
  }
  // TODO: integrate SendGrid transactional template, then:
  // - for each person in computation.perPerson, compose an email with
  //   items, tax, tip, total, owed to payer, and a payment hint.
  // - send messages via SendGrid Mail API.
  return { status: 'queued' };
}
