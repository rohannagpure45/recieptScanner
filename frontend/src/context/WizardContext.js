import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo, useState } from 'react';
const WizardContext = createContext(undefined);
export const WizardProvider = ({ children }) => {
    const [step, setStep] = useState(0);
    const [receiptFile, setReceiptFile] = useState();
    const [guests, setGuests] = useState([]);
    const [parsedData, setParsedData] = useState();
    const [payerId, setPayerId] = useState();
    const [assignments, setAssignments] = useState({});
    const [taxMode, setTaxMode] = useState('proportional');
    const [tipMode, setTipMode] = useState('fixed');
    const [tipPercent, setTipPercent] = useState(15);
    const [computation, setComputation] = useState();
    const value = useMemo(() => ({
        step, setStep,
        receiptFile, setReceiptFile,
        guests, setGuests,
        parsedData, setParsedData,
        payerId, setPayerId,
        assignments, setAssignments,
        taxMode, setTaxMode,
        tipMode, setTipMode,
        tipPercent, setTipPercent,
        computation, setComputation
    }), [step, receiptFile, guests, parsedData, payerId, assignments, taxMode, tipMode, tipPercent, computation]);
    return _jsx(WizardContext.Provider, { value: value, children: children });
};
export function useWizard() {
    const ctx = useContext(WizardContext);
    if (!ctx)
        throw new Error('useWizard must be used inside WizardProvider');
    return ctx;
}
