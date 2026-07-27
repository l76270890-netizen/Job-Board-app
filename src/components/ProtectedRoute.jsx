// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom"; // ADD useLocation
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation(); // ADD THIS

  return currentUser? children : <Navigate to="/login" state={{ from: location }} replace />; // SEND "from"
}