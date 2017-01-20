const WebSocketServer = require('uws').Server;
const uuid = require('node-uuid').v4;
const BASE_PORT = 3000;
const numberOfServers = process.argv[2] || 4;
const portsOpened = [];

const servers = Array.from(Array(numberOfServers).keys()).map((e, i) => {
    const port = BASE_PORT + i * 1000;
    const wss = new WebSocketServer({ port: port });
    wss.on('connection', onConnection);

    console.log(`Created WS server on port=${port}`);

    portsOpened.push(port);
    return wss;
});

const connections = new Map();
var connected = 0;
var messagesReceived = 0;
var bytesReceived = 0;

function onMessage(payload){
    messagesReceived ++;
    bytesReceived += (payload || '').length;
    // console.log(JSON.stringify(payload), null, 2);
    // process.exit(1);
}

function onConnection(ws){
    const id = uuid();
    ws._id = id;

    connections.set(id, ws);

    ws.send(`User(id=${id}) connected!`);
    connected++;

    ws.on('close', onClose);

    ws.on('message', onMessage);
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
    const traffic = bytesReceived > 1000000000 ? (Math.ceil(bytesReceived / 10000000) / 100 + 'GB') :
        bytesReceived > 1000000 ? (Math.ceil(bytesReceived / 100000) / 10 + 'MB') :
        bytesReceived > 1000 ? (Math.ceil(bytesReceived / 1000) + 'KB') :
        bytesReceived + 'b';


    process.stdout.write('\033c');
    console.log(`Opened ports: ${portsOpened.join(', ')}`);
    console.log(`Users connected: ${connected}, memory used: ${used} MB`);
    console.log(`Messages received: ${messagesReceived}, ${traffic}`);
}

reportMemoryUsage();
setInterval(reportMemoryUsage, 1000);
