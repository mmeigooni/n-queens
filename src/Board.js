// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({
    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },



    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    hasRowConflictAt: function(rowIndex) {
      const row = this.rows()[rowIndex];
      let count = 0;
      for (let i = 0; i < row.length; i++) {
        count += row[i];
      }
      return count > 1;
    },

    hasAnyRowConflicts: function() {
      var rows = this.rows();
      for (var i = 0; i < rows.length; i++) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return false;
    },

    hasColConflictAt: function(colIndex) {
      let count = 0;
      for (var i = 0; i < this.get('n'); i++) {
        if (this.rows()[i][colIndex] === 1) { //this.get(i)[colIndex]
          count++;
        }
      }
      return count > 1;
    },

    hasAnyColConflicts: function() {
      for (var i = 0; i < this.get('n'); i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      let count = 0;
      let rowIndex, colIndex;
      if (majorDiagonalColumnIndexAtFirstRow >= 0) {
        rowIndex = 0;
        colIndex = majorDiagonalColumnIndexAtFirstRow;
      } else {
        rowIndex = Math.abs(majorDiagonalColumnIndexAtFirstRow);
        colIndex = 0;
      }

      while (rowIndex < this.attributes.n) {
        if (this.get(rowIndex)[colIndex]) {
          count++;
        }
        rowIndex++;
        colIndex++;
      }
      return count > 1;
    },

    hasAnyMajorDiagonalConflicts: function() {
      for (let i = 1 - this.get('n'); i < this.get('n') - 1; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    },

    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      let count = 0;
      let rowIndex, colIndex;
      if (minorDiagonalColumnIndexAtFirstRow >= this.get('n') - 1) {
        colIndex = this.get('n') - 1;
        rowIndex = minorDiagonalColumnIndexAtFirstRow - colIndex;
      } else {
        colIndex = minorDiagonalColumnIndexAtFirstRow;
        rowIndex = 0;
      }
      while (rowIndex < this.attributes.n) {
        if (this.get(rowIndex)[colIndex]) {
          count++;
        }
        rowIndex++;
        colIndex--;
      }
      return count > 1;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      for (let i = 1; i < (2 * this.get('n')) - 2; i++) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
