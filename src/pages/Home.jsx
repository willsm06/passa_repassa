import React, { useEffect } from "react";
import "./Home.css";

// Importar Imagens
import Logo from "../images/logo.png"; // Logo do RockBowl
import Organizacao from "../images/organizacao.png"; // CBMR
import Apoio from "../images/apoio.png"; // Outros apoios
import Patrocinio from "../images/patrocinio.png"; // Geobrugg

function Home() {

  return (
    <div className="home-container">
      {/* Área Central - Logo Principal */}
      <main className="main-content">
        <div className="logo-wrapper">
          <img src={Logo} alt="RockBowl Logo" className="main-logo" />
        </div>
        <h1 className="event-title">Mecânica das Rochas</h1>
      </main>

      {/* Rodapé - Logos Institucionais */}
      <footer className="partners-footer">
        <div className="partner-group">
          <span className="partner-label">Apoio</span>
          <img src={Apoio} alt="Apoio" className="partner-logo" />
        </div>
        <div className="vertical-divider"></div>
        <div className="partner-group">
          <span className="partner-label">Realização</span>
          <img src={Organizacao} alt="CBMR" className="partner-logo" />
        </div>
        <div className="vertical-divider"></div>
        <div className="partner-group">
          <span className="partner-label">Patrocínio</span>
          <img src={Patrocinio} alt="Geobrugg" className="partner-logo" />
        </div>
      </footer>
    </div>
  );
}

export default Home;