import { Suspense } from "react";
import { BrowserRouter as Enrutador, Routes, Route } from "react-router-dom";
import { ProveedorFavoritos } from "./context/ContextoFavoritos";
import { ProveedorBusqueda } from "./context/ContextoBusqueda";
import Inicio from "./pages/Home/Home";
import Encabezado from "./Components/Header/Header";
import PieDePagina from "./Components/Footer/Footer";
import DetallePelicula from "./pages/DetallePelicula/DetallePelicula";
import PaginaDeFavoritos from "./pages/Favoritos/PaginaDeFavoritos";

function App() {
  return (
    <Enrutador>
      <ProveedorBusqueda>
        <ProveedorFavoritos>
          <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><p className="text-blue-400 animate-pulse">Cargando...</p></div>}>
          <Encabezado />
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/pelicula/:id" element={<DetallePelicula />} />
            <Route path="/favoritos" element={<PaginaDeFavoritos />} />
          </Routes>
          <PieDePagina />
          </Suspense>
        </ProveedorFavoritos>
      </ProveedorBusqueda>
    </Enrutador>
  );
}

export default App;
