export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://pwa-backend-omega.vercel.app/api/peliculas";

export const BASE_URL = API_BASE_URL.replace("/api/peliculas", "");

export function imagenUrl(path) {
  if (!path || path.startsWith("http") || path.startsWith("//")) return path;
  return `${BASE_URL}${path}`;
}
export const ITEMS_PER_PAGE = 8;
export const DEBOUNCE_MS = 400;

