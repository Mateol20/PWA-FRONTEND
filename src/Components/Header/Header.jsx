import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useBusqueda } from "../../context/ContextoBusqueda";
import { useAuth } from "../../context/ContextoAuth";
import { DEBOUNCE_MS } from "../../config";

const Encabezado = () => {
  const { t, i18n } = useTranslation();
  const navegar = useNavigate();
  const { termino, buscar, limpiar } = useBusqueda();
  const { usuario, logout, isAuthenticated, isAdmin } = useAuth();
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

  const [idiomaAbierto, setIdiomaAbierto] = useState(false);
  const menuRef = useRef(null);

  const cambiarIdioma = (lang) => {
    i18n.changeLanguage(lang);
    setIdiomaAbierto(false);
  };

  useEffect(() => {
    const cerrar = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIdiomaAbierto(false);
      }
    };
    document.addEventListener("mousedown", cerrar);
    return () => document.removeEventListener("mousedown", cerrar);
  }, []);

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
            className="w-full h-10 border border-slate-600 rounded-lg bg-slate-800 text-slate-200 placeholder-slate-400 px-4 focus:outline-none focus:border-blue-400 focus:ring-[3px] focus:ring-blue-500/20 transition-shadow"
            placeholder={t("buscar")}
          />
        </form>

        <div className="flex items-center gap-3">
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIdiomaAbierto(!idiomaAbierto)}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg text-sm font-semibold transition-colors border border-slate-700"
            >
              <span className="text-base leading-none">{i18n.language === "es" ? "🇪🇸" : "🇺🇸"}</span>
              <svg className={`w-3 h-3 transition-transform ${idiomaAbierto ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {idiomaAbierto && (
              <div className="absolute right-0 mt-2 w-36 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
                <button
                  onClick={() => cambiarIdioma("es")}
                  className={`flex items-center gap-2 w-full px-3 py-2 text-sm font-medium transition-colors ${i18n.language === "es" ? "text-blue-400 bg-blue-500/10" : "text-slate-300 hover:bg-slate-700"}`}
                >
                  <span className="text-base leading-none">🇪🇸</span>
                  Español
                </button>
                <button
                  onClick={() => cambiarIdioma("en")}
                  className={`flex items-center gap-2 w-full px-3 py-2 text-sm font-medium transition-colors ${i18n.language === "en" ? "text-blue-400 bg-blue-500/10" : "text-slate-300 hover:bg-slate-700"}`}
                >
                  <span className="text-base leading-none">🇺🇸</span>
                  English
                </button>
              </div>
            )}
          </div>

          <button
            className="flex items-center gap-2 text-slate-200 hover:text-red-400 font-semibold transition-colors"
            onClick={irAFavoritos}
          >
            <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="hidden sm:inline">{t("favoritos")}</span>
          </button>

          {isAuthenticated ? (
            <>
              {isAdmin && (
                <button
                  onClick={() => navegar("/admin")}
                  className="flex items-center gap-2 text-slate-200 hover:text-green-400 font-semibold transition-colors"
                >
                  <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="hidden sm:inline">Admin</span>
                </button>
              )}
              <button
                onClick={logout}
                className="flex items-center gap-2 text-slate-200 hover:text-red-400 font-semibold transition-colors"
              >
                <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Salir</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navegar("/login")}
                className="flex items-center gap-2 text-slate-200 hover:text-blue-400 font-semibold transition-colors"
              >
                <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Ingresar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Encabezado;
