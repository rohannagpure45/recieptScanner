import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center w-full py-12 px-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {icon && (
        <motion.div
          className="mb-4 text-slate-500"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        >
          {icon}
        </motion.div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-slate-200">{title}</h3>
      {description && <p className="mb-6 max-w-md text-sm text-slate-400">{description}</p>}
      {action && <div>{action}</div>}
    </motion.div>
  );
}

