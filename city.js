module.exports = class City {
  constructor(socket, width = 10, height = 10) {
    this.width = width;
    this.height = height;
    this.grid = this.createGrid();
    this.socket = socket;
    this.goofers = [];
    this.rocks = this.addRock();
    this.fov = 1;
  }

  populate(nbGoofers = 10) {
    this.goofers = [];

    for (let i = 0; i < nbGoofers; i++) {
      this.goofers.push(this.createRandomItem());
    }

    this.socket.write(`created goofers : ${JSON.stringify(this.goofers)}\r\n`);
  }

  isOccuped(item) {
    if (this.rocks) {
      return this.goofers.find((g) => g.x === item.x && g.y === item.x) || this.rocks.find((r) => r.x === item.x && r.y === item.x);
    }
    return this.goofers.find((g) => g.x === item.x && g.y === item.x);
  }

  createRandomItem() {
    const item = { x: this.getRandomInt(this.width), y: this.getRandomInt(this.height) };
    if (! this.isOccuped(item)) {
      return item;
    }
    return this.createRandomItem();
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

  trueNewPosition(pos, oldPos) {
    let newPos = {
      x: pos.x,
      y: pos.y,
    };
    if (pos.x < 0) {
      newPos.x = 0;
    }
    if (pos.x >= this.width) {
      newPos.x = this.width - 1;
    }
    if (pos.y < 0) {
      newPos.y = 0;
    }
    if (pos.y >= this.height) {
      newPos.y = this.height - 1;
    }

    if (this.isOccuped(newPos)) {
      this.socket.write("invalid move !!! \r\n");
      return oldPos;
    }
    return newPos;
  }

  move(oldPos, newPos) {
    let newNewPos = this.trueNewPosition(newPos, oldPos);
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

  isCelluleInRange(x, y) {
    return this.goofers.filter((g) =>
      (g.x >= x - this.fov && g.x <= x + this.fov) &&
      (g.y >= y - this.fov && g.y <= y + this.fov)
    ).length;
  }

  getVisibleItems(x, y, cel) {
    if (!this.isCelluleInRange(x, y)) {
      return " ";
    }

    if (this.rocks.filter((r) => r.x === x && r.y === y).length) {
      return "R";
    }
    if (this.goofers.filter((g) => g.x === x && g.y === y).length) {
      return "G";
    }

    return "#";
  }

  print() {
    this.socket.write("Current Map is : \r\n".green);
    this.socket.write(` |${Array.from(Array(this.width).keys()).join("|")}|\r\n`.underline);

    this.grid.forEach((row, y) => {
      const newRow = [];
      row.forEach((cel, x) => { newRow.push(this.getVisibleItems(x, y))});
      this.socket.write(`${y}|${newRow.join("|")}|\r\n`.underline);
    });
    this.socket.write("end\r\n".cyan);
    console.log(this.goofers);
  }

};
