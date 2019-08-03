/*
 * SidebarJS
 * Version 6.1.0
 * https://github.com/SidebarJS/sidebarjs#readme
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.SidebarJS = {}));
}(this, function (exports) { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var SIDEBARJS = 'sidebarjs';
  var SIDEBARJS_CONTENT = 'sidebarjs-content';
  var IS_VISIBLE = "".concat(SIDEBARJS, "--is-visible");
  var IS_MOVING = "".concat(SIDEBARJS, "--is-moving");
  var LEFT_POSITION = 'left';
  var RIGHT_POSITION = 'right';
  var POSITIONS = [LEFT_POSITION, RIGHT_POSITION];
  var SidebarElement =
  /*#__PURE__*/
  function () {
    function SidebarElement() {
      var _this = this;

      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, SidebarElement);

      this.toggle = function () {
        _this.isVisible() ? _this.close() : _this.open();
      };

      this.open = function () {
        _this.component.classList.add(IS_VISIBLE);

        _this.setBackdropOpacity(_this.backdropOpacity);
      };

      this.close = function () {
        _this.component.classList.remove(IS_VISIBLE);

        _this.clearStyle(_this.backdrop);
      };

      this._onTouchStart = function (e) {
        _this.initialTouch = e.touches[0].pageX;
      };

      this._onTouchMove = function (e) {
        var swipeDirection = -(_this.initialTouch - e.touches[0].clientX);
        var sidebarMovement = _this.container.clientWidth + (_this.hasLeftPosition() ? swipeDirection : -swipeDirection);

        if (sidebarMovement <= _this.container.clientWidth) {
          _this.touchMoveSidebar = Math.abs(swipeDirection);

          _this.moveSidebar(swipeDirection);
        }
      };

      this._onTouchEnd = function () {
        _this.component.classList.remove(IS_MOVING);

        _this.clearStyle(_this.container);

        _this.clearStyle(_this.backdrop);

        _this.touchMoveSidebar > _this.container.clientWidth / 3.5 ? _this.close() : _this.open();
        _this.initialTouch = null;
        _this.touchMoveSidebar = null;
      };

      this._onSwipeOpenStart = function (e) {
        if (_this.targetElementIsBackdrop(e)) {
          return;
        }

        var touchPositionX = e.touches[0].clientX;
        var documentTouch = _this.hasLeftPosition() ? touchPositionX : document.body.clientWidth - touchPositionX;

        if (documentTouch < _this.documentSwipeRange) {
          _this._onTouchStart(e);
        }
      };

      this._onSwipeOpenMove = function (e) {
        if (!_this.targetElementIsBackdrop(e) && _this.initialTouch && !_this.isVisible()) {
          var documentSwiped = e.touches[0].clientX - _this.initialTouch;

          var hasLeftPosition = _this.hasLeftPosition();

          var swipeX = hasLeftPosition ? documentSwiped : -documentSwiped;
          var sidebarMovement = _this.container.clientWidth - swipeX;

          if (sidebarMovement > 0 && swipeX >= _this.documentMinSwipeX) {
            _this.openMovement = hasLeftPosition ? -sidebarMovement : sidebarMovement;

            _this.moveSidebar(_this.openMovement);
          }
        }
      };

      this._onSwipeOpenEnd = function () {
        if (_this.openMovement) {
          _this.openMovement = null;

          _this._onTouchEnd();
        }
      };

      this._onTransitionEnd = function () {
        var isVisible = _this.isVisible();

        if (isVisible && !_this._wasVisible) {
          _this._wasVisible = true;

          if (_this._emitOnOpen) {
            _this._emitOnOpen();
          }
        } else if (!isVisible && _this._wasVisible) {
          _this._wasVisible = false;

          if (_this._emitOnClose) {
            _this._emitOnClose();
          }
        }

        if (_this._emitOnChangeVisibility) {
          _this._emitOnChangeVisibility({
            isVisible: isVisible
          });
        }
      };

      var component = config.component,
          container = config.container,
          backdrop = config.backdrop,
          _config$documentMinSw = config.documentMinSwipeX,
          documentMinSwipeX = _config$documentMinSw === void 0 ? 10 : _config$documentMinSw,
          _config$documentSwipe = config.documentSwipeRange,
          documentSwipeRange = _config$documentSwipe === void 0 ? 40 : _config$documentSwipe,
          nativeSwipe = config.nativeSwipe,
          nativeSwipeOpen = config.nativeSwipeOpen,
          _config$responsive = config.responsive,
          responsive = _config$responsive === void 0 ? false : _config$responsive,
          mainContent = config.mainContent,
          _config$position = config.position,
          position = _config$position === void 0 ? 'left' : _config$position,
          _config$backdropOpaci = config.backdropOpacity,
          backdropOpacity = _config$backdropOpaci === void 0 ? 0.3 : _config$backdropOpaci,
          onOpen = config.onOpen,
          onClose = config.onClose,
          onChangeVisibility = config.onChangeVisibility;
      var hasCustomTransclude = container && backdrop;
      this.component = component || document.querySelector("[".concat(SIDEBARJS, "]"));
      this.container = hasCustomTransclude ? container : SidebarElement.create("".concat(SIDEBARJS, "-container"));
      this.backdrop = hasCustomTransclude ? backdrop : SidebarElement.create("".concat(SIDEBARJS, "-backdrop"));
      this.documentMinSwipeX = documentMinSwipeX;
      this.documentSwipeRange = documentSwipeRange;
      this.nativeSwipe = nativeSwipe !== false;
      this.nativeSwipeOpen = nativeSwipeOpen !== false;
      this.isStyleMapSupported = SidebarElement.isStyleMapSupported();
      this.responsive = Boolean(responsive);
      this.mainContent = this.shouldDefineMainContent(mainContent);
      this.backdropOpacity = backdropOpacity;
      this.backdropOpacityRatio = 1 / backdropOpacity;
      this._emitOnOpen = onOpen;
      this._emitOnClose = onClose;
      this._emitOnChangeVisibility = onChangeVisibility;

      if (!hasCustomTransclude) {
        try {
          this.transcludeContent();
        } catch (e) {
          throw new Error('You must define an element with [sidebarjs] attribute');
        }
      }

      this.setSwipeGestures(true);

      if (this.responsive || this.mainContent) {
        this.setResponsive();
      }

      this.setPosition(position);
      this.addAttrsEventsListeners(this.component.getAttribute(SIDEBARJS));
      this.addTransitionListener();
      this.backdrop.addEventListener('click', this.close, {
        passive: true
      });
    }

    _createClass(SidebarElement, [{
      key: "isVisible",
      value: function isVisible() {
        return this.component.classList.contains(IS_VISIBLE);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        var _this2 = this;

        this.removeNativeGestures();
        this.container.removeEventListener('transitionend', this._onTransitionEnd, {
          passive: true
        });
        this.backdrop.removeEventListener('click', this.close, {
          passive: true
        });
        this.removeNativeOpenGestures();
        this.removeAttrsEventsListeners(this.component.getAttribute(SIDEBARJS));
        this.removeComponentClassPosition();

        while (this.container.firstElementChild) {
          this.component.appendChild(this.container.firstElementChild);
        }

        this.component.removeChild(this.container);
        this.component.removeChild(this.backdrop);
        Object.keys(this).forEach(function (key) {
          return _this2[key] = null;
        });
      }
    }, {
      key: "setPosition",
      value: function setPosition(position) {
        var _this3 = this;

        this.component.classList.add(IS_MOVING);
        this.position = POSITIONS.indexOf(position) >= 0 ? position : LEFT_POSITION;
        var resetMainContent = (document.querySelectorAll("[".concat(SIDEBARJS, "]")) || []).length === 1;
        this.removeComponentClassPosition(resetMainContent);
        this.component.classList.add("".concat(SIDEBARJS, "--").concat(this.position));

        if (this.responsive && this.mainContent) {
          this.mainContent.classList.add("".concat(SIDEBARJS_CONTENT, "--").concat(this.position));
        }

        setTimeout(function () {
          return _this3.component && _this3.component.classList.remove(IS_MOVING);
        }, 200);
      }
    }, {
      key: "addAttrsEventsListeners",
      value: function addAttrsEventsListeners(sidebarName) {
        var _this4 = this;

        this.forEachActionElement(sidebarName, function (element, action) {
          if (!SidebarElement.elemHasListener(element)) {
            element.addEventListener('click', _this4[action], {
              passive: true
            });
            SidebarElement.elemHasListener(element, true);
          }
        });
      }
    }, {
      key: "removeAttrsEventsListeners",
      value: function removeAttrsEventsListeners(sidebarName) {
        var _this5 = this;

        this.forEachActionElement(sidebarName, function (element, action) {
          if (SidebarElement.elemHasListener(element)) {
            element.removeEventListener('click', _this5[action]);
            SidebarElement.elemHasListener(element, false);
          }
        });
      }
    }, {
      key: "setSwipeGestures",
      value: function setSwipeGestures(value) {
        if (typeof value !== 'boolean') {
          throw new Error("You provided a ".concat(_typeof(value), " value but setSwipeGestures needs a boolean value."));
        }

        if (this.nativeSwipe) {
          value ? this.addNativeGestures() : this.removeNativeGestures();

          if (this.nativeSwipeOpen) {
            value ? this.addNativeOpenGestures() : this.removeNativeOpenGestures();
          }
        }
      }
    }, {
      key: "addTransitionListener",
      value: function addTransitionListener() {
        this._wasVisible = this.isVisible();
        this.container.addEventListener('transitionend', this._onTransitionEnd, {
          passive: true
        });
      }
    }, {
      key: "forEachActionElement",
      value: function forEachActionElement(sidebarName, func) {
        var actions = ['toggle', 'open', 'close'];

        for (var i = 0; i < actions.length; i++) {
          var elements = document.querySelectorAll("[".concat(SIDEBARJS, "-").concat(actions[i], "=\"").concat(sidebarName, "\"]"));

          for (var j = 0; j < elements.length; j++) {
            func(elements[j], actions[i]);
          }
        }
      }
    }, {
      key: "removeComponentClassPosition",
      value: function removeComponentClassPosition(resetMainContent) {
        for (var i = 0; i < POSITIONS.length; i++) {
          this.component.classList.remove("".concat(SIDEBARJS, "--").concat(POSITIONS[i]));

          if (resetMainContent && this.mainContent) {
            this.mainContent.classList.remove("".concat(SIDEBARJS_CONTENT, "--").concat(POSITIONS[i]));
          }
        }
      }
    }, {
      key: "hasLeftPosition",
      value: function hasLeftPosition() {
        return this.position === LEFT_POSITION;
      }
    }, {
      key: "hasRightPosition",
      value: function hasRightPosition() {
        return this.position === RIGHT_POSITION;
      }
    }, {
      key: "transcludeContent",
      value: function transcludeContent() {
        while (this.component.firstChild) {
          this.container.appendChild(this.component.firstChild);
        }

        while (this.component.firstChild) {
          this.component.removeChild(this.component.firstChild);
        }

        this.component.appendChild(this.container);
        this.component.appendChild(this.backdrop);
      }
    }, {
      key: "addNativeGestures",
      value: function addNativeGestures() {
        this.component.addEventListener('touchstart', this._onTouchStart, {
          passive: true
        });
        this.component.addEventListener('touchmove', this._onTouchMove, {
          passive: true
        });
        this.component.addEventListener('touchend', this._onTouchEnd, {
          passive: true
        });
      }
    }, {
      key: "removeNativeGestures",
      value: function removeNativeGestures() {
        this.component.removeEventListener('touchstart', this._onTouchStart, {
          passive: true
        });
        this.component.removeEventListener('touchmove', this._onTouchMove, {
          passive: true
        });
        this.component.removeEventListener('touchend', this._onTouchEnd, {
          passive: true
        });
      }
    }, {
      key: "addNativeOpenGestures",
      value: function addNativeOpenGestures() {
        document.addEventListener('touchstart', this._onSwipeOpenStart, {
          passive: true
        });
        document.addEventListener('touchmove', this._onSwipeOpenMove, {
          passive: true
        });
        document.addEventListener('touchend', this._onSwipeOpenEnd, {
          passive: true
        });
      }
    }, {
      key: "removeNativeOpenGestures",
      value: function removeNativeOpenGestures() {
        document.removeEventListener('touchstart', this._onSwipeOpenStart, {
          passive: true
        });
        document.removeEventListener('touchmove', this._onSwipeOpenMove, {
          passive: true
        });
        document.removeEventListener('touchend', this._onSwipeOpenEnd, {
          passive: true
        });
      }
    }, {
      key: "moveSidebar",
      value: function moveSidebar(movement) {
        this.component.classList.add(IS_MOVING);
        this.applyStyle(this.container, 'transform', "translate(".concat(movement, "px, 0)"), true);
        this.updateBackdropOpacity(movement);
      }
    }, {
      key: "updateBackdropOpacity",
      value: function updateBackdropOpacity(movement) {
        var swipeProgress = 1 - Math.abs(movement) / this.container.clientWidth;
        var opacity = swipeProgress / this.backdropOpacityRatio;
        this.setBackdropOpacity(opacity);
      }
    }, {
      key: "setBackdropOpacity",
      value: function setBackdropOpacity(opacity) {
        this.applyStyle(this.backdrop, 'opacity', opacity.toString());
      }
    }, {
      key: "targetElementIsBackdrop",
      value: function targetElementIsBackdrop(e) {
        return e.target.hasAttribute("".concat(SIDEBARJS, "-backdrop"));
      }
    }, {
      key: "setResponsive",
      value: function setResponsive() {
        if (!this.responsive && this.mainContent) {
          throw new Error("You provide a [".concat(SIDEBARJS_CONTENT, "] element without set {responsive: true}"));
        }

        if (this.responsive && !this.mainContent) {
          throw new Error("You have set {responsive: true} without provide a [".concat(SIDEBARJS_CONTENT, "] element"));
        }

        this.component.classList.add('sidebarjs--responsive');
      }
    }, {
      key: "shouldDefineMainContent",
      value: function shouldDefineMainContent(mainContent) {
        if (mainContent) {
          mainContent.setAttribute(SIDEBARJS_CONTENT, '');
          return mainContent;
        } else {
          return document.querySelector("[".concat(SIDEBARJS_CONTENT, "]"));
        }
      }
    }, {
      key: "applyStyle",
      value: function applyStyle(el, prop, val, vendorify) {
        if (this.isStyleMapSupported) {
          el.attributeStyleMap.set(prop, val);
        } else {
          el.style[prop] = val;

          if (vendorify) {
            el.style['webkit' + prop.charAt(0).toUpperCase() + prop.slice(1)] = val;
          }
        }
      }
    }, {
      key: "clearStyle",
      value: function clearStyle(el) {
        if (this.isStyleMapSupported) {
          el.attributeStyleMap.clear();
        } else {
          el.removeAttribute('style');
        }
      }
    }], [{
      key: "isStyleMapSupported",
      value: function isStyleMapSupported() {
        return Boolean(window.CSS && CSS.number);
      }
    }, {
      key: "create",
      value: function create(element) {
        var el = document.createElement('div');
        el.setAttribute(element, '');
        return el;
      }
    }, {
      key: "elemHasListener",
      value: function elemHasListener(elem, value) {
        return elem && typeof value === 'boolean' ? elem.sidebarjsListener = value : !!elem.sidebarjsListener;
      }
    }]);

    return SidebarElement;
  }();

  var SidebarService =
  /*#__PURE__*/
  function () {
    function SidebarService() {
      _classCallCheck(this, SidebarService);

      this.instances = {};
    }

    _createClass(SidebarService, [{
      key: "create",
      value: function create() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var name = options.component && options.component.getAttribute('sidebarjs') || '';
        this.instances[name] = new SidebarElement(options);
        return this.instances[name];
      }
    }, {
      key: "open",
      value: function open() {
        var sidebarName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        if (this.instances[sidebarName]) {
          this.instances[sidebarName].open();
        }
      }
    }, {
      key: "close",
      value: function close() {
        var sidebarName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        if (this.instances[sidebarName]) {
          this.instances[sidebarName].close();
        }
      }
    }, {
      key: "toggle",
      value: function toggle() {
        var sidebarName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        if (this.instances[sidebarName]) {
          this.instances[sidebarName].toggle();
        }
      }
    }, {
      key: "isVisible",
      value: function isVisible() {
        var sidebarName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        return !!this.instances[sidebarName] && this.instances[sidebarName].isVisible();
      }
    }, {
      key: "setPosition",
      value: function setPosition(position) {
        var sidebarName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

        if (this.instances[sidebarName]) {
          this.instances[sidebarName].setPosition(position);
        }
      }
    }, {
      key: "elemHasListener",
      value: function elemHasListener(elem, value) {
        return SidebarElement.elemHasListener(elem, value);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        var sidebarName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        if (this.instances[sidebarName]) {
          this.instances[sidebarName].destroy();
          this.instances[sidebarName] = null;
          delete this.instances[sidebarName];
        }
      }
    }]);

    return SidebarService;
  }();

  exports.SidebarElement = SidebarElement;
  exports.SidebarService = SidebarService;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
