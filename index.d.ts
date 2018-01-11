export as namespace SidebarJS;
export = SidebarJS;

declare namespace SidebarJS {
  export class SidebarElement implements SidebarBase {
    constructor(options?: SidebarConfig);

    public component: HTMLElement;
    public container: HTMLElement;
    public backdrop: HTMLElement;
    public documentMinSwipeX: number;
    public documentSwipeRange: number;
    public nativeSwipe: boolean;
    public nativeSwipeOpen: boolean;
    public position: SidebarPosition;
    private initialTouch;
    private touchMoveSidebar;
    private openMovement;

    public toggle(): void;

    public open(): void;

    public close(): void;

    public isVisible(): boolean;

    public setPosition(position: SidebarPosition): void;

    public addAttrsEventsListeners(sidebarName: string): void;

    private hasLeftPosition();

    private hasRightPosition();

    private transcludeContent();

    private addNativeGestures();

    private addNativeOpenGestures();

    private onTouchStart(e: TouchEvent);

    private onTouchMove(e: TouchEvent);

    private onTouchEnd();

    private moveSidebar(movement: number);

    private changeBackdropOpacity(movement: number);

    private onSwipeOpenStart(e: TouchEvent);

    private onSwipeOpenMove(e: TouchEvent);

    private onSwipeOpenEnd();

    private getSidebarPosition(swiped: number);

    private targetElementIsBackdrop(e: TouchEvent);

    public static create(element: string): HTMLElement;

    public static vendorify(el: HTMLElement, prop: string, val: string): HTMLElement;

    public static elemHasListener(elem: HTMLSidebarElement, value?: boolean): boolean;
  }

  export class SidebarService implements SidebarBase {
    constructor();

    private instances: any;

    public create(options: SidebarConfig): SidebarElement;

    public open(sidebarName?: string): void;

    public close(sidebarName?: string): void;

    public toggle(sidebarName?: string): void;

    public isVisible(sidebarName?: string): boolean;

    public setPosition(position: SidebarPosition, sidebarName?: string): void;

    public elemHasListener(elem: HTMLSidebarElement, value?: boolean): boolean;

    public destroy(sidebarName?: string): void;
  }

  export interface SidebarBase {
    open(): void;
    close(): void;
    toggle(): void;
    isVisible(): boolean;
    setPosition(position: SidebarPosition): void;
  }

  export interface SidebarConfig {
    component?: HTMLElement;
    container?: HTMLElement;
    backdrop?: HTMLElement;
    documentMinSwipeX?: number;
    documentSwipeRange?: number;
    nativeSwipe?: boolean;
    nativeSwipeOpen?: boolean;
    position?: SidebarPosition;
    backdropOpacity?: number;
  }

  export interface HTMLSidebarElement extends HTMLElement {
    sidebarjsListener?: boolean;
  }

  export type SidebarPosition = 'left' | 'right';
}
