import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { STORAGE_KEYS } from "../config";
import { obtenerFavoritosAPI, toggleFavoritoAPI } from "../services/obtenerFavoritos";

const ContextoFavoritos = createContext();

export const useFavoritos = () => {
  const contexto = useContext(ContextoFavoritos);
  if (!contexto) {
    throw new Error("useFavoritos debe usarse dentro de ProveedorFavoritos");
  }
  return contexto;
};

const obtenerFavoritosLocales = () => {
  try {
    const guardado = localStorage.getItem(STORAGE_KEYS.FAVORITOS);
    return guardado ? JSON.parse(guardado) : [];
  } catch {
    return [];
  }
};

export const ProveedorFavoritos = ({ children }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarFavoritos = async () => {
      const datosAPI = await obtenerFavoritosAPI();
      if (datosAPI !== null) {
        setFavoritos(datosAPI);
        localStorage.setItem(STORAGE_KEYS.FAVORITOS, JSON.stringify(datosAPI));
      } else {
        setFavoritos(obtenerFavoritosLocales());
      }
      setCargando(false);
    };
    cargarFavoritos();
  }, []);

  useEffect(() => {
    if (!cargando) {
      localStorage.setItem(STORAGE_KEYS.FAVORITOS, JSON.stringify(favoritos));
    }
  }, [favoritos, cargando]);

  const esFavorito = useCallback(
    (id) => favoritos.some((p) => p.imdbID === id),
    [favoritos],
  );

  const alternarFavorito = useCallback(async (pelicula) => {
    setFavoritos((prev) => {
      const yaExiste = prev.find((p) => p.imdbID === pelicula.imdbID);
      return yaExiste
        ? prev.filter((p) => p.imdbID !== pelicula.imdbID)
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
