import React, { createContext, useContext, useEffect, useState } from 'react';

interface CreditContextType {
  credits: number;
  useCredit: () => boolean;
  addCredits: (amount: number) => void;
}

const CreditContext = createContext<CreditContextType | undefined>(undefined);

export const CreditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [credits, setCredits] = useState<number>(() => {
    const saved = localStorage.getItem('portfolio_credits');
    return saved !== null ? parseInt(saved, 10) : 10;
  });

  useEffect(() => {
    localStorage.setItem('portfolio_credits', credits.toString());
  }, [credits]);

  const useCredit = () => {
    if (credits > 0) {
      setCredits(prev => prev - 1);
      return true;
    }
    return false;
  };

  const addCredits = (amount: number) => {
    setCredits(prev => Math.min(prev + amount, 100));
  };

  return (
    <CreditContext.Provider value={{ credits, useCredit, addCredits }}>
      {children}
    </CreditContext.Provider>
  );
};

export const useCredits = () => {
  const context = useContext(CreditContext);
  if (context === undefined) {
    throw new Error('useCredits must be used within a CreditProvider');
  }
  return context;
};
