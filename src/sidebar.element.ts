import {
  create,
  DEFAULT_CONFIG,
  elemHasListener,
  EVENT_LISTENER_OPTIONS,
  forEachActionElement,
  IS_MOVING,
  IS_VISIBLE,
  isStyleMapSupported,
  MapGestureEvent,
  POSITIONS,
  shouldDefineMainContent,
  shouldInvokeFunction,
  SidebarBase,
  SidebarChangeEvent,
  SidebarConfig,
  SIDEBARJS,
  SIDEBARJS_CONTENT,
  SIDEBARJS_TRANSITION_END,
  SIDEBARJS_TRANSITION_START,
  SidebarPosition,
  targetElementIsBackdrop,
  TOUCH_END,
  TOUCH_MOVE,
  TOUCH_START,
} from './sidebar.core';

type CSSStyleProperties = keyof Omit<
  CSSStyleDeclaration,
  number | 'length' | 'parentRule' | '[Symbol.iterator]' | 'getPropertyPriority' | 'getPropertyValue' | 'item' | 'removeProperty' | 'setProperty'
>;
type CSSStyleValues = CSSStyleDeclaration[CSSStyleProperties] & string;

export class SidebarElement implements SidebarBase {
  public position?: SidebarPosition;
  public readonly component: HTMLElement;
  public readonly container: HTMLElement;
  public readonly backdrop: HTMLElement;
  public readonly documentMinSwipeX: number;
  public readonly documentSwipeRange: number;
  public readonly nativeSwipe: boolean;
  public readonly nativeSwipeOpen: boolean;
  public readonly responsive: boolean;
  private initialTouch?: number | null;
  private touchMoveSidebar?: number | null;
  private openMovement?: number | null;
  private _wasVisible?: boolean;
  private readonly isStyleMapSupported: boolean;
  private readonly backdropOpacity: number;
  private readonly backdropOpacityRatio: number;
  private readonly mainContent: HTMLElement;
  private readonly _emitOnOpen?: CallableFunction;
  private readonly _emitOnClose?: CallableFunction;
  private readonly _emitOnChangeVisibility?: (changes: SidebarChangeEvent) => void;

  constructor(options: SidebarConfig = {}) {
    const config = {...DEFAULT_CONFIG, ...options};
    const hasCustomTransclude = config.container && config.backdrop;
    this.component = config.component || (document.querySelector(`[${SIDEBARJS}]`) as HTMLElement);
    this.container = hasCustomTransclude ? config.container! : create(`${SIDEBARJS}-container`);
    this.backdrop = hasCustomTransclude ? config.backdrop! : create(`${SIDEBARJS}-backdrop`);
    this.documentMinSwipeX = config.documentMinSwipeX!;
    this.documentSwipeRange = config.documentSwipeRange!;
    this.nativeSwipe = config.nativeSwipe !== false;
    this.nativeSwipeOpen = config.nativeSwipeOpen !== false;
    this.isStyleMapSupported = isStyleMapSupported();
    this.responsive = Boolean(config.responsive);
    this.mainContent = shouldDefineMainContent(config.mainContent);
    this.backdropOpacity = config.backdropOpacity!;
    this.backdropOpacityRatio = 1 / config.backdropOpacity!;
    this._emitOnOpen = config.onOpen;
    this._emitOnClose = config.onClose;
    this._emitOnChangeVisibility = config.onChangeVisibility;

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

    this.setPosition(config.position!);
    this.addAttrsEventsListeners(this.component.getAttribute(SIDEBARJS)!);
    this.addTransitionListener();
    this.backdrop.addEventListener('click', this.close, EVENT_LISTENER_OPTIONS);
  }

  public toggle = (): void => {
    this.isVisible() ? this.close() : this.open();
  };

  public open = (): void => {
    this.addComponentClass(IS_VISIBLE);
    this.setBackdropOpacity(this.backdropOpacity);
  };

  public close = (): void => {
    this.removeComponentClass(IS_VISIBLE);
    this.clearStyle(this.backdrop);
  };

