const WebSocketServer = require('ws').WebSocketServer

const options = {
    port: 8080
}

const server = new WebSocketServer(options)

const connections = []


server.on('connection', (ws, req) =>{
    const url = new URL(req.url, `http://${req.headers.host}`);
    const user = url.searchParams.get('user');

    connections.push({user, ws})

    console.log(`User connected ${user}`);   
    ws.on('error', (error,)=>{
        console.log(error);
    })
    
    ws.on('message', (message) =>{
        console.log('Message received: ' + message.toString());
        const parsedMessage =  JSON.parse(message.toString())
        console.log(parsedMessage.action)

        if (parsedMessage.action === 'get-online-users'){
            ws.send(getOnlineUsersList())
        }

        if (parsedMessage.action === 'send-message'){
            const foundConnection = connections.find(connection => connection.user === parsedMessage.receiver)

            if (foundConnection){
                foundConnection.ws.send(JSON.stringify({action: 'receive-message', message: parsedMessage.message}))
            }
        }
    })
    
    ws.on('close', () =>{
        console.log('Connection closed');
    }) 
})

function getOnlineUsersList(){
    return connections.map(connection => connection.user)
}

