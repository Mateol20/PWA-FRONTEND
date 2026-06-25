import { imagenUrl } from "../config";

export const mapearPelicula = (p) => ({
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
