/* eslint-disable no-console */
const readline = require("readline"),
  net = require("net"),
  colors = require("colors"),
  commands = require("./commandHandlers"),
  createID = require("./helpers/createID"),
  getCommand = (line) => {
    "use strict";
    return line.split(" ")[ 0 ];
  };

/* eslint-disable no-unused-vars */
// console.log(commands[ "move" ]({ a: 10, b: 7 }));
// console.log(commands);
const games = [],
  server = net.createServer((socket) => {
    "use strict";

    const endOfResponse = require("./helpers/endOfResponse"); // eslint-disable-line global-require
    socket.id = createID();

    // 'connection' listener
    socket.write("client connected\r\n");
    endOfResponse(socket);


    socket.on("end", () => {
      console.log("client disconnected".red);
    });

    const rl = readline.createInterface(socket);

    rl.on("line", (line) => {
      console.log(`${socket.id} retrieving a line`.green, `'${line}'`.red);
      const cmd = getCommand(line),
        getParams = (commandLine) => {

          return {
            games,
            socket,
            params: commandLine
              .split(" ")
              .splice(1)
              .map((param) => {
                if (!Number.isNaN(parseInt(param))) {
                  return parseInt(param);
                }
                return param;
              }),
          };
        };
      if (commands[ cmd ] !== undefined) {
        return commands[ cmd ](getParams(line));
      }
      console.log("Unknown command ".red + cmd.blue);
      return endOfResponse(socket);
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

