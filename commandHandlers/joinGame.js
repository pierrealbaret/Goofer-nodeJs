const
  isPlayerInGame = require("../helpers/isPlayerInGame"),
  endOfResponse = require("../helpers/endOfResponse"),
  Player = require("../Player"),
  handler = (parameters) => {
    "use strict";

    const { games, socket, params } = parameters;
    if (isPlayerInGame(games, socket.id) === false) {
      console.log("join Game".blue);
      const [ gameId ] = params;
      socket.gameId = gameId;
      const currentGame = games.find((game) => game.id === gameId);
      currentGame.city.players[ socket.id ] = new Player(socket);
      return endOfResponse(socket);
    }
  };

module.exports = {
  name: "joinGame",
  handler: handler,
};
