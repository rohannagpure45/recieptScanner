import { jsxs as _jsxs } from "react/jsx-runtime";
export function SummaryCard({ person }) {
    return (_jsxs("div", { className: "rounded-xl border border-slate-800 bg-slate-900/40 p-4", children: [_jsxs("h3", { className: "text-lg font-semibold", children: ["Guest: ", person.guestId] }), _jsxs("p", { className: "text-sm text-slate-400", children: ["Items: ", (person.itemsTotalCents / 100).toFixed(2)] }), _jsxs("p", { className: "text-sm text-slate-400", children: ["Tax: ", (person.taxCents / 100).toFixed(2)] }), _jsxs("p", { className: "text-sm text-slate-400", children: ["Tip: ", (person.tipCents / 100).toFixed(2)] }), _jsxs("p", { className: "text-sm font-semibold text-slate-100", children: ["Total: ", (person.totalCents / 100).toFixed(2)] })] }));
}
