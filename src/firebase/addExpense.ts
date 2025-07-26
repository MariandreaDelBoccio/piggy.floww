import type { FbStorageExpenses } from '../types/types';
import { db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const addExpense = ({category, description, quantity, date, id}: FbStorageExpenses) => {
    return addDoc(collection(db, 'expenses'), {
        category,
        description,
        quantity,
        date,
        id
    })
}

export default addExpense