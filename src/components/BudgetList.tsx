import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
  deleteDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import { Helmet } from "react-helmet-async";
import { Header, Title } from "../elements/Header";
import BackBtn from "../elements/BackBtn";
import CategoryICon from "../elements/CategoryIcons";
import {
  ActionButton,
  ButtonContainer,
  Category,
  ElementList,
} from "../elements/ListElements";
import formatCurrency from "../functions/currencyConvertion";
import DeleteIcon from "../assets/images/borrar.svg?react";
import EditIcon from "../assets/images/editar.svg?react";
import BalanceBar from "./BalanceBar";
import TotalBar from "./totalBar";

type BudgetEntry = {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string;
  expenseType?: "fixed" | "variable";
  createdAt: Timestamp;
};

export default function BudgetList() {
  const [budgetEntries, setBudgetEntries] = useState<BudgetEntry[]>([]);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const { user } = useAuth();
  const navigate = useNavigate();

  const getCategoryName = (category: string) => {
    const categories = {
      // Income categories
      salary: "Salary",
      freelance: "Freelance",
      business: "Business",
      investment: "Investment",
      // Expense categories
      housing: "Housing",
      food: "Food",
      transport: "Transport",
      utilities: "Utilities",
      healthcare: "Healthcare",
      entertainment: "Entertainment",
      shopping: "Shopping",
      education: "Education",
      insurance: "Insurance",
      other: "Other",
    };
    return categories[category as keyof typeof categories] || category;
  };

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "budget"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const entries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BudgetEntry[];
      setBudgetEntries(entries);
    });

    return () => unsub();
  }, [user]);

  const deleteBudgetEntry = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    await deleteDoc(doc(db, "budget", id));
  };

  const filteredEntries = budgetEntries.filter((entry) => {
    if (filter === "all") return true;
    return entry.type === filter;
  });

  const totalIncome = budgetEntries
    .filter((entry) => entry.type === "income")
    .reduce((acc, entry) => acc + entry.amount, 0);

  const totalExpenses = budgetEntries
    .filter((entry) => entry.type === "expense")
    .reduce((acc, entry) => acc + entry.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <>
      <Helmet>
        <title>Budget</title>
        <link rel="icon" type="image/x-icon" href="../public/favicon.ico" />
      </Helmet>
      <Header>
        <BackBtn route="/" />
        <Title>Budget</Title>
      </Header>
      <div style={{ padding: "2.5rem", width: "100%" }}>
        {/* Summary Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              padding: "1rem",
              borderRadius: "0.5rem",
              backgroundColor: "#10b981",
              color: "white",
              textAlign: "center",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "0.875rem" }}>Total Income</h3>
            <p
              style={{
                margin: "0.5rem 0 0 0",
                fontSize: "1.25rem",
                fontWeight: "bold",
              }}
            >
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div
            style={{
              padding: "1rem",
              borderRadius: "0.5rem",
              backgroundColor: "#ef4444",
              color: "white",
              textAlign: "center",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "0.875rem" }}>Total Expenses</h3>
            <p
              style={{
                margin: "0.5rem 0 0 0",
                fontSize: "1.25rem",
                fontWeight: "bold",
              }}
            >
              {formatCurrency(totalExpenses)}
            </p>
          </div>
          <div
            style={{
              padding: "1rem",
              borderRadius: "0.5rem",
              backgroundColor: balance >= 0 ? "#3b82f6" : "#f59e0b",
              color: "white",
              textAlign: "center",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "0.875rem" }}>Balance</h3>
            <p
              style={{
                margin: "0.5rem 0 0 0",
                fontSize: "1.25rem",
                fontWeight: "bold",
              }}
            >
              {formatCurrency(balance)}
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {[
            { key: "all", label: "All" },
            { key: "income", label: "Income" },
            { key: "expense", label: "Expenses" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as typeof filter)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                border: "none",
                backgroundColor: filter === key ? "#5B69E2" : "#e5e7eb",
                color: filter === key ? "white" : "#374151",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Budget Entries List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              onClick={() => navigate(`/budget/${entry.id}`)}
              style={{
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  borderLeft: `6px solid ${entry.type === "income" ? "#10b981" : "#ef4444"}`,
                  backgroundColor: "#f9fafb",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Category>
                    <CategoryICon id={entry.category} />
                    {getCategoryName(entry.category)}
                  </Category>

                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#555",
                      marginTop: "0.5rem",
                    }}
                  >
                    {entry.description}
                  </p>

                  <p style={{ fontSize: "1rem", marginTop: "0.5rem" }}>
                    <strong>Amount:</strong> {formatCurrency(entry.amount)}
                  </p>

                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "#666",
                      marginTop: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor:
                          entry.type === "income" ? "#dcfce7" : "#fee2e2",
                        color: entry.type === "income" ? "#166534" : "#991b1b",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.25rem",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        marginRight: "0.5rem",
                      }}
                    >
                      {entry.type.toUpperCase()}
                    </span>

                    {entry.type === "expense" && entry.expenseType && (
                      <span
                        style={{
                          backgroundColor:
                            entry.expenseType === "fixed"
                              ? "#dbeafe"
                              : "#fef3c7",
                          color:
                            entry.expenseType === "fixed"
                              ? "#1e40af"
                              : "#92400e",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                        }}
                      >
                        {entry.expenseType.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                <ElementList style={{ borderBottom: "none" }}>
                  <ButtonContainer>
                    <ActionButton as={Link} to={`/budget/${entry.id}`}>
                      <EditIcon />
                    </ActionButton>
                    <ActionButton
                      onClick={(e) => deleteBudgetEntry(entry.id, e)}
                    >
                      <DeleteIcon />
                    </ActionButton>
                  </ButtonContainer>
                </ElementList>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Entry Button */}
        <Link
          to="/budget"
          style={{
            marginTop: "2rem",
            display: "block",
            textAlign: "center",
            backgroundColor: "#5B69E2",
            color: "white",
            padding: "1rem",
            borderRadius: "0.5rem",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          + New Entry
        </Link>
      </div>

      <BalanceBar />
      <TotalBar />
    </>
  );
}
