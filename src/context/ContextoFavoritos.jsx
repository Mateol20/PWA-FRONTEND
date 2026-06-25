import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  obtenerFavoritosAPI,
  toggleFavoritoAPI,
} from "../services/obtenerFavoritos";
import { useAuth } from "./AuthContext";
import { clearCache } from "../utils/cache";

const ContextoFavoritos = createContext();

export const useFavoritos = () => {
  const contexto = useContext(ContextoFavoritos);
  if (!contexto) {
    throw new Error("useFavoritos debe usarse dentro de ProveedorFavoritos");
  }
  return contexto;
};

export const ProveedorFavoritos = ({ children }) => {
  const { user, token } = useAuth();
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    clearCache("favoritos");
    const cargarFavoritos = async () => {
      setCargando(true);
      const datosAPI = await obtenerFavoritosAPI();
      if (datosAPI !== null) {
        setFavoritos(datosAPI);
      } else if (!token) {
        setFavoritos([]);
      }
      setCargando(false);
    };
    cargarFavoritos();
  }, [token]);

  const esFavorito = useCallback(
    (id) => favoritos.some((p) => p.Id === id),
    [favoritos],
  );

  const alternarFavorito = useCallback(
    async (pelicula) => {
      const yaEraFavorito = favoritos.some((p) => p.Id === pelicula.Id);

      setFavoritos((prev) => {
        return yaEraFavorito
          ? prev.filter((p) => p.Id !== pelicula.Id)
          : [...prev, pelicula];
      });
      try {
        await toggleFavoritoAPI(pelicula);
      } catch {
        setFavoritos((prev) => {
          return yaEraFavorito
            ? [...prev, pelicula]
            : prev.filter((p) => p.Id !== pelicula.Id);
        });
      }
    },
    [favoritos],
  );

  const valor = useMemo(
    () => ({ favoritos, alternarFavorito, esFavorito, cargando }),
    [favoritos, alternarFavorito, esFavorito, cargando],
  );

  return (
    <ContextoFavoritos.Provider value={valor}>
      {children}
    </ContextoFavoritos.Provider>
  );
};
