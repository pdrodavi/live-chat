export class ChatService{
    connections = []

    pushConnection(user, ws){
        this.connections.push({user, ws})
    }

    getConnectionByUser(user){
        return this.connections.find(connection => connection.user === user)
    }

    isUserAlreadyRegistered(user){
        return !!this.connections.find(connection => connection.user === user);
    }

    getUser(req){
        const url = new URL(req.url, `http://${req.headers.host}`);
        return url.searchParams.get('user');
    }

    sendOnlineUsers(){
        this.connections.forEach((connection)=>{        
        const onlineUsers = this.connections.map(connection => connection.user).filter(user => user !== connection.user)
            connection.ws.send(JSON.stringify({action: 'online-users', onlineUsers}))
        })
    }

    removeConnection(ws){                
        console.log('Connection closed sending users online to all users');
        const connectionIndex = this.connections.indexOf(connection => connection.ws === ws)
        this.connections.splice(connectionIndex, 1)
        this.sendOnlineUsers()
    }
}