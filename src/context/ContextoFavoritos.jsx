import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { API_BASE_URL } from "../config";

const ContextoFavoritos = createContext();

const ID_USUARIO = 1;
const BASE_URL = API_BASE_URL.replace("/api/peliculas", "");

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
      try {
        const res = await fetch(`${BASE_URL}/api/peliculas/favoritas?idUsuario=${ID_USUARIO}`);
        if (res.ok) {
          const json = await res.json();
          const mapeados = (json.data || []).map((f) => ({
            imdbID: String(f.pelicula.Id),
            Title: f.pelicula.Title,
            Year: f.pelicula.Year,
            Poster: f.pelicula.Poster,
            imdbRating: String(f.pelicula.imdbRating),
            Runtime: String(f.pelicula.Runtime),
            Director: f.pelicula.Director,
            Plot: f.pelicula.Plot,
            Images: [f.pelicula.Images],
            Actors: f.pelicula.Actors,
            Type: f.pelicula.Type || "movie",
            Genre: f.pelicula.Genre || "N/A",
          }));
          setFavoritos(mapeados);
        }
      } catch {
        console.warn("No se pudieron cargar favoritos desde el backend");
      } finally {
        setCargando(false);
      }
    };
    cargarFavoritos();
  }, []);

  const alternarFavorito = useCallback(async (pelicula) => {
    const idPelicula = parseInt(pelicula.imdbID, 10);
    setFavoritos((prev) => {
      const existe = prev.find((p) => p.imdbID === pelicula.imdbID);
      return existe ? prev.filter((p) => p.imdbID !== pelicula.imdbID) : [...prev, pelicula];
    });
    try {
      await fetch(`${BASE_URL}/api/peliculas/${idPelicula}/favorito`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUsuario: ID_USUARIO }),
      });
    } catch {
      console.warn("No se pudo sincronizar favorito con el backend");
    }
  }, []);

  const esFavorito = useCallback((id) => favoritos.some((p) => p.imdbID === id), [favoritos]);

  const valor = useMemo(() => ({ favoritos, alternarFavorito, esFavorito, cargando }), [favoritos, alternarFavorito, esFavorito, cargando]);

  return (
    <ContextoFavoritos.Provider value={valor}>
      {children}
    </ContextoFavoritos.Provider>
  );
};
