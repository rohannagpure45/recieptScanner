import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { GuestChip } from './GuestChip';
import { useWizard } from '../context/WizardContext';
export function ItemCard({ item, isAssigned }) {
    const { guests, assignments, setAssignments } = useWizard();
    const selectedIds = new Set(assignments[item.id] ?? []);
    const toggleGuest = (guestId) => {
        setAssignments((prev) => {
            const next = new Set(prev[item.id] ?? []);
            if (next.has(guestId)) {
                next.delete(guestId);
            }
            else {
                next.add(guestId);
            }
            return { ...prev, [item.id]: Array.from(next) };
        });
    };
    const splitSharesCents = selectedIds.size
        ? (() => {
            const base = Math.floor(item.totalCents / selectedIds.size);
            const remainder = item.totalCents % selectedIds.size;
            return Array.from(selectedIds).map((_, index) => base + (index < remainder ? 1 : 0));
        })()
        : [];
    const allEqual = splitSharesCents.length > 0 && splitSharesCents.every((v) => v === splitSharesCents[0]);
    return (_jsxs(motion.div, { className: `glass-card p-4 transition-all duration-200 ${isAssigned ? '' : 'border-warning/50 bg-warning/5'}`, initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, whileHover: { scale: 1.01 }, transition: { duration: 0.2 }, children: [_jsxs("div", { className: "mb-3 flex items-start justify-between gap-2", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h4", { className: "text-base font-semibold text-slate-200 truncate", children: item.name }), _jsxs("div", { className: "mt-1 flex flex-wrap gap-2 text-xs text-slate-400", children: [_jsxs("span", { children: ["Qty: ", item.quantity] }), _jsx("span", { children: "\u2022" }), _jsxs("span", { children: ["Unit: $", (item.unitPriceCents / 100).toFixed(2)] })] })] }), _jsxs("div", { className: "flex-shrink-0 text-right", children: [_jsxs("p", { className: "text-lg font-bold text-slate-100", children: ["$", (item.totalCents / 100).toFixed(2)] }), !isAssigned && (_jsx("p", { className: "text-xs text-warning mt-1", children: "Unassigned" }))] })] }), _jsxs("div", { className: "mt-3 pt-3 border-t border-slate-800", children: [_jsx("p", { className: "mb-2 text-xs font-medium text-slate-400", children: "Assign to:" }), _jsx("div", { className: "flex flex-wrap gap-2", children: guests.map((guest) => (_jsx(GuestChip, { guestId: guest.id, name: guest.name, isSelected: selectedIds.has(guest.id), onToggle: () => toggleGuest(guest.id) }, guest.id))) }), selectedIds.size > 0 && (_jsx(motion.p, { className: "mt-3 text-xs text-slate-400", initial: { opacity: 0 }, animate: { opacity: 1 }, children: allEqual
                            ? `Split equally among ${selectedIds.size} — $${(splitSharesCents[0] / 100).toFixed(2)} each`
                            : `Split among ${selectedIds.size} — ${splitSharesCents.map((c) => `$${(c / 100).toFixed(2)}`).join(', ')}` }))] })] }));
}
