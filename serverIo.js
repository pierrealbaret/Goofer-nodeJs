/* eslint-disable no-console */
const fs = require("fs"),
  colors = require("colors"),
  createID = require("./helpers/createID"),
  commands = require("./commandHandlers"),
  handler = (req, res) => {
    "use strict";

    fs.readFile(`${__dirname }/public/index.html`,
      (err, data) => {
        if (err) {
          res.writeHead(500);
          return res.end("Error loading index.html");
        }

        res.writeHead(200);
        res.end(data);
      });
  },
  app = require("http").createServer(handler),
  io = require("socket.io")(app),
  games = [];


// console.log(commands);

io.on("connection", (socket) => {
  "use strict";

  const getParams = (data) => {
    // console.log("data -> ",data);
    return {
      games,
      socket,
      commands,
      params: data,
    };
  };

  socket.id = createID();
  console.log(socket.id + " connected".red);
  socket.emit("news", { hello: "world", id: socket.id });


  Object.keys(commands)
    .forEach((cmd) => {
      socket.on(cmd, (data) => commands[ cmd ].fn(getParams(data)));
    });

  socket.on("toto", (data) => {
    console.log("toto => ", data);
  });
});

app.listen(8000);
