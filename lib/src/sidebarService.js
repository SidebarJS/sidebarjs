import { SidebarElement } from './sidebarElement';
export class SidebarService {
    constructor() {
        this.instances = {};
    }
    create(options = {}) {
        const name = (options.component && options.component.getAttribute('sidebarjs')) || '';
        this.instances[name] = new SidebarElement(options);
        return this.instances[name];
    }
    open(sidebarName = '') {
        if (this.instances[sidebarName]) {
            this.instances[sidebarName].open();
        }
    }
    close(sidebarName = '') {
        if (this.instances[sidebarName]) {
            this.instances[sidebarName].close();
        }
    }
    toggle(sidebarName = '') {
        if (this.instances[sidebarName]) {
            this.instances[sidebarName].toggle();
        }
    }
    isVisible(sidebarName = '') {
        return !!this.instances[sidebarName] && this.instances[sidebarName].isVisible();
    }
    setPosition(position, sidebarName = '') {
        if (this.instances[sidebarName]) {
            this.instances[sidebarName].setPosition(position);
        }
    }
    elemHasListener(elem, value) {
        return SidebarElement.elemHasListener(elem, value);
    }
    destroy(sidebarName = '') {
        if (this.instances[sidebarName]) {
            this.instances[sidebarName].destroy();
            this.instances[sidebarName] = null;
            delete this.instances[sidebarName];
        }
    }
}
//# sourceMappingURL=sidebarService.js.map