const
  createID = require("../helpers/createID"),
  City = require("../City"),
  Game = require("../Game"),
  Player = require("../Player"),
  isPlayerInGame = require("../helpers/isPlayerInGame"),
  listGames = require("./listGames"),
  handler = (parameters) => {
    "use strict";

    const { games, socket, params } = parameters;
    if (isPlayerInGame(games, socket.id) === false) {
      console.log("create game -> ".blue, socket.name); // eslint-disable-line no-console

      const { width, height, nbPlayers, nbTurns, timout } = params;
      socket.gameId = createID();
      const currentGame = new Game(socket.gameId, nbPlayers, nbTurns, timout);
      games.push(currentGame);
      currentGame.city = new City(width, height);
      currentGame.city.players = { [ socket.id ]: new Player(socket) };
      currentGame.city.print(socket.id);
      socket.emit("create", "Game created");
      socket.emit("joinGame", { gameId: currentGame.id });
      listGames.handler({ games, socket }); // send event listGames on new Game list
      return;
    }
    socket.emit("create", "player already in game -> game not created");
  };

module.exports = {
  name: "create",
  description: "create width height nbPlayers nbTurns timout",
  handler: handler,
};

