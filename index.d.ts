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
    public toggle: () => void;
    public open: () => void;
    public close: () => void;
    private initialTouch;
    private touchMoveSidebar;
    private openMovement;
    private __onTouchStart: (e: TouchEvent) => void;
    private __onTouchMove: (e: TouchEvent) => void;
    private __onTouchEnd: () => void;
    private __onSwipeOpenStart: (e: TouchEvent) => void;
    private __onSwipeOpenMove: (e: TouchEvent) => void;
    private __onSwipeOpenEnd: () => void;
    private __wasVisible: boolean;
    private __emitOnOpen: () => void;
    private __emitOnClose: () => void;
    private __emitOnChangeVisibility: (changes: { isVisible: boolean }) => void;

    public isVisible(): boolean;

    public destroy(): void;

    public setPosition(position: SidebarPosition): void;

    public addAttrsEventsListeners(sidebarName: string): void;

    public removeAttrsEventsListeners(sidebarName: string): void;

    private hasLeftPosition();

    private hasRightPosition();

    private transcludeContent();

    private addNativeGestures();

    private addNativeOpenGestures();

    private moveSidebar(movement: number);

    private changeBackdropOpacity(movement: number);

    private getSidebarPosition(swiped: number);

    private targetElementIsBackdrop(e: TouchEvent);

    private removeComponentClassPosition(): void;

    private forEachActionElement(sidebarName: string, func: (element: HTMLElement, action: string) => void): void;

    public static create(element: string): HTMLElement;

    public static vendorify(el: HTMLElement, prop: string, val: string): void;

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
    open: () => void;
    close: () => void;
    toggle: () => void;

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
    onOpen?: () => void;
    onClose?: () => void;
    onChangeVisibility?: (changes: { isVisible: boolean }) => void;
  }

  export interface HTMLSidebarElement extends HTMLElement {
    sidebarjsListener?: boolean;
  }

  export type SidebarPosition = 'left' | 'right';
}
