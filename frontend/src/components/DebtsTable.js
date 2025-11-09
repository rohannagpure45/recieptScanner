import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { useWizard } from '../context/WizardContext';
export function DebtsTable({ data }) {
    const { guests } = useWizard();
    const nameFor = (id) => guests.find((g) => g.id === id)?.name || id;
    return (_jsx("div", { className: "overflow-x-auto rounded-xl border border-slate-800 glass-card", children: _jsxs("table", { className: "min-w-full text-sm text-slate-200", role: "table", "aria-label": "Debts breakdown", children: [_jsx("thead", { className: "bg-slate-900/50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 text-left font-semibold text-slate-200", children: "Guest" }), _jsx("th", { className: "px-4 py-3 text-right font-semibold text-slate-200", children: "Owes" })] }) }), _jsx("tbody", { children: data.perPerson.map((person, index) => (_jsxs(motion.tr, { className: "border-t border-slate-800", initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.05 }, children: [_jsx("td", { className: "px-4 py-3 font-medium", children: nameFor(person.guestId) }), _jsx("td", { className: "px-4 py-3 text-right", children: person.owedToPayerCents > 0 ? (_jsxs("span", { className: "font-semibold text-warning", children: ["$", (person.owedToPayerCents / 100).toFixed(2)] })) : (_jsx("span", { className: "text-slate-500", children: "\u2014" })) })] }, person.guestId))) })] }) }));
}
