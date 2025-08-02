import { useState, useEffect } from "react";
import { collection, doc, setDoc, Timestamp, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";

import {
  FilterContainer,
  Form,
  Input,
  ButtonContainer,
} from "../elements/FormElements";
import { Helmet } from "react-helmet-async";
import { Header, Title } from "../elements/Header";
import BackBtn from "../elements/BackBtn";
import Button from "../elements/Button";
import theme from "../theme";

type BudgetType = "income" | "expense";
type ExpenseType = "fixed" | "variable";

interface UserSettings {
  monthStartDay: number;
}

export default function BudgetForm() {
  const [budgetType, setBudgetType] = useState<BudgetType>("income");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("salary");
  const [expenseType, setExpenseType] = useState<ExpenseType>("fixed");
  const [showMonthSettings, setShowMonthSettings] = useState(false);
  const [monthStartDay, setMonthStartDay] = useState(1);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  const incomeCategories = [
    { id: "salary", name: "Salary" },
    { id: "freelance", name: "Freelance" },
    { id: "business", name: "Business" },
    { id: "investment", name: "Investment" },
    { id: "other", name: "Other" },
  ];

  const expenseCategories = [
    { id: "housing", name: "Housing" },
    { id: "food", name: "Food" },
    { id: "transport", name: "Transport" },
    { id: "utilities", name: "Utilities" },
    { id: "healthcare", name: "Healthcare" },
    { id: "entertainment", name: "Entertainment" },
    { id: "shopping", name: "Shopping" },
    { id: "education", name: "Education" },
    { id: "insurance", name: "Insurance" },
    { id: "other", name: "Other" },
  ];

  // Load user settings on component mount
  useEffect(() => {
    const loadUserSettings = async () => {
      if (!user) return;
      
      try {
        const settingsDoc = await getDoc(doc(db, "userSettings", user.uid));
        if (settingsDoc.exists()) {
          const settings = settingsDoc.data() as UserSettings;
          setUserSettings(settings);
          setMonthStartDay(settings.monthStartDay);
        }
      } catch (error) {
        console.error("Error loading user settings:", error);
      }
    };

    loadUserSettings();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      // Save budget entry
      const newDocRef = doc(collection(db, "budget"));
      const newDocId = newDocRef.id;

      await setDoc(newDocRef, {
        id: newDocId,
        type: budgetType,
        amount: Number(amount),
        description,
        category,
        ...(budgetType === "expense" && { expenseType }),
        userId: user.uid,
        createdAt: Timestamp.now(),
      });

      // Save month settings if they were modified
      if (showMonthSettings && monthStartDay !== (userSettings?.monthStartDay || 1)) {
        await setDoc(doc(db, "userSettings", user.uid), {
          monthStartDay: monthStartDay,
          updatedAt: Timestamp.now(),
        }, { merge: true });
      }

      navigate("/budget-list");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const dayOptions = Array.from({ length: 28 }, (_, i) => i + 1);

  return (
    <>
      <Helmet>
        <title>Add Budget Entry</title>
        <link rel="icon" type="image/x-icon" href="../public/favicon.ico" />
      </Helmet>

      <div
        className={`border-${theme.grisClaro2} border-2 rounded-lg bg-white m-6`}
      >
        <Header>
          <BackBtn route="/budget-list" />
          <Title>Add Budget Entry</Title>
        </Header>
        
        <Form onSubmit={handleSubmit}>
          {/* Monthly Cycle Settings Toggle */}
          <FilterContainer>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Monthly Cycle Settings</span>
              <button
                type="button"
                onClick={() => setShowMonthSettings(!showMonthSettings)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {showMonthSettings ? "Hide" : "Configure"}
              </button>
            </div>
          </FilterContainer>

          {/* Monthly Cycle Settings */}
          {showMonthSettings && (
            <FilterContainer>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid">
                  <label className="text-xs font-semibold pb-2">
                    When does your financial month start?
                  </label>
                  <select
                    value={monthStartDay}
                    onChange={(e) => setMonthStartDay(Number(e.target.value))}
                    style={{
                      width: "20rem",
                      padding: "0.75rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.5rem",
                      fontSize: "1rem",
                      backgroundColor: "white",
                    }}
                  >
                    {dayOptions.map((day) => (
                      <option key={day} value={day}>
                        Day {day} of the month
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-600 mt-2">
                    Set the day when you typically receive your salary or when you want your monthly budget cycle to begin.
                    {userSettings && (
                      <span className="block mt-1 font-medium">
                        Current setting: Day {userSettings.monthStartDay}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </FilterContainer>
          )}

          {/* Budget Type Selection */}
          <FilterContainer>
            <div className="grid">
              <label className="text-xs font-semibold pb-2" htmlFor="budgetType">
                Type
              </label>
              <select
                id="budgetType"
                value={budgetType}
                onChange={(e) => {
                  setBudgetType(e.target.value as BudgetType);
                  setCategory(
                    e.target.value === "income" ? "salary" : "housing",
                  );
                }}
                style={{
                  width: "20rem",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  backgroundColor: "white",
                }}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </FilterContainer>

          {/* Category Selection */}
          <FilterContainer>
            <div className="grid">
              <label className="text-xs font-semibold pb-2" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: "20rem",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  backgroundColor: "white",
                }}
              >
                {(budgetType === "income"
                  ? incomeCategories
                  : expenseCategories
                ).map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </FilterContainer>

          {/* Expense Type Selection (only for expenses) */}
          {budgetType === "expense" && (
            <FilterContainer>
              <div className="grid">
                <label className="text-xs font-semibold pb-2" htmlFor="expenseType">
                  Expense type
                </label>
                <select
                  id="expenseType"
                  value={expenseType}
                  onChange={(e) =>
                    setExpenseType(e.target.value as ExpenseType)
                  }
                  style={{
                    width: "20rem",
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.5rem",
                    fontSize: "1rem",
                    backgroundColor: "white",
                  }}
                >
                  <option value="fixed">Fixed</option>
                  <option value="variable">Variable</option>
                </select>
              </div>
            </FilterContainer>
          )}

          {/* Amount Input */}
          <FilterContainer>
            <div className="grid">
              <label className="text-xs font-semibold pb-2" htmlFor="amount">
                Amount
              </label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                placeholder="0.00€"
                min="0"
                step="0.01"
                style={{ width: "20rem"}}
              />
            </div>
          </FilterContainer>

          {/* Description Input */}
          <div className="grid mb-2">
            <label className="text-xs font-semibold pb-2" htmlFor="description">
              Description
            </label>
            <Input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{ width: "20rem"}}
            />
          </div>

          <ButtonContainer>
            <Button as="button" to="#" type="submit" $width="20rem">
              Save
            </Button>
          </ButtonContainer>
        </Form>
      </div>
    </>
  );
}