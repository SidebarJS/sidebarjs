export as namespace SidebarJS;

export = SidebarJS;

declare class SidebarJS implements SidebarJS.SidebarBase {
  constructor(options?: SidebarJS.SidebarConfig);

  public component: HTMLElement;
  public container: HTMLElement;
  public background: HTMLElement;
  public documentMinSwipeX: number;
  public documentSwipeRange: number;
  public nativeSwipe: boolean;
  public nativeSwipeOpen: boolean;
  public position: string;
  private initialTouch;
  private touchMoveSidebar;
  private openMovement;

  public toggle(): void;

  public open(): void;

  public close(): void;

  public isVisible(): boolean;

  public setPosition(position: string): void;

  public addAttrsEventsListeners(sidebarName: string): void;

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

  public static create(element: string): HTMLElement;

  public static vendorify(el: HTMLElement, prop: string, val: string): HTMLElement;

  public static elemHasListener(elem: SidebarJS.HTMLSidebarElement, value?: boolean): boolean;

  public static readonly version: string;
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
