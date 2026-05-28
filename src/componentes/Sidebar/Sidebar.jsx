import style from "./Sidebar.module.css";
import Logo from "../../assets/Logo_02.png";
import { SidebarItem } from "../SidebarItem/SidebarItem";
import { MdHome, MdPeople, MdDirectionsCar, MdBuild } from "react-icons/md";

export function Sidebar({ children }) {
  return (
    <div>
      <div className={style.sidebar_conteudo}>
        <div className={style.sidebar_header}>
          <img src={Logo} alt="Logo AlouCar" className={style.logo} />
          <hr className={style.linha} />
        </div>
        <div className={style.sidebar_corpo}>
          <SidebarItem texto="Home"      link="/"         logo={<MdHome />} />
          <SidebarItem texto="Clientes"  link="/clientes" logo={<MdPeople />} />
          <SidebarItem texto="Veículos"  link="/veiculos" logo={<MdDirectionsCar />} />
          <SidebarItem texto="Serviços"  link="/servicos" logo={<MdBuild />} />
        </div>
      </div>
      <div className={style.pagina_conteudo}>{children}</div>
    </div>
  );
}
