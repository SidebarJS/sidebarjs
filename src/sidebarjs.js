'use strict';

(function(sidebarjs){
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = sidebarjs;
  } else if (typeof define === 'function' && define.amd) {
    define([], () => sidebarjs);
  } else {
    window.SidebarJS = sidebarjs;
  }
})((function() {
  const sidebarjs  = `sidebarjs`;
  const isVisible  = `${sidebarjs}--is-visible`;
  const isMoving   = `${sidebarjs}--is-moving`;

  return class SidebarJS {
    constructor() {
      this.component = document.querySelector(`[${sidebarjs}]`);
      this.container = SidebarJS.create(`${sidebarjs}-container`);
      this.background = SidebarJS.create(`${sidebarjs}-background`);

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

    addAttributesEvents() {
      const _actions = ['toggle', 'open', 'close'];
      for(let i = 0; i < _actions.length; i++) {
        let _elements = document.querySelectorAll(`[${sidebarjs}-${_actions[i]}]`);
        for(let j = 0; j < _elements.length; j++) {
          if(!SidebarJS.elemHasListener(_elements[j])) {
            _elements[j].addEventListener('click', this[_actions[i]].bind(this));
            SidebarJS.elemHasListener(_elements[j], true);
          }
        }
      }
    }

    toggle() {
      this.component.classList.contains(isVisible)
      ? this.close()
      : this.open();
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
      if(this.container.touchMove > 0) {
        this.component.classList.add(isMoving);
        SidebarJS.vendorify(this.container, `transform`, `translate(${-this.container.touchMove}px, 0)`);
        let opacity = 0.3 - this.container.touchMove/(this.container.clientWidth*3.5);
        this.background.style.opacity = (opacity).toString();
      }
    }

    onTouchEnd() {
      this.component.classList.remove(isMoving);
      this.container.touchMove > (this.container.clientWidth/3.5) ? this.close() : this.open();
      this.container.touchMove = 0;
      this.container.removeAttribute('style');
      this.background.removeAttribute('style');
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
      for(let i = 0; i < prefs.length; i++ ) {
        el.style[prefs[i] + Prop] = val;
      }
      return el;
    }

    static elemHasListener(elem, value) {
      return elem && value ? elem.sidebarjsListener = value : elem.sidebarjsListener;
    }

    static get version() {
      return '1.5.0';
    }
  };
})());
