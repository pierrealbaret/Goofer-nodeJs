module.exports = isAvailableCommand = (game, playerId, cmd) => {
  "use strict";

  return game.city.players[ playerId ].availableCommands[ cmd ];
};
