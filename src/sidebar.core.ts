export const SIDEBARJS = 'sidebarjs';
export const SIDEBARJS_FALLBACK_NAME = '';
export const SIDEBARJS_CONTENT = 'sidebarjs-content';
export const SIDEBARJS_TRANSITION_START = 'sidebarjs--transition-start';
export const SIDEBARJS_TRANSITION_END = 'sidebarjs--transition-end';
export const IS_VISIBLE = `${SIDEBARJS}--is-visible`;
export const IS_MOVING = `${SIDEBARJS}--is-moving`;
export const POSITIONS: SidebarPosition[] = [SidebarPosition.Left, SidebarPosition.Right];
export const EVENT_LISTENER_OPTIONS: AddEventListenerOptions = {passive: true};

export const MediaQuery = {
  pattern: new RegExp(/((\d*\.?\d+\s*)(px|em|rem))/),
  DEFAULT_BREAKPOINT: '1025px',
  getValidBreakpoint(value: SidebarConfig['responsive']) {
    if (this.pattern.test(value as any)) {
      return value as string;
    }
    console.warn(`Provided invalid breakpoint value: ${value}, fallback to ${this.DEFAULT_BREAKPOINT}`);
    return this.DEFAULT_BREAKPOINT;
  },
};

export const enum SidebarPosition {
  Left = 'left',
  Right = 'right',
}

export const TOUCH_START = 'touchstart';
export const TOUCH_MOVE = 'touchmove';
export const TOUCH_END = 'touchend';

const ELEMENT_ACTIONS = ['toggle', 'open', 'close'] as const;

export interface SidebarChangeEvent {
  isVisible: boolean;
}

export type MapGestureEvent = Map<keyof GlobalEventHandlersEventMap, any>;

export const DEFAULT_CONFIG: SidebarConfig = {
  documentMinSwipeX: 10,
  documentSwipeRange: 40,
  responsive: false,
  position: SidebarPosition.Left,
  backdropOpacity: 0.3,
};

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
  responsive?: boolean | string;
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

export function forEachActionElement(sidebarName: string, func: (element: HTMLElement, action: typeof ELEMENT_ACTIONS[number]) => void): void {
  for (let i = 0; i < ELEMENT_ACTIONS.length; i++) {
    const action = ELEMENT_ACTIONS[i];
    const elements = document.querySelectorAll(`[${SIDEBARJS}-${action}="${sidebarName}"]`);
    for (let j = 0; j < elements.length; j++) {
      func(elements[j] as HTMLElement, action);
    }
  }
}

export function targetElementIsBackdrop(e: TouchEvent): boolean {
  return (e.target as HTMLElement).hasAttribute(`${SIDEBARJS}-backdrop`);
}

export function shouldInvokeFunction(fn?: CallableFunction) {
  if (fn) {
    fn();
  }
}
