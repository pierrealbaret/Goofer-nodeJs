/* eslint-disable no-console */
const net = require("net");
// rl = require("readline");
let connected = false;

const commands = [
    "initialize\r\n",
    "create\r\n",

    "populate\r\n",
    "print\r\n",

  ],
  stream = net.createConnection({ port: 8000 }, () => {
    "use strict";
    console.log("connected to server!");
  });

stream.on("data", (chunk) => {
  "use strict";
  console.log(`i received\r\n${chunk}`);
  if (chunk.toString() === "client connected\r\n" && !connected) {
    connected = true;
  }
  if (connected) {
    commands.map((command) => {
      console.log(command);
      stream.write(command);
      commands.shift();
    });
  }
});

stream.on("end", () => {
  "use strict";
  console.log("fin de la lecture");
});

