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
