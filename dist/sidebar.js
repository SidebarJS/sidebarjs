'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* jshint -W003  */ /* jshint -W014  */ /* jshint -W030  */ /* jshint -W040 */

window.SidebarJS = function (window, document) {
  'use strict';

  var CLASS_IS_VISIBLE = 'sidebarjs--is-visible';
  var CLASS_IS_MOVING = 'sidebarjs--is-moving';

  var SidebarJS = function () {
    function SidebarJS() {
      _classCallCheck(this, SidebarJS);

      this.component = document.querySelector('[sidebarjs]');
      this.container = _create('sidebarjs-container');
      this.background = _create('sidebarjs-background');

      this.container.innerHTML = this.component.innerHTML;
      this.component.innerHTML = '';
      this.component.appendChild(this.container);
      this.component.appendChild(this.background);

      var _toggles = document.querySelectorAll('[sidebarjs-toggle]');
      for (var i = 0; i < _toggles.length; i++) {
        _toggles[i].addEventListener('click', this.toggle.bind(this));
      }

      this.container.addEventListener('touchstart', _onTouchStart.bind(this));
      this.container.addEventListener('touchmove', _onTouchMove.bind(this));
      this.container.addEventListener('touchend', _onTouchEnd.bind(this));
      this.background.addEventListener('click', this.close.bind(this));
    }

    _createClass(SidebarJS, [{
      key: 'toggle',
      value: function toggle() {
        this.component.classList.contains(CLASS_IS_VISIBLE) ? this.close() : this.open();
      }
    }, {
      key: 'open',
      value: function open() {
        this.component.classList.contains(CLASS_IS_VISIBLE) ? this.container.removeAttribute('style') : this.component.classList.add(CLASS_IS_VISIBLE);
      }
    }, {
      key: 'close',
      value: function close() {
        this.container.removeAttribute('style');
        this.background.removeAttribute('style');
        this.component.classList.remove(CLASS_IS_VISIBLE);
      }
    }]);

    return SidebarJS;
  }();

  function _onTouchStart(e) {
    this.container.touchStart = e.touches[0].pageX;
  }

  function _onTouchMove(e) {
    this.container.touchMove = this.container.touchStart - e.touches[0].pageX;
    if (this.container.touchMove > 0) {
      this.component.classList.add(CLASS_IS_MOVING);
      _vendorify(this.container, 'transform', 'translate(' + -this.container.touchMove + 'px, 0)');
      _updateOpacity.call(this);
    }
  }

  function _onTouchEnd() {
    this.component.classList.remove(CLASS_IS_MOVING);
    this.container.touchMove > this.container.clientWidth / 3.5 ? this.close() : this.open();
  }

  function _updateOpacity() {
    var opacity = 0.3 - this.container.touchMove / (this.container.clientWidth * 3.5);
    this.background.style.opacity = opacity.toString();
  }

  function _create(element) {
    var el = document.createElement('div');
    el.setAttribute(element, '');
    return el;
  }

  function _vendorify(el, prop, val) {
    var Prop = prop.charAt(0).toUpperCase() + prop.slice(1);
    var prefs = ['Moz', 'Webkit', 'O', 'ms'];
    el.style.prop = val;
    for (var i = 0; i < prefs.length; i++) {
      el.style[prefs[i] + Prop] = val;
    }
    return el;
  }

  return SidebarJS;
}(window, document);