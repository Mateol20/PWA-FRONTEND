import i18n from "../context/i18n.js";
import { API_BASE_URL, ITEMS_PER_PAGE } from "../config";
import { mapearPelicula } from "../utils/mapearPelicula";
import { getCache, setCache } from "../utils/cache";

export const obtenerTodasLasPeliculas = async (cursor = null, busqueda = "", signal) => {
  const lang = i18n.language || "es";
  const cacheKey = `peliculas_${cursor ?? 0}_${busqueda}_${lang}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const url = new URL(API_BASE_URL);
    url.searchParams.append("limit", ITEMS_PER_PAGE.toString());
    url.searchParams.append("lang", lang);
    if (cursor) url.searchParams.append("cursor", cursor.toString());
    if (busqueda?.trim()) url.searchParams.append("search", busqueda.trim());

    const respuesta = await fetch(url, { signal });
    if (!respuesta.ok) {
      if (respuesta.status === 404) return { data: [], nextCursor: null };
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    const resultado = {
      data: Array.isArray(datos?.data) ? datos.data.map(mapearPelicula) : [],
      nextCursor: datos?.nextCursor ?? null,
    };
    setCache(cacheKey, resultado);
    return resultado;
  } catch (error) {
    if (error.name === "AbortError") return { data: [], nextCursor: null };
    console.error("Error en obtenerTodasLasPeliculas:", error);
    return { data: [], nextCursor: null };
  }
};
