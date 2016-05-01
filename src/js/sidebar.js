/* jshint -W003  *//* jshint -W030  *//* jshint -W040 */

window.Sidebar = (function(window, document) {
  'use strict';

  const IS_VISIBLE = 'is-visible';
  const TRANSITION = 'transition: all';
  const TRANSLATE = 'transform: translate';

  class Sidebar {
    constructor(config) {
      this.$component = document.querySelector(config ? config.component : '.js-sidebar');
      this.$container = document.querySelector(config ? config.container : '.js-sidebar--container');
      this.$background = document.querySelector(config ? config.background : '.js-sidebar--background');
      this.$open = document.querySelector(config ? config.showElement : '.js-sidebar--open');
      
      this.$container.addEventListener('touchstart', _onTouchStart.bind(this));
      this.$container.addEventListener('touchmove', _onTouchMove.bind(this));
      this.$container.addEventListener('touchend', _onTouchEnd.bind(this));
      this.$background.addEventListener('click', this.close.bind(this));
      this.$open.addEventListener('click', this.open.bind(this));
    }

    open() {
      _element(this.$container, [TRANSITION + '.3s ease', TRANSLATE + '(0, 0)']);
      if(!this.$component.classList.contains(IS_VISIBLE)) {
        this.$component.classList.add(IS_VISIBLE);
      }
    }

    close() {
      _element(this.$container, [TRANSITION + '.3s ease', TRANSLATE + '(-100%, 0)']);
      this.$component.classList.remove(IS_VISIBLE);
    }
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

  function _element(el, props) {
    for(let i = 0; i < props.length; i++) {
      let prop = props[i].split(':')[0];
      let val = props[i].split(':')[1];
      _vendorify(el, prop, val);
    }
    return el;
  }

  function _onTouchStart(e) {
    _element(this.$container, [TRANSITION + '0s']).touchStart = e.touches[0].pageX;
  }

  function _onTouchMove(e) {
    this.$container.touchMove = this.$container.touchStart - e.touches[0].pageX;
    if(this.$container.touchMove > 0) {
      _element(this.$container, [TRANSLATE + '(' + -this.$container.touchMove + 'px, 0)']);
    }
  }

  function _onTouchEnd() {
    this.$container.touchMove > (this.$container.clientWidth/4) ? this.close() : this.open();
  }

  return Sidebar;

})(window, document);
