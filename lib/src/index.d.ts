export { SidebarElement } from './sidebarElement';
export { SidebarService } from './sidebarService';
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
export declare type SidebarPosition = 'left' | 'right';
