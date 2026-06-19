import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/ContextoAuth";

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === "admin" && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
