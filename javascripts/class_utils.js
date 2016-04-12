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
