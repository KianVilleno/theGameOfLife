let COLS = 40;
let ROWS = 40;
let SIZE = 10;
let matrix, current;

function setup() {
  if (COLS * SIZE >= window.innerWidth) {
    COLS = Math.floor(window.innerWidth / SIZE) - 1;
    ROWS = COLS;
  }
  createCanvas(ROWS * SIZE, COLS * SIZE);
  //creating the first generation
  matrix = new MATRIX(COLS, ROWS, SIZE);
  current = matrix;

  //giving the first generation random lives
  giveRandomLives(matrix);
}

function draw() {
  background(51);
  logic();
  current.show();
}

function logic() {
  let nextGeneration = new MATRIX(COLS, ROWS, SIZE);

  for (let i = 0; i < current.cols; i++) {
    for (let j = 0; j < current.rows; j++) {
      //this is the current Cell
      let currentCell = current.matrix[i][j];
      let cell_neighbors = valueOfNeighbors(currentCell, current);
      let newValue = 0;
      //Any live cell with fewer than two live neighbours dies, as if by underpopulation.
      //Any live cell with two or three live neighbours lives on to the next generation.
      //Any live cell with more than three live neighbours dies, as if by overpopulation.

      if (currentCell.value == 1) {
        //this cell is alive
        if (cell_neighbors < 2 || cell_neighbors > 3) {
          //cell is dead
          newValue = 0;
        } else {
          //else it is alive
          newValue = 1;
        }
      } else if (currentCell.value == 0) {
        if (cell_neighbors == 3) {
          //cell is alive
          newValue = 1;
        } else {
          //else it remains dead
          newValue = 0;
        }
      }

      nextGeneration.matrix[i][j].value = newValue;
    }
  }

  current = nextGeneration;
}

function valueOfNeighbors(cell, current_matrix) {
  let value = 0;

  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let x = (cell.i + i + current_matrix.cols) % current_matrix.cols;
      let y = (cell.j + j + current_matrix.rows) % current_matrix.rows;
      let current_value = current_matrix.matrix[x][y].value;
      value += current_value;
    }
  }

  value -= cell.value;

  return value;
}

function giveRandomLives(grid, amount) {
  for (let i = 0; i < grid.cols; i++) {
    for (let j = 0; j < grid.rows; j++) {
      if (random() > 0) grid.matrix[i][j].value = int(random(2));
    }
  }
}

class CELL {
  constructor(i, j, size) {
    this.i = i;
    this.j = j;
    this.size = size;
    this.value = 0;
  }

  show() {
    let size = this.size;
    let x = this.i * size;
    let y = this.j * size;
    if (this.value == 0) {
      fill("#1e212d");
    } else if (this.value == 1) {
      fill("#f3f4ed");
    }
    stroke("#1e212d");
    rect(x, y, size, size);
  }
}

class MATRIX {
  constructor(col, row, size) {
    this.cols = col;
    this.rows = row;
    this.matrix = new Array(this.cols);
    this.size = size;

    this.makeGRID();
  }

  makeGRID() {
    for (let i = 0; i < this.cols; i++) {
      this.matrix[i] = new Array(this.rows);
    }
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.matrix[i][j] = new CELL(i, j, this.size);
      }
    }
  }

  show() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.matrix[i][j].show();
      }
    }
  }
}
