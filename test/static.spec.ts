import { HTMLSidebarElement } from '../index';
import { SidebarElement } from '../src';

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

  describe('SidebarElement.isStyleMapSupported', () => {
    test('Should check styleMap support', () => {
      (window as any).CSS = null;
      expect(SidebarElement.isStyleMapSupported()).toBe(false);
      (window as any).CSS = {number: true};
      expect(SidebarElement.isStyleMapSupported()).toBe(true);
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
