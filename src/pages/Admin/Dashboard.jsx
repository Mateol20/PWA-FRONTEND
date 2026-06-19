import { useState } from "react";
import { useNavigate } from "react-router-dom";
const clientesMock = [
  { id: 1, name: "Cy Ganderton", job: "Quality Control Specialist", email: "cy@example.com", rate: "$3,000", isactive: true },
  { id: 2, name: "Hart Hagerty", job: "Desktop Support Technician", email: "hart@example.com", rate: "$2,500", isactive: false },
  { id: 3, name: "Brice Swyre", job: "Tax Accountant", email: "brice@example.com", rate: "$2,000", isactive: true },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleOpen = (cliente) => {
    setEditing(cliente);
    setModalOpen(true);
  };

  const cerrarSesion = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="navbar bg-slate-900 border-b border-slate-700 shadow-sm">
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl text-slate-100">Admin Panel</a>
        </div>
        <div className="navbar-center">
          <input type="text" placeholder="Search" className="input input-bordered w-48 md:w-auto bg-slate-800 text-slate-200 border-slate-600" />
        </div>
        <div className="navbar-end gap-2">
          <button className="btn btn-primary" onClick={() => handleOpen(null)}>Agregar Cliente</button>
          <button className="btn btn-ghost text-slate-300" onClick={cerrarSesion}>Salir</button>
        </div>
      </div>

      <div className="overflow-x-auto p-6">
        <table className="table w-full">
          <thead>
            <tr className="text-slate-400">
              <th></th>
              <th>Name</th>
              <th>Job</th>
              <th>Email</th>
              <th>Rate</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clientesMock.map((c) => (
              <tr key={c.id} className="text-slate-200 hover:bg-slate-800">
                <th className="text-slate-400">{c.id}</th>
                <td>{c.name}</td>
                <td>{c.job}</td>
                <td>{c.email}</td>
                <td>{c.rate}</td>
                <td>
                  <span className={`badge ${c.isactive ? "badge-success" : "badge-ghost"}`}>
                    {c.isactive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="flex gap-2">
                  <button className="btn btn-sm btn-secondary" onClick={() => handleOpen(c)}>Update</button>
                  <button className="btn btn-sm btn-accent">Delete</button>
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
              {editing ? "Editar Cliente" : "Agregar Cliente"}
            </h3>
            <form method="dialog">
              <label className="input input-bordered my-4 flex items-center gap-2 bg-slate-800 text-slate-200 border-slate-600">
                Nombre:
                <input type="text" className="grow" defaultValue={editing?.name || ""} />
              </label>
              <label className="input input-bordered my-4 flex items-center gap-2 bg-slate-800 text-slate-200 border-slate-600">
                Trabajo:
                <input type="text" className="grow" defaultValue={editing?.job || ""} />
              </label>
              <label className="input input-bordered my-4 flex items-center gap-2 bg-slate-800 text-slate-200 border-slate-600">
                Email:
                <input type="text" className="grow" defaultValue={editing?.email || ""} />
              </label>
              <div className="flex gap-4 my-4">
                <input type="number" className="input input-bordered bg-slate-800 text-slate-200 border-slate-600 w-1/2" placeholder="Rate.." />
                <select className="select select-bordered bg-slate-800 text-slate-200 border-slate-600 w-1/2">
                  <option>Inactive</option>
                  <option>Active</option>
                </select>
              </div>
            </form>
            <div className="modal-action">
              <button className="btn btn-success" onClick={() => setModalOpen(false)}>
                {editing ? "Guardar Cambios" : "Agregar Cliente"}
              </button>
              <button className="btn btn-ghost text-slate-300" onClick={() => setModalOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
