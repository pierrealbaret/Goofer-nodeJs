const
  endOfResponse = require("../helpers/endOfResponse"),
  handler = (parameters) => {
    "use strict";

    const { socket, commands } = parameters;

    socket.emit("info", Object.keys(commands)
      .map((cmd) => {
        return {
          name: cmd,
          description: commands[ cmd ].description,
        };
      }));
    return endOfResponse(socket);
  };

module.exports = {
  name: "help",
  description: "display all commands available",
  handler: handler,
};
