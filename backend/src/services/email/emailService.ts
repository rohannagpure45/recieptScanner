export async function sendReceiptEmails() {
  if (!process.env.SENDGRID_API_KEY) {
    return { status: 'skipped' };
  }
  // TODO: integrate SendGrid transactional template.
  return { status: 'queued' };
}
