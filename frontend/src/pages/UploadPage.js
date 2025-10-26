import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ReceiptUploader } from '../components/ReceiptUploader';
import { GuestsList } from '../components/GuestsList';
import { useWizard } from '../context/WizardContext';
export default function UploadPage() {
    const { setStep, receiptFile, guests } = useWizard();
    const canContinue = Boolean(receiptFile) && guests.some((guest) => guest.name.trim().length > 0);
    return (_jsxs("section", { className: "space-y-6", children: [_jsxs("header", { children: [_jsx("p", { className: "text-sm uppercase tracking-widest text-slate-400", children: "Step 1 of 3" }), _jsx("h1", { className: "text-2xl font-semibold", children: "Upload Receipt & Add Guests" })] }), _jsx(ReceiptUploader, {}), _jsx(GuestsList, {}), _jsx("div", { className: "flex justify-end", children: _jsx("button", { className: "btn-primary", disabled: !canContinue, onClick: () => setStep(1), children: "Next" }) })] }));
}
