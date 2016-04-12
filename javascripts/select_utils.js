var SelectUtils = (function() {
  'use strict';

  var selectUtils = {};

  selectUtils.select = function(query, el) {
    var element = el || document;
    return [].slice.call(element.querySelectorAll(query)); // query and convert to array
  }

  return selectUtils;
})();
