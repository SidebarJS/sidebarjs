import { HTMLSidebarElement } from './../index';
import SidebarJS from './../src/sidebarjs';

describe('Static', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('SidebarJS.create', () => {
    it('Should create a div element with specific attribute', () => {
      const elem = SidebarJS.create('hello');
      expect(elem).toBeInstanceOf(HTMLDivElement);
      expect(elem.attributes['hello']).toBeDefined();
      expect(elem.outerHTML).toBe('<div hello=""></div>');
    });
  });

  describe('SidebarJS.vendorify', () => {
    it('Should add css vendor prefixes', () => {
      const elem = document.createElement('div');
      SidebarJS.vendorify(elem, 'transform', `translate(0, 0)`);
      expect(elem.style['MozTransform']).toBeDefined();
      expect(elem.style['MozTransform']).toBe('translate(0, 0)');
      expect(elem.style['WebkitTransform']).toBeDefined();
      expect(elem.style['WebkitTransform']).toBe('translate(0, 0)');
      expect(elem.style['OTransform']).toBeDefined();
      expect(elem.style['OTransform']).toBe('translate(0, 0)');
      expect(elem.style['msTransform']).toBeDefined();
      expect(elem.style['msTransform']).toBe('translate(0, 0)');
      expect(elem.style['transform']).toBeDefined();
      expect(elem.style['transform']).toBe('translate(0, 0)');
    });
  });

  describe('SidebarJS.elemHasListener', () => {
    it('Should return boolean value that notify if element has SidebarJS listeners', () => {
      document.body.innerHTML = `
        <button sidebarjs-toggle></button>
        <div sidebarjs></div>
      `;
      const elem = <HTMLSidebarElement>document.querySelector('button[sidebarjs-toggle]');
      const hasFalseListener = SidebarJS.elemHasListener(elem);
      expect(hasFalseListener).toBe(false);
      new SidebarJS();
      const hasTrueListener = SidebarJS.elemHasListener(elem);
      expect(hasTrueListener).toBe(true);
    });

    it('Should set value to HTMLSidebarElement and return it', () => {
      document.body.innerHTML = `
        <button sidebarjs-toggle></button>
        <div sidebarjs></div>
      `;
      const elem = <HTMLSidebarElement>document.querySelector('button[sidebarjs-toggle]');
      const hasFalseListener = SidebarJS.elemHasListener(elem);
      expect(hasFalseListener).toBe(false);
      const isSetToTrueListener = SidebarJS.elemHasListener(elem, true);
      expect(isSetToTrueListener).toBe(true);
      const isSetToFalseListener = SidebarJS.elemHasListener(elem, false);
      expect(isSetToFalseListener).toBe(false);
    })
  });
});
