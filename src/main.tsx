import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import WebFont from "webfontloader";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import EditExpenses from "./components/EditExpenses.tsx";
import CategoryExpenses from "./components/CategoryExpenses.tsx";
import ExpensesList from "./components/ExpensesList.tsx";
import Login from "./components/Login.tsx";
import SignUp from "./components/SignUp.tsx";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import { TotalAmountProvider } from "./context/TotalMonthlyAmountContext.tsx";
import HuchasList from "./components/HuchasList.tsx";
import HuchaForm from "./components/HuchaForm.tsx";
import HuchaDetail from "./components/HuchaDetail.tsx";
import BudgetForm from "./components/BudgetForm.tsx";
import BudgetList from "./components/BudgetList.tsx";
import BudgetDetail from "./components/BudgetDetail.tsx";
import { BalanceProvider } from "./context/BalanceProvider.tsx";
import PrivateLayout from "./components/PrivateLayout.tsx";

WebFont.load({
  google: {
    families: ["Poppins:300,400,500,700"],
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <TotalAmountProvider>
          <BalanceProvider>
            <BrowserRouter>
              <Routes>
                {/* Login */}
                <Route path="/login" element={<Login />} />
                {/* Sign Up */}
                <Route path="/sign-up" element={<SignUp />} />

                {/* Private routes */}
                <Route element={<PrivateRoute />}>
                  <Route element={<PrivateLayout />}>
                    {/* Expenses by ategories */}
                    <Route path="/categories" element={<CategoryExpenses />} />
                    {/* Expenses list */}
                    <Route path="/list" element={<ExpensesList />} />
                    {/* Default */}
                    <Route path="/" element={<App />} />
                    {/* Expenses edit */}
                    <Route path="/edit/:id" element={<EditExpenses />} />
                    {/* Huschas List */}
                    <Route path="/money-box" element={<HuchasList />} />
                    {/* Huchas form */}
                    <Route path="/money-box/new" element={<HuchaForm />} />
                    {/* Hucha Details */}
                    <Route path="/money-box/:id" element={<HuchaDetail />} />
                    {/* Budget */}
                    <Route path="/budget" element={<BudgetForm />} />
                    {/* Budget List */}
                    <Route path="/budget-list" element={<BudgetList />} />
                    {/* Budget List */}
                    <Route path="/budget/:id" element={<BudgetDetail />} />
                  </Route>
                </Route>

                {/* Not found */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </BalanceProvider>
        </TotalAmountProvider>
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>,
);
