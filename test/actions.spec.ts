import { SidebarElement } from '../src';

describe('Actions', () => {
  const isVisibleClassName = 'sidebarjs--is-visible';
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('Open', () => {
    test('Should add sidebarjs--is-visible class to [sidebarjs] component', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarElement();
      const componentClassList = sidebarjs.component.classList;
      expect(componentClassList.contains(isVisibleClassName)).toBe(false);
      sidebarjs.open();
      expect(componentClassList.contains(isVisibleClassName)).toBe(true);
    });

    test('Should make sidebarjs visible', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarElement();
      expect(sidebarjs.isVisible()).toBe(false);
      sidebarjs.open();
      expect(sidebarjs.isVisible()).toBe(true);
    });

    test('Should open sidebarjs from element with [sidebarjs-open]', () => {
      document.body.innerHTML = '<div sidebarjs-open>open</div><div sidebarjs></div>';
      const sidebarjs = new SidebarElement();
      const elementOpen = <HTMLElement> document.querySelector('[sidebarjs-open]');
      expect(sidebarjs.isVisible()).toBe(false);
      elementOpen.click();
      expect(sidebarjs.isVisible()).toBe(true);
    });
  });

  describe('Close', () => {
    test('Should remove sidebarjs--is-visible class to [sidebarjs] component', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarElement();
      const componentClassList = sidebarjs.component.classList;
      expect(componentClassList.contains(isVisibleClassName)).toBe(false);
      sidebarjs.open();
      expect(componentClassList.contains(isVisibleClassName)).toBe(true);
      sidebarjs.close();
      expect(componentClassList.contains(isVisibleClassName)).toBe(false);
    });

    test('Should make sidebarjs invisible', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarElement();
      sidebarjs.open();
      expect(sidebarjs.isVisible()).toBe(true);
      sidebarjs.close();
      expect(sidebarjs.isVisible()).toBe(false);
    });

    test('Should open sidebarjs from element with [sidebarjs-open]', () => {
      document.body.innerHTML = '<div sidebarjs-close>open</div><div sidebarjs></div>';
      const sidebarjs = new SidebarElement();
      const elementClose = <HTMLElement> document.querySelector('[sidebarjs-close]');
      sidebarjs.open();
      expect(sidebarjs.isVisible()).toBe(true);
      elementClose.click();
      expect(sidebarjs.isVisible()).toBe(false);
    });
  });

  describe('Toggle', () => {
    test('Should toggle sidebarjs--is-visible class to [sidebarjs] component', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarElement();
      const componentClassList = sidebarjs.component.classList;
      sidebarjs.toggle();
      expect(componentClassList.contains(isVisibleClassName)).toBe(true);
      sidebarjs.toggle();
      expect(componentClassList.contains(isVisibleClassName)).toBe(false);
      sidebarjs.open();
      expect(componentClassList.contains(isVisibleClassName)).toBe(true);
      sidebarjs.toggle();
      expect(componentClassList.contains(isVisibleClassName)).toBe(false);
    });

    test('Should make sidebarjs visible/invisible', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarElement();
      sidebarjs.toggle();
      expect(sidebarjs.isVisible()).toBe(true);
      sidebarjs.toggle();
      expect(sidebarjs.isVisible()).toBe(false);
    });

    test('Should open sidebarjs from element with [sidebarjs-open]', () => {
      document.body.innerHTML = '<div sidebarjs-toggle>open</div><div sidebarjs></div>';
      const sidebarjs = new SidebarElement();
      const elementToggle = <HTMLElement> document.querySelector('[sidebarjs-toggle]');
      elementToggle.click();
      expect(sidebarjs.isVisible()).toBe(true);
      elementToggle.click();
      expect(sidebarjs.isVisible()).toBe(false);
    });
  });

  describe('isVisible', () => {
    test('Should return a boolean value that describe the visibility of sidebar', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarElement();
      expect(sidebarjs.isVisible()).toBe(false);
      sidebarjs.open();
      expect(sidebarjs.isVisible()).toBe(true);
      sidebarjs.close();
      expect(sidebarjs.isVisible()).toBe(false);
    });
  });

  describe('destroy', () => {
    test('Should destroy sidebarjs', () => {
      document.body.innerHTML = '<div sidebarjs>foo</div>';
      const sidebarjs = new SidebarElement();
      expect(sidebarjs.component).toBeInstanceOf(HTMLDivElement);
      expect(sidebarjs.container).toBeInstanceOf(HTMLDivElement);
      expect(sidebarjs.backdrop).toBeInstanceOf(HTMLDivElement);
      expect(sidebarjs.component.attributes['sidebarjs']).toBeDefined();
      expect(sidebarjs.container.attributes['sidebarjs-container']).toBeDefined();
      expect(sidebarjs.backdrop.attributes['sidebarjs-backdrop']).toBeDefined();
      sidebarjs.destroy();
      expect(sidebarjs.component).toBeNull();
      expect(sidebarjs.container).toBeNull();
      expect(sidebarjs.backdrop).toBeNull();
    });
  });
});
