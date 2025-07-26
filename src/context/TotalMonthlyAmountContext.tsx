import React, { useState, useEffect } from "react";
import type { MonthlyAmountContextType } from "../types/types";
import useGetMonthlyExpense from "../hooks/useGetMonthlyExpense";

const TotalMonthlyAmountContext = React.createContext<MonthlyAmountContextType>({total: 0})

const TotalAmountProvider = ({children}: { children: React.ReactNode }) => {
    const [total, changeTotal] = useState<number>(0)
    const expenses = useGetMonthlyExpense()

    useEffect(() => {
        const total = expenses.reduce((acc, expense) => acc + parseFloat(expense.quantity), 0);
        
        changeTotal(total)
        
    }, [expenses])

    return(
        <TotalMonthlyAmountContext.Provider value={{ total }}>
            {children}
        </TotalMonthlyAmountContext.Provider>
    )
}

export {TotalAmountProvider, TotalMonthlyAmountContext}