import { useRef } from 'react';
import { useWizard } from '../context/WizardContext';

const ACCEPTED = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];

export function ReceiptUploader() {
  const { receiptFile, setReceiptFile } = useWizard();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file?: File) => {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      alert('Unsupported file type. Please upload PNG, JPG, or PDF.');
      return;
    }
    setReceiptFile(file);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
      <p className="text-sm text-slate-300">Upload a clear photo or PDF of the receipt.</p>
      <input
        ref={inputRef}
        className="mt-3 block w-full text-sm"
        type="file"
        accept="image/*,application/pdf"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      {receiptFile && (
        <div className="mt-4 text-sm text-slate-200">
          <p>Selected: {receiptFile.name}</p>
          <button className="text-brand" onClick={() => inputRef.current?.click()}>
            Replace file
          </button>
        </div>
      )}
    </div>
  );
}
