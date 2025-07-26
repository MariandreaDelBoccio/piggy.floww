import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import useAuth from "../context/useAuth";
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";
import { endOfMonth, getUnixTime, startOfMonth } from "date-fns";
import type { FbStorageExpenses } from "../types/types";


const useGetMonthlyExpense = () => {
    const [expense, setExpense] = useState<FbStorageExpenses[]>([])
    const { user } = useAuth()

    useEffect(() => {
        const startMonth = getUnixTime(startOfMonth(new Date()))
        const endMonth = getUnixTime(endOfMonth(new Date()))

        if(user) {
            const request = query(
                collection(db, 'expenses'),
                orderBy('date', 'desc'),
                where('date', '>=', startMonth),
                where('date', '<=', endMonth),
                where('id', '==', user?.uid)
            );

            const unsubscribe = onSnapshot(request, (snapshot) => {
                setExpense(snapshot.docs.map((doc) => {
                    return { ...doc.data(), id: doc.id } as FbStorageExpenses
                }))
            }, (error) => console.error(error))

            return unsubscribe
        }


    }, [user])

    return expense
}

export default useGetMonthlyExpense