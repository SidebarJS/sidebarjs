import {elemHasListener, HTMLSidebarElement, SidebarBase, SidebarConfig, SidebarPosition} from './sidebar.core';
import {SidebarElement} from './sidebar.element';

export class SidebarService implements SidebarBase {
  private readonly instances: {[key: string]: SidebarElement};

  constructor() {
    this.instances = {};
  }

  private getInstance(sidebarName?: string): SidebarElement | undefined {
    return this.instances[sidebarName || ''];
  }

  public create(options: SidebarConfig = {}): SidebarElement {
    const name: string = (options.component && options.component.getAttribute('sidebarjs')) || '';
    this.instances[name] = new SidebarElement(options);
    return this.instances[name];
  }

  public open(sidebarName?: string): void {
    this.getInstance(sidebarName)?.open();
  }

  public close(sidebarName?: string): void {
    this.getInstance(sidebarName)?.close();
  }

  public toggle(sidebarName?: string): void {
    this.getInstance(sidebarName)?.toggle();
  }

  public isVisible(sidebarName?: string): boolean {
    return !!this.getInstance(sidebarName)?.isVisible();
  }

  public setPosition(position: SidebarPosition, sidebarName?: string): void {
    this.getInstance(sidebarName)?.setPosition(position);
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
