import { useWizard } from '../context/WizardContext';
import type { ParsedReceipt } from '@shared/schemas';
import { AssignItem } from './AssignItem';

export function AssignmentsList() {
  const { parsedData } = useWizard();
  if (!parsedData || !Array.isArray((parsedData as any).lineItems)) return null;

  return (
    <div className="space-y-3">
      {parsedData.lineItems.map((item: ParsedReceipt['lineItems'][number]) => (
        <AssignItem key={item.id} lineItemId={item.id} lineItemName={item.name} lineItemTotalCents={item.totalCents} />
      ))}
    </div>
  );
}
