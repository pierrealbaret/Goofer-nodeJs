const
  handler = (parameters) => {
    "use strict";

    const { games, socket } = parameters,
      currentGame = games.find((game) => game.id === socket.gameId);
    if (currentGame !== null) {
      console.log("print city".blue); // eslint-disable-line no-console
      // currentGame.city.print(socket.id); // TODO

      // TEST ALEX
      socket.emit("print", [
        [ { item: "?" }, { item: "." }, { item: "?" }, { item: "." } ],
        [ { item: "G", player: "id1" }, { item: "R" }, { item: "R" }, { item: "." } ],
        [ { item: "." }, { item: "G", player: "id2" }, { item: "R" }, { item: "R" } ],
      ]);
    }
  };

module.exports = {
  name: "print",
  description: "display the map (player view)",
  handler: handler,
};

