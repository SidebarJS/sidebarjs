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
    constructor(options = {}) {
      this.component = options.component || document.querySelector(`[${sidebarjs}]`);
      this.container = options.container || SidebarJS.create(`${sidebarjs}-container`);
      this.background = options.background || SidebarJS.create(`${sidebarjs}-background`);
      this.documentMinSwipeX = options.documentMinSwipeX || 10;
      this.documentSwipeRange = options.documentSwipeRange || 40;
      this.nativeSwipe = options.nativeSwipe !== false;
      this.nativeSwipeOpen = options.nativeSwipeOpen !== false;

      if (!options.component && !options.container && !options.background) {
        this.container.innerHTML = this.component.innerHTML;
        this.component.innerHTML = '';
        this.component.appendChild(this.container);
        this.component.appendChild(this.background);
      }

      if (this.nativeSwipe) {
        this.component.addEventListener('tuchstart', this.onTouchStart.bind(this));
        this.component.addEventListener('touchmove', this.onTouchMove.bind(this));
        this.component.addEventListener('touchend', this.onTouchEnd.bind(this));
        if (this.nativeSwipeOpen) {
          document.addEventListener('touchstart', this.onDocumentTouchStart.bind(this));
          document.addEventListener('touchmove', this.onDocumentTouchMove.bind(this));
          document.addEventListener('touchend', this.onDocumentTouchEnd.bind(this));
        }
      }

      this.addAttrsEventsListeners();
      this.background.addEventListener('click', this.close.bind(this));
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
      if (e.touches[0].clientX < this.documentSwipeRange) {
        this.initialDocumentTouchX = e.touches[0].clientX;
        this.onTouchStart(e);
      }
    }

    onDocumentTouchMove(e) {
      if (this.initialDocumentTouchX && !this.isVisible()) {
        const difference = e.touches[0].clientX - this.initialDocumentTouchX;
        if (difference > this.documentMinSwipeX) {
          this.movedDocumentTouchX = true;
          SidebarJS.vendorify(this.component, 'transform', 'translate(0, 0)');
          SidebarJS.vendorify(this.component, 'transition', 'none');
          this.onTouchMove(e);
        }
      }
    }

    onDocumentTouchEnd() {
      this.initialDocumentTouchX = 0;
      if (this.movedDocumentTouchX) {
        this.movedDocumentTouchX = 0;
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
      this.container.touchStart = e.touches[0].pageX;
    }

    onTouchMove(e) {
      this.container.touchMove = this.container.touchStart - e.touches[0].pageX;
      this.container.touchMoveDocument = e.touches[0].pageX - this.container.clientWidth;
      if (this.container.touchMove >= 0 || (this.movedDocumentTouchX && this.container.touchMoveDocument <= 0)) {
        this.component.classList.add(isMoving);
        const movement = this.movedDocumentTouchX ? this.container.touchMoveDocument : -this.container.touchMove;
        SidebarJS.vendorify(this.container, 'transform', `translate(${movement}px, 0)`);
        const opacity = 0.3 - (-movement / (this.container.clientWidth * 3.5));
        this.background.style.opacity = (opacity).toString();
      }
    }

    onTouchEnd() {
      this.component.classList.remove(isMoving);
      this.container.touchMove > (this.container.clientWidth / 3.5) ? this.close() : this.open();
      this.container.touchMove = 0;
      this.container.removeAttribute('style');
      this.background.removeAttribute('style');
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
      return '1.8.0';
    }
  };
})()));
