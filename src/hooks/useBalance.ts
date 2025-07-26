// hooks/useBalance.ts
import { useContext } from 'react';
import { BalanceContext } from '../context/BalanceContext';
import type { BalanceContextType } from '../context/BalanceContext';

export const useBalance = (): BalanceContextType => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};