import { ReceiptUploader } from '../components/ReceiptUploader';
import { GuestsList } from '../components/GuestsList';
import { useWizard } from '../context/WizardContext';

export default function UploadPage() {
  const { setStep, receiptFile, guests } = useWizard();
  const canContinue = Boolean(receiptFile) && guests.some((guest) => guest.name.trim().length > 0);

  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-widest text-slate-400">Step 1 of 3</p>
        <h1 className="text-2xl font-semibold">Upload Receipt & Add Guests</h1>
      </header>
      <ReceiptUploader />
      <GuestsList />
      <div className="flex justify-end">
        <button className="btn-primary" disabled={!canContinue} onClick={() => setStep(1)}>
          Next
        </button>
      </div>
    </section>
  );
}
