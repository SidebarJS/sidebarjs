import {HTMLSidebarElement, SidebarBase, SidebarConfig, SidebarPosition} from './index';

const SIDEBARJS: string = 'sidebarjs';
const SIDEBARJS_CONTENT: string = 'sidebarjs-content';
const IS_VISIBLE: string = `${SIDEBARJS}--is-visible`;
const IS_MOVING: string = `${SIDEBARJS}--is-moving`;
const LEFT_POSITION: SidebarPosition = 'left';
const RIGHT_POSITION: SidebarPosition = 'right';
const POSITIONS: SidebarPosition[] = [LEFT_POSITION, RIGHT_POSITION];

export class SidebarElement implements SidebarBase {
  public static isStyleMapSupported(): boolean {
    return Boolean((window as any).CSS && (CSS as any).number);
  }

  public static create(element: string): HTMLElement {
    const el = document.createElement('div');
    el.setAttribute(element, '');
    return el;
  }

  public static elemHasListener(elem: HTMLSidebarElement, value?: boolean): boolean {
    return elem && typeof value === 'boolean' ? (elem.sidebarjsListener = value) : !!elem.sidebarjsListener;
  }

  public position: SidebarPosition;
  public readonly component: HTMLElement;
  public readonly container: HTMLElement;
  public readonly backdrop: HTMLElement;
  public readonly documentMinSwipeX: number;
  public readonly documentSwipeRange: number;
  public readonly nativeSwipe: boolean;
  public readonly nativeSwipeOpen: boolean;
  public readonly responsive: boolean;
  private initialTouch: number;
  private touchMoveSidebar: number;
  private openMovement: number;
  private _wasVisible: boolean;
  private readonly isStyleMapSupported: boolean;
  private readonly backdropOpacity: number;
  private readonly backdropOpacityRatio: number;
  private readonly mainContent: HTMLElement;
  private readonly _emitOnOpen: () => void;
  private readonly _emitOnClose: () => void;
  private readonly _emitOnChangeVisibility: (changes: {isVisible: boolean}) => void;

  constructor(config: SidebarConfig = {}) {
    const {
      component,
      container,
      backdrop,
      documentMinSwipeX = 10,
      documentSwipeRange = 40,
      nativeSwipe,
      nativeSwipeOpen,
      responsive = false,
      mainContent,
      position = 'left',
      backdropOpacity = 0.3,
      onOpen,
      onClose,
      onChangeVisibility,
    } = config;
    const hasCustomTransclude = container && backdrop;
    this.component = component || (document.querySelector(`[${SIDEBARJS}]`) as HTMLElement);
    this.container = hasCustomTransclude ? container : SidebarElement.create(`${SIDEBARJS}-container`);
    this.backdrop = hasCustomTransclude ? backdrop : SidebarElement.create(`${SIDEBARJS}-backdrop`);
    this.documentMinSwipeX = documentMinSwipeX;
    this.documentSwipeRange = documentSwipeRange;
    this.nativeSwipe = nativeSwipe !== false;
    this.nativeSwipeOpen = nativeSwipeOpen !== false;
    this.isStyleMapSupported = SidebarElement.isStyleMapSupported();
    this.responsive = Boolean(responsive);
    this.mainContent = this.shouldDefineMainContent(mainContent);
    this.backdropOpacity = backdropOpacity;
    this.backdropOpacityRatio = 1 / backdropOpacity;
    this._emitOnOpen = onOpen;
    this._emitOnClose = onClose;
    this._emitOnChangeVisibility = onChangeVisibility;

    if (!hasCustomTransclude) {
      try {
        this.transcludeContent();
      } catch (e) {
        throw new Error('You must define an element with [sidebarjs] attribute');
      }
    }

    this.setSwipeGestures(true);

    if (this.responsive || this.mainContent) {
      this.setResponsive();
    }

    this.setPosition(position);
    this.addAttrsEventsListeners(this.component.getAttribute(SIDEBARJS));
    this.addTransitionListener();
    this.backdrop.addEventListener('click', this.close, {passive: true});
  }

  public toggle = (): void => {
    this.isVisible() ? this.close() : this.open();
  };

  public open = (): void => {
    this.component.classList.add(IS_VISIBLE);
    this.setBackdropOpacity(this.backdropOpacity);
  };

  public close = (): void => {
    this.component.classList.remove(IS_VISIBLE);
    this.clearStyle(this.backdrop);
  };

  public isVisible(): boolean {
    return this.component.classList.contains(IS_VISIBLE);
  }

