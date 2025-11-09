import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropZone } from '../components/DragDropZone';
import { GuestsList } from '../components/GuestsList';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { useWizard } from '../context/WizardContext';
export default function UploadPage() {
    const { setStep, receiptFile, guests, setParsedData, setAssignments } = useWizard();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState();
    const canContinue = !submitting && Boolean(receiptFile) && guests.some((guest) => guest.name.trim().length > 0);
    const inFlightRef = useRef(false);
    const handleNext = async () => {
        if (inFlightRef.current)
            return;
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
    // Estimate processing time based on file size (rough estimate: 1MB = 2 seconds)
    const estimatedTime = receiptFile ? Math.max(3, Math.ceil((receiptFile.size / (1024 * 1024)) * 2)) : undefined;
    return (_jsxs(_Fragment, { children: [submitting && _jsx(LoadingOverlay, { message: "Processing receipt...", estimatedTime: estimatedTime }), _jsxs(motion.section, { className: "space-y-6", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 }, children: [_jsxs("header", { children: [_jsx("p", { className: "text-sm uppercase tracking-widest text-slate-400", children: "Step 1 of 3" }), _jsx("h1", { className: "text-2xl font-semibold text-slate-200", children: "Upload Receipt & Add Guests" }), _jsx("p", { className: "mt-2 text-sm text-slate-400", children: "Upload a clear photo of your receipt and add the people who will split the bill." })] }), _jsx(DragDropZone, {}), _jsx(GuestsList, {}), _jsx(AnimatePresence, { children: error && (_jsxs(motion.div, { className: "flex items-start gap-3 rounded-lg border border-error/50 bg-error/10 p-4", initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, role: "alert", "aria-live": "polite", children: [_jsx("svg", { className: "h-5 w-5 text-error flex-shrink-0 mt-0.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium text-error", children: error }), _jsx(motion.button, { className: "mt-2 text-xs text-error underline hover:no-underline", onClick: handleNext, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: "Retry upload" })] })] })) }), _jsx("div", { className: "flex justify-end pt-4 border-t border-slate-800", children: _jsx(motion.button, { className: "btn-primary touch-target", disabled: !canContinue, onClick: handleNext, "aria-busy": submitting, whileHover: canContinue ? { scale: 1.05 } : {}, whileTap: canContinue ? { scale: 0.95 } : {}, "aria-label": submitting ? 'Uploading receipt' : 'Continue to next step', children: submitting ? (_jsxs("span", { className: "flex items-center gap-2", children: [_jsxs("svg", { className: "h-4 w-4 animate-spin", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Uploading\u2026"] })) : ('Next') }) })] })] }));
}
