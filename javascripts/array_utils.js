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
