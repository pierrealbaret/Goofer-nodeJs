module.exports = isAvailableCommand = (game, playerId, cmd) => {
  "use strict";
  if (game) {
    return game.city.players[ playerId ].availableCommands[ cmd ];
  }
  return false;
};
