const
  createID = require("../helpers/createID"),
  City = require("../City"),
  Game = require("../Game"),
  Player = require("../Player"),
  isPlayerInGame = require("../helpers/isPlayerInGame"),
  endOfResponse = require("../helpers/endOfResponse"),
  handler = (parameters) => {
    "use strict";

    const { games, socket, params } = parameters;
    if (isPlayerInGame(games, socket.id) === false) {
      console.log("create game".blue); // eslint-disable-line no-console

      const [ width, height, nbPlayers, nbTurns, timout ] = params;
      socket.gameId = createID();
      const currentGame = new Game(socket.gameId, nbPlayers, nbTurns, timout);
      games.push(currentGame);
      currentGame.city = new City(width, height);
      currentGame.city.players = { [ socket.id ]: new Player(socket) };
      currentGame.city.print(socket.id);
      return endOfResponse(socket);
    }
  };

module.exports = {
  name: "create",
  handler: handler,
};

