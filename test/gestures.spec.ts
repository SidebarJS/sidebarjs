import {swipe} from 'gesture-events';
import {SidebarElement} from '../src';

const mock = (el: any) => {
  return {
    prop(name: string, value: any) {
      Object.defineProperty(el, name, {
        get() {
          return value;
        },
      });
    },
  };
};

describe('Gestures', () => {
  const isVisibleClassName = 'sidebarjs--is-visible';

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('Swipe', () => {
    test('Should open sidebarjs on swipe', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarElement();
      const componentClassList = sidebarjs.component.classList;
      mock(sidebarjs.container).prop('clientWidth', 200);
      expect(sidebarjs.isVisible()).toBe(false);
      expect(componentClassList.contains(isVisibleClassName)).toBe(false);
      swipe(document.body, {x: 1, y: 10}, {x: 50, y: 10});
      expect(sidebarjs.isVisible()).toBe(true);
      expect(componentClassList.contains(isVisibleClassName)).toBe(true);
    });

    test('Should close sidebarjs on swipe', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarElement();
      mock(sidebarjs.container).prop('clientWidth', 200);
      sidebarjs.open();
      expect(sidebarjs.isVisible()).toBe(true);
      swipe(sidebarjs.component, {x: 300, y: 10}, {x: 200, y: 10});
      expect(sidebarjs.isVisible()).toBe(false);
    });

    test('Should not open sidebarjs on swipe', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarElement({nativeSwipeOpen: false});
      mock(sidebarjs.container).prop('clientWidth', 200);
      expect(sidebarjs.isVisible()).toBe(false);
      swipe(document.body, {x: 1, y: 10}, {x: 50, y: 10});
      expect(sidebarjs.isVisible()).toBe(false);
      sidebarjs.open();
      expect(sidebarjs.isVisible()).toBe(true);
      swipe(sidebarjs.backdrop, {x: 300, y: 10}, {x: 200, y: 10});
      expect(sidebarjs.isVisible()).toBe(false);
    });

    test('Should has custom range for trigger open', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarElement({documentMinSwipeX: 30});
      const componentClassList = sidebarjs.component.classList;
      mock(sidebarjs.container).prop('clientWidth', 200);
      expect(sidebarjs.isVisible()).toBe(false);
      expect(componentClassList.contains(isVisibleClassName)).toBe(false);
      swipe(document.body, {x: 1, y: 10}, {x: 30, y: 10});
      expect(sidebarjs.isVisible()).toBe(false);
      expect(componentClassList.contains(isVisibleClassName)).toBe(false);
      swipe(document.body, {x: 1, y: 10}, {x: 31, y: 10});
      expect(sidebarjs.isVisible()).toBe(true);
      expect(componentClassList.contains(isVisibleClassName)).toBe(true);
    });

    test('Should re-open sidebarjs if it is swiped back only 1/3 of its clientWidth', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarElement();
      mock(sidebarjs.container).prop('clientWidth', 200);
      sidebarjs.open();
      expect(sidebarjs.isVisible()).toBe(true);
      swipe(sidebarjs.component, {x: 300, y: 10}, {x: 250, y: 10});
      expect(sidebarjs.isVisible()).toBe(true);
      swipe(sidebarjs.component, {x: 300, y: 10}, {x: 200, y: 10});
      expect(sidebarjs.isVisible()).toBe(false);
    });

    test('Should change swipe gesture settings', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarElement();
      const componentClassList = sidebarjs.component.classList;
      mock(sidebarjs.container).prop('clientWidth', 200);
      expect(sidebarjs.isVisible()).toBe(false);
      expect(componentClassList.contains(isVisibleClassName)).toBe(false);
      swipe(document.body, {x: 1, y: 10}, {x: 50, y: 10});
      expect(sidebarjs.isVisible()).toBe(true);
      expect(componentClassList.contains(isVisibleClassName)).toBe(true);
      sidebarjs.close();
      sidebarjs.setSwipeGestures(false);
      swipe(document.body, {x: 1, y: 10}, {x: 50, y: 10});
      expect(sidebarjs.isVisible()).toBe(false);
      expect(componentClassList.contains(isVisibleClassName)).toBe(false);
      sidebarjs.setSwipeGestures(true);
      swipe(document.body, {x: 1, y: 10}, {x: 50, y: 10});
      expect(sidebarjs.isVisible()).toBe(true);
      expect(componentClassList.contains(isVisibleClassName)).toBe(true);
    });
  });
});
