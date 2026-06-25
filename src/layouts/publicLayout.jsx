import { Outlet } from "react-router-dom";
import Encabezado from "../Components/Header/Header";
import PieDePagina from "../Components/Footer/Footer";

const PublicLayout = () => (
  <>
    <Encabezado />
    <Outlet />
    <PieDePagina />
  </>
);
export default PublicLayout;
