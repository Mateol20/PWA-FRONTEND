import { API_BASE_URL, imagenUrl } from "../config";

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

export const obtenerFavoritosAPI = async () => {
  try {
    const url = new URL(API_BASE_URL);
    url.pathname += "/favoritas";
    url.searchParams.append("idUsuario", "1");

    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);

    const datos = await respuesta.json();
    if (datos?.status === "success" && Array.isArray(datos?.data)) {
      return datos.data.map((fav) => mapearPelicula(fav.pelicula));
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
    url.pathname += `/${pelicula.imdbID}/favorito`;

    const respuesta = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idUsuario: 1 }),
    });
    if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);

    const datos = await respuesta.json();
    return datos?.esFavorito ?? false;
  } catch (error) {
    console.error("Error al alternar favorito:", error);
    return null;
  }
};
