module.exports = class Player {
  constructor(socket) {
    this.id = socket.id;
    this.gophers = [];
    this.socket = socket;
    this.color = "red";
    this.availableCommands = {
      populate: true,
    };
  }

  write(event, data) {
    this.socket.emit(event, data);
  }
};
