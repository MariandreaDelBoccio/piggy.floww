import { useContext } from "react";
import { AuthContext } from "./AuthContext";

// Hook
const useAuth = () => {
  const context = useContext(AuthContext)
  if(!context) throw new Error('UseAuth must be used within AuthProvider')
  return context
}

export default useAuth;