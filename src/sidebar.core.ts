export const SIDEBARJS = 'sidebarjs';
export const SIDEBARJS_CONTENT = 'sidebarjs-content';
export const IS_VISIBLE = `${SIDEBARJS}--is-visible`;
export const IS_MOVING = `${SIDEBARJS}--is-moving`;
export const LEFT_POSITION: SidebarPosition = 'left';
export const RIGHT_POSITION: SidebarPosition = 'right';
export const POSITIONS: SidebarPosition[] = [LEFT_POSITION, RIGHT_POSITION];
export const EVENT_LISTENER_OPTIONS = {passive: true} as EventListenerOptions;

export const DEFAULT_CONFIG: SidebarConfig = {
  documentMinSwipeX: 10,
  documentSwipeRange: 40,
  responsive: false,
  position: 'left',
  backdropOpacity: 0.3,
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
  responsive?: boolean;
  mainContent?: HTMLElement;
  position?: SidebarPosition;
  backdropOpacity?: number;
  onOpen?: () => void;
  onClose?: () => void;
  onChangeVisibility?: (changes: {isVisible: boolean}) => void;
}

export interface HTMLSidebarElement extends HTMLElement {
  sidebarjsListener?: boolean;
}

export type SidebarPosition = 'left' | 'right';

export function isStyleMapSupported(): boolean {
  return Boolean(window.CSS && (window.CSS as any).number);
}

export function create(element: string): HTMLElement {
  const el = document.createElement('div');
  el.setAttribute(element, '');
  return el;
}

export function elemHasListener(elem: HTMLSidebarElement, value?: boolean): boolean {
  return elem && typeof value === 'boolean' ? (elem.sidebarjsListener = value) : !!elem.sidebarjsListener;
}

export function shouldDefineMainContent(mainContent?: HTMLElement): HTMLElement {
  if (mainContent) {
    mainContent.setAttribute(SIDEBARJS_CONTENT, '');
    return mainContent;
  } else {
    return document.querySelector(`[${SIDEBARJS_CONTENT}]`) as HTMLElement;
  }
}

export function forEachActionElement(sidebarName: string, func: (element: HTMLElement, action: string) => void): void {
  const actions = ['toggle', 'open', 'close'];
  for (let i = 0; i < actions.length; i++) {
    const elements = document.querySelectorAll(`[${SIDEBARJS}-${actions[i]}="${sidebarName}"]`);
    for (let j = 0; j < elements.length; j++) {
      func(elements[j] as HTMLElement, actions[i]);
    }
  }
}

export function targetElementIsBackdrop(e: TouchEvent): boolean {
  return (e.target as HTMLElement).hasAttribute(`${SIDEBARJS}-backdrop`);
}
