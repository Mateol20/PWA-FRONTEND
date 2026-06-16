import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { STORAGE_KEYS } from "../config";

const ContextoFavoritos = createContext();

/* eslint-disable react-refresh/only-export-components */
export const useFavoritos = () => {
  const contexto = useContext(ContextoFavoritos);
  if (!contexto) {
    throw new Error("useFavoritos debe usarse dentro de ProveedorFavoritos");
  }
  return contexto;
};

const obtenerFavoritosGuardados = () => {
  try {
    const guardado = localStorage.getItem(STORAGE_KEYS.FAVORITOS);
    return guardado ? JSON.parse(guardado) : [];
  } catch {
    return [];
  }
};

export const ProveedorFavoritos = ({ children }) => {
  const [favoritos, setFavoritos] = useState(obtenerFavoritosGuardados);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITOS, JSON.stringify(favoritos));
  }, [favoritos]);

  const valor = useMemo(() => {
    const esFavorito = (id) => favoritos.some((p) => p.imdbID === id);
    const alternarFavorito = (pelicula) => {
      setFavoritos((prev) => {
        const yaExiste = prev.find((p) => p.imdbID === pelicula.imdbID);
        return yaExiste
          ? prev.filter((p) => p.imdbID !== pelicula.imdbID)
          : [...prev, pelicula];
      });
    };
    return { favoritos, alternarFavorito, esFavorito };
  }, [favoritos, setFavoritos]);

  return (
    <ContextoFavoritos.Provider value={valor}>
      {children}
    </ContextoFavoritos.Provider>
  );
};
