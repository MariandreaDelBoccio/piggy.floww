import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot, query, orderBy, where, limit, startAfter, QueryDocumentSnapshot, type DocumentData } from "firebase/firestore";
import useAuth from "../context/useAuth";
import type { FbStorageExpenses } from "../types/types";

const useGetExpenses = () => {
    const {user} = useAuth()
    const [expenses, changeExpenses] = useState<FbStorageExpenses[]>([])
    const [lastExpense, changeLastExpense] = useState<QueryDocumentSnapshot<DocumentData, DocumentData> | null>(null)
    const [moreToLoad, changeMoreToLoad] = useState(false)

    const getMoreExpenses = () => {
        const request = query(
            collection(db, 'expenses'),
            where('id', '==', user?.uid),
            orderBy('date', 'desc'),
            limit(10),
            startAfter(lastExpense)
        )

        onSnapshot(request, (snapshot) => {
            if(snapshot.docs.length > 0) {
                changeLastExpense(snapshot.docs[snapshot.docs.length -1])

                changeExpenses(expenses.concat(snapshot.docs.map((expense) => {
                    return { ...expense.data(), id: expense.id } as FbStorageExpenses
                })))    
                
                const nextRequest = query(
                    collection(db, 'expenses'),
                    where('id', '==', user?.uid),
                    orderBy('date', 'desc'),
                    startAfter(snapshot.docs[snapshot.docs.length - 1]),
                    limit(1)
                );

                onSnapshot(nextRequest, (nextSnap) => {
                    changeMoreToLoad(nextSnap.docs.length > 0);
                });
            } else {
                changeMoreToLoad(false)
            }
        }, error => {console.error(error)})
    }
    
    useEffect(() => {
        const request = query(
            collection(db, 'expenses'),
            where('id', '==', user?.uid),
            orderBy('date', 'desc'),
            limit(10),
        )

        const unsubscribe = onSnapshot(request, (snapshot) => {
            if(snapshot.docs.length > 0){
				changeLastExpense(snapshot.docs[snapshot.docs.length -1]);
				changeMoreToLoad(true);
			} else {
				changeMoreToLoad(false);
			}
			
			changeExpenses(snapshot.docs.map((gasto) => {
				return {...gasto.data(), id: gasto.id} as FbStorageExpenses
			}));
        })

        return unsubscribe
    }, [user])

    return [expenses, getMoreExpenses, moreToLoad] as const;
}

export default useGetExpenses