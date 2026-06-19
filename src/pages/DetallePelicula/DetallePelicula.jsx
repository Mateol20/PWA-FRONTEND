import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFavoritos } from "../../context/ContextoFavoritos";
import { obtenerPeliculaPorId } from "../../services/obtenerPeliculaPorId";
import jsPDF from "jspdf";

export default function DetallePelicula() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [pelicula, setPelicula] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [descargando, setDescargando] = useState(false);
  const { alternarFavorito, esFavorito } = useFavoritos();
  const tarjetaRef = useRef(null);

  const descargarPDF = async () => {
    if (!tarjetaRef.current) return;
    setDescargando(true);
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;

      let y = margin;

      if (pelicula.Poster && pelicula.Poster !== "N/A") {
        try {
          const img = new Image();
          img.crossOrigin = "anonymous";
          const imgPromise = new Promise((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = pelicula.Poster;
          });
          const loadedImg = await imgPromise;
          const maxWidth = 60;
          const imgAspect = loadedImg.width / loadedImg.height;
          const imgW = maxWidth;
          const imgH = maxWidth / imgAspect;
          pdf.addImage(loadedImg, "JPEG", margin, y, imgW, imgH);
          y += imgH + 8;
        } catch {
          y = margin;
        }
      }

      pdf.setFontSize(20);
      pdf.text(pelicula.Title, margin, y + 6);
      y += 14;

      pdf.setFontSize(11);
      const meta = [
        `${t("año")}: ${pelicula.Year}`,
        `${t("duracion")}: ${pelicula.Runtime} min`,
      ];
      if (pelicula.Director) meta.push(`${t("director")}: ${pelicula.Director}`);
      if (pelicula.Actors) meta.push(`${t("actores")}: ${pelicula.Actors}`);
      meta.forEach((line) => {
        pdf.text(line, margin, y);
        y += 6;
      });

      const generos = (pelicula.Genre || "N/A").split(",").map(g => g.trim()).join(" | ");
      pdf.text(`${t("genero")}: ${generos}`, margin, y);
      y += 10;

      pdf.setFontSize(13);
      pdf.text(t("sinopsis"), margin, y);
      y += 6;
      pdf.setFontSize(10);
      const lines = pdf.splitTextToSize(pelicula.Plot || "", pageWidth - margin * 2);
      pdf.text(lines, margin, y);

      pdf.save(`${pelicula.Title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
    } catch (error) {
      console.error("Error al generar PDF:", error);
    } finally {
      setDescargando(false);
    }
  };

  const cargarDetalle = useCallback(async () => {
    setCargando(true);
    const datos = await obtenerPeliculaPorId(id);
    if (datos) {
      setPelicula(datos);
    }
    setCargando(false);
  }, [id]);

  useEffect(() => {
    if (id) cargarDetalle();
  }, [cargarDetalle, i18n.language]);

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-blue-400 animate-pulse font-medium">
          {t("cargandoPelicula")}
        </p>
      </div>
    );
  }

  if (!pelicula) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400">{t("noEncontrada")}</p>
        <Link to="/" className="text-blue-400 hover:underline">
          {t("volverInicio")}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="text-slate-400 hover:text-blue-400 font-medium mb-6 inline-flex items-center gap-2 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {t("volverInicio")}
        </Link>

        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800" ref={tarjetaRef}>
          <div className="md:flex">
            <div className="md:w-2/5 md:shrink-0">
              <img
                src={
                  pelicula.Poster !== "N/A"
                    ? pelicula.Poster
                    : "https://placehold.co/400x600?text=Sin+Poster"
                }
                alt={pelicula.Title}
                className="w-full object-cover aspect-[2/3]"
                onError={(e) => { e.target.src = "https://placehold.co/400x600?text=Sin+Poster"; }}
              />
            </div>

            <div className="p-8 md:p-10 md:w-3/5">
              <h1 className="text-3xl font-bold text-slate-100 mb-6">
                {pelicula.Title}
              </h1>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {(pelicula.Genre || "N/A").split(",").map((g) => (
                  <span
                    key={g.trim()}
                    className="shrink-0 px-3 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300"
                  >
                    {g.trim()}
                  </span>
                ))}
              </div>

              <div className="flex gap-6 text-sm pb-4">
                <div>
                  <span className="text-slate-500 block mb-1">{t("año")}</span>
                  <p className="text-slate-200 font-semibold">{pelicula.Year}</p>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">{t("duracion")}</span>
                  <p className="text-slate-200 font-semibold">{pelicula.Runtime} min</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-slate-800/60 rounded-xl p-3 text-center border border-slate-700/50">
                  <span className="text-xs text-slate-500 font-medium">{t("medios")}</span>
                  <p className="text-yellow-400 font-bold text-lg mt-0.5">{pelicula.imdbRating}</p>
                  <span className="text-[10px] text-slate-500">IMDB</span>
                </div>
                <div className="bg-slate-800/60 rounded-xl p-3 text-center border border-slate-700/50">
                  <span className="text-xs text-slate-500 font-medium">{t("usuarios")}</span>
                  <p className="text-slate-400 font-bold text-lg mt-0.5">--</p>
                  <span className="text-[10px] text-slate-500">0 {t("notas")}</span>
                </div>
                <div className="bg-slate-800/60 rounded-xl p-3 text-center border border-slate-700/50">
                  <span className="text-xs text-slate-500 font-medium">{t("amigos")}</span>
                  <p className="text-slate-400 font-bold text-lg mt-0.5">--</p>
                  <span className="text-[10px] text-slate-500">--</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-800 pb-6">
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/30 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  {t("quieroVer")}
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 hover:bg-yellow-400/20 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {t("puntuar")}
                </button>
                <button
                  onClick={() => alternarFavorito(pelicula)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    esFavorito(pelicula.Id)
                      ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                      : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  {esFavorito(pelicula.Id) ? t("favoritos") : t("favorito")}
                </button>
                <button
                  onClick={descargarPDF}
                  disabled={descargando}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {descargando ? "..." : t("descargarPDF")}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-slate-500 font-medium text-sm">{t("director")}</span>
                  <p className="text-slate-200">{pelicula.Director}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium text-sm">{t("actores")}</span>
                  <p className="text-slate-200">{pelicula.Actors || "N/A"}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium text-sm">{t("sinopsis")}</span>
                  <p className="text-slate-300 leading-relaxed mt-1">{pelicula.Plot}</p>
                </div>
              </div>
            </div>
          </div>

          {pelicula.Trailer ? (
            <div className="border-t border-slate-800 p-8 md:p-10">
              <h2 className="flex items-center justify-center gap-2 text-white font-bold text-lg mb-6">
                <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.46 3.5 12 3.5 12 3.5s-7.46 0-9.38.55A3.02 3.02 0 00.5 6.19 31.6 31.6 0 000 12a31.6 31.6 0 00.5 5.81 3.02 3.02 0 002.12 2.14c1.92.55 9.38.55 9.38.55s7.46 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.6 31.6 0 0024 12a31.6 31.6 0 00-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/>
                </svg>
                {t("trailer")}
              </h2>
              <div className="aspect-video rounded-2xl overflow-hidden bg-black max-w-4xl mx-auto shadow-2xl shadow-red-900/20 border border-slate-700">
                <iframe
                  src={pelicula.Trailer}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${t("trailer")} ${pelicula.Title}`}
                />
              </div>
            </div>
          ) : (
            <div className="border-t border-slate-800 p-8 md:p-10 text-center">
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(pelicula.Title + " official trailer")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors font-medium"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.46 3.5 12 3.5 12 3.5s-7.46 0-9.38.55A3.02 3.02 0 00.5 6.19 31.6 31.6 0 000 12a31.6 31.6 0 00.5 5.81 3.02 3.02 0 002.12 2.14c1.92.55 9.38.55 9.38.55s7.46 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.6 31.6 0 0024 12a31.6 31.6 0 00-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/>
                </svg>
                {t("verTrailer")}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
