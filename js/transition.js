/*
 * Heyday: transition.js v1.0.0
 */

+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('heyday')
    var transEndEventNames = {
      'WebkitTransition' :  'webkitTransitionEnd',
      'MozTransition':      'transitionend',
      'OTransition':        'oTransitionEnd otransitionend',
      'transition':         'transitionend'
    }
    var name

    for (name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })
}(jQuery);
