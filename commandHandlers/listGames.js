const
  endOfResponse = require("../helpers/endOfResponse"),
  handler = (parameters) => {
    "use strict";

    const { games, socket } = parameters;
    console.log("list Games".blue); // eslint-disable-line no-console
    socket.write(`available games : ${JSON.stringify(games.map((game) => game.id))}`);
    return endOfResponse(socket);
  };

module.exports = {
  name: "listGames",
  handler: handler,
};
