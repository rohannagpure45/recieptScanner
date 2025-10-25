import { useMemo } from 'react';
import { SummaryCard } from '../components/SummaryCard';
import { DebtsTable } from '../components/DebtsTable';
import { ExportButtons } from '../components/ExportButtons';
import { useWizard } from '../context/WizardContext';

export default function ReviewPage() {
  const { setStep } = useWizard();
  const mockComputation = useMemo(() => ({
    receiptId: 'preview',
    payerId: 'payer',
    tipMode: 'fixed' as const,
    perPerson: [
      {
        guestId: 'guest-1',
        items: [],
        itemsTotalCents: 1234,
        taxCents: 100,
        tipCents: 150,
        totalCents: 1484,
        amountPaidCents: 0,
        owedToPayerCents: 1484
      }
    ],
    totals: {
      subtotalCents: 1234,
      taxCents: 100,
      tipCents: 150,
      grandTotalCents: 1484
    },
    rounding: {
      residualCents: 0,
      distribution: []
    }
  }), []);

  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-widest text-slate-400">Step 3 of 3</p>
        <h1 className="text-2xl font-semibold">Review & Send</h1>
      </header>
      <div className="grid gap-4 lg:grid-cols-3">
        {mockComputation.perPerson.map((person) => (
          <SummaryCard key={person.guestId} person={person} />
        ))}
      </div>
      <DebtsTable data={mockComputation} />
      <ExportButtons />
      <div className="flex justify-between">
        <button className="btn-secondary" onClick={() => setStep(1)}>
          Back
        </button>
        <button className="btn-primary">Finish</button>
      </div>
    </section>
  );
}
