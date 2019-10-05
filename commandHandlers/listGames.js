const
  handler = (parameters) => {
    "use strict";

    const { games, socket } = parameters,
      gameList = games.map((game) => game.id);
    console.log("list Games -> ".blue, socket.name, gameList); // eslint-disable-line no-console
    socket.emit("listGames", { games: gameList });
  };

module.exports = {
  name: "listGames",
  handler: handler,
};