  public destroy(): void {
    this.removeNativeGestures();
    this.container.removeEventListener('transitionend', this._onTransitionEnd, {passive: true} as any);
    this.backdrop.removeEventListener('click', this.close, {passive: true} as any);
    this.removeNativeOpenGestures();
    this.removeAttrsEventsListeners(this.component.getAttribute(SIDEBARJS));
    this.removeComponentClassPosition();
    while (this.container.firstElementChild) {
      this.component.appendChild(this.container.firstElementChild);
    }
    this.component.removeChild(this.container);
    this.component.removeChild(this.backdrop);
    Object.keys(this).forEach((key) => (this[key] = null));
  }

  public setPosition(position: SidebarPosition): void {
    this.component.classList.add(IS_MOVING);
    this.position = POSITIONS.indexOf(position) >= 0 ? position : LEFT_POSITION;
    const resetMainContent = (document.querySelectorAll(`[${SIDEBARJS}]`) || []).length === 1;
    this.removeComponentClassPosition(resetMainContent);
    this.component.classList.add(`${SIDEBARJS}--${this.position}`);
    if (this.responsive && this.mainContent) {
      this.mainContent.classList.add(`${SIDEBARJS_CONTENT}--${this.position}`);
    }
    setTimeout(() => this.component && this.component.classList.remove(IS_MOVING), 200);
  }

  public addAttrsEventsListeners(sidebarName: string): void {
    this.forEachActionElement(sidebarName, (element, action) => {
      if (!SidebarElement.elemHasListener(element)) {
        element.addEventListener('click', this[action], {passive: true});
        SidebarElement.elemHasListener(element, true);
      }
    });
  }

  public removeAttrsEventsListeners(sidebarName: string): void {
    this.forEachActionElement(sidebarName, (element, action) => {
      if (SidebarElement.elemHasListener(element as HTMLElement)) {
        element.removeEventListener('click', this[action]);
        SidebarElement.elemHasListener(element, false);
      }
    });
  }

  public setSwipeGestures(value: boolean): void {
    if (typeof value !== 'boolean') {
      throw new Error(`You provided a ${typeof value} value but setSwipeGestures needs a boolean value.`);
    }
    if (this.nativeSwipe) {
      value ? this.addNativeGestures() : this.removeNativeGestures();
      if (this.nativeSwipeOpen) {
        value ? this.addNativeOpenGestures() : this.removeNativeOpenGestures();
      }
    }
  }

  private _onTouchStart = (e: TouchEvent): void => {
    this.initialTouch = e.touches[0].pageX;
  };

  private _onTouchMove = (e: TouchEvent): void => {
    const swipeDirection = -(this.initialTouch - e.touches[0].clientX);
    const sidebarMovement = this.container.clientWidth + (this.hasLeftPosition() ? swipeDirection : -swipeDirection);
    if (sidebarMovement <= this.container.clientWidth) {
      this.touchMoveSidebar = Math.abs(swipeDirection);
      this.moveSidebar(swipeDirection);
    }
  };

  private _onTouchEnd = (): void => {
    this.component.classList.remove(IS_MOVING);
    this.clearStyle(this.container);
    this.clearStyle(this.backdrop);
    this.touchMoveSidebar > this.container.clientWidth / 3.5 ? this.close() : this.open();
    this.initialTouch = null;
    this.touchMoveSidebar = null;
  };

  private _onSwipeOpenStart = (e: TouchEvent): void => {
    if (this.targetElementIsBackdrop(e)) {
      return;
    }
    const touchPositionX = e.touches[0].clientX;
    const documentTouch = this.hasLeftPosition() ? touchPositionX : document.body.clientWidth - touchPositionX;
    if (documentTouch < this.documentSwipeRange) {
      this._onTouchStart(e);
    }
  };

  private _onSwipeOpenMove = (e: TouchEvent): void => {
    if (!this.targetElementIsBackdrop(e) && this.initialTouch && !this.isVisible()) {
      const documentSwiped = e.touches[0].clientX - this.initialTouch;
      const hasLeftPosition = this.hasLeftPosition();
      const swipeX = hasLeftPosition ? documentSwiped : -documentSwiped;
      const sidebarMovement = this.container.clientWidth - swipeX;
      if (sidebarMovement > 0 && swipeX >= this.documentMinSwipeX) {
        this.openMovement = hasLeftPosition ? -sidebarMovement : sidebarMovement;
        this.moveSidebar(this.openMovement);
      }
    }
  };

  private _onSwipeOpenEnd = (): void => {
    if (this.openMovement) {
      this.openMovement = null;
      this._onTouchEnd();
    }
  };

  private _onTransitionEnd = (): void => {
    const isVisible = this.isVisible();
    if (isVisible && !this._wasVisible) {
      this._wasVisible = true;
      if (this._emitOnOpen) {
        this._emitOnOpen();
      }
    } else if (!isVisible && this._wasVisible) {
      this._wasVisible = false;
      if (this._emitOnClose) {
        this._emitOnClose();
      }
    }
    if (this._emitOnChangeVisibility) {
      this._emitOnChangeVisibility({isVisible});
    }
  };

