import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import useAuth from "../context/useAuth";
import { collection, onSnapshot, query, orderBy, where, doc, getDoc } from "firebase/firestore";
import { getUnixTime, addDays, subDays, startOfDay } from "date-fns";
import type { FbStorageExpenses } from "../types/types";

interface UserSettings {
  monthStartDay: number;
}

const useGetMonthlyExpense = () => {
    const [expense, setExpense] = useState<FbStorageExpenses[]>([]);
    const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
    const { user } = useAuth();

    // Function to calculate custom month boundaries
    const getCustomMonthBoundaries = (monthStartDay: number) => {
        const today = new Date();
        const currentDay = today.getDate();
        
        let monthStart: Date;
        let monthEnd: Date;

        if (currentDay >= monthStartDay) {
            // We're in the current financial month
            monthStart = new Date(today.getFullYear(), today.getMonth(), monthStartDay);
            monthEnd = subDays(
                new Date(today.getFullYear(), today.getMonth() + 1, monthStartDay),
                1
            );
        } else {
            // We're still in the previous financial month
            monthStart = new Date(today.getFullYear(), today.getMonth() - 1, monthStartDay);
            monthEnd = subDays(
                new Date(today.getFullYear(), today.getMonth(), monthStartDay),
                1
            );
        }

        return {
            startMonth: getUnixTime(startOfDay(monthStart)),
            endMonth: getUnixTime(startOfDay(addDays(monthEnd, 1))) - 1 // End of day
        };
    };

    // Load user settings
    useEffect(() => {
        const loadUserSettings = async () => {
            if (!user) return;
            
            try {
                const settingsDoc = await getDoc(doc(db, "userSettings", user.uid));
                if (settingsDoc.exists()) {
                    const settings = settingsDoc.data() as UserSettings;
                    setUserSettings(settings);
                } else {
                    // Default to day 1 if no settings exist
                    setUserSettings({ monthStartDay: 1 });
                }
            } catch (error) {
                console.error("Error loading user settings:", error);
                // Fallback to default
                setUserSettings({ monthStartDay: 1 });
            }
        };

        loadUserSettings();
    }, [user]);

    // Fetch expenses based on custom month boundaries
    useEffect(() => {
        if (!user || !userSettings) return;

        const { startMonth, endMonth } = getCustomMonthBoundaries(userSettings.monthStartDay);

        const request = query(
            collection(db, 'expenses'),
            orderBy('date', 'desc'),
            where('date', '>=', startMonth),
            where('date', '<=', endMonth),
            where('id', '==', user?.uid)
        );

        const unsubscribe = onSnapshot(request, (snapshot) => {
            setExpense(snapshot.docs.map((doc) => {
                return { ...doc.data(), id: doc.id } as FbStorageExpenses
            }))
        }, (error) => console.error("Error fetching expenses:", error));

        return unsubscribe;

    }, [user, userSettings]);

    return {
        expense,
        monthBoundaries: userSettings ? getCustomMonthBoundaries(userSettings.monthStartDay) : null,
        userSettings
    };
};

export default useGetMonthlyExpense;