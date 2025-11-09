import { useWizard } from '../context/WizardContext';
import { GuestChip } from './GuestChip';
import { motion } from 'framer-motion';

type AssignItemProps = {
  lineItemId: string;
  lineItemName: string;
  lineItemTotalCents: number;
};

export function AssignItem({ lineItemId, lineItemName, lineItemTotalCents }: AssignItemProps) {
  const { guests, assignments, setAssignments } = useWizard();

  const selected = new Set(assignments[lineItemId] ?? []);
  const selectedIds = Array.from(selected);

  const toggle = (guestId: string) => {
    setAssignments((prev) => {
      const next = new Set(prev[lineItemId] ?? []);
      if (next.has(guestId)) next.delete(guestId);
      else next.add(guestId);
      return { ...prev, [lineItemId]: Array.from(next) };
    });
  };

  const splitSharesCents = selectedIds.length
    ? (() => {
        const base = Math.floor(lineItemTotalCents / selectedIds.length);
        const remainder = lineItemTotalCents % selectedIds.length;
        return selectedIds.map((_, index) => base + (index < remainder ? 1 : 0));
      })()
    : [];

  const allEqual =
    splitSharesCents.length > 0 && splitSharesCents.every((v) => v === splitSharesCents[0]);

  return (
    <motion.div
      className={`glass-card p-4 transition-all duration-200 ${
        selectedIds.length === 0 ? 'border-warning/50 bg-warning/5' : ''
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-base font-semibold text-slate-200">{lineItemName}</p>
        <p className="text-lg font-bold text-slate-100">${(lineItemTotalCents / 100).toFixed(2)}</p>
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        {guests.map((g) => (
          <GuestChip
            key={g.id}
            guestId={g.id}
            name={g.name}
            isSelected={selected.has(g.id)}
            onToggle={() => toggle(g.id)}
          />
        ))}
      </div>
      {selectedIds.length > 0 && (
        <motion.p
          className="text-xs text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {allEqual
            ? `Split equally among ${selectedIds.length} — $${(splitSharesCents[0] / 100).toFixed(2)} each`
            : `Split among ${selectedIds.length} — ${splitSharesCents.map((c) => `$${(c / 100).toFixed(2)}`).join(', ')}`}
        </motion.p>
      )}
      {selectedIds.length === 0 && (
        <p className="text-xs text-warning">Select one or more people to assign this item</p>
      )}
    </motion.div>
  );
}
