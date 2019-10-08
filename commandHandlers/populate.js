const
  isAvailableCommand = require("../helpers/isAvailableCommand"),
  handler = (parameters) => {
    "use strict";

    const { games, socket, params } = parameters,
      currentGame = games.find((game) => game.id === socket.gameId);

    if (currentGame !== null && isAvailableCommand(currentGame, socket.id, "populate")) {
      console.log("populate -> ".blue + socket.name); // eslint-disable-line no-console
      const { nbGophers } = params;
      currentGame.city.populate(socket.id, nbGophers);
    }
  };

module.exports = {
  name: "populate",
  description: "populate 10 -> nb de gophers",
  handler: handler,
};
