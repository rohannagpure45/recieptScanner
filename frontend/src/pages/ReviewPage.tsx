import { SummaryCard } from '../components/SummaryCard';
import { DebtsTable } from '../components/DebtsTable';
import { ExportButtons } from '../components/ExportButtons';
import { useWizard } from '../context/WizardContext';

export default function ReviewPage() {
  const { setStep, computation } = useWizard();

  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-widest text-slate-400">Step 3 of 3</p>
        <h1 className="text-2xl font-semibold">Review & Send</h1>
      </header>
      {!computation && <p className="text-sm text-yellow-400">Missing computation — go back and complete assignments.</p>}
      {computation && (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            {computation.perPerson.map((person: typeof computation.perPerson[number]) => (
              <SummaryCard key={person.guestId} person={person} />
            ))}
          </div>
          <DebtsTable data={computation} />
        </>
      )}
      <ExportButtons />
      <div className="flex justify-between">
        <button className="btn-secondary" onClick={() => setStep(1)}>
          Back
        </button>
        <button className="btn-primary" onClick={() => setStep(0)}>Finish</button>
      </div>
    </section>
  );
}
