import { createContext, useContext, useState, useCallback, useMemo } from "react";

const ContextoBusqueda = createContext();

/* eslint-disable react-refresh/only-export-components */
export const useBusqueda = () => {
  const contexto = useContext(ContextoBusqueda);
  if (!contexto) {
    throw new Error("useBusqueda debe usarse dentro de ProveedorBusqueda");
  }
  return contexto;
};

export const ProveedorBusqueda = ({ children }) => {
  const [termino, setTermino] = useState("");

  const buscar = useCallback((texto) => {
    setTermino(texto);
  }, []);

  const limpiar = useCallback(() => {
    setTermino("");
  }, []);

  const valor = useMemo(() => ({ termino, buscar, limpiar }), [termino, buscar, limpiar]);

  return (
    <ContextoBusqueda.Provider value={valor}>
      {children}
    </ContextoBusqueda.Provider>
  );
};
