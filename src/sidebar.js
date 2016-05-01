/* jshint -W003  *//* jshint -W014  *//* jshint -W030  *//* jshint -W040 */

window.SidebarJS = (function(window, document) {
  'use strict';

  const IS_VISIBLE  = 'sidebarjs--is-visible';
  const IS_MOVING  = 'sidebarjs--is-moving';

  class SidebarJS {
    constructor(config) {
      this.$component = document.querySelector(config ? config.component : '.sidebarjs');
      this.$container = document.querySelector(config ? config.container : '.sidebarjs-container');
      this.$background = document.querySelector(config ? config.background : '.sidebarjs-background');
      this.$open = document.querySelector(config ? config.showElement : '.sidebarjs-open');

      this.$container.addEventListener('touchstart', _onTouchStart.bind(this));
      this.$container.addEventListener('touchmove', _onTouchMove.bind(this));
      this.$container.addEventListener('touchend', _onTouchEnd.bind(this));
      this.$background.addEventListener('click', this.close.bind(this));
      this.$open.addEventListener('click', this.open.bind(this));
    }

    open() {
      this.$component.classList.contains(IS_VISIBLE)
      ? this.$container.removeAttribute('style')
      : this.$component.classList.add(IS_VISIBLE);
    }

    close() {
      this.$container.removeAttribute('style');
      this.$component.classList.remove(IS_VISIBLE);
    }
  }

  function _onTouchStart(e) {
    this.$container.touchStart = e.touches[0].pageX;
  }

  function _onTouchMove(e) {
    this.$container.touchMove = this.$container.touchStart - e.touches[0].pageX;
    if(this.$container.touchMove > 0) {
      this.$component.classList.add(IS_MOVING);
      _vendorify(this.$container, `transform`, `translate(${-this.$container.touchMove}px, 0)`);
    }
  }

  function _onTouchEnd() {
    this.$component.classList.remove(IS_MOVING);
    this.$container.touchMove > (this.$container.clientWidth/3.5) ? this.close() : this.open();
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