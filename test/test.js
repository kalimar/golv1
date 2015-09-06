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

  it('will toroidize the cell if necessary', function() {
    var size = 10
    , lastPos = size -1
    , firstPos = 0
    , nonToroid = [3,4]
    , toroid1 = [-1, 1]//toroidized [lastPos, 1]
    , toroid2 = [10, 1]//toroidized [firstPos, 1]
    , toroid3 = [1, -1]//toroidized [1, lastPos]
    , toroid4 = [1, 10]//toroidized [1, firstPos]
    , toroid5 = [-1, -1]//toroidized [lastPos, lastPos]
    , toroid6 = [10, 10]//toroidized [firstPos, firstPos];
    assert.isTrue(cellsMatch(nonToroid, toroidizeCell(nonToroid, size)), 'do not toroidize if not necessary' );
    assert.isTrue(cellsMatch([lastPos, 1], toroidizeCell(toroid1, size)), 'toroidize toroid1');
    assert.isTrue(cellsMatch([firstPos, 1], toroidizeCell(toroid2, size)), 'toroidize toroid2');
    assert.isTrue(cellsMatch([1, lastPos], toroidizeCell(toroid3, size)), 'toroidize toroid3');
    assert.isTrue(cellsMatch([1, firstPos], toroidizeCell(toroid4, size)), 'toroidize toroid4');
    assert.isTrue(cellsMatch([lastPos, lastPos], toroidizeCell(toroid5, size)), 'toroidize toroid5');
    assert.isTrue(cellsMatch([firstPos, firstPos], toroidizeCell(toroid6, size)), 'toroidize toroid6');
  })

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
