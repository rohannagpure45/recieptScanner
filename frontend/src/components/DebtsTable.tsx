import { motion } from 'framer-motion';
import type { ComputationOutput } from '@shared/schemas';
import { useWizard } from '../context/WizardContext';

export function DebtsTable({ data }: { data: ComputationOutput }) {
  const { guests } = useWizard();
  const nameFor = (id: string) => guests.find((g) => g.id === id)?.name || id;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 glass-card">
      <table className="min-w-full text-sm text-slate-200" aria-label="Debts breakdown">
        <thead className="bg-slate-900/50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-slate-200">Guest</th>
            <th className="px-4 py-3 text-right font-semibold text-slate-200">Owes</th>
          </tr>
        </thead>
        <tbody>
          {data.perPerson.map((person: ComputationOutput['perPerson'][number], index: number) => (
            <motion.tr
              key={person.guestId}
              className="border-t border-slate-800"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <td className="px-4 py-3 font-medium">{nameFor(person.guestId)}</td>
              <td className="px-4 py-3 text-right">
                {person.owedToPayerCents > 0 ? (
                  <span className="font-semibold text-warning">${(person.owedToPayerCents / 100).toFixed(2)}</span>
                ) : (
                  <span className="text-slate-500">—</span>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
