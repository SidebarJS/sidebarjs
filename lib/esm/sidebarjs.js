/*
 * SidebarJS
 * Version 7.0.0
 * https://github.com/SidebarJS/sidebarjs#readme
 */

const SIDEBARJS = 'sidebarjs';
const SIDEBARJS_FALLBACK_NAME = '';
const SIDEBARJS_CONTENT = 'sidebarjs-content';
const SIDEBARJS_TRANSITION_START = 'sidebarjs--transition-start';
const SIDEBARJS_TRANSITION_END = 'sidebarjs--transition-end';
const IS_VISIBLE = `${SIDEBARJS}--is-visible`;
const IS_MOVING = `${SIDEBARJS}--is-moving`;
const POSITIONS = ["left" /* Left */, "right" /* Right */];
const EVENT_LISTENER_OPTIONS = { passive: true };
const TOUCH_START = 'touchstart';
const TOUCH_MOVE = 'touchmove';
const TOUCH_END = 'touchend';
const DEFAULT_CONFIG = {
    documentMinSwipeX: 10,
    documentSwipeRange: 40,
    responsive: false,
    position: "left" /* Left */,
    backdropOpacity: 0.3,
};
function isStyleMapSupported() {
    return Boolean(window.CSS && window.CSS.number);
}
function create(element) {
    const el = document.createElement('div');
    el.setAttribute(element, '');
    return el;
}
function elemHasListener(elem, value) {
    return elem && typeof value === 'boolean' ? (elem.sidebarjsListener = value) : !!elem.sidebarjsListener;
}
function shouldDefineMainContent(mainContent) {
    if (mainContent) {
        mainContent.setAttribute(SIDEBARJS_CONTENT, '');
        return mainContent;
    }
    else {
        return document.querySelector(`[${SIDEBARJS_CONTENT}]`);
    }
}
function forEachActionElement(sidebarName, func) {
    const actions = ['toggle', 'open', 'close'];
    for (let i = 0; i < actions.length; i++) {
        const elements = document.querySelectorAll(`[${SIDEBARJS}-${actions[i]}="${sidebarName}"]`);
        for (let j = 0; j < elements.length; j++) {
            func(elements[j], actions[i]);
        }
    }
}
function targetElementIsBackdrop(e) {
    return e.target.hasAttribute(`${SIDEBARJS}-backdrop`);
}
function shouldInvokeFunction(fn) {
    if (fn) {
        fn();
    }
}

