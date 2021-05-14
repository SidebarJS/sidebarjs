/*
 * SidebarJS
 * Version 8.0.0
 * https://github.com/SidebarJS/sidebarjs#readme
 */

define(['exports'], function (exports) { 'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);

      if (enumerableOnly) {
        symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }

      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var SIDEBARJS = 'sidebarjs';
  var SIDEBARJS_FALLBACK_NAME = '';
  var SIDEBARJS_CONTENT = 'sidebarjs-content';
  var SIDEBARJS_TRANSITION_START = 'sidebarjs--transition-start';
  var SIDEBARJS_TRANSITION_END = 'sidebarjs--transition-end';
  var IS_VISIBLE = "".concat(SIDEBARJS, "--is-visible");
  var IS_MOVING = "".concat(SIDEBARJS, "--is-moving");
  var POSITIONS = ["left"
  /* Left */
  , "right"
  /* Right */
  ];
  var EVENT_LISTENER_OPTIONS = {
    passive: true
  };
  var TOUCH_START = 'touchstart';
  var TOUCH_MOVE = 'touchmove';
  var TOUCH_END = 'touchend';
  var ELEMENT_ACTIONS = ['toggle', 'open', 'close'];
  var DEFAULT_CONFIG = {
    documentMinSwipeX: 10,
    documentSwipeRange: 40,
    responsive: false,
    position: "left"
    /* Left */
    ,
    backdropOpacity: 0.3
  };
  function isStyleMapSupported() {
    return Boolean(window.CSS && window.CSS.number);
  }
  function create(element) {
    var el = document.createElement('div');
    el.setAttribute(element, '');
    return el;
  }
  function elemHasListener(elem, value) {
    return elem && typeof value === 'boolean' ? elem.sidebarjsListener = value : !!elem.sidebarjsListener;
  }
  function shouldDefineMainContent(mainContent) {
    if (mainContent) {
      mainContent.setAttribute(SIDEBARJS_CONTENT, '');
      return mainContent;
    } else {
      return document.querySelector("[".concat(SIDEBARJS_CONTENT, "]"));
    }
  }
  function forEachActionElement(sidebarName, func) {
    for (var i = 0; i < ELEMENT_ACTIONS.length; i++) {
      var action = ELEMENT_ACTIONS[i];
      var elements = document.querySelectorAll("[".concat(SIDEBARJS, "-").concat(action, "=\"").concat(sidebarName, "\"]"));

      for (var j = 0; j < elements.length; j++) {
        func(elements[j], action);
      }
    }
  }
  function targetElementIsBackdrop(e) {
    return e.target.hasAttribute("".concat(SIDEBARJS, "-backdrop"));
  }
  function shouldInvokeFunction(fn) {
    if (fn) {
      fn();
    }
  }

  var SidebarElement = /*#__PURE__*/function () {
    function SidebarElement() {
      var _this = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, SidebarElement);

      this.toggle = function () {
        _this.isVisible() ? _this.close() : _this.open();
      };

      this.open = function () {
        _this.addComponentClass(IS_VISIBLE);

        _this.setBackdropOpacity(_this.backdropOpacity);
      };

      this.close = function () {
        _this.removeComponentClass(IS_VISIBLE);

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
        _this.removeComponentClass(IS_MOVING);

        _this.clearStyle(_this.container);

        _this.clearStyle(_this.backdrop);

        _this.touchMoveSidebar > _this.container.clientWidth / 3.5 ? _this.close() : _this.open();
        _this.initialTouch = null;
        _this.touchMoveSidebar = null;
      };

      this._onSwipeOpenStart = function (e) {
        if (targetElementIsBackdrop(e)) {
          return;
        }

        var touchPositionX = e.touches[0].clientX;
        var documentTouch = _this.hasLeftPosition() ? touchPositionX : document.body.clientWidth - touchPositionX;

        if (documentTouch < _this.documentSwipeRange) {
          _this._onTouchStart(e);
        }
      };

      this._onSwipeOpenMove = function (e) {
        if (!targetElementIsBackdrop(e) && _this.initialTouch && !_this.isVisible()) {
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

      this._onTransitionStart = function () {
        var _this$getTransitionTy = _this.getTransitionType(),
            open = _this$getTransitionTy.open,
            close = _this$getTransitionTy.close;

        if (open || close) {
          _this.toggleTransitionClass(true);
        }
      };

      this._onTransitionEnd = function () {
        var _this$getTransitionTy2 = _this.getTransitionType(),
            open = _this$getTransitionTy2.open,
            close = _this$getTransitionTy2.close,
            isVisible = _this$getTransitionTy2.isVisible;

        if (open || close) {
          _this.toggleTransitionClass(false);
        }

        if (open) {
          _this._wasVisible = true;
          shouldInvokeFunction(_this._emitOnOpen);
        } else if (close) {
          _this._wasVisible = false;
          shouldInvokeFunction(_this._emitOnClose);
        }

        if (_this._emitOnChangeVisibility) {
          _this._emitOnChangeVisibility({
            isVisible: isVisible
          });
        }
      };

      this.nativeGestures = new Map([[TOUCH_START, this._onTouchStart], [TOUCH_MOVE, this._onTouchMove], [TOUCH_END, this._onTouchEnd]]);
      this.nativeOpenGestures = new Map([[TOUCH_START, this._onSwipeOpenStart], [TOUCH_MOVE, this._onSwipeOpenMove], [TOUCH_END, this._onSwipeOpenEnd]]);

      var config = _objectSpread2(_objectSpread2({}, DEFAULT_CONFIG), options);

      var hasCustomTransclude = config.container && config.backdrop;
      this.component = config.component || document.querySelector("[".concat(SIDEBARJS, "]"));
      this.container = hasCustomTransclude ? config.container : create("".concat(SIDEBARJS, "-container"));
      this.backdrop = hasCustomTransclude ? config.backdrop : create("".concat(SIDEBARJS, "-backdrop"));
      this.documentMinSwipeX = config.documentMinSwipeX;
      this.documentSwipeRange = config.documentSwipeRange;
      this.nativeSwipe = config.nativeSwipe !== false;
      this.nativeSwipeOpen = config.nativeSwipeOpen !== false;
      this.isStyleMapSupported = isStyleMapSupported();
      this.responsive = Boolean(config.responsive);
      this.mainContent = shouldDefineMainContent(config.mainContent);
      this.backdropOpacity = config.backdropOpacity;
      this.backdropOpacityRatio = 1 / config.backdropOpacity;
      this._emitOnOpen = config.onOpen;
      this._emitOnClose = config.onClose;
      this._emitOnChangeVisibility = config.onChangeVisibility;

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

      this.setPosition(config.position);
      this.addAttrsEventsListeners(this.component.getAttribute(SIDEBARJS));
      this.addTransitionListener();
      this.backdrop.addEventListener('click', this.close, EVENT_LISTENER_OPTIONS);
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
        this.container.removeEventListener('transitionstart', this._onTransitionStart);
        this.container.removeEventListener('transitionend', this._onTransitionEnd);
        this.backdrop.removeEventListener('click', this.close);
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

        this.addComponentClass(IS_MOVING);
        this.position = POSITIONS.indexOf(position) >= 0 ? position : "left"
        /* Left */
        ;
        var resetMainContent = (document.querySelectorAll("[".concat(SIDEBARJS, "]")) || []).length === 1;
        this.removeComponentClassPosition(resetMainContent);
        this.addComponentClass("".concat(SIDEBARJS, "--").concat(this.position));

        if (this.responsive && this.mainContent) {
          this.mainContent.classList.add("".concat(SIDEBARJS_CONTENT, "--").concat(this.position));
        }

        setTimeout(function () {
          return _this3.component && _this3.removeComponentClass(IS_MOVING);
        }, 200);
      }
    }, {
      key: "addAttrsEventsListeners",
      value: function addAttrsEventsListeners(sidebarName) {
        var _this4 = this;

        forEachActionElement(sidebarName, function (element, action) {
          if (!elemHasListener(element)) {
            element.addEventListener('click', _this4[action], EVENT_LISTENER_OPTIONS);
            elemHasListener(element, true);
          }
        });
      }
    }, {
      key: "removeAttrsEventsListeners",
      value: function removeAttrsEventsListeners(sidebarName) {
        var _this5 = this;

        forEachActionElement(sidebarName, function (element, action) {
          if (elemHasListener(element)) {
            element.removeEventListener('click', _this5[action]);
            elemHasListener(element, false);
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
      key: "getTransitionType",
      value: function getTransitionType() {
        var isVisible = this.isVisible();
        var open = isVisible && !this._wasVisible;
        var close = !isVisible && this._wasVisible;
        return {
          open: open,
          close: close,
          isVisible: isVisible
        };
      }
    }, {
      key: "toggleTransitionClass",
      value: function toggleTransitionClass(isStart) {
        this.toggleComponentClass(SIDEBARJS_TRANSITION_END, !isStart);
        this.toggleComponentClass(SIDEBARJS_TRANSITION_START, isStart);
      }
    }, {
      key: "addTransitionListener",
      value: function addTransitionListener() {
        this._wasVisible = this.isVisible();
        this.container.addEventListener('transitionstart', this._onTransitionStart, EVENT_LISTENER_OPTIONS);
        this.container.addEventListener('transitionend', this._onTransitionEnd, EVENT_LISTENER_OPTIONS);
      }
    }, {
      key: "removeComponentClassPosition",
      value: function removeComponentClassPosition(resetMainContent) {
        for (var i = 0; i < POSITIONS.length; i++) {
          this.removeComponentClass("".concat(SIDEBARJS, "--").concat(POSITIONS[i]));

          if (resetMainContent && this.mainContent) {
            this.mainContent.classList.remove("".concat(SIDEBARJS_CONTENT, "--").concat(POSITIONS[i]));
          }
        }
      }
    }, {
      key: "hasLeftPosition",
      value: function hasLeftPosition() {
        return this.position === "left"
        /* Left */
        ;
      }
    }, {
      key: "hasRightPosition",
      value: function hasRightPosition() {
        return this.position === "right"
        /* Right */
        ;
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
        var _this6 = this;

        this.nativeGestures.forEach(function (action, event) {
          _this6.component.addEventListener(event, action, EVENT_LISTENER_OPTIONS);
        });
      }
    }, {
      key: "removeNativeGestures",
      value: function removeNativeGestures() {
        var _this7 = this;

        this.nativeGestures.forEach(function (action, event) {
          _this7.component.removeEventListener(event, action);
        });
      }
    }, {
      key: "addNativeOpenGestures",
      value: function addNativeOpenGestures() {
        this.nativeOpenGestures.forEach(function (action, event) {
          document.addEventListener(event, action, EVENT_LISTENER_OPTIONS);
        });
      }
    }, {
      key: "removeNativeOpenGestures",
      value: function removeNativeOpenGestures() {
        this.nativeOpenGestures.forEach(function (action, event) {
          document.removeEventListener(event, action);
        });
      }
    }, {
      key: "moveSidebar",
      value: function moveSidebar(movement) {
        this.addComponentClass(IS_MOVING);
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
      key: "setResponsive",
      value: function setResponsive() {
        if (!this.responsive && this.mainContent) {
          throw new Error("You provide a [".concat(SIDEBARJS_CONTENT, "] element without set {responsive: true}"));
        }

        if (this.responsive && !this.mainContent) {
          throw new Error("You have set {responsive: true} without provide a [".concat(SIDEBARJS_CONTENT, "] element"));
        }

        this.addComponentClass('sidebarjs--responsive');
      }
    }, {
      key: "applyStyle",
      value: function applyStyle(el, prop, val, vendorify) {
        if (this.isStyleMapSupported) {
          el.attributeStyleMap.set(prop, val);
        } else {
          el.style[prop] = val;

          if (vendorify) {
            var vendor = 'webkit' + prop.charAt(0).toUpperCase() + prop.slice(1);
            el.style[vendor] = val;
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
    }, {
      key: "addComponentClass",
      value: function addComponentClass(className) {
        this.component.classList.add(className);
      }
    }, {
      key: "removeComponentClass",
      value: function removeComponentClass(className) {
        this.component.classList.remove(className);
      }
    }, {
      key: "toggleComponentClass",
      value: function toggleComponentClass(className, force) {
        this.component.classList.toggle(className, force);
      }
    }]);

    return SidebarElement;
  }();

  var SidebarService = /*#__PURE__*/function () {
    function SidebarService() {
      _classCallCheck(this, SidebarService);

      this.instances = {};
    }

    _createClass(SidebarService, [{
      key: "fallbackName",
      value: function fallbackName(sidebarName) {
        return sidebarName || SIDEBARJS_FALLBACK_NAME;
      }
    }, {
      key: "getInstance",
      value: function getInstance(sidebarName) {
        return this.instances[this.fallbackName(sidebarName)];
      }
    }, {
      key: "create",
      value: function create(options) {
        var _options$component;

        var name = this.fallbackName(options === null || options === void 0 ? void 0 : (_options$component = options.component) === null || _options$component === void 0 ? void 0 : _options$component.getAttribute(SIDEBARJS));
        this.instances[name] = new SidebarElement(options);
        return this.instances[name];
      }
    }, {
      key: "open",
      value: function open(sidebarName) {
        var _this$getInstance;

        (_this$getInstance = this.getInstance(sidebarName)) === null || _this$getInstance === void 0 ? void 0 : _this$getInstance.open();
      }
    }, {
      key: "close",
      value: function close(sidebarName) {
        var _this$getInstance2;

        (_this$getInstance2 = this.getInstance(sidebarName)) === null || _this$getInstance2 === void 0 ? void 0 : _this$getInstance2.close();
      }
    }, {
      key: "toggle",
      value: function toggle(sidebarName) {
        var _this$getInstance3;

        (_this$getInstance3 = this.getInstance(sidebarName)) === null || _this$getInstance3 === void 0 ? void 0 : _this$getInstance3.toggle();
      }
    }, {
      key: "isVisible",
      value: function isVisible(sidebarName) {
        var _this$getInstance4;

        return !!((_this$getInstance4 = this.getInstance(sidebarName)) !== null && _this$getInstance4 !== void 0 && _this$getInstance4.isVisible());
      }
    }, {
      key: "setPosition",
      value: function setPosition(position, sidebarName) {
        var _this$getInstance5;

        (_this$getInstance5 = this.getInstance(sidebarName)) === null || _this$getInstance5 === void 0 ? void 0 : _this$getInstance5.setPosition(position);
      }
    }, {
      key: "elemHasListener",
      value: function elemHasListener$1(elem, value) {
        return elemHasListener(elem, value);
      }
    }, {
      key: "destroy",
      value: function destroy(sidebarName) {
        var name = this.fallbackName(sidebarName);

        if (this.instances[name]) {
          this.instances[name].destroy();
          this.instances[name] = null;
          delete this.instances[name];
        }
      }
    }]);

    return SidebarService;
  }();

  exports.SidebarElement = SidebarElement;
  exports.SidebarService = SidebarService;

  Object.defineProperty(exports, '__esModule', { value: true });

});
