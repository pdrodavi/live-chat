var socket;

var messages = document.getElementById('messages');
var textArea =  document.getElementById('text-area');

var selectedUser;


function enterChat(input){
    const name = document.getElementById('name-input').value;

    if (!name){
        alert('Por favor insira um nome');
        return
    }

    socket = new WebSocket(`ws://localhost:8080?user=${name}`);

    socket.addEventListener("open", (event) => {
        console.log('Conectado') 
        activateChat(true)
    });

    socket.addEventListener("message", async (event) => {
        console.log(`Mensagem recebida: ${event.data}`)
        const message = JSON.parse(event.data);

        if (message.action === 'online-users'){
            updateOnlineUsers(message.onlineUsers)
        }

        if (message.action === 'receive-message'){
            const receivedMessage = document.createElement('li')
            receivedMessage.classList.add('message-received')
            receivedMessage.textContent = message.message
            messages.appendChild(receivedMessage)
        }
    });

    socket.addEventListener("error", (event) => {
        console.log("Ocorreu um erro na comunicação: ", event);
    });

    socket.addEventListener("close", (event) => {
        activateChat(false)
        if (event.code === 1008 & event.reason === "name.already.registered"){
            return alert("Já existe um usuário online registrado com esse nome, por favor escolha outro nome.")
        }

        alert("Chat desconectado!")
        console.log("A conexão foi encerrada");
    });
}

function activateChat(active){
    const enterChatPanel = document.getElementById('enter-chat-panel');
    const chatPanel = document.getElementById('chat-panel');

    if (active){
        enterChatPanel.classList.add('hide-element'); 
        chatPanel.classList.remove('hide-element'); 
    } else{
        enterChatPanel.classList.remove('hide-element'); 
        chatPanel.classList.add('hide-element'); 
    }
   
}


function sendMessage(){
    console.log(`Sending message: ${textArea.value}`);
    socket.send(JSON.stringify({action: 'send-message', receiver: selectedUser.id, message: textArea.value}))
    
    const sentMessage = document.createElement('li')
    sentMessage.classList.add('message-sent')
    sentMessage.textContent = textArea.value
    messages.appendChild(sentMessage)
    
    textArea.value = '';
}

function updateOnlineUsers(onlineUsers){
    const ul = document.getElementById('users-online')
    const childrenArray = Array.from(ul.children);
    console.log(childrenArray)

    for (const onlineUser of onlineUsers){

        const userItemFound = childrenArray.find(child => child.id === onlineUser);

        if(!userItemFound){
            const newUserItem = document.createElement('il');
            newUserItem.id = onlineUser
            newUserItem.classList.add('user-list-item')
            newUserItem.textContent = onlineUser
            newUserItem.onclick = selectUser;

            const avatar = document.createElement('img')
            avatar.src = 'https://avatar.iran.liara.run/username?username=' + onlineUser
            avatar.alt = onlineUser
            avatar.classList.add('avatar')
            newUserItem.insertBefore(avatar, newUserItem.firstChild)
            ul.appendChild(newUserItem)
        }

    }
}

function selectUser(event){

    if (selectedUser){
        selectedUser.classList.remove('user-list-item-clicked')
    }
    selectedUser = event.currentTarget
    selectedUser.classList.add('user-list-item-clicked')
}