import { useState } from "react";
import style from "./Cabecalho.module.css";
import logo from '../../../assets/imagens/logo.png';

const Cabecalho = () => {
  const [menuAtivo, setMenuAtivo] = useState(false);
  const toggleMenu = () => setMenuAtivo((v) => !v);
  const fechar = () => setMenuAtivo(false);

  return (
    <div className={style.Cabecalho}>
      <nav className={style.navBar}>
        <div className={style.logo}>
          <a href="../principal/index.html">
            <img src={Logo} alt="" />
          </a>
        </div>

        <ul className={`${style.menuItems} ${menuAtivo ? style.active : ""}`} role="menu" aria-hidden={!menuAtivo}>
          <button className={style.close} onClick={fechar} aria-label="Fechar menu" type="button">
            ×
          </button>

          <div className={style.logoMenu}>
            <p>Mobiliza Vida</p>
          </div>
          <li><a href="../linhaEMTU/linhaEMTU.html">EMTU</a></li>
          <li><a href="../linhaSOU/linhaSOU.html">SOU</a></li>
          <li><a href="#">Status</a></li>
          <li><a href="#">Tempo real</a></li>
        </ul>

        <button className={style.hamburger} onClick={toggleMenu} aria-expanded={menuAtivo} aria-controls="menu-mobile" type="button">
          <div></div><div></div><div></div>
        </button>
      </nav>

      <div
        className={`${style.overlay} ${menuAtivo ? style.show : ""}`}
        onClick={fechar}
      />
    </div>
  );
};

export { Cabecalho };
