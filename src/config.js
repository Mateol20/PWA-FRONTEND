export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://pwa-backend-omega.vercel.app/api/peliculas";

const BASE = API_BASE_URL.replace("/api/peliculas", "");

export function imagenUrl(path) {
  if (!path || path.startsWith("http") || path.startsWith("//")) return path;
  return `${BASE}${path}`;
}
export const ITEMS_PER_PAGE = 8;
export const DEBOUNCE_MS = 400;

