import { useEffect, useState, useContext } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
  deleteDoc,
  doc,
  getDocs,
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
import { BalanceContext } from "../context/BalanceContext";

type Hucha = {
  id: string;
  name: string;
  goal: number;
  description: string;
  color: string;
  deadline: Timestamp;
  savings: Saving[];
  remaining: number;
};

type Saving = {
  amount: number;
};

type HuchaConAhorros = Hucha & {
  savings: Saving[];
  remaining: number;
};

export default function HuchasList() {
  const navigate = useNavigate();
  const [huchas, setHuchas] = useState<Hucha[]>([]);
  const { user } = useAuth();
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const { balance } = useContext(BalanceContext);

  const getSuggestedSaving = (huchaId: string): number => {
    if (balance <= 0) return 0;

    const savingsBudget = balance * 0.8;

    const now = new Date();
    const eligibleHuchas = huchas.filter((h) => h.remaining > 0);

    // Calcular peso combinado: deadline + prioridad
    const weights = eligibleHuchas.map((h, index) => {
      // Días restantes para el deadline
      const daysToDeadline = h.deadline
        ? Math.max(
            1,
            Math.ceil(
              (h.deadline.toDate().getTime() - now.getTime()) /
                (1000 * 60 * 60 * 24),
            ),
          )
        : 9999; // Si no hay deadline, es poco urgente

      const urgencyFactor = 1 / daysToDeadline; // cuanto más cerca, mayor peso
      const priorityFactor = 1 / (index + 1); // cuanto más arriba, mayor peso

      return urgencyFactor + priorityFactor;
    });

    const totalWeight = weights.reduce((acc, w) => acc + w, 0);
    const currentIndex = eligibleHuchas.findIndex((h) => h.id === huchaId);
    if (currentIndex === -1) return 0;

    const currentWeight = weights[currentIndex];
    const suggested = (savingsBudget * currentWeight) / totalWeight;

    return Math.min(
      eligibleHuchas[currentIndex].remaining,
      parseFloat(suggested.toFixed(2)),
    );
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
      setHuchas(huchasData);
    });

    return () => unsub();
  }, [user]);

  const deleteHucha = async (id: string) => {
    await deleteDoc(doc(db, "huchas", id));
    navigate("/money-box");
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();

    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = huchas.findIndex((p) => p.id === draggedItem);
    const targetIndex = huchas.findIndex((p) => p.id === targetId);

    const newPiggyBanks = [...huchas];
    const [draggedPiggy] = newPiggyBanks.splice(draggedIndex, 1);
    newPiggyBanks.splice(targetIndex, 0, draggedPiggy);

    // Update priorities based on new order
    const updatedPiggyBanks = newPiggyBanks.map((piggy, index) => ({
      ...piggy,
      priority: index + 1,
    }));

    const prioritized = huchas.map((h, index) => ({
      ...h,
      priority: index + 1,
    }));
    setHuchas(prioritized);

    setHuchas(updatedPiggyBanks);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <>
      <Helmet>
        <title>Piggy Bank</title>
        <link rel="icon" type="image/x-icon" href="../public/favicon.ico" />
      </Helmet>
      <Header>
        <BackBtn />
        <Title>Piggy Bank</Title>
      </Header>
      <div style={{ padding: "2.5rem", width: "100%", height: '100vh' }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {huchas.map((hucha, index) => (
            <div
              key={hucha.id}
              draggable
              onDragStart={(e) => handleDragStart(e, hucha.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, hucha.id)}
              onDragEnd={handleDragEnd}
              className={`bg-white rounded-lg shadow-sm border-2 border-gray-200 hover:border-gray-300 transition-all cursor-move ${
                draggedItem === hucha.id ? "opacity-50 scale-95" : ""
              }`}
            >
              <div
                onClick={() => navigate(`/money-box/${hucha.id}`)}
                key={hucha.id}
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
                    borderLeft: `6px solid ${hucha.color}`,
                    backgroundColor: "#f9fafb",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <Category>
                      <h4 style={{ marginRight: "1rem" }}>{index + 1}</h4>
                      <CategoryICon id={hucha.name} />
                      {hucha.name}
                    </Category>

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
                        <strong>Deadline:</strong> {formatDate(hucha.deadline)}
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
                      {formatCurrency(getSuggestedSaving(hucha.id))}
                    </p>
                  </div>
                  <ElementList style={{ borderBottom: "none" }}>
                    <ButtonContainer>
                      <ActionButton as={Link} to={`/money-box/${hucha.id}`}>
                        <EditIcon />
                      </ActionButton>
                      <ActionButton
                        onClick={() => deleteHucha(hucha.id as string)}
                      >
                        <DeleteIcon />
                      </ActionButton>
                    </ButtonContainer>
                  </ElementList>
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
            backgroundColor: "#5B69E2",
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

      <BalanceBar />
      <TotalBar />
    </>
  );
}
