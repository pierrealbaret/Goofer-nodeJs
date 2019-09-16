var net = require('net');
const rl = require('readline');

var stream = net.createConnection({port: 8000}, () => {
    console.log('connected to server!');
});

stream.on('data', (chunk) => {
    console.log(`i received ${chunk}`);
});

stream.on('end', () => {
    console.log('fin de la lecture');
});
stream.write('initialize\r\n');
stream.write("create\r\n");
stream.write("print\r\n");
