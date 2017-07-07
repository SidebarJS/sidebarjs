export as namespace SidebarJS;

export = SidebarJS;

declare class SidebarJS implements SidebarJS.SidebarBase {
  constructor(options?: SidebarJS.SidebarConfig);

  component: HTMLElement;
  container: HTMLElement;
  background: HTMLElement;
  documentMinSwipeX: number;
  documentSwipeRange: number;
  nativeSwipe: boolean;
  nativeSwipeOpen: boolean;
  position: string;
  private initialTouch;
  private touchMoveSidebar;
  private openMovement;

  toggle(): void;

  open(): void;

  close(): void;

  isVisible(): boolean;

  setPosition(position: string): void;

  addAttrsEventsListeners(sidebarName: string): void;

  private hasLeftPosition();

  private hasRightPosition();

  private transcludeContent();

  private addNativeGestures();

  private addNativeOpenGestures();

  private onTouchStart(e);

  private onTouchMove(e);

  private onTouchEnd();

  private moveSidebar(movement);

  private changeBackgroundOpacity(movement);

  private onSwipeOpenStart(e);

  private onSwipeOpenMove(e);

  private onSwipeOpenEnd();

  private getSidebarPosition(swiped);

  private targetElementIsBackground(e);

  static create(element: string): HTMLElement;

  static vendorify(el: HTMLElement, prop: string, val: string): HTMLElement;

  static elemHasListener(elem: SidebarJS.HTMLSidebarElement, value?: boolean): boolean;

  static readonly version: string;
}


declare namespace SidebarJS {
  export interface SidebarBase {
    open(): void;
    close(): void;
    toggle(): void;
    isVisible(): boolean;
    setPosition(position: string): void;
  }

  export interface SidebarConfig {
    component?: HTMLElement;
    container?: HTMLElement;
    background?: HTMLElement;
    documentMinSwipeX?: number;
    documentSwipeRange?: number;
    nativeSwipe?: boolean;
    nativeSwipeOpen?: boolean;
    position?: string;
  }

  export interface HTMLSidebarElement extends HTMLElement {
    sidebarjsListener?: boolean;
  }
}
