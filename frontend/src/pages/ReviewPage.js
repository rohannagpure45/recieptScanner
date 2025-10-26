import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { SummaryCard } from '../components/SummaryCard';
import { DebtsTable } from '../components/DebtsTable';
import { ExportButtons } from '../components/ExportButtons';
import { useWizard } from '../context/WizardContext';
export default function ReviewPage() {
    const { setStep } = useWizard();
    const mockComputation = useMemo(() => ({
        receiptId: 'preview',
        payerId: 'payer',
        tipMode: 'fixed',
        perPerson: [
            {
                guestId: 'guest-1',
                items: [],
                itemsTotalCents: 1234,
                taxCents: 100,
                tipCents: 150,
                totalCents: 1484,
                amountPaidCents: 0,
                owedToPayerCents: 1484
            }
        ],
        totals: {
            subtotalCents: 1234,
            taxCents: 100,
            tipCents: 150,
            grandTotalCents: 1484
        },
        rounding: {
            residualCents: 0,
            distribution: []
        }
    }), []);
    return (_jsxs("section", { className: "space-y-6", children: [_jsxs("header", { children: [_jsx("p", { className: "text-sm uppercase tracking-widest text-slate-400", children: "Step 3 of 3" }), _jsx("h1", { className: "text-2xl font-semibold", children: "Review & Send" })] }), _jsx("div", { className: "grid gap-4 lg:grid-cols-3", children: mockComputation.perPerson.map((person) => (_jsx(SummaryCard, { person: person }, person.guestId))) }), _jsx(DebtsTable, { data: mockComputation }), _jsx(ExportButtons, {}), _jsxs("div", { className: "flex justify-between", children: [_jsx("button", { className: "btn-secondary", onClick: () => setStep(1), children: "Back" }), _jsx("button", { className: "btn-primary", children: "Finish" })] })] }));
}
