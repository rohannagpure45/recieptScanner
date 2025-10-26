import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useWizard } from '../context/WizardContext';
import { exportComputationCSV, exportComputationJSON } from '../lib/export';
export function ExportButtons() {
    const { computation, guests } = useWizard();
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState();
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
            setMessage('Emails queued (or dry-run in dev)');
        }
        catch (e) {
            setMessage(e?.message ?? 'Failed to send emails');
        }
        finally {
            setSending(false);
        }
    };
    return (_jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsx("button", { className: "btn-secondary", disabled: disabled, onClick: onDownloadCsv, children: "Download CSV" }), _jsx("button", { className: "btn-secondary", disabled: disabled, onClick: onDownloadJson, children: "Download JSON" }), _jsx("button", { className: "btn-primary", disabled: disabled || sending, onClick: onSendEmails, children: "Send Emails" }), message && _jsx("span", { className: "text-xs text-slate-400", children: message })] }));
}
