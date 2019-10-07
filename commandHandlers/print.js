const
  getRandomItem = () => {
    "use strict";

    const items = [
      { item: "G", player: "id1" },
      { item: "G", player: "id2" },
      { item: "R" },
      { item: "?" },
      { item: "." },
    ];
    return items[ Math.floor(Math.random() * items.length) ];
  },
  handler = (parameters) => {
    "use strict";

    const { games, socket } = parameters,
      currentGame = games.find((game) => game.id === socket.gameId);
    if (currentGame !== null) {
      console.log("print -> ".blue, socket.name); // eslint-disable-line no-console
      // currentGame.city.print(socket.id); // TODO
    }
    // TEST ALEX
    console.log(`print : ${socket.id}`); // eslint-disable-line no-console
    socket.emit("print", [
      [ getRandomItem(), getRandomItem(), getRandomItem(), getRandomItem() ],
      [ getRandomItem(), getRandomItem(), getRandomItem(), getRandomItem() ],
      [ getRandomItem(), getRandomItem(), getRandomItem(), getRandomItem() ],
    ]);
  };

module.exports = {
  name: "print",
  description: "display the map (player view)",
  handler: handler,
};

