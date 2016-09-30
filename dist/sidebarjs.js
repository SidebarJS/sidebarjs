'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (sidebarjs) {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = sidebarjs;
  } else if (typeof define === 'function' && define.amd) {
    define([], function () {
      return sidebarjs;
    });
  } else {
    window.SidebarJS = sidebarjs;
  }
})(function () {
  var sidebarjs = 'sidebarjs';
  var isVisible = sidebarjs + '--is-visible';
  var isMoving = sidebarjs + '--is-moving';

  return function () {
    function SidebarJS() {
      _classCallCheck(this, SidebarJS);

      this.component = document.querySelector('[' + sidebarjs + ']');
      this.container = SidebarJS.create(sidebarjs + '-container');
      this.background = SidebarJS.create(sidebarjs + '-background');

      this.container.innerHTML = this.component.innerHTML;
      this.component.innerHTML = '';
      this.component.appendChild(this.container);
      this.component.appendChild(this.background);

      this.addAttributesEvents();
      this.component.addEventListener('touchstart', this.onTouchStart.bind(this));
      this.component.addEventListener('touchmove', this.onTouchMove.bind(this));
      this.component.addEventListener('touchend', this.onTouchEnd.bind(this));
      this.background.addEventListener('click', this.close.bind(this));
    }

    _createClass(SidebarJS, [{
      key: 'addAttributesEvents',
      value: function addAttributesEvents() {
        var _actions = ['toggle', 'open', 'close'];
        for (var i = 0; i < _actions.length; i++) {
          var _elements = document.querySelectorAll('[' + sidebarjs + '-' + _actions[i] + ']');
          for (var j = 0; j < _elements.length; j++) {
            if (!SidebarJS.elemHasListener(_elements[j])) {
              _elements[j].addEventListener('click', this[_actions[i]].bind(this));
              SidebarJS.elemHasListener(_elements[j], true);
            }
          }
        }
      }
    }, {
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
    }, {
      key: 'onTouchStart',
      value: function onTouchStart(e) {
        this.container.touchStart = e.touches[0].pageX;
      }
    }, {
      key: 'onTouchMove',
      value: function onTouchMove(e) {
        this.container.touchMove = this.container.touchStart - e.touches[0].pageX;
        if (this.container.touchMove > 0) {
          this.component.classList.add(isMoving);
          SidebarJS.vendorify(this.container, 'transform', 'translate(' + -this.container.touchMove + 'px, 0)');
          var opacity = 0.3 - this.container.touchMove / (this.container.clientWidth * 3.5);
          this.background.style.opacity = opacity.toString();
        }
      }
    }, {
      key: 'onTouchEnd',
      value: function onTouchEnd() {
        this.component.classList.remove(isMoving);
        this.container.touchMove > this.container.clientWidth / 3.5 ? this.close() : this.open();
        this.container.touchMove = 0;
        this.container.removeAttribute('style');
        this.background.removeAttribute('style');
      }
    }], [{
      key: 'create',
      value: function create(element) {
        var el = document.createElement('div');
        el.setAttribute(element, '');
        return el;
      }
    }, {
      key: 'vendorify',
      value: function vendorify(el, prop, val) {
        var Prop = prop.charAt(0).toUpperCase() + prop.slice(1);
        var prefs = ['Moz', 'Webkit', 'O', 'ms'];
        el.style[prop] = val;
        for (var i = 0; i < prefs.length; i++) {
          el.style[prefs[i] + Prop] = val;
        }
        return el;
      }
    }, {
      key: 'elemHasListener',
      value: function elemHasListener(elem, value) {
        return elem && value ? elem.sidebarjsListener = value : elem.sidebarjsListener;
      }
    }, {
      key: 'version',
      get: function get() {
        return '1.6.1';
      }
    }]);

    return SidebarJS;
  }();
}());