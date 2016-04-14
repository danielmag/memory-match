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
