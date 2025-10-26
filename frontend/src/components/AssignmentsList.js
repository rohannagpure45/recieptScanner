import { jsx as _jsx } from "react/jsx-runtime";
import { useWizard } from '../context/WizardContext';
import { AssignItem } from './AssignItem';
export function AssignmentsList() {
    const { parsedData } = useWizard();
    if (!parsedData)
        return null;
    return (_jsx("div", { className: "space-y-3", children: parsedData.lineItems.map((item) => (_jsx(AssignItem, { lineItemId: item.id, lineItemName: item.name, lineItemTotalCents: item.totalCents }, item.id))) }));
}
