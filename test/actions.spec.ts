import SidebarJS from './../src/sidebarjs';

describe('Actions', () => {
  const isVisibleClassName = 'sidebarjs--is-visible';
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('Open', () => {
    it('Should add sidebarjs--is-visible class to [sidebarjs] component', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarJS();
      const componentClassList = sidebarjs.component.classList;
      expect(componentClassList.contains(isVisibleClassName)).toBe(false);
      sidebarjs.open();
      expect(componentClassList.contains(isVisibleClassName)).toBe(true);
    })
  })

  describe('Close', () => {
    it('Should remove sidebarjs--is-visible class to [sidebarjs] component', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarJS();
      const componentClassList = sidebarjs.component.classList;
      expect(componentClassList.contains(isVisibleClassName)).toBe(false);
      sidebarjs.open();
      expect(componentClassList.contains(isVisibleClassName)).toBe(true);
      sidebarjs.close();
      expect(componentClassList.contains(isVisibleClassName)).toBe(false);
    })
  })

  describe('Toggle', () => {
    it('Should toggle sidebarjs--is-visible class to [sidebarjs] component', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarJS();
      const componentClassList = sidebarjs.component.classList;
      sidebarjs.toggle();
      expect(componentClassList.contains(isVisibleClassName)).toBe(true);
      sidebarjs.toggle();
      expect(componentClassList.contains(isVisibleClassName)).toBe(false);
      sidebarjs.open();
      expect(componentClassList.contains(isVisibleClassName)).toBe(true);
      sidebarjs.toggle();
      expect(componentClassList.contains(isVisibleClassName)).toBe(false);
    })
  })

  describe('isVisible', () => {
    it('Should return a boolean value that describe the visibility of sidebar', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarJS();
      expect(sidebarjs.isVisible()).toBe(false);
      sidebarjs.open();
      expect(sidebarjs.isVisible()).toBe(true);
      sidebarjs.close();
      expect(sidebarjs.isVisible()).toBe(false);
    })
  })
})
