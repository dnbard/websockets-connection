const WebSocket = require('ws');

const path = process.argv[2];
const limit = process.argv[3] || 16000;

const CONNECTION_RATE = 40;
const CONNECTION_TIMEOUT = 10;

var usersCounter = 0;

function openConnection(index){
    const ws = new WebSocket(path);
    var interval = null;

    ws.on('open', () => {
        ws.send(`Hello from user(index=${index})`);
        interval = setInterval(() => {
            ws.send(someData);
        }, Math.ceil(Math.random() * 10000) + 5000);
    });


    ws.on('close', () => {
        usersCounter--;
        clearInterval(interval);
    });
}

const someData = generateRandomData(4096);

function generateRandomData(size){
    const chars = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const len = chars.length;
    const random_data = [];

    while (size--) {
        random_data.push(chars[Math.random()*len | 0]);
    }

    return random_data.join('');
}

function formatMemoryOutput(data){
    return Math.round(data / 1000000);
}

function reportMemoryUsage(){
    const memory = process.memoryUsage();
    const used = formatMemoryOutput(memory.rss);

    process.stdout.write('\033c');
    console.log(`Memory used: ${used} MB`);
}

setInterval(() => {
    if (usersCounter > limit){
        return reportMemoryUsage();
    }

    for(var i = 0; i < CONNECTION_RATE; i ++){
        openConnection(usersCounter++);
    }
    reportMemoryUsage();
}, CONNECTION_TIMEOUT);

setInterval(() => {
    if (typeof global.gc === 'function'){
        gc();
    }
}, 30000)
