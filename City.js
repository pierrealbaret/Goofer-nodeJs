/* eslint-disable no-console */
const bresenham = require("bresenham-js"),
  Gopher = require("./Gopher");

module.exports = class City {
  constructor(width = 10, height = 10) {
    this.width = width;
    this.height = height;
    this.grid = this.createGrid();
    this.players = {};
    this.rocks = this.addRock();
    this.fov = 2;
    this.availableColors = [ "black", "red", "green", "yellow", "blue", "magenta", "white", "gray" ];
  }

  populate(playerId, nbGophers = 10) {
    for (let i = 0; i < nbGophers; i++) {
      this.players[ playerId ].gophers.push(new Gopher(this.createRandomItem()));
    }
    // this.players[ playerId ].gophers = playersGophers;
    this.players[ playerId ].color = this.getRandomColor();
    this.players[ playerId ].write(`created gophers : ${JSON.stringify(this.players[ playerId ].gophers)}`);
    this.players[ playerId ].availableCommands.populate = false;
  }

  getAllGophers(state = "alive") {
    return Object.keys(this.players)
      .map((playerId) => {
        if (state === "alive" || state === "dead") {
          return this.players[ playerId ].gophers.filter((g) => g.isAlive === state);
        }

        return this.players[ playerId ].gophers;
      })
      .reduce((acc, item) => {
        return acc.concat(item);
      }, []);
  }

  isOccupied(pos) {
    return this.isRock(pos) || this.isGopher(pos);
  }

  isRock(pos) {
    if (this.rocks !== undefined) {
      return this.rocks.find((r) => r.x === pos.x && r.y === pos.y);
    }
    return false;
  }

  isGopher(pos) {
    return this.getAllGophers("deadOrAlive").find((g) => g.x === pos.x && g.y === pos.y);
  }

  createRandomItem() {
    const item = { x: this.getRandomInt(this.width), y: this.getRandomInt(this.height) };
    if (!this.isOccupied(item)) {
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
    let rocks = [];
    const nbRock = this.getRandomInt(Math.floor(Math.sqrt(this.width * this.height))) || 1;
    for (let i = 0; i < nbRock; i++) {
      rocks.push(this.createRandomItem());
    }
    // console.log(rocks);
    return rocks;
  }

  trueNewPosition(playerId, oldPos, newPos) {
    if ((newPos.x < 0) || (newPos.x >= this.width) || (newPos.y < 0) || (newPos.y >= this.height || this.isRock(newPos))) {
      this.players[ playerId ].write("invalid move !!!".red);
      return oldPos;
    }
    return newPos;
  }

  move(playerId, oldPos, newPos) {
    let pos = this.trueNewPosition(playerId, oldPos, newPos);
    console.log(`move player: ${playerId} ${JSON.stringify(oldPos)} -> ${JSON.stringify(pos)}`[this.players[ playerId ].color ]);

    if (this.isGopher(pos) && oldPos.x !== pos.x && oldPos.y !== pos.y) {
      const allAliveGophers = this.getAllGophers("alive").find((g) => g.x === newPos.x && g.y === newPos.y);
      if (allAliveGophers) {
        allAliveGophers.isAlive = "dead";
        Object.values(this.players)
          .forEach((player) => {
            if (player.gophers.find((gPlayer) => gPlayer.x === allAliveGophers.x && gPlayer.y === allAliveGophers.y)) {
              player.write(`Killed by ${playerId}, ${JSON.stringify(oldPos)} -> ${JSON.stringify(newPos)}\r\n`.bold.red);

              console.log(`${playerId}, ${JSON.stringify(oldPos)} -> ${JSON.stringify(newPos)}`.bold.red.bgYellow);
              console.log("██╗  ██╗██╗██╗     ██╗     ".bold.red.bgYellow);
              console.log("██║ ██╔╝╚═╝██║     ██║     ".bold.red.bgYellow);
              console.log("█████╔╝ ██║██║     ██║     ".bold.red.bgYellow);
              console.log("██╔═██╗ ██║██║     ██║     ".bold.red.bgYellow);
              console.log("██║  ██╗██║███████╗███████╗".bold.red.bgYellow);
              console.log("╚═╝  ╚═╝╚═╝╚══════╝╚══════╝".bold.red.bgYellow);
              console.log("                           ".bold.red.bgYellow);
            }
          });
      }

    }
    this.players[ playerId ].oldPos = oldPos; // save
    this.players[ playerId ].newPos = pos; // save

    if (this.players[ playerId ].gophers) {
      const pGopher = this.players[ playerId ].gophers
        .find((gopher) => gopher.x === oldPos.x && gopher.y === oldPos.y);
      if (pGopher) {
        pGopher.x = pos.x;
        pGopher.y = pos.y;
      }
    }
  }

  getGopherInRange(x, y, playerId = null) {
    if (playerId && this.players[ playerId ].gophers) {
      return this.players[ playerId ].gophers.filter((g) =>
        (g.x >= x - this.fov && g.x <= x + this.fov) && (g.y >= y - this.fov && g.y <= y + this.fov)
      );
    }
    return Object.values(this.players)
      .map((player) => {
        if (player.gophers) {
          return player.gophers.filter((g) =>
            (g.x >= x - this.fov && g.x <= x + this.fov) && (g.y >= y - this.fov && g.y <= y + this.fov)
          );
        }
      }).reduce((acc, item) => {
        return acc.concat(item);
      }, []);
  }

  isCellInRange(x, y, playerId = null) {
    return this.getGopherInRange(x, y, playerId).length;
  }

  getCellsBetween(a, b) {
    // const delta = (b.y-a.y)/(b.x-a.x);
    const pts = bresenham([ a.x, a.y ], [ b.x, b.y ]);
    return pts.map((pt) => ({ x: pt[ 0 ], y: pt[ 1 ] }));
  }

  isCellVisible(x, y, playerId = null) {
    const gophersInRange = this.getGopherInRange(x, y, playerId);
    try {
      const cellVisibleForGophers = gophersInRange.map((g) => {
        if (x === g.x && y === g.y) { // cellule = gopher > on stop !
          throw "visible";
        }

        const cells = this.getCellsBetween({ x, y }, { x: g.x, y: g.y });
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
      return Object.values(this.players)
        .map((player) => {
          const g = player.gophers.find((gPlayer) => gPlayer.x === x && gPlayer.y === y);
          if (g) {
            return `${g.isAlive === "alive" ? "G" : "X"}`[ player.color ].bold;
          }
        })
        .reduce((acc, item) => {
          if (item) {
            if (acc === "G" && item === "X") {
              return "G";
            }
            return item;
          }
          return acc;
        }, "░");
    } else if (this.getAllGophers().filter((g) => g.x === x && g.y === y).length) {
      return "G".red.bold;
    }

    return "░";
  }

  getRandomColor() {
    const index = Math.floor(Math.random() * this.availableColors.length);
    return this.availableColors.splice(index, 1);
  }

  printServer() {
    // server view
    console.log("Current Server Map is : ".cyan);
    console.log(` |${Array.from(Array(this.width).keys()).map((i) => i.toString().slice(-1)).join("|")}| x`.underline);
    this.grid.forEach((row, y) => {
      const newRow = [].concat(row).fill("░");

      Object.values(this.players)
        .forEach((player) => {
          if (player.gophers) {
            player.gophers
              .filter((g) => g.y === y)
              .forEach((g) => newRow[ g.x ] = "G"[ player.color ].bold);
          }
        });


      this.rocks.filter((r) => r.y === y).map((r) => newRow[ r.x ] = "R".cyan.bold);
      // if (cells) { // display green ray
      //   cells.filter((c) => c.y === y).map((c) => newRow[ c.x ] = newRow[ c.x ].bgGreen);
      // }
      const rrr = newRow.map((c, x) => {
        return this.isCellInRange(x, y) ? c : c.gray;
      });
      console.log(`${y.toString().slice((-1))}|${rrr.join("|")}|`.underline);
    });
    console.log("y");
  }

  print(playerId) {

    // client view
    this.players[ playerId ].write("Current Map is : ".green);

    this.players[ playerId ].write(` |${Array.from(Array(this.width).keys()).map((i) => i.toString().slice(-1)).join("|")}| x`.underline);

    this.grid.forEach((row, y) => {
      const newRow = [];
      row.forEach((cel, x) => {
        newRow.push(this.getVisibleItems(x, y, playerId));
      });

      // display old / new gopherPos if changed
      row.forEach((cel, x) => {
        if (this.players[ playerId ].oldPos && this.players[ playerId ].oldPos.x === x && this.players[ playerId ].oldPos.y === y) {
          newRow[ x ] = newRow[ x ].bgBlue;
        }
        if (this.players[ playerId ].newPos && this.players[ playerId ].newPos.x === x && this.players[ playerId ].newPos.y === y) {
          newRow[ x ] = newRow[ x ].bgGreen;
        }
      });
      this.players[ playerId ].write(`${y.toString().slice((-1))}|${newRow.join("|")}|`.underline);
    });
    this.players[ playerId ].write("y");

    this.players[ playerId ].oldPos = null;
    this.players[ playerId ].newPos = null;
  }

};
