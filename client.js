/* eslint-disable no-console */
const net = require("net"),
  colors = require("colors"), // eslint-disable-line no-unused-vars
  readline = require("readline"),

  client = net.createConnection({ port: 8000 }, () => {
    "use strict";
    console.log("connected to server!".red);
  });

let isConnected = false,
  isReadyToSendCommand = false,
  commands = [
    "initialize",
    "create",
    "populate",
    "print",
    "close",
  ];

client.on("data", (data) => {
  "use strict";

  console.log(`Data received : \n${data}`);

  if (data.toString().includes("client connected\r\n") && !isConnected) {
    isConnected = true;
    isReadyToSendCommand = true;
    console.log("Server ready to handle commands !".green);
  }

  if (data.toString().includes("end\r\n")) {
    console.log("readyToSendCommand -> true".gray);
    isReadyToSendCommand = true;
  }
  if (isConnected && isReadyToSendCommand) {
    isReadyToSendCommand = false;
    const command = commands.shift();
    if (command) {
      console.log("Send command", command.blue);
      client.write(`${command}\r\n`);
    }
  }

});

client.on("end", () => {
  "use strict";
  console.log("disconnected from server".red);
});

