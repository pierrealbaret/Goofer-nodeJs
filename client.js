/* eslint-disable no-console */
const net = require("net"),
  colors = require("colors"), // eslint-disable-line no-unused-vars
  readline = require("readline"), // eslint-disable-line no-unused-vars

  client = net.createConnection({ port: 8000 }, () => {
    "use strict";
    console.log("connected to server!".red);
  });

let isConnected = false,
  isReadyToSendCommand = false,
  gophers = [],
  games = [],
  commands = [
    "initialize",
    "test 12 3",
    "listGames", // -> [] || [idGame1, idGame2] // Available games
    "joinOrCreateGame",
    "listGames", // -> [] || [idGame1, idGame2] // Available games
    "populate 5",
    "print",
    "move",
    "move",
    "move",
    "move",
    "move",
    "move",
    "move",
    "move",
    "move",
    "move",
    "move",
    "close",
  ];

client.on("data", (data) => {
  "use strict";

  console.log(data.toString());

  if (data.toString().includes("client connected\r\n") && !isConnected) {
    isConnected = true;
    console.log("Server ready to handle commands !".green);
  }

  if (data.toString().includes("\r\n\r\n")) {
    console.log("readyToSendCommand -> true".gray);
    isReadyToSendCommand = true;
  }

  if (data.toString().includes("created gophers : ")) {
    gophers = JSON.parse(data.toString().match(/^created gophers : ([\[\],"A-Za-z0-9:{}]*)/)[ 1 ]); // save gophers
  }

  if (data.toString().includes("available games : ")) {
    games = JSON.parse(data.toString().match(/^available games : ([\[\],"a-z0-9:{}]*)/)[ 1 ]); // save games
  }

  if (isConnected && isReadyToSendCommand) {
    isReadyToSendCommand = false;
    const command = commands.shift();
    if (command) {
      console.log("Send command", `'${command}'`.blue);
      if (command === "move") {
        let cmd = `move ${gophers[ 0 ].x} ${gophers[ 0 ].y} ${gophers[ 0 ].x + 1} ${gophers[ 0 ].y + 1}`;
        gophers[ 0 ].x++;
        gophers[ 0 ].y++;

        console.log(cmd);
        client.write(`${cmd}\r\n`);

      } else if (command === "joinOrCreateGame") {
        let commandCreateOrJoin = "";
        // width, height, nbPlayers, nbTurns, timout (seconds)
        const cmdCreate = "create 5 5 2 5 10",
          cmdJoinGame = "joinGame";
        console.log("games", games);
        if (games.length === 0) {
          commandCreateOrJoin = cmdCreate;
        } else {
          commandCreateOrJoin = `${cmdJoinGame} ${games[ 0 ]}`;
        }
        client.write(`${commandCreateOrJoin}\r\n`);
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

