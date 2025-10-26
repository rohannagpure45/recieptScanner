import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useWizard } from '../context/WizardContext';
export function AssignItem({ lineItemId, lineItemName, lineItemTotalCents }) {
    const { guests, assignments, setAssignments } = useWizard();
    const selected = new Set(assignments[lineItemId] ?? []);
    const selectedIds = Array.from(selected);
    const toggle = (guestId) => {
        setAssignments((prev) => {
            const next = new Set((prev[lineItemId] ?? []));
            if (next.has(guestId))
                next.delete(guestId);
            else
                next.add(guestId);
            return { ...prev, [lineItemId]: Array.from(next) };
        });
    };
    const splitSharesCents = selectedIds.length
        ? (() => {
            const base = Math.floor(lineItemTotalCents / selectedIds.length);
            const remainder = lineItemTotalCents % selectedIds.length;
            return selectedIds.map((_, index) => base + (index < remainder ? 1 : 0));
        })()
        : [];
    const splitSummary = splitSharesCents
        .map((amount) => (amount / 100).toFixed(2))
        .join(', ');
    return (_jsxs("div", { className: "rounded-lg border border-slate-800 p-3", children: [_jsxs("div", { className: "mb-2 flex items-center justify-between", children: [_jsx("p", { className: "text-sm font-medium text-slate-200", children: lineItemName }), _jsxs("p", { className: "text-xs text-slate-400", children: [(lineItemTotalCents / 100).toFixed(2), " total"] })] }), _jsx("div", { className: "flex flex-wrap gap-3", children: guests.map((g) => (_jsxs("label", { className: "inline-flex items-center gap-2 text-sm text-slate-200", children: [_jsx("input", { type: "checkbox", className: "h-4 w-4 rounded border-slate-700 bg-slate-900", checked: selected.has(g.id), onChange: () => toggle(g.id) }), g.name || 'Unnamed'] }, g.id))) }), _jsx("p", { className: "mt-2 text-xs text-slate-500", children: selectedIds.length > 0
                    ? `Split equally among ${selectedIds.length} — ${splitSummary} each`
                    : 'Select one or more people' })] }));
}
