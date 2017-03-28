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
  var _isVisible = sidebarjs + '--is-visible';
  var isMoving = sidebarjs + '--is-moving';

  return function () {
    function SidebarJS() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          component = _ref.component,
          container = _ref.container,
          background = _ref.background,
          _ref$documentMinSwipe = _ref.documentMinSwipeX,
          documentMinSwipeX = _ref$documentMinSwipe === undefined ? 10 : _ref$documentMinSwipe,
          _ref$documentSwipeRan = _ref.documentSwipeRange,
          documentSwipeRange = _ref$documentSwipeRan === undefined ? 40 : _ref$documentSwipeRan,
          nativeSwipe = _ref.nativeSwipe,
          nativeSwipeOpen = _ref.nativeSwipeOpen;

      _classCallCheck(this, SidebarJS);

      this.component = component || document.querySelector('[' + sidebarjs + ']');
      this.container = container || SidebarJS.create(sidebarjs + '-container');
      this.background = background || SidebarJS.create(sidebarjs + '-background');
      this.documentMinSwipeX = documentMinSwipeX;
      this.documentSwipeRange = documentSwipeRange;
      this.nativeSwipe = nativeSwipe !== false;
      this.nativeSwipeOpen = nativeSwipeOpen !== false;

      if (!component && !container && !background) {
        this.transcludeContent();
      }

      if (this.nativeSwipe) {
        this.addNativeGestures();
        if (this.nativeSwipeOpen) {
          this.addNativeOpenGestures();
        }
      }

      this.addAttrsEventsListeners();
      this.background.addEventListener('click', this.close.bind(this));
    }

    _createClass(SidebarJS, [{
      key: 'transcludeContent',
      value: function transcludeContent() {
        this.container.innerHTML = this.component.innerHTML;
        this.component.innerHTML = '';
        this.component.appendChild(this.container);
        this.component.appendChild(this.background);
      }
    }, {
      key: 'addNativeGestures',
      value: function addNativeGestures() {
        this.component.addEventListener('touchstart', this.onTouchStart.bind(this));
        this.component.addEventListener('touchmove', this.onTouchMove.bind(this));
        this.component.addEventListener('touchend', this.onTouchEnd.bind(this));
      }
    }, {
      key: 'addNativeOpenGestures',
      value: function addNativeOpenGestures() {
        document.addEventListener('touchstart', this.onDocumentTouchStart.bind(this));
        document.addEventListener('touchmove', this.onDocumentTouchMove.bind(this));
        document.addEventListener('touchend', this.onDocumentTouchEnd.bind(this));
      }
    }, {
      key: 'addAttrsEventsListeners',
      value: function addAttrsEventsListeners() {
        var actions = ['toggle', 'open', 'close'];
        for (var i = 0; i < actions.length; i++) {
          var elements = document.querySelectorAll('[' + sidebarjs + '-' + actions[i] + ']');
          for (var j = 0; j < elements.length; j++) {
            if (!SidebarJS.elemHasListener(elements[j])) {
              elements[j].addEventListener('click', this[actions[i]].bind(this));
              SidebarJS.elemHasListener(elements[j], true);
            }
          }
        }
      }
    }, {
      key: 'onDocumentTouchStart',
      value: function onDocumentTouchStart(e) {
        var touchPositionX = e.touches[0].clientX;
        if (touchPositionX < this.documentSwipeRange) {
          this.onTouchStart(e);
        }
      }
    }, {
      key: 'onDocumentTouchMove',
      value: function onDocumentTouchMove(e) {
        if (this.initialTouch && !this.isVisible()) {
          var documentSwiped = e.touches[0].clientX - this.initialTouch;
          if (documentSwiped > this.documentMinSwipeX) {
            this.touchMoveDocument = e.touches[0].pageX - this.container.clientWidth;
            SidebarJS.vendorify(this.component, 'transform', 'translate(0, 0)');
            SidebarJS.vendorify(this.component, 'transition', 'none');
            if (this.touchMoveDocument <= 0) {
              this.moveSidebar(this.touchMoveDocument);
            }
          }
        }
      }
    }, {
      key: 'onDocumentTouchEnd',
      value: function onDocumentTouchEnd() {
        if (this.touchMoveDocument) {
          delete this.touchMoveDocument;
          this.component.removeAttribute('style');
          this.onTouchEnd();
        }
      }
    }, {
      key: 'toggle',
      value: function toggle() {
        this.component.classList.contains(_isVisible) ? this.close() : this.open();
      }
    }, {
      key: 'open',
      value: function open() {
        this.component.classList.add(_isVisible);
      }
    }, {
      key: 'close',
      value: function close() {
        this.component.classList.remove(_isVisible);
      }
    }, {
      key: 'onTouchStart',
      value: function onTouchStart(e) {
        this.initialTouch = e.touches[0].pageX;
      }
    }, {
      key: 'onTouchMove',
      value: function onTouchMove(e) {
        this.touchMoveSidebar = this.initialTouch - e.touches[0].pageX;
        if (this.touchMoveSidebar >= 0) {
          this.moveSidebar(-this.touchMoveSidebar);
        }
      }
    }, {
      key: 'onTouchEnd',
      value: function onTouchEnd() {
        this.component.classList.remove(isMoving);
        this.touchMoveSidebar > this.container.clientWidth / 3.5 ? this.close() : this.open();
        this.container.removeAttribute('style');
        this.background.removeAttribute('style');
        delete this.initialTouch;
        delete this.touchMoveSidebar;
      }
    }, {
      key: 'moveSidebar',
      value: function moveSidebar(movement) {
        this.component.classList.add(isMoving);
        SidebarJS.vendorify(this.container, 'transform', 'translate(' + movement + 'px, 0)');
        this.changeBackgroundOpacity(movement);
      }
    }, {
      key: 'changeBackgroundOpacity',
      value: function changeBackgroundOpacity(movement) {
        var opacity = 0.3 - -movement / (this.container.clientWidth * 3.5);
        this.background.style.opacity = opacity.toString();
      }
    }, {
      key: 'isVisible',
      value: function isVisible() {
        return this.component.classList.contains(_isVisible);
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
        return '1.8.1';
      }
    }]);

    return SidebarJS;
  }();
}());