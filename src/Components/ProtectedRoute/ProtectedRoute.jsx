import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/ContextoAuth";

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, isAdmin, cargando } = useAuth();

  if (cargando) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><p className="text-blue-400 animate-pulse">Cargando...</p></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === "admin" && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
