import React from "react";
import "./Campeao.css";

export default function Campeao({ dadosTime }) {
  // dadosTime: { nome: "Nome do Time", img: "url..." }

  return (
    <div className="campeao-container">
      {/* Efeito de confete CSS simples */}
      <div className="confetti"></div>
      
      <h1 className="titulo-campeao">GRANDE CAMPEÃO</h1>
      
      <div className="trofeu-area">
          🏆
      </div>

      <div className="card-campeao">
         {dadosTime.img ? (
             <img src={dadosTime.img} alt="Campeão" className="img-campeao" />
         ) : (
             <div style={{fontSize: 50}}></div>
         )}
         <h2 className="nome-campeao">{dadosTime.nome}</h2>
      </div>

      <div className="footer-campeao">
        PARABÉNS PELA VITÓRIA!
      </div>
    </div>
  );
}