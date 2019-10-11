const
  isPlayerInGame = require("../helpers/isPlayerInGame"),
  Player = require("../Player"),
  handler = (parameters) => {
    "use strict";

    const { games, socket, params } = parameters;
    if (isPlayerInGame(games, socket.id) === false) {
      console.log("join Game -> ".blue, socket.name); // eslint-disable-line no-console
      const { gameId } = params;
      socket.gameId = gameId;
      const currentGame = games.find((game) => game.id === gameId);
      if (currentGame) {
        currentGame.city.players[ socket.id ] = new Player(socket);
        // socket.emit("joinGame", { gameId: currentGame.id });
        currentGame.city.writeAll("joinGame", 
        { 
          gameId: currentGame.id,
          user:socket.id
        });
        // Object.values(currentGame.city.players).map(() => {
        //   socket.emit("joinGame", { gameId: currentGame.id });
        // });
      } else {
        console.log(`${gameId} not found ! : unable to join game`); // eslint-disable-line no-console
        socket.emit("info", { errorMessage: `${gameId} not found ! : unable to join game` });
      }
      return;
    }
    console.log("Player already in a game -> ".blue, socket.name, socket.id); // eslint-disable-line no-console
  };

module.exports = {
  name: "joinGame",
  description: "joinGame gameId -> id game to join",
  handler: handler,
};