class SidebarElement {
    constructor(options = {}) {
        this.toggle = () => {
            this.isVisible() ? this.close() : this.open();
        };
        this.open = () => {
            this.addComponentClass(IS_VISIBLE);
            this.setBackdropOpacity(this.backdropOpacity);
        };
        this.close = () => {
            this.removeComponentClass(IS_VISIBLE);
            this.clearStyle(this.backdrop);
        };
        this._onTouchStart = (e) => {
            this.initialTouch = e.touches[0].pageX;
        };
        this._onTouchMove = (e) => {
            const swipeDirection = -(this.initialTouch - e.touches[0].clientX);
            const sidebarMovement = this.container.clientWidth + (this.hasLeftPosition() ? swipeDirection : -swipeDirection);
            if (sidebarMovement <= this.container.clientWidth) {
                this.touchMoveSidebar = Math.abs(swipeDirection);
                this.moveSidebar(swipeDirection);
            }
        };
        this._onTouchEnd = () => {
            this.removeComponentClass(IS_MOVING);
            this.clearStyle(this.container);
            this.clearStyle(this.backdrop);
            this.touchMoveSidebar > this.container.clientWidth / 3.5 ? this.close() : this.open();
            this.initialTouch = null;
            this.touchMoveSidebar = null;
        };
        this._onSwipeOpenStart = (e) => {
            if (targetElementIsBackdrop(e)) {
                return;
            }
            const touchPositionX = e.touches[0].clientX;
            const documentTouch = this.hasLeftPosition() ? touchPositionX : document.body.clientWidth - touchPositionX;
            if (documentTouch < this.documentSwipeRange) {
                this._onTouchStart(e);
            }
        };
        this._onSwipeOpenMove = (e) => {
            if (!targetElementIsBackdrop(e) && this.initialTouch && !this.isVisible()) {
                const documentSwiped = e.touches[0].clientX - this.initialTouch;
                const hasLeftPosition = this.hasLeftPosition();
                const swipeX = hasLeftPosition ? documentSwiped : -documentSwiped;
                const sidebarMovement = this.container.clientWidth - swipeX;
                if (sidebarMovement > 0 && swipeX >= this.documentMinSwipeX) {
                    this.openMovement = hasLeftPosition ? -sidebarMovement : sidebarMovement;
                    this.moveSidebar(this.openMovement);
                }
            }
        };
        this._onSwipeOpenEnd = () => {
            if (this.openMovement) {
                this.openMovement = null;
                this._onTouchEnd();
            }
        };
        this._onTransitionStart = () => {
            const { open, close } = this.getTransitionType();
            if (open || close) {
                this.toggleTransitionClass(true);
            }
        };
        this._onTransitionEnd = () => {
            const { open, close, isVisible } = this.getTransitionType();
            if (open || close) {
                this.toggleTransitionClass(false);
            }
            if (open) {
                this._wasVisible = true;
                shouldInvokeFunction(this._emitOnOpen);
            }
            else if (close) {
                this._wasVisible = false;
                shouldInvokeFunction(this._emitOnClose);
            }
            if (this._emitOnChangeVisibility) {
                this._emitOnChangeVisibility({ isVisible });
            }
        };
        this.nativeGestures = new Map([
            [TOUCH_START, this._onTouchStart],
            [TOUCH_MOVE, this._onTouchMove],
            [TOUCH_END, this._onTouchEnd],
        ]);
        this.nativeOpenGestures = new Map([
            [TOUCH_START, this._onSwipeOpenStart],
            [TOUCH_MOVE, this._onSwipeOpenMove],
            [TOUCH_END, this._onSwipeOpenEnd],
        ]);
        const config = { ...DEFAULT_CONFIG, ...options };
        const hasCustomTransclude = config.container && config.backdrop;
        this.component = config.component || document.querySelector(`[${SIDEBARJS}]`);
        this.container = hasCustomTransclude ? config.container : create(`${SIDEBARJS}-container`);
        this.backdrop = hasCustomTransclude ? config.backdrop : create(`${SIDEBARJS}-backdrop`);
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
            }
            catch (e) {
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
    isVisible() {
        return this.component.classList.contains(IS_VISIBLE);
    }
    destroy() {
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
        Object.keys(this).forEach((key) => (this[key] = null));
    }
    setPosition(position) {
        this.addComponentClass(IS_MOVING);
        this.position = POSITIONS.indexOf(position) >= 0 ? position : "left" /* Left */;
        const resetMainContent = (document.querySelectorAll(`[${SIDEBARJS}]`) || []).length === 1;
        this.removeComponentClassPosition(resetMainContent);
        this.addComponentClass(`${SIDEBARJS}--${this.position}`);
        if (this.responsive && this.mainContent) {
            this.mainContent.classList.add(`${SIDEBARJS_CONTENT}--${this.position}`);
        }
        setTimeout(() => this.component && this.removeComponentClass(IS_MOVING), 200);
    }
    addAttrsEventsListeners(sidebarName) {
        forEachActionElement(sidebarName, (element, action) => {
            if (!elemHasListener(element)) {
                element.addEventListener('click', this[action], EVENT_LISTENER_OPTIONS);
                elemHasListener(element, true);
            }
        });
    }
    removeAttrsEventsListeners(sidebarName) {
        forEachActionElement(sidebarName, (element, action) => {
            if (elemHasListener(element)) {
                element.removeEventListener('click', this[action]);
                elemHasListener(element, false);
            }
        });
    }
    setSwipeGestures(value) {
        if (typeof value !== 'boolean') {
            throw new Error(`You provided a ${typeof value} value but setSwipeGestures needs a boolean value.`);
        }
        if (this.nativeSwipe) {
            value ? this.addNativeGestures() : this.removeNativeGestures();
            if (this.nativeSwipeOpen) {
                value ? this.addNativeOpenGestures() : this.removeNativeOpenGestures();
            }
        }
    }
    getTransitionType() {
        const isVisible = this.isVisible();
        const open = isVisible && !this._wasVisible;
        const close = !isVisible && this._wasVisible;
        return { open, close, isVisible };
    }
    toggleTransitionClass(isStart) {
        this.toggleComponentClass(SIDEBARJS_TRANSITION_END, !isStart);
        this.toggleComponentClass(SIDEBARJS_TRANSITION_START, isStart);
    }
    addTransitionListener() {
        this._wasVisible = this.isVisible();
        this.container.addEventListener('transitionstart', this._onTransitionStart, EVENT_LISTENER_OPTIONS);
        this.container.addEventListener('transitionend', this._onTransitionEnd, EVENT_LISTENER_OPTIONS);
    }
    removeComponentClassPosition(resetMainContent) {
        for (let i = 0; i < POSITIONS.length; i++) {
            this.removeComponentClass(`${SIDEBARJS}--${POSITIONS[i]}`);
            if (resetMainContent && this.mainContent) {
                this.mainContent.classList.remove(`${SIDEBARJS_CONTENT}--${POSITIONS[i]}`);
            }
        }
    }
    hasLeftPosition() {
        return this.position === "left" /* Left */;
    }
    hasRightPosition() {
        return this.position === "right" /* Right */;
    }
    transcludeContent() {
        while (this.component.firstChild) {
            this.container.appendChild(this.component.firstChild);
        }
        while (this.component.firstChild) {
            this.component.removeChild(this.component.firstChild);
        }
        this.component.appendChild(this.container);
        this.component.appendChild(this.backdrop);
    }
    addNativeGestures() {
        this.nativeGestures.forEach((action, event) => {
            this.component.addEventListener(event, action, EVENT_LISTENER_OPTIONS);
        });
    }
    removeNativeGestures() {
        this.nativeGestures.forEach((action, event) => {
            this.component.removeEventListener(event, action);
        });
    }
    addNativeOpenGestures() {
        this.nativeOpenGestures.forEach((action, event) => {
            document.addEventListener(event, action, EVENT_LISTENER_OPTIONS);
        });
    }
    removeNativeOpenGestures() {
        this.nativeOpenGestures.forEach((action, event) => {
            document.removeEventListener(event, action);
        });
    }
    moveSidebar(movement) {
        this.addComponentClass(IS_MOVING);
        this.applyStyle(this.container, 'transform', `translate(${movement}px, 0)`, true);
        this.updateBackdropOpacity(movement);
    }
    updateBackdropOpacity(movement) {
        const swipeProgress = 1 - Math.abs(movement) / this.container.clientWidth;
        const opacity = swipeProgress / this.backdropOpacityRatio;
        this.setBackdropOpacity(opacity);
    }
    setBackdropOpacity(opacity) {
        this.applyStyle(this.backdrop, 'opacity', opacity.toString());
    }
    setResponsive() {
        if (!this.responsive && this.mainContent) {
            throw new Error(`You provide a [${SIDEBARJS_CONTENT}] element without set {responsive: true}`);
        }
        if (this.responsive && !this.mainContent) {
            throw new Error(`You have set {responsive: true} without provide a [${SIDEBARJS_CONTENT}] element`);
        }
        this.addComponentClass('sidebarjs--responsive');
    }
    applyStyle(el, prop, val, vendorify) {
        if (this.isStyleMapSupported) {
            el.attributeStyleMap.set(prop, val);
        }
        else {
            el.style[prop] = val;
            if (vendorify) {
                el.style['webkit' + prop.charAt(0).toUpperCase() + prop.slice(1)] = val;
            }
        }
    }
    clearStyle(el) {
        if (this.isStyleMapSupported) {
            el.attributeStyleMap.clear();
        }
        else {
            el.removeAttribute('style');
        }
    }
    addComponentClass(className) {
        this.component.classList.add(className);
    }
    removeComponentClass(className) {
        this.component.classList.remove(className);
    }
    toggleComponentClass(className, force) {
        this.component.classList.toggle(className, force);
    }
}

class SidebarService {
    constructor() {
        this.instances = {};
    }
    fallbackName(sidebarName) {
        return sidebarName || SIDEBARJS_FALLBACK_NAME;
    }
    getInstance(sidebarName) {
        return this.instances[this.fallbackName(sidebarName)];
    }
    create(options) {
        const name = this.fallbackName(options?.component?.getAttribute(SIDEBARJS));
        this.instances[name] = new SidebarElement(options);
        return this.instances[name];
    }
    open(sidebarName) {
        this.getInstance(sidebarName)?.open();
    }
    close(sidebarName) {
        this.getInstance(sidebarName)?.close();
    }
    toggle(sidebarName) {
        this.getInstance(sidebarName)?.toggle();
    }
    isVisible(sidebarName) {
        return !!this.getInstance(sidebarName)?.isVisible();
    }
    setPosition(position, sidebarName) {
        this.getInstance(sidebarName)?.setPosition(position);
    }
    elemHasListener(elem, value) {
        return elemHasListener(elem, value);
    }
    destroy(sidebarName) {
        const name = this.fallbackName(sidebarName);
        if (this.instances[name]) {
            this.instances[name].destroy();
            this.instances[name] = null;
            delete this.instances[name];
        }
    }
}

export { SidebarElement, SidebarService };
