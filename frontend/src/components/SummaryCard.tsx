import { motion } from 'framer-motion';
import type { ComputationOutput } from '@shared/schemas';
import { useWizard } from '../context/WizardContext';
import { GuestChip } from './GuestChip';

export function SummaryCard({ person }: { person: ComputationOutput['perPerson'][number] }) {
  const { guests, computation } = useWizard();
  const guest = guests.find((g) => g.id === person.guestId);
  const displayName = guest?.name || person.guestId;
  const isPayer = computation?.payerId === person.guestId;

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-200">{displayName}</h3>
        {guest && <GuestChip guestId={guest.id} name={guest.name} isSelected={true} onToggle={() => {}} showCheckmark={false} />}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Items</span>
          <span className="font-medium text-slate-200">${(person.itemsTotalCents / 100).toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Tax</span>
          <span className="font-medium text-slate-200">${(person.taxCents / 100).toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Tip</span>
          <span className="font-medium text-slate-200">${(person.tipCents / 100).toFixed(2)}</span>
        </div>
        <div className="border-t border-slate-800 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-slate-200">Total</span>
            <span className="text-2xl font-bold text-brand">${(person.totalCents / 100).toFixed(2)}</span>
          </div>
        </div>
        {person.owedToPayerCents > 0 && (
          <motion.div
            className="mt-3 rounded-lg bg-warning/10 border border-warning/30 p-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-xs text-warning text-center">
              Owes ${(person.owedToPayerCents / 100).toFixed(2)}
            </p>
          </motion.div>
        )}
        {isPayer && (
          <motion.div
            className="mt-3 rounded-lg bg-success/10 border border-success/30 p-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-xs text-success text-center">Paid the bill</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
