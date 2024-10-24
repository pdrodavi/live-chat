const WebSocketServer = require('ws').WebSocketServer

const controller = require('./controller')

const options = {
    port: 8080
}

const server = new WebSocketServer(options)

server.on('connection', controller.onConnection.bind(controller))


