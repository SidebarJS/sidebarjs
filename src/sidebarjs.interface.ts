export interface Sidebar {
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
