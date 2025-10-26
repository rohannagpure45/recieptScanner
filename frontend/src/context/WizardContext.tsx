import { createContext, useContext, useMemo, useState } from 'react';
import type { ReceiptParsedData, ComputationOutput } from '@shared/schemas';
import type { TaxMode, TipMode } from '../lib/compute';

export type GuestInput = {
  id: string;
  name: string;
  email?: string;
};

type WizardContextValue = {
  step: number;
  setStep: (next: number) => void;
  receiptFile?: File;
  setReceiptFile: (file?: File) => void;
  guests: GuestInput[];
  setGuests: (guests: GuestInput[]) => void;
  parsedData?: ReceiptParsedData;
  setParsedData: (data?: ReceiptParsedData) => void;
  payerId?: string;
  setPayerId: (id?: string) => void;
  assignments: Record<string, string[]>;
  setAssignments: (m: Record<string, string[]>) => void;
  taxMode: TaxMode;
  setTaxMode: (m: TaxMode) => void;
  tipMode: TipMode;
  setTipMode: (m: TipMode) => void;
  tipPercent: number;
  setTipPercent: (n: number) => void;
  computation?: ComputationOutput;
  setComputation: (c?: ComputationOutput) => void;
};

const WizardContext = createContext<WizardContextValue | undefined>(undefined);

export const WizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [step, setStep] = useState(0);
  const [receiptFile, setReceiptFile] = useState<File>();
  const [guests, setGuests] = useState<GuestInput[]>([]);
  const [parsedData, setParsedData] = useState<ReceiptParsedData>();
  const [payerId, setPayerId] = useState<string>();
  const [assignments, setAssignments] = useState<Record<string, string[]>>({});
  const [taxMode, setTaxMode] = useState<TaxMode>('proportional');
  const [tipMode, setTipMode] = useState<TipMode>('fixed');
  const [tipPercent, setTipPercent] = useState<number>(15);
  const [computation, setComputation] = useState<ComputationOutput>();

  const value = useMemo(
    () => ({
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
    }),
    [step, receiptFile, guests, parsedData, payerId, assignments, taxMode, tipMode, tipPercent, computation]
  );

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
};

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error('useWizard must be used inside WizardProvider');
  return ctx;
}
