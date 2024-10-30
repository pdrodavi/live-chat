export class Service {
    textArea = document.getElementById('text-area');
    sendMessageButton = document.getElementById('send-message-button');
    messagePanel = document.getElementById('message-panel');
    socket; 
    selectedUser;
    messageAreas = []

    constructor(socket, name){
        this.socket = socket
        this.name = name
    }

    activateChat(active){
        const enterChatPanel = document.getElementById('enter-chat-panel');
        const chatPanel = document.getElementById('chat-panel');
        const welcomeMessage = document.getElementById('welcome-message');
    
        if (active){
            enterChatPanel.classList.add('hide-element'); 
            chatPanel.classList.remove('hide-element');
            welcomeMessage.textContent = `Bem-vindo ao live-chat, ${this.name}!` 
        } else{
            enterChatPanel.classList.remove('hide-element'); 
            chatPanel.classList.add('hide-element'); 
            welcomeMessage.textContent = `Live chat` 
        }
       
    }    
    
    sendMessage(){
        console.log(`Sending message: ${this.textArea.value}`);
        console.log(this.selectedUser)
        this.socket.send(JSON.stringify({action: 'send-message', receiver: this.selectedUser.id, message: this.textArea.value}))
        
        const sentMessage = document.createElement('li')
        sentMessage.classList.add('message-sent')
        sentMessage.textContent = this.textArea.value
        const messageTime = document.createElement('div')
        messageTime.classList.add('message-time')
        const now = new Date();
        messageTime.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
        sentMessage.appendChild(messageTime)
        const messageArea = this.getMessageAreaBySenderName(this.selectedUser.id)
        messageArea.appendChild(sentMessage)
        this.scrollToBottom(messageArea)
        
        this.textArea.value = '';
    }
    
    updateOnlineUsers(onlineUsers){
        console.log('Updating online users' + JSON.stringify(onlineUsers))
        const ul = document.getElementById('users-online')
        const childrenArray = Array.from(ul.children);
    
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

                const onlineStatus = document.createElement('div');
                onlineStatus.classList.add('online-status')
                newUserItem.appendChild(onlineStatus)

                const messageArea = document.createElement('ul');
                messageArea.setAttribute('name', onlineUser);
                messageArea.classList.add('messages');
                this.messageAreas.push(messageArea);                
            } else {
                const onlineStatus = userItemFound.lastChild
                onlineStatus.classList.remove('offline')
            }
    
        }

        for (const userToVerifyIfIsOffline of childrenArray){
            const userOnline = onlineUsers.find(onlineUser => onlineUser === userToVerifyIfIsOffline.id)
            if (!userOnline){
                const onlineStatus = userToVerifyIfIsOffline.lastChild
                onlineStatus.classList.add('offline')
            }
        }

    }
    
    selectUser(event){  
        if (this.selectedUser){
            this.selectedUser.classList.remove('user-list-item-clicked')
        }
        this.selectedUser = event.currentTarget
        this.selectedUser.classList.add('user-list-item-clicked')
        
        console.log('User selected: ' + this.selectUser.id)

        const messageArea = this.getMessageAreaBySenderName(this.selectedUser.id)
        this.messagePanel.removeChild(this.messagePanel.firstElementChild)
        this.messagePanel.insertBefore(messageArea, this.messagePanel.firstChild)

        const unreadMessages = this.selectedUser.children[2];
        unreadMessages.textContent = ''

        this.textArea.disabled = false
        this.sendMessageButton.disabled = false

    }

    receiveMessage(message){
        console.log('Message received: ' + JSON.stringify(message))
        const messageArea = this.getMessageAreaBySenderName(message.sender)
        
        if (!messageArea){
            return
        }
        
        const receivedMessage = document.createElement('li');
        receivedMessage.classList.add('message-received');
        receivedMessage.textContent = message.message;
        const messageTime = document.createElement('div')
        messageTime.classList.add('message-time')
        const now = new Date();
        messageTime.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
        receivedMessage.appendChild(messageTime)
        messageArea.appendChild(receivedMessage);        
        this.scrollToBottom(messageArea);

        const userListItem = document.getElementById(message.sender);
        const unreadMessages = userListItem.children[2];

        unreadMessages.textContent = !unreadMessages.textContent ? 1 : Number(unreadMessages.textContent) + 1
    }

    getMessageAreaBySenderName(senderName){
        return this.messageAreas.find(messageArea => messageArea.getAttribute('name') === senderName); 
    }

    scrollToBottom(element) {
        const isAtBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 100;
        if (isAtBottom) {
            element.scrollTop = element.scrollHeight;
        }
    }
}