function Tile(number) {
  'use strict';
  this.number = number;
  this._uncovered = false;
}

(function(){
  'use strict';

  this.uncover = function() {
    this._uncovered = true;
    this._onUncover();
  }

  this.cover = function() {
    this._uncovered = false;
    this._onCover();
  }

  this.isUncovered = function() {
    return this._uncovered;
  }

  this.matches = function(tile) {
    return this.number === tile.number;
  }

  this.setOnUncover = function(onUncover) {
    this._onUncover = onUncover;
  }

  this.setOnCover = function(onCover) {
    this._onCover = onCover;
  }
}).call(Tile.prototype);
