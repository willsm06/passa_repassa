import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WebSocketProvider } from './context/WebSocketContext';
import AdminPanel from './pages/AdminPanel';
import DisplayManager from './pages/DisplayManager';
import Lobby from './pages/Lobby'; 

function App() {
  return (
    <WebSocketProvider>
      <BrowserRouter>
        <Routes>
          {/* O Admin entra aqui */}
          <Route path="/admin" element={<AdminPanel />} />
          {/* O Projetor entra aqui */}
          <Route path="/display" element={<DisplayManager />} />
          {/* Configuração Inicial */}
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/" element={<Navigate to="/admin" />} />
        </Routes>
      </BrowserRouter>
    </WebSocketProvider>
  );
}

export default App;