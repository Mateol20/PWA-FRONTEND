import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6 px-4">
      <h1 className="text-8xl font-black text-slate-800">404</h1>
      <p className="text-slate-400 text-lg">{t("noEncontrada")}</p>
      <Link to="/" className="btn btn-primary">{t("volverInicio")}</Link>
    </div>
  );
}
