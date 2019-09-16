const readline = require("readline");
const net = require('net');
const crypto = require('crypto');

const City = require('./city');

const server = net.createServer((socket) => {
    socket.id = crypto.randomBytes(16).toString('hex');
    socket.city = null;
    // 'connection' listener
    console.log('client connected');
    socket.on('end', () => {
        console.log('client disconnected');
    });

    const city = new City(10, 10, socket);
    console.log('city.map', city.grid);

    socket.write(`hello \r\n`, 'utf-8');
    socket.write(`${socket.id} \r\n`, 'utf-8');

    const rl = readline.createInterface(socket);

    rl.on("line", function(line) {
        console.log('retrieving a line', line, line === 'initialize ', typeof line);
        if(line === 'initialize') {
            console.log('write ID SOCKET');
            socket.write(`Your socket id is : ${socket.id} \r\n`, 'utf-8');
        } else if(line === 'populate') {
            city.populate();
        } else if(line === 'print') {
            city.print();
        }
    });
    rl.on('close', function() {
        console.log('closing stream');
    });

    // socket.end();
});

server.on('error', (err) => {
    throw err;
});

server.listen(8000, () => {
    console.log('server bound');
});

