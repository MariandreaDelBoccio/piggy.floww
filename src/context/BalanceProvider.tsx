// context/BalanceProvider.tsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import useGetMonthlyExpense from '../hooks/useGetMonthlyExpense';
import useAuth from '../context/useAuth';
import { BalanceContext } from './BalanceContext';

type BudgetEntry = {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string;
  expenseType?: "fixed" | "variable";
  createdAt: Timestamp;
};

export const BalanceProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  // Budget entries from Firebase
  const [budgetEntries, setBudgetEntries] = useState<BudgetEntry[]>([]);
  
  // Monthly expenses from hook (no monthly income needed)
  const monthlyExpenses = useGetMonthlyExpense();
  
  // Calculated totals
  const [totalIncome, setTotalIncome] = useState<number>(0); // Only budget income
  const [totalBudgetExpenses, setTotalBudgetExpenses] = useState<number>(0);
  const [totalMonthlyExpenses, setTotalMonthlyExpenses] = useState<number>(0);

  // Fetch budget entries from Firebase
  useEffect(() => {
    if (!user) return;
    
    const q = query(
      collection(db, "budget"),
      where("userId", "==", user.uid)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BudgetEntry[];
      setBudgetEntries(entries);
    });

    return () => unsubscribe();
  }, [user]);

  // Calculate budget totals
  useEffect(() => {
    const budgetIncome = budgetEntries
      .filter((entry) => entry.type === "income")
      .reduce((acc, entry) => acc + entry.amount, 0);
    
    const budgetExpenses = budgetEntries
      .filter((entry) => entry.type === "expense")
      .reduce((acc, entry) => acc + entry.amount, 0);
    
    setTotalIncome(budgetIncome); // Only budget income counts as income
    setTotalBudgetExpenses(budgetExpenses);
  }, [budgetEntries]);

  // Calculate monthly expenses total
  useEffect(() => {
    const monthlyExpensesTotal = monthlyExpenses.reduce(
      (acc, expense) => acc + parseFloat(expense.quantity), 
      0
    );
    setTotalMonthlyExpenses(monthlyExpensesTotal);
  }, [monthlyExpenses]);

  // Calculate final totals and balance
  const totalExpenses = totalBudgetExpenses + totalMonthlyExpenses; // Combined expenses
  const balance = totalIncome - totalExpenses; // Income - (Budget Expenses + Monthly Expenses)

  return (
    <BalanceContext.Provider value={{
      balance,
      totalIncome,
      totalExpenses,
      totalBudgetExpenses,
      totalMonthlyExpenses
    }}>
      {children}
    </BalanceContext.Provider>
  );
};