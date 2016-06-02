'use strict';

window.SidebarJS = (function(window, document) {
  const sidebarjs  = `sidebarjs`;
  const isVisible  = `${sidebarjs}--is-visible`;
  const isMoving   = `${sidebarjs}--is-moving`;

  return class SidebarJS {
    constructor() {
      this.component = document.querySelector(`[${sidebarjs}]`);
      this.container = _create(`${sidebarjs}-container`);
      this.background = _create(`${sidebarjs}-background`);

      this.container.innerHTML = this.component.innerHTML;
      this.component.innerHTML = '';
      this.component.appendChild(this.container);
      this.component.appendChild(this.background);

      const _actions = ['toggle', 'open', 'close'];
      for(let i = 0; i < _actions.length; i++) {
        let _elements = document.querySelectorAll(`[${sidebarjs}-${_actions[i]}]`);
        for(let j = 0; j < _elements.length; j++) {
          _elements[j].addEventListener('click', this[_actions[i]].bind(this));
        }
      }

      this.component.addEventListener('touchstart', _onTouchStart.bind(this));
      this.component.addEventListener('touchmove', _onTouchMove.bind(this));
      this.component.addEventListener('touchend', _onTouchEnd.bind(this));
      this.background.addEventListener('click', this.close.bind(this));
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
  };

  function _onTouchStart(e) {
    this.container.touchStart = e.touches[0].pageX;
  }

  function _onTouchMove(e) {
    this.container.touchMove = this.container.touchStart - e.touches[0].pageX;
    if(this.container.touchMove > 0) {
      this.component.classList.add(isMoving);
      _vendorify(this.container, `transform`, `translate(${-this.container.touchMove}px, 0)`);
      var opacity = 0.3 - this.container.touchMove/(this.container.clientWidth*3.5);
      this.background.style.opacity = (opacity).toString();
    }
  }

  function _onTouchEnd() {
    this.component.classList.remove(isMoving);
    this.container.touchMove > (this.container.clientWidth/3.5) ? this.close() : this.open();
    this.container.touchMove = 0;
    this.container.removeAttribute('style');
    this.background.removeAttribute('style');
  }

  function _create(element) {
    const el = document.createElement('div');
    el.setAttribute(element, '');
    return el;
  }

  function _vendorify(el, prop, val) {
    const Prop = prop.charAt(0).toUpperCase() + prop.slice(1);
    const prefs = ['Moz', 'Webkit', 'O', 'ms'];
    el.style[prop] = val;
    for(let i = 0; i < prefs.length; i++ ) {
      el.style[prefs[i] + Prop] = val;
    }
    return el;
  }

})(window, document);
