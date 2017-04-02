import SidebarJS from './../src/sidebarjs';

describe('Instance creation', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('Should create instance', () => {
    document.body.innerHTML = '<div sidebarjs></div>';
    const sidebarjs = new SidebarJS();
    expect(sidebarjs).toBeDefined();
    expect(sidebarjs.component).toBeInstanceOf(HTMLDivElement);
    expect(sidebarjs.container).toBeInstanceOf(HTMLDivElement);
    expect(sidebarjs.background).toBeInstanceOf(HTMLDivElement);
    expect(sidebarjs.component.attributes['sidebarjs']).toBeDefined();
    expect(sidebarjs.container.attributes['sidebarjs-container']).toBeDefined();
    expect(sidebarjs.background.attributes['sidebarjs-background']).toBeDefined();
  });

  test('Should not create instance', () => {
    expect(() => new SidebarJS()).toThrowError('You must define an element with [sidebarjs] attribute');
  });

  describe('Transclude', () => {
    it('Should transclude content', () => {
      document.body.innerHTML = '<div sidebarjs>Hello</div>';
      const sidebarjs = new SidebarJS();
      expect(sidebarjs.container.innerHTML).toBe('Hello');
      expect(sidebarjs.component.attributes['sidebarjs']).toBeDefined();
      expect(sidebarjs.container.attributes['sidebarjs-container']).toBeDefined();
      expect(sidebarjs.background.attributes['sidebarjs-background']).toBeDefined();
    });

    it('Should not transclude content with all custom HTMLElement params in config', () => {
      document.body.innerHTML = `
        <div sidebarjs>
          <section custom-container>Hello</section>
          <section custom-background></section>
        </div>`;
      const element = document.querySelector('[sidebarjs]');
      const sidebarjs = new SidebarJS({
        component: <HTMLElement> element,
        container: <HTMLElement> element.children[0],
        background: <HTMLElement> element.children[1],
      });
      expect(sidebarjs.container.innerHTML).toBe('Hello');
      expect(sidebarjs.container.nodeName).toBe('SECTION');
      expect(sidebarjs.background.nodeName).toBe('SECTION');
      expect(sidebarjs.component.attributes['sidebarjs']).toBeDefined();
      expect(sidebarjs.container.attributes['custom-container']).toBeDefined();
      expect(sidebarjs.background.attributes['custom-background']).toBeDefined();
      expect(sidebarjs.container.attributes['sidebarjs-container']).toBeUndefined();
      expect(sidebarjs.background.attributes['sidebarjs-background']).toBeUndefined();
    });

    it('Should transclude content if has not all custom HTMLElement params in config', () => {
      document.body.innerHTML = `
        <div sidebarjs>
          <section custom-container>Hello</section>
          <section custom-background></section> 
        </div>`;
      const element = document.querySelector('[sidebarjs]');
      const sidebarjs = new SidebarJS({
        component: <HTMLElement> element,
        container: <HTMLElement> element.children[0],
        /* background: <HTMLElement>element.children[1], */
      });
      expect(sidebarjs.container.innerText).not.toBe('Hello');
      expect(sidebarjs.container.innerText).toBeFalsy();
      expect(sidebarjs.container.children[0].outerHTML).toBe('<section custom-container="">Hello</section>');
      expect(sidebarjs.container.children[1].outerHTML).toBe('<section custom-background=""></section>');
    });
  });

  describe('Native Swipe', () => {
    it('Should has native gestures', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarJS();
      expect(sidebarjs.nativeSwipe).toBe(true);
      expect(sidebarjs.nativeSwipeOpen).toBe(true);
    });

    it('Should not has nativeSwipe', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarJS({nativeSwipe: false});
      expect(sidebarjs.nativeSwipe).toBe(false);
      expect(sidebarjs.nativeSwipeOpen).toBe(true);
    });

    it('Should not has nativeSwipeOpen', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarJS({nativeSwipeOpen: false});
      expect(sidebarjs.nativeSwipe).toBe(true);
      expect(sidebarjs.nativeSwipeOpen).toBe(false);
    });

    it('Should not has native gestures', () => {
      document.body.innerHTML = '<div sidebarjs></div>';
      const sidebarjs = new SidebarJS({nativeSwipe: false, nativeSwipeOpen: false});
      expect(sidebarjs.nativeSwipe).toBe(false);
      expect(sidebarjs.nativeSwipeOpen).toBe(false);
    });
  });
});
