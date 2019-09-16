const net = require('net');
const rl = require('readline');
let connected = false;
const commands = [
    "initialize\r\n",
    "create\r\n",
    "print\r\n"
];
const stream = net.createConnection({port: 8000}, () => {
    console.log('connected to server!');
});

stream.on('data', (chunk) => {
    console.log(`i received\r\n${chunk}`);
    if (chunk.toString() === "client connected\r\n" && !connected) {
        connected = true;
    }
    if (connected) {
        commands.map((command) => {
            console.log(command);
            stream.write(command);
            commands.shift();
        });
    }
});

stream.on('end', () => {
    console.log('fin de la lecture');
});



