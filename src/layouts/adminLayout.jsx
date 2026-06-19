import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  const linkClass = ({ isActive }) =>
    `btn btn-sm ${isActive ? "btn-primary" : "btn-ghost text-slate-300"}`;

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="navbar bg-slate-900 border-b border-slate-700 shadow-sm">
        <div className="navbar-start">
          <span className="text-xl font-bold text-slate-100 ml-2">Admin Panel</span>
        </div>
        <div className="navbar-center gap-2">
          <NavLink to="/admin" end className={linkClass}>Usuarios</NavLink>
          <NavLink to="/admin/peliculas" className={linkClass}>Películas</NavLink>
        </div>
        <div className="navbar-end">
          <NavLink to="/" className="btn btn-ghost text-slate-300">Salir</NavLink>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
