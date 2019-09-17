/* eslint-disable no-console */
const net = require("net"),
  colors = require("colors"); // eslint-disable-line no-unused-vars

// rl = require("readline");
let connected = false;

let commands = [
    "initialize",
    "create",
    "populate",
    "print",
    "close",
  ],

  stream = net.createConnection({ port: 8000 }, () => {
    "use strict";
    console.log("connected to server!".red);
  });

stream.on("data", (chunk) => {
  "use strict";
  console.log(`i received\r\n${chunk}`);
  if (chunk.toString() === "client connected\r\n" && !connected) {
    connected = true;
  }

  if (connected) {
    const command = commands.shift();
    if (command) {
      console.log(`Send command ${command}`.blue);
      stream.write(`${command}\r\n`);
    }
  }
});

stream.on("end", () => {
  "use strict";
  console.log("fin de la lecture".red);
});

