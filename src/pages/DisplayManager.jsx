import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../context/WebSocketContext';

import Home from './Home'; 
import Placar from './Placar';
import PerguntaGeral from './PerguntaGeral';
import Lobby from './Lobby';
import Campeao from './Campeao'; // NOVO IMPORT

export default function DisplayManager() {
  const { lastMessage } = useWebSocket();
  
  const [screen, setScreen] = useState('HOME');
  const [globalState, setGlobalState] = useState({
      score: { time1: 0, time2: 0 },
      teams: { time1: {nome: "Time 1"}, time2: {nome: "Time 2"}, participantes: {} },
      buzzer: { locked: false, winner: null },
      currentQuestion: null,
      winnerTeam: null
  });

  useEffect(() => {
    if (!lastMessage) return;

    const { type, payload } = lastMessage;

    switch (type) {
        case 'SYNC_STATE':
            setGlobalState(payload);
            setScreen(payload.screen);
            break;

        case 'UPDATE_SCREEN':
            setScreen(payload);
            break;

        case 'NEW_QUESTION':
            setGlobalState(prev => ({
                ...prev,
                currentQuestion: payload.currentQuestion,
                buzzer: { locked: false, winner: null }
            }));
            setScreen('PERGUNTA');
            break;

        case 'UPDATE_SCORE':
            setGlobalState(prev => ({ ...prev, score: payload }));
            break;

        case 'BUZZER_WINNER':
            setGlobalState(prev => ({ ...prev, buzzer: { locked: true, winner: payload } }));
            break;

        case 'RESET_BUZZER':
            setGlobalState(prev => ({ ...prev, buzzer: { locked: false, winner: null } }));
            break;
            
        case 'SHOW_CHAMPION':
            setGlobalState(payload);
            setScreen('CAMPEAO');
            break;

        default: break;
    }
  }, [lastMessage]);

  const renderScreen = () => {
      switch (screen) {
          case 'HOME':
              return <Home />;
          case 'PLACAR':
              return <Placar 
                  pontosTime1={globalState.score.time1} 
                  pontosTime2={globalState.score.time2}
                  dadosTimes={globalState.teams} 
              />;
          case 'PERGUNTA':
              return <PerguntaGeral 
                  pergunta={globalState.currentQuestion}
                  winnerId={globalState.buzzer.winner}
                  dadosParticipantes={globalState.teams.participantes}
              />;
          case 'LOBBY':
              return <Lobby />; // ou uma tela de espera simples
          
          case 'CAMPEAO':
              // Lógica para pegar os dados do campeão
              const winnerKey = globalState.winnerTeam || 'time1';
              const winnerData = globalState.teams[winnerKey] || { nome: "Vencedor", img: "" };
              return <Campeao dadosTime={winnerData} />;

          default:
              return <div style={{color:'red'}}>Tela Desconhecida: {screen}</div>;
      }
  };

  return <div>{renderScreen()}</div>;
}