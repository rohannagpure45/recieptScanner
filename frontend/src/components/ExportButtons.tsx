import { useState } from 'react';
import { useWizard } from '../context/WizardContext';
import { exportComputationCSV, exportComputationJSON } from '../lib/export';

export function ExportButtons() {
  const { computation, guests } = useWizard() as any;
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const disabled = !computation;
  const names = Object.fromEntries((guests || []).map((g: any) => [g.id, g.name || '']));

  const onDownloadCsv = () => {
    if (!computation) return;
    exportComputationCSV(computation, names);
  };

  const onDownloadJson = () => {
    if (!computation) return;
    exportComputationJSON(computation);
  };

  const onSendEmails = async () => {
    if (!computation) return;
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
    } catch (e: any) {
      setMessage(e?.message ?? 'Failed to send emails');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button className="btn-secondary" disabled={disabled} onClick={onDownloadCsv}>
        Download CSV
      </button>
      <button className="btn-secondary" disabled={disabled} onClick={onDownloadJson}>
        Download JSON
      </button>
      <button className="btn-primary" disabled={disabled || sending} onClick={onSendEmails}>
        Send Emails
      </button>
      {message && <span className="text-xs text-slate-400">{message}</span>}
    </div>
  );
}
