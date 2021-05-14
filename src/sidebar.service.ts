import {elemHasListener, HTMLSidebarElement, SidebarBase, SidebarConfig, SIDEBARJS, SIDEBARJS_FALLBACK_NAME, SidebarPosition} from './sidebar.core';
import {SidebarElement} from './sidebar.element';

export class SidebarService implements SidebarBase {
  private readonly instances: {[key: string]: SidebarElement};

  constructor() {
    this.instances = {};
  }

  private fallbackName(sidebarName?: string | null) {
    return sidebarName || SIDEBARJS_FALLBACK_NAME;
  }

  private getInstance(sidebarName?: string): SidebarElement | undefined {
    return this.instances[this.fallbackName(sidebarName)];
  }

  public create(options?: SidebarConfig): SidebarElement {
    const name = this.fallbackName(options?.component?.getAttribute(SIDEBARJS));
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

  public destroy(sidebarName?: string): void {
    const name = this.fallbackName(sidebarName);
    if (this.instances[name]) {
      this.instances[name].destroy();
      this.instances[name] = null as any;
      delete this.instances[name];
    }
  }
}
