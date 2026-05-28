import style from "./SidebarItem.module.css";
import { Link } from "react-router-dom";

export function SidebarItem({ texto, link, logo }) {
  return (
    <Link to={link} className={style.item}>
      <span className={style.icone}>{logo}</span>
      <span className={style.texto}>{texto}</span>
    </Link>
  );
}
