import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { obtenerTodasLasPeliculas } from "../../services/obtenerTodasLasPeliculas";
import TarjetaPelicula from "../../Components/TarjetaPelicula/TarjetaPelicula";
import { useBusqueda } from "../../context/ContextoBusqueda";

const Inicio = () => {
  const { t } = useTranslation();
  const { termino } = useBusqueda();
  const [peliculas, setPeliculas] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [hayMas, setHayMas] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [genero, setGenero] = useState(null);
  const paginaRef = useRef(pagina);
  const terminoRef = useRef(termino);
  const paginasCargadas = useRef(new Set());

  const generosUnicos = useMemo(() => {
    const set = new Set();
    peliculas.forEach((p) => {
      (p.Genre || "").split(",").forEach((g) => {
        const limpio = g.trim();
        if (limpio) set.add(limpio);
      });
    });
    return ["Todas", ...set];
  }, [peliculas]);

  const peliculasFiltradas = useMemo(() => {
    if (!genero || genero === "Todas") return peliculas;
    return peliculas.filter((p) => (p.Genre || "").includes(genero));
  }, [peliculas, genero]);

  useEffect(() => {
    paginaRef.current = pagina;
  }, [pagina]);

  useEffect(() => {
    if (termino !== terminoRef.current) {
      setPeliculas([]);
      setPagina(1);
      setHayMas(true);
      setCargando(false);
      setGenero(null);
      paginasCargadas.current = new Set();
      terminoRef.current = termino;
    }
  }, [termino]);

  const cargarMas = useCallback(async () => {
    if (cargando || !hayMas) return;

    const pagActual = paginaRef.current;
    if (paginasCargadas.current.has(pagActual)) return;
    paginasCargadas.current.add(pagActual);

    setCargando(true);

    const terminoActual = termino;
    const nuevas = await obtenerTodasLasPeliculas(pagActual, terminoActual);

    if (terminoActual !== terminoRef.current) return;

    if (nuevas.length === 0) {
      setHayMas(false);
    }

    setPeliculas((prev) => [...prev, ...nuevas]);
    setPagina((prev) => prev + 1);
    setCargando(false);
  }, [cargando, hayMas, termino]);

  useEffect(() => {
    if (peliculas.length === 0 && !cargando && hayMas) {
      cargarMas();
    }
  }, [peliculas.length, cargando, hayMas, cargarMas]);

  const [referencia] = useInfiniteScroll({
    loading: cargando,
    hasNextPage: hayMas,
    onLoadMore: cargarMas,
  });

  return (
    <main className="min-h-screen bg-slate-900 pb-10">
      <h1 className="text-4xl font-bold text-white text-center py-10">
        {t("cartelera")}
      </h1>

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

      <TarjetaPelicula datos={peliculasFiltradas} />
      <div className="flex justify-center mt-10" ref={referencia}>
        {cargando && (
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        )}
      </div>
      {!hayMas && peliculas.length > 0 && (
        <p className="text-slate-500 text-center py-6 font-medium italic">
          {t("noHayMas")}
        </p>
      )}
      {!hayMas && peliculas.length === 0 && termino && (
        <p className="text-slate-400 text-center py-6 font-medium">
          {t("sinResultados")}
        </p>
      )}
    </main>
  );
};

export default Inicio;
