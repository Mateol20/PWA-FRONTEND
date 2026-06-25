import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";

const BASE = API_BASE_URL.replace("/api/peliculas", "");

function headers(token) {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

const FIELDS = [
  { key: "Title", label: "Título", type: "text", required: true },
  { key: "Year", label: "Año", type: "number", required: true },
  { key: "Poster", label: "Poster URL", type: "text", required: true },
  { key: "imdbRating", label: "Rating", type: "number", required: true, step: 0.1 },
  { key: "Runtime", label: "Duración (min)", type: "number", required: true },
  { key: "Director", label: "Director", type: "text", required: true },
  { key: "Plot", label: "Sinopsis", type: "textarea", required: true },
  { key: "Images", label: "Imágenes URL", type: "text", required: true },
  { key: "Actors", label: "Actores", type: "text", required: true },
  { key: "Genre", label: "Género", type: "text" },
  { key: "Type", label: "Tipo", type: "text" },
  { key: "Trailer", label: "Trailer URL", type: "text" },
];

const emptyForm = () => Object.fromEntries(FIELDS.map((f) => [f.key, ""]));

export default function Movies() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [peliculas, setPeliculas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [error, setError] = useState("");

  const cargarPeliculas = useCallback(async () => {
    try {
      const res = await fetch(`${BASE}/api/admin/movies`, { headers: headers(token) });
      if (!res.ok) { setPeliculas([]); return; }
      const data = await res.json();
      setPeliculas(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error al cargar películas", e);
    } finally {
      setCargando(false);
    }
  }, [token]);

  useEffect(() => { cargarPeliculas(); }, [cargarPeliculas]);

  const abrirModal = (pelicula) => {
    setEditando(pelicula);
    setForm(
      pelicula
        ? Object.fromEntries(FIELDS.map((f) => [f.key, pelicula[f.key] ?? ""]))
        : emptyForm()
    );
    setError("");
    setModalOpen(true);
  };

  const guardar = async () => {
    setError("");
    const required = FIELDS.filter((f) => f.required);
    const missing = required.filter((f) => !form[f.key]?.toString().trim());
    if (missing.length) {
      setError(`Campos requeridos: ${missing.map((f) => f.label).join(", ")}`);
      return;
    }
    const payload = { ...form };
    payload.Year = parseInt(payload.Year, 10);
    payload.imdbRating = parseFloat(payload.imdbRating);
    payload.Runtime = parseFloat(payload.Runtime);
    if (!payload.Genre) delete payload.Genre;
    if (!payload.Type) payload.Type = "movie";
    if (!payload.Trailer) delete payload.Trailer;

    try {
      if (editando) {
        await fetch(`${BASE}/api/admin/movies/${editando.Id}`, {
          method: "PUT",
          headers: headers(token),
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`${BASE}/api/admin/movies`, {
          method: "POST",
          headers: headers(token),
          body: JSON.stringify(payload),
        });
      }
      setModalOpen(false);
      cargarPeliculas();
    } catch (e) {
      setError("Error al guardar");
    }
  };

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar esta película?")) return;
    try {
      await fetch(`${BASE}/api/admin/movies/${id}`, { method: "DELETE", headers: headers(token) });
      cargarPeliculas();
    } catch (e) {
      console.error("Error al eliminar", e);
    }
  };

  if (cargando) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><p className="text-blue-400 animate-pulse">Cargando...</p></div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-100">Películas</h2>
        <button className="btn btn-primary" onClick={() => abrirModal(null)}>Agregar Película</button>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="text-slate-400">
              <th>ID</th>
              <th>Título</th>
              <th>Año</th>
              <th>Director</th>
              <th>Rating</th>
              <th>Género</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {peliculas.map((p) => (
              <tr key={p.Id} className="text-slate-200 hover:bg-slate-800">
                <th className="text-slate-400">{p.Id}</th>
                <td className="max-w-xs truncate">{p.Title}</td>
                <td>{p.Year}</td>
                <td className="max-w-[160px] truncate">{p.Director}</td>
                <td>{p.imdbRating}</td>
                <td className="max-w-[120px] truncate">{p.Genre}</td>
                <td className="flex gap-2">
                  <button className="btn btn-sm btn-secondary" onClick={() => abrirModal(p)}>Editar</button>
                  <button className="btn btn-sm btn-accent" onClick={() => eliminar(p.Id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal modal-open">
          <div className="modal-box bg-slate-900 border border-slate-700 max-w-2xl">
            <h3 className="font-bold text-lg text-slate-100 py-3">
              {editando ? "Editar Película" : "Agregar Película"}
            </h3>
            {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
            <form method="dialog" className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {FIELDS.map((f) => (
                <label key={f.key} className="input input-bordered flex items-center gap-2 bg-slate-800 text-slate-200 border-slate-600">
                  <span className="text-slate-400 w-28 shrink-0">{f.label}</span>
                  {f.type === "textarea" ? (
                    <textarea className="grow h-20" value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
                  ) : (
                    <input type={f.type} className="grow" value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} step={f.step} />
                  )}
                </label>
              ))}
            </form>
            <div className="modal-action">
              <button className="btn btn-success" onClick={guardar}>
                {editando ? "Guardar Cambios" : "Agregar Película"}
              </button>
              <button className="btn btn-ghost text-slate-300" onClick={() => setModalOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
