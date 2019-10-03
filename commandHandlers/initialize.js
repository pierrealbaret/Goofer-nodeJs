const
  isPlayerInGame = require("../helpers/isPlayerInGame"),
  handler = (parameters) => {
    "use strict";
    const { games, socket } = parameters;
    // console.log(socket.id);
    if (isPlayerInGame(games, socket.id) === false) {
      console.log("initialize connexion".blue); // eslint-disable-line no-console
      socket.emit("initialize", socket.id);
    }
  };

module.exports = {
  name: "initialize",
  handler: handler,
};
