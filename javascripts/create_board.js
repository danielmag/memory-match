function createBoard(data) {
  'use strict';

  var template = document.getElementById('tile-template'),
      tilesContainer = document.getElementById('tiles'),
      gameTimer = document.getElementById('game-timer'),
      gameEndScreen = document.getElementById('game-end'),
      newGameButton = document.getElementById('new-game'),
      twitterShare = document.getElementById('twitter-share'),
      shareLinkMessage = 'Memory JavaScript FTW em: ';

  ClassUtils.addClass(newGameButton, 'default-button-hidden');

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
      twitterShare.href += encodeURIComponent(shareLinkMessage + time);
      ClassUtils.addClass(gameEndScreen, 'game-end-visible');
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
      ClassUtils.addClass(domTile, 'tile-flipped');
    });
    tile.setOnCover(function() {
      window.setTimeout(function() {
        ClassUtils.removeClass(domTile, 'tile-flipped');
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
      ClassUtils.addClass(newGameButton, 'default-button-loading');
      called = true;
    }
  });
})();
