import { useEffect, useState } from "react"; 
import useGetMonthlyExpense from "./useGetMonthlyExpense";
import type { CategoryKey, ExpensesByCategory } from "../types/types";

const useGetExpenseByCat = () => {
    const [expensesByCat, changeExpensesByCat] = useState<ExpensesByCategory>([])
    const expenses = useGetMonthlyExpense()
    
    useEffect(() => {
        const total = expenses.reduce((acc, expense) => {
            const currentCat = expense.category as CategoryKey;
            const currentQty = parseFloat(expense.quantity);
    
            acc[currentCat] += currentQty
    
            return acc
        }, {
            'food': 0,
            'debt': 0,
            'home': 0,
            'transport': 0,
            'clothes': 0,
            'health': 0,
            'shopping': 0,
            'fun': 0
        } as Record<CategoryKey, number>)
    
        const data: ExpensesByCategory = Object.keys(total).map((key) => ({
            category: key as CategoryKey,
            quantity: total[key as CategoryKey]
        }));
    
        changeExpensesByCat(data);
    }, [expenses])
    
    return expensesByCat;
    
}

export default useGetExpenseByCat;