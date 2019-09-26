module.exports = class Game {
  constructor(id, nbPlayers = 1) {
    this.id = id;
    this.city = null;
    this.nbPlayers = nbPlayers;
    this.commands = [];
  }

  addCommand(playerId, command) {
    this.commands.push({ playerId, command });
    this.processCommands();
  }

  processCommands() {
    console.log("¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤PROCESS COMMANDS");
    console.log(this.commands.length, this.nbPlayers);
    if(this.city && this.commands.length === this.nbPlayers) {
      while( this.commands.length > 0) {
        const itemIndex = Math.floor(Math.random() * this.commands.length);
        const command = this.commands[ itemIndex ];
        this.commands.splice(itemIndex);
        this.process(command);
        console.log("¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤commandes restantes");
        console.log(this.commands.length);
        console.log("¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤");
      }
      Object.values(this.city.players).forEach((player) => {
        this.city.print(player.id);
        return player.write("\r\n\r\n".cyan);
      });
    }
  }

  process(command) {
    console.log("¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤ PROCESS");
    console.log(command);
    console.log("¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤");
    const params = command.command.match(/^move ([0-9]+) ([0-9]+) ([0-9]+) ([0-9]+)/);
    this.city.move(
      command.playerId,
      { x: parseInt(params[ 1 ]), y: parseInt(params[ 2 ]) },
    { x: parseInt(params[ 3 ]), y: parseInt(params[ 4 ]) }
        );

    console.log("¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤");
  }
};
