const
  isPlayerInGame = require("../helpers/isPlayerInGame"),
  endOfResponse = require("../helpers/endOfResponse"),
  handler = (parameters) => {
    "use strict";
    const { games, socket } = parameters;
    if (isPlayerInGame(games, socket.id) === false) {
      console.log("initialize connexion".blue); // eslint-disable-line no-console
      socket.write(`Your socket id is : ${socket.id} \r\n`.green, "utf-8");
    }
    return endOfResponse(socket);
  };

module.exports = {
  name: "initialize",
  handler: handler,
};
