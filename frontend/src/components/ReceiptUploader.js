import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
import { useWizard } from '../context/WizardContext';
const ACCEPTED = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
export function ReceiptUploader() {
    const { receiptFile, setReceiptFile } = useWizard();
    const inputRef = useRef(null);
    const handleFile = (file) => {
        if (!file)
            return;
        if (!ACCEPTED.includes(file.type)) {
            alert('Unsupported file type. Please upload PNG, JPG, or PDF.');
            return;
        }
        setReceiptFile(file);
    };
    return (_jsxs("div", { className: "rounded-xl border border-slate-800 bg-slate-900/40 p-6", children: [_jsx("p", { className: "text-sm text-slate-300", children: "Upload a clear photo or PDF of the receipt." }), _jsx("input", { ref: inputRef, className: "mt-3 block w-full text-sm", type: "file", accept: "image/*,application/pdf", onChange: (event) => handleFile(event.target.files?.[0]) }), receiptFile && (_jsxs("div", { className: "mt-4 text-sm text-slate-200", children: [_jsxs("p", { children: ["Selected: ", receiptFile.name] }), _jsx("button", { className: "text-brand", onClick: () => inputRef.current?.click(), children: "Replace file" })] }))] }));
}
