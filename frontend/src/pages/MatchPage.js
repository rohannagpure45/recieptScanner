import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { ParsedItemsTable } from '../components/ParsedItemsTable';
import { AssignmentsList } from '../components/AssignmentsList';
import { PayerSelector } from '../components/PayerSelector';
import { useWizard } from '../context/WizardContext';
import { computeSplit } from '../lib/compute';
export default function MatchPage() {
    const { setStep, guests, parsedData, payerId, assignments, taxMode, setTaxMode, tipMode, setTipMode, tipPercent, setTipPercent, setComputation } = useWizard();
    const allAssigned = Boolean(parsedData &&
        Array.isArray(parsedData.lineItems) &&
        parsedData.lineItems.length > 0 &&
        parsedData.lineItems.every((li) => (assignments[li.id] ?? []).length > 0));
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
    return (_jsxs(motion.section, { className: "space-y-6", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 }, children: [_jsxs("header", { children: [_jsx("p", { className: "text-sm uppercase tracking-widest text-slate-400", children: "Step 2 of 3" }), _jsx("h1", { className: "text-2xl font-semibold text-slate-200", children: "Match Items to Guests" }), _jsx("p", { className: "mt-2 text-sm text-slate-400", children: "Assign each receipt item to the people who shared it. Select who paid the bill." })] }), _jsx(ParsedItemsTable, {}), _jsxs("div", { className: "card", children: [_jsx("h2", { className: "mb-4 text-lg font-semibold text-slate-200", children: "Item Assignments" }), _jsx(AssignmentsList, {})] }), _jsxs("div", { className: "card", children: [_jsx("h2", { className: "mb-4 text-lg font-semibold text-slate-200", children: "Tax & Tip Settings" }), _jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [_jsxs("label", { className: "block text-sm text-slate-200", children: [_jsx("span", { className: "mb-2 block font-medium", children: "Tax Mode" }), _jsxs("select", { className: "input w-full touch-target", value: taxMode, onChange: (e) => setTaxMode(e.target.value), "aria-label": "Tax distribution mode", children: [_jsx("option", { value: "proportional", children: "Proportional to items" }), _jsx("option", { value: "even", children: "Split evenly" })] })] }), _jsxs("label", { className: "block text-sm text-slate-200", children: [_jsx("span", { className: "mb-2 block font-medium", children: "Tip Mode" }), _jsxs("select", { className: "input w-full touch-target", value: tipMode, onChange: (e) => setTipMode(e.target.value), "aria-label": "Tip calculation mode", children: [_jsx("option", { value: "fixed", children: "Use receipt tip" }), _jsx("option", { value: "percent", children: "Percent of items" })] })] }), tipMode === 'percent' && (_jsxs("label", { className: "block text-sm text-slate-200 sm:col-span-2", children: [_jsx("span", { className: "mb-2 block font-medium", children: "Tip Percent" }), _jsx("input", { className: "input w-full touch-target", type: "number", min: 0, max: 100, step: 0.1, value: tipPercent, onChange: (e) => setTipPercent(Number(e.target.value) || 0), "aria-label": "Tip percentage" })] }))] })] }), _jsx("div", { className: "card", children: _jsx(PayerSelector, {}) }), !allAssigned && parsedData && parsedData.lineItems.length > 0 && (_jsx(motion.div, { className: "rounded-lg border border-warning/50 bg-warning/10 p-4", initial: { opacity: 0 }, animate: { opacity: 1 }, role: "alert", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("svg", { className: "h-5 w-5 text-warning flex-shrink-0 mt-0.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }), _jsx("p", { className: "text-sm text-warning", children: "Please assign all items to at least one guest before continuing." })] }) })), _jsxs("div", { className: "flex justify-between pt-4 border-t border-slate-800", children: [_jsx(motion.button, { className: "btn-secondary touch-target", onClick: () => setStep(0), whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, "aria-label": "Go back to upload page", children: "Back" }), _jsx(motion.button, { className: "btn-primary touch-target", disabled: !canContinue, onClick: onContinue, whileHover: canContinue ? { scale: 1.05 } : {}, whileTap: canContinue ? { scale: 0.95 } : {}, "aria-label": canContinue ? 'Continue to review' : 'Complete all assignments and select payer', children: canContinue ? 'Continue' : 'Assign all items and choose a payer' })] })] }));
}
