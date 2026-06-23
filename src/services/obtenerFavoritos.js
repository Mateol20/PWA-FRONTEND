import { API_BASE_URL } from "../config";
import { mapearPelicula } from "../utils/mapearPelicula";
import { getCache, setCache, clearCache } from "../utils/cache";

export const obtenerFavoritosAPI = async () => {
  const cacheKey = "favoritos";
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const url = new URL(API_BASE_URL);
    url.pathname += "/favoritas";
    url.searchParams.append("idUsuario", "1");

    const respuesta = await fetch(url);
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
  try {
    const url = new URL(API_BASE_URL);
    url.pathname += `/${pelicula.Id}/favorito`;

    const respuesta = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idUsuario: 1 }),
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
