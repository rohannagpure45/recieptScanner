import { motion } from 'framer-motion';

interface LoadingOverlayProps {
  message?: string;
  estimatedTime?: number; // seconds
}

/**
 * LoadingOverlay component that displays a loading state with progress indication.
 * 
 * Note: This component must be wrapped in AnimatePresence from framer-motion
 * for exit animations to work properly when the component is unmounted.
 */
export function LoadingOverlay({ message = 'Processing receipt...', estimatedTime }: LoadingOverlayProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="loading-title"
      aria-busy="true"
      aria-live="polite"
    >
      <motion.div
        className="glass-card p-8 max-w-md mx-4 text-center"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <motion.div
          className="mb-6 flex justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <div className="rounded-full bg-brand/20 p-4 animate-pulse-glow">
            <svg
              className="h-12 w-12 text-brand"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </motion.div>

        <h3 id="loading-title" className="mb-2 text-lg font-semibold text-slate-200">{message}</h3>
        <p className="text-sm text-slate-400 mb-4">
          {estimatedTime ? `Estimated time: ${estimatedTime}s` : 'This may take a few moments...'}
        </p>

        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-brand"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: estimatedTime || 5, ease: 'linear' }}
          />
        </div>

        <p className="mt-6 text-xs text-slate-500">
          Tip: Make sure your receipt is clear and well-lit for best results
        </p>
      </motion.div>
    </motion.div>
  );
}

