/* eslint-disable no-console */
const faker = require("faker/locale/fr");

module.exports = class Gopher {
  constructor({ x, y, playerId }) {
    this.x = x;
    this.y = y;
    this.playerId = playerId;
    this.isAlive = "alive";
    this.name = faker.name.findName();
  }
};
