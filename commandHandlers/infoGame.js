const
  handler = (parameters) => {
    "use strict";

    const { games, socket, params } = parameters;

    console.log("info Game".blue, socket.id); // eslint-disable-line no-console
    const { gameId } = params,
      currentGame = games.find((game) => game.id === gameId);
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
