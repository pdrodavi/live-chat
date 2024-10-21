const WebSocketServer = require('ws').WebSocketServer

const options = {
    port: 8080
}

const server = new WebSocketServer(options)

const onlineUsers = []


server.on('connection', (connection, req) =>{
    const url = new URL(req.url, `http://${req.headers.host}`);
    const user = url.searchParams.get('user');
    
    console.log(`User connected ${user}`);   
    connection.on('error', (error,)=>{
        console.log(error);
    })
    
    connection.on('message', (message) =>{
        console.log('Message received: ' + message.toString());
    })
    
    connection.on('close', () =>{
        console.log('Connection closed');
    }) 
})

