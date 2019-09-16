var net = require('net');
const rl = require('readline');

var stream = net.createConnection({port: 8000}, () => {
    console.log('connected to server!\r\n');
});

stream.on('data', (chunk) => {
    console.log(`i received ${chunk}\r\n`);
});

stream.on('end', () => {
    console.log('fin de la lecture\r\n');
});
stream.write('initialize\r\n');
stream.write("create\r\n");
stream.write("print\r\n");
