import React, { createContext, useEffect, useState } from "react";
import type { AuthContextType } from "../types/types";
import { auth } from '../firebase/firebaseConfig'
import { onAuthStateChanged, type User } from "firebase/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, changeLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      changeLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      { children }
    </AuthContext.Provider>
  )
}

export {AuthContext, AuthProvider};