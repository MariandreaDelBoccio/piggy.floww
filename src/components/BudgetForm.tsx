import { useState } from "react";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import PlusIcon from "../assets/images/plus.svg?react";

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
import { Description } from "../elements/ListElements";

type BudgetType = "income" | "expense";
type ExpenseType = "fixed" | "variable";

export default function BudgetForm() {
  const [budgetType, setBudgetType] = useState<BudgetType>("income");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("salary");
  const [expenseType, setExpenseType] = useState<ExpenseType>("fixed");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

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

    navigate("/budget-list");
  };

  return (
    <>
      <Helmet>
        <title>Add Budget Entry</title>
        <link rel="icon" type="image/x-icon" href="../public/favicon.ico" />
      </Helmet>
      <Header>
        <BackBtn route="/budget-list" />
        <Title>Add Budget Entry</Title>
      </Header>
      <Form onSubmit={handleSubmit}>
        {/* Budget Type Selection */}
        <FilterContainer>
          <div style={{ flex: 1 }}>
            <Description>Type</Description>
            <select
              value={budgetType}
              onChange={(e) => {
                setBudgetType(e.target.value as BudgetType);
                setCategory(e.target.value === "income" ? "salary" : "housing");
              }}
              style={{
                width: "100%",
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
          <div style={{ flex: 1 }}>
            <Description>Category</Description>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: "100%",
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
            <div style={{ flex: 1 }}>
              <Description>Expense Type</Description>
              <select
                value={expenseType}
                onChange={(e) => setExpenseType(e.target.value as ExpenseType)}
                style={{
                  width: "100%",
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
          <div style={{ flex: 1 }}>
            <Description>Amount</Description>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="0.00€"
              min="0"
              step="0.01"
            />
          </div>
        </FilterContainer>

        {/* Description Input */}
        <div style={{ flex: 1, marginBottom: "1rem" }}>
          <Description>Description</Description>
          <Input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Description"
          />
        </div>

        <ButtonContainer>
          <Button as="button" to="#" $primary $hasIcon type="submit">
            Save
            <PlusIcon />
          </Button>
        </ButtonContainer>
      </Form>
    </>
  );
}
