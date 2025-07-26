import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, QueryDocumentSnapshot, getDoc, type DocumentData } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const useGetExpense = (id: string) => {
    const navigate = useNavigate()
    const [expense, setExpense] = useState<QueryDocumentSnapshot<DocumentData, DocumentData> | null>(null)

    useEffect(() => {
        const getExpense = async() => {
            const document = await getDoc(doc(db, 'expenses', id))

            if(document.exists()) {
                setExpense(document)
            } else {
               navigate('/list') 
            } 
        }

        getExpense()
    }, [navigate, id])


    return [expense]
}

export default useGetExpense