import React from "react";
import "./Placar.css";

// Importe as imagens (se não tiver os arquivos, comente essas linhas)
import Logo from "../images/logo.png"; // Ajuste o caminho se necessário
import Organizacao from "../images/organizacao.png";
import Apoio from "../images/apoio.png";
import Patrocinio from "../images/patrocinio.png";

export default function Placar({ pontosTime1, pontosTime2, dadosTimes }) {
  
  // Proteção contra dados vazios (caso o servidor ainda não tenha enviado)
  const time1 = dadosTimes?.time1 || { nome: "Aguardando Equipe 1...", img: "" };
  const time2 = dadosTimes?.time2 || { nome: "Aguardando Equipe 2...", img: "" };

  return (
    <div className="placar-container">

      {/* Cabeçalho */}
      <header className="header-logos">
         {/* Se as imagens não existirem, o layout não quebra */}
         <img src={Organizacao} alt="CBMR" height="70" />
         <img src={Logo} alt="RockBowl" height="90" className="logo-central" />
         <img src={Patrocinio} alt="Geobrugg" height="60" />
         <img src={Apoio} alt="Apoio" height="60" />
      </header>

      {/* Título */}
      <div className="game-title">
        <h1>PLACAR DO JOGO</h1>
      </div>

      {/* Arena Central */}
      <main className="arena">
        
        {/* Box Time 1 */}
        <div className="team-box">
            <div className="team-header">
                <h2>{time1.nome}</h2>
            </div>
            <div className="team-body">
                <div className="img-frame">
                    {time1.img ? (
                        <img src={time1.img} alt="Logo Time 1" />
                    ) : (
                        <span style={{color: '#999'}}>Sem Logo</span>
                    )}
                </div>
                <div className="score-display">
                    <span>{pontosTime1 || 0}</span>
                </div>
            </div>
        </div>

        {/* Marcador VS */}
        <div className="versus-marker">
            <span>X</span>
        </div>

        {/* Box Time 2 */}
        <div className="team-box">
            <div className="team-header">
                <h2>{time2.nome}</h2>
            </div>
            <div className="team-body">
                <div className="img-frame">
                    {time2.img ? (
                         <img src={time2.img} alt="Logo Time 2" />
                    ) : (
                        <span style={{color: '#999'}}>Sem Logo</span>
                    )}
                </div>
                <div className="score-display">
                    <span>{pontosTime2 || 0}</span>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}