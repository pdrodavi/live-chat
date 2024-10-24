import {ChatService} from '../services/chat-service.js'

export class Controller {
    chatService = new ChatService()

    onConnection(ws, req){
        const user = this.chatService.getUser(req);
    
        if (this.chatService.isUserAlreadyRegistered(user)){
            ws.close(1008, 'name.already.registered')
        }     
        
        this.chatService.pushConnection(user, ws)
        this.chatService.sendOnlineUsers()
    
        console.log(`User connected ${user}`);  
    
        ws.on('error', (error) =>{
            this.onError(error)
        })
        
        ws.on('message', (message) =>{
            this.onMessage(message)
        })
        
        ws.on('close', (ws)=>{
            this.onClose(ws)
        }) 
    }

    onMessage(message){
        console.log('Message received: ' + message.toString());
        const parsedMessage =  JSON.parse(message.toString()); 

        if (parsedMessage.action === 'send-message'){
            const foundConnection = this.chatService.getConnectionByUser(parsedMessage.receiver)

            if (foundConnection){
                foundConnection.ws.send(JSON.stringify({action: 'receive-message', message: parsedMessage.message}))
            }
        }
    }

    onClose(ws){
        this.chatService.removeConnection(ws);
    }

    onError(error){
        console.log(error);
    }
}