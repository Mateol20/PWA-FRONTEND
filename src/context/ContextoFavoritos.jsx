import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { obtenerFavoritosAPI, toggleFavoritoAPI } from "../services/obtenerFavoritos";

const ContextoFavoritos = createContext();

export const useFavoritos = () => {
  const contexto = useContext(ContextoFavoritos);
  if (!contexto) {
    throw new Error("useFavoritos debe usarse dentro de ProveedorFavoritos");
  }
  return contexto;
};

export const ProveedorFavoritos = ({ children }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarFavoritos = async () => {
      const datosAPI = await obtenerFavoritosAPI();
      if (datosAPI !== null) {
        setFavoritos(datosAPI);
      }
      setCargando(false);
    };
    cargarFavoritos();
  }, []);

  const esFavorito = useCallback(
    (id) => favoritos.some((p) => p.Id === id),
    [favoritos],
  );

  const alternarFavorito = useCallback(async (pelicula) => {
    setFavoritos((prev) => {
      const yaExiste = prev.find((p) => p.Id === pelicula.Id);
      return yaExiste
        ? prev.filter((p) => p.Id !== pelicula.Id)
        : [...prev, pelicula];
    });

    await toggleFavoritoAPI(pelicula);
  }, []);

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
