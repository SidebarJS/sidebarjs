export const SIDEBARJS = 'sidebarjs';
export const SIDEBARJS_FALLBACK_NAME = '';
export const SIDEBARJS_CONTENT = 'sidebarjs-content';
export const SIDEBARJS_TRANSITION_START = 'sidebarjs--transition-start';
export const SIDEBARJS_TRANSITION_END = 'sidebarjs--transition-end';
export const IS_VISIBLE = `${SIDEBARJS}--is-visible`;
export const IS_MOVING = `${SIDEBARJS}--is-moving`;
export const POSITIONS = ["left" /* SidebarPosition.Left */, "right" /* SidebarPosition.Right */];
export const EVENT_LISTENER_OPTIONS = { passive: true };
export const TOUCH_START = 'touchstart';
export const TOUCH_MOVE = 'touchmove';
export const TOUCH_END = 'touchend';
const ELEMENT_ACTIONS = ['toggle', 'open', 'close'];
export const DEFAULT_CONFIG = {
    documentMinSwipeX: 10,
    documentSwipeRange: 40,
    responsive: false,
    position: "left" /* SidebarPosition.Left */,
    backdropOpacity: 0.3,
};
export function isStyleMapSupported() {
    return Boolean(window.CSS && window.CSS.number);
}
export function create(element) {
    const el = document.createElement('div');
    el.setAttribute(element, '');
    return el;
}
export function elemHasListener(elem, value) {
    return elem && typeof value === 'boolean' ? (elem.sidebarjsListener = value) : !!elem.sidebarjsListener;
}
export function shouldDefineMainContent(mainContent) {
    if (mainContent) {
        mainContent.setAttribute(SIDEBARJS_CONTENT, '');
        return mainContent;
    }
    else {
        return document.querySelector(`[${SIDEBARJS_CONTENT}]`);
    }
}
export function forEachActionElement(sidebarName, func) {
    for (let i = 0; i < ELEMENT_ACTIONS.length; i++) {
        const action = ELEMENT_ACTIONS[i];
        const elements = document.querySelectorAll(`[${SIDEBARJS}-${action}="${sidebarName}"]`);
        for (let j = 0; j < elements.length; j++) {
            func(elements[j], action);
        }
    }
}
export function targetElementIsBackdrop(e) {
    return e.target.hasAttribute(`${SIDEBARJS}-backdrop`);
}
export function shouldInvokeFunction(fn) {
    if (fn) {
        fn();
    }
}
//# sourceMappingURL=sidebar.core.js.map