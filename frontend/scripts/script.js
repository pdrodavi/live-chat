import { Controller } from "./controller.js";
import { Service } from "./service.js";

let service;

function enterChat(){

    const name = document.getElementById('name-input').value;
    const socket = new WebSocket(`ws://localhost:8080?user=${name}`);

    if (!name){
        alert('Por favor insira um nome');
        return
    }   

    service = new Service(socket)
    const controller = new Controller(service);     
   
    
    socket.addEventListener("open", controller.onOpen.bind(controller));

    socket.addEventListener("message", controller.onMessage.bind(controller));

    socket.addEventListener("error", controller.onError.bind(controller));

    socket.addEventListener("close", controller.onClose.bind(controller));
}

function sendMessage(event){
    service.sendMessage(event)
}

window.sendMessage = sendMessage

window.enterChat = enterChat

