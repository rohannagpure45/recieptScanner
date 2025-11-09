import { useWizard } from '../context/WizardContext';
import { motion } from 'framer-motion';

const steps = [
  { id: 0, label: 'Upload', shortLabel: 'Upload' },
  { id: 1, label: 'Match', shortLabel: 'Match' },
  { id: 2, label: 'Review', shortLabel: 'Review' }
];

export function WizardStepper() {
  const { step, setStep } = useWizard();

  return (
    <nav className="mb-8" aria-label="Progress">
      <ol className="flex items-center justify-center gap-2 sm:gap-4" role="list">
        {steps.map((stepItem, index) => {
          const isActive = step === stepItem.id;
          const isCompleted = step > stepItem.id;
          const isClickable = stepItem.id < step;

          return (
            <li key={stepItem.id} className="flex items-center flex-1">
              <div className="flex items-center flex-1">
                <button
                  type="button"
                  onClick={() => isClickable && setStep(stepItem.id)}
                  disabled={!isClickable}
                  className={`group flex flex-col items-center flex-1 touch-target ${
                    isClickable ? 'cursor-pointer' : 'cursor-default'
                  }`}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={`Step ${stepItem.id + 1}: ${stepItem.label}`}
                >
                  <div className="flex items-center w-full">
                    <div className="flex items-center flex-1">
                      <motion.div
                        className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                          isActive
                            ? 'border-brand bg-brand text-white shadow-brand'
                            : isCompleted
                            ? 'border-success bg-success text-white'
                            : 'border-slate-700 bg-slate-900 text-slate-400'
                        }`}
                        whileHover={isClickable ? { scale: 1.1 } : {}}
                        whileTap={isClickable ? { scale: 0.95 } : {}}
                      >
                        {isCompleted ? (
                          <motion.svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </motion.svg>
                        ) : (
                          <span className="text-sm font-semibold">{stepItem.id + 1}</span>
                        )}
                      </motion.div>
                      {index < steps.length - 1 && (
                        <div
                          className={`mx-2 h-0.5 flex-1 transition-colors duration-300 ${
                            isCompleted ? 'bg-success' : 'bg-slate-700'
                          }`}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium transition-colors duration-300 sm:text-sm ${
                      isActive
                        ? 'text-brand'
                        : isCompleted
                        ? 'text-success'
                        : 'text-slate-500'
                    }`}
                  >
                    <span className="hidden sm:inline">{stepItem.label}</span>
                    <span className="sm:hidden">{stepItem.shortLabel}</span>
                  </span>
                </button>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

