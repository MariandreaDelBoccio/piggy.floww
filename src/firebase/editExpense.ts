import type { FbStorageExpenses } from '../types/types';
import { db } from './firebaseConfig';
import { updateDoc, doc } from 'firebase/firestore';

const editExpense = async ({id, category, description, quantity, date}: FbStorageExpenses) => {
    if (!id) return;

    const document = doc(db, 'expenses', id)

    return await updateDoc(document, {
        category,
        description,
        quantity,
        date
    })
}

export default editExpense