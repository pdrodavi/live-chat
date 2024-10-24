import { WebSocketServer } from 'ws'
import { Controller } from './app/controllers/controller.js'

const options = {
    port: 8080
}

const controller = new Controller()

const server = new WebSocketServer(options)

server.on('connection', controller.onConnection.bind(controller))


