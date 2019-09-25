const bresenham = require("bresenham-js");

module.exports = class City {
  constructor(socket, width = 10, height = 10) {
    this.width = width;
    this.height = height;
    this.grid = this.createGrid();
    this.socket = socket;
    this.gophers = [];
    this.rocks = this.addRock();
    this.fov = 3;
    this.oldPos = null;
    this.newPos = null;
  }

  populate(nbGophers = 10) {
    this.gophers = [];

    for (let i = 0; i < nbGophers; i++) {
      this.gophers.push(this.createRandomItem());
    }

    this.socket.write(`created goofers : ${ JSON.stringify(this.gophers) }\r\n`);
    // this.gophers = [ { x: 5, y: 5 }, { x: 7, y: 4 } ]; // TODO REMOVE ME :)
    // this.gophers = [ { x: 5, y: 5 } ]; // TODO REMOVE ME :)
    // this.rocks   = [ { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 4, y: 5 }, { x: 5, y: 6 } ]; // TODO REMOVE ME :)
    this.socket.write(`created gophers : ${JSON.stringify(this.gophers)}\r\n`);
  }

  isOccupied(item) {
    if (this.rocks) {
      return this.gophers.find((g) => g.x === item.x && g.y === item.y) || this.rocks.find((r) => r.x === item.x && r.y === item.y);
    }
    return this.gophers.find((g) => g.x === item.x && g.y === item.y);
  }

  createRandomItem() {
    const item = { x: this.getRandomInt(this.width), y: this.getRandomInt(this.height) };
    if (! this.isOccupied(item)) {
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

    if (this.isOccupied(newPos)) {
      this.socket.write(`invalid move !!! ${JSON.stringify(oldPos)} -> ${JSON.stringify(newPos)}\r\n`.red);
      return oldPos;
    }
    return newPos;
  }

  move(oldPos, newPos) {
    let newNewPos = this.trueNewPosition(newPos, oldPos);
    this.oldPos = oldPos; // save
    this.newPos = newNewPos; // save
    this.gophers.forEach((gopher) => {
      if (gopher.x === oldPos.x && gopher.y === oldPos.y) {
        gopher.x = newNewPos.x;
        gopher.y = newNewPos.y;
      }
    });
    this.print();
  }

  getGopherInRange(x, y) {
    return this.gophers.filter((g) =>
      (g.x >= x - this.fov && g.x <= x + this.fov) &&
      (g.y >= y - this.fov && g.y <= y + this.fov)
    )
  }

  isCellInRange(x, y) {
    return this.getGopherInRange(x,y).length;
  }

  getCellsBetween(a, b) {
    // const delta = (b.y-a.y)/(b.x-a.x);
    const pts = bresenham([ a.x, a.y ],[ b.x, b.y ]);
    return pts.map((pt) => ({ x: pt[ 0 ], y: pt[ 1 ]}));
  }

  isCellVisible(x, y) {
    const gophersInRange = this.getGopherInRange(x,y);
    try {
      const cellVisibleForGophers = gophersInRange.map((g) => {
        if (x === g.x && y === g.y) { // cellule = gopher > on stop !
          throw "visible";
        }

        const cells = this.getCellsBetween({x, y}, { x: g.x, y: g.y });
        // remove First & Last element (cell & gopher)
        cells.pop();
        cells.shift();
        // this.print(cells); // DEBUG
        const cellContainingRock = cells.map((c) => {

          if (this.rocks.find((r) => r.x === c.x && r.y === c.y)) {
            return "R";
          }
        });
        // console.log("visible cells", !cellContainingRock.includes("R"));
        return !cellContainingRock.includes("R");
      });

      // console.log(cellVisibleForGophers);
      return cellVisibleForGophers.includes(true);

    } catch (msg) {
      if (msg === "visible") {
        return true;
      }
    }
    return false;
  }

  getVisibleItems(x, y) {
    if (!this.isCellInRange(x, y)) {
      return "?".gray;
    }
    if (!this.isCellVisible(x, y)) {
      return "?".gray;
    }
    if (this.rocks.filter((r) => r.x === x && r.y === y).length) {
      return "R".cyan.bold;
    }
    if (this.gophers.filter((g) => g.x === x && g.y === y).length) {
      return "G".red.bold;
    }

    return "░";
  }


  print(cells = null) {
    console.log("Current Server Map is : ".cyan);
    console.log(` |${Array.from(Array(this.width).keys()).map((i)=> i.toString().slice(-1)).join("|")}| x`.underline);
    this.grid.forEach((row, y) => {
      const newRow = [].concat(row).fill("░");
      this.gophers.filter((g) => g.y === y).map((g) => newRow[ g.x ] = "G".red.bold);
      this.rocks.filter((r) => r.y === y).map((r) => newRow[ r.x ] = "R".cyan.bold);
      if (cells) { // display green ray
        cells.filter((c) => c.y === y).map((c) => newRow[ c.x ] = newRow[ c.x ].bgGreen);
      }
      const rrr = newRow.map((c, x) => { return this.isCellInRange(x, y) ? c : c.gray});
      console.log(`${y.toString().slice((-1))}|${rrr.join("|")}|`.underline);
    });
    console.log("y");

    this.socket.write("Current Map is : \n".green);

    this.socket.write(` |${Array.from(Array(this.width).keys()).map((i)=> i.toString().slice(-1)).join("|")}| x\r\n`.underline);

    this.grid.forEach((row, y) => {
      const newRow = [];
      row.forEach((cel, x) => { newRow.push(this.getVisibleItems(x, y))});

      // display old / new gooferPos if changed
      row.forEach((cel, x) => {
        if (this.oldPos && this.oldPos.x === x && this.oldPos.y === y ) {
          newRow[x] = newRow[x].bgBlue;
        }
        if (this.newPos && this.newPos.x === x && this.newPos.y === y ) {
          newRow[x] = newRow[x].bgGreen;
        }
      });
      this.socket.write(`${y.toString().slice((-1))}|${newRow.join("|")}|\r\n`.underline);
    });
    this.socket.write("y\r\n");
    this.socket.write("\r\n\r\n".cyan);

    this.oldPos = null;
    this.newPos = null;
  }

};
