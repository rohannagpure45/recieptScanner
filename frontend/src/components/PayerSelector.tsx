import { useWizard } from '../context/WizardContext';

export function PayerSelector() {
  const { guests, payerId, setPayerId } = useWizard();

  return (
    <label className="block text-sm text-slate-200">
      <span className="mb-2 block font-medium">Who paid for this receipt?</span>
      <select
        className="input w-full touch-target"
        value={payerId ?? ''}
        onChange={(event) => setPayerId(event.target.value || undefined)}
        required
      >
        <option value="">Select who paid</option>
        {guests.map((guest) => (
          <option key={guest.id} value={guest.id}>
            {guest.name || 'Unnamed guest'}
          </option>
        ))}
      </select>
      <p className="mt-2 text-xs text-slate-400">
        This person will receive payments from others based on the split calculation.
      </p>
    </label>
  );
}
