const WebSocket = require('ws');

const path = process.argv[2];
const limit = process.argv[3] || 16000;

const CONNECTION_RATE = 40;
const CONNECTION_TIMEOUT = 10;

var usersCounter = 0;

function openConnection(index){
    const ws = new WebSocket(path);

    ws.on('open', () => ws.send(`Hello from user(index=${index})`));
    ws.on('message', data => console.log(data));
    ws.on('close', () => usersCounter--);
}

setInterval(() => {
    if (usersCounter > limit){
        return;
    }

    for(var i = 0; i < CONNECTION_RATE; i ++){
        openConnection(usersCounter++);
    }
}, CONNECTION_TIMEOUT);
