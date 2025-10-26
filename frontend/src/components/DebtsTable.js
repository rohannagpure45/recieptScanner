import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useWizard } from '../context/WizardContext';
export function DebtsTable({ data }) {
    const { guests } = useWizard();
    const nameFor = (id) => guests.find((g) => g.id === id)?.name || id;
    return (_jsx("div", { className: "rounded-xl border border-slate-800", children: _jsxs("table", { className: "min-w-full text-sm text-slate-200", children: [_jsx("thead", { className: "bg-slate-900", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-2 text-left", children: "Guest" }), _jsx("th", { className: "px-4 py-2 text-left", children: "Owes (\u00A2)" })] }) }), _jsx("tbody", { children: data.perPerson.map((person) => (_jsxs("tr", { className: "border-t border-slate-800", children: [_jsx("td", { className: "px-4 py-2", children: nameFor(person.guestId) }), _jsx("td", { className: "px-4 py-2", children: person.owedToPayerCents })] }, person.guestId))) })] }) }));
}
