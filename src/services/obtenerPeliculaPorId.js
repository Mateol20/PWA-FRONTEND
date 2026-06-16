import i18n from "../context/i18n.js";
import { API_BASE_URL } from "../config";

const mapearPelicula = (p) => ({
  imdbID: String(p.Id),
  Title: p.Title,
  Year: p.Year,
  Poster: p.Poster,
  imdbRating: String(p.imdbRating),
  Runtime: String(p.Runtime),
  Director: p.Director,
  Plot: p.Plot,
  Images: [p.Images],
  Actors: p.Actors,
  Type: p.Type || "movie",
  Genre: p.Genre || "N/A",
});

export const obtenerPeliculaPorId = async (imdbID) => {
  try {
    const lang = i18n.language || "es";
    const respuesta = await fetch(`${API_BASE_URL}/${imdbID}?lang=${lang}`);
    if (!respuesta.ok) {
      if (respuesta.status === 404) return null;
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    return datos ? mapearPelicula(datos) : null;
  } catch (error) {
    console.error("Error en obtenerPeliculaPorId:", error);
    return null;
  }
};
