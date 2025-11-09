import { nanoid } from 'nanoid';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWizard } from '../context/WizardContext';
import { GuestChip } from './GuestChip';
import { EmptyState } from './EmptyState';
import { staggerContainer, fadeInUp } from '../lib/animations';

function getInitials(name: string): string {
  if (!name.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getGuestColor(id: string): string {
  const colors = [
    'bg-purple-500/20 text-purple-300 border-purple-500/50',
    'bg-blue-500/20 text-blue-300 border-blue-500/50',
    'bg-green-500/20 text-green-300 border-green-500/50',
    'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    'bg-pink-500/20 text-pink-300 border-pink-500/50',
    'bg-indigo-500/20 text-indigo-300 border-indigo-500/50',
    'bg-red-500/20 text-red-300 border-red-500/50',
    'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function validateEmail(email: string): boolean {
  if (!email.trim()) return true; // Optional field
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function GuestsList() {
  const { guests, setGuests } = useWizard();
  const [emailErrors, setEmailErrors] = useState<Record<string, boolean>>({});

  const updateGuest = (id: string, key: 'name' | 'email', value: string) => {
    setGuests(guests.map((guest) => (guest.id === id ? { ...guest, [key]: value } : guest)));
    
    if (key === 'email') {
      setEmailErrors((prev) => ({
        ...prev,
        [id]: value.trim() ? !validateEmail(value) : false
      }));
    }
  };

  const addGuest = () => {
    setGuests([...guests, { id: nanoid(), name: '', email: '' }]);
  };

  const removeGuest = (id: string) => {
    setGuests(guests.filter((guest) => guest.id !== id));
    setEmailErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-200">Guests</h2>
        <motion.button
          type="button"
          className="btn-secondary touch-target"
          onClick={addGuest}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Add new guest"
        >
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Person
          </span>
        </motion.button>
      </div>

      <AnimatePresence mode="popLayout">
        {guests.length === 0 ? (
          <EmptyState
            icon={
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            title="No guests yet"
            description="Add at least one guest to continue with the receipt split."
            action={
              <button className="btn-primary" onClick={addGuest}>
                Add First Guest
              </button>
            }
          />
        ) : (
          <motion.div
            className="space-y-3"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {guests.map((guest) => {
              const colorClass = getGuestColor(guest.id);
              const initials = getInitials(guest.name);
              const hasEmailError = emailErrors[guest.id];

              return (
                <motion.div
                  key={guest.id}
                  className="glass-card p-4"
                  variants={fadeInUp}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold ${colorClass}`}>
                      {initials}
                    </div>
                    <div className="flex-1 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                      <div>
                        <label className="sr-only" htmlFor={`guest-name-${guest.id}`}>
                          Guest name
                        </label>
                        <input
                          id={`guest-name-${guest.id}`}
                          type="text"
                          value={guest.name}
                          onChange={(e) => updateGuest(guest.id, 'name', e.target.value)}
                          placeholder="Name"
                          className="input w-full touch-target"
                          aria-required="true"
                        />
                      </div>
                      <div>
                        <label className="sr-only" htmlFor={`guest-email-${guest.id}`}>
                          Guest email (optional)
                        </label>
                        <div className="relative">
                          <input
                            id={`guest-email-${guest.id}`}
                            type="email"
                            value={guest.email || ''}
                            onChange={(e) => updateGuest(guest.id, 'email', e.target.value)}
                            placeholder="Email (optional)"
                            className={`input w-full touch-target ${
                              hasEmailError ? 'border-error focus:ring-error' : ''
                            }`}
                            aria-invalid={hasEmailError}
                            aria-describedby={hasEmailError ? `email-error-${guest.id}` : undefined}
                          />
                          {hasEmailError && (
                            <motion.p
                              id={`email-error-${guest.id}`}
                              className="mt-1 text-xs text-error"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              role="alert"
                            >
                              Invalid email format
                            </motion.p>
                          )}
                        </div>
                      </div>
                      <motion.button
                        type="button"
                        className="btn-secondary text-error border-error/50 hover:bg-error/10 touch-target"
                        onClick={() => removeGuest(guest.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={`Remove ${guest.name || 'guest'}`}
                      >
                        <span className="flex items-center gap-1">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
