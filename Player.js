module.exports = class Player {
  constructor(socket) {
    this.id = socket.id;
    this.gophers = [];
    this.socket = socket;
    this.color = "red";
  }

  write(lines) {
    this.socket.write(`${lines}\r\n`);
  }
};
