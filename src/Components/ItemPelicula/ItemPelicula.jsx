import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Etiqueta from "../Etiqueta/Etiqueta";

const EstrellaIcono = () => (
  <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" className="mb-0.5">
    <path d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z" fill="#eab308" />
  </svg>
);

export default function ItemPelicula({ pelicula, indice, esFavorito, alternarFavorito }) {
  const { t } = useTranslation();
  const [imagenSrc, setImagenSrc] = useState(
    pelicula.Poster !== "N/A"
      ? pelicula.Poster
      : pelicula.Images?.[0] || "https://placehold.co/400x600?text=Poster+No+Disponible"
  );

  const manejarErrorImagen = () => {
    const imgSiguiente = pelicula.Images?.find((img) => img !== imagenSrc);
    if (imgSiguiente) {
      setImagenSrc(imgSiguiente);
    } else {
      setImagenSrc("https://placehold.co/400x600?text=Imagen+No+Encontrada");
    }
  };

  const tipoPelicula = pelicula.Type === "movie";
  const favorito = esFavorito ? esFavorito(pelicula.Id) : false;

  return (
    <article className="w-full bg-slate-800 border border-slate-700/50 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col hover:scale-[1.03] transition-all duration-300 hover:border-blue-500/50 group relative">
      <div className="h-44 sm:h-56 md:h-72 w-full overflow-hidden bg-black relative flex-shrink-0">
        <img
          className="w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          src={imagenSrc}
          alt={pelicula.Title}
          onError={manejarErrorImagen}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-transparent to-transparent opacity-60"></div>
        {alternarFavorito && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); alternarFavorito(pelicula); }}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 z-20 opacity-0 group-hover:opacity-100 ${
              favorito
                ? "text-yellow-400 bg-yellow-400/20 hover:bg-yellow-400/30 opacity-100"
                : "text-slate-400 bg-slate-900/60 hover:bg-slate-900/80"
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        )}
      </div>
      <div className="px-3 py-3 sm:px-5 sm:py-5 flex flex-col flex-1 bg-slate-800 z-10">
        <h2 className="text-slate-50 font-bold text-xs sm:text-lg md:text-xl line-clamp-2 leading-tight mb-1 group-hover:text-blue-400 transition-colors">
          <Link to={`/pelicula/${pelicula.Id}`}>{pelicula.Title}</Link>
        </h2>
        <div><Etiqueta tipo={tipoPelicula ? "pelicula" : "serie"} /></div>
        <p className="text-slate-400 font-medium text-[11px] sm:text-sm mb-2 sm:mb-4">
          {t("publicadoEn")} <span className="text-slate-300">{pelicula.Year}</span>
        </p>
        <div className="grid grid-cols-2 justify-between items-end mt-auto border-t border-slate-700/60 pt-2 sm:pt-4">
          <div className="flex flex-col">
            <span className="text-yellow-500 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] mb-0.5">{t("rating")}</span>
            <div className="text-base sm:text-2xl font-bold flex gap-x-1 sm:gap-x-1.5 items-center text-slate-50">
              {pelicula.imdbRating !== "N/A" ? pelicula.imdbRating : "--"}
              <EstrellaIcono />
            </div>
          </div>
          <span className="text-lg sm:text-3xl justify-self-end font-bold text-blue-500/20 italic group-hover:text-blue-500/60 transition-all">#{indice + 1}</span>
        </div>
      </div>
    </article>
  );
}
