const WebSocketServer = require('uws').Server;
const uuid = require('node-uuid').v4;

const wss = new WebSocketServer({ port: 3000 });
const connections = new Map();
var connected = 0;

function onConnection(ws){
    const id = uuid();
    ws._id = id;

    connections.set(uuid, ws);

    ws.send(`User(id=${id}) connected!`);
    connected++;

    ws.on('close', onClose);
}

function onClose(){
    connections.set(this._id, null);
    connected--;
}

function formatMemoryOutput(data){
    return Math.round(data / 1000000);
}

function reportMemoryUsage(){
    const memory = process.memoryUsage();
    const used = formatMemoryOutput(memory.rss);

    console.log(`Users connected: ${connected}, memory used: ${used} MB`);
}

wss.on('connection', onConnection);

reportMemoryUsage();
setInterval(reportMemoryUsage, 1000);
