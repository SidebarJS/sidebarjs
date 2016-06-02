'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.SidebarJS = function (window, document) {
  var sidebarjs = 'sidebarjs';
  var isVisible = sidebarjs + '--is-visible';
  var isMoving = sidebarjs + '--is-moving';

  return function () {
    function SidebarJS() {
      _classCallCheck(this, SidebarJS);

      this.component = document.querySelector('[' + sidebarjs + ']');
      this.container = _create(sidebarjs + '-container');
      this.background = _create(sidebarjs + '-background');

      this.container.innerHTML = this.component.innerHTML;
      this.component.innerHTML = '';
      this.component.appendChild(this.container);
      this.component.appendChild(this.background);

      var _actions = ['toggle', 'open', 'close'];
      for (var i = 0; i < _actions.length; i++) {
        var _elements = document.querySelectorAll('[' + sidebarjs + '-' + _actions[i] + ']');
        for (var j = 0; j < _elements.length; j++) {
          _elements[j].addEventListener('click', this[_actions[i]].bind(this));
        }
      }

      this.component.addEventListener('touchstart', _onTouchStart.bind(this));
      this.component.addEventListener('touchmove', _onTouchMove.bind(this));
      this.component.addEventListener('touchend', _onTouchEnd.bind(this));
      this.background.addEventListener('click', this.close.bind(this));
    }

    _createClass(SidebarJS, [{
      key: 'toggle',
      value: function toggle() {
        this.component.classList.contains(isVisible) ? this.close() : this.open();
      }
    }, {
      key: 'open',
      value: function open() {
        this.component.classList.add(isVisible);
      }
    }, {
      key: 'close',
      value: function close() {
        this.component.classList.remove(isVisible);
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
      this.component.classList.add(isMoving);
      _vendorify(this.container, 'transform', 'translate(' + -this.container.touchMove + 'px, 0)');
      var opacity = 0.3 - this.container.touchMove / (this.container.clientWidth * 3.5);
      this.background.style.opacity = opacity.toString();
    }
  }

  function _onTouchEnd() {
    this.component.classList.remove(isMoving);
    this.container.touchMove > this.container.clientWidth / 3.5 ? this.close() : this.open();
    this.container.touchMove = 0;
    this.container.removeAttribute('style');
    this.background.removeAttribute('style');
  }

  function _create(element) {
    var el = document.createElement('div');
    el.setAttribute(element, '');
    return el;
  }

  function _vendorify(el, prop, val) {
    var Prop = prop.charAt(0).toUpperCase() + prop.slice(1);
    var prefs = ['Moz', 'Webkit', 'O', 'ms'];
    el.style[prop] = val;
    for (var i = 0; i < prefs.length; i++) {
      el.style[prefs[i] + Prop] = val;
    }
    return el;
  }
}(window, document);