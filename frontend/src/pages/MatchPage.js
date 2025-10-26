import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ParsedItemsTable } from '../components/ParsedItemsTable';
import { PayerSelector } from '../components/PayerSelector';
import { useWizard } from '../context/WizardContext';
export default function MatchPage() {
    const { setStep, guests } = useWizard();
    return (_jsxs("section", { className: "space-y-6", children: [_jsxs("header", { children: [_jsx("p", { className: "text-sm uppercase tracking-widest text-slate-400", children: "Step 2 of 3" }), _jsx("h1", { className: "text-2xl font-semibold", children: "Match Items to Guests" })] }), _jsx(ParsedItemsTable, {}), _jsxs("div", { className: "rounded-xl border border-slate-800 bg-slate-900/40 p-4", children: [_jsx("p", { className: "text-sm text-slate-400", children: "Assignment UI TBD \u2014 map each item to one or more guests here." }), _jsxs("p", { className: "text-xs text-slate-500", children: ["Guests added: ", guests.length] })] }), _jsx(PayerSelector, {}), _jsxs("div", { className: "flex justify-between", children: [_jsx("button", { className: "btn-secondary", onClick: () => setStep(0), children: "Back" }), _jsx("button", { className: "btn-primary", onClick: () => setStep(2), children: "Continue" })] })] }));
}
