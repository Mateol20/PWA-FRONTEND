import i18n from "../context/i18n.js";
import { API_BASE_URL, ITEMS_PER_PAGE, imagenUrl } from "../config";

const mapearPelicula = (p) => ({
  imdbID: String(p.Id),
  Title: p.Title,
  Year: p.Year,
  Poster: imagenUrl(p.Poster),
  imdbRating: String(p.imdbRating),
  Runtime: String(p.Runtime),
  Director: p.Director,
  Plot: p.Plot,
  Images: [imagenUrl(p.Images)],
  Actors: p.Actors,
  Type: p.Type || "movie",
  Genre: p.Genre || "N/A",
  Trailer: p.Trailer || null,
});

export const obtenerTodasLasPeliculas = async (pagina = 1, busqueda = "") => {
  try {
    const url = new URL(API_BASE_URL);
    url.searchParams.append("page", pagina.toString());
    url.searchParams.append("limit", ITEMS_PER_PAGE.toString());

    if (busqueda?.trim()) {
      url.searchParams.append("search", busqueda.trim());
    }

    const lang = i18n.language || "es";
    url.searchParams.append("lang", lang);

    const respuesta = await fetch(url);
    if (!respuesta.ok) {
      if (respuesta.status === 404) return [];
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    return Array.isArray(datos?.data) ? datos.data.map(mapearPelicula) : [];
  } catch (error) {
    console.error("Error en obtenerTodasLasPeliculas:", error);
    return [];
  }
};
