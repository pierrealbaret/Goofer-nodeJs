const bresenham = require("bresenham-js");

module.exports = class City {
  constructor(socket, width = 10, height = 10) {
    this.width = width;
    this.height = height;
    this.grid = this.createGrid();
    this.socket = socket;
    this.gophers = {};
    this.players = {};
    this.rocks = this.addRock();
    this.fov = 3;
    this.oldPos = null;
    this.newPos = null;
  }

  populate(playerId, nbGophers = 10) {
    const playersGophers = [];
    for (let i = 0; i < nbGophers; i++) {
      playersGophers.push(this.createRandomItem());
    }
    this.gophers = { [playerId]: playersGophers };
    this.players = { [playerId]: { color: this.getRandomColor()} };
    console.log(this.players);
    this.socket.write(`created gophers : ${JSON.stringify(this.gophers[playerId])}\r\n`);
  }

  getAllGophers() {
    return Object.keys(this.gophers)
      .map((playerId) => {
        return this.gophers[playerId]
      })
      .reduce((acc, item) => {
        return acc.concat(item);
      }, []);
  }

  isOccupied(item) {
    const allGophers = this.getAllGophers();
    if (this.rocks) {
      return allGophers.find((g) => g.x === item.x && g.y === item.y) || this.rocks.find((r) => r.x === item.x && r.y === item.y);
    }
    return allGophers.find((g) => g.x === item.x && g.y === item.y);
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

  move(playerId, oldPos, newPos) {
    let newNewPos = this.trueNewPosition(newPos, oldPos);
    this.oldPos = oldPos; // save
    this.newPos = newNewPos; // save
    this.gophers[playerId]
      .forEach((gopher) => {
        if (gopher.x === oldPos.x && gopher.y === oldPos.y) {
          gopher.x = newNewPos.x;
          gopher.y = newNewPos.y;
        }
      });
    this.print(playerId);
  }

  getGopherInRange(x, y, playerId = null) {
    if (playerId && this.gophers[ playerId ]) {
      return this.gophers[playerId].filter((g) =>
        (g.x >= x - this.fov && g.x <= x + this.fov) &&
        (g.y >= y - this.fov && g.y <= y + this.fov)
      )
    }
    return Object.keys(this.gophers)
      .map((pId) => {
        return this.gophers[pId].filter((g) =>
          (g.x >= x - this.fov && g.x <= x + this.fov) &&
          (g.y >= y - this.fov && g.y <= y + this.fov)
        )
      }).reduce((acc, item) => {
        return acc.concat(item);
      }, []);
  }

  isCellInRange(x, y, playerId = null) {
    return this.getGopherInRange(x,y, playerId).length;
  }

  getCellsBetween(a, b) {
    // const delta = (b.y-a.y)/(b.x-a.x);
    const pts = bresenham([ a.x, a.y ],[ b.x, b.y ]);
    return pts.map((pt) => ({ x: pt[ 0 ], y: pt[ 1 ]}));
  }

  isCellVisible(x, y, playerId = null) {
    const gophersInRange = this.getGopherInRange(x,y, playerId);
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

  getVisibleItems(x, y, playerId = null) {
    if (!this.isCellInRange(x, y, playerId)) {
      return "?".gray;
    }
    if (!this.isCellVisible(x, y, playerId)) {
      return "?".gray;
    }
    if (this.rocks.filter((r) => r.x === x && r.y === y).length) {
      return "R".cyan.bold;
    }
    if (playerId) {
      if (this.gophers[playerId].filter((g) => g.x === x && g.y === y).length) {
        return "G"[this.players[playerId].color].bold;
      }
    } else {
      if (this.getAllGophers().filter((g) => g.x === x && g.y === y).length) {
        return "G".red.bold;
      }
    }

    return "░";
  }

  getRandomColor() {
    const availableColors = ["black", "red", "green", "yellow", "blue", "magenta", "white", "gray" ];

    return availableColors[Math.floor(Math.random()*availableColors.length)];
  }

  print(playerId, cells = null) {

    // server view
    console.log("Current Server Map is : ".cyan);
    console.log(` |${Array.from(Array(this.width).keys()).map((i)=> i.toString().slice(-1)).join("|")}| x`.underline);
    this.grid.forEach((row, y) => {
      const newRow = [].concat(row).fill("░");

      Object.keys(this.gophers)
        .forEach((pId) => {
          this.gophers[pId]
            .filter((g) => g.y === y)
            .forEach((g) => newRow[ g.x ] = "G"[ this.players[ pId ].color ].bold);
        });


      this.rocks.filter((r) => r.y === y).map((r) => newRow[ r.x ] = "R".cyan.bold);
      if (cells) { // display green ray
        cells.filter((c) => c.y === y).map((c) => newRow[ c.x ] = newRow[ c.x ].bgGreen);
      }
      const rrr = newRow.map((c, x) => { return this.isCellInRange(x, y) ? c : c.gray});
      console.log(`${y.toString().slice((-1))}|${rrr.join("|")}|`.underline);
    });
    console.log("y");


    // client view
    this.socket.write("Current Map is : \n".green);

    this.socket.write(` |${Array.from(Array(this.width).keys()).map((i)=> i.toString().slice(-1)).join("|")}| x\r\n`.underline);

    this.grid.forEach((row, y) => {
      const newRow = [];
      row.forEach((cel, x) => { newRow.push(this.getVisibleItems(x, y, playerId))});

      // display old / new gopherPos if changed
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

    this.oldPos = null;
    this.newPos = null;
  }

};
