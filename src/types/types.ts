import type { User } from "firebase/auth"
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore"

export interface ButtonProps {
    $primary?: boolean
    $hasIcon?: boolean
    $bigIcon?: boolean
    $color?: string
    $flat?: boolean
    $textColor?: string
}

export interface AlertComponentProps {
    $type: string
    $message: string
    $alertStatus: boolean
    $changeAlertStatus: (value: boolean) => void
}

export type AuthContextType = {
  user: User | null;
  loading: boolean;
};

export type MonthlyAmountContextType = {
  total: number;
}

export type Category = {
  text: string;
  id: string;
}

export type CategoriesSelectProps = {
  category: string;
  changeCategory: (value: string) => void;
}

export type DatePickerProps = {
  date: Date;
  changeDate: (value: Date | undefined) => void;
}

export type FbStorageExpenses = {
  category: string
  description: string 
  quantity: string 
  date: number 
  id: string | undefined
}

export interface ExpensesFormProps {
    expense?: QueryDocumentSnapshot<DocumentData> | null;
}

export type CategoryKey = 'food' | 'debt' | 'home' | 'transport' | 'clothes' | 'health' | 'shopping' | 'fun';

export type ExpensesByCategory = {
    category: CategoryKey;
    quantity: number;
}[];

export interface FbStorageIncomes {
  id?: string;
  uidUser: string;
  description: string;
  quantity: string;
  date: number; // timestamp (ms)
}
