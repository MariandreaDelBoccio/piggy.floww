import React, { useState, useEffect } from "react";
import type { MonthlyAmountContextType } from "../types/types";
import useGetMonthlyExpense from "../hooks/useGetMonthlyExpense";

const TotalMonthlyAmountContext = React.createContext<MonthlyAmountContextType>({
    total: 0
});

const TotalAmountProvider = ({ children }: { children: React.ReactNode }) => {
    const [total, changeTotal] = useState<number>(0);
    const { expense, monthBoundaries, userSettings } = useGetMonthlyExpense();

    useEffect(() => {
        const calculatedTotal = expense.reduce((acc, expenseItem) => {
            return acc + parseFloat(expenseItem.quantity);
        }, 0);
        
        changeTotal(calculatedTotal);
        
    }, [expense]);

    return (
        <TotalMonthlyAmountContext.Provider value={{ 
            total,
            monthBoundaries,
            userSettings 
        }}>
            {children}
        </TotalMonthlyAmountContext.Provider>
    );
};

export { TotalAmountProvider, TotalMonthlyAmountContext };