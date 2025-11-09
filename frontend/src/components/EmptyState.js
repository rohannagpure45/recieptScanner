import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
export function EmptyState({ icon, title, description, action }) {
    return (_jsxs(motion.div, { className: "flex flex-col items-center justify-center py-12 px-4 text-center", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, children: [icon && (_jsx(motion.div, { className: "mb-4 text-slate-500", initial: { scale: 0 }, animate: { scale: 1 }, transition: { delay: 0.1, type: 'spring', stiffness: 200 }, children: icon })), _jsx("h3", { className: "mb-2 text-lg font-semibold text-slate-200", children: title }), description && _jsx("p", { className: "mb-6 max-w-md text-sm text-slate-400", children: description }), action && _jsx("div", { children: action })] }));
}
