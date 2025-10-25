import { createContext, useContext, useMemo, useState } from 'react';
import type { ReceiptParsedData } from '@shared/schemas';

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
};

const WizardContext = createContext<WizardContextValue | undefined>(undefined);

export const WizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [step, setStep] = useState(0);
  const [receiptFile, setReceiptFile] = useState<File>();
  const [guests, setGuests] = useState<GuestInput[]>([]);
  const [parsedData, setParsedData] = useState<ReceiptParsedData>();
  const [payerId, setPayerId] = useState<string>();

  const value = useMemo(
    () => ({ step, setStep, receiptFile, setReceiptFile, guests, setGuests, parsedData, setParsedData, payerId, setPayerId }),
    [step, receiptFile, guests, parsedData, payerId]
  );

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
};

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error('useWizard must be used inside WizardProvider');
  return ctx;
}
