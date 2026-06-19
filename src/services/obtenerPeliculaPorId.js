import i18n from "../context/i18n.js";
import { API_BASE_URL, imagenUrl } from "../config";

const mapearPelicula = (p) => ({
  Id: p.Id,
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

export const obtenerPeliculaPorId = async (id) => {
  try {
    const lang = i18n.language || "es";
    const respuesta = await fetch(`${API_BASE_URL}/${id}?lang=${lang}`);
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
