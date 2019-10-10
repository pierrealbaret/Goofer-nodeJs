const handler = (parameters) => {
  "use strict";

  const { games, socket, params } = parameters,
    currentGame = games.find((game) => game.id === socket.gameId);

  if (currentGame) {
    console.log("move -> ".blue, socket.name); // eslint-disable-line no-console
    socket.write(`waiting for others players ... (turns ${currentGame.nbTurns})\r\n`);
    return currentGame.addCommand(socket.id, `move ${params.join(" ")}`);
    // EOL will be sent when all commands was received !
  }

};

module.exports = {
  name: "move",
  description: "move posX posY newPosX newPosY",
  handler: handler,
};
