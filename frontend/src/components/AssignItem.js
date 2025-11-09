import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useWizard } from '../context/WizardContext';
import { GuestChip } from './GuestChip';
import { motion } from 'framer-motion';
export function AssignItem({ lineItemId, lineItemName, lineItemTotalCents }) {
    const { guests, assignments, setAssignments } = useWizard();
    const selected = new Set(assignments[lineItemId] ?? []);
    const selectedIds = Array.from(selected);
    const toggle = (guestId) => {
        setAssignments((prev) => {
            const next = new Set(prev[lineItemId] ?? []);
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
    const allEqual = splitSharesCents.length > 0 && splitSharesCents.every((v) => v === splitSharesCents[0]);
    return (_jsxs(motion.div, { className: `glass-card p-4 transition-all duration-200 ${selectedIds.length === 0 ? 'border-warning/50 bg-warning/5' : ''}`, initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, whileHover: { scale: 1.01 }, children: [_jsxs("div", { className: "mb-3 flex items-center justify-between gap-2", children: [_jsx("p", { className: "text-base font-semibold text-slate-200", children: lineItemName }), _jsxs("p", { className: "text-lg font-bold text-slate-100", children: ["$", (lineItemTotalCents / 100).toFixed(2)] })] }), _jsx("div", { className: "mb-3 flex flex-wrap gap-2", children: guests.map((g) => (_jsx(GuestChip, { guestId: g.id, name: g.name, isSelected: selected.has(g.id), onToggle: () => toggle(g.id) }, g.id))) }), selectedIds.length > 0 && (_jsx(motion.p, { className: "text-xs text-slate-400", initial: { opacity: 0 }, animate: { opacity: 1 }, children: allEqual
                    ? `Split equally among ${selectedIds.length} — $${(splitSharesCents[0] / 100).toFixed(2)} each`
                    : `Split among ${selectedIds.length} — ${splitSharesCents.map((c) => `$${(c / 100).toFixed(2)}`).join(', ')}` })), selectedIds.length === 0 && (_jsx("p", { className: "text-xs text-warning", children: "Select one or more people to assign this item" }))] }));
}
