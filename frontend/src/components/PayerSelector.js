import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useWizard } from '../context/WizardContext';
export function PayerSelector() {
    const { guests, payerId, setPayerId } = useWizard();
    return (_jsxs("label", { className: "block text-sm text-slate-200", children: [_jsx("span", { className: "mb-2 block font-medium", children: "Who paid for this receipt?" }), _jsxs("select", { className: "input w-full touch-target", value: payerId ?? '', onChange: (event) => setPayerId(event.target.value || undefined), "aria-label": "Select who paid for the receipt", "aria-required": "true", children: [_jsx("option", { value: "", children: "Select who paid" }), guests.map((guest) => (_jsx("option", { value: guest.id, children: guest.name || 'Unnamed guest' }, guest.id)))] }), _jsx("p", { className: "mt-2 text-xs text-slate-400", children: "This person will receive payments from others based on the split calculation." })] }));
}
