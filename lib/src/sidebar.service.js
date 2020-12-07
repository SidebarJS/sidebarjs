import { elemHasListener, SIDEBARJS, SIDEBARJS_FALLBACK_NAME, } from './sidebar.core';
import { SidebarElement } from './sidebar.element';
export class SidebarService {
    constructor() {
        this.instances = {};
    }
    fallbackName(sidebarName) {
        return sidebarName || SIDEBARJS_FALLBACK_NAME;
    }
    getInstance(sidebarName) {
        return this.instances[this.fallbackName(sidebarName)];
    }
    create(options) {
        const name = this.fallbackName(options?.component?.getAttribute(SIDEBARJS));
        this.instances[name] = new SidebarElement(options);
        return this.instances[name];
    }
    open(sidebarName) {
        this.getInstance(sidebarName)?.open();
    }
    close(sidebarName) {
        this.getInstance(sidebarName)?.close();
    }
    toggle(sidebarName) {
        this.getInstance(sidebarName)?.toggle();
    }
    isVisible(sidebarName) {
        return !!this.getInstance(sidebarName)?.isVisible();
    }
    setPosition(position, sidebarName) {
        this.getInstance(sidebarName)?.setPosition(position);
    }
    elemHasListener(elem, value) {
        return elemHasListener(elem, value);
    }
    destroy(sidebarName) {
        const name = this.fallbackName(sidebarName);
        if (this.instances[name]) {
            this.instances[name].destroy();
            this.instances[name] = null;
            delete this.instances[name];
        }
    }
}
//# sourceMappingURL=sidebar.service.js.map