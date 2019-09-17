module.exports = class City {
  constructor(socket, width = 10, height = 10) {
    this.width = width;
    this.height = height;
    this.grid = this.createGrid();
    this.socket = socket;
    this.goofers = [];
    this.rocks = this.addRock();
  }

  populate(nbGoofers = 10) {
    this.goofers = [];

    for (let i = 0; i < nbGoofers; i++) {
      this.goofers.push(this.createRandomItem());
    }

    this.socket.write(`created goofers : ${JSON.stringify(this.goofers)}\r\n`);
  }

  createRandomItem() {
    return { x: this.getRandomInt(this.width), y: this.getRandomInt(this.height) };
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  createGrid() {
    let grid = [];
    for (let i = 0; i < this.height; i++) {
      grid.push(Array(this.width).fill(" ", 0, this.width));
    }
    return grid;
  }

  addRock() {
    "use strict";
    let rocks = [];
    const nbRock = this.getRandomInt(Math.floor(Math.sqrt(this.width * this.height))) || 1;
    for (let i = 0; i < nbRock; i++) {
      rocks.push(this.createRandomItem());
    }
    // console.log(rocks);
    return rocks;
  }

  getCase(x, y) {
    return this.grid[ x ][ y ];
  }

  setCase(x, y, value) {
    this.grid[ x ][ y ] = value;
  }

  trueNewPosition(pos) {
    return pos; // TODO AVOID SORTIE DE GRILLE
  }

  move(oldPos, newPos) {
    let newNewPos = this.trueNewPosition(newPos);
    this.goofers.forEach((goofer) => {
      if (goofer.x === oldPos.x && goofer.y === oldPos.y) {
        goofer.x = newNewPos.x;
        goofer.y = newNewPos.y;
      }
    });
    this.print();
  }

  availableGrid() {
    let grid = [];
    for (let i = 0; i < this.height; i++) {
      grid.push(Array(this.width).fill(" ", 0, this.width));
    }


    return this.grid;
  }

  print() {

    this.socket.write("Current Map is : \r\n".green);
    this.socket.write(` |${Array.from(Array(this.width).keys()).join("|")}|\r\n`.underline);
    this.grid.forEach((row, index) => {
      const newRow = [].concat(row);
      this.goofers.filter((g) => g.y === index).map((g) => newRow[ g.x ] = "G");
      this.rocks.filter((r) => r.y === index).map((r) => newRow[ r.x ] = "R");
      this.socket.write(`${index}|${newRow.join("|")}|\r\n`.underline);
    });
    this.socket.write("end\r\n".cyan);
  }

};
