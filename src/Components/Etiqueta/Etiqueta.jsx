const Etiqueta = ({ tipo }) => {
  const esSerie = tipo === "serie";
  return (
    <span
      className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
        esSerie
          ? "bg-red-500/10 border border-red-500/50 text-red-500"
          : "bg-emerald-950/30 border border-emerald-500/50 text-emerald-400"
      }`}
    >
      {tipo}
    </span>
  );
};

export default Etiqueta;
