import type { User } from "firebase/auth"
import type { DocumentData, QueryDocumentSnapshot, Timestamp } from "firebase/firestore"
import type { ReactNode } from "react";

// BASE CONTAINER
export interface BaseContainerProps {
  children: ReactNode;
  hasBackBtn?: boolean;
  classes?: string;
  title?: string | null;
  route?: string;
}

// BASE BUTTON
export interface BaseButtonProps {
  onClick: (v: unknown) => void;
  classes?: string;
  hasIcon?: boolean;
  children?: ReactNode;
  text?: string;
}

// CATEGORY SELECTOR
export interface Category {
  id: string;
  text: string;
}

export interface CategoryIconProps {
  id: string;
  className?: string;
}

export interface CategoriesSelectProps {
  category: string;
  changeCategory: (id: string) => void;
}


export interface ButtonProps {
    $primary?: boolean
    $hasIcon?: boolean
    $bigIcon?: boolean
    $color?: string
    $flat?: boolean
    $textColor?: string
    $width?: string;
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

interface UserSettings {
  monthStartDay: number;
  updatedAt?: Timestamp; 
}

interface MonthBoundaries {
  startMonth: number;
  endMonth: number;  
}

export type MonthlyAmountContextType = {
  total: number;
  monthBoundaries?: MonthBoundaries | null;
  userSettings?: UserSettings | null;
}

interface CurrentPeriod {
  start: Date;
  end: Date;
}
export interface BalanceContextType {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  totalBudgetExpenses: number;
  totalMonthlyExpenses: number;
  monthBoundaries?: MonthBoundaries | null;
  userSettings?: UserSettings | null;
  currentPeriod?: CurrentPeriod | null;
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
