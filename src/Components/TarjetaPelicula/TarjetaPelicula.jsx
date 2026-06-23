import ItemPelicula from "../ItemPelicula/ItemPelicula.jsx";
import { useFavoritos } from "../../context/ContextoFavoritos.jsx";

export default function TarjetaPelicula({ datos }) {
  const { alternarFavorito, esFavorito } = useFavoritos();

  if (!datos?.length) return null;

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-10 justify-items-center max-w-7xl mx-auto px-4 sm:px-6">
      {datos.map((pelicula, indice) => (
        <ItemPelicula
          key={`${pelicula.Id}-${indice}`}
          pelicula={pelicula}
          indice={indice}
          esFavorito={esFavorito}
          alternarFavorito={alternarFavorito}
        />
      ))}
    </section>
  );
}
