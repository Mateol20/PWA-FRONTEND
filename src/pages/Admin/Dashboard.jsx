import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../../config";

const BASE = API_BASE_URL.replace("/api/peliculas", "");

export default function Dashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [error, setError] = useState("");

  const cargarUsuarios = useCallback(async () => {
    try {
      const res = await fetch(`${BASE}/api/admin/users`);
      const data = await res.json();
      setUsuarios(data);
    } catch (e) {
      console.error("Error al cargar usuarios", e);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargarUsuarios(); }, [cargarUsuarios]);

  const abrirModal = (usuario) => {
    setEditando(usuario);
    setForm({
      name: usuario?.name || "",
      email: usuario?.email || "",
      password: "",
      role: usuario?.role || "user",
    });
    setError("");
    setModalOpen(true);
  };

  const guardar = async () => {
    setError("");
    if (!form.name || !form.email) {
      setError("Nombre y email son requeridos");
      return;
    }
    if (!editando && !form.password) {
      setError("Contraseña requerida para nuevo usuario");
      return;
    }
    try {
      if (editando) {
        const payload = { name: form.name, email: form.email, role: form.role };
        if (form.password) payload.password = form.password;
        await fetch(`${BASE}/api/admin/users/${editando.Id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`${BASE}/api/admin/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      setModalOpen(false);
      cargarUsuarios();
    } catch (e) {
      setError("Error al guardar");
    }
  };

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
      await fetch(`${BASE}/api/admin/users/${id}`, { method: "DELETE" });
      cargarUsuarios();
    } catch (e) {
      console.error("Error al eliminar", e);
    }
  };

  if (cargando) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><p className="text-blue-400 animate-pulse">Cargando...</p></div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-100">Usuarios</h2>
        <button className="btn btn-primary" onClick={() => abrirModal(null)}>Agregar Usuario</button>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="text-slate-400">
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Creado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.Id} className="text-slate-200 hover:bg-slate-800">
                <th className="text-slate-400">{u.Id}</th>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge ${u.role === "admin" ? "badge-warning" : "badge-ghost"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="text-slate-400 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="flex gap-2">
                  <button className="btn btn-sm btn-secondary" onClick={() => abrirModal(u)}>Editar</button>
                  <button className="btn btn-sm btn-accent" onClick={() => eliminar(u.Id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal modal-open">
          <div className="modal-box bg-slate-900 border border-slate-700">
            <h3 className="font-bold text-lg text-slate-100 py-3">
              {editando ? "Editar Usuario" : "Agregar Usuario"}
            </h3>
            {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
            <form method="dialog" className="space-y-3">
              <label className="input input-bordered flex items-center gap-2 bg-slate-800 text-slate-200 border-slate-600">
                Nombre
                <input type="text" className="grow" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
              <label className="input input-bordered flex items-center gap-2 bg-slate-800 text-slate-200 border-slate-600">
                Email
                <input type="email" className="grow" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
              <label className="input input-bordered flex items-center gap-2 bg-slate-800 text-slate-200 border-slate-600">
                {editando ? "Nueva contraseña (opcional)" : "Contraseña"}
                <input type="password" className="grow" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </label>
              <select className="select select-bordered bg-slate-800 text-slate-200 border-slate-600 w-full" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </form>
            <div className="modal-action">
              <button className="btn btn-success" onClick={guardar}>
                {editando ? "Guardar Cambios" : "Agregar Usuario"}
              </button>
              <button className="btn btn-ghost text-slate-300" onClick={() => setModalOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