  private addTransitionListener(): void {
    this._wasVisible = this.isVisible();
    this.container.addEventListener('transitionend', this._onTransitionEnd, {passive: true} as any);
  }

  private forEachActionElement(sidebarName: string, func: (element: HTMLElement, action: string) => void): void {
    const actions = ['toggle', 'open', 'close'];
    for (let i = 0; i < actions.length; i++) {
      const elements = document.querySelectorAll(`[${SIDEBARJS}-${actions[i]}="${sidebarName}"]`);
      for (let j = 0; j < elements.length; j++) {
        func(elements[j] as HTMLElement, actions[i]);
      }
    }
  }

  private removeComponentClassPosition(resetMainContent?: boolean): void {
    for (let i = 0; i < POSITIONS.length; i++) {
      this.component.classList.remove(`${SIDEBARJS}--${POSITIONS[i]}`);
      if (resetMainContent && this.mainContent) {
        this.mainContent.classList.remove(`${SIDEBARJS_CONTENT}--${POSITIONS[i]}`);
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
    while (this.component.firstChild) {
      this.container.appendChild(this.component.firstChild);
    }
    while (this.component.firstChild) {
      this.component.removeChild(this.component.firstChild);
    }
    this.component.appendChild(this.container);
    this.component.appendChild(this.backdrop);
  }

  private addNativeGestures(): void {
    this.component.addEventListener('touchstart', this._onTouchStart, {passive: true});
    this.component.addEventListener('touchmove', this._onTouchMove, {passive: true});
    this.component.addEventListener('touchend', this._onTouchEnd, {passive: true});
  }

  private removeNativeGestures(): void {
    this.component.removeEventListener('touchstart', this._onTouchStart, {passive: true} as any);
    this.component.removeEventListener('touchmove', this._onTouchMove, {passive: true} as any);
    this.component.removeEventListener('touchend', this._onTouchEnd, {passive: true} as any);
  }

  private addNativeOpenGestures(): void {
    document.addEventListener('touchstart', this._onSwipeOpenStart, {passive: true});
    document.addEventListener('touchmove', this._onSwipeOpenMove, {passive: true});
    document.addEventListener('touchend', this._onSwipeOpenEnd, {passive: true});
  }

  private removeNativeOpenGestures(): void {
    document.removeEventListener('touchstart', this._onSwipeOpenStart, {passive: true} as any);
    document.removeEventListener('touchmove', this._onSwipeOpenMove, {passive: true} as any);
    document.removeEventListener('touchend', this._onSwipeOpenEnd, {passive: true} as any);
  }

  private moveSidebar(movement: number): void {
    this.component.classList.add(IS_MOVING);
    this.applyStyle(this.container, 'transform', `translate(${movement}px, 0)`, true);
    this.updateBackdropOpacity(movement);
  }

  private updateBackdropOpacity(movement: number): void {
    const swipeProgress = 1 - Math.abs(movement) / this.container.clientWidth;
    const opacity = swipeProgress / this.backdropOpacityRatio;
    this.setBackdropOpacity(opacity);
  }

  private setBackdropOpacity(opacity: number): void {
    this.applyStyle(this.backdrop, 'opacity', opacity.toString());
  }

  private targetElementIsBackdrop(e: TouchEvent): boolean {
    return (e.target as HTMLElement).hasAttribute(`${SIDEBARJS}-backdrop`);
  }

  private setResponsive(): void {
    if (!this.responsive && this.mainContent) {
      throw new Error(`You provide a [${SIDEBARJS_CONTENT}] element without set {responsive: true}`);
    }
    if (this.responsive && !this.mainContent) {
      throw new Error(`You have set {responsive: true} without provide a [${SIDEBARJS_CONTENT}] element`);
    }
    this.component.classList.add('sidebarjs--responsive');
  }

  private shouldDefineMainContent(mainContent?: HTMLElement): HTMLElement {
    if (mainContent) {
      mainContent.setAttribute(SIDEBARJS_CONTENT, '');
      return mainContent;
    } else {
      return document.querySelector(`[${SIDEBARJS_CONTENT}]`) as HTMLElement;
    }
  }

  private applyStyle(el: HTMLElement, prop: string, val: string, vendorify?: boolean): void {
    if (this.isStyleMapSupported) {
      (el as any).attributeStyleMap.set(prop, val);
    } else {
      el.style[prop] = val;
      if (vendorify) {
        el.style['webkit' + prop.charAt(0).toUpperCase() + prop.slice(1)] = val;
      }
    }
  }

  private clearStyle(el: HTMLElement): void {
    if (this.isStyleMapSupported) {
      (el as any).attributeStyleMap.clear();
    } else {
      el.removeAttribute('style');
    }
  }
}
