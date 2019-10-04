/* eslint-disable no-console */
const fs = require("fs"),
  colors = require("colors"),
  createID = require("./helpers/createID"),
  commands = require("./commandHandlers"),
  handler = (req, res) => {
    "use strict";

    fs.readFile(`${__dirname }/public/index.html`,
      (err, data) => {
        if (err) {
          res.writeHead(500);
          return res.end("Error loading index.html");
        }

        res.writeHead(200);
        res.end(data);
      });
  },
  app = require("http").createServer(handler),
  io = require("socket.io")(app),
  games = [];


// console.log(commands);

io.on("connection", (socket) => {
  "use strict";

  const getParams = (data) => {
    // console.log("data -> ",data);
    return {
      games,
      socket,
      commands,
      params: data,
    };
  };

  socket.id = createID();
  console.log(socket.id + " connected".red);
  socket.emit("news", { hello: "world", id: socket.id });

  commands.listGames.fn({ socket, games });


  Object.keys(commands)
    .forEach((cmd) => {
      socket.on(cmd, (data) => commands[ cmd ].fn(getParams(data)));
    });

  socket.on("toto", (data) => {
    console.log("toto => ", data);
  });

  socket.on("disconnect", (reason) => {
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

    console.log("closing stream ".red + reason);
  });
});

app.listen(8000);
