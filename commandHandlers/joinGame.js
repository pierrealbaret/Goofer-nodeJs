const
  isPlayerInGame = require("../helpers/isPlayerInGame"),
  Player = require("../Player"),
  handler = (parameters) => {
    "use strict";

    const { games, socket, params } = parameters;
    if (isPlayerInGame(games, socket.id) === false) {
      console.log("join Game".blue, socket.id); // eslint-disable-line no-console
      const { gameId }  = params;
      socket.gameId = gameId;
      const currentGame = games.find((game) => game.id === gameId);
      currentGame.city.players[ socket.id ] = new Player(socket);
      socket.emit("joinGame", { gameId: currentGame.id });
      return;
    }
    console.log("Player already in a game".blue, socket.id); // eslint-disable-line no-console
  };

module.exports = {
  name: "joinGame",
  description: "joinGame gameId -> id game to join",
  handler: handler,
};
