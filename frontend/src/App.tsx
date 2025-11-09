import { AnimatePresence } from 'framer-motion';
import UploadPage from './pages/UploadPage';
import MatchPage from './pages/MatchPage';
import ReviewPage from './pages/ReviewPage';
import { WizardStepper } from './components/WizardStepper';
import { useWizard } from './context/WizardContext';
import { pageTransition } from './lib/animations';
import { motion } from 'framer-motion';

const steps = [UploadPage, MatchPage, ReviewPage];

export default function App() {
  const { step } = useWizard();
  const StepComponent = steps[step] ?? UploadPage;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100" role="main">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <WizardStepper />
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <StepComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
