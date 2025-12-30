# 🎮 Sistema de Quiz Interativo (Passa ou Repassa)

Este é um sistema completo para gerenciamento de jogos de perguntas e respostas ao vivo, estilo "Passa ou Repassa" ou "Jeopardy". O projeto integra uma interface web moderna (React) com hardware externo (ESP32) via comunicação Serial e WebSockets para tempo real.

O sistema é dividido em duas partes principais:

1. **Admin Panel:** Onde o operador controla o jogo, lança perguntas, valida pontos e gerencia o placar.
2. **Display (Telão):** Interface passiva projetada para o público, mostrando apenas o que o operador decide (Placar, Pergunta atual, Vencedor do botão).

---

## 🚀 Tecnologias Utilizadas

### Frontend (Interface Visual)

* **React.js (Vite):** Framework para construção da interface rápida e reativa.
* **CSS3 Moderno:** Variáveis CSS e Flexbox para layouts responsivos e estilização temática.
* **React Router:** Gerenciamento de rotas (`/admin`, `/display`, `/lobby`).

### Backend (Servidor)

* **Node.js:** Ambiente de execução.
* **Express:** Servidor web para API e uploads.
* **WebSocket (`ws`):** Comunicação em tempo real entre Servidor, Admin e Telão (sincronização instantânea).
* **SerialPort:** Leitura de dados via USB para comunicação com o ESP32 (Botões Físicos).
* **Multer:** Gerenciamento de upload de imagens (logos dos times e fotos das perguntas).
* **File System (fs):** Persistência de dados leve em arquivos JSON (`perguntas.json`, `config_jogo.json`).

### Hardware

* **ESP32 / Arduino:** Microcontrolador responsável por detectar o acionamento dos botões físicos e enviar o sinal via Serial USB para o servidor.

---

## ⚙️ Pré-requisitos

Para rodar este projeto, você precisa ter instalado no seu computador:

1. **Node.js** (Versão LTS recomendada): [Baixar aqui](https://nodejs.org/).
2. **Git** (Opcional, para clonar o repositório).
3. **Navegador Web** (Chrome, Edge ou Firefox).

---

## 📦 Instalação

O projeto é dividido em duas pastas: a raiz (Frontend) e a pasta `server` (Backend) [https://github.com/willsm06/sereverPassa_repassa].

### 1. Configurando o Servidor (Backend)

Abra um terminal na pasta `server`:

```bash
cd server
npm install

```

### 2. Configurando o Frontend (React)

Abra um **novo terminal** na pasta raiz do projeto (onde está o `package.json` do Vite):

```bash
npm install

```

---

## ▶️ Como Rodar o Projeto

Você precisará de **dois terminais** abertos simultaneamente.

**Terminal 1 (Backend):**

```bash
cd server
node server.js

```

*Deve aparecer: `✅ SERVIDOR RODANDO EM: http://localhost:81*`

**Terminal 2 (Frontend):**

```bash
npm run dev

```

*Deve aparecer: `Local: http://localhost:5173/*`

---

## 🕹️ Guia de Uso (Fluxo do Jogo)

### 1. Preparação

1. Abra **http://localhost:5173/admin** no computador do operador.
2. Abra **http://localhost:5173/display** na tela do projetor (arraste a janela para o segundo monitor e aperte F11).

### 2. Configuração Inicial (Lobby)

1. No Admin, vá para a aba **LOBBY** (ou aperte `L`).
2. Cadastre o nome dos dois times.
3. Faça upload das logos dos times e fotos dos participantes (opcional).
4. Clique em **SALVAR TUDO**.
5. *O Telão mostrará automaticamente a tela de apresentação.*

### 3. Gerenciamento de Perguntas

1. No Admin, role até a seção de **Perguntas**.
2. Digite o texto da pergunta e selecione uma imagem (se houver).
3. Clique em "Salvar". A pergunta aparecerá na lista abaixo.

### 4. Rodada de Perguntas

1. Na lista de perguntas, clique em **PROJETAR** ao lado da pergunta desejada.
2. O Telão mudará automaticamente para mostrar a pergunta.
3. O sistema aguarda o acionamento do botão.

### 5. Acionamento do Botão (Buzzer)

* **Via Hardware:** Quando um jogador aperta o botão físico, o ESP32 manda um sinal via USB.
* **Via Simulação:** No Admin, pressione as teclas **1 a 6** do teclado.
* **O que acontece:**
* O Telão trava e mostra a foto/nome de quem apertou.
* O Admin recebe um alerta vermelho piscando.
* O Admin pergunta a resposta ao jogador.



### 6. Validação

* **Se acertou:** Admin clica em **✅ PONTO P/ [TIME]**. O ponto é somado, o buzzer reseta e o telão volta para o PLACAR.
* **Se errou:** Admin clica em **❌ ANULAR**. O buzzer destrava para outro tentar, ou clica para voltar ao placar.

### 7. Fim de Jogo

1. Quando houver um vencedor, clique em **🏆 É CAMPEÃO** no card do time respectivo.
2. O Telão exibirá uma animação de vitória com confetes.
3. Para começar um novo jogo, clique em **⚠️ ZERAR JOGO** no topo do Admin.

---

## ⌨️ Atalhos de Teclado (Admin)

Para agilizar a operação durante o evento, use os atalhos:

* **H** ➔ Ir para tela HOME (Logo do evento).
* **P** ➔ Ir para tela PLACAR.
* **L** ➔ Ir para tela LOBBY.
* **1 a 6** ➔ Simular botões dos participantes (apenas se uma pergunta estiver ativa).

---

## 🔌 Protocolo de Hardware (ESP32)

O servidor espera receber strings via Serial (Baud Rate: **115200**) contendo o ID do botão pressionado.

**Formato esperado:**

* `B1` (Botão 1 - Time 1)
* `B2` (Botão 2 - Time 1)
* `B3` (Botão 3 - Time 1)
* `B4` (Botão 4 - Time 2)
* `B5` (Botão 5 - Time 2)
* `B6` (Botão 6 - Time 2)

*Nota: O servidor tenta detectar automaticamente dispositivos com Vendor ID `10C4` (Drivers CP210x comuns em ESP32).*

---

## 🔮 Roadmap (Atualizações Futuras)

Ideias para melhorar o projeto em versões futuras:

* [ ] **MELHORAR O RESET DO JOGO (APAGANDO OS TIMES E AS PERGUNTAS JA CADASTRADAS).
* [ ] **Efeitos Sonoros:** Adicionar sons ao acertar, errar e ao declarar o campeão no Telão.
* [ ] **Cronômetro:** Adicionar um tempo limite para resposta na tela da pergunta.
* [ ] **Banco de Dados Real:** Migrar de arquivos JSON para SQLite ou MongoDB para histórico de partidas.
* [ ] **Mobile Admin:** Criar uma versão responsiva específica para controlar o jogo pelo celular.
* [ ] **Edição de Placar:** Permitir editar nomes dos times sem voltar ao Lobby.

---

## 🐛 Solução de Problemas Comuns

* **Erro "Network Error" / Tela Branca:** Verifique se o terminal do `server.js` está rodando. O React precisa do backend na porta 81.
* **ESP32 não conecta:** Verifique se o cabo USB é de dados (não apenas carga) e se nenhum outro programa (como Arduino IDE) está usando a porta COM.
* **Imagens não carregam:** Certifique-se de que fez o upload pelo Admin e que a pasta `server/uploads` existe (o servidor cria automaticamente, mas verifique permissões).
