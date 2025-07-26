import React, { useEffect, useState } from "react";
import {
  GripVertical,
  Target,
  Calendar,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import useAuth from "../context/useAuth";

// type PiggyBank = {
//   id: string;
//   name: string;
//   targetAmount: number;
//   currentAmount: number;
//   deadline: Date;
//   priority: number;
//   color: string;
//   icon: string;
// };

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

export default function PiggyBankPriorityManager() {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const { user } = useAuth();
  const [piggyBanks, setHuchas] = useState<Hucha[]>([]);

  // const formatCurrency = (amount: number) => {
  //   return new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: "USD",
  //   }).format(amount);
  // };

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

  // const getMonthsRemaining = (deadline: Date) => {
  //   const now = new Date();
  //   const months =
  //     (deadline.getFullYear() - now.getFullYear()) * 12 +
  //     (deadline.getMonth() - now.getMonth());
  //   return months;
  // };

  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // const getMonthlyNeeded = (piggy: PiggyBank) => {
  //   const remaining = piggy.targetAmount - piggy.currentAmount;
  //   const months = getMonthsRemaining(piggy.deadline);
  //   return months > 0 ? remaining / months : remaining;
  // };

  // const getUrgencyStatus = (piggy: PiggyBank) => {
  //   const months = getMonthsRemaining(piggy.deadline);
  //   const progress = piggy.currentAmount / piggy.targetAmount;

  //   if (months <= 2)
  //     return { status: "critical", color: "#dc2626", label: "CRITICAL" };
  //   if (months <= 6)
  //     return { status: "urgent", color: "#ea580c", label: "URGENT" };
  //   if (progress >= 0.8)
  //     return { status: "good", color: "#16a34a", label: "ON TRACK" };
  //   return { status: "normal", color: "#6b7280", label: "NORMAL" };
  // };

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

    const draggedIndex = piggyBanks.findIndex((p) => p.id === draggedItem);
    const targetIndex = piggyBanks.findIndex((p) => p.id === targetId);

    const newPiggyBanks = [...piggyBanks];
    const [draggedPiggy] = newPiggyBanks.splice(draggedIndex, 1);
    newPiggyBanks.splice(targetIndex, 0, draggedPiggy);

    // Update priorities based on new order
    const updatedPiggyBanks = newPiggyBanks.map((piggy, index) => ({
      ...piggy,
      priority: index + 1,
    }));

    setHuchas(updatedPiggyBanks);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Savings Priorities
        </h1>
        <p className="text-gray-600 mb-4">
          Drag and drop to reorder your savings goals by importance. Higher
          priority goals will receive more funding.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 font-medium">
              Smart Allocation Active
            </span>
          </div>
          <p className="text-blue-700 text-sm">
            Goals with approaching deadlines may be automatically prioritized
            regardless of manual ranking.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {piggyBanks.map((piggy, index) => {
          // const urgency = getUrgencyStatus(piggy);
          // const monthlyNeeded = getMonthlyNeeded(piggy);
          // const progress = (piggy.currentAmount / piggy.targetAmount) * 100;

          return (
            <div
              key={piggy.id}
              draggable
              onDragStart={(e) => handleDragStart(e, piggy.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, piggy.id)}
              onDragEnd={handleDragEnd}
              className={`bg-white rounded-lg shadow-sm border-2 border-gray-200 hover:border-gray-300 transition-all cursor-move ${
                draggedItem === piggy.id ? "opacity-50 scale-95" : ""
              }`}
            >
              <div className="p-4">
                <div className="flex items-center gap-4">
                  {/* Drag Handle & Priority */}
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>

                  {/* Piggy Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {/* <span className="text-2xl">{piggy.icon}</span> */}
                      <h3 className="text-lg font-semibold text-gray-900">
                        {piggy.name}
                      </h3>
                      {/* <span
                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: urgency.color }}
                      >
                        {urgency.label}
                      </span> */}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        {/* <span>
                          {formatCurrency(piggy.currentAmount)} of{" "}
                          {formatCurrency(piggy.targetAmount)}
                        </span>
                        <span>{Math.round(progress)}% complete</span> */}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        {/* <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(progress, 100)}%`,
                            backgroundColor: piggy.color,
                          }}
                        /> */}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-gray-500" />
                        {/* <span className="text-gray-600">
                          Need: {formatCurrency(monthlyNeeded)}/month
                        </span> */}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Due: {formatDate(piggy.deadline)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">
                          {formatDate(piggy.deadline)} months left
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-center">
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
          Save Priority Changes
        </button>
      </div>

      {/* Preview of changes */}
      <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-medium text-gray-900 mb-3">
          Current Priority Order:
        </h3>
        <div className="flex flex-wrap gap-2">
          {piggyBanks.map((piggy, index) => (
            <span
              key={piggy.id}
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
            >
              <span>{index + 1}.</span>
              {/* <span>{piggy.icon}</span> */}
              <span>{piggy.name}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
