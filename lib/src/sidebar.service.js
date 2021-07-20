import { elemHasListener, SIDEBARJS, SIDEBARJS_FALLBACK_NAME } from './sidebar.core';
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
        var _a;
        const name = this.fallbackName((_a = options === null || options === void 0 ? void 0 : options.component) === null || _a === void 0 ? void 0 : _a.getAttribute(SIDEBARJS));
        this.instances[name] = new SidebarElement(options);
        return this.instances[name];
    }
    open(sidebarName) {
        var _a;
        (_a = this.getInstance(sidebarName)) === null || _a === void 0 ? void 0 : _a.open();
    }
    close(sidebarName) {
        var _a;
        (_a = this.getInstance(sidebarName)) === null || _a === void 0 ? void 0 : _a.close();
    }
    toggle(sidebarName) {
        var _a;
        (_a = this.getInstance(sidebarName)) === null || _a === void 0 ? void 0 : _a.toggle();
    }
    isVisible(sidebarName) {
        var _a;
        return !!((_a = this.getInstance(sidebarName)) === null || _a === void 0 ? void 0 : _a.isVisible());
    }
    setPosition(position, sidebarName) {
        var _a;
        (_a = this.getInstance(sidebarName)) === null || _a === void 0 ? void 0 : _a.setPosition(position);
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