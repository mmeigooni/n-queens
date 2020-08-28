/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n, startPosition) {
  var solution = undefined; //fixme
  var newBoard = new Board({n: n});
  var count = 0;

  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      newBoard.togglePiece(i, j); //now it's a 1
      count++;
      if (newBoard.hasAnyRooksConflicts()) {
        newBoard.togglePiece(i, j); //now it's a 0
        count--;
      }

      if (count === n) {
        solution = newBoard.rows();
        console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
        return solution;

      }
    }
  }
};


window.countNRooksSolutions = function(n) {

  var newBoard = new Board({n: n});
  var solutionCount = 0;

  var addRow = function(rowIndex) {

    if (rowIndex === n) {
      solutionCount++;
      return;
    }

    for (var i = 0; i < n; i++) {
      newBoard.togglePiece(rowIndex, i);
      if (!newBoard.hasAnyRooksConflicts()) {
        addRow(rowIndex + 1);
      }
      newBoard.togglePiece(rowIndex, i);
    }
  };

  addRow(0, 0);
  console.log(`n: ${n} and solutionCount: ${solutionCount}`);
  return solutionCount;
};

/*
    board.rows()[rowIndex] = Array(n).fill(0);//an array of n zeroes;
    for (var i = colStartIndex; i < n; i++) {
      board.togglePiece(rowIndex, i);
      count++;
      if (board.hasAnyRooksConflicts()) {
        board.togglePiece(rowIndex, i);
        count--;
      } else {
        if (count === n) {
          console.log(`n is: ${n} and board rows are ${board.rows()}`);
          solutionCount++;
          arrayOfSolutions.push(board.rows().slice());
          return;
        }
        if (rowIndex === n - 1) {
          return;
        }
        //need to only run some of these to avoid duplicates
        // for (var j = 0; j < n; j++) {
        //   addRow(board, rowIndex + 1, count, j);
        // }
        for (var j = 0; j < 3; j++) {
          addRow(board, rowIndex + 1, count, 0);
        }
      }
      */


// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
