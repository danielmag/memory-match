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
