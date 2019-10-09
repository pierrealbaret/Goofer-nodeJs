/* eslint-disable no-console */
const fs = require("fs"),
  colors = require("colors"), // eslint-disable-line no-unused-vars
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
  faker = require("faker/locale/fr"),
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

  socket.name = faker.name.findName();
  socket.image = faker.image.avatar();

  console.log(`${"connected -> ".red + socket.name} (${socket.id})`);
  console.log("news -> ".blue + socket.name, { hello: "world", id: socket.id, name: socket.name, image: socket.image });
  socket.emit("news", { hello: "world", id: socket.id, name: socket.name, image: socket.image });

  /** @param {{string}} commands.listGames */
  commands.listGames.fn({ socket, games });


  Object.keys(commands)
    .forEach((cmd) => {
      socket.on(cmd, (data) => commands[ cmd ].fn(getParams(data)));
    });

  socket.on("toto", (data) => {
    console.log("toto -> ".blue + socket.name, data);
  });

  socket.on("disconnect", (reason) => {
    // clean player game
    const currentGame = games.find((game) => game.id === socket.gameId);
    if (currentGame) {
      delete currentGame.city.players[ socket.id ];
      Object.values(currentGame.city.players)
        .map((player) => {
          currentGame.city.print(player.socket.id);
        });

      if (Object.keys(currentGame.city.players).length === 0) {
        // no player in game > delete game !
        const index = games.map((game) => {
          return game.id;
        })
          .indexOf(socket.gameId);
        games.splice(index, 1);
      }
    }

    console.log("closing stream -> ".red + socket.name, reason);
  });
});

app.listen(8000);
