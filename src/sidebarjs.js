/* jshint -W003  *//* jshint -W014  *//* jshint -W030  *//* jshint -W040 */

window.SidebarJS = (function(window, document) {
  'use strict';

  const CLASS_IS_VISIBLE  = 'sidebarjs--is-visible';
  const CLASS_IS_MOVING  = 'sidebarjs--is-moving';

  class SidebarJS {
    constructor() {
      this.component = document.querySelector('[sidebarjs]');
      this.container = _create('sidebarjs-container');
      this.background = _create('sidebarjs-background');

      this.container.innerHTML = this.component.innerHTML;
      this.component.innerHTML = '';
      this.component.appendChild(this.container);
      this.component.appendChild(this.background);

      var _toggles = document.querySelectorAll('[sidebarjs-toggle]');
      for(var i = 0; i < _toggles.length; i++) {
        _toggles[i].addEventListener('click', this.toggle.bind(this));
      }

      this.component.addEventListener('touchstart', _onTouchStart.bind(this));
      this.component.addEventListener('touchmove', _onTouchMove.bind(this));
      this.component.addEventListener('touchend', _onTouchEnd.bind(this));
      this.background.addEventListener('click', this.close.bind(this));
    }

    toggle() {
      this.component.classList.contains(CLASS_IS_VISIBLE)
      ? this.close()
      : this.open();
    }

    open() {
      this.component.classList.add(CLASS_IS_VISIBLE);
    }

    close() {
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
      var opacity = 0.3 - this.container.touchMove/(this.container.clientWidth*3.5);
      this.background.style.opacity = (opacity).toString();
    }
  }

  function _onTouchEnd() {
    this.component.classList.remove(CLASS_IS_MOVING);
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
    el.style.prop = val;
    for(let i = 0; i < prefs.length; i++ ) {
      el.style[prefs[i] + Prop] = val;
    }
    return el;
  }

  return SidebarJS;

})(window, document);