  public isVisible(): boolean {
    return this.component.classList.contains(IS_VISIBLE);
  }

  public destroy(): void {
    this.removeNativeGestures();
    this.container.removeEventListener('transitionstart', this._onTransitionStart);
    this.container.removeEventListener('transitionend', this._onTransitionEnd);
    this.backdrop.removeEventListener('click', this.close);
    this.removeNativeOpenGestures();
    this.removeAttrsEventsListeners(this.component.getAttribute(SIDEBARJS)!);
    this.removeComponentClassPosition();
    while (this.container.firstElementChild) {
      this.component.appendChild(this.container.firstElementChild);
    }
    this.component.removeChild(this.container);
    this.component.removeChild(this.backdrop);
    Object.keys(this).forEach((key) => ((this as any)[key] = null));
  }

  public setPosition(position: SidebarPosition): void {
    this.addComponentClass(IS_MOVING);
    this.position = POSITIONS.indexOf(position) >= 0 ? position : SidebarPosition.Left;
    const resetMainContent = (document.querySelectorAll(`[${SIDEBARJS}]`) || []).length === 1;
    this.removeComponentClassPosition(resetMainContent);
    this.addComponentClass(`${SIDEBARJS}--${this.position}`);
    if (this.responsive && this.mainContent) {
      this.mainContent.classList.add(`${SIDEBARJS_CONTENT}--${this.position}`);
    }
    setTimeout(() => this.component && this.removeComponentClass(IS_MOVING), 200);
  }

  public addAttrsEventsListeners(sidebarName: string): void {
    forEachActionElement(sidebarName, (element, action) => {
      if (!elemHasListener(element)) {
        element.addEventListener('click', this[action], EVENT_LISTENER_OPTIONS);
        elemHasListener(element, true);
      }
    });
  }

