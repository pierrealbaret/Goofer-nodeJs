/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

const readline = require("readline"),
  net = require("net"),
  crypto = require("crypto"),
  colors = require("colors"),
  City = require("./city"),
  Game = require("./game"),
  Player = require("./Player"),
  createID = () => {
    "use strict";
    return crypto.randomBytes(16).toString("hex");
  };

const games = [],
  server = net.createServer((socket) => {
    "use strict";
    const endOfResponse = () => {
      socket.write("\r\n\r\n".cyan);
    };

    socket.id = createID();

    // 'connection' listener
    socket.write("client connected\r\n");
    endOfResponse();


    socket.on("end", () => {
      console.log("client disconnected".red);
    });

    const rl = readline.createInterface(socket);

    rl.on("line", (line) => {
      console.log("retrieving a line".green, `'${line}'`.red);

      let currentGame = null;
      if (line === "initialize") {
        console.log("initialize connexion".blue);
        socket.write(`Your socket id is : ${socket.id} \r\n`.green, "utf-8");
        return endOfResponse();

      } else if (line.includes("create")) {
        console.log("create game".blue);
        const [ _, width, height, nbPlayers, nbTurns, timout ] = line.match(/^create ([0-9]+) ([0-9]+) ([0-9]+) ([0-9]+) ([0-9]+)$/);
        socket.gameId = createID();
        currentGame = new Game(socket.gameId, parseInt(nbPlayers), parseInt(nbTurns), parseInt(timout));
        games.push(currentGame);
        currentGame.city = new City(parseInt(width), parseInt(height));
        currentGame.city.players = { [ socket.id ]: new Player(socket) };
        currentGame.city.print(socket.id);
        return endOfResponse();

      } else if (line === "close") {
        console.log("close client".blue);
        endOfResponse();
        socket.end();
        return;

      } else if (line === "listGames") {
        console.log("list Games".blue);
        socket.write(`available games : ${JSON.stringify(games.map((game) => game.id))}`);
        return endOfResponse();

      } else if (line.includes("joinGame")) {
        console.log("join Game".blue);
        const [ _, gameId ] = line.match(/^joinGame ([a-z0-9]+)$/);
        socket.gameId = gameId;
        currentGame = games.find((game) => game.id === gameId);
        currentGame.city.players[ socket.id ] = new Player(socket);
        return endOfResponse();

      }

      currentGame = games.find((game) => game.id === socket.gameId);
      if (currentGame) {
        console.log(line.toString());
        if (line.includes("populate")) {
          console.log("populate gophers".blue);
          const [ _, nbGophers ] = line.match(/^populate ([0-9]+)$/);
          currentGame.city.populate(socket.id, parseInt(nbGophers));
          return endOfResponse();

        } else if (line === "print") {
          console.log("print city".blue);
          currentGame.city.print(socket.id);
          return endOfResponse();

        } else if (line.includes("move")) {
          currentGame.addCommand(socket.id, line);
          return; // EOL will be sent when all commands was received !

        }
      }


      socket.write("Unknow command".rainbow);
      endOfResponse();
    });

    rl.on("close", () => {
      // clean player game
      const currentGame = games.find((game) => game.id === socket.gameId);
      if (currentGame) {
        delete currentGame.city.players[ socket.id ];
        if (Object.keys(currentGame.city.players).length === 0) {
          // no player in game > delete game !
          const index = games.map((game) => {
            return game.id;
          })
            .indexOf(socket.gameId);
          games.splice(index, 1);
        }
      }

      console.log("closing stream".red);
    });

  });

server.on("error", (err) => {
  "use strict";
  throw err;
});

server.listen(8000, () => {
  "use strict";
  console.log("server ready".red);
});

