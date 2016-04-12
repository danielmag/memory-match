function Board(uniqueTiles, onWin) {
  'use strict';

  this._onWin = onWin
  this._tileShown = null;
  this._tilesMatched = 0;

  var tiles = [];
  for (var i = 0; i < uniqueTiles; i++) {
    tiles.push(new Tile(i));
    tiles.push(new Tile(i));
  }

  this._tiles = ArrayUtils.shuffle(tiles);
}

(function(){
  'use strict';

  var correctGuess = function() {
    this._tilesMatched += 2;
    if (this._tilesMatched === this._tiles.length) {
      this._onWin();
    }
    this._tileShown = null;
  }

  var wrongGuess = function(tile) {
    this._tileShown.cover();
    tile.cover();
    this._tileShown = null;
  }

  this.play = function(tile) {
    if (tile.isUncovered()) {
      return;
    }
    tile.uncover();
    if (this._tileShown) {
      this._tileShown.matches(tile) ? correctGuess.call(this) : wrongGuess.call(this, tile);
    } else {
      this._tileShown = tile;
    }
  }

  this.getTiles = function() {
    return this._tiles;
  }
}).call(Board.prototype);
