# Live Chat Application

Este é um projeto de aplicação de chat ao vivo que utiliza WebSockets para comunicação em tempo real. O frontend é construído com Vanilla JavaScript, sem o uso de frameworks, e o backend é implementado em Node.js utilizando o pacote `ws`.

## Funcionalidades

- **Chat em tempo real**: Mensagens são enviadas e recebidas instantaneamente entre os usuários.
- **Indicação de status**: Usuários online são mostrados com um indicador de status.
- **Indicação de mensagens não lidas**: Mensagens recebidas e não lidas são notificadas na lista de usuários online.
- **Suporte a múltiplos usuários**: Vários usuários podem se conectar e conversar ao mesmo tempo.

## Tecnologias Utilizadas

- **Frontend**: 
  - Vanilla JavaScript
  - HTML
  - CSS

- **Backend**:
  - Node.js
  - Pacote `ws` para WebSocket

## Como Executar o Projeto

### Requisitos

- Node.js (versão 14 ou superior)

### Configuração do Backend

1. Navegue até a pasta do backend:

   ```bash
   cd backend

2. Instale as dependências:

    ```bash
    npm install ws

3. Inicie o servidor

    ```bash
    node main.js

### Configuração do Frontend

1. Navegue até a pasta do frontend.

2. Abra o arquivo index.html em um navegador.