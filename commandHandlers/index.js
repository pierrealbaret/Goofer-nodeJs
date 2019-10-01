const fs = require("fs"),
  colors = require("colors"), // eslint-disable-line no-unused-vars

  getCommandHandlers = () => {
    "use strict";

    const logs = [];
    logs.push("Loading commands handlers".red);
    const commandHandlers = fs.readdirSync(__dirname)
      .reduce((acc, file) => {
        if (file !== "index.js" && /[a-zA-Z0-9\-]*.js$/.test(file)) {
          const requiredFile = require(`${__dirname}/${file}`); // eslint-disable-line global-require
          if (requiredFile.name && requiredFile.handler) {
            logs.push(` - command: '${requiredFile.name}' -> ${file} chargé`.blue);
            if (requiredFile.description) {
              logs.push(`   ${requiredFile.description}`.gray);
              logs.push("");
            }
            acc[ requiredFile.name ] = requiredFile.handler;
            return acc;
          }
          logs.push(`Le option handler ${file} n'est pas pris en compte`.red);
        }
        return acc;
      }, {});
    logs.forEach((log) => {
      console.log(log); // eslint-disable-line no-console
    });
    return commandHandlers;
  };

module.exports = getCommandHandlers();
