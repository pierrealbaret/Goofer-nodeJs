module.exports = class City {
  constructor(socket, width = 10, height = 10) {
    this.width = width;
    this.height = height;
    this.grid = this.createGrid(width, height);
    this.socket = socket;
    this.goofers = [];
  }

  populate(nbGoofers = 10, xMax = 10, yMax = 10) {
    this.goofers = [];
    for (let i = 0; i < nbGoofers; i++) {
      this.goofers.push(this.createRandomGoofer(xMax, yMax));
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
    for (let i = 0; i < width; i++) {
      grid.push(Array(height).fill("_", 0, height));
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
    this.grid.map((row) => {
      this.socket.write(`${row.join("|")}\r\n`);
    });
  }

};
