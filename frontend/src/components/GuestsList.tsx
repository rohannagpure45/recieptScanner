import { nanoid } from 'nanoid';
import { useWizard } from '../context/WizardContext';

export function GuestsList() {
  const { guests, setGuests } = useWizard();

  const updateGuest = (id: string, key: 'name' | 'email', value: string) => {
    setGuests(guests.map((guest) => (guest.id === id ? { ...guest, [key]: value } : guest)));
  };

  const addGuest = () => {
    setGuests([...guests, { id: nanoid(), name: '', email: '' }]);
  };

  const removeGuest = (id: string) => {
    setGuests(guests.filter((guest) => guest.id !== id));
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Guests</h2>
        <button className="btn-secondary" onClick={addGuest}>
          Add Person
        </button>
      </div>
      <div className="mt-4 space-y-3">
        {guests.map((guest) => (
          <div key={guest.id} className="grid gap-3 rounded-lg border border-slate-800 p-3 md:grid-cols-[1fr_1fr_auto]">
            <input
              value={guest.name}
              onChange={(e) => updateGuest(guest.id, 'name', e.target.value)}
              placeholder="Name"
              className="input"
            />
            <input
              value={guest.email}
              onChange={(e) => updateGuest(guest.id, 'email', e.target.value)}
              placeholder="Email (optional)"
              className="input"
            />
            <button className="text-sm text-red-400" onClick={() => removeGuest(guest.id)}>
              Remove
            </button>
          </div>
        ))}
        {guests.length === 0 && <p className="text-sm text-slate-400">Add at least one guest to continue.</p>}
      </div>
    </div>
  );
}
