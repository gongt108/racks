import { createContext, useContext, useState, ReactNode } from 'react';

type PricingContextType = {
  markupValue: number | '';
  isPercentage: boolean;
  setMarkupValue: (value: number | '') => void;
  setIsPercentage: (value: boolean) => void;
};

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export const PricingProvider = ({ children }: { children: ReactNode }) => {
  const [markupValue, setMarkupValue] = useState<number | ''>('');
  const [isPercentage, setIsPercentage] = useState(true);

  return (
    <PricingContext.Provider value={{ markupValue, isPercentage, setMarkupValue, setIsPercentage }}>
      {children}
    </PricingContext.Provider>
  );
};

// Custom hook for convenience
export const usePricing = () => {
  const context = useContext(PricingContext);
  if (!context) throw new Error('usePricing must be used within a PricingProvider');
  return context;
};
