const WebSocketServer = require('ws').WebSocketServer

const options = {
    port: 8080
}

const server = new WebSocketServer(options)

const connections = []


server.on('connection', (ws, req) =>{
    const url = new URL(req.url, `http://${req.headers.host}`);
    const user = url.searchParams.get('user');

    const userAlreadyRegistered = connections.find(connection => connection.user === user);

    if (userAlreadyRegistered){
        ws.close(1008, 'name.already.registered')
    }     
    
    connections.push({user, ws})
    sendOnlineUsers()

    console.log(`User connected ${user}`);  

    ws.on('error', (error,)=>{
        console.log(error);
    })
    
    ws.on('message', (message) =>{
        console.log('Message received: ' + message.toString());
        const parsedMessage =  JSON.parse(message.toString()); 

        if (parsedMessage.action === 'send-message'){
            const foundConnection = connections.find(connection => connection.user === parsedMessage.receiver)

            if (foundConnection){
                foundConnection.ws.send(JSON.stringify({action: 'receive-message', message: parsedMessage.message}))
            }
        }
    })
    
    ws.on('close', () =>{
        console.log('Connection closed sending users online to all users');
        const connectionIndex = connections.indexOf(connection => connection.ws === ws)
        connections.splice(connectionIndex, 1)
        sendOnlineUsers()
    }) 
})

function sendOnlineUsers(){
    connections.forEach((connection)=>{        
    const onlineUsers = connections.map(connection => connection.user).filter(user => user !== connection.user)
        connection.ws.send(JSON.stringify({action: 'online-users', onlineUsers}))
    })
}

