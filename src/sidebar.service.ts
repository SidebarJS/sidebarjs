import {elemHasListener, HTMLSidebarElement, SidebarBase, SidebarConfig} from './sidebar.core';
import {SidebarElement} from './sidebar.element';

export class SidebarService implements SidebarBase {
  private readonly instances: {[key: string]: SidebarElement};

  constructor() {
    this.instances = {};
  }

  public create(options: SidebarConfig = {}): SidebarElement {
    const name: string = (options.component && options.component.getAttribute('sidebarjs')) || '';
    this.instances[name] = new SidebarElement(options);
    return this.instances[name];
  }

  public open(sidebarName = ''): void {
    if (this.instances[sidebarName]) {
      this.instances[sidebarName].open();
    }
  }

  public close(sidebarName = ''): void {
    if (this.instances[sidebarName]) {
      this.instances[sidebarName].close();
    }
  }

  public toggle(sidebarName = ''): void {
    if (this.instances[sidebarName]) {
      this.instances[sidebarName].toggle();
    }
  }

  public isVisible(sidebarName = ''): boolean {
    return !!this.instances[sidebarName] && this.instances[sidebarName].isVisible();
  }

  public setPosition(position: 'left' | 'right', sidebarName = ''): void {
    if (this.instances[sidebarName]) {
      this.instances[sidebarName].setPosition(position);
    }
  }

  public elemHasListener(elem: HTMLSidebarElement, value?: boolean): boolean {
    return elemHasListener(elem, value);
  }

  public destroy(sidebarName = ''): void {
    if (this.instances[sidebarName]) {
      this.instances[sidebarName].destroy();
      this.instances[sidebarName] = null;
      delete this.instances[sidebarName];
    }
  }
}
