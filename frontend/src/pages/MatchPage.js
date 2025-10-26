import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ParsedItemsTable } from '../components/ParsedItemsTable';
import { AssignmentsList } from '../components/AssignmentsList';
import { PayerSelector } from '../components/PayerSelector';
import { useWizard } from '../context/WizardContext';
import { computeSplit } from '../lib/compute';
export default function MatchPage() {
    const { setStep, guests, parsedData, payerId, assignments, taxMode, setTaxMode, tipMode, setTipMode, tipPercent, setTipPercent, setComputation } = useWizard();
    const allAssigned = Boolean(parsedData?.lineItems.every((li) => (assignments[li.id] ?? []).length > 0));
    const canContinue = Boolean(parsedData && payerId && guests.length > 0 && allAssigned);
    const onContinue = () => {
        if (!parsedData || !payerId)
            return;
        const result = computeSplit({
            receipt: parsedData,
            guestIds: guests.map((g) => g.id),
            assignments,
            payerId,
            taxMode,
            tipMode,
            tipPercent
        });
        setComputation(result);
        setStep(2);
    };
    return (_jsxs("section", { className: "space-y-6", children: [_jsxs("header", { children: [_jsx("p", { className: "text-sm uppercase tracking-widest text-slate-400", children: "Step 2 of 3" }), _jsx("h1", { className: "text-2xl font-semibold", children: "Match Items to Guests" })] }), _jsx(ParsedItemsTable, {}), _jsx(AssignmentsList, {}), _jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [_jsxs("label", { className: "block text-sm text-slate-200", children: ["Tax Mode", _jsxs("select", { className: "mt-1 input", value: taxMode, onChange: (e) => setTaxMode(e.target.value), children: [_jsx("option", { value: "proportional", children: "Proportional to items" }), _jsx("option", { value: "even", children: "Split evenly" })] })] }), _jsxs("label", { className: "block text-sm text-slate-200", children: ["Tip Mode", _jsxs("select", { className: "mt-1 input", value: tipMode, onChange: (e) => setTipMode(e.target.value), children: [_jsx("option", { value: "fixed", children: "Use receipt tip" }), _jsx("option", { value: "percent", children: "Percent of items" })] })] }), tipMode === 'percent' && (_jsxs("label", { className: "block text-sm text-slate-200", children: ["Tip Percent", _jsx("input", { className: "mt-1 input", type: "number", min: 0, max: 100, value: tipPercent, onChange: (e) => setTipPercent(Number(e.target.value) || 0) })] }))] }), _jsx(PayerSelector, {}), _jsxs("div", { className: "flex justify-between", children: [_jsx("button", { className: "btn-secondary", onClick: () => setStep(0), children: "Back" }), _jsx("button", { className: "btn-primary", disabled: !canContinue, onClick: onContinue, children: canContinue ? 'Continue' : 'Assign all items and choose a payer' })] })] }));
}
