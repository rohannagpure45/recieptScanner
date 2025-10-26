import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useWizard } from '../context/WizardContext';
export function AssignItem({ lineItemId, lineItemName, lineItemTotalCents }) {
    const { guests, assignments, setAssignments } = useWizard();
    const selected = new Set(assignments[lineItemId] ?? []);
    const toggle = (guestId) => {
        const next = new Set(assignments[lineItemId] ?? []);
        if (next.has(guestId))
            next.delete(guestId);
        else
            next.add(guestId);
        setAssignments({ ...assignments, [lineItemId]: Array.from(next) });
    };
    const perPerson = selected.size > 0 ? Math.floor(lineItemTotalCents / selected.size) : 0;
    return (_jsxs("div", { className: "rounded-lg border border-slate-800 p-3", children: [_jsxs("div", { className: "mb-2 flex items-center justify-between", children: [_jsx("p", { className: "text-sm font-medium text-slate-200", children: lineItemName }), _jsxs("p", { className: "text-xs text-slate-400", children: [(lineItemTotalCents / 100).toFixed(2), " total"] })] }), _jsx("div", { className: "flex flex-wrap gap-3", children: guests.map((g) => (_jsxs("label", { className: "inline-flex items-center gap-2 text-sm text-slate-200", children: [_jsx("input", { type: "checkbox", className: "h-4 w-4 rounded border-slate-700 bg-slate-900", checked: selected.has(g.id), onChange: () => toggle(g.id) }), g.name || 'Unnamed'] }, g.id))) }), _jsx("p", { className: "mt-2 text-xs text-slate-500", children: selected.size > 0 ? `Split equally among ${selected.size} — ~${(perPerson / 100).toFixed(2)} each` : 'Select one or more people' })] }));
}
