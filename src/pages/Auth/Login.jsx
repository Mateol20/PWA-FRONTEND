import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/ContextoAuth";

const Login = () => {
  const { loginUser } = useAuth();
  const navegar = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      await loginUser(email, password);
      navegar("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-xl border border-slate-700 p-8">
        <h1 className="text-2xl font-bold text-white text-center mb-6">Iniciar Sesión</h1>
        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={manejarEnvio} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 border border-slate-600 rounded-lg bg-slate-800 text-slate-200 placeholder-slate-400 px-4 focus:outline-none focus:border-blue-400 focus:ring-[3px] focus:ring-blue-500/20"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 border border-slate-600 rounded-lg bg-slate-800 text-slate-200 placeholder-slate-400 px-4 focus:outline-none focus:border-blue-400 focus:ring-[3px] focus:ring-blue-500/20"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={cargando}
            className="w-full h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
          >
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
        <p className="text-slate-400 text-sm text-center mt-6">
          ¿No tenés cuenta?{" "}
          <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
