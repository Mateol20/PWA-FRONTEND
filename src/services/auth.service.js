import { BASE_URL } from "../config";

export const loginApi = async (email, password) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    const mensaje = err.errors?.[0]?.message || err.error || "Error al iniciar sesión";
    throw new Error(mensaje);
  }
  return res.json();
};

export const registerApi = async (name, email, password) => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    const mensaje = err.errors?.[0]?.message || err.error || "Error al registrarse";
    throw new Error(mensaje);
  }
  return res.json();
};

export const getMeApi = async (token) => {
  const res = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Sesión expirada");
  return res.json();
};
