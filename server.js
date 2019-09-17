/* eslint-disable no-console */

const readline = require("readline"),
    net = require("net"),
    crypto = require("crypto"),
    colors = require("colors"), // eslint-disable-line no-unused-vars
    City = require("./city");

const server = net.createServer((socket) => {
    "use strict";
    const endOfResponse = () => { socket.write("end\r\n".cyan); };

    socket.id = crypto.randomBytes(16).toString("hex");
    socket.city = null;
    // 'connection' listener
    socket.write("client connected\r\n");
    endOfResponse();


    socket.on("end", () => {
        console.log("client disconnected".red);
    });

    const rl = readline.createInterface(socket);

    rl.on("line", (line) => {
        console.log("retrieving a line".green, line.red);

        if (line === "initialize") {
            console.log("initialize connexion".blue);
            socket.write(`Your socket id is : ${socket.id} \r\n`.green, "utf-8");
            endOfResponse();
        } else if (line.includes("create")) {
            console.log("create city".blue);
            const params = line.match(/^create ([0-9]+) ([0-9]+)$/);
            socket.city = new City(socket, parseInt(params[1]), parseInt(params[2]));
            socket.city.print();
            endOfResponse();
        } else if (line === "close") {
            console.log("close client".blue);
            endOfResponse();
            socket.end();
        }


        if (socket.city) {
            console.log(line.toString());
            if (line === "populate") {
                console.log("populate goofers".blue);
                socket.city.populate(2);
                endOfResponse();
            } else if (line === "print") {
                console.log("print city".blue);
                socket.city.print();
                endOfResponse();
            } else if (line.includes("move")) {
                const params = line.match(/^move ([0-9]+) ([0-9]+) ([0-9]+) ([0-9]+)/);

                socket.city.move(
                    { x: parseInt(params[ 1 ]), y: parseInt(params[ 2 ]) },
                    { x: parseInt(params[ 3 ]), y: parseInt(params[ 4 ]) }
                );
                endOfResponse();

            }
        }

    });
    rl.on("close", () => {
        console.log("closing stream".red);
    });

    // socket.end();
});

server.on("error", (err) => {
    "use strict";
    throw err;
});

server.listen(8000, () => {
    "use strict";
    console.log("server ready".red);
});
