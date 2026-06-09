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
          <Encabezado />
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/pelicula/:imdbID" element={<DetallePelicula />} />
            <Route path="/favoritos" element={<PaginaDeFavoritos />} />
          </Routes>
          <PieDePagina />
        </ProveedorFavoritos>
      </ProveedorBusqueda>
    </Enrutador>
  );
}

export default App;
