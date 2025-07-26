import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import useAuth from "../context/useAuth";
import { Helmet } from "react-helmet-async";
import { Header, Title } from "../elements/Header";
import BackBtn from "../elements/BackBtn";
import { FilterContainer, Form, Input, ButtonContainer } from "../elements/FormElements";
import Button from "../elements/Button";
import Spinner from "../elements/SpinnerLoader";
import { Description } from "../elements/ListElements";
import EditIcon from "../assets/images/editar.svg?react";

type BudgetType = "income" | "expense";
type ExpenseType = "fixed" | "variable";

interface BudgetEntry {
  id: string;
  type: BudgetType;
  amount: number;
  description: string;
  category: string;
  expenseType?: ExpenseType;
}

export default function BudgetDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [budgetEntry, setBudgetEntry] = useState<BudgetEntry | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // Form states
  const [budgetType, setBudgetType] = useState<BudgetType>("income");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [expenseType, setExpenseType] = useState<ExpenseType>("fixed");

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

  const getCategoryName = (category: string) => {
    const allCategories = [...incomeCategories, ...expenseCategories];
    const found = allCategories.find(cat => cat.id === category);
    return found ? found.name : category;
  };

  useEffect(() => {
    if (!user || !id) return;

    const fetchBudgetEntry = async () => {
      const docRef = doc(db, "budget", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as DocumentData;
        const entry = { id: docSnap.id, ...data } as BudgetEntry;
        setBudgetEntry(entry);
        
        // Set form states
        setBudgetType(entry.type);
        setAmount(entry.amount.toString());
        setDescription(entry.description);
        setCategory(entry.category);
        if (entry.expenseType) {
          setExpenseType(entry.expenseType);
        }
      }
    };

    fetchBudgetEntry();
  }, [user, id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id || Number(amount) <= 0) return;

    try {
      const docRef = doc(db, "budget", id);
      const updateData: Partial<BudgetEntry> = {
        type: budgetType,
        amount: Number(amount),
        description,
        category,
      };

      if (budgetType === "expense") {
        updateData.expenseType = expenseType;
      }

      await updateDoc(docRef, updateData);

      // Update local state
      if (budgetEntry) {
        setBudgetEntry({ ...budgetEntry, ...updateData });
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating budget entry:", error);
    }
  };

  const handleCancel = () => {
    if (budgetEntry) {
      setBudgetType(budgetEntry.type);
      setAmount(budgetEntry.amount.toString());
      setDescription(budgetEntry.description);
      setCategory(budgetEntry.category);
      if (budgetEntry.expenseType) {
        setExpenseType(budgetEntry.expenseType);
      }
    }
    setIsEditing(false);
  };

  if (!budgetEntry) {
    return (
      <div>
        <div className="text-center mt-4">
          <Spinner fullscreen />
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Budget Entry</title>
        <link rel="icon" type="image/x-icon" href="../public/favicon.ico" />
      </Helmet>
      <Header>
        <BackBtn route="/budget-list" />
        <Title>Edit Budget Entry</Title>
      </Header>
      <div style={{ padding: "2.5rem", width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            style={{
              padding: "1rem",
              borderLeft: `6px solid ${budgetEntry.type === "income" ? "#10b981" : "#ef4444"}`,
              backgroundColor: "#f9fafb",
              borderRadius: "0.5rem",
            }}
          >
            {!isEditing ? (
              // Display Mode
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h2 style={{ fontWeight: "700", fontSize: "1.25rem", margin: 0 }}>
                    {getCategoryName(budgetEntry.category)}
                  </h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "0.5rem",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#e5e7eb",
                    }}
                    title="Edit entry"
                  >
                    <EditIcon style={{ width: "18px", height: "18px" }} />
                  </button>
                </div>

                <p style={{ fontSize: "0.875rem", color: "#555", marginBottom: "1rem" }}>
                  {budgetEntry.description}
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <strong>Type:</strong>
                    <span style={{
                      marginLeft: "0.5rem",
                      backgroundColor: budgetEntry.type === "income" ? "#dcfce7" : "#fee2e2",
                      color: budgetEntry.type === "income" ? "#166534" : "#991b1b",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.25rem",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                    }}>
                      {budgetEntry.type.toUpperCase()}
                    </span>
                  </div>
                  
                  <div>
                    <strong>Amount:</strong> {budgetEntry.amount}€
                  </div>
                </div>

                {budgetEntry.type === "expense" && budgetEntry.expenseType && (
                  <div>
                    <strong>Expense Type:</strong>
                    <span style={{
                      marginLeft: "0.5rem",
                      backgroundColor: budgetEntry.expenseType === "fixed" ? "#dbeafe" : "#fef3c7",
                      color: budgetEntry.expenseType === "fixed" ? "#1e40af" : "#92400e",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.25rem",
                      fontSize: "0.75rem",
                      fontWeight: "500"
                    }}>
                      {budgetEntry.expenseType.toUpperCase()}
                    </span>
                  </div>
                )}
              </>
            ) : (
              // Edit Mode
              <Form onSubmit={handleSave} style={{ margin: 0 }}>
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
                      {(budgetType === "income" ? incomeCategories : expenseCategories).map(
                        (cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </FilterContainer>

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

                <div style={{ marginBottom: "1rem" }}>
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
                  <Button
                    as="button"
                    to="#"
                    $color="#10b981"
                    type="submit"
                    style={{ marginRight: "0.5rem" }}
                  >
                    Save Changes
                  </Button>
                  <Button
                    as="button"
                    to="#"
                    $color="#ef4444"
                    type="button"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </ButtonContainer>
              </Form>
            )}
          </div>
        </div>
      </div>
      </>
  );
}