// src/pages/Lobby.jsx
import React, { useState } from "react";
import "./Lobby.css"; 

export default function Lobby() {
  const [teams, setTeams] = useState({
    time1: { nome: "Time 1", img: "" },
    time2: { nome: "Time 2", img: "" },
    participantes: {} 
  });

  // Upload REAL para o servidor
  const uploadImage = async (e, pathInState) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Envia para o servidor na porta 81
      const res = await fetch('http://localhost:81/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      // Salva a URL que o servidor devolveu
      if (pathInState === 'time1') setTeams(p => ({...p, time1: {...p.time1, img: data.url}}));
      else if (pathInState === 'time2') setTeams(p => ({...p, time2: {...p.time2, img: data.url}}));
      else {
        setTeams(p => ({
            ...p, 
            participantes: { ...p.participantes, [pathInState]: { ...p.participantes[pathInState], img: data.url } }
        }));
      }
    } catch (err) {
      alert("Erro no upload: " + err);
    }
  };

  const handleNameChange = (val, path, subId) => {
      if(path === 'time1' || path === 'time2') {
          setTeams(p => ({...p, [path]: {...p[path], nome: val}}));
      } else {
          setTeams(p => ({
            ...p, 
            participantes: { ...p.participantes, [subId]: { ...p.participantes[subId], nome: val } }
        }));
      }
  };

  const salvarTudo = async () => {
      try {
        await fetch('http://localhost:81/api/config', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(teams)
        });
        alert("✅ Dados salvos e sincronizados com todas as telas!");
      } catch (e) {
        alert("Erro ao salvar. O servidor está rodando?");
      }
  };

  return (
    <div className="container-lobby">
       <h1>Cadastro de Equipes (ONLINE)</h1>
       {/* ... (O resto do HTML continua igual ao anterior, com inputs e maps) ... */}
       {/* Vou resumir a estrutura para não ficar gigante, use a mesma estrutura visual de antes */}
       <div className="teams-container">
          <div className="team-card">
            <h2>Time 1</h2>
            <input type="text" onChange={e => handleNameChange(e.target.value, 'time1')} placeholder="Nome Time" />
            <input type="file" onChange={e => uploadImage(e, 'time1')} />
            {teams.time1.img && <img src={teams.time1.img} width="80" alt="ok"/>}
            
            {[1,2,3].map(id => (
                <div key={id} style={{marginTop: 10}}>
                    <label>P{id}</label>
                    <input type="text" onChange={e => handleNameChange(e.target.value, 'part', id)} />
                    <input type="file" onChange={e => uploadImage(e, id)} />
                </div>
            ))}
          </div>
          <div className="team-card">
             <h2>Time 2</h2>
             <input type="text" onChange={e => handleNameChange(e.target.value, 'time2')} placeholder="Nome Time" />
             <input type="file" onChange={e => uploadImage(e, 'time2')} />
             {teams.time2.img && <img src={teams.time2.img} width="80" alt="ok"/>}

             {[4,5,6].map(id => (
                <div key={id} style={{marginTop: 10}}>
                    <label>P{id}</label>
                    <input type="text" onChange={e => handleNameChange(e.target.value, 'part', id)} />
                    <input type="file" onChange={e => uploadImage(e, id)} />
                </div>
            ))}
          </div>
       </div>
       <button className="save-all-btn" onClick={salvarTudo}>SALVAR TUDO</button>
    </div>
  );
}