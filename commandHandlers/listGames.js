const
  handler = (parameters) => {
    "use strict";

    const { games, socket } = parameters;
    console.log("list Games".blue, socket.id); // eslint-disable-line no-console
    socket.emit("listGames", { games: games.map((game) => game.id) });
    console.log(games.map((game) => game.id));
  };

module.exports = {
  name: "listGames",
  handler: handler,
};
