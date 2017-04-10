import {HTMLSidebarElement, Sidebar, SidebarConfig} from './sidebarjs.interface';

const sidebarjs = 'sidebarjs';
const isVisible = `${sidebarjs}--is-visible`;
const isMoving = `${sidebarjs}--is-moving`;
const LEFT_POSITION = 'left';
const RIGHT_POSITION = 'right';
const TRANSITION_DURATION = 400;
const POSITIONS = [LEFT_POSITION, RIGHT_POSITION];

export default class SidebarJS implements Sidebar {
  public component: HTMLElement;
  public container: HTMLElement;
  public background: HTMLElement;
  public documentMinSwipeX: number;
  public documentSwipeRange: number;
  public nativeSwipe: boolean;
  public nativeSwipeOpen: boolean;
  public position: string;
  private initialTouch: number;
  private touchMoveSidebar: number;
  private openMovement: number;

  constructor({
    component,
    container,
    background,
    documentMinSwipeX,
    documentSwipeRange,
    nativeSwipe,
    nativeSwipeOpen,
    position,
  }: SidebarConfig = {}) {
    this.component = component || <HTMLElement> document.querySelector(`[${sidebarjs}]`);
    this.container = container || SidebarJS.create(`${sidebarjs}-container`);
    this.background = background || SidebarJS.create(`${sidebarjs}-background`);
    this.documentMinSwipeX = documentMinSwipeX || 10;
    this.documentSwipeRange = documentSwipeRange || 40;
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

    this.setPosition(position);
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

  public setPosition(position: string): void {
    this.component.classList.add(isMoving);
    this.position = POSITIONS.indexOf(position) >= 0 ? position : LEFT_POSITION;
    POSITIONS.forEach((POS) => this.component.classList.remove(`${sidebarjs}--${POS}`));
    this.component.classList.add(`${sidebarjs}--${this.hasRightPosition() ? RIGHT_POSITION : LEFT_POSITION}`);
    setTimeout(() => this.component.classList.remove(isMoving), TRANSITION_DURATION);
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

  private hasLeftPosition(): boolean {
    return this.position === LEFT_POSITION;
  }

  private hasRightPosition(): boolean {
    return this.position === RIGHT_POSITION;
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
    document.addEventListener('touchstart', this.onSwipeOpenStart.bind(this));
    document.addEventListener('touchmove', this.onSwipeOpenMove.bind(this));
    document.addEventListener('touchend', this.onSwipeOpenEnd.bind(this));
  }

  private onTouchStart(e: TouchEvent): void {
    this.initialTouch = e.touches[0].pageX;
  }

  private onTouchMove(e: TouchEvent): void {
    const documentSwiped =  this.initialTouch - e.touches[0].clientX;
    const sidebarMovement = this.getSidebarPosition(documentSwiped);
    this.touchMoveSidebar = -documentSwiped;
    if (sidebarMovement <= this.container.clientWidth) {
      this.moveSidebar(this.touchMoveSidebar);
    }
  }

  private onTouchEnd(): void {
    this.component.classList.remove(isMoving);
    Math.abs(this.touchMoveSidebar) > (this.container.clientWidth / 3.5) ? this.close() : this.open();
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
    const opacity = 0.3 - (Math.abs(movement) / (this.container.clientWidth * 3.5));
    this.background.style.opacity = (opacity).toString();
  }

  private onSwipeOpenStart(e: TouchEvent): void {
    const {clientWidth} = document.body;
    const touchPositionX = e.touches[0].clientX;
    const documentTouch = this.hasLeftPosition() ? touchPositionX : clientWidth - touchPositionX;
    if (documentTouch < this.documentSwipeRange) {
      this.onTouchStart(e);
    }
  }

  private onSwipeOpenMove(e: TouchEvent): void {
    if (this.initialTouch && !this.isVisible()) {
      const documentSwiped = e.touches[0].clientX - this.initialTouch;
      const sidebarMovement = this.getSidebarPosition(documentSwiped);
      if (sidebarMovement > 0) {
        SidebarJS.vendorify(this.component, 'transform', 'translate(0, 0)');
        SidebarJS.vendorify(this.component, 'transition', 'none');
        this.openMovement = sidebarMovement * (this.hasLeftPosition() ? -1 : 1);
        this.moveSidebar(this.openMovement);
      }
    }
  }

  private onSwipeOpenEnd(): void {
    if (this.openMovement) {
      delete this.openMovement;
      this.component.removeAttribute('style');
      this.onTouchEnd();
    }
  }

  private getSidebarPosition(swiped: number): number {
    return (this.container.clientWidth - (this.hasLeftPosition() ? swiped : -swiped));
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
    return elem && (value === true || value === false) ? elem.sidebarjsListener = value : !!elem.sidebarjsListener;
  }

  static get version(): string {
    return '1.10.0';
  }
}
