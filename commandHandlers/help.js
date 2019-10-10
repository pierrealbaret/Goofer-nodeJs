const
  handler = (parameters) => {
    "use strict";

    const { socket, commands } = parameters;
    console.log("help -> ".blue, socket.name); // eslint-disable-line no-console
    socket.emit("help", Object.keys(commands)
      .map((cmd) => {
        return {
          name: cmd,
          description: commands[ cmd ].description,
        };
      }));
  };

module.exports = {
  name: "help",
  description: "display all commands available",
  handler: handler,
};
