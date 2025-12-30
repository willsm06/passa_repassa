import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import './AdminPanel.css'; 

export default function AdminPanel() {
  const { sendMessage, lastMessage } = useWebSocket();
  const [questions, setQuestions] = useState([]);
  const [novaPergunta, setNovaPergunta] = useState({ text: "", img: "" });
  const [status, setStatus] = useState("Desconectado");
  const [winner, setWinner] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [localScore, setLocalScore] = useState({ time1: 0, time2: 0 });
  const [teams, setTeams] = useState({ 
      time1: {nome: "Time 1"}, 
      time2: {nome: "Time 2"} 
  });

  // --- ESCUTAR TECLADO (Atalhos + Simulação) ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 1. Ignora atalhos se estiver digitando em um input ou textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const key = e.key.toLowerCase();

      // 2. Atalhos de Tela
      if (key === 'h') sendMessage('SET_SCREEN', 'HOME');
      if (key === 'p') sendMessage('SET_SCREEN', 'PLACAR');
      if (key === 'l') sendMessage('SET_SCREEN', 'LOBBY');

      // 3. Simulação de Botões (1-6)
      if (['1', '2', '3', '4', '5', '6'].includes(key)) {
        sendMessage('SIMULATE_BUTTON', key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sendMessage]);


  useEffect(() => {
    fetch('http://localhost:81/api/perguntas')
      .then(r => r.json())
      .then(data => setQuestions(data))
      .catch(e => console.error(e));
  }, []);

  useEffect(() => {
    if (lastMessage) {
        if(lastMessage.type === 'SYNC_STATE') {
            setStatus("Sincronizado");
            if(lastMessage.payload.score) setLocalScore(lastMessage.payload.score);
            if(lastMessage.payload.teams) setTeams(lastMessage.payload.teams);
        }
        if(lastMessage.type === 'BUZZER_WINNER') setWinner(lastMessage.payload); 
        if(lastMessage.type === 'RESET_BUZZER') setWinner(null);
        if(lastMessage.type === 'UPDATE_SCORE') setLocalScore(lastMessage.payload);
        
        if(lastMessage.type === 'SYNC_STATE' && lastMessage.payload.score.time1 === 0 && lastMessage.payload.score.time2 === 0) {
             setLocalScore({time1: 0, time2: 0});
        }
    }
  }, [lastMessage]);

  const handleScore = (team, delta) => {
      const newScore = { ...localScore, [team]: Math.max(0, localScore[team] + delta) };
      setLocalScore(newScore);
      sendMessage('UPDATE_SCORE', newScore);
  };

  const declararCampeao = (teamKey) => {
      const nomeTime = teams[teamKey].nome;
      if (window.confirm(`Declarar ${nomeTime} como CAMPEÃO?`)) {
          sendMessage('DECLARE_WINNER', teamKey);
      }
  };

  const resetarJogo = () => {
      if (window.confirm("ZERAR O JOGO?")) {
          sendMessage('RESET_GAME');
      }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
        const res = await fetch('http://localhost:81/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        setNovaPergunta(prev => ({ ...prev, img: data.url }));
    } catch (err) { alert("Erro upload"); } finally { setUploading(false); }
  };

  const addQuestion = async (e) => {
      e.preventDefault(); 
      if(!novaPergunta.text) return;
      const novas = [...questions, { ...novaPergunta, id: Date.now() }];
      setQuestions(novas);
      setNovaPergunta({ text: "", img: "" });
      try { await fetch('http://localhost:81/api/perguntas', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(novas) }); } catch (err) {}
  };

  // Lógica auxiliar para saber quem é o time do botão vencedor
  const getWinnerTeamKey = () => {
      if (!winner) return null;
      return ['1','2','3'].includes(String(winner)) ? 'time1' : 'time2';
  };
  const winnerTeamKey = getWinnerTeamKey();

  return (
    <div className="admin-container">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom: '2px solid #ccc', paddingBottom: 10, marginBottom: 20}}>
          <h1 style={{margin:0, border: 'none'}}>
              PAINEL DE CONTROLE 
              <span className="status-badge">{status}</span>
          </h1>
          <button className="btn-reset-danger" onClick={resetarJogo}>⚠️ ZERAR JOGO</button>
      </div>

      {/* LEGENDA DE ATALHOS */}
      <div className="shortcuts-legend">
          <span>⌨️ <b>ATALHOS:</b></span>
          <span className="key-hint">[H] Home</span>
          <span className="key-hint">[P] Placar</span>
          <span className="key-hint">[L] Lobby</span>
          <span className="key-hint" style={{marginLeft: 20}}>🔴 [1-6] Simular Botões</span>
      </div>
      
      <div className="section controls">
        <h3>Trocar Tela do Projetor</h3>
        <div className="nav-buttons">
            <button className="btn-nav" onClick={() => sendMessage('SET_SCREEN', 'HOME')}>
                HOME <small>(H)</small>
            </button>
            <button className="btn-nav" onClick={() => sendMessage('SET_SCREEN', 'PLACAR')}>
                PLACAR <small>(P)</small>
            </button>
            <button className="btn-nav" onClick={() => sendMessage('SET_SCREEN', 'LOBBY')}>
                LOBBY <small>(L)</small>
            </button>
        </div>
      </div>

      <div className="section">
          <h3>Placar e Campeão</h3>
          <div className="score-board">
              <div className="team-score">
                  <h4 className="team-name-display">{teams.time1.nome}</h4>
                  <span className="score-value">{localScore.time1}</span>
                  <div>
                      <button className="btn-score btn-plus" onClick={() => handleScore('time1', 1)}>+</button>
                      <button className="btn-score btn-minus" onClick={() => handleScore('time1', -1)}>-</button>
                  </div>
                  <button className="btn-champion" onClick={() => declararCampeao('time1')}>
                      CAMPEÃO
                  </button>
              </div>

              <div className="team-score">
                  <h4 className="team-name-display">{teams.time2.nome}</h4>
                  <span className="score-value">{localScore.time2}</span>
                  <div>
                      <button className="btn-score btn-plus" onClick={() => handleScore('time2', 1)}>+</button>
                      <button className="btn-score btn-minus" onClick={() => handleScore('time2', -1)}>-</button>
                  </div>
                  <button className="btn-champion" onClick={() => declararCampeao('time2')}>
                      CAMPEÃO
                  </button>
              </div>
          </div>
      </div>

      {winner && winnerTeamKey && (
          <div className="section winner-alert">
              <h1 className="winner-title">BOTÃO {winner} APERTOU!</h1>
              <div className="winner-actions">
                  <button className="btn-confirm" onClick={() => {
                      handleScore(winnerTeamKey, 1);
                      sendMessage('RESET_BUZZER');
                      sendMessage('SET_SCREEN', 'PLACAR');
                  }}>
                      PONTO P/ {teams[winnerTeamKey].nome}
                  </button>
                  <button className="btn-reset" onClick={() => {
                      sendMessage('RESET_BUZZER');
                      sendMessage('SET_SCREEN', 'PLACAR');
                  }}>
                      ANULAR
                  </button>
              </div>
          </div>
      )}

      <div className="section questions">
        <h3>Perguntas</h3>
        <div className="questions-layout">
            <form className="q-form" onSubmit={addQuestion}>
                <textarea placeholder="Digite a pergunta aqui..." value={novaPergunta.text} onChange={e => setNovaPergunta({...novaPergunta, text: e.target.value})} />
                <input type="file" onChange={handleImageUpload} disabled={uploading} />
                <button type="submit" className="btn-save">Salvar</button>
            </form>
            <div className="q-list">
                {questions.map((q, i) => (
                    <div key={q.id} className="q-item">
                        <span className="q-text"><b>{i+1}.</b> {q.text}</span>
                        <button className="btn-project" onClick={() => sendMessage('SET_QUESTION', q)}>PROJETAR</button>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}