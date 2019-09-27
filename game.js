/* eslint-disable no-console */

module.exports = class Game {
  constructor(id, nbPlayers = 1, nbTurns = 3, timeout = 1) {
    this.id = id;
    this.city = null;
    this.nbPlayers = nbPlayers;
    this.nbTurns = nbTurns;
    this.timeout = timeout * 1000;
    this.commands = [];
    this.timerExpired = false;
    this.timer = null;
  }

  addCommand(playerId, command) {
    if (!this.commands.find((order) => order.playerId === playerId)) {
      this.commands.push({ playerId, command });
      return this.processCommands();
    }
    this.city.players[ playerId ].write("Command already send, wait for other players\r\n");
  }

  restartTimerTurns() {
    this.timer = setTimeout(() => {
      this.timerExpired = true;
      this.processCommands();
    }, this.timeout);
  }

  processCommands() {
    console.log(this.commands.length, this.nbPlayers);
    if (this.city && this.commands.length === this.nbPlayers && this.nbTurns || this.timerExpired) {
      clearTimeout(this.timer);
      this.nbTurns--;
      while (this.commands.length > 0) {
        const itemIndex = Math.floor(Math.random() * this.commands.length),
          order = this.commands[ itemIndex ];
        this.commands.splice(itemIndex);
        this.process(order);
      }
      Object.values(this.city.players)
        .forEach((player) => {
          this.city.print(player.id);
          if (this.nbTurns !== 0) {
            player.write("\r\n\r\n".cyan);
          }
        });
      this.city.printServer();

      if (this.nbTurns) { // End of turn : restart timer turn
        this.timerExpired = false;
        this.restartTimerTurns();
      }
    }
    if (this.nbTurns === 0) {
      this.finishGame();
    }
  }

  process(order) {
    const params = order.command.match(/^move ([0-9]+) ([0-9]+) ([0-9]+) ([0-9]+)/);
    this.city.move(
      order.playerId,
      { x: parseInt(params[ 1 ]), y: parseInt(params[ 2 ]) },
      { x: parseInt(params[ 3 ]), y: parseInt(params[ 4 ]) }
    );
  }

  displayResults() {
    if (this.city) {
      Object.values(this.city.players)
        .forEach((player) => {
          player.write(this.getScores(player));
        });
      console.log(this.getScores());
    }
  }

  getScores(player = null) {
    const allScores = Object.values(this.city.players)
      .reduce((acc, item) => {
        return `${acc}Player :${item.id} -> ${item.gophers.filter((g) => g.isAlive === "alive").length}\r\n`;
      }, "");
    if (player) {
      const playerScore = `Your score (${player.id}): ${player.gophers.filter((g) => g.isAlive === "alive").length}\r\n`[ player.color ].bold,
        deadGophers = `dead list : ${JSON.stringify(player.gophers.filter((g) => g.isAlive !== "alive"))}\r\n`;
      return playerScore.red + deadGophers.blue + allScores.yellow;
    }
    return allScores;
  }

  destroyGame() {
    Object.values(this.city.players)
      .forEach((player) => {
        player.write("End of game : Bye".red);
        player.socket.end();
        delete this.city.players[ player.id ];
      });
  }

  finishGame() {
    console.log("finish game".red);
    this.displayResults();
    this.destroyGame();
  }
};
