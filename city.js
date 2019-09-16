module.exports = class City {
    constructor(width, height, socket) {
        this.width = width;
        this.height = height;
        this.grid = [];
        this.socket = socket;
        this.createGrid();
    }

    createGrid() {
        for(let i = 0; i < this.width; i++) {
            this.grid.push(Array(this.height).fill('0', 0, this.height));
        }
    }

    getCase(x, y) {
        return this.grid[x][y];
    }

    setCase(x, y, value) {
        this.grid[x][y] = value;
    }

    print() {
        this.socket.write('My Map is : \r\n');
        this.grid.map((row) => {
           this.socket.write(`${row.join('|')}\r\n`);
        });
    }

};
