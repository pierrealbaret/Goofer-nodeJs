/* eslint-disable no-console */

const readline = require("readline"),
  net = require("net"),
  crypto = require("crypto"),
  colors = require("colors"), // eslint-disable-line no-unused-vars
  City = require("./city"),
  Game = require("./game"),
  createID = () => {
    "use strict";
    return crypto.randomBytes(16).toString("hex");
  };

const games = [],
  clients = [];


const server = net.createServer((socket) => {
  "use strict";
  const endOfResponse = () => { socket.write("\r\n\r\n".cyan); };

  socket.id = createID();
  socket.city = null;

  // 'connection' listener
  socket.write("client connected\r\n");
  endOfResponse();


  socket.on("end", () => {
    console.log("client disconnected".red);
  });

  const rl = readline.createInterface(socket);

  rl.on("line", (line) => {
    console.log("retrieving a line".green, `'${line}'`.red);

    if (line === "initialize") {
      console.log("initialize connexion".blue);
      socket.write(`Your socket id is : ${socket.id} \r\n`.green, "utf-8");
      endOfResponse();
    } else if (line.includes("create")) {
      console.log("create game".blue);
      const [ _, width, height, nbPlayers ] = line.match(/^create ([0-9]+) ([0-9]+) ([0-9]+)$/);
      socket.gameId = createID();
      const currentGame = new Game(socket.gameId, nbPlayers);
      games.push(currentGame);
      currentGame.city = new City(socket, parseInt(width), parseInt(height));
      currentGame.players.push(socket) ;
      currentGame.city.print(socket.id);
      return;
    } else if (line === "close") {
      console.log("close client".blue);
      endOfResponse();
      socket.end();
    }

    const currentGame = games.find((game) => game.id === socket.gameId);
    if (currentGame) {
      console.log(line.toString());
      if (line.includes("populate")) {
        console.log("populate gophers".blue);
        const [ _, nbGophers ] = line.match(/^populate ([0-9]+)$/);
        currentGame.city.populate(socket.id, parseInt(nbGophers));
        endOfResponse();

      } else if (line === "print") {
        console.log("print city".blue);

        currentGame.city.print(socket.id);

      } else if (line.includes("move")) {
        const params = line.match(/^move ([0-9]+) ([0-9]+) ([0-9]+) ([0-9]+)/);

        currentGame.city.move(
          socket.id,
          { x: parseInt(params[ 1 ]), y: parseInt(params[ 2 ]) },
        { x: parseInt(params[ 3 ]), y: parseInt(params[ 4 ]) }
            );


      }
    } else {
      socket.write("unable to find game");
      endOfResponse();
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

