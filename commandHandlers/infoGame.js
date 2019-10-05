const
  handler = (parameters) => {
    "use strict";

    const { games, socket, params } = parameters,
      { gameId } = params,
      currentGame = games.find((game) => game.id === gameId);
    console.log("info Game -> ".blue, socket.name, gameId); // eslint-disable-line no-console
    if (currentGame !== undefined) {
      socket.emit("infoGame", currentGame.getInfo());
    } else {
      socket.emit("infoGame", {});
    }
};

module.exports = {
  name: "infoGame",
  description: "infoGame gameId -> display game info",
  handler: handler,
};
