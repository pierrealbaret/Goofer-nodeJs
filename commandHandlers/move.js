const handler = (parameters) => {
  "use strict";

  const { games, socket, params } = parameters,
    currentGame = games.find((game) => game.id === socket.gameId);

  if (currentGame) {
    socket.write(`waiting for others players ... (turns ${currentGame.nbTurns})\r\n`);
    return currentGame.addCommand(socket.id, `move ${params.join(" ")}`);
    // EOL will be sent when all commands was received !
  }

};

module.exports = {
  name: "move",
  handler: handler,
};
