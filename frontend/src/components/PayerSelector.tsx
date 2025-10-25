import { useWizard } from '../context/WizardContext';

export function PayerSelector() {
  const { guests, payerId, setPayerId } = useWizard();

  return (
    <label className="block text-sm text-slate-200">
      Payer
      <select
        className="mt-2 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2"
        value={payerId ?? ''}
        onChange={(event) => setPayerId(event.target.value || undefined)}
      >
        <option value="">Select who paid</option>
        {guests.map((guest) => (
          <option key={guest.id} value={guest.id}>
            {guest.name || 'Unnamed guest'}
          </option>
        ))}
      </select>
    </label>
  );
}
