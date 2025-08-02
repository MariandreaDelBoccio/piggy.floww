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
  addDoc,
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
import theme from "../theme";
import useIsMobile from "../hooks/useIsMobile";

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
  const navigate = useNavigate();
  const [budgetEntries, setBudgetEntries] = useState<BudgetEntry[]>([]);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const getCurrentMonthKey = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  };

  const hasCurrentMonthFixed = (entries: BudgetEntry[]) => {
    const currentMonth = getCurrentMonthKey();

    return entries.some((entry) => {
      const entryDate = entry.createdAt.toDate();
      const entryMonth = `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, "0")}`;
      return entry.expenseType === "fixed" && entryMonth === currentMonth;
    });
  };

  const cloneFixedEntriesForCurrentMonth = async (entries: BudgetEntry[]) => {
    const fixedEntries = entries.filter((e) => e.expenseType === "fixed");

    if (fixedEntries.length === 0) return;

    // Agrupar por mes
    const groupedByMonth: Record<string, BudgetEntry[]> = {};
    for (const entry of fixedEntries) {
      const date = entry.createdAt.toDate();
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!groupedByMonth[key]) groupedByMonth[key] = [];
      groupedByMonth[key].push(entry);
    }

    // Buscar el mes más reciente
    const latestMonth = Object.keys(groupedByMonth).sort().reverse()[0];
    const latestFixed = groupedByMonth[latestMonth];

    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const batch = latestFixed.map((entry) => ({
      ...entry,
      createdAt: Timestamp.fromDate(startOfCurrentMonth),
    }));

    for (const entry of batch) {
      const { ...rest } = entry;
      await addDoc(collection(db, "budget"), {
        ...rest,
        userId: user?.uid,
      });
    }
  };

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

    const unsub = onSnapshot(q, async (snapshot) => {
      const entries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BudgetEntry[];

      // Verificamos si ya hay fixed este mes
      const alreadyHasFixed = hasCurrentMonthFixed(entries);

      // Si no, duplicamos los fixed del mes anterior
      if (!alreadyHasFixed) {
        await cloneFixedEntriesForCurrentMonth(entries);
      }

      setBudgetEntries(entries);
    });

    return () => unsub();
  }, [user, cloneFixedEntriesForCurrentMonth, hasCurrentMonthFixed]);

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

      <div
        className={`border-${theme.grisClaro2} border-2 rounded-lg bg-white m-6`}
      >
        <Header>
          <BackBtn route="/" />
          <Title>Budget</Title>
        </Header>
        <div
          style={{ padding: isMobile ? "0 2.5rem" : "2.5rem", width: "100%" }}
        >
          {/* Summary Cards */}
          <div
            className={`${isMobile ? "flex justify-center flex-wrap flex-col" : "grid"}`}
            style={{
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                padding: "1rem",
                borderRadius: "0.5rem",
                backgroundColor: theme.grisBackground,
                color: "black",
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
                backgroundColor: theme.grisClaro,
                color: "black",
                textAlign: "center",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "0.875rem" }}>
                Total Expenses
              </h3>
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
                backgroundColor: balance >= 0 ? theme.grisClaro2 : theme.rojo,
                color: balance >= 0 ? "black" : "white",
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
          <div
            style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}
          >
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
                  backgroundColor: filter === key ? "black" : "#e5e7eb",
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
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {filteredEntries.map((entry, index) => (
              <div
                key={index}
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
                          color:
                            entry.type === "income" ? "#166534" : "#991b1b",
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

                  <ElementList
                    style={{ borderBottom: "none", background: "none" }}
                  >
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
              margin: "2rem 0",
              display: "block",
              textAlign: "center",
              backgroundColor: "black",
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
      </div>
    </>
  );
}
