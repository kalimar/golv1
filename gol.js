var UNDER_POPULATION = 2;
var OVER_POPULATION = 3;
var GROWTH_CONDITION = 3;
// Our first iteration involves passing around a lot of information since
// we are not yet using objects

function seedBoard(size, starterCells) {
  var board = [],
    cell;
  for (var i = 0; i < starterCells; i++) {
    cell = generateRandomCell(size, board);
    addCellToBoard(cell, board);
  }
  return board
};

// Need to decide if validation of existing cell should actually be here
// And then how to handle that
function addCellToBoard(cell, board) {
  board.push(cell);
  return board;
};

function generateRandomCell(size, board) {
  var cell =  [getRandomInt(size), getRandomInt(size)];
  if (cellAlreadyOnBoard(cell, board)) {
    return generateRandomCell(size, board)
  } else {
    return cell;
  }
}

function cellAlreadyOnBoard(cell, board) {
  return board.filter(
    function(boardCell) {
     return cellsMatch(cell, boardCell) } ).length > 0;
}

function cellsMatch(cellA, cellB) {
  return (cellA[0] === cellB[0] && cellA[1] === cellB[1]);
}

function getRandomInt(size) {
  return Math.floor(Math.random() * (size));
}

/*
 Our board is a toroidal array https://en.wikipedia.org/wiki/Torus
 Meaning that the left and right edges (and top and bottom) are stiched together.
 if a neighbor has any coordinate equal to -1 or greater than the last position,
 then we have to torodoize the cell so it will move to the other edge of
 the board.
*/
function countLivingNeighbors(cell,board,size) {
  var neighbors = [ [ cell[0]-1 , cell[1]    ]
                  , [ cell[0]+1 , cell[1]    ]
                  , [ cell[0]   , cell[1]+1  ]
                  , [ cell[0]   , cell[1]-1  ]
                  , [ cell[0]-1 , cell[1]-1  ]
                  , [ cell[0]+1 , cell[1]+1  ]
                  , [ cell[0]-1 , cell[1]+1  ]
                  , [ cell[0]+1 , cell[1]-1  ] ];
  var livingNeighbors = 0;
  neighbors.map(function(neighbor) {
    neighbor = toroidizeCell(neighbor, size);
    if (cellAlreadyOnBoard(neighbor, board)) { livingNeighbors += 1 }
  })
  return livingNeighbors;
}

/*
  Checks if the cell is off the grid (0 or too large) and shifts it to
  the other end of the board. Using modulo, we check if the cell position
  is -1 if so we return the last index. At the top end of the array, using
  modulo, the result will return either the position, or 0.
*/
function toroidizeCell (cell, size) {
  cell[0] = cell[0]%size < 0 ? size - 1 : cell[0]%size;
  cell[1] = cell[1]%size < 0 ? size - 1 : cell[1]%size;
  return cell;
}

function tick(board, size) {
  var cellsToGenerate = []
  , cellsToKill       = [];
  for (var i = 0; i < size; i++) {
    for (var j=0; j < size; j++) {
      var cell = [i,j]
      var neighborCount = countLivingNeighbors(cell, board, size)
      if (cellAlreadyOnBoard(cell, board)) {
          // underpopulation
          if (neighborCount < UNDER_POPULATION) {
            cellsToKill.push(cell);
            break;
          // overpopulation
          } else if (neighborCount > OVER_POPULATION) {
            cellsToKill.push(cell);
            break;
          }
      } else {
        //  reproduction
        if (neighborCount === GROWTH_CONDITION) { cellsToGenerate.push(cell) }
      }
    }
  }
  if (cellsToKill.length > 0) { board = killCells(board, cellsToKill) }
  if (cellsToGenerate.length > 0) { board = generateCells(board, cellsToGenerate) }
  return board;
}

function killCells(board, cellsToKill) {
  var newBoard = board.filter(
    function(targetCell) {
      return !cellAlreadyOnBoard(targetCell, cellsToKill);
  });
  return newBoard;
}

function generateCells(board, cellsToGenerate) {
  cellsToGenerate.map(function(cell) {
    board.push(cell);
  })
  return board;
}

function drawBoard(board) {
  var ctx=document.getElementById('canvas').getContext('2d');
  ctx.clearRect(0,0, 610, 610);
  board.map( function(cell) {
    ctx.fillStyle = 'orange';
    ctx.fillRect(cell[0]*10+5, cell[1]*10+5, 10, 10);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.strokeRect(cell[0]*10+5, cell[1]*10+5, 10, 10);
  })
}

