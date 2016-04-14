var ClassUtils = (function() {
  'use strict';

  var classRegex = function (className) {
    return new RegExp('[ ]*\\b' + className + '\\b', 'g');
  };

  var classUtils = {};

  classUtils.hasClass = function(els, className) {
    var regex = classRegex(className);
    var hasClassArray = els.map(function(el) {
      if (el.className.match(regex)) {
        return true;
      }
      return false;
    });
    if (hasClassArray.some(function(el) { return el })) {
      return hasClassArray;
    } else {
      return false;
    }
  }

  classUtils.addClass = function(els, className) {
    var regex = classRegex(className);
    els.forEach(function(el) {
      if (!el.className.match(regex)) {
        el.className += ' ' + className;
      }
    });
    return els;
  }

  classUtils.removeClass = function(els, className) {
    var regex = classRegex(className);
    els.forEach(function(el) {
      el.className = el.className.replace(regex, '');
    });
    return els;
  }

  return classUtils;
})();

var SelectUtils = (function() {
  'use strict';

  var selectUtils = {};

  selectUtils.select = function(query, el) {
    var element = el || document;
    return [].slice.call(element.querySelectorAll(query)); // query and convert to array
  }

  return selectUtils;
})();

var ScriptUtils = (function() {
  'use strict';

  var scriptUtils = {};

  scriptUtils.addScript = function(src) {
    var script = document.createElement('script');
    script.src = src;
    document.head.appendChild(script);
  }

  return scriptUtils;
})();

var ArrayUtils = (function() {
  'use strict';

  var arrayUtils = {};

  // heavily inspired by underscore.js shuffle
  arrayUtils.shuffle = function(obj) {
    var shuffled = Array(obj.length);
    for (var i = 0, rand; i < obj.length; i++) {
      rand = Math.floor(Math.random() * (i + 1));
      if (rand !== i) shuffled[i] = shuffled[rand];
      shuffled[rand] = obj[i];
    }
    return shuffled;
  };

  return arrayUtils;
})();

var TimeUtils = (function() {
  'use strict';

  var timeUtils = {};

  timeUtils.millisToMmAndSs = function(millis) {
    var inSeconds = millis / 1000;
    var minutes = Math.floor(inSeconds / 60);
    var seconds = Math.floor(inSeconds % 60);
    return minutes + 'm ' + seconds + 's';
  }

  return timeUtils;
})();

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

function Timer(onTick) {
  'use strict';

  this._onTick = onTick;
}

(function() {
  'use strict';

  var getNewEllapsed = function() {
    return new Date().getTime() - this._startTime;
  }

  this.start = function() {
    this._startTime = new Date().getTime();
    this._elapsed = 0;
    var self = this;

    this._timerId = window.setInterval(function() {
      self._elapsed = getNewEllapsed.call(self);
      self._onTick(self._elapsed);
    }, 300);
  }

  this.stop = function() {
    clearInterval(this._timerId);
    self._elapsed = getNewEllapsed.call(this);
    return self._elapsed;
  }
}).call(Timer.prototype);

function createBoard(data) {
  'use strict';

  var template = document.getElementById('tile-template'),
      tilesContainer = document.getElementById('tiles'),
      gameTimer = document.getElementById('game-timer'),
      gameEndScreen = document.getElementById('game-end'),
      newGameButton = document.getElementById('new-game');

  ClassUtils.addClass([newGameButton], 'default-button-hidden');

  var initTimer = function() {
    var timer = new Timer(function(time) {
      gameTimer.innerHTML = TimeUtils.millisToMmAndSs(time);
    });
    timer.start();
    return timer
  }

  var initBoard = function() {
    return new Board(9, function() {
      var time = TimeUtils.millisToMmAndSs(timer.stop());
      ClassUtils.addClass([gameEndScreen], 'game-end-visible');
    });
  }

  var timer = initTimer();
  var board = initBoard();

  var applyTemplate = function(template, src, alt) {
    var newTile = template.cloneNode(true);
    newTile.id = '';
    var img = new Image;
    img.src = src;
    img.alt = alt;
    newTile.querySelector('.tile-front-face').appendChild(img);
    return newTile;
  }

  var handleClick = function(tile) {
    board.play(tile);
  }

  var getShuffledBoard = function() {
    var shuffledData = ArrayUtils.shuffle(data);
    return board.getTiles().map(function(el) {
      return {
        src: shuffledData[el.number].img,
        alt: shuffledData[el.number].title,
        number: el.number,
        tile: el
      };
    });
  }

  var setTileCallbacks = function(tile, domTile) {
    tile.setOnUncover(function() {
      ClassUtils.addClass([domTile], 'tile-flipped');
    });
    tile.setOnCover(function() {
      window.setTimeout(function() {
        ClassUtils.removeClass([domTile], 'tile-flipped');
      }, 800);
    });
  }

  var build = function() {
    var tiles = getShuffledBoard();
    tiles.forEach(function(rawTile) {
      var domTile = applyTemplate(template, rawTile.src, rawTile.alt);
      tilesContainer.appendChild(domTile);
      setTileCallbacks(rawTile.tile, domTile);
      domTile.addEventListener('click', handleClick.bind(null, rawTile.tile));
    });
  }

  build();
}

(function() {
  'use strict';

  var called = false;
  var newGameButton = document.getElementById('new-game');
  newGameButton.addEventListener('click', function() {
    if (!called) {
      ScriptUtils.addScript('https://services.sapo.pt/Codebits/listbadges?callback=createBoard');
      ClassUtils.addClass([newGameButton], 'default-button-loading');
      called = true;
    }
  });
})();
