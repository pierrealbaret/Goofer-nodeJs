module.exports = isPlayerInGame = (games, playerId) => {
  "use strict";

  return !!games.filter((game) => game.city.players[ playerId ]).length;
};

