// src/components/Footer/Footer.jsx
import React from 'react'
import styles from './Footer.module.css' // Corrigido: importação do CSS Module
import logoMobiliza from '../../assets/Imagens/logo.png'

const Footer = () => {
  return (
    <footer>
      <div className={`${styles.container} ${styles.sides}`}> {/* Corrigido: template literal */}
        <div className={styles.leftSide}> {/* Corrigido: camelCase */}
          <div className={styles.logo}>
            <img 
              src={logoMobiliza} 
              className="star" 
              style={{ height: "70px", width: "auto" }} 
              alt="Logo Mobiliza Vida" 
            />
            <div style={{ color: "#2c2c2c" }}>Mobiliza Vida</div>
          </div>

          <p className={`${styles.p} ${styles.leftSide}`}>
            <a className={styles.linkFooter} href="../linhaEMTU/linhaEMTU.html">EMTU</a>
            <a className={styles.linkFooter} href="../linhaSOU/linhaSOU.html">SOU</a>
            <a className={styles.linkFooter} href="">Status</a>
            <a className={styles.linkFooter} href="">Tempo real</a>
          </p>
        </div>

        <div className={styles.rightSide}>
          <ul className={styles.menu}>
            <li><a href="#">Companhia</a></li> 
            <li><a href="#">Ajuda</a></li> 
            <li><a href="#">Suporte</a></li> 
            <li><a href="#">Serviços</a></li>  {/* Corrigido: caracteres especiais */}
            <li><a href="#">Política&nbsp;de&nbsp;Privacidade</a></li> {/* Corrigido: caracteres especiais */}
          </ul>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.leftSide}>
          <p>&copy; Mobiliza Vida copyright 2025. Todos os direitos reservados</p>
        </div>
        <div className={`${styles.rightSide} ${styles.center}`}>
          <p>Termos e Condições</p> {/* Corrigido: caracteres especiais */}
        </div>
      </div>
    </footer>
  )
}

export { Footer };
