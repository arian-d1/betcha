// components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "./contexts/UserContext";
import { useContext } from "react";

export default function ProtectedRoute() {
  // Replace this with your actual Auth state (e.g., from a context or Redux)
  const user = useContext(UserContext); 

  if (!user.isAuthenticated) {
    // We use 'replace' so the user can't click 'back' to the protected page
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}