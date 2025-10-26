import type { ComputationOutput } from '@shared/schemas';
import { useWizard } from '../context/WizardContext';

export function SummaryCard({ person }: { person: ComputationOutput['perPerson'][number] }) {
  const { guests } = useWizard();
  const displayName = guests.find((g) => g.id === person.guestId)?.name || person.guestId;
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <h3 className="text-lg font-semibold">Guest: {displayName}</h3>
      <p className="text-sm text-slate-400">Items: {(person.itemsTotalCents / 100).toFixed(2)}</p>
      <p className="text-sm text-slate-400">Tax: {(person.taxCents / 100).toFixed(2)}</p>
      <p className="text-sm text-slate-400">Tip: {(person.tipCents / 100).toFixed(2)}</p>
      <p className="text-sm font-semibold text-slate-100">Total: {(person.totalCents / 100).toFixed(2)}</p>
    </div>
  );
}
