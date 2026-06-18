import { useTranslation } from "react-i18next";

export default function FiltrosPelicula({ genero, setGenero, tipo, setTipo, generosUnicos }) {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-center pb-4">
        <button
          onClick={() => setTipo(null)}
          className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !tipo
              ? "bg-white text-black"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          {t("todo")}
        </button>
        <button
          onClick={() => setTipo("movie")}
          className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors ${
            tipo === "movie"
              ? "bg-emerald-950/30 border border-emerald-500/50 text-emerald-400"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          {t("peliculas")}
        </button>
        <button
          onClick={() => setTipo("series")}
          className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors ${
            tipo === "series"
              ? "bg-red-500/10 border border-red-500/50 text-red-500"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          {t("series")}
        </button>
      </div>

      {generosUnicos.length > 1 && (
        <div className="flex flex-wrap gap-2 justify-center max-w-4xl mx-auto px-4 pb-6">
          {generosUnicos.map((g) => (
            <button
              key={g}
              onClick={() => setGenero(g === "Todas" ? null : g)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                (genero === null && g === "Todas") || genero === g
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
