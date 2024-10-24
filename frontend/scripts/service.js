export class Service {
    socket = {}    

    textArea = document.getElementById('text-area');
    selectedUser;

    constructor(socket){
        this.socket = socket
    }

    activateChat(active){
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
    
    
    sendMessage(){
        console.log(`Sending message: ${this.textArea.value}`);
        console.log(this.selectedUser)
        this.socket.send(JSON.stringify({action: 'send-message', receiver: this.selectedUser.id, message: this.textArea.value}))
        
        const sentMessage = document.createElement('li')
        sentMessage.classList.add('message-sent')
        sentMessage.textContent = this.textArea.value
        messages.appendChild(sentMessage)
        
        this.textArea.value = '';
    }
    
    updateOnlineUsers(onlineUsers){
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
                newUserItem.onclick = this.selectUser.bind(this);
    
                const avatar = document.createElement('img')
                avatar.src = 'https://avatar.iran.liara.run/username?username=' + onlineUser
                avatar.alt = onlineUser
                avatar.classList.add('avatar')
                newUserItem.insertBefore(avatar, newUserItem.firstChild)
                ul.appendChild(newUserItem)
            }
    
        }
    }
    
    selectUser(event){    
        console.log('selecionou')
        if (this.selectedUser){
            this.selectedUser.classList.remove('user-list-item-clicked')
        }
        this.selectedUser = event.currentTarget
        this.selectedUser.classList.add('user-list-item-clicked')
    }
}