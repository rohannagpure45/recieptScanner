import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useWizard } from '../context/WizardContext';
export function ParsedItemsTable() {
    const { parsedData } = useWizard();
    if (!parsedData) {
        return _jsx("p", { className: "text-sm text-slate-400", children: "Awaiting extraction results." });
    }
    return (_jsx("div", { className: "overflow-x-auto rounded-xl border border-slate-800", children: _jsxs("table", { className: "min-w-full text-sm text-slate-200", children: [_jsx("thead", { className: "bg-slate-900", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-2 text-left", children: "Item" }), _jsx("th", { className: "px-4 py-2 text-left", children: "Qty" }), _jsx("th", { className: "px-4 py-2 text-left", children: "Unit (\u00A2)" }), _jsx("th", { className: "px-4 py-2 text-left", children: "Total (\u00A2)" })] }) }), _jsx("tbody", { children: parsedData.lineItems.map((item) => (_jsxs("tr", { className: "border-t border-slate-800", children: [_jsx("td", { className: "px-4 py-2", children: _jsx("input", { className: "input w-full", value: item.name, readOnly: true }) }), _jsx("td", { className: "px-4 py-2", children: _jsx("input", { className: "input w-24 text-center", type: "number", value: item.quantity, readOnly: true }) }), _jsx("td", { className: "px-4 py-2", children: _jsx("input", { className: "input w-28", value: item.unitPriceCents, readOnly: true }) }), _jsx("td", { className: "px-4 py-2", children: _jsx("input", { className: "input w-28", value: item.totalCents, readOnly: true }) })] }, item.id))) })] }) }));
}
