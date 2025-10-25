import { ParsedItemsTable } from '../components/ParsedItemsTable';
import { PayerSelector } from '../components/PayerSelector';
import { useWizard } from '../context/WizardContext';

export default function MatchPage() {
  const { setStep, guests } = useWizard();

  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-widest text-slate-400">Step 2 of 3</p>
        <h1 className="text-2xl font-semibold">Match Items to Guests</h1>
      </header>
      <ParsedItemsTable />
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <p className="text-sm text-slate-400">Assignment UI TBD — map each item to one or more guests here.</p>
        <p className="text-xs text-slate-500">Guests added: {guests.length}</p>
      </div>
      <PayerSelector />
      <div className="flex justify-between">
        <button className="btn-secondary" onClick={() => setStep(0)}>
          Back
        </button>
        <button className="btn-primary" onClick={() => setStep(2)}>
          Continue
        </button>
      </div>
    </section>
  );
}
