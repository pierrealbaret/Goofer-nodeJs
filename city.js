module.exports = class City {
  constructor(width, height, socket) {
    this.width = width;
    this.height = height;
    this.grid = [];
    this.socket = socket;
    this.createGrid();
    this.goofers = [];
  }
  populate(nbGoofers = 10, xMax = 10, yMax = 10) {
    for (let i = 0;i < nbGoofers; i++) {
      this.goofers.concat(this.createRandomGoofer(xMax, yMax));
    }
  }

  createRandomGoofer(xMax = 10, yMax = 10) {
    return { x: this.getRandomInt(xMax), y: this.getRandomInt(yMax) };
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  createGrid() {
    for (let i = 0; i < this.width; i++) {
      this.grid.push(Array(this.height).fill("_", 0, this.height));
    }
  }

  getCase(x, y) {
    return this.grid[ x ][ y ];
  }

  setCase(x, y, value) {
    this.grid[ x ][ y ] = value;
  }

  print() {
    this.socket.write("My Map is : \r\n");
    this.grid.map((row) => {
      this.socket.write(`${row.join("|")}\r\n`);
    });
  }

};
