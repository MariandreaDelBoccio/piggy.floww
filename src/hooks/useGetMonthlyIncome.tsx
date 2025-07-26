import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import useAuth from "../context/useAuth";
import {  startOfMonth, endOfMonth } from "date-fns";

interface BudgetEntry {
  id: string;
  amount: number;
  type: "income" | "expense";
  description: string;
  category: string;
  date: number;
  userId: string;
  createdAt: number;
}

const useGetMonthlyIncome = () => {
  const [incomes, setIncomes] = useState<BudgetEntry[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const startMonth = Timestamp.fromDate(startOfMonth(new Date()));
    const endMonth = Timestamp.fromDate(endOfMonth(new Date()));

    const q = query(
      collection(db, 'budget'),
      where('userId', '==', user.uid),
      where('type', '==', 'income'),
      where('createdAt', '>=', startMonth),
      where('createdAt', '<=', endMonth),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BudgetEntry[];
      
      setIncomes(entries);
    }, (error) => {
      console.error('Error fetching monthly incomes:', error);
    });

    return () => unsubscribe();
  }, [user]);

  return incomes;
};

export default useGetMonthlyIncome;
