import { useState } from 'react';
import type { ReceiptParsedData } from '@shared/schemas';
import { ReceiptUploader } from '../components/ReceiptUploader';
import { GuestsList } from '../components/GuestsList';
import { useWizard } from '../context/WizardContext';

export default function UploadPage() {
  const { setStep, receiptFile, guests, setParsedData, setAssignments } = useWizard();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const canContinue = !submitting && Boolean(receiptFile) && guests.some((guest) => guest.name.trim().length > 0);

  const handleNext = async () => {
    if (!receiptFile) return;
    setSubmitting(true);
    setError(undefined);
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;
    try {
      controller = new AbortController();
      const timeoutMs = 10_000;
      timeoutId = setTimeout(() => controller?.abort(), timeoutMs);

      const form = new FormData();
      form.append('receipt', receiptFile);
      form.append('guests', JSON.stringify(guests));
      const res = await fetch('/api/receipts', { method: 'POST', body: form, signal: controller.signal });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed: ${res.status}`);
      }
      const data: unknown = await res.json();
      const isObj = typeof data === 'object' && data !== null;
      const receipt = isObj && 'receipt' in (data as any) ? (data as any).receipt : undefined;
      if (!isObj || receipt == null) {
        setParsedData(undefined);
        throw new Error('Invalid response shape: missing receipt');
      }
      setParsedData(receipt as ReceiptParsedData);
      setAssignments({});
      setStep(1);
    } catch (e: any) {
      if (e?.name === 'AbortError') {
        setError('Upload timed out. Please try again.');
      } else {
        setError(e?.message ?? 'Upload failed');
      }
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-widest text-slate-400">Step 1 of 3</p>
        <h1 className="text-2xl font-semibold">Upload Receipt & Add Guests</h1>
      </header>
      <ReceiptUploader />
      <GuestsList />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex justify-end">
        <button className="btn-primary" disabled={!canContinue} onClick={handleNext}>
          {submitting ? 'Uploading…' : 'Next'}
        </button>
      </div>
    </section>
  );
}
