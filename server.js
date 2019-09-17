/* eslint-disable no-console */

const readline = require("readline"),
  net = require("net"),
  crypto = require("crypto"),
  colors = require("colors"), // eslint-disable-line no-unused-vars
  City = require("./city");

const server = net.createServer((socket) => {
  "use strict";
  socket.id = crypto.randomBytes(16).toString("hex");
  socket.city = null;
  // 'connection' listener
  socket.write("client connected\r\n");
  socket.write("end\r\n");


  socket.on("end", () => {
    console.log("client disconnected".red);
  });

  const rl = readline.createInterface(socket);

  rl.on("line", (line) => {
    console.log("retrieving a line".green, line.red);

    if (line === "initialize") {
      console.log("initialize connexion".blue);
      socket.write(`Your socket id is : ${socket.id} \r\n`.green, "utf-8");
      socket.write("end\r\n");
    } else if (line === "create") {
      console.log("create city".blue);
      socket.city = new City(socket, 10, 10);
      console.log("city.map", socket.city.grid);
      socket.city.print();
      socket.write("end\r\n");
    } else if (line === "close") {
      console.log("close client".blue);
      socket.write("end\r\n");
      socket.end();
    }

    if (socket.city) {
      if (line === "populate") {
        console.log("populate goofers".blue);
        socket.city.populate(socket.city.getRandomInt(10), socket.city.width, socket.city.height);
        socket.write("end\r\n");
      } else if (line === "print") {
        console.log("print city".blue);
        socket.city.print();
        socket.write("end\r\n");
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

