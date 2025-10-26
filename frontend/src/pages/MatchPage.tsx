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
    <section className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-widest text-slate-400">Step 2 of 3</p>
        <h1 className="text-2xl font-semibold">Match Items to Guests</h1>
      </header>
      <ParsedItemsTable />
      <AssignmentsList />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm text-slate-200">
          Tax Mode
          <select className="mt-1 input" value={taxMode} onChange={(e) => setTaxMode(e.target.value as any)}>
            <option value="proportional">Proportional to items</option>
            <option value="even">Split evenly</option>
          </select>
        </label>
        <label className="block text-sm text-slate-200">
          Tip Mode
          <select className="mt-1 input" value={tipMode} onChange={(e) => setTipMode(e.target.value as any)}>
            <option value="fixed">Use receipt tip</option>
            <option value="percent">Percent of items</option>
          </select>
        </label>
        {tipMode === 'percent' && (
          <label className="block text-sm text-slate-200">
            Tip Percent
            <input className="mt-1 input" type="number" min={0} max={100} value={tipPercent} onChange={(e) => setTipPercent(Number(e.target.value) || 0)} />
          </label>
        )}
      </div>
      <PayerSelector />
      <div className="flex justify-between">
        <button className="btn-secondary" onClick={() => setStep(0)}>
          Back
        </button>
        <button className="btn-primary" disabled={!canContinue} onClick={onContinue}>
          {canContinue ? 'Continue' : 'Assign all items and choose a payer'}
        </button>
      </div>
    </section>
  );
}
