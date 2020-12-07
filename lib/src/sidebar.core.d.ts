export declare const SIDEBARJS = "sidebarjs";
export declare const SIDEBARJS_FALLBACK_NAME = "";
export declare const SIDEBARJS_CONTENT = "sidebarjs-content";
export declare const SIDEBARJS_TRANSITION_START = "sidebarjs--transition-start";
export declare const SIDEBARJS_TRANSITION_END = "sidebarjs--transition-end";
export declare const IS_VISIBLE: string;
export declare const IS_MOVING: string;
export declare const POSITIONS: SidebarPosition[];
export declare const EVENT_LISTENER_OPTIONS: AddEventListenerOptions;
export declare const enum SidebarPosition {
    Left = "left",
    Right = "right"
}
export declare const TOUCH_START = "touchstart";
export declare const TOUCH_MOVE = "touchmove";
export declare const TOUCH_END = "touchend";
export declare type MapGestureEvent = Map<keyof GlobalEventHandlersEventMap, any>;
export declare const DEFAULT_CONFIG: SidebarConfig;
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
    responsive?: boolean;
    mainContent?: HTMLElement;
    position?: SidebarPosition;
    backdropOpacity?: number;
    onOpen?: () => void;
    onClose?: () => void;
    onChangeVisibility?: (changes: {
        isVisible: boolean;
    }) => void;
}
export interface HTMLSidebarElement extends HTMLElement {
    sidebarjsListener?: boolean;
}
export declare function isStyleMapSupported(): boolean;
export declare function create(element: string): HTMLElement;
export declare function elemHasListener(elem: HTMLSidebarElement, value?: boolean): boolean;
export declare function shouldDefineMainContent(mainContent?: HTMLElement): HTMLElement;
export declare function forEachActionElement(sidebarName: string, func: (element: HTMLElement, action: string) => void): void;
export declare function targetElementIsBackdrop(e: TouchEvent): boolean;
export declare function shouldInvokeFunction(fn?: CallableFunction): void;
