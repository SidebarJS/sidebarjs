import {HTMLSidebarElement, SidebarBase, SidebarConfig} from './index';
import {SidebarElement} from './sidebarElement';

export class SidebarService implements SidebarBase {
  private readonly instances: any;

  constructor() {
    this.instances = {};
  }

  public create(options: SidebarConfig = {}): SidebarElement {
    const name: string = (options.component && options.component.getAttribute('sidebarjs')) || '';
    this.instances[name] = new SidebarElement(options);
    return this.instances[name];
  }

  public open(sidebarName: string = ''): void {
    if (this.instances[sidebarName]) {
      this.instances[sidebarName].open();
    }
  }

  public close(sidebarName: string = ''): void {
    if (this.instances[sidebarName]) {
      this.instances[sidebarName].close();
    }
  }

  public toggle(sidebarName: string = ''): void {
    if (this.instances[sidebarName]) {
      this.instances[sidebarName].toggle();
    }
  }

  public isVisible(sidebarName: string = ''): boolean {
    return !!this.instances[sidebarName] && this.instances[sidebarName].isVisible();
  }

  public setPosition(position: 'left' | 'right', sidebarName: string = ''): void {
    if (this.instances[sidebarName]) {
      this.instances[sidebarName].setPosition(position);
    }
  }

  public elemHasListener(elem: HTMLSidebarElement, value?: boolean): boolean {
    return SidebarElement.elemHasListener(elem, value);
  }

  public destroy(sidebarName: string = ''): void {
    if (this.instances[sidebarName]) {
      this.instances[sidebarName].destroy();
      this.instances[sidebarName] = null;
      delete this.instances[sidebarName];
    }
  }
}
