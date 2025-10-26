function toCsvRow(fields) {
    return fields
        .map((f) => {
        const s = String(f ?? '');
        return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    })
        .join(',');
}
export function exportComputationCSV(data, guestNames) {
    const header = ['Guest', 'Items (¢)', 'Tax (¢)', 'Tip (¢)', 'Total (¢)', 'Owed (¢)'];
    const rows = data.perPerson.map((p) => toCsvRow([
        guestNames[p.guestId] || p.guestId,
        p.itemsTotalCents,
        p.taxCents,
        p.tipCents,
        p.totalCents,
        p.owedToPayerCents
    ]));
    const csv = [toCsvRow(header), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const filename = `receipt-${data.receiptId}-summary.csv`;
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
export function exportComputationJSON(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const filename = `receipt-${data.receiptId}-computation.json`;
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