  public removeAttrsEventsListeners(sidebarName: string): void {
    forEachActionElement(sidebarName, (element, action) => {
      if (elemHasListener(element)) {
        element.removeEventListener('click', this[action]);
        elemHasListener(element, false);
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
    const swipeDirection = -(this.initialTouch! - e.touches[0].clientX);
    const sidebarMovement = this.container.clientWidth + (this.hasLeftPosition() ? swipeDirection : -swipeDirection);
    if (sidebarMovement <= this.container.clientWidth) {
      this.touchMoveSidebar = Math.abs(swipeDirection);
      this.moveSidebar(swipeDirection);
    }
  };

  private _onTouchEnd = (): void => {
    this.removeComponentClass(IS_MOVING);
    this.clearStyle(this.container);
    this.clearStyle(this.backdrop);
    this.touchMoveSidebar! > this.container.clientWidth / 3.5 ? this.close() : this.open();
    this.initialTouch = null;
    this.touchMoveSidebar = null;
  };

  private _onSwipeOpenStart = (e: TouchEvent): void => {
    if (targetElementIsBackdrop(e)) {
      return;
    }
    const touchPositionX = e.touches[0].clientX;
    const documentTouch = this.hasLeftPosition() ? touchPositionX : document.body.clientWidth - touchPositionX;
    if (documentTouch < this.documentSwipeRange) {
      this._onTouchStart(e);
    }
  };

  private _onSwipeOpenMove = (e: TouchEvent): void => {
    if (!targetElementIsBackdrop(e) && this.initialTouch && !this.isVisible()) {
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

  private _onTransitionStart = (): void => {
    const {open, close} = this.getTransitionType();
    if (open || close) {
      this.toggleTransitionClass(true);
    }
  };

  private _onTransitionEnd = (): void => {
    const {open, close, isVisible} = this.getTransitionType();
    if (open || close) {
      this.toggleTransitionClass(false);
    }
    if (open) {
      this._wasVisible = true;
      shouldInvokeFunction(this._emitOnOpen);
    } else if (close) {
      this._wasVisible = false;
      shouldInvokeFunction(this._emitOnClose);
    }
    if (this._emitOnChangeVisibility) {
      this._emitOnChangeVisibility({isVisible});
    }
  };

  private getTransitionType() {
    const isVisible = this.isVisible();
    const open = isVisible && !this._wasVisible;
    const close = !isVisible && this._wasVisible;
    return {open, close, isVisible};
  }

  private toggleTransitionClass(isStart: boolean) {
    this.toggleComponentClass(SIDEBARJS_TRANSITION_END, !isStart);
    this.toggleComponentClass(SIDEBARJS_TRANSITION_START, isStart);
  }

  private addTransitionListener(): void {
    this._wasVisible = this.isVisible();
    this.container.addEventListener('transitionstart', this._onTransitionStart, EVENT_LISTENER_OPTIONS);
    this.container.addEventListener('transitionend', this._onTransitionEnd, EVENT_LISTENER_OPTIONS);
  }

  private removeComponentClassPosition(resetMainContent?: boolean): void {
    for (let i = 0; i < POSITIONS.length; i++) {
      this.removeComponentClass(`${SIDEBARJS}--${POSITIONS[i]}`);
      if (resetMainContent && this.mainContent) {
        this.mainContent.classList.remove(`${SIDEBARJS_CONTENT}--${POSITIONS[i]}`);
      }
    }
  }

  private hasLeftPosition(): boolean {
    return this.position === SidebarPosition.Left;
  }

  private hasRightPosition(): boolean {
    return this.position === SidebarPosition.Right;
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

  private nativeGestures: MapGestureEvent = new Map([
    [TOUCH_START, this._onTouchStart],
    [TOUCH_MOVE, this._onTouchMove],
    [TOUCH_END, this._onTouchEnd],
  ]);

  private nativeOpenGestures: MapGestureEvent = new Map([
    [TOUCH_START, this._onSwipeOpenStart],
    [TOUCH_MOVE, this._onSwipeOpenMove],
    [TOUCH_END, this._onSwipeOpenEnd],
  ]);

  private addNativeGestures(): void {
    this.nativeGestures.forEach((action, event) => {
      this.component.addEventListener(event, action, EVENT_LISTENER_OPTIONS);
    });
  }

  private removeNativeGestures(): void {
    this.nativeGestures.forEach((action, event) => {
      this.component.removeEventListener(event, action);
    });
  }

  private addNativeOpenGestures(): void {
    this.nativeOpenGestures.forEach((action, event) => {
      document.addEventListener(event, action, EVENT_LISTENER_OPTIONS);
    });
  }

  private removeNativeOpenGestures(): void {
    this.nativeOpenGestures.forEach((action, event) => {
      document.removeEventListener(event, action);
    });
  }

  private moveSidebar(movement: number): void {
    this.addComponentClass(IS_MOVING);
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

  private setResponsive(): void {
    if (!this.responsive && this.mainContent) {
      throw new Error(`You provide a [${SIDEBARJS_CONTENT}] element without set {responsive: true}`);
    }
    if (this.responsive && !this.mainContent) {
      throw new Error(`You have set {responsive: true} without provide a [${SIDEBARJS_CONTENT}] element`);
    }
    this.addComponentClass('sidebarjs--responsive');
  }

  private applyStyle(el: HTMLElement, prop: CSSStyleProperties, val: CSSStyleValues, vendorify?: boolean): void {
    if (this.isStyleMapSupported) {
      (el as any).attributeStyleMap.set(prop, val);
    } else {
      el.style[prop] = val;
      if (vendorify) {
        const vendor = ('webkit' + prop.charAt(0).toUpperCase() + prop.slice(1)) as CSSStyleProperties;
        el.style[vendor] = val;
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

  private addComponentClass(className: string) {
    this.component.classList.add(className);
  }

  private removeComponentClass(className: string) {
    this.component.classList.remove(className);
  }

  private toggleComponentClass(className: string, force?: boolean) {
    this.component.classList.toggle(className, force);
  }
}
