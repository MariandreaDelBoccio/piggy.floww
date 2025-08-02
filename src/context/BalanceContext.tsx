// context/BalanceContext.ts
import { createContext } from 'react';
import type { BalanceContextType } from '../types/types';

export const BalanceContext = createContext<BalanceContextType>({
  balance: 0,
  totalIncome: 0,
  totalExpenses: 0,
  totalBudgetExpenses: 0,
  totalMonthlyExpenses: 0
});

export type { BalanceContextType };