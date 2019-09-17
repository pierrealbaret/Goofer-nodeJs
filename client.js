/* eslint-disable no-console */
const net = require("net"),
  colors = require("colors"), // eslint-disable-line no-unused-vars
  readline = require("readline"),

  client = net.createConnection({ port: 8000 }, () => {
    "use strict";
    console.log("connected to server!".red);
  }),
  displayGrid = (grid) => {
    "use strict";
    console.log(` |${Array.from(Array(grid[ 0 ].length).keys()).join("|")}|`.underline);
    grid.forEach((row, index) => {
      console.log(`${index}|${row.join("|")}|`.underline);
    });
  };

let isConnected = false,
  isReadyToSendCommand = false,
  goofers = [],
  grid = [],
  commands = [
    "initialize",
    "create 10 10",
    "populate",
    "print",
    "move",
    "print",
    "close",
  ];

client.on("data", (data) => {
  "use strict";

  console.log(`Data received : \n${data}`);

  if (data.toString().includes("client connected\r\n") && !isConnected) {
    isConnected = true;
    console.log("Server ready to handle commands !".green);
  }

  if (data.toString().includes("end\r\n")) {
    console.log("readyToSendCommand -> true".gray);
    isReadyToSendCommand = true;
  }

  if (data.toString().includes("created goofers : ")) {
    goofers = JSON.parse(data.toString().match(/^created goofers : ([\[\],"a-z0-9:{}]*)/)[1]); // save goofers
  }

  // if (data.toString().includes("Current Map is : ")) {
  //   // console.log(data.toString().match(/^Current Map is : ([\[\], GR#"a-z0-9:{}]*)/));
  //   grid = JSON.parse(data.toString().match(/^Current Map is : ([\[\], GR#"a-z0-9:{}]*)/)[1]); // save grid
  //   displayGrid(grid);
  // }

  if (isConnected && isReadyToSendCommand) {
    isReadyToSendCommand = false;
    const command = commands.shift();
    if (command) {
      console.log("Send command", command.blue);
      if (command === "move") {
        let cmd = `move ${goofers[ 0 ].x} ${goofers[ 0 ].y} ${goofers[ 0 ].x+1} ${goofers[ 0 ].y+1}`;
        client.write(`${cmd}\r\n`);
      } else {
        client.write(`${command}\r\n`);
      }
    }
  }

});

client.on("end", () => {
  "use strict";
  console.log("disconnected from server".red);
});

