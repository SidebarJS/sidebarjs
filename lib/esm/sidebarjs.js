/*
 * SidebarJS
 * Version 6.1.0
 * https://github.com/SidebarJS/sidebarjs#readme
 */

const SIDEBARJS = 'sidebarjs';
const SIDEBARJS_CONTENT = 'sidebarjs-content';
const IS_VISIBLE = `${SIDEBARJS}--is-visible`;
const IS_MOVING = `${SIDEBARJS}--is-moving`;
const LEFT_POSITION = 'left';
const RIGHT_POSITION = 'right';
const POSITIONS = [LEFT_POSITION, RIGHT_POSITION];
class SidebarElement {
    constructor(config = {}) {
        this.toggle = () => {
            this.isVisible() ? this.close() : this.open();
        };
        this.open = () => {
            this.component.classList.add(IS_VISIBLE);
            this.setBackdropOpacity(this.backdropOpacity);
        };
        this.close = () => {
            this.component.classList.remove(IS_VISIBLE);
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
            this.component.classList.remove(IS_MOVING);
            this.clearStyle(this.container);
            this.clearStyle(this.backdrop);
            this.touchMoveSidebar > this.container.clientWidth / 3.5 ? this.close() : this.open();
            this.initialTouch = null;
            this.touchMoveSidebar = null;
        };
        this._onSwipeOpenStart = (e) => {
            if (this.targetElementIsBackdrop(e)) {
                return;
            }
            const touchPositionX = e.touches[0].clientX;
            const documentTouch = this.hasLeftPosition() ? touchPositionX : document.body.clientWidth - touchPositionX;
            if (documentTouch < this.documentSwipeRange) {
                this._onTouchStart(e);
            }
        };
        this._onSwipeOpenMove = (e) => {
            if (!this.targetElementIsBackdrop(e) && this.initialTouch && !this.isVisible()) {
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
        this._onTransitionEnd = () => {
            const isVisible = this.isVisible();
            if (isVisible && !this._wasVisible) {
                this._wasVisible = true;
                if (this._emitOnOpen) {
                    this._emitOnOpen();
                }
            }
            else if (!isVisible && this._wasVisible) {
                this._wasVisible = false;
                if (this._emitOnClose) {
                    this._emitOnClose();
                }
            }
            if (this._emitOnChangeVisibility) {
                this._emitOnChangeVisibility({ isVisible });
            }
        };
        const { component, container, backdrop, documentMinSwipeX = 10, documentSwipeRange = 40, nativeSwipe, nativeSwipeOpen, responsive = false, mainContent, position = 'left', backdropOpacity = 0.3, onOpen, onClose, onChangeVisibility, } = config;
        const hasCustomTransclude = container && backdrop;
        this.component = component || document.querySelector(`[${SIDEBARJS}]`);
        this.container = hasCustomTransclude ? container : SidebarElement.create(`${SIDEBARJS}-container`);
        this.backdrop = hasCustomTransclude ? backdrop : SidebarElement.create(`${SIDEBARJS}-backdrop`);
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
            }
            catch (e) {
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
        this.backdrop.addEventListener('click', this.close, { passive: true });
    }
    static isStyleMapSupported() {
        return Boolean(window.CSS && CSS.number);
    }
    static create(element) {
        const el = document.createElement('div');
        el.setAttribute(element, '');
        return el;
    }
    static elemHasListener(elem, value) {
        return elem && typeof value === 'boolean' ? (elem.sidebarjsListener = value) : !!elem.sidebarjsListener;
    }
    isVisible() {
        return this.component.classList.contains(IS_VISIBLE);
    }
    destroy() {
        this.removeNativeGestures();
        this.container.removeEventListener('transitionend', this._onTransitionEnd, { passive: true });
        this.backdrop.removeEventListener('click', this.close, { passive: true });
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
        this.component.classList.add(IS_MOVING);
        this.position = POSITIONS.indexOf(position) >= 0 ? position : LEFT_POSITION;
        const resetMainContent = (document.querySelectorAll(`[${SIDEBARJS}]`) || []).length === 1;
        this.removeComponentClassPosition(resetMainContent);
        this.component.classList.add(`${SIDEBARJS}--${this.position}`);
        if (this.responsive && this.mainContent) {
            this.mainContent.classList.add(`${SIDEBARJS_CONTENT}--${this.position}`);
        }
        setTimeout(() => this.component && this.component.classList.remove(IS_MOVING), 200);
    }
    addAttrsEventsListeners(sidebarName) {
        this.forEachActionElement(sidebarName, (element, action) => {
            if (!SidebarElement.elemHasListener(element)) {
                element.addEventListener('click', this[action], { passive: true });
                SidebarElement.elemHasListener(element, true);
            }
        });
    }
    removeAttrsEventsListeners(sidebarName) {
        this.forEachActionElement(sidebarName, (element, action) => {
            if (SidebarElement.elemHasListener(element)) {
                element.removeEventListener('click', this[action]);
                SidebarElement.elemHasListener(element, false);
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
    addTransitionListener() {
        this._wasVisible = this.isVisible();
        this.container.addEventListener('transitionend', this._onTransitionEnd, { passive: true });
    }
    forEachActionElement(sidebarName, func) {
        const actions = ['toggle', 'open', 'close'];
        for (let i = 0; i < actions.length; i++) {
            const elements = document.querySelectorAll(`[${SIDEBARJS}-${actions[i]}="${sidebarName}"]`);
            for (let j = 0; j < elements.length; j++) {
                func(elements[j], actions[i]);
            }
        }
    }
    removeComponentClassPosition(resetMainContent) {
        for (let i = 0; i < POSITIONS.length; i++) {
            this.component.classList.remove(`${SIDEBARJS}--${POSITIONS[i]}`);
            if (resetMainContent && this.mainContent) {
                this.mainContent.classList.remove(`${SIDEBARJS_CONTENT}--${POSITIONS[i]}`);
            }
        }
    }
    hasLeftPosition() {
        return this.position === LEFT_POSITION;
    }
    hasRightPosition() {
        return this.position === RIGHT_POSITION;
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
        this.component.addEventListener('touchstart', this._onTouchStart, { passive: true });
        this.component.addEventListener('touchmove', this._onTouchMove, { passive: true });
        this.component.addEventListener('touchend', this._onTouchEnd, { passive: true });
    }
    removeNativeGestures() {
        this.component.removeEventListener('touchstart', this._onTouchStart, { passive: true });
        this.component.removeEventListener('touchmove', this._onTouchMove, { passive: true });
        this.component.removeEventListener('touchend', this._onTouchEnd, { passive: true });
    }
    addNativeOpenGestures() {
        document.addEventListener('touchstart', this._onSwipeOpenStart, { passive: true });
        document.addEventListener('touchmove', this._onSwipeOpenMove, { passive: true });
        document.addEventListener('touchend', this._onSwipeOpenEnd, { passive: true });
    }
    removeNativeOpenGestures() {
        document.removeEventListener('touchstart', this._onSwipeOpenStart, { passive: true });
        document.removeEventListener('touchmove', this._onSwipeOpenMove, { passive: true });
        document.removeEventListener('touchend', this._onSwipeOpenEnd, { passive: true });
    }
    moveSidebar(movement) {
        this.component.classList.add(IS_MOVING);
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
    targetElementIsBackdrop(e) {
        return e.target.hasAttribute(`${SIDEBARJS}-backdrop`);
    }
    setResponsive() {
        if (!this.responsive && this.mainContent) {
            throw new Error(`You provide a [${SIDEBARJS_CONTENT}] element without set {responsive: true}`);
        }
        if (this.responsive && !this.mainContent) {
            throw new Error(`You have set {responsive: true} without provide a [${SIDEBARJS_CONTENT}] element`);
        }
        this.component.classList.add('sidebarjs--responsive');
    }
    shouldDefineMainContent(mainContent) {
        if (mainContent) {
            mainContent.setAttribute(SIDEBARJS_CONTENT, '');
            return mainContent;
        }
        else {
            return document.querySelector(`[${SIDEBARJS_CONTENT}]`);
        }
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
}

class SidebarService {
    constructor() {
        this.instances = {};
    }
    create(options = {}) {
        const name = (options.component && options.component.getAttribute('sidebarjs')) || '';
        this.instances[name] = new SidebarElement(options);
        return this.instances[name];
    }
    open(sidebarName = '') {
        if (this.instances[sidebarName]) {
            this.instances[sidebarName].open();
        }
    }
    close(sidebarName = '') {
        if (this.instances[sidebarName]) {
            this.instances[sidebarName].close();
        }
    }
    toggle(sidebarName = '') {
        if (this.instances[sidebarName]) {
            this.instances[sidebarName].toggle();
        }
    }
    isVisible(sidebarName = '') {
        return !!this.instances[sidebarName] && this.instances[sidebarName].isVisible();
    }
    setPosition(position, sidebarName = '') {
        if (this.instances[sidebarName]) {
            this.instances[sidebarName].setPosition(position);
        }
    }
    elemHasListener(elem, value) {
        return SidebarElement.elemHasListener(elem, value);
    }
    destroy(sidebarName = '') {
        if (this.instances[sidebarName]) {
            this.instances[sidebarName].destroy();
            this.instances[sidebarName] = null;
            delete this.instances[sidebarName];
        }
    }
}

export { SidebarElement, SidebarService };
