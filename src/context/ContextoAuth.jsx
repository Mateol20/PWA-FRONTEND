import { createContext, useContext, useState, useMemo, useCallback } from "react";

const ContextoAuth = createContext();

export const useAuth = () => {
  const contexto = useContext(ContextoAuth);
  if (!contexto) {
    throw new Error("useAuth debe usarse dentro de ProveedorAuth");
  }
  return contexto;
};

export const ProveedorAuth = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  const login = useCallback((datosUsuario, token) => {
    localStorage.setItem("token", token);
    setUsuario(datosUsuario);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUsuario(null);
  }, []);

  const isAuthenticated = useMemo(() => !!usuario, [usuario]);
  const isAdmin = useMemo(() => usuario?.role === "admin", [usuario]);

  const valor = useMemo(
    () => ({ usuario, login, logout, isAuthenticated, isAdmin }),
    [usuario, login, logout, isAuthenticated, isAdmin],
  );

  return (
    <ContextoAuth.Provider value={valor}>
      {children}
    </ContextoAuth.Provider>
  );
};
