var assert = chai.assert;

describe('Building a board', function() {
  it('seeds the board with as many cells as specified by the user', function() {
    var size       = 10
    , starterCells = 3
    , board        = seedBoard(size, starterCells);
    assert.equal(board.length, starterCells);
  });

  it('only has cells that fit within the size of the board', function() {
    var size = 20
    , board  = []
    , cell1  = generateRandomCell(size,[])
    , cell2  = generateRandomCell(size,[])
    , cell3  = generateRandomCell(size,[])
    var cellContainer = function(cell) {
      return (cell[0] >= 0 && cell[1] < size)
    }
    assert.isTrue(cellContainer(cell1), 'Cell 1 fits within the board');
    assert.isTrue(cellContainer(cell2), 'Cell 2 fits within the board');
    assert.isTrue(cellContainer(cell3), 'Cell 3 fits within the board');
  });

  it('can check if a cell already exists on the board', function() {
    var size = 20
    , board  = []
    , cell1  = generateRandomCell(size,board)
    , cell2  = cell1;
    addCellToBoard(cell1, board);
    assert.equal(board.length, 1, 'There is one cell on the board');
    assert.isTrue(cellAlreadyOnBoard(cell2, board), 'Cell exists on board');
    //Current implementation doesn't allow us to try an add a cell to the board if it already exists
    //We are only really using this method when we generate a random cell.

    var cell3 = generateRandomCell(size,board);
    assert.isFalse(cellAlreadyOnBoard(cell3, board))
    addCellToBoard(cell3, board)
    assert.equal(board.length, 2, 'There are now two cells on the board');
  })
});
