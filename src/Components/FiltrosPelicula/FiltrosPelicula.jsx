import { useRef } from "react";
import { useTranslation } from "react-i18next";

export default function FiltrosPelicula({ genero, setGenero, tipo, setTipo, generosUnicos }) {
  const { t } = useTranslation();
  const tipoRef = useRef(null);
  const generoRef = useRef(null);

  const maskStyle = "linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)";

  return (
    <>
      <div className="relative pb-3 max-w-7xl mx-auto">
        <div
          ref={tipoRef}
          className="flex gap-2 overflow-x-auto px-4 scrollbar-none"
          style={{ maskImage: maskStyle, WebkitMaskImage: maskStyle }}
        >
          <button
            onClick={() => setTipo(null)}
            className={`shrink-0 px-5 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !tipo
                ? "bg-white text-black"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {t("todo")}
          </button>
          <button
            onClick={() => setTipo("movie")}
            className={`shrink-0 px-5 py-1.5 rounded-full text-sm font-medium transition-colors ${
              tipo === "movie"
                ? "bg-emerald-950/30 border border-emerald-500/50 text-emerald-400"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {t("peliculas")}
          </button>
          <button
            onClick={() => setTipo("series")}
            className={`shrink-0 px-5 py-1.5 rounded-full text-sm font-medium transition-colors ${
              tipo === "series"
                ? "bg-red-500/10 border border-red-500/50 text-red-500"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {t("series")}
          </button>
        </div>
      </div>

      {generosUnicos.length > 1 && (
        <div className="relative pb-5 max-w-7xl mx-auto">
          <div
            ref={generoRef}
            className="flex gap-2 overflow-x-auto px-4 scrollbar-none"
            style={{ maskImage: maskStyle, WebkitMaskImage: maskStyle }}
          >
            {generosUnicos.map((g) => (
              <button
                key={g}
                onClick={() => setGenero(g === "Todas" ? null : g)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  (genero === null && g === "Todas") || genero === g
                    ? "bg-white text-black"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
