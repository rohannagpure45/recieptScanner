import { useWizard } from '../context/WizardContext';
import type { ParsedReceipt } from '@shared/schemas';
import { ItemCard } from './ItemCard';
import { EmptyState } from './EmptyState';
import { motion } from 'framer-motion';
import { staggerContainer } from '../lib/animations';

export function ParsedItemsTable() {
  const { parsedData, assignments } = useWizard();

  if (!parsedData) {
    return (
      <EmptyState
        icon={
          <svg className="h-12 w-12 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
        title="Awaiting extraction results"
        description="Processing your receipt image..."
      />
    );
  }

  if (!parsedData.lineItems || parsedData.lineItems.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
        title="No items found"
        description="We couldn't extract any items from this receipt. Please try uploading a clearer image."
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-200">
          Receipt Items ({parsedData.lineItems.length})
        </h2>
        <p className="text-sm text-slate-400">
          {parsedData.lineItems.filter((item) => (assignments[item.id] ?? []).length > 0).length} assigned
        </p>
      </div>
      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {parsedData.lineItems.map((item: ParsedReceipt['lineItems'][number]) => {
          const isAssigned = (assignments[item.id] ?? []).length > 0;
          return <ItemCard key={item.id} item={item} isAssigned={isAssigned} />;
        })}
      </motion.div>
    </div>
  );
}
