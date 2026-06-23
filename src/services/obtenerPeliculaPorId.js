import i18n from "../context/i18n.js";
import { API_BASE_URL } from "../config";
import { mapearPelicula } from "../utils/mapearPelicula";
import { getCache, setCache } from "../utils/cache";

export const obtenerPeliculaPorId = async (id) => {
  const lang = i18n.language || "es";
  const cacheKey = `pelicula_${id}_${lang}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const respuesta = await fetch(`${API_BASE_URL}/${id}?lang=${lang}`);
    if (!respuesta.ok) {
      if (respuesta.status === 404) return null;
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    const resultado = datos ? mapearPelicula(datos) : null;
    if (resultado) setCache(cacheKey, resultado);
    return resultado;
  } catch (error) {
    console.error("Error en obtenerPeliculaPorId:", error);
    return null;
  }
};
