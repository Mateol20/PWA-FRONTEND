import { Suspense } from "react";
import { BrowserRouter as Enrutador, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProveedorFavoritos } from "./context/ContextoFavoritos";
import { ProveedorBusqueda } from "./context/ContextoBusqueda";
import Inicio from "./pages/Home/Home";
import DetallePelicula from "./pages/DetallePelicula/DetallePelicula";
import PaginaDeFavoritos from "./pages/Favoritos/PaginaDeFavoritos";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Admin/Dashboard";
import Movies from "./pages/Admin/Movies";
import NotFound from "./pages/NotFound/NotFound";
import PublicLayout from "./layouts/publicLayout";
import AdminLayout from "./layouts/adminLayout";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Enrutador>
        <ProveedorBusqueda>
          <ProveedorFavoritos>
            <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><p className="text-blue-400 animate-pulse">Cargando...</p></div>}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Inicio />} />
                  <Route path="/pelicula/:id" element={<DetallePelicula />} />
                  <Route path="/favoritos" element={<ProtectedRoute><PaginaDeFavoritos /></ProtectedRoute>} />
                </Route>
                <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
                  <Route index element={<Dashboard />} />
                  <Route path="peliculas" element={<Movies />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ProveedorFavoritos>
        </ProveedorBusqueda>
      </Enrutador>
    </AuthProvider>
  );
}

export default App;
