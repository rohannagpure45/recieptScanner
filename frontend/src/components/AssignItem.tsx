import { useWizard } from '../context/WizardContext';

type AssignItemProps = {
  lineItemId: string;
  lineItemName: string;
  lineItemTotalCents: number;
};

export function AssignItem({ lineItemId, lineItemName, lineItemTotalCents }: AssignItemProps) {
  const { guests, assignments, setAssignments } = useWizard();

  const selected = new Set(assignments[lineItemId] ?? []);

  const toggle = (guestId: string) => {
    const next = new Set(assignments[lineItemId] ?? []);
    if (next.has(guestId)) next.delete(guestId);
    else next.add(guestId);
    setAssignments({ ...assignments, [lineItemId]: Array.from(next) });
  };

  const perPerson = selected.size > 0 ? Math.floor(lineItemTotalCents / selected.size) : 0;

  return (
    <div className="rounded-lg border border-slate-800 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-200">{lineItemName}</p>
        <p className="text-xs text-slate-400">{(lineItemTotalCents / 100).toFixed(2)} total</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {guests.map((g) => (
          <label key={g.id} className="inline-flex items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-700 bg-slate-900"
              checked={selected.has(g.id)}
              onChange={() => toggle(g.id)}
            />
            {g.name || 'Unnamed'}
          </label>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-500">
        {selected.size > 0 ? `Split equally among ${selected.size} — ~${(perPerson / 100).toFixed(2)} each` : 'Select one or more people'}
      </p>
    </div>
  );
}

