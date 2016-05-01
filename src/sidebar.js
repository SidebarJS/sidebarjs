/* jshint -W003  *//* jshint -W014  *//* jshint -W030  *//* jshint -W040 */

window.SidebarJS = (function(window, document) {
  'use strict';

  const CLASS_IS_VISIBLE  = 'sidebarjs--is-visible';
  const CLASS_IS_MOVING  = 'sidebarjs--is-moving';

  class SidebarJS {
    constructor() {
      this.component = document.querySelector('.sidebarjs');
      this.trigger = document.querySelector('.sidebarjs-trigger');
      this.container = _create('div', 'container');
      this.background = _create('div', 'background');

      this.container.innerHTML = this.component.innerHTML;
      this.component.innerHTML = '';
      this.component.appendChild(this.container);
      this.component.appendChild(this.background);

      this.container.addEventListener('touchstart', _onTouchStart.bind(this));
      this.container.addEventListener('touchmove', _onTouchMove.bind(this));
      this.container.addEventListener('touchend', _onTouchEnd.bind(this));
      this.background.addEventListener('click', this.close.bind(this));
      this.trigger.addEventListener('click', this.open.bind(this));
    }
    
    open() {
      this.component.classList.contains(CLASS_IS_VISIBLE)
      ? this.container.removeAttribute('style')
      : this.component.classList.add(CLASS_IS_VISIBLE);
    }

    close() {
      this.container.removeAttribute('style');
      this.component.classList.remove(CLASS_IS_VISIBLE);
    }
  }

  function _onTouchStart(e) {
    this.container.touchStart = e.touches[0].pageX;
  }

  function _onTouchMove(e) {
    this.container.touchMove = this.container.touchStart - e.touches[0].pageX;
    if(this.container.touchMove > 0) {
      this.component.classList.add(CLASS_IS_MOVING);
      _vendorify(this.container, `transform`, `translate(${-this.container.touchMove}px, 0)`);
    }
  }

  function _onTouchEnd() {
    this.component.classList.remove(CLASS_IS_MOVING);
    this.container.touchMove > (this.container.clientWidth/3.5) ? this.close() : this.open();
  }

  function _create(tag, element) {
    const el = document.createElement(tag);
    el.setAttribute('class', `sidebarjs-${element}`);
    return el;
  }

  function _vendorify(el, prop, val) {
    const Prop = prop.charAt(0).toUpperCase() + prop.slice(1);
    const prefs = ['Moz', 'Webkit', 'O', 'ms'];
    el.style.prop = val;
    for(let i = 0; i < prefs.length; i++ ) {
      el.style[prefs[i] + Prop] = val;
    }
    return el;
  }

  return SidebarJS;

})(window, document);
