import { jsx as _jsx } from "react/jsx-runtime";
import UploadPage from './pages/UploadPage';
import MatchPage from './pages/MatchPage';
import ReviewPage from './pages/ReviewPage';
import { useWizard } from './context/WizardContext';
const steps = [UploadPage, MatchPage, ReviewPage];
export default function App() {
    const { step } = useWizard();
    const StepComponent = steps[step] ?? UploadPage;
    return (_jsx("main", { className: "min-h-screen bg-slate-950 text-slate-100", children: _jsx("div", { className: "mx-auto max-w-5xl px-4 py-6", children: _jsx(StepComponent, {}) }) }));
}
