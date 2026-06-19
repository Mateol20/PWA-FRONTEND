import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { obtenerTodasLasPeliculas } from "../../services/obtenerTodasLasPeliculas";
import TarjetaPelicula from "../../Components/TarjetaPelicula/TarjetaPelicula";
import FiltrosPelicula from "../../Components/FiltrosPelicula/FiltrosPelicula";
import { useBusqueda } from "../../context/ContextoBusqueda";

const Inicio = () => {
  const { t, i18n } = useTranslation();
  const { termino } = useBusqueda();
  const [peliculas, setPeliculas] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [hayMas, setHayMas] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [genero, setGenero] = useState(null);
  const [tipo, setTipo] = useState(null);
  const paginaRef = useRef(pagina);
  const terminoRef = useRef(termino);
  const idiomaRef = useRef(i18n.language);
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
    let filtradas = peliculas;
    if (tipo) {
      filtradas = filtradas.filter((p) => p.Type === tipo);
    }
    if (genero && genero !== "Todas") {
      filtradas = filtradas.filter((p) => (p.Genre || "").includes(genero));
    }
    return filtradas;
  }, [peliculas, genero, tipo]);

  useEffect(() => {
    paginaRef.current = pagina;
  }, [pagina]);

  useEffect(() => {
    if (i18n.language !== idiomaRef.current) {
      setPeliculas([]);
      setPagina(1);
      setHayMas(true);
      setCargando(false);
      setGenero(null);
      paginasCargadas.current = new Set();
      idiomaRef.current = i18n.language;
    }
  }, [i18n.language]);

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
    <main className="min-h-screen pb-10 bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      <h1 className="text-5xl font-extrabold text-white px-4 sm:px-6 pt-10 pb-6 max-w-7xl mx-auto">
        {t("cartelera")}
      </h1>

      <FiltrosPelicula
        genero={genero}
        setGenero={setGenero}
        tipo={tipo}
        setTipo={setTipo}
        generosUnicos={generosUnicos}
      />

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
