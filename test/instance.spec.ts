import * as sinon from 'sinon';
import {SidebarElement} from '../src';

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
    expect(sidebarjs.component.hasAttribute('sidebarjs')).toBe(true);
    expect(sidebarjs.container.hasAttribute('sidebarjs-container')).toBe(true);
    expect(sidebarjs.backdrop.hasAttribute('sidebarjs-backdrop')).toBe(true);
  });

  test('Should not create instance', () => {
    expect(() => new SidebarElement()).toThrowError('You must define an element with [sidebarjs] attribute');
  });

  describe('Transclude', () => {
    test('Should transclude content', () => {
      const spy = sinon.spy(SidebarElement.prototype, 'transcludeContent');
      document.body.innerHTML = '<div sidebarjs>Hello</div>';
      const sidebarjs = new SidebarElement();
      expect(sidebarjs.container.innerHTML).toBe('Hello');
      expect(sidebarjs.component.hasAttribute('sidebarjs')).toBe(true);
      expect(sidebarjs.container.hasAttribute('sidebarjs-container')).toBe(true);
      expect(sidebarjs.backdrop.hasAttribute('sidebarjs-backdrop')).toBe(true);
      expect(spy.called).toBe(true);
      expect(spy.calledOnce).toBe(true);
      spy.restore();
    });

    test('Should not transclude content with all custom HTMLElement params in config', () => {
      const spy = sinon.spy(SidebarElement.prototype, 'transcludeContent');
      document.body.innerHTML = `
        <div sidebarjs>
          <section custom-container>Hello</section>
          <section custom-backdrop></section>
        </div>`;
      const element = document.querySelector('[sidebarjs]');
      const sidebarjs = new SidebarElement({
        backdrop: element.children[1] as HTMLElement,
        component: element as HTMLElement,
        container: element.children[0] as HTMLElement,
      });
      expect(sidebarjs.container.innerHTML).toBe('Hello');
      expect(sidebarjs.container.nodeName).toBe('SECTION');
      expect(sidebarjs.backdrop.nodeName).toBe('SECTION');
      expect(sidebarjs.component.hasAttribute('sidebarjs')).toBe(true);
      expect(sidebarjs.container.hasAttribute('custom-container')).toBe(true);
      expect(sidebarjs.backdrop.hasAttribute('custom-backdrop')).toBe(true);
      expect(sidebarjs.container.hasAttribute('sidebarjs-container')).toBe(false);
      expect(sidebarjs.backdrop.hasAttribute('sidebarjs-backdrop')).toBe(false);
      expect(spy.called).toBe(false);
      spy.restore();
    });

    test('Should transclude content if has not all custom HTMLElement params in config', () => {
      const spy = sinon.spy(SidebarElement.prototype, 'transcludeContent');
      document.body.innerHTML = `
        <div sidebarjs>
          <section custom-container>Hello</section>
          <section custom-backdrop></section>
        </div>`;
      const component = document.querySelector('[sidebarjs]');
      const container = document.querySelector('[custom-container]');
      const sidebarjs = new SidebarElement({
        component: component as HTMLElement,
        container: container as HTMLElement,
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
    test('Should has native gestures', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarElement();
      expect(sidebarjs.nativeSwipe).toBe(true);
      expect(sidebarjs.nativeSwipeOpen).toBe(true);
    });

    test('Should not has nativeSwipe', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarElement({nativeSwipe: false});
      expect(sidebarjs.nativeSwipe).toBe(false);
      expect(sidebarjs.nativeSwipeOpen).toBe(true);
    });

    test('Should not has nativeSwipeOpen', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarElement({nativeSwipeOpen: false});
      expect(sidebarjs.nativeSwipe).toBe(true);
      expect(sidebarjs.nativeSwipeOpen).toBe(false);
    });

    test('Should not has native gestures', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarElement({nativeSwipe: false, nativeSwipeOpen: false});
      expect(sidebarjs.nativeSwipe).toBe(false);
      expect(sidebarjs.nativeSwipeOpen).toBe(false);
    });
  });

  describe('Backdrop opacity', () => {
    test('Should has default opacity', () => {
      document.body.innerHTML = '<div sidebarjs>Hello</div>';
      const sidebarjs = new SidebarElement();
      sidebarjs.open();
      expect(sidebarjs.backdrop.style.opacity).toBe('0.3');
      expect(sidebarjs.backdrop.getAttribute('style')).toBe('opacity: 0.3;');
    });

    test('Should has custom opacity', () => {
      document.body.innerHTML = '<div sidebarjs>Hello</div>';
      const sidebarjs = new SidebarElement({backdropOpacity: .8});
      sidebarjs.open();
      expect(sidebarjs.backdrop.style.opacity).toBe('0.8');
      expect(sidebarjs.backdrop.getAttribute('style')).toBe('opacity: 0.8;');
    });

    test('Should has not opacity', () => {
      document.body.innerHTML = '<div sidebarjs>Hello</div>';
      const sidebarjs = new SidebarElement({backdropOpacity: 0});
      sidebarjs.open();
      expect(sidebarjs.backdrop.style.opacity).toBe('0');
      expect(sidebarjs.backdrop.getAttribute('style')).toBe('opacity: 0;');
    });

    test('Should has full opacity', () => {
      document.body.innerHTML = '<div sidebarjs>Hello</div>';
      const sidebarjs = new SidebarElement({backdropOpacity: 1});
      sidebarjs.open();
      expect(sidebarjs.backdrop.style.opacity).toBe('1');
      expect(sidebarjs.backdrop.getAttribute('style')).toBe('opacity: 1;');
    });
  });

  describe('OnChanges functions', () => {
    test('Should trigger onOpen', () => {
      document.body.innerHTML = '<div sidebarjs>Hello</div>';
      let n = 0;
      const sidebarjs = new SidebarElement(({
        onOpen() {
          n = 1;
        },
      }));
      sidebarjs.open();
      // emulate trigger transitionend event
      sidebarjs['_onTransitionEnd']();
      expect(n).toBe(1);
    });

    test('Should trigger onClose', () => {
      document.body.innerHTML = '<div sidebarjs>Hello</div>';
      let n = 0;
      const sidebarjs = new SidebarElement(({
        onClose() {
          n = 1;
        },
      }));
      sidebarjs.open();
      // emulate trigger transitionend event
      sidebarjs['_onTransitionEnd']();
      sidebarjs.close();
      // emulate trigger transitionend event
      sidebarjs['_onTransitionEnd']();
      expect(n).toBe(1);
    });

    test('Should trigger onChangeVisibility', () => {
      document.body.innerHTML = '<div sidebarjs>Hello</div>';
      let n = 0;
      let changes = null;
      const sidebarjs = new SidebarElement(({
        onChangeVisibility(changesEvent) {
          changes = changesEvent;
          ++n;
        },
      }));
      sidebarjs.open();
      // emulate trigger transitionend event
      sidebarjs['_onTransitionEnd']();
      expect(n).toBe(1);
      expect(changes).toEqual({isVisible: true});
      sidebarjs.close();
      // emulate trigger transitionend event
      sidebarjs['_onTransitionEnd']();
      expect(n).toBe(2);
      expect(changes).toEqual({isVisible: false});
    });

    test('Should trigger all onChanges functions', () => {
      document.body.innerHTML = '<div sidebarjs>Hello</div>';
      let n = 0;
      let isOpenFired = false;
      let isCloseFired = false;
      let changes = null;
      const sidebarjs = new SidebarElement(({
        onOpen() {
          isOpenFired = true;
          isCloseFired = false;
        },
        onClose() {
          isOpenFired = false;
          isCloseFired = true;
        },
        onChangeVisibility(changesEvent) {
          changes = changesEvent;
          ++n;
        },
      }));
      sidebarjs.open();
      // emulate trigger transitionend event
      sidebarjs['_onTransitionEnd']();
      expect(n).toBe(1);
      expect(isOpenFired).toBe(true);
      expect(isCloseFired).toBe(false);
      expect(changes).toEqual({isVisible: true});
      sidebarjs.close();
      // emulate trigger transitionend event
      sidebarjs['_onTransitionEnd']();
      expect(n).toBe(2);
      expect(isOpenFired).toBe(false);
      expect(isCloseFired).toBe(true);
      expect(changes).toEqual({isVisible: false});
      sidebarjs.toggle();
      // emulate trigger transitionend event
      sidebarjs['_onTransitionEnd']();
      expect(n).toBe(3);
      expect(isOpenFired).toBe(true);
      expect(isCloseFired).toBe(false);
      expect(changes).toEqual({isVisible: true});
    });
  });

  describe('Style manipulation', () => {
    test('Should add styles', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarElement();
      const elem = document.createElement('div');
      sidebarjs['applyStyle'](elem, 'transform', `translate(0, 0)`);
      expect(elem.style.webkitTransform).toBe('');
      expect(elem.style.transform).toBeDefined();
      expect(elem.style.transform).toBe('translate(0, 0)');
    });

    test('Should add styles vendor prefix', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarElement();
      const elem = document.createElement('div');
      sidebarjs['applyStyle'](elem, 'transform', `translate(0, 0)`, true);
      expect(elem.style.webkitTransform).toBeDefined();
      expect(elem.style.webkitTransform).toBe('translate(0, 0)');
      expect(elem.style.transform).toBeDefined();
      expect(elem.style.transform).toBe('translate(0, 0)');
    });

    test('Should remove styles ', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarElement();
      const elem = document.createElement('div');
      sidebarjs['applyStyle'](elem, 'transform', `translate(0, 0)`);
      expect(elem.style.transform).toBeDefined();
      expect(elem.style.transform).toBe('translate(0, 0)');
      sidebarjs['clearStyle'](elem);
      expect(elem.style.transform).toBe('');
    });
  });
});
