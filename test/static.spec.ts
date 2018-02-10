import {HTMLSidebarElement} from '../index';
import {SidebarElement} from '../src';

describe('Static', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('SidebarElement.create', () => {
    test('Should create a div element with specific attribute', () => {
      const elem = SidebarElement.create('hello');
      expect(elem).toBeInstanceOf(HTMLDivElement);
      expect(elem.attributes['hello']).toBeDefined();
      expect(elem.outerHTML).toBe('<div hello=""></div>');
    });
  });

  describe('SidebarElement.vendorify', () => {
    test('Should add css vendor prefixes', () => {
      const elem = document.createElement('div');
      SidebarElement.vendorify(elem, 'transform', `translate(0, 0)`);
      expect(elem.style['WebkitTransform']).toBeDefined();
      expect(elem.style['WebkitTransform']).toBe('translate(0, 0)');
      expect(elem.style['transform']).toBeDefined();
      expect(elem.style['transform']).toBe('translate(0, 0)');
    });
  });

  describe('SidebarElement.elemHasListener', () => {
    test('Should return boolean value that notify if element has SidebarElement listeners', () => {
      document.body.innerHTML = `
        <button sidebarjs-toggle></button>
        <div sidebarjs></div>
      `;
      const elem = <HTMLSidebarElement> document.querySelector('button[sidebarjs-toggle]');
      const hasFalseListener = SidebarElement.elemHasListener(elem);
      expect(hasFalseListener).toBe(false);
      const sidebarjs = new SidebarElement();
      const hasTrueListener = SidebarElement.elemHasListener(elem);
      expect(hasTrueListener).toBe(true);
    });

    test('Should set value to HTMLSidebarElement and return it', () => {
      document.body.innerHTML = `
        <button sidebarjs-toggle></button>
        <div sidebarjs></div>
      `;
      const elem = <HTMLSidebarElement> document.querySelector('button[sidebarjs-toggle]');
      const hasFalseListener = SidebarElement.elemHasListener(elem);
      expect(hasFalseListener).toBe(false);
      const isSetToTrueListener = SidebarElement.elemHasListener(elem, true);
      expect(isSetToTrueListener).toBe(true);
      const isSetToFalseListener = SidebarElement.elemHasListener(elem, false);
      expect(isSetToFalseListener).toBe(false);
    });
  });
});
