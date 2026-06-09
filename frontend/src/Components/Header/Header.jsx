import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useBusqueda } from "../../context/ContextoBusqueda";
import { DEBOUNCE_MS } from "../../config";

const Encabezado = () => {
  const { t, i18n } = useTranslation();
  const navegar = useNavigate();
  const { termino, buscar, limpiar } = useBusqueda();
  const [texto, setTexto] = useState(termino);
  const retrasoRef = useRef();

  useEffect(() => {
    retrasoRef.current = setTimeout(() => {
      buscar(texto);
    }, DEBOUNCE_MS);

    return () => clearTimeout(retrasoRef.current);
  }, [texto, buscar]);

  const irAInicio = () => {
    limpiar();
    setTexto("");
    navegar("/");
  };

  const irAFavoritos = () => {
    navegar("/favoritos");
  };

  const cambiarIdioma = () => {
    const nuevo = i18n.language === "es" ? "en" : "es";
    i18n.changeLanguage(nuevo);
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    clearTimeout(retrasoRef.current);
    buscar(texto);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="h-20 bg-slate-900 flex justify-between items-center w-full px-4 sm:px-6 py-4 gap-2 sm:gap-4 border-b border-slate-700">
        <button
          className="flex items-center gap-2 text-slate-200 hover:text-blue-400 font-semibold transition-colors"
          onClick={irAInicio}
        >
          <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="hidden sm:inline">{t("inicio")}</span>
        </button>

        <form onSubmit={manejarEnvio} className="flex-1 max-w-full sm:max-w-md">
          <input
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className="w-full h-10 border border-slate-600 rounded-lg bg-slate-800 text-slate-200 placeholder-slate-400 px-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder={t("buscar")}
          />
        </form>

        <div className="flex items-center gap-3">
          <button
            onClick={cambiarIdioma}
            className="text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg text-sm font-semibold transition-colors border border-slate-700"
          >
            {i18n.language === "es" ? "EN" : "ES"}
          </button>

          <button
            className="flex items-center gap-2 text-slate-200 hover:text-red-400 font-semibold transition-colors"
            onClick={irAFavoritos}
          >
            <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="hidden sm:inline">{t("favoritos")}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Encabezado;
