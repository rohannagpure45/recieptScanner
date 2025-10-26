import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import { ReceiptUploader } from '../components/ReceiptUploader';
import { GuestsList } from '../components/GuestsList';
import { useWizard } from '../context/WizardContext';
export default function UploadPage() {
    const { setStep, receiptFile, guests, setParsedData, setAssignments } = useWizard();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState();
    const canContinue = !submitting && Boolean(receiptFile) && guests.some((guest) => guest.name.trim().length > 0);
    const inFlightRef = useRef(false);
    const handleNext = async () => {
        if (inFlightRef.current)
            return; // guard against rapid double clicks
        if (!receiptFile)
            return;
        inFlightRef.current = true;
        setSubmitting(true);
        setError(undefined);
        let timeoutId;
        let controller;
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
            const data = await res.json();
            const isObj = typeof data === 'object' && data !== null;
            const receipt = isObj && 'receipt' in data ? data.receipt : undefined;
            if (!isObj || receipt == null) {
                setParsedData(undefined);
                throw new Error('Invalid response shape: missing receipt');
            }
            setParsedData(receipt);
            setAssignments({});
            setStep(1);
        }
        catch (e) {
            if (e?.name === 'AbortError') {
                setError('Upload timed out. Please try again.');
            }
            else {
                setError(e?.message ?? 'Upload failed');
            }
        }
        finally {
            if (timeoutId)
                clearTimeout(timeoutId);
            setSubmitting(false);
            inFlightRef.current = false;
        }
    };
    return (_jsxs("section", { className: "space-y-6", children: [_jsxs("header", { children: [_jsx("p", { className: "text-sm uppercase tracking-widest text-slate-400", children: "Step 1 of 3" }), _jsx("h1", { className: "text-2xl font-semibold", children: "Upload Receipt & Add Guests" })] }), _jsx(ReceiptUploader, {}), _jsx(GuestsList, {}), error && _jsx("p", { className: "text-sm text-red-400", children: error }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { className: "btn-primary", disabled: !canContinue, onClick: handleNext, "aria-busy": submitting, children: submitting ? 'Uploading…' : 'Next' }) })] }));
}
