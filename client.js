var net = require('net');
const rl = require('readline');

let state = {
  handShake: false,
  socketIdList: [],
};

var stream = net.createConnection({port: 8000}, () => {
    console.log('connected to server!\r\n');
});

stream.on('data', (chunk) => {
    const chunkString = chunk.toString();
    if(/Your socket id is/.test(chunkString)) {
        const socketId = chunkString.replace(/Your socket id is :/, '');
        state.handShake = true;
        state.socketIdList.push(socketId);
        console.log('state', state);
    }
    console.log(`i received ${chunk}\r\n`);
});

stream.on('end', () => {
    console.log('fin de la lecture\r\n');
});
stream.write('initialize\r\n');
stream.write("create\r\n");
stream.write("print\r\n");
