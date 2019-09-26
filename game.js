module.exports = class Game {
  constructor(id, nbPlayers = 1) {
    this.id = id;
    this.city = null;
    this.nbPlayers = nbPlayers;
    this.players = [];
  }
};
