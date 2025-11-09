import { motion } from 'framer-motion';
import { ParsedItemsTable } from '../components/ParsedItemsTable';
import { AssignmentsList } from '../components/AssignmentsList';
import { PayerSelector } from '../components/PayerSelector';
import { useWizard } from '../context/WizardContext';
import { computeSplit } from '../lib/compute';

export default function MatchPage() {
  const {
    setStep,
    guests,
    parsedData,
    payerId,
    assignments,
    taxMode,
    setTaxMode,
    tipMode,
    setTipMode,
    tipPercent,
    setTipPercent,
    setComputation
  } = useWizard();

  const allAssigned = Boolean(
    parsedData &&
      Array.isArray(parsedData.lineItems) &&
      parsedData.lineItems.length > 0 &&
      parsedData.lineItems.every((li: { id: string }) => (assignments[li.id] ?? []).length > 0)
  );
  const canContinue = Boolean(parsedData && payerId && guests.length > 0 && allAssigned);

  const onContinue = () => {
    if (!parsedData || !payerId) return;
    const result = computeSplit({
      receipt: parsedData,
      guestIds: guests.map((g) => g.id),
      assignments,
      payerId,
      taxMode,
      tipMode,
      tipPercent
    });
    setComputation(result);
    setStep(2);
  };

  return (
    <motion.section
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <header>
        <p className="text-sm uppercase tracking-widest text-slate-400">Step 2 of 3</p>
        <h1 className="text-2xl font-semibold text-slate-200">Match Items to Guests</h1>
        <p className="mt-2 text-sm text-slate-400">
          Assign each receipt item to the people who shared it. Select who paid the bill.
        </p>
      </header>

      <ParsedItemsTable />

      <div className="card">
        <h2 className="mb-4 text-lg font-semibold text-slate-200">Item Assignments</h2>
        <AssignmentsList />
      </div>

      <div className="card">
        <h2 className="mb-4 text-lg font-semibold text-slate-200">Tax & Tip Settings</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-200">
            <span className="mb-2 block font-medium">Tax Mode</span>
            <select
              className="input w-full touch-target"
              value={taxMode}
              onChange={(e) => setTaxMode(e.target.value as any)}
              aria-label="Tax distribution mode"
            >
              <option value="proportional">Proportional to items</option>
              <option value="even">Split evenly</option>
            </select>
          </label>
          <label className="block text-sm text-slate-200">
            <span className="mb-2 block font-medium">Tip Mode</span>
            <select
              className="input w-full touch-target"
              value={tipMode}
              onChange={(e) => setTipMode(e.target.value as any)}
              aria-label="Tip calculation mode"
            >
              <option value="fixed">Use receipt tip</option>
              <option value="percent">Percent of items</option>
            </select>
          </label>
          {tipMode === 'percent' && (
            <label className="block text-sm text-slate-200 sm:col-span-2">
              <span className="mb-2 block font-medium">Tip Percent</span>
              <input
                className="input w-full touch-target"
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={tipPercent}
                onChange={(e) => setTipPercent(Number(e.target.value) || 0)}
                aria-label="Tip percentage"
              />
            </label>
          )}
        </div>
      </div>

      <div className="card">
        <PayerSelector />
      </div>

      {!allAssigned && parsedData && parsedData.lineItems.length > 0 && (
        <motion.div
          className="rounded-lg border border-warning/50 bg-warning/10 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          role="alert"
        >
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-warning">
              Please assign all items to at least one guest before continuing.
            </p>
          </div>
        </motion.div>
      )}

      <div className="flex justify-between pt-4 border-t border-slate-800">
        <motion.button
          className="btn-secondary touch-target"
          onClick={() => setStep(0)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Go back to upload page"
        >
          Back
        </motion.button>
        <motion.button
          className="btn-primary touch-target"
          disabled={!canContinue}
          onClick={onContinue}
          whileHover={canContinue ? { scale: 1.05 } : {}}
          whileTap={canContinue ? { scale: 0.95 } : {}}
          aria-label={canContinue ? 'Continue to review' : 'Complete all assignments and select payer'}
        >
          {canContinue ? 'Continue' : 'Assign all items and choose a payer'}
        </motion.button>
      </div>
    </motion.section>
  );
}
