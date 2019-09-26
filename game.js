module.exports = class Game {
  constructor(id, nbPlayers = 1, nbTurns = 3, timeout = 1) {
    this.id = id;
    this.city = null;
    this.nbPlayers = nbPlayers;
    this.nbTurns = nbTurns;
    this.timeout = timeout * 1000;
    this.commands = [];
  }

  addCommand(playerId, command) {
    this.commands.push({ playerId, command });
    this.processCommands();
  }

  processCommands() {
    console.log(this.commands.length, this.nbPlayers);
    if (this.city && this.commands.length === this.nbPlayers && this.nbTurns) {
      this.nbTurns --;
      while( this.commands.length > 0) {
        const itemIndex = Math.floor(Math.random() * this.commands.length);
        const command = this.commands[ itemIndex ];
        this.commands.splice(itemIndex);
        this.process(command);
      }
      Object.values(this.city.players)
        .forEach((player) => {
          this.city.print(player.id);
          return player.write("\r\n\r\n".cyan);
        });
      this.city.printServer();
    }
    if (this.nbTurns === 0) {
      this.finishGame();
    }
  }

  process(command) {
    const params = command.command.match(/^move ([0-9]+) ([0-9]+) ([0-9]+) ([0-9]+)/);
    this.city.move(
      command.playerId,
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
    let playerScore = `Your score : ${player.gophers.length}\r\n`;
    const allScores = Object.values(this.city.players)
      .reduce((acc, item) => {
        return `${acc}Player :${item.id} -> ${item.gophers.length}\r\n`;
      }, "");
    if (player) {
      return playerScore.red + allScores.yellow;
    }
    return allScores;
  }

  destroyGame() {
    Object.values(this.city.players)
      .forEach((player) => {
        player.write("End of game : Bye".red);
        player.socket.end();
        delete this.city.players[ player.id ];
      })
    // TODO kill all client
  }

  finishGame() {
    console.log("finish game".red);
    this.displayResults();
    this.destroyGame();
  }
};
