import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { SummaryCard } from '../components/SummaryCard';
import { DebtsTable } from '../components/DebtsTable';
import { ExportButtons } from '../components/ExportButtons';
import { useWizard } from '../context/WizardContext';
export default function ReviewPage() {
    const { setStep, computation } = useWizard();
    return (_jsxs("section", { className: "space-y-6", children: [_jsxs("header", { children: [_jsx("p", { className: "text-sm uppercase tracking-widest text-slate-400", children: "Step 3 of 3" }), _jsx("h1", { className: "text-2xl font-semibold", children: "Review & Send" })] }), !computation && _jsx("p", { className: "text-sm text-yellow-400", children: "Missing computation \u2014 go back and complete assignments." }), computation && (_jsxs(_Fragment, { children: [_jsx("div", { className: "grid gap-4 lg:grid-cols-3", children: computation.perPerson.map((person) => (_jsx(SummaryCard, { person: person }, person.guestId))) }), _jsx(DebtsTable, { data: computation })] })), _jsx(ExportButtons, {}), _jsxs("div", { className: "flex justify-between", children: [_jsx("button", { className: "btn-secondary", onClick: () => setStep(1), children: "Back" }), _jsx("button", { className: "btn-primary", onClick: () => setStep(0), children: "Finish" })] })] }));
}
