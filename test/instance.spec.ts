import * as sinon from 'sinon';
import { SidebarElement } from './../src/sidebarElement';

describe('Instance creation', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('Should create instance', () => {
    document.body.innerHTML = '<div sidebarjs></div>';
    const sidebarjs = new SidebarElement();
    expect(sidebarjs).toBeDefined();
    expect(sidebarjs.component).toBeInstanceOf(HTMLDivElement);
    expect(sidebarjs.container).toBeInstanceOf(HTMLDivElement);
    expect(sidebarjs.backdrop).toBeInstanceOf(HTMLDivElement);
    expect(sidebarjs.component.attributes['sidebarjs']).toBeDefined();
    expect(sidebarjs.container.attributes['sidebarjs-container']).toBeDefined();
    expect(sidebarjs.backdrop.attributes['sidebarjs-backdrop']).toBeDefined();
  });

  test('Should not create instance', () => {
    expect(() => new SidebarElement()).toThrowError('You must define an element with [sidebarjs] attribute');
  });

  describe('Transclude', () => {
    it('Should transclude content', () => {
      const spy = sinon.spy(SidebarElement.prototype, 'transcludeContent');
      document.body.innerHTML = '<div sidebarjs>Hello</div>';
      const sidebarjs = new SidebarElement();
      expect(sidebarjs.container.innerHTML).toBe('Hello');
      expect(sidebarjs.component.attributes['sidebarjs']).toBeDefined();
      expect(sidebarjs.container.attributes['sidebarjs-container']).toBeDefined();
      expect(sidebarjs.backdrop.attributes['sidebarjs-backdrop']).toBeDefined();
      expect(spy.called).toBe(true);
      expect(spy.calledOnce).toBe(true);
      spy.restore();
    });

    it('Should not transclude content with all custom HTMLElement params in config', () => {
      const spy = sinon.spy(SidebarElement.prototype, 'transcludeContent');
      document.body.innerHTML = `
        <div sidebarjs>
          <section custom-container>Hello</section>
          <section custom-backdrop></section>
        </div>`;
      const element = document.querySelector('[sidebarjs]');
      const sidebarjs = new SidebarElement({
        component: <HTMLElement> element,
        container: <HTMLElement> element.children[0],
        backdrop: <HTMLElement> element.children[1],
      });
      expect(sidebarjs.container.innerHTML).toBe('Hello');
      expect(sidebarjs.container.nodeName).toBe('SECTION');
      expect(sidebarjs.backdrop.nodeName).toBe('SECTION');
      expect(sidebarjs.component.attributes['sidebarjs']).toBeDefined();
      expect(sidebarjs.container.attributes['custom-container']).toBeDefined();
      expect(sidebarjs.backdrop.attributes['custom-backdrop']).toBeDefined();
      expect(sidebarjs.container.attributes['sidebarjs-container']).toBeUndefined();
      expect(sidebarjs.backdrop.attributes['sidebarjs-backdrop']).toBeUndefined();
      expect(spy.called).toBe(false);
      spy.restore();
    });

    it('Should transclude content if has not all custom HTMLElement params in config', () => {
      const spy = sinon.spy(SidebarElement.prototype, 'transcludeContent');
      document.body.innerHTML = `
        <div sidebarjs>
          <section custom-container>Hello</section>
          <section custom-backdrop></section> 
        </div>`;
      const component = document.querySelector('[sidebarjs]');
      const container = document.querySelector('[custom-container]');
      const sidebarjs = new SidebarElement({
        component: <HTMLElement> component,
        container: <HTMLElement> container,
        /* backdrop: <HTMLElement>element.children[1], */
      });
      expect(sidebarjs.container.innerText).not.toBe('Hello');
      expect(sidebarjs.container.innerText).toBeFalsy();
      expect(sidebarjs.container.children[0].outerHTML).toBe('<section custom-container="">Hello</section>');
      expect(sidebarjs.container.children[1].outerHTML).toBe('<section custom-backdrop=""></section>');
      expect(spy.called).toBe(true);
      expect(spy.calledOnce).toBe(true);
      spy.restore();
    });
  });

  describe('Native Swipe', () => {
    it('Should has native gestures', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarElement();
      expect(sidebarjs.nativeSwipe).toBe(true);
      expect(sidebarjs.nativeSwipeOpen).toBe(true);
    });

    it('Should not has nativeSwipe', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarElement({nativeSwipe: false});
      expect(sidebarjs.nativeSwipe).toBe(false);
      expect(sidebarjs.nativeSwipeOpen).toBe(true);
    });

    it('Should not has nativeSwipeOpen', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarElement({nativeSwipeOpen: false});
      expect(sidebarjs.nativeSwipe).toBe(true);
      expect(sidebarjs.nativeSwipeOpen).toBe(false);
    });

    it('Should not has native gestures', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarElement({nativeSwipe: false, nativeSwipeOpen: false});
      expect(sidebarjs.nativeSwipe).toBe(false);
      expect(sidebarjs.nativeSwipeOpen).toBe(false);
    });
  });

  describe('Backdrop opacity', () => {
    it('Should has default opacity', () => {
      document.body.innerHTML = '<div sidebarjs>Hello</div>';
      const sidebarjs = new SidebarElement();
      sidebarjs.open();
      expect(sidebarjs.backdrop.style.opacity).toBe('0.3');
      expect(sidebarjs.backdrop.getAttribute('style')).toBe('opacity: 0.3;');
    });

    it('Should has custom opacity', () => {
      document.body.innerHTML = '<div sidebarjs>Hello</div>';
      const sidebarjs = new SidebarElement({backdropOpacity: .8});
      sidebarjs.open();
      expect(sidebarjs.backdrop.style.opacity).toBe('0.8');
      expect(sidebarjs.backdrop.getAttribute('style')).toBe('opacity: 0.8;');
    });

    it('Should has not opacity', () => {
      document.body.innerHTML = '<div sidebarjs>Hello</div>';
      const sidebarjs = new SidebarElement({backdropOpacity: 0});
      sidebarjs.open();
      expect(sidebarjs.backdrop.style.opacity).toBe('0');
      expect(sidebarjs.backdrop.getAttribute('style')).toBe('opacity: 0;');
    });

    it('Should has full opacity', () => {
      document.body.innerHTML = '<div sidebarjs>Hello</div>';
      const sidebarjs = new SidebarElement({backdropOpacity: 1});
      sidebarjs.open();
      expect(sidebarjs.backdrop.style.opacity).toBe('1');
      expect(sidebarjs.backdrop.getAttribute('style')).toBe('opacity: 1;');
    });
  });
});
