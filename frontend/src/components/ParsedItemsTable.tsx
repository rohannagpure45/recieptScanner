import { useWizard } from '../context/WizardContext';
import type { ParsedReceipt } from '@shared/schemas';

export function ParsedItemsTable() {
  const { parsedData } = useWizard();

  if (!parsedData) {
    return <p className="text-sm text-slate-400">Awaiting extraction results.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="min-w-full text-sm text-slate-200">
        <thead className="bg-slate-900">
          <tr>
            <th className="px-4 py-2 text-left">Item</th>
            <th className="px-4 py-2 text-left">Qty</th>
            <th className="px-4 py-2 text-left">Unit (¢)</th>
            <th className="px-4 py-2 text-left">Total (¢)</th>
          </tr>
        </thead>
        <tbody>
          {parsedData.lineItems.map((item: ParsedReceipt['lineItems'][number]) => (
            <tr key={item.id} className="border-t border-slate-800">
              <td className="px-4 py-2">
                <input className="input w-full" value={item.name} readOnly />
              </td>
              <td className="px-4 py-2">
                <input className="input w-24 text-center" type="number" value={item.quantity} readOnly />
              </td>
              <td className="px-4 py-2">
                <input className="input w-28" value={item.unitPriceCents} readOnly />
              </td>
              <td className="px-4 py-2">
                <input className="input w-28" value={item.totalCents} readOnly />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
