import { motion } from 'framer-motion';
import type { ParsedReceipt } from '@shared/schemas';
import { GuestChip } from './GuestChip';
import { useWizard } from '../context/WizardContext';

interface ItemCardProps {
  item: ParsedReceipt['lineItems'][number];
  isAssigned: boolean;
}

export function ItemCard({ item, isAssigned }: ItemCardProps) {
  const { guests, assignments, setAssignments } = useWizard();
  const selectedIds = new Set(assignments[item.id] ?? []);

  const toggleGuest = (guestId: string) => {
    setAssignments((prev) => {
      const next = new Set(prev[item.id] ?? []);
      if (next.has(guestId)) {
        next.delete(guestId);
      } else {
        next.add(guestId);
      }
      return { ...prev, [item.id]: Array.from(next) };
    });
  };

  const splitSharesCents = selectedIds.size
    ? (() => {
        const base = Math.floor(item.totalCents / selectedIds.size);
        const remainder = item.totalCents % selectedIds.size;
        return Array.from(selectedIds).map((_, index) => base + (index < remainder ? 1 : 0));
      })()
    : [];

  const allEqual = splitSharesCents.length > 0 && splitSharesCents.every((v) => v === splitSharesCents[0]);

  return (
    <motion.div
      className={`glass-card p-4 transition-all duration-200 ${
        isAssigned ? '' : 'border-warning/50 bg-warning/5'
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-semibold text-slate-200 truncate">{item.name}</h4>
          <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-400">
            <span>Qty: {item.quantity}</span>
            <span>•</span>
            <span>Unit: ${(item.unitPriceCents / 100).toFixed(2)}</span>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-lg font-bold text-slate-100">${(item.totalCents / 100).toFixed(2)}</p>
          {!isAssigned && (
            <p className="text-xs text-warning mt-1">Unassigned</p>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800">
        <p className="mb-2 text-xs font-medium text-slate-400">Assign to:</p>
        <div className="flex flex-wrap gap-2">
          {guests.map((guest) => (
            <GuestChip
              key={guest.id}
              guestId={guest.id}
              name={guest.name}
              isSelected={selectedIds.has(guest.id)}
              onToggle={() => toggleGuest(guest.id)}
            />
          ))}
        </div>
        {selectedIds.size > 0 && (
          <motion.p
            className="mt-3 text-xs text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {allEqual
              ? `Split equally among ${selectedIds.size} — $${(splitSharesCents[0] / 100).toFixed(2)} each`
              : `Split among ${selectedIds.size} — ${splitSharesCents.map((c) => `$${(c / 100).toFixed(2)}`).join(', ')}`}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

