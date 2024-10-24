const chatService = require('../services/chat-service')


class Controller {

    onConnection(ws, req){
        const user = chatService.getUser(req);
    
        if (chatService.isUserAlreadyRegistered(user)){
            ws.close(1008, 'name.already.registered')
        }     
        
        chatService.pushConnection(user, ws)
        chatService.sendOnlineUsers()
    
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
            const foundConnection = chatService.getConnectionByUser(parsedMessage.receiver)

            if (foundConnection){
                foundConnection.ws.send(JSON.stringify({action: 'receive-message', message: parsedMessage.message}))
            }
        }
    }

    onClose(ws){
        chatService.removeConnection(ws);
    }

    onError(error){
        console.log(error);
    }
}


module.exports = new Controller();