// src/context/WebSocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  
  // Aponta para o servidor que criamos no Passo 2
  const SERVER_URL = `ws://localhost:81`; 

  useEffect(() => {
    const ws = new WebSocket(SERVER_URL);
    
    ws.onopen = () => console.log('✅ Conectado ao Servidor WS');
    ws.onmessage = (e) => {
        try {
            setLastMessage(JSON.parse(e.data));
        } catch(err) { console.error(err); }
    };
    ws.onclose = () => console.log('❌ Desconectado do Servidor');

    setSocket(ws);
    return () => ws.close();
  }, []);

  const sendMessage = (type, payload) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type, payload }));
    } else {
        console.warn("Tentando enviar mensagem sem conexão:", type);
    }
  };

  return (
    <WebSocketContext.Provider value={{ sendMessage, lastMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);