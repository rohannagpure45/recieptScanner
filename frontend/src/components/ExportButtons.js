import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWizard } from '../context/WizardContext';
import { exportComputationCSV, exportComputationJSON } from '../lib/export';
export function ExportButtons() {
    const { computation, guests } = useWizard();
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState('success');
    const disabled = !computation;
    const names = Object.fromEntries((guests || []).map((g) => [g.id, g.name || '']));
    const onDownloadCsv = () => {
        if (!computation)
            return;
        exportComputationCSV(computation, names);
    };
    const onDownloadJson = () => {
        if (!computation)
            return;
        exportComputationJSON(computation);
    };
    const onSendEmails = async () => {
        if (!computation)
            return;
        setSending(true);
        setMessage(undefined);
        try {
            const resp = await fetch('/api/receipts/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ computation, guests })
            });
            if (!resp.ok) {
                const t = await resp.text();
                throw new Error(t || `Email request failed: ${resp.status}`);
            }
            setMessage('Emails queued successfully');
            setMessageType('success');
        }
        catch (e) {
            setMessage(e?.message ?? 'Failed to send emails');
            setMessageType('error');
        }
        finally {
            setSending(false);
        }
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsx(motion.button, { className: "btn-secondary touch-target", disabled: disabled, onClick: onDownloadCsv, whileHover: disabled ? {} : { scale: 1.05 }, whileTap: disabled ? {} : { scale: 0.95 }, "aria-label": "Download CSV export", children: _jsxs("span", { className: "flex items-center gap-2", children: [_jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }), "Download CSV"] }) }), _jsx(motion.button, { className: "btn-secondary touch-target", disabled: disabled, onClick: onDownloadJson, whileHover: disabled ? {} : { scale: 1.05 }, whileTap: disabled ? {} : { scale: 0.95 }, "aria-label": "Download JSON export", children: _jsxs("span", { className: "flex items-center gap-2", children: [_jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }), "Download JSON"] }) }), _jsx(motion.button, { className: "btn-primary touch-target", disabled: disabled || sending, onClick: onSendEmails, whileHover: disabled || sending ? {} : { scale: 1.05 }, whileTap: disabled || sending ? {} : { scale: 0.95 }, "aria-label": "Send emails to guests", children: _jsx("span", { className: "flex items-center gap-2", children: sending ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "h-4 w-4 animate-spin", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Sending..."] })) : (_jsxs(_Fragment, { children: [_jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }), "Send Emails"] })) }) })] }), _jsx(AnimatePresence, { children: message && (_jsxs(motion.div, { className: `flex items-center gap-2 rounded-lg border p-3 ${messageType === 'success'
                        ? 'border-success/50 bg-success/10 text-success'
                        : 'border-error/50 bg-error/10 text-error'}`, initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, role: "alert", "aria-live": "polite", children: [messageType === 'success' ? (_jsx("svg", { className: "h-5 w-5 flex-shrink-0", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) })) : (_jsx("svg", { className: "h-5 w-5 flex-shrink-0", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) })), _jsx("p", { className: "text-sm", children: message })] })) })] }));
}
