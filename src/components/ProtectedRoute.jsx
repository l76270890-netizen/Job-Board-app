// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom"; // ADD useLocation
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { currentUser, userData } = useAuth();
  const location = useLocation(); // ADD THIS

  if (!currentUser) return <Navigate to="/login" state={{ from: location }} replace />;
  if (roles?.length && !roles.includes(userData?.role)) return <Navigate to="/" replace />;
  return children;
}
