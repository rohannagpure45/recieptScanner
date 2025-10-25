export function ExportButtons() {
  return (
    <div className="flex flex-wrap gap-3">
      <button className="btn-secondary">Download CSV</button>
      <button className="btn-secondary">Download PDF</button>
      <button className="btn-primary">Send Emails</button>
    </div>
  );
}
