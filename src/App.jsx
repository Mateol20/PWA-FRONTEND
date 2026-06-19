import { Suspense } from "react";
import { BrowserRouter as Enrutador, Routes, Route } from "react-router-dom";
import { ProveedorAuth } from "./context/ContextoAuth";
import { ProveedorFavoritos } from "./context/ContextoFavoritos";
import { ProveedorBusqueda } from "./context/ContextoBusqueda";
import Inicio from "./pages/Home/Home";
import DetallePelicula from "./pages/DetallePelicula/DetallePelicula";
import PaginaDeFavoritos from "./pages/Favoritos/PaginaDeFavoritos";
import Dashboard from "./pages/Admin/Dashboard";
import { Login, Register } from "./pages/Auth";
import PublicLayout from "./layouts/publicLayout";
import AdminLayout from "./layouts/adminLayout";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <Enrutador>
      <ProveedorAuth>
        <ProveedorBusqueda>
          <ProveedorFavoritos>
            <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><p className="text-blue-400 animate-pulse">Cargando...</p></div>}>
              <Routes>
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Inicio />} />
                  <Route path="/pelicula/:id" element={<DetallePelicula />} />
                  <Route path="/favoritos" element={<PaginaDeFavoritos />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>
                <Route element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
                  <Route path="/admin" element={<Dashboard />} />
                </Route>
              </Routes>
            </Suspense>
          </ProveedorFavoritos>
        </ProveedorBusqueda>
      </ProveedorAuth>
    </Enrutador>
  );
}

export default App;
