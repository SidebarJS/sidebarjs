'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* jshint -W003  */ /* jshint -W030  */ /* jshint -W040 */

window.SidebarJS = function (window, document) {
  'use strict';

  var IS_VISIBLE = 'is-visible';
  var TRANSITION = 'transition:';
  var TRANSLATE = 'transform: translate';

  var SidebarJS = function () {
    function SidebarJS(config) {
      _classCallCheck(this, SidebarJS);

      this.$component = document.querySelector(config ? config.component : '.js-sidebar');
      this.$container = document.querySelector(config ? config.container : '.js-sidebar--container');
      this.$background = document.querySelector(config ? config.background : '.js-sidebar--background');
      this.$open = document.querySelector(config ? config.showElement : '.js-sidebar--open');

      this.$container.addEventListener('touchstart', _onTouchStart.bind(this));
      this.$container.addEventListener('touchmove', _onTouchMove.bind(this));
      this.$container.addEventListener('touchend', _onTouchEnd.bind(this));
      this.$background.addEventListener('click', this.close.bind(this));
      this.$open.addEventListener('click', this.open.bind(this));
    }

    _createClass(SidebarJS, [{
      key: 'open',
      value: function open() {
        _element(this.$container, [TRANSITION + ' all .3s ease', TRANSLATE + '(0, 0)']);
        if (!this.$component.classList.contains(IS_VISIBLE)) {
          this.$component.classList.add(IS_VISIBLE);
        }
      }
    }, {
      key: 'close',
      value: function close() {
        _element(this.$container, [TRANSITION + ' all .3s ease', TRANSLATE + '(-100%, 0)']);
        this.$component.classList.remove(IS_VISIBLE);
      }
    }]);

    return SidebarJS;
  }();

  function _vendorify(el, prop, val) {
    var Prop = prop.charAt(0).toUpperCase() + prop.slice(1);
    var prefs = ['Moz', 'Webkit', 'O', 'ms'];
    el.style.prop = val;
    for (var i = 0; i < prefs.length; i++) {
      el.style[prefs[i] + Prop] = val;
    }
    return el;
  }

  function _element(el, props) {
    for (var i = 0; i < props.length; i++) {
      var prop = props[i].split(':')[0];
      var val = props[i].split(':')[1];
      _vendorify(el, prop, val);
    }
    return el;
  }

  function _onTouchStart(e) {
    _element(this.$container, [TRANSITION + ' none']).touchStart = e.touches[0].pageX;
  }

  function _onTouchMove(e) {
    this.$container.touchMove = this.$container.touchStart - e.touches[0].pageX;
    if (this.$container.touchMove > 0) {
      _element(this.$container, [TRANSLATE + '(' + -this.$container.touchMove + 'px, 0)']);
    }
  }

  function _onTouchEnd() {
    this.$container.touchMove > this.$container.clientWidth / 3.5 ? this.close() : this.open();
  }

  return SidebarJS;
}(window, document);