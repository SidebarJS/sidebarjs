import {
  create, DEFAULT_CONFIG,
  elemHasListener, EVENT_LISTENER_OPTIONS,
  forEachActionElement,
  IS_MOVING,
  IS_VISIBLE,
  isStyleMapSupported,
  LEFT_POSITION,
  POSITIONS,
  RIGHT_POSITION,
  shouldDefineMainContent,
  SidebarBase,
  SidebarConfig,
  SIDEBARJS,
  SIDEBARJS_CONTENT,
  SidebarPosition,
  targetElementIsBackdrop,
} from './sidebar.core';

export class SidebarElement implements SidebarBase {
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

  constructor(options: SidebarConfig = {}) {
    const config = {...DEFAULT_CONFIG, ...options};
    const hasCustomTransclude = config.container && config.backdrop;
    this.component = config.component || (document.querySelector(`[${SIDEBARJS}]`) as HTMLElement);
    this.container = hasCustomTransclude ? config.container : create(`${SIDEBARJS}-container`);
    this.backdrop = hasCustomTransclude ? config.backdrop : create(`${SIDEBARJS}-backdrop`);
    this.documentMinSwipeX = config.documentMinSwipeX;
    this.documentSwipeRange = config.documentSwipeRange;
    this.nativeSwipe = config.nativeSwipe !== false;
    this.nativeSwipeOpen = config.nativeSwipeOpen !== false;
    this.isStyleMapSupported = isStyleMapSupported();
    this.responsive = Boolean(config.responsive);
    this.mainContent = shouldDefineMainContent(config.mainContent);
    this.backdropOpacity = config.backdropOpacity;
    this.backdropOpacityRatio = 1 / config.backdropOpacity;
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

    this.setPosition(config.position);
    this.addAttrsEventsListeners(this.component.getAttribute(SIDEBARJS));
    this.addTransitionListener();
    this.backdrop.addEventListener('click', this.close, EVENT_LISTENER_OPTIONS);
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
    this.container.removeEventListener('transitionend', this._onTransitionEnd, EVENT_LISTENER_OPTIONS);
    this.backdrop.removeEventListener('click', this.close, EVENT_LISTENER_OPTIONS);
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
    forEachActionElement(sidebarName, (element, action) => {
      if (!elemHasListener(element)) {
        element.addEventListener('click', this[action], EVENT_LISTENER_OPTIONS);
        elemHasListener(element, true);
      }
    });
  }

  public removeAttrsEventsListeners(sidebarName: string): void {
    forEachActionElement(sidebarName, (element, action) => {
      if (elemHasListener(element as HTMLElement)) {
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
    this.container.addEventListener('transitionend', this._onTransitionEnd, EVENT_LISTENER_OPTIONS);
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
    this.component.addEventListener('touchstart', this._onTouchStart, EVENT_LISTENER_OPTIONS);
    this.component.addEventListener('touchmove', this._onTouchMove, EVENT_LISTENER_OPTIONS);
    this.component.addEventListener('touchend', this._onTouchEnd, EVENT_LISTENER_OPTIONS);
  }

  private removeNativeGestures(): void {
    this.component.removeEventListener('touchstart', this._onTouchStart, EVENT_LISTENER_OPTIONS);
    this.component.removeEventListener('touchmove', this._onTouchMove, EVENT_LISTENER_OPTIONS);
    this.component.removeEventListener('touchend', this._onTouchEnd, EVENT_LISTENER_OPTIONS);
  }

  private addNativeOpenGestures(): void {
    document.addEventListener('touchstart', this._onSwipeOpenStart, EVENT_LISTENER_OPTIONS);
    document.addEventListener('touchmove', this._onSwipeOpenMove, EVENT_LISTENER_OPTIONS);
    document.addEventListener('touchend', this._onSwipeOpenEnd, EVENT_LISTENER_OPTIONS);
  }

  private removeNativeOpenGestures(): void {
    document.removeEventListener('touchstart', this._onSwipeOpenStart, EVENT_LISTENER_OPTIONS);
    document.removeEventListener('touchmove', this._onSwipeOpenMove, EVENT_LISTENER_OPTIONS);
    document.removeEventListener('touchend', this._onSwipeOpenEnd, EVENT_LISTENER_OPTIONS);
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

  private setResponsive(): void {
    if (!this.responsive && this.mainContent) {
      throw new Error(`You provide a [${SIDEBARJS_CONTENT}] element without set {responsive: true}`);
    }
    if (this.responsive && !this.mainContent) {
      throw new Error(`You have set {responsive: true} without provide a [${SIDEBARJS_CONTENT}] element`);
    }
    this.component.classList.add('sidebarjs--responsive');
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
