(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.SidebarJS = factory());
}(this, (function () { 'use strict';

function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var sidebarjs_1 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sidebarjs = 'sidebarjs';
var isVisible = sidebarjs + "--is-visible";
var isMoving = sidebarjs + "--is-moving";
var SidebarJS = (function () {
    function SidebarJS(_a) {
        var _b = _a === void 0 ? {} : _a, component = _b.component, container = _b.container, background = _b.background, documentMinSwipeX = _b.documentMinSwipeX, documentSwipeRange = _b.documentSwipeRange, nativeSwipe = _b.nativeSwipe, nativeSwipeOpen = _b.nativeSwipeOpen;
        this.component = component || document.querySelector("[" + sidebarjs + "]");
        this.container = container || SidebarJS.create(sidebarjs + "-container");
        this.background = background || SidebarJS.create(sidebarjs + "-background");
        this.documentMinSwipeX = documentMinSwipeX || 10;
        this.documentSwipeRange = documentSwipeRange || 40;
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
        this.addAttrsEventsListeners();
        this.background.addEventListener('click', this.close.bind(this));
    }
    SidebarJS.prototype.toggle = function () {
        this.component.classList.contains(isVisible) ? this.close() : this.open();
    };
    SidebarJS.prototype.open = function () {
        this.component.classList.add(isVisible);
    };
    SidebarJS.prototype.close = function () {
        this.component.classList.remove(isVisible);
    };
    SidebarJS.prototype.isVisible = function () {
        return this.component.classList.contains(isVisible);
    };
    SidebarJS.prototype.addAttrsEventsListeners = function () {
        var actions = ['toggle', 'open', 'close'];
        for (var i = 0; i < actions.length; i++) {
            var elements = document.querySelectorAll("[" + sidebarjs + "-" + actions[i] + "]");
            for (var j = 0; j < elements.length; j++) {
                if (!SidebarJS.elemHasListener(elements[j])) {
                    elements[j].addEventListener('click', this[actions[i]].bind(this));
                    SidebarJS.elemHasListener(elements[j], true);
                }
            }
        }
    };
    SidebarJS.prototype.transcludeContent = function () {
        this.container.innerHTML = this.component.innerHTML;
        this.component.innerHTML = '';
        this.component.appendChild(this.container);
        this.component.appendChild(this.background);
    };
    SidebarJS.prototype.addNativeGestures = function () {
        this.component.addEventListener('touchstart', this.onTouchStart.bind(this));
        this.component.addEventListener('touchmove', this.onTouchMove.bind(this));
        this.component.addEventListener('touchend', this.onTouchEnd.bind(this));
    };
    SidebarJS.prototype.addNativeOpenGestures = function () {
        document.addEventListener('touchstart', this.onDocumentTouchStart.bind(this));
        document.addEventListener('touchmove', this.onDocumentTouchMove.bind(this));
        document.addEventListener('touchend', this.onDocumentTouchEnd.bind(this));
    };
    SidebarJS.prototype.onTouchStart = function (e) {
        this.initialTouch = e.touches[0].pageX;
    };
    SidebarJS.prototype.onTouchMove = function (e) {
        this.touchMoveSidebar = this.initialTouch - e.touches[0].pageX;
        if (this.touchMoveSidebar >= 0) {
            this.moveSidebar(-this.touchMoveSidebar);
        }
    };
    SidebarJS.prototype.onTouchEnd = function () {
        this.component.classList.remove(isMoving);
        this.touchMoveSidebar > (this.container.clientWidth / 3.5) ? this.close() : this.open();
        this.container.removeAttribute('style');
        this.background.removeAttribute('style');
        delete this.initialTouch;
        delete this.touchMoveSidebar;
    };
    SidebarJS.prototype.moveSidebar = function (movement) {
        this.component.classList.add(isMoving);
        SidebarJS.vendorify(this.container, 'transform', "translate(" + movement + "px, 0)");
        this.changeBackgroundOpacity(movement);
    };
    SidebarJS.prototype.changeBackgroundOpacity = function (movement) {
        var opacity = 0.3 - (-movement / (this.container.clientWidth * 3.5));
        this.background.style.opacity = (opacity).toString();
    };
    SidebarJS.prototype.onDocumentTouchStart = function (e) {
        var touchPositionX = e.touches[0].clientX;
        if (touchPositionX < this.documentSwipeRange) {
            this.onTouchStart(e);
        }
    };
    SidebarJS.prototype.onDocumentTouchMove = function (e) {
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
    };
    SidebarJS.prototype.onDocumentTouchEnd = function () {
        if (this.touchMoveDocument) {
            delete this.touchMoveDocument;
            this.component.removeAttribute('style');
            this.onTouchEnd();
        }
    };
    SidebarJS.create = function (element) {
        var el = document.createElement('div');
        el.setAttribute(element, '');
        return el;
    };
    SidebarJS.vendorify = function (el, prop, val) {
        var Prop = prop.charAt(0).toUpperCase() + prop.slice(1);
        var prefs = ['Moz', 'Webkit', 'O', 'ms'];
        el.style[prop] = val;
        for (var i = 0; i < prefs.length; i++) {
            el.style[prefs[i] + Prop] = val;
        }
        return el;
    };
    SidebarJS.elemHasListener = function (elem, value) {
        return elem && (value === true || value === false) ? elem.sidebarjsListener = value : !!elem.sidebarjsListener;
    };
    Object.defineProperty(SidebarJS, "version", {
        get: function () {
            return '1.8.1';
        },
        enumerable: true,
        configurable: true
    });
    return SidebarJS;
}());
exports.default = SidebarJS;

});

var sidebarjs = unwrapExports(sidebarjs_1);

return sidebarjs;

})));
