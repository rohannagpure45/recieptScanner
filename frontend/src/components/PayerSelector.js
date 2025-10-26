import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useWizard } from '../context/WizardContext';
export function PayerSelector() {
    const { guests, payerId, setPayerId } = useWizard();
    return (_jsxs("label", { className: "block text-sm text-slate-200", children: ["Payer", _jsxs("select", { className: "mt-2 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2", value: payerId ?? '', onChange: (event) => setPayerId(event.target.value || undefined), children: [_jsx("option", { value: "", children: "Select who paid" }), guests.map((guest) => (_jsx("option", { value: guest.id, children: guest.name || 'Unnamed guest' }, guest.id)))] })] }));
}
