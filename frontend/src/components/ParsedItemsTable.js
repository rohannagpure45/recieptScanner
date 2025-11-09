import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useWizard } from '../context/WizardContext';
import { ItemCard } from './ItemCard';
import { EmptyState } from './EmptyState';
import { motion } from 'framer-motion';
import { staggerContainer } from '../lib/animations';
export function ParsedItemsTable() {
    const { parsedData, assignments } = useWizard();
    if (!parsedData) {
        return (_jsx(EmptyState, { icon: _jsx("svg", { className: "h-12 w-12 animate-pulse", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }), title: "Awaiting extraction results", description: "Processing your receipt image..." }));
    }
    if (!parsedData.lineItems || parsedData.lineItems.length === 0) {
        return (_jsx(EmptyState, { icon: _jsx("svg", { className: "h-12 w-12", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }), title: "No items found", description: "We couldn't extract any items from this receipt. Please try uploading a clearer image." }));
    }
    return (_jsxs("div", { children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsxs("h2", { className: "text-xl font-semibold text-slate-200", children: ["Receipt Items (", parsedData.lineItems.length, ")"] }), _jsxs("p", { className: "text-sm text-slate-400", children: [parsedData.lineItems.filter((item) => (assignments[item.id] ?? []).length > 0).length, " assigned"] })] }), _jsx(motion.div, { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", variants: staggerContainer, initial: "initial", animate: "animate", children: parsedData.lineItems.map((item) => {
                    const isAssigned = (assignments[item.id] ?? []).length > 0;
                    return _jsx(ItemCard, { item: item, isAssigned: isAssigned }, item.id);
                }) })] }));
}
