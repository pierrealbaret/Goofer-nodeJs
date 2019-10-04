const
  handler = (parameters) => {
    "use strict";
    const { socket } = parameters;
    console.log("close client".blue); // eslint-disable-line no-console
    return socket.disconnect(true); // FIX ME
  };

module.exports = {
  name: "close",
  description: "close client connexion",
  handler: handler,
};
