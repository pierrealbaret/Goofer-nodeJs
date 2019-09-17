module.exports = class City {
  constructor(socket, width = 10, height = 10) {
    this.width = width;
    this.height = height;
    this.grid = this.createGrid(width, height);
    this.socket = socket;
    this.goofers = [];
  }

  populate(nbGoofers = 10) {
    this.goofers = [];

    for (let i = 0; i < nbGoofers; i++) {
      this.goofers.push(this.createRandomGoofer(this.width, this.height));
    }
    this.socket.write("created goofers :\r\n".green);
    this.socket.write(`${JSON.stringify(this.goofers)}\r\n`);
  }

  createRandomGoofer(xMax = 10, yMax = 10) {
    return { x: this.getRandomInt(xMax), y: this.getRandomInt(yMax) };
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  createGrid(width = 10, height = 10) {
    let grid = [];
    for (let i = 0; i < height; i++) {
      grid.push(Array(width).fill(" ", 0, width));
    }
    return grid;
  }

  getCase(x, y) {
    return this.grid[ x ][ y ];
  }

  setCase(x, y, value) {
    this.grid[ x ][ y ] = value;
  }

  print() {
    this.socket.write("Current Map is : \r\n".green);
    this.socket.write(` |${Array.from(Array(this.width).keys()).join("|")}|\r\n`.underline);
    this.grid.map((row, index) => {
      this.goofers.filter((g) => g.y === index).map((g) => row[ g.x ] = "😆");
      this.socket.write(`${index}|${row.join("|")}|\r\n`.underline);
    });
  }

};
