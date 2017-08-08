(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.SidebarJS = global.SidebarJS || {})));
}(this, (function (exports) { 'use strict';

function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var sidebarElement = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sidebarjs = 'sidebarjs';
var isVisible = sidebarjs + "--is-visible";
var isMoving = sidebarjs + "--is-moving";
var LEFT_POSITION = 'left';
var RIGHT_POSITION = 'right';
var TRANSITION_DURATION = 400;
var POSITIONS = [LEFT_POSITION, RIGHT_POSITION];
var SidebarElement = (function () {
    function SidebarElement(config) {
        if (config === void 0) { config = {}; }
        var component = config.component, container = config.container, background = config.background, _a = config.documentMinSwipeX, documentMinSwipeX = _a === void 0 ? 10 : _a, _b = config.documentSwipeRange, documentSwipeRange = _b === void 0 ? 40 : _b, nativeSwipe = config.nativeSwipe, nativeSwipeOpen = config.nativeSwipeOpen, _c = config.position, position = _c === void 0 ? 'left' : _c;
        this.component = component || document.querySelector("[" + sidebarjs + "]");
        this.container = container || SidebarElement.create(sidebarjs + "-container");
        this.background = background || SidebarElement.create(sidebarjs + "-background");
        this.documentMinSwipeX = documentMinSwipeX;
        this.documentSwipeRange = documentSwipeRange;
        this.nativeSwipe = nativeSwipe !== false;
        this.nativeSwipeOpen = nativeSwipeOpen !== false;
        var hasAllConfigDOMElements = component && container && background;
        if (!hasAllConfigDOMElements) {
            try {
                this.transcludeContent();
            }
            catch (e) {
                throw new Error('You must define an element with [sidebarjs] attribute');
            }
        }
        if (this.nativeSwipe) {
            this.addNativeGestures();
            if (this.nativeSwipeOpen) {
                this.addNativeOpenGestures();
            }
        }
        this.setPosition(position);
        this.addAttrsEventsListeners(this.component.getAttribute(sidebarjs));
        this.background.addEventListener('click', this.close.bind(this));
    }
    SidebarElement.prototype.toggle = function () {
        this.component.classList.contains(isVisible) ? this.close() : this.open();
    };
    SidebarElement.prototype.open = function () {
        this.component.classList.add(isVisible);
    };
    SidebarElement.prototype.close = function () {
        this.component.classList.remove(isVisible);
    };
    SidebarElement.prototype.isVisible = function () {
        return this.component.classList.contains(isVisible);
    };
    SidebarElement.prototype.setPosition = function (position) {
        var _this = this;
        this.component.classList.add(isMoving);
        this.position = POSITIONS.indexOf(position) >= 0 ? position : LEFT_POSITION;
        POSITIONS.forEach(function (POS) { return _this.component.classList.remove(sidebarjs + "--" + POS); });
        this.component.classList.add(sidebarjs + "--" + (this.hasRightPosition() ? RIGHT_POSITION : LEFT_POSITION));
        setTimeout(function () { return _this.component.classList.remove(isMoving); }, TRANSITION_DURATION);
    };
    SidebarElement.prototype.addAttrsEventsListeners = function (sidebarName) {
        var actions = ['toggle', 'open', 'close'];
        for (var i = 0; i < actions.length; i++) {
            var elements = document.querySelectorAll("[" + sidebarjs + "-" + actions[i] + "=\"" + sidebarName + "\"]");
            for (var j = 0; j < elements.length; j++) {
                if (!SidebarElement.elemHasListener(elements[j])) {
                    elements[j].addEventListener('click', this[actions[i]].bind(this));
                    SidebarElement.elemHasListener(elements[j], true);
                }
            }
        }
    };
    SidebarElement.prototype.hasLeftPosition = function () {
        return this.position === LEFT_POSITION;
    };
    SidebarElement.prototype.hasRightPosition = function () {
        return this.position === RIGHT_POSITION;
    };
    SidebarElement.prototype.transcludeContent = function () {
        this.container.innerHTML = this.component.innerHTML;
        this.component.innerHTML = '';
        this.component.appendChild(this.container);
        this.component.appendChild(this.background);
    };
    SidebarElement.prototype.addNativeGestures = function () {
        this.component.addEventListener('touchstart', this.onTouchStart.bind(this));
        this.component.addEventListener('touchmove', this.onTouchMove.bind(this));
        this.component.addEventListener('touchend', this.onTouchEnd.bind(this));
    };
    SidebarElement.prototype.addNativeOpenGestures = function () {
        document.addEventListener('touchstart', this.onSwipeOpenStart.bind(this));
        document.addEventListener('touchmove', this.onSwipeOpenMove.bind(this));
        document.addEventListener('touchend', this.onSwipeOpenEnd.bind(this));
    };
    SidebarElement.prototype.onTouchStart = function (e) {
        this.initialTouch = e.touches[0].pageX;
    };
    SidebarElement.prototype.onTouchMove = function (e) {
        var documentSwiped = this.initialTouch - e.touches[0].clientX;
        var sidebarMovement = this.getSidebarPosition(documentSwiped);
        this.touchMoveSidebar = -documentSwiped;
        if (sidebarMovement <= this.container.clientWidth) {
            this.moveSidebar(this.touchMoveSidebar);
        }
    };
    SidebarElement.prototype.onTouchEnd = function () {
        this.component.classList.remove(isMoving);
        Math.abs(this.touchMoveSidebar) > (this.container.clientWidth / 3.5) ? this.close() : this.open();
        this.container.removeAttribute('style');
        this.background.removeAttribute('style');
        delete this.initialTouch;
        delete this.touchMoveSidebar;
    };
    SidebarElement.prototype.moveSidebar = function (movement) {
        this.component.classList.add(isMoving);
        SidebarElement.vendorify(this.container, 'transform', "translate(" + movement + "px, 0)");
        this.changeBackgroundOpacity(movement);
    };
    SidebarElement.prototype.changeBackgroundOpacity = function (movement) {
        var opacity = 0.3 - (Math.abs(movement) / (this.container.clientWidth * 3.5));
        this.background.style.opacity = (opacity).toString();
    };
    SidebarElement.prototype.onSwipeOpenStart = function (e) {
        if (this.targetElementIsBackground(e)) {
            return;
        }
        var clientWidth = document.body.clientWidth;
        var touchPositionX = e.touches[0].clientX;
        var documentTouch = this.hasLeftPosition() ? touchPositionX : clientWidth - touchPositionX;
        if (documentTouch < this.documentSwipeRange) {
            this.onTouchStart(e);
        }
    };
    SidebarElement.prototype.onSwipeOpenMove = function (e) {
        if (!this.targetElementIsBackground(e) && this.initialTouch && !this.isVisible()) {
            var documentSwiped = e.touches[0].clientX - this.initialTouch;
            var sidebarMovement = this.getSidebarPosition(documentSwiped);
            if (sidebarMovement > 0) {
                SidebarElement.vendorify(this.component, 'transform', 'translate(0, 0)');
                SidebarElement.vendorify(this.component, 'transition', 'none');
                this.openMovement = sidebarMovement * (this.hasLeftPosition() ? -1 : 1);
                this.moveSidebar(this.openMovement);
            }
        }
    };
    SidebarElement.prototype.onSwipeOpenEnd = function () {
        if (this.openMovement) {
            delete this.openMovement;
            this.component.removeAttribute('style');
            this.onTouchEnd();
        }
    };
    SidebarElement.prototype.getSidebarPosition = function (swiped) {
        return (this.container.clientWidth - (this.hasLeftPosition() ? swiped : -swiped));
    };
    SidebarElement.prototype.targetElementIsBackground = function (e) {
        var touchedElement = e.target;
        return touchedElement.hasAttribute(sidebarjs + "-background");
    };
    SidebarElement.create = function (element) {
        var el = document.createElement('div');
        el.setAttribute(element, '');
        return el;
    };
    SidebarElement.vendorify = function (el, prop, val) {
        var Prop = prop.charAt(0).toUpperCase() + prop.slice(1);
        var prefs = ['Moz', 'Webkit', 'O', 'ms'];
        el.style[prop] = val;
        for (var i = 0; i < prefs.length; i++) {
            el.style[prefs[i] + Prop] = val;
        }
        return el;
    };
    SidebarElement.elemHasListener = function (elem, value) {
        return elem && (value === true || value === false) ? elem.sidebarjsListener = value : !!elem.sidebarjsListener;
    };
    Object.defineProperty(SidebarElement, "version", {
        get: function () {
            return '3.0.0';
        },
        enumerable: true,
        configurable: true
    });
    return SidebarElement;
}());
exports.SidebarElement = SidebarElement;

});

var sidebarService = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

var SidebarService = (function () {
    function SidebarService() {
        this.instances = {};
    }
    SidebarService.prototype.create = function (options) {
        if (options === void 0) { options = {}; }
        var name = options.component && options.component.getAttribute('sidebarjs') || '';
        this.instances[name] = new sidebarElement.SidebarElement(options);
        return this.instances[name];
    };
    SidebarService.prototype.open = function (sidebarName) {
        if (sidebarName === void 0) { sidebarName = ''; }
        if (this.instances[sidebarName]) {
            this.instances[sidebarName].open();
        }
    };
    SidebarService.prototype.close = function (sidebarName) {
        if (sidebarName === void 0) { sidebarName = ''; }
        if (this.instances[sidebarName]) {
            this.instances[sidebarName].close();
        }
    };
    SidebarService.prototype.toggle = function (sidebarName) {
        if (sidebarName === void 0) { sidebarName = ''; }
        if (this.instances[sidebarName]) {
            this.instances[sidebarName].toggle();
        }
    };
    SidebarService.prototype.isVisible = function (sidebarName) {
        if (sidebarName === void 0) { sidebarName = ''; }
        return !!this.instances[sidebarName] && this.instances[sidebarName].isVisible();
    };
    SidebarService.prototype.setPosition = function (position, sidebarName) {
        if (sidebarName === void 0) { sidebarName = ''; }
        if (this.instances[sidebarName]) {
            this.instances[sidebarName].setPosition(position);
        }
    };
    SidebarService.prototype.elemHasListener = function (elem, value) {
        return sidebarElement.SidebarElement.elemHasListener(elem, value);
    };
    SidebarService.prototype.destroy = function (sidebarName) {
        if (sidebarName === void 0) { sidebarName = ''; }
        if (this.instances[sidebarName]) {
            delete this.instances[sidebarName];
        }
    };
    return SidebarService;
}());
exports.SidebarService = SidebarService;

});

var index = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

exports.SidebarElement = sidebarElement.SidebarElement;

exports.SidebarService = sidebarService.SidebarService;

});

var index$1 = unwrapExports(index);
var index_1 = index.SidebarElement;
var index_2 = index.SidebarService;

exports['default'] = index$1;
exports.SidebarElement = index_1;
exports.SidebarService = index_2;

Object.defineProperty(exports, '__esModule', { value: true });

})));
