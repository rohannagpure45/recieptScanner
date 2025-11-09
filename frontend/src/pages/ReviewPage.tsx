import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SummaryCard } from '../components/SummaryCard';
import { DebtsTable } from '../components/DebtsTable';
import { ExportButtons } from '../components/ExportButtons';
import { useWizard } from '../context/WizardContext';
import { staggerContainer } from '../lib/animations';

export default function ReviewPage() {
  const { setStep, computation } = useWizard();

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <motion.section
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <header>
        <p className="text-sm uppercase tracking-widest text-slate-400">Step 3 of 3</p>
        <h1 className="text-2xl font-semibold text-slate-200">Review & Send</h1>
        <p className="mt-2 text-sm text-slate-400">
          Review the split summary and export or send the results to your guests.
        </p>
      </header>

      <AnimatePresence mode="wait">
        {!computation || !Array.isArray(computation.perPerson) || computation.perPerson.length === 0 ? (
          <motion.div
            key="no-computation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-lg border border-warning/50 bg-warning/10 p-4"
            role="alert"
          >
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-warning">Missing computation</p>
                <p className="mt-1 text-xs text-warning/80">Go back and complete assignments to see the review.</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="computation"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-6"
          >
            <div>
              <h2 className="mb-4 text-lg font-semibold text-slate-200">Summary by Person</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(computation.perPerson || []).map((person: typeof computation.perPerson[number], index: number) => (
                  <motion.div
                    key={person.guestId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <SummaryCard person={person} />
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-lg font-semibold text-slate-200">Debts</h2>
              <DebtsTable data={computation} />
            </div>

            <div>
              <h2 className="mb-4 text-lg font-semibold text-slate-200">Export & Share</h2>
              <ExportButtons />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between pt-4 border-t border-slate-800">
        <motion.button
          className="btn-secondary touch-target"
          onClick={() => setStep(1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Go back to match items"
        >
          Back
        </motion.button>
        <motion.button
          className="btn-primary touch-target"
          onClick={() => setStep(0)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Finish and start over"
        >
          Finish
        </motion.button>
      </div>
    </motion.section>
  );
}
