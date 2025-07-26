// context/BalanceContext.ts
import { createContext } from 'react';

interface BalanceContextType {
  balance: number;
  totalIncome: number; // Only from budget income entries
  totalExpenses: number; // Budget expenses + Monthly expenses combined
  totalBudgetExpenses: number;
  totalMonthlyExpenses: number;
}

export const BalanceContext = createContext<BalanceContextType>({
  balance: 0,
  totalIncome: 0,
  totalExpenses: 0,
  totalBudgetExpenses: 0,
  totalMonthlyExpenses: 0
});

export type { BalanceContextType };