export class Service {
    textArea = document.getElementById('text-area');
    messagePanel = document.getElementById('message-panel');
    socket; 
    selectedUser;
    messageAreas = []

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
        const messageArea = this.getMessageAreaBySenderName(this.selectedUser.id)
        messageArea.appendChild(sentMessage)
        
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
                newUserItem.id = onlineUser;
                newUserItem.classList.add('user-list-item');
                newUserItem.onclick = this.selectUser.bind(this);
    
                const avatar = document.createElement('img');
                avatar.src = 'https://avatar.iran.liara.run/username?username=' + onlineUser;
                avatar.alt = onlineUser;
                avatar.classList.add('avatar');
                newUserItem.insertBefore(avatar, newUserItem.firstChild);
                ul.appendChild(newUserItem);

                const userNameDiv = document.createElement('div');
                userNameDiv.classList.add('user-list-item-name');
                userNameDiv.textContent = onlineUser;
                newUserItem.appendChild(userNameDiv);

                const unreadMessagesDiv = document.createElement('div');
                unreadMessagesDiv.classList.add('unread-messages');
                newUserItem.appendChild(unreadMessagesDiv);

                const messageArea = document.createElement('ul');
                messageArea.setAttribute('name', onlineUser);
                messageArea.classList.add('messages');
                this.messageAreas.push(messageArea);
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

        const messageArea = this.getMessageAreaBySenderName(this.selectedUser.id)
        this.messagePanel.removeChild(this.messagePanel.firstChild)
        this.messagePanel.insertBefore(messageArea, this.messagePanel.firstChild)

        const unreadMessages = this.selectedUser.lastChild;
        unreadMessages.textContent = ''

    }

    receiveMessage(message){
        const messageArea = this.getMessageAreaBySenderName(message.sender)
        
        if (!messageArea){
            return
        }
        
        const receivedMessage = document.createElement('li');
        receivedMessage.classList.add('message-received');
        receivedMessage.textContent = message.message;
        messageArea.appendChild(receivedMessage);

        const userListItem = document.getElementById(message.sender);
        const unreadMessages = userListItem.lastChild;

        unreadMessages.textContent = !unreadMessages.textContent ? 1 : Number(unreadMessages.textContent) + 1
    }

    getMessageAreaBySenderName(senderName){
        return this.messageAreas.find(messageArea => messageArea.getAttribute('name') === senderName); 
    }
}