import { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
import { API_BASE_URL } from "../config";

const ContextoAuth = createContext();

const BASE = API_BASE_URL.replace("/api/peliculas", "");

export const useAuth = () => {
  const contexto = useContext(ContextoAuth);
  if (!contexto) {
    throw new Error("useAuth debe usarse dentro de ProveedorAuth");
  }
  return contexto;
};

export const ProveedorAuth = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCargando(false);
      return;
    }
    fetch(`${BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Sesión inválida");
        return r.json();
      })
      .then((data) => setUsuario(data))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setCargando(false));
  }, []);

  const loginSuccess = useCallback((token, userData) => {
    localStorage.setItem("token", token);
    setUsuario(userData);
  }, []);

  const loginUser = useCallback(async (email, password) => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");
    loginSuccess(data.token, data.user);
    return data;
  }, [loginSuccess]);

  const registerUser = useCallback(async (name, email, password) => {
    const res = await fetch(`${BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al registrarse");
    loginSuccess(data.token, data.user);
    return data;
  }, [loginSuccess]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUsuario(null);
  }, []);

  const isAuthenticated = useMemo(() => !!usuario, [usuario]);
  const isAdmin = useMemo(() => usuario?.role === "admin", [usuario]);

  const valor = useMemo(
    () => ({ usuario, login: loginSuccess, loginUser, registerUser, logout, isAuthenticated, isAdmin, cargando }),
    [usuario, loginSuccess, loginUser, registerUser, logout, isAuthenticated, isAdmin, cargando],
  );

  return (
    <ContextoAuth.Provider value={valor}>
      {children}
    </ContextoAuth.Provider>
  );
};
