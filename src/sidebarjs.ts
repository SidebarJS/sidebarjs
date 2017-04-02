import {HTMLSidebarElement, Sidebar, SidebarConfig} from './sidebarjs.interface';

const sidebarjs = 'sidebarjs';
const isVisible = `${sidebarjs}--is-visible`;
const isMoving = `${sidebarjs}--is-moving`;

export default class SidebarJS implements Sidebar {
  public component: HTMLElement;
  public container: HTMLElement;
  public background: HTMLElement;
  public documentMinSwipeX: number;
  public documentSwipeRange: number;
  public nativeSwipe: boolean;
  public nativeSwipeOpen: boolean;
  private initialTouch: number;
  private touchMoveSidebar: number;
  private touchMoveDocument: number;

  constructor({
    component,
    container,
    background,
    documentMinSwipeX = 10,
    documentSwipeRange = 40,
    nativeSwipe = true,
    nativeSwipeOpen = true,
  }: SidebarConfig = {}) {
    this.component = component || <HTMLElement> document.querySelector(`[${sidebarjs}]`);
    this.container = container || SidebarJS.create(`${sidebarjs}-container`);
    this.background = background || SidebarJS.create(`${sidebarjs}-background`);
    this.documentMinSwipeX = documentMinSwipeX;
    this.documentSwipeRange = documentSwipeRange;
    this.nativeSwipe = nativeSwipe !== false;
    this.nativeSwipeOpen = nativeSwipeOpen !== false;

    const hasAllConfigDOMElements = component && container && background;
    if (!hasAllConfigDOMElements) {
      try {
        this.transcludeContent();
      } catch (e) {
        throw new Error('You must define an element with [sidebarjs] attribute');
      }
    }

    if (this.nativeSwipe) {
      this.addNativeGestures();
      if (this.nativeSwipeOpen) {
        this.addNativeOpenGestures();
      }
    }

    this.addAttrsEventsListeners();
    this.background.addEventListener('click', this.close.bind(this));
  }

  public toggle(): void {
    this.component.classList.contains(isVisible) ? this.close() : this.open();
  }

  public open(): void {
    this.component.classList.add(isVisible);
  }

  public close(): void {
    this.component.classList.remove(isVisible);
  }

  public isVisible(): boolean {
    return this.component.classList.contains(isVisible);
  }

  public addAttrsEventsListeners(): void {
    const actions = ['toggle', 'open', 'close'];
    for (let i = 0; i < actions.length; i++) {
      const elements = document.querySelectorAll(`[${sidebarjs}-${actions[i]}]`);
      for (let j = 0; j < elements.length; j++) {
        if (!SidebarJS.elemHasListener(<HTMLElement> elements[j])) {
          elements[j].addEventListener('click', this[actions[i]].bind(this));
          SidebarJS.elemHasListener(<HTMLElement> elements[j], true);
        }
      }
    }
  }

  private transcludeContent(): void {
    this.container.innerHTML = this.component.innerHTML;
    this.component.innerHTML = '';
    this.component.appendChild(this.container);
    this.component.appendChild(this.background);
  }

  private addNativeGestures(): void {
    this.component.addEventListener('touchstart', this.onTouchStart.bind(this));
    this.component.addEventListener('touchmove', this.onTouchMove.bind(this));
    this.component.addEventListener('touchend', this.onTouchEnd.bind(this));
  }

  private addNativeOpenGestures(): void {
    document.addEventListener('touchstart', this.onDocumentTouchStart.bind(this));
    document.addEventListener('touchmove', this.onDocumentTouchMove.bind(this));
    document.addEventListener('touchend', this.onDocumentTouchEnd.bind(this));
  }

  private onTouchStart(e: TouchEvent): void {
    this.initialTouch = e.touches[0].pageX;
  }

  private onTouchMove(e: TouchEvent): void {
    this.touchMoveSidebar = this.initialTouch - e.touches[0].pageX;
    if (this.touchMoveSidebar >= 0) {
      this.moveSidebar(-this.touchMoveSidebar);
    }
  }

  private onTouchEnd(): void {
    this.component.classList.remove(isMoving);
    this.touchMoveSidebar > (this.container.clientWidth / 3.5) ? this.close() : this.open();
    this.container.removeAttribute('style');
    this.background.removeAttribute('style');
    delete this.initialTouch;
    delete this.touchMoveSidebar;
  }

  private moveSidebar(movement: number): void {
    this.component.classList.add(isMoving);
    SidebarJS.vendorify(this.container, 'transform', `translate(${movement}px, 0)`);
    this.changeBackgroundOpacity(movement);
  }

  private changeBackgroundOpacity(movement: number): void {
    const opacity = 0.3 - (-movement / (this.container.clientWidth * 3.5));
    this.background.style.opacity = (opacity).toString();
  }

  private onDocumentTouchStart(e: TouchEvent): void {
    const touchPositionX = e.touches[0].clientX;
    if (touchPositionX < this.documentSwipeRange) {
      this.onTouchStart(e);
    }
  }

  private onDocumentTouchMove(e: TouchEvent): void {
    if (this.initialTouch && !this.isVisible()) {
      const documentSwiped = e.touches[0].clientX - this.initialTouch;
      if (documentSwiped > this.documentMinSwipeX) {
        this.touchMoveDocument = e.touches[0].pageX - this.container.clientWidth;
        SidebarJS.vendorify(this.component, 'transform', 'translate(0, 0)');
        SidebarJS.vendorify(this.component, 'transition', 'none');
        if (this.touchMoveDocument <= 0) {
          this.moveSidebar(this.touchMoveDocument);
        }
      }
    }
  }

  private onDocumentTouchEnd(): void {
    if (this.touchMoveDocument) {
      delete this.touchMoveDocument;
      this.component.removeAttribute('style');
      this.onTouchEnd();
    }
  }

  public static create(element: string): HTMLElement {
    const el = document.createElement('div');
    el.setAttribute(element, '');
    return el;
  }

  public static vendorify(el: HTMLElement, prop: string, val: string): HTMLElement {
    const Prop = prop.charAt(0).toUpperCase() + prop.slice(1);
    const prefs = ['Moz', 'Webkit', 'O', 'ms'];
    el.style[prop] = val;
    for (let i = 0; i < prefs.length; i++) {
      el.style[prefs[i] + Prop] = val;
    }
    return el;
  }

  public static elemHasListener(elem: HTMLSidebarElement, value?: boolean): boolean {
    return elem && value ? elem.sidebarjsListener = value : elem.sidebarjsListener;
  }

  static get version(): string {
    return '1.8.1';
  }
}
