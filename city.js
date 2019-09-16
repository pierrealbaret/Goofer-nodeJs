module.exports = class City {
    constructor(width, height, socket) {
        this.width = width;
        this.height = height;
        this.grid = [];
        this.socket = socket;
        this.gooferList = [];

        this.populate(10);
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

    randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    populate(number = 10) {
        for(let i= 0; i<number; i ++) {
            const x = this.randomIntFromInterval(0, this.width);
            const y = this.randomIntFromInterval(0, this.height);
            this.gooferList.push({x, y});
        }
    }

    print() {
        this.socket.write('My Map is : \r\n');
        this.grid.map((row) => {
           this.socket.write(`${row.join('|')}\r\n`);
        });
    }

};
