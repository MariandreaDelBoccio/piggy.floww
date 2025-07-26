import useAuth from "../context/useAuth"
import { Navigate, Outlet } from "react-router-dom"

const PrivateRoute = () => {
    const { user, loading } = useAuth()

    if(loading) return null

    return user ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute