import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  collection,
  Timestamp,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import useAuth from "../context/useAuth";
import { Helmet } from "react-helmet-async";
import { Header, Title } from "../elements/Header";
import BackBtn from "../elements/BackBtn";
import { FilterContainer, Form, Input } from "../elements/FormElements";
import Button from "../elements/Button";
import Spinner from "../elements/SpinnerLoader";
import EditIcon from "../assets/images/editar.svg?react";
import theme from "../theme";
import useIsMobile from "../hooks/useIsMobile";
import { Category } from "../elements/ListElements";
import CategoryICon from "../elements/CategoryIcons";

interface Hucha {
  id: string;
  name: string;
  goal: number;
  description: string;
  color: string;
  createdAt?: Timestamp;
  deadline?: Timestamp;
}

interface Saving {
  id: string;
  amount: number;
  createdAt: Timestamp;
}

export default function HuchaDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [hucha, setHucha] = useState<Hucha | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [savings, setSavings] = useState<Saving[]>([]);
  const [isEditingGoal, setIsEditingGoal] = useState<boolean>(false);
  const [newGoal, setNewGoal] = useState<string>("");
  const [isEditingDeadline, setIsEditingDeadline] = useState(false);
  const [newDeadline, setNewDeadline] = useState<string>("");

  const isMobile = useIsMobile();

  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    if (!user || !id) return;

    const fetchHucha = async () => {
      const docRef = doc(db, "huchas", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as DocumentData;
        const huchaData = { id: docSnap.id, ...data } as Hucha;
        setHucha(huchaData);
        setNewGoal(huchaData.goal.toString());
        if (huchaData.deadline) {
          setNewDeadline(
            huchaData.deadline.toDate().toISOString().split("T")[0],
          );
        }
      }
    };

    fetchHucha();

    const q = query(
      collection(db, "huchas", id, "savings"),
      where("userId", "==", user.uid),
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setSavings(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Saving, "id">),
          amount: Number(doc.data().amount),
        })),
      );
    });

    return () => unsub();
  }, [user, id]);

  const handleDeadlineUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id || !newDeadline) return;

    try {
      const docRef = doc(db, "huchas", id);
      await updateDoc(docRef, {
        deadline: Timestamp.fromDate(new Date(newDeadline)),
      });

      if (hucha) {
        setHucha({
          ...hucha,
          deadline: Timestamp.fromDate(new Date(newDeadline)),
        });
      }
      setIsEditingDeadline(false);
    } catch (error) {
      console.error("Error updating deadline:", error);
    }
  };

  const handleCancelDeadlineEdit = () => {
    setNewDeadline(hucha?.deadline?.toDate().toISOString().split("T")[0] || "");
    setIsEditingDeadline(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id || Number(amount) <= 0) return;

    await addDoc(collection(db, "huchas", id, "savings"), {
      amount: Number(amount),
      userId: user.uid,
      createdAt: Timestamp.now(),
    });
    setAmount("");
  };

  const handleGoalUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id || Number(newGoal) <= 0) return;

    try {
      const docRef = doc(db, "huchas", id);
      await updateDoc(docRef, {
        goal: Number(newGoal),
      });

      // Actualizar el estado local
      if (hucha) {
        setHucha({ ...hucha, goal: Number(newGoal) });
      }
      setIsEditingGoal(false);
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const handleCancelEdit = () => {
    setNewGoal(hucha?.goal.toString() || "");
    setIsEditingGoal(false);
  };

  const totalSaved = savings.reduce((acc, s) => acc + s.amount, 0);
  const progress = hucha ? Math.min((totalSaved / hucha.goal) * 100, 100) : 0;

  const getExpectedSavings = (): number | null => {
    if (!hucha?.createdAt || !hucha?.deadline) return null;

    const created = hucha.createdAt.toDate();
    const deadline = hucha.deadline.toDate();
    const now = new Date();

    if (now < created) return 0;

    const totalMonths =
      (deadline.getFullYear() - created.getFullYear()) * 12 +
      (deadline.getMonth() - created.getMonth()) +
      1;

    const monthsPassed =
      (now.getFullYear() - created.getFullYear()) * 12 +
      (now.getMonth() - created.getMonth()) +
      1; // +1 para incluir mes actual

    if (totalMonths <= 0) return hucha.goal;

    const expected = (hucha.goal / totalMonths) * monthsPassed;
    return Math.min(expected, hucha.goal);
  };

  if (!hucha)
    return (
      <div>
        <div className="text-center mt-4">
          <Spinner fullscreen />
        </div>
      </div>
    );

  return (
    <>
      <Helmet>
        <title>Add Savings</title>
        <link rel="icon" type="image/x-icon" href="../public/favicon.ico" />
      </Helmet>
      <div
        className={`bg-white m-6 border-2 rounded-lg border-double`}
        style={{ borderColor: hucha.color }}
      >
        <Header>
          <BackBtn route="/money-box" />
          <Title>Add Savings</Title>
        </Header>
        <div style={{ padding: "2.5rem", width: "100%" }}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div
              style={{
                padding: "1rem",
              }}
            >
              <div className="flex mb-4">
                <Category>
                  <CategoryICon id={hucha.name} />
                </Category>
                <h2 style={{ fontWeight: "700", fontSize: "1.25rem" }}>
                  {hucha.name.toUpperCase()}
                </h2>
              </div>
              <span className="font-semibold pt-4">
                Description:{" "}
                {
                  <span className="font-medium">
                    {hucha.description.charAt(0).toUpperCase() +
                      hucha.description.substring(1)}
                  </span>
                }
              </span>

              {/* Goal Section with Edit Functionality */}
              <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                {!isEditingGoal ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <p className="font-semibold">
                      {" "}
                      Goal: {<span className="font-medium">{hucha.goal}</span>}€
                    </p>
                    <button
                      onClick={() => setIsEditingGoal(true)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "0.25rem",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                      }}
                      title="Edit goal"
                    >
                      <EditIcon style={{ width: "16px", height: "16px" }} />
                    </button>
                  </div>
                ) : (
                  <Form
                    onSubmit={handleGoalUpdate}
                    style={{ margin: 0, padding: 0 }}
                  >
                    <FilterContainer
                      style={{ alignItems: "center", margin: 0 }}
                    >
                      <div
                        style={
                          isMobile
                            ? { flex: 1, marginRight: "0.5rem" }
                            : { display: "grid" }
                        }
                      >
                        <label
                          className="text-xs font-semibold pb-2"
                          htmlFor="amount"
                        >
                          Change piggy
                        </label>
                        <Input
                          type="number"
                          value={newGoal}
                          onChange={(e) => setNewGoal(e.target.value)}
                          required
                          placeholder="New goal"
                          min="1"
                          step="0.01"
                        />
                      </div>
                      <div className="flex justify-end w-full">
                        <Button
                          as="button"
                          to="#"
                          type="submit"
                          style={{
                            textAlign: "center",
                            marginRight: "0.5rem",
                            fontSize: "0.875rem",
                            padding: "0.5rem 1rem",
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          as="button"
                          to="#"
                          $color={theme.grisClaro}
                          $textColor="#000"
                          type="button"
                          onClick={handleCancelEdit}
                          style={{
                            textAlign: "center",
                            fontSize: "0.875rem",
                            padding: "0.5rem 1rem",
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </FilterContainer>
                  </Form>
                )}
              </div>

              <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                {!isEditingDeadline ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <p className="font-semibold">
                      Deadline:{" "}
                      <span className="font-medium">
                        {formatDate(hucha.deadline!)}
                      </span>
                    </p>
                    <button
                      onClick={() => setIsEditingDeadline(true)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "0.25rem",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                      }}
                      title="Edit deadline"
                    >
                      <EditIcon style={{ width: "16px", height: "16px" }} />
                    </button>
                  </div>
                ) : (
                  <Form
                    onSubmit={handleDeadlineUpdate}
                    style={{ margin: 0, padding: 0 }}
                  >
                    <FilterContainer
                      style={{ alignItems: "center", margin: 0 }}
                    >
                      <div
                        style={
                          isMobile
                            ? { flex: 1, marginRight: "0.5rem" }
                            : { display: "grid" }
                        }
                      >
                        <label
                          className="text-xs font-semibold pb-2"
                          htmlFor="deadline"
                        >
                          Change deadline
                        </label>
                        <Input
                          type="date"
                          value={newDeadline}
                          onChange={(e) => setNewDeadline(e.target.value)}
                          required
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                      <div className="flex justify-end w-full">
                        <Button
                          as="button"
                          to="#"
                          type="submit"
                          style={{
                            textAlign: "center",
                            marginRight: "0.5rem",
                            fontSize: "0.875rem",
                            padding: "0.5rem 1rem",
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          as="button"
                          to="#"
                          $color={theme.grisClaro}
                          $textColor="#000"
                          type="button"
                          onClick={handleCancelDeadlineEdit}
                          style={{
                            textAlign: "center",
                            fontSize: "0.875rem",
                            padding: "0.5rem 1rem",
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </FilterContainer>
                  </Form>
                )}
              </div>

              <p className="font-semibold">
                {" "}
                Savings:{" "}
                {
                  <span className="font-medium">
                    {totalSaved}€ / {hucha.goal}€
                  </span>
                }{" "}
                ({progress.toFixed(1)}%)
              </p>

              {(() => {
                const expected = getExpectedSavings();
                if (expected !== null) {
                  return (
                    <p className="text-sm text-gray-600 mt-1">
                      💡 You should have saved{" "}
                      <span className="font-semibold">
                        {expected.toFixed(2)}€
                      </span>{" "}
                      by now to stay on track.
                    </p>
                  );
                }
                return null;
              })()}

              <div style={{ marginTop: "2rem", marginBottom: "4rem" }}>
                <p style={{ fontWeight: "600", fontSize: "1rem" }}>Progress</p>
                <div
                  style={{
                    backgroundColor: "#e5e7eb",
                    borderRadius: "8px",
                    overflow: "hidden",
                    height: "24px",
                  }}
                >
                  <div
                    style={{
                      width: `${progress}%`,
                      backgroundColor: hucha.color || "#3b82f6",
                      height: "100%",
                      transition: "width 0.3s ease-in-out",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    {progress.toFixed(0)}%
                  </div>
                </div>
              </div>

              <Form onSubmit={handleSave} style={{ padding: 0 }}>
                <FilterContainer style={{ alignItems: "center" }}>
                  <div
                    style={
                      isMobile
                        ? { flex: 1, marginRight: "0.5rem" }
                        : { display: "grid" }
                    }
                  >
                    <label
                      className="text-xs font-semibold pb-2"
                      htmlFor="amount"
                    >
                      Add saving
                    </label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    as="button"
                    to="#"
                    type="submit"
                    $width="100%"
                    style={{ textAlign: "center" }}
                  >
                    Add +
                  </Button>
                </FilterContainer>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
