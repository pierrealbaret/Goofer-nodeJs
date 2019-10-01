const
  endOfResponse = require("../helpers/endOfResponse"),
  handler = (parameters) => {
    "use strict";
    const { socket } = parameters;
    console.log("close client".blue); // eslint-disable-line no-console
    endOfResponse(socket);
    return socket.end();
  };

module.exports = {
  name: "close",
  description: "close client connexion",
  handler: handler,
};
