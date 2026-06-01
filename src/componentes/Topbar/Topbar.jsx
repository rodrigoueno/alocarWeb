import style from "./Topbar.module.css";
import { Link } from "react-router-dom";
import { MdLogout } from "react-icons/md";

export function Topbar({ children }) {
  return (
    <div>
      <div className={style.topbar_conteudo}>
        
      </div>
      <div className={style.pagina_conteudo}>
        {children}
      </div>
    </div>
  );
}
