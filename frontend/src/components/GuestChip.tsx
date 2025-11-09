import { motion } from 'framer-motion';
import { useWizard } from '../context/WizardContext';

// Generate consistent colors for guests based on their ID
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
  
  // Simple hash function to get consistent color for same ID
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string): string {
  if (!name.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface GuestChipProps {
  guestId: string;
  name: string;
  isSelected: boolean;
  onToggle: () => void;
  showCheckmark?: boolean;
}

export function GuestChip({ guestId, name, isSelected, onToggle, showCheckmark = true }: GuestChipProps) {
  const colorClass = getGuestColor(guestId);
  const initials = getInitials(name);

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      className={`group relative inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200 touch-target ${
        isSelected
          ? `${colorClass} shadow-md scale-105`
          : 'bg-slate-800/50 text-slate-300 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-pressed={isSelected}
      aria-label={`${isSelected ? 'Unassign' : 'Assign'} ${name}`}
    >
      <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
        isSelected ? 'bg-white/20' : 'bg-slate-700'
      }`}>
        {initials}
      </div>
      <span className="max-w-[120px] truncate">{name || 'Unnamed'}</span>
      {isSelected && showCheckmark && (
        <motion.svg
          className="h-4 w-4 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </motion.svg>
      )}
    </motion.button>
  );
}

