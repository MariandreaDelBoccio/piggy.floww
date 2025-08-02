import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  getDoc,
  setDoc,
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
} from "../elements/ListElements";
import formatCurrency from "../functions/currencyConvertion";
import DeleteIcon from "../assets/images/borrar.svg?react";
import EditIcon from "../assets/images/editar.svg?react";
import { BalanceContext } from "../context/BalanceContext";
import useIsMobile from "../hooks/useIsMobile";

// Iconos para los botones de reordenamiento (puedes reemplazarlos con tus propios SVG)
const ArrowUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 14l5-5 5 5z" />
  </svg>
);

const ArrowDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 10l5 5 5-5z" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
  </svg>
);

type Hucha = {
  id: string;
  name: string;
  goal: number;
  description: string;
  color: string;
  deadline: Timestamp;
  savings: Saving[];
  remaining: number;
  priority?: number;
  createdAt?: Timestamp;
};

type Saving = {
  amount: number;
};

type HuchaConAhorros = Hucha & {
  savings: Saving[];
  remaining: number;
};

type SavedSuggestedSavings = {
  suggestedSavings: Record<string, number>;
  baseBalance: number;
  timestamp: number;
  savingsPercentage: number;
};

export default function HuchasList() {
  const navigate = useNavigate();
  const [huchas, setHuchas] = useState<Hucha[]>([]);
  const { user } = useAuth();
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const { balance } = useContext(BalanceContext);
  const [dismissedWarnings, setDismissedWarnings] = useState<
    Record<string, boolean>
  >({});
  const [suggestedSavingsByHucha, setSuggestedSavingsByHucha] = useState<
    Record<string, number>
  >({});

  const isMobile = useIsMobile();

  // Touch drag state - Mejorado para evitar conflictos con scroll
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragThreshold] = useState(10);
  const [isBalanceExpanded, setIsBalanceExpanded] = useState(false);
  const [savingsPercentage, setSavingsPercentage] = useState(80);

  const [savedSuggestedSavings, setSavedSuggestedSavings] =
    useState<SavedSuggestedSavings | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false); // NUEVO: Flag para controlar inicialización

  const isDeadlineApproaching = (hucha: HuchaConAhorros, daysThreshold = 7) => {
    if (!hucha.deadline || hucha.remaining <= 0) return false;

    const today = new Date();
    const deadline = hucha.deadline.toDate();
    const diffDays = Math.ceil(
      (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    return diffDays <= daysThreshold && diffDays >= 0;
  };

  const isSuggestedSavingInsufficient = (hucha: HuchaConAhorros) => {
    if (!hucha.deadline || hucha.remaining <= 0) return false;

    const now = new Date();
    const deadline = hucha.deadline.toDate();

    const monthsLeft =
      (deadline.getFullYear() - now.getFullYear()) * 12 +
      (deadline.getMonth() - now.getMonth());

    if (monthsLeft <= 0 || monthsLeft > 12) return false;

    const suggested = getSuggestedSaving(hucha.id);
    const projectedSavings = suggested * monthsLeft;

    const coverage = projectedSavings / hucha.remaining;

    return coverage >= 0.25 && coverage < 1;
  };

  const getRequiredMonthlySaving = (hucha: HuchaConAhorros) => {
    if (!hucha.deadline || hucha.remaining <= 0) return 0;

    const now = new Date();
    const deadline = hucha.deadline.toDate();

    const monthsLeft =
      (deadline.getFullYear() - now.getFullYear()) * 12 +
      (deadline.getMonth() - now.getMonth());

    if (monthsLeft <= 0) return hucha.remaining;

    return hucha.remaining / monthsLeft;
  };

  const getSuggestedSaving = (huchaId: string): number => {
    return suggestedSavingsByHucha[huchaId] ?? 0;
  };

  const calculateSuggestedSavings = useCallback(
    (currentBalance: number, percentage: number): Record<string, number> => {
      const now = new Date();
      const eligibleHuchas = huchas.filter((h) => h.remaining > 0);
      const savingsBudget = currentBalance * (percentage / 100);

      const weights = eligibleHuchas.map((h, index) => {
        const daysToDeadline = h.deadline
          ? Math.max(
              1,
              Math.ceil(
                (h.deadline.toDate().getTime() - now.getTime()) /
                  (1000 * 60 * 60 * 24),
              ),
            )
          : 9999;

        const urgencyFactor = 1 / daysToDeadline;
        const priorityFactor = 1 / (index + 1);

        return urgencyFactor + priorityFactor;
      });

      const totalWeight = weights.reduce((acc, w) => acc + w, 0);

      const suggestions: Record<string, number> = {};
      eligibleHuchas.forEach((h, i) => {
        const amount = (savingsBudget * weights[i]) / totalWeight;
        suggestions[h.id] = Math.min(
          h.remaining,
          parseFloat(amount.toFixed(2)),
        );
      });

      return suggestions;
    },
    [huchas],
  );

  const saveSuggestedSavingsToFirestore = useCallback(
    async (
      suggestions: Record<string, number>,
      baseBalance: number,
      percentage: number,
    ) => {
      if (!user) return;

      const savedData: SavedSuggestedSavings = {
        suggestedSavings: suggestions,
        baseBalance,
        timestamp: Date.now(),
        savingsPercentage: percentage,
      };

      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(
          userDocRef,
          { savedSuggestedSavings: savedData },
          { merge: true },
        );
        setSavedSuggestedSavings(savedData);
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error("Error saving suggested savings:", error);
      }
    },
    [user, setSavedSuggestedSavings, setHasUnsavedChanges],
  );

  const loadSuggestedSavingsFromFirestore = useCallback(async () => {
    if (!user) return;

    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.savedSuggestedSavings) {
          const saved = data.savedSuggestedSavings as SavedSuggestedSavings;
          setSavedSuggestedSavings(saved);
          setSuggestedSavingsByHucha(saved.suggestedSavings);
          setIsInitialized(true); // Marcamos como inicializado
        } else {
          setIsInitialized(true); // No hay datos guardados, pero ya inicializamos
        }
      } else {
        setIsInitialized(true); // Usuario nuevo, ya inicializamos
      }
    } catch (error) {
      console.error("Error loading suggested savings:", error);
      setIsInitialized(true); // En caso de error, permitimos continuar
    }
  }, [user]) 

  // NUEVO: Función para recalcular y aplicar nuevos suggested savings
  const recalculateAndApplySuggestedSavings = async () => {
    const newSuggestions = calculateSuggestedSavings(
      balance,
      savingsPercentage,
    );
    setSuggestedSavingsByHucha(newSuggestions);
    await saveSuggestedSavingsToFirestore(
      newSuggestions,
      balance,
      savingsPercentage,
    );
  };

  const detectUnsavedChanges = useCallback(() => {
    if (!savedSuggestedSavings) return true;

    if (savedSuggestedSavings.savingsPercentage !== savingsPercentage)
      return true;
    if (savedSuggestedSavings.baseBalance !== balance) return true;

    const currentHuchaIds = new Set(huchas.map((h) => h.id));
    const savedHuchaIds = new Set(
      Object.keys(savedSuggestedSavings.suggestedSavings),
    );

    if (currentHuchaIds.size !== savedHuchaIds.size) return true;

    for (const id of currentHuchaIds) {
      if (!savedHuchaIds.has(id)) return true;
    }

    return false;
  }, [savedSuggestedSavings, savingsPercentage, balance, huchas]);

  // Función para calcular el dinero restante después de todos los suggested savings
  const getRemainingAfterSuggested = (): number => {
    const totalSuggested = Object.values(suggestedSavingsByHucha).reduce(
      (total, val) => total + val,
      0,
    );
    return balance - totalSuggested;
  };

  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    if (!user) return;

    const fetchUserSavingsSettings = async () => {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.savingsPercentage !== undefined) {
          setSavingsPercentage(data.savingsPercentage);
        } else {
          setSavingsPercentage(80);
          await setDoc(userDocRef, { savingsPercentage: 80 }, { merge: true });
        }
      } else {
        setSavingsPercentage(80);
        await setDoc(userDocRef, { savingsPercentage: 80 });
      }
    };

    fetchUserSavingsSettings();
    loadSuggestedSavingsFromFirestore(); // NUEVO: Cargar suggested savings guardados

    const q = query(collection(db, "huchas"), where("userId", "==", user.uid));

    const unsub = onSnapshot(q, async (snapshot) => {
      const huchasData: HuchaConAhorros[] = [];

      for (const docSnap of snapshot.docs) {
        const huchaData = { id: docSnap.id, ...docSnap.data() } as Hucha;

        const savingsSnapshot = await getDocs(
          collection(db, "huchas", docSnap.id, "savings"),
        );
        const savings = savingsSnapshot.docs.map((s) => s.data() as Saving);

        const totalSaved = savings.reduce((acc, s) => acc + s.amount, 0);
        const remaining = huchaData.goal - totalSaved;

        huchasData.push({ ...huchaData, savings, remaining });
      }

      const sortedHuchas = huchasData.sort((a, b) => {
        if (a.priority !== undefined && b.priority !== undefined) {
          return a.priority - b.priority;
        }

        if (a.priority !== undefined && b.priority === undefined) {
          return -1;
        }
        if (a.priority === undefined && b.priority !== undefined) {
          return 1;
        }

        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateA.getTime() - dateB.getTime();
      });

      setHuchas(sortedHuchas);
    });

    return () => unsub();
  }, [user, loadSuggestedSavingsFromFirestore]);

  // NUEVO: Effect para detectar cambios no guardados
  useEffect(() => {
    if (isInitialized && huchas.length > 0 && savedSuggestedSavings) {
      setHasUnsavedChanges(detectUnsavedChanges());
    }
  }, [
    isInitialized,
    huchas,
    savingsPercentage,
    savedSuggestedSavings,
    detectUnsavedChanges,
  ]);

  useEffect(() => {
    if (
      isInitialized &&
      huchas.length > 0 &&
      Object.keys(suggestedSavingsByHucha).length === 0 &&
      savedSuggestedSavings // Solo si hay datos guardados
    ) {
      setSuggestedSavingsByHucha(savedSuggestedSavings.suggestedSavings);
      setHasUnsavedChanges(detectUnsavedChanges());
    } else if (
      isInitialized &&
      huchas.length > 0 &&
      Object.keys(suggestedSavingsByHucha).length === 0 &&
      !savedSuggestedSavings // Si NO hay datos guardados
    ) {
      const initialSuggestions = calculateSuggestedSavings(
        balance,
        savingsPercentage,
      );
      setSuggestedSavingsByHucha(initialSuggestions);
      saveSuggestedSavingsToFirestore(
        initialSuggestions,
        balance,
        savingsPercentage,
      );
    }
  }, [isInitialized, huchas.length, savedSuggestedSavings, balance, savingsPercentage, suggestedSavingsByHucha, calculateSuggestedSavings, saveSuggestedSavingsToFirestore, detectUnsavedChanges]);

  const deleteHucha = async (id: string) => {
    await deleteDoc(doc(db, "huchas", id));
    navigate("/money-box");
  };

  const saveOrderToFirestore = async (newHuchas: Hucha[]) => {
    const updates = newHuchas.map((hucha, index) =>
      updateDoc(doc(db, "huchas", hucha.id), { priority: index + 1 }),
    );

    try {
      await Promise.all(updates);
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  const reorderItems = async (fromIndex: number, toIndex: number) => {
    const newHuchas = [...huchas];
    const [draggedItem] = newHuchas.splice(fromIndex, 1);
    newHuchas.splice(toIndex, 0, draggedItem);

    setHuchas(newHuchas);
    await saveOrderToFirestore(newHuchas);
  };

  const moveUp = async (index: number) => {
    if (index > 0) {
      await reorderItems(index, index - 1);
    }
  };

  const moveDown = async (index: number) => {
    if (index < huchas.length - 1) {
      await reorderItems(index, index + 1);
    }
  };

  // Desktop drag handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (isMobile) return;
    setDraggedItem(id);
    setDraggedIndex(huchas.findIndex((h) => h.id === id));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (isMobile) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    if (isMobile) return;
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === targetIndex) return;

    await reorderItems(draggedIndex, targetIndex);

    setDraggedItem(null);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    if (isMobile) return;
    setDraggedItem(null);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Mobile touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;

    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || !touchStart) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStart.x);
    const deltaY = Math.abs(touch.clientY - touchStart.y);

    if (deltaX > dragThreshold && deltaX > deltaY) {
      if (!isDragging) {
        setIsDragging(true);
        e.preventDefault();
      }

      const elements = document.querySelectorAll("[data-hucha-index]");
      let newDragOverIndex = null;

      elements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        if (touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
          newDragOverIndex = index;
        }
      });

      if (newDragOverIndex !== null && newDragOverIndex !== dragOverIndex) {
        setDragOverIndex(newDragOverIndex);
      }
    }
  };

  const handleTouchEnd = async () => {
    if (!isMobile) return;

    if (
      isDragging &&
      draggedIndex !== null &&
      dragOverIndex !== null &&
      draggedIndex !== dragOverIndex
    ) {
      await reorderItems(draggedIndex, dragOverIndex);
    }

    setTouchStart(null);
    setIsDragging(false);
    setDraggedItem(null);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleItemClick = (
    huchaId: string,
    e: React.MouseEvent | React.TouchEvent,
  ) => {
    if (isDragging) {
      e.preventDefault();
      return;
    }
    navigate(`/money-box/${huchaId}`);
  };

  const remainingBalance = getRemainingAfterSuggested();
  const totalSuggestedSavings = Object.values(suggestedSavingsByHucha).reduce(
    (acc, val) => acc + val,
    0,
  );

  const savePercentageValue = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newValue = Number(e.target.value);
    setSavingsPercentage(newValue);

    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      try {
        await setDoc(
          userDocRef,
          { savingsPercentage: newValue },
          { merge: true },
        );
      } catch (error) {
        console.error("Error updating savings percentage:", error);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Piggy Bank</title>
        <link rel="icon" type="image/x-icon" href="../public/favicon.ico" />
      </Helmet>

      <div className="bg-white m-6 border-2 rounded-lg">
        <Header>
          <BackBtn />
          <Title>Piggy Bank</Title>
        </Header>
        <div style={{ padding: "2.5rem", width: "100%" }}>
          {/* Barra de Balance Restante */}
          <div
            style={{
              backgroundColor: remainingBalance >= 0 ? "#f0f9ff" : "#fef2f2",
              border: `2px solid ${remainingBalance >= 0 ? "#0ea5e9" : "#ef4444"}`,
              borderRadius: "0.75rem",
              padding: isMobile ? "1rem" : "1.5rem",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            {/* Header con toggle para móvil */}
            <div
              style={{
                marginBottom: isMobile ? "0.5rem" : "0.5rem",
                cursor: isMobile ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onClick={
                isMobile
                  ? () => setIsBalanceExpanded(!isBalanceExpanded)
                  : undefined
              }
            >
              <h3
                style={{
                  fontSize: isMobile ? "1rem" : "1.125rem",
                  fontWeight: "600",
                  color: "#374151",
                  margin: 0,
                }}
              >
                Balance Summary
              </h3>

              {/* NUEVO: Botón para recalcular suggested savings */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                {hasUnsavedChanges && (
                  <button
                    onClick={recalculateAndApplySuggestedSavings}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      padding: "0.5rem 0.75rem",
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#059669";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#10b981";
                    }}
                    title="Recalculate suggested savings based on current settings"
                  >
                    <RefreshIcon />
                    {isMobile ? "Update" : "Update Suggestions"}
                  </button>
                )}

                {/* Resumen compacto para móvil */}
                {isMobile && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: remainingBalance >= 0 ? "#059669" : "#dc2626",
                      }}
                    >
                      {formatCurrency(remainingBalance)} left
                    </span>
                    <span
                      style={{
                        fontSize: "1rem",
                        color: "#6b7280",
                        transform: isBalanceExpanded
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                      }}
                    >
                      ▼
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* NUEVO: Indicador de cambios no guardados */}
            {hasUnsavedChanges && (!isMobile || isBalanceExpanded) && (
              <div
                style={{
                  marginBottom: "1rem",
                  padding: "0.75rem",
                  backgroundColor: "#fef3c7",
                  borderRadius: "0.5rem",
                  border: "1px solid #fcd34d",
                  fontSize: "0.875rem",
                  color: "#92400e",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                ⚠️ Settings have changed. Click "Update Suggestions" to
                recalculate savings recommendations.
              </div>
            )}

            {/* Control de porcentaje de ahorros */}
            {(!isMobile || isBalanceExpanded) && (
              <div
                style={{
                  marginBottom: "1rem",
                  padding: "0.75rem",
                  backgroundColor: "#f9fafb",
                  borderRadius: "0.5rem",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div style={{ marginBottom: "0.5rem" }}>
                  <label
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#374151",
                      display: "block",
                    }}
                  >
                    Savings Percentage: {savingsPercentage}%
                  </label>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={savingsPercentage}
                  onChange={(e) => savePercentageValue(e)}
                  style={{
                    width: "100%",
                    height: "0.5rem",
                    borderRadius: "0.25rem",
                    background: "#e5e7eb",
                    outline: "none",
                    cursor: "pointer",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.75rem",
                    color: "#6b7280",
                    marginTop: "0.25rem",
                  }}
                >
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            )}

            {/* Layout Desktop */}
            {!isMobile && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      margin: 0,
                    }}
                  >
                    Current Balance
                  </p>
                  <p
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "700",
                      color: "#111827",
                      margin: 0,
                    }}
                  >
                    {formatCurrency(balance)}
                  </p>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "1.5rem",
                    color: "#6b7280",
                  }}
                >
                  →
                </div>
                <div style={{ textAlign: "center" }}>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      margin: 0,
                    }}
                  >
                    Fixed Suggested Savings
                  </p>
                  <p
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "700",
                      color: "#f59e0b",
                      margin: 0,
                    }}
                  >
                    {formatCurrency(totalSuggestedSavings)}
                  </p>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "1.5rem",
                    color: "#6b7280",
                  }}
                >
                  =
                </div>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      margin: 0,
                    }}
                  >
                    Remaining Balance
                  </p>
                  <p
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "700",
                      color: remainingBalance >= 0 ? "#059669" : "#dc2626",
                      margin: 0,
                    }}
                  >
                    {formatCurrency(remainingBalance)}
                  </p>
                </div>
              </div>
            )}

            {/* Layout Mobile - Solo se muestra cuando está expandido */}
            {isMobile && isBalanceExpanded && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <p
                    style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}
                  >
                    Current Balance
                  </p>
                  <p
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: "700",
                      color: "#111827",
                      margin: 0,
                    }}
                  >
                    {formatCurrency(balance)}
                  </p>
                </div>

                <div
                  style={{
                    textAlign: "center",
                    fontSize: "1rem",
                    color: "#6b7280",
                  }}
                >
                  ↓
                </div>

                <div
                  style={{
                    backgroundColor: "#fef3c7",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #fcd34d",
                  }}
                >
                  <p
                    style={{ fontSize: "0.75rem", color: "#92400e", margin: 0 }}
                  >
                    Fixed Suggested Savings ({savingsPercentage}%)
                  </p>
                  <p
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: "700",
                      color: "#f59e0b",
                      margin: 0,
                    }}
                  >
                    -{formatCurrency(totalSuggestedSavings)}
                  </p>
                </div>

                <div
                  style={{
                    textAlign: "center",
                    fontSize: "1rem",
                    color: "#6b7280",
                  }}
                >
                  ↓
                </div>

                <div
                  style={{
                    backgroundColor:
                      remainingBalance >= 0 ? "#d1fae5" : "#fee2e2",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: `1px solid ${remainingBalance >= 0 ? "#a7f3d0" : "#fecaca"}`,
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: remainingBalance >= 0 ? "#065f46" : "#991b1b",
                      margin: 0,
                    }}
                  >
                    Remaining Balance
                  </p>
                  <p
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "700",
                      color: remainingBalance >= 0 ? "#059669" : "#dc2626",
                      margin: 0,
                    }}
                  >
                    {formatCurrency(remainingBalance)}
                  </p>
                </div>
              </div>
            )}

            {remainingBalance < 0 && (!isMobile || isBalanceExpanded) && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "0.75rem",
                  backgroundColor: "#fee2e2",
                  borderRadius: "0.5rem",
                  border: "1px solid #fecaca",
                }}
              >
                <p
                  style={{
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                    color: "#991b1b",
                    margin: 0,
                    fontWeight: "500",
                  }}
                >
                  ⚠️ Your fixed suggested savings exceed your current balance by{" "}
                  {formatCurrency(Math.abs(remainingBalance))}
                </p>
              </div>
            )}
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {huchas.map((hucha, index) => (
              <div
                key={hucha.id}
                data-hucha-index={index}
                draggable={!isMobile}
                onDragStart={(e) => handleDragStart(e, hucha.id)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                onTouchStart={(e) => handleTouchStart(e)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`bg-white rounded-lg shadow-sm border-2 transition-all ${
                  draggedItem === hucha.id
                    ? "opacity-50 scale-95 border-blue-300"
                    : dragOverIndex === index && draggedItem
                      ? "border-blue-400 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                } ${isMobile ? "touch-manipulation" : "cursor-move"} ${
                  isDragging ? "select-none" : ""
                }`}
                style={{
                  transform:
                    draggedItem === hucha.id && isMobile
                      ? "rotate(2deg)"
                      : "none",
                  transition: isDragging ? "none" : "all 0.2s ease",
                }}
              >
                <div
                  onClick={(e) => handleItemClick(hucha.id, e)}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    cursor: isDragging ? "grabbing" : "pointer",
                  }}
                >
                  <div
                    style={{
                      padding: "1rem",
                      borderRadius: "0.5rem",
                      borderLeft: `6px solid ${hucha.color}`,
                      backgroundColor: "#f9fafb",
                      display: "flex",
                    }}
                  >
                    <div className="w-full">
                      <div className="flex justify-between">
                        <Category>
                          <h4 style={{ marginRight: "1rem" }}>{index + 1}</h4>
                          <CategoryICon id={hucha.name} />
                          {hucha.name}
                        </Category>
                        <ButtonContainer className="flex">
                          {/* Botones de reordenamiento */}
                          <div
                            className="flex items-center"
                            style={{ marginRight: "0.5rem" }}
                          >
                            <ActionButton
                              onClick={(e) => {
                                e.stopPropagation();
                                moveUp(index);
                              }}
                              disabled={index === 0}
                              style={{
                                width: "1.5rem",
                                height: "1.5rem",
                                opacity: index === 0 ? 0.3 : 1,
                                marginRight: "0.25rem",
                                background: "black",
                              }}
                              title="Move up"
                            >
                              <ArrowUpIcon />
                            </ActionButton>
                            <ActionButton
                              onClick={(e) => {
                                e.stopPropagation();
                                moveDown(index);
                              }}
                              disabled={index === huchas.length - 1}
                              style={{
                                width: "1.5rem",
                                height: "1.5rem",
                                opacity: index === huchas.length - 1 ? 0.3 : 1,
                                background: "black",
                              }}
                              title="Move down"
                            >
                              <ArrowDownIcon />
                            </ActionButton>
                          </div>

                          <ActionButton
                            as={Link}
                            to={`/money-box/${hucha.id}`}
                            style={!isMobile ? { width: "2.5rem" } : {}}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <EditIcon />
                          </ActionButton>
                          <ActionButton
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteHucha(hucha.id as string);
                            }}
                            style={!isMobile ? { width: "2.5rem" } : {}}
                          >
                            <DeleteIcon />
                          </ActionButton>
                        </ButtonContainer>
                      </div>

                      <p
                        style={{
                          fontSize: "0.875rem",
                          color: "#555",
                          marginTop: "1rem",
                        }}
                      >
                        {hucha.description}
                      </p>
                      <p style={{ fontSize: "1rem" }}>
                        <strong>Goal:</strong> {formatCurrency(hucha.goal)}
                      </p>
                      {hucha.deadline && (
                        <p style={{ fontSize: "1rem" }}>
                          <strong>Deadline:</strong>{" "}
                          {formatDate(hucha.deadline)}
                        </p>
                      )}
                      <p style={{ fontSize: "1rem" }}>
                        <>
                          {hucha.savings ? (
                            <>
                              <strong>Remaining: </strong>
                              {formatCurrency(hucha.remaining)}
                            </>
                          ) : (
                            <span>0</span>
                          )}
                        </>
                      </p>
                      <p style={{ fontSize: "1rem" }}>
                        <strong>Suggested saving:</strong>{" "}
                        <span>
                          {formatCurrency(getSuggestedSaving(hucha.id))}
                        </span>
                        {hasUnsavedChanges && (
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: "#f59e0b",
                              marginLeft: "0.5rem",
                            }}
                          >
                            (needs update)
                          </span>
                        )}
                      </p>

                      {isDeadlineApproaching(hucha) && (
                        <div
                          style={{
                            marginTop: "0.5rem",
                            padding: "0.5rem",
                            backgroundColor: "#fef3c7",
                            border: "1px solid #fcd34d",
                            borderRadius: "0.375rem",
                            color: "#92400e",
                            fontSize: "0.875rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          ⚠️ Deadline is approaching and goal is not reached!
                        </div>
                      )}

                      {!dismissedWarnings[hucha.id] &&
                        isSuggestedSavingInsufficient(hucha) && (
                          <div
                            style={{
                              marginTop: "0.5rem",
                              padding: "0.5rem",
                              backgroundColor: "#ecfdf5",
                              border: "1px solid #34d399",
                              borderRadius: "0.375rem",
                              color: "#065f46",
                              fontSize: "0.875rem",
                              display: "flex",
                              alignItems: "start",
                              justifyContent: "space-between",
                              gap: "0.5rem",
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              💡 At your current saving pace, you might not
                              reach the goal by the deadline, but you're getting
                              closer.
                              <p style={{ margin: 0, fontSize: "0.8rem" }}>
                                📌 You'd need to save{" "}
                                {formatCurrency(
                                  getRequiredMonthlySaving(hucha),
                                )}{" "}
                                per month to reach your goal.
                              </p>
                            </div>
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                setDismissedWarnings((prev) => ({
                                  ...prev,
                                  [hucha.id]: true,
                                }));
                              }}
                              style={{
                                background: "none",
                                border: "none",
                                fontWeight: "bold",
                                cursor: "pointer",
                                color: "#065f46",
                                padding: "0 0.25rem",
                                fontSize: "1rem",
                              }}
                              aria-label="Dismiss warning"
                              title="Dismiss"
                            >
                              ×
                            </button>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/money-box/new"
            style={{
              marginTop: "2rem",
              display: "block",
              textAlign: "center",
              backgroundColor: "#000",
              color: "white",
              padding: "1rem",
              borderRadius: "0.5rem",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            + New Box
          </Link>
        </div>
      </div>
    </>
  );
}
