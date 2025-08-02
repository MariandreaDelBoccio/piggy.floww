import { useEffect, useState } from "react"; 
import useGetMonthlyExpense from "./useGetMonthlyExpense";
import type { CategoryKey, ExpensesByCategory } from "../types/types";

const useGetExpenseByCat = () => {
    const [expensesByCat, changeExpensesByCat] = useState<ExpensesByCategory>([]);
    
    // Destructure the new return structure from useGetMonthlyExpense
    const { expense: expenses, monthBoundaries, userSettings } = useGetMonthlyExpense();
    
    useEffect(() => {
        const total = expenses.reduce((acc, expense) => {
            const currentCat = expense.category as CategoryKey;
            const currentQty = parseFloat(expense.quantity);
    
            acc[currentCat] += currentQty;
    
            return acc;
        }, {
            'food': 0,
            'debt': 0,
            'home': 0,
            'transport': 0,
            'clothes': 0,
            'health': 0,
            'shopping': 0,
            'fun': 0
        } as Record<CategoryKey, number>);
    
        const data: ExpensesByCategory = Object.keys(total).map((key) => ({
            category: key as CategoryKey,
            quantity: total[key as CategoryKey]
        }));
    
        changeExpensesByCat(data);
    }, [expenses]);
    
    // Optionally return additional information
    return {
        expensesByCat,
        monthBoundaries,
        userSettings,
        // Helper to get period info
        currentPeriod: monthBoundaries ? {
            start: new Date(monthBoundaries.startMonth * 1000),
            end: new Date(monthBoundaries.endMonth * 1000)
        } : null
    };
};

export default useGetExpenseByCat;