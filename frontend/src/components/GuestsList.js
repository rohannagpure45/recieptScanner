import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { nanoid } from 'nanoid';
import { useWizard } from '../context/WizardContext';
export function GuestsList() {
    const { guests, setGuests } = useWizard();
    const updateGuest = (id, key, value) => {
        setGuests(guests.map((guest) => (guest.id === id ? { ...guest, [key]: value } : guest)));
    };
    const addGuest = () => {
        setGuests([...guests, { id: nanoid(), name: '', email: '' }]);
    };
    const removeGuest = (id) => {
        setGuests(guests.filter((guest) => guest.id !== id));
    };
    return (_jsxs("div", { className: "rounded-xl border border-slate-800 bg-slate-900/40 p-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Guests" }), _jsx("button", { className: "btn-secondary", onClick: addGuest, children: "Add Person" })] }), _jsxs("div", { className: "mt-4 space-y-3", children: [guests.map((guest) => (_jsxs("div", { className: "grid gap-3 rounded-lg border border-slate-800 p-3 md:grid-cols-[1fr_1fr_auto]", children: [_jsx("input", { value: guest.name, onChange: (e) => updateGuest(guest.id, 'name', e.target.value), placeholder: "Name", className: "input" }), _jsx("input", { value: guest.email, onChange: (e) => updateGuest(guest.id, 'email', e.target.value), placeholder: "Email (optional)", className: "input" }), _jsx("button", { className: "text-sm text-red-400", onClick: () => removeGuest(guest.id), children: "Remove" })] }, guest.id))), guests.length === 0 && _jsx("p", { className: "text-sm text-slate-400", children: "Add at least one guest to continue." })] })] }));
}
