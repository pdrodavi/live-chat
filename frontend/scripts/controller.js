
export class Controller {
    service = {}

    constructor(service){
        this.service = service
    }

    onOpen(){
        console.log('Chat Connected') 
        this.service.activateChat(true)
    }

    onMessage(event){
        console.log(`Message received: ${event.data}`)
        const message = JSON.parse(event.data);

        if (message.action === 'online-users'){
            this.service.updateOnlineUsers(message.onlineUsers);
        }

        if (message.action === 'receive-message'){
            this.service.receiveMessage(message);
        }
    }

    onError(event){        
        console.log("An error has occurred: ", event);
    }

    onClose(event){
        this.service.activateChat(false)
        if (event.code === 1008 & event.reason === "name.already.registered"){
            return alert("Já existe um usuário online registrado com esse nome, por favor escolha outro nome.")
        }

        alert("Chat desconectado!")
        console.log("Connection closed");
    }
}