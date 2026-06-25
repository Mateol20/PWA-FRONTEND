import { BASE_URL } from "../config";
import { mapearPelicula } from "../utils/mapearPelicula";
import { getCache, setCache, clearCache } from "../utils/cache";

function getToken() {
  return localStorage.getItem("token");
}

export const obtenerFavoritosAPI = async () => {
  const cacheKey = "favoritos";
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const token = getToken();
  if (!token) return [];

  try {
    const respuesta = await fetch(`${BASE_URL}/api/favoritos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);

    const datos = await respuesta.json();
    if (datos?.status === "success" && Array.isArray(datos?.data)) {
      const resultado = datos.data.map((fav) => mapearPelicula(fav.movie));
      setCache(cacheKey, resultado, 60 * 1000);
      return resultado;
    }
    return [];
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    return null;
  }
};

export const toggleFavoritoAPI = async (pelicula) => {
  const token = getToken();
  if (!token) return null;

  try {
    const respuesta = await fetch(`${BASE_URL}/api/favoritos/${pelicula.Id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);

    const datos = await respuesta.json();
    clearCache("favoritos");
    return datos?.esFavorito ?? false;
  } catch (error) {
    console.error("Error al alternar favorito:", error);
    return null;
  }
};
