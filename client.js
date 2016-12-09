const WebSocket = require('ws');
const path = process.argv[2];
var userIndex = 0;

console.log(`Using path: ${path}`);

function openConnection(index){
    var ws = new WebSocket(path);

    ws.on('open', function open() {
      ws.send(`Hello from user(index=${index})`);
    });

    ws.on('message', function(data, flags) {
        console.log(data);
    });
}

setInterval(() => {
    if (userIndex > 16000){
        return;
    }

    for(var i = 0; i < 40; i ++){
        openConnection(userIndex++);
    }
}, 10);
