import React from "react";
// Certifique-se que o nome do arquivo CSS na pasta está igual a este import:
import "./PerguntaGeral.css"; 

// Imagem padrão caso o participante não tenha foto
const PLACEHOLDER_IMG = "https://via.placeholder.com/300?text=Sem+Foto";

export default function PerguntaGeral({ pergunta, winnerId, dadosParticipantes }) {
  
  // Função para pegar os dados de quem apertou o botão
  const getWinnerInfo = () => {
    if (!winnerId) return null;
    
    // O winnerId vem como string ("1", "2", etc).
    // dadosParticipantes vem do servidor com a estrutura { "1": {nome, img}, ... }
    const p = dadosParticipantes ? dadosParticipantes[winnerId] : null;
    
    if (p) {
        // Define se é Time 1 (ids 1,2,3) ou Time 2 (ids 4,5,6)
        const isTime1 = ['1','2','3'].includes(String(winnerId));
        return {
            nome: p.nome || `Participante ${winnerId}`,
            img: p.img || PLACEHOLDER_IMG, // Usa a imagem do upload ou placeholder
            time: isTime1 ? "TIME 1" : "TIME 2",
            classe: isTime1 ? "winner-time1" : "winner-time2"
        };
    }
    
    // Caso não encontre dados (fallback)
    return { 
        nome: `Botão ${winnerId}`, 
        img: PLACEHOLDER_IMG, 
        time: "Time Desconhecido",
        classe: "winner-unknown"
    };
  };

  const winnerData = getWinnerInfo();

  return (
    <div className="layout-geral">
      
      {/* HEADER */}
      <header className="header-logos" style={{justifyContent: 'center'}}>
         {/* Você pode colocar suas logos aqui novamente se quiser */}
         <h1 className="header-title">RODADA DE PERGUNTAS</h1>
      </header>

      {/* ÁREA PRINCIPAL */}
      <main className="arena-geral">
        <div className="center-stage">
            
            {/* Se houver uma pergunta selecionada pelo Admin */}
            {pergunta ? (
                <div className="question-box">
                    
                    {/* Se a pergunta tiver imagem */}
                    {pergunta.img && (
                        <div className="question-img-wrapper">
                            <img 
                                src={pergunta.img} 
                                alt="Imagem da Pergunta" 
                                className="question-image"
                            />
                        </div>
                    )}
                    
                    {/* Texto da Pergunta */}
                    <h1 className="question-text">{pergunta.text}</h1>
                    
                    {/* Indicador de Status (Ouvindo ou Bloqueado) */}
                    <div className={`status-indicator ${winnerId ? 'locked' : 'listening'}`}>
                        {winnerId ? "BLOQUEADO - RESPOSTA EM ANDAMENTO" : "AGUARDANDO RESPOSTA..."}
                    </div>
                </div>
            ) : (
                /* Tela de Espera quando não há pergunta */
                <div className="waiting-message">
                    <h1>Aguardando o Operador selecionar uma pergunta...</h1>
                </div>
            )}

        </div>
      </main>

      {/* MODAL DO VENCEDOR (Overlay) - Só aparece se tiver winnerId */}
      {winnerData && (
        <div className="overlay-winner">
            <div className={`winner-card ${winnerData.classe}`}>
                <div className="winner-header">BOTÃO ACIONADO!</div>
                <div className="winner-content">
                    <div className="winner-photo">
                        <img src={winnerData.img} alt="Foto do Jogador" />
                    </div>
                    <div className="winner-details">
                        <h2 className="winner-uni">{winnerData.time}</h2>
                        <h1 className="winner-name">{winnerData.nome}</h1>
                    </div>
                </div>
                <div className="winner-footer">
                    Aguardando validação do Juiz...
                </div>
            </div>
        </div>
      )}
    </div>
  );
}