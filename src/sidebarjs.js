((function (sidebarjs) {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = sidebarjs;
  } else if (typeof define === 'function' && define.amd) {
    define([], () => sidebarjs);
  } else {
    window.SidebarJS = sidebarjs;
  }
})((function () {
  const sidebarjs = 'sidebarjs';
  const isVisible = `${sidebarjs}--is-visible`;
  const isMoving = `${sidebarjs}--is-moving`;

  return class SidebarJS {
    constructor({
      component,
      container,
      background,
      documentMinSwipeX = 10,
      documentSwipeRange = 40,
      nativeSwipe,
      nativeSwipeOpen,
    } = {}) {
      this.component = component || document.querySelector(`[${sidebarjs}]`);
      this.container = container || SidebarJS.create(`${sidebarjs}-container`);
      this.background = background || SidebarJS.create(`${sidebarjs}-background`);
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

    transcludeContent() {
      this.container.innerHTML = this.component.innerHTML;
      this.component.innerHTML = '';
      this.component.appendChild(this.container);
      this.component.appendChild(this.background);
    }

    addNativeGestures() {
      this.component.addEventListener('touchstart', this.onTouchStart.bind(this));
      this.component.addEventListener('touchmove', this.onTouchMove.bind(this));
      this.component.addEventListener('touchend', this.onTouchEnd.bind(this));
    }

    addNativeOpenGestures() {
      document.addEventListener('touchstart', this.onDocumentTouchStart.bind(this));
      document.addEventListener('touchmove', this.onDocumentTouchMove.bind(this));
      document.addEventListener('touchend', this.onDocumentTouchEnd.bind(this));
    }

    addAttrsEventsListeners() {
      const actions = ['toggle', 'open', 'close'];
      for (let i = 0; i < actions.length; i++) {
        const elements = document.querySelectorAll(`[${sidebarjs}-${actions[i]}]`);
        for (let j = 0; j < elements.length; j++) {
          if (!SidebarJS.elemHasListener(elements[j])) {
            elements[j].addEventListener('click', this[actions[i]].bind(this));
            SidebarJS.elemHasListener(elements[j], true);
          }
        }
      }
    }

    onDocumentTouchStart(e) {
      const touchPositionX = e.touches[0].clientX;
      if (touchPositionX < this.documentSwipeRange) {
        this.onTouchStart(e);
      }
    }

    onDocumentTouchMove(e) {
      if (this.initialTouch && !this.isVisible()) {
        const documentSwiped = e.touches[0].clientX - this.initialTouch;
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

    onDocumentTouchEnd() {
      if (this.touchMoveDocument) {
        delete this.touchMoveDocument;
        this.component.removeAttribute('style');
        this.onTouchEnd();
      }
    }

    toggle() {
      this.component.classList.contains(isVisible) ? this.close() : this.open();
    }

    open() {
      this.component.classList.add(isVisible);
    }

    close() {
      this.component.classList.remove(isVisible);
    }

    onTouchStart(e) {
      this.initialTouch = e.touches[0].pageX;
    }

    onTouchMove(e) {
      this.touchMoveSidebar = this.initialTouch - e.touches[0].pageX;
      if (this.touchMoveSidebar >= 0) {
        this.moveSidebar(-this.touchMoveSidebar);
      }
    }

    onTouchEnd() {
      this.component.classList.remove(isMoving);
      this.touchMoveSidebar > (this.container.clientWidth / 3.5) ? this.close() : this.open();
      this.container.removeAttribute('style');
      this.background.removeAttribute('style');
      delete this.initialTouch;
      delete this.touchMoveSidebar;
    }

    moveSidebar(movement) {
      this.component.classList.add(isMoving);
      SidebarJS.vendorify(this.container, 'transform', `translate(${movement}px, 0)`);
      this.changeBackgroundOpacity(movement);
    }

    changeBackgroundOpacity(movement) {
      const opacity = 0.3 - (-movement / (this.container.clientWidth * 3.5));
      this.background.style.opacity = (opacity).toString();
    }

    isVisible() {
      return this.component.classList.contains(isVisible);
    }

    static create(element) {
      const el = document.createElement('div');
      el.setAttribute(element, '');
      return el;
    }

    static vendorify(el, prop, val) {
      const Prop = prop.charAt(0).toUpperCase() + prop.slice(1);
      const prefs = ['Moz', 'Webkit', 'O', 'ms'];
      el.style[prop] = val;
      for (let i = 0; i < prefs.length; i++) {
        el.style[prefs[i] + Prop] = val;
      }
      return el;
    }

    static elemHasListener(elem, value) {
      return elem && value ? elem.sidebarjsListener = value : elem.sidebarjsListener;
    }

    static get version() {
      return '1.8.1';
    }
  };
})()));
