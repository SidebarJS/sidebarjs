import { HTMLSidebarElement, SidebarBase, SidebarConfig } from './index';
import { SidebarElement } from './sidebarElement';
export declare class SidebarService implements SidebarBase {
    private readonly instances;
    constructor();
    create(options?: SidebarConfig): SidebarElement;
    open(sidebarName?: string): void;
    close(sidebarName?: string): void;
    toggle(sidebarName?: string): void;
    isVisible(sidebarName?: string): boolean;
    setPosition(position: 'left' | 'right', sidebarName?: string): void;
    elemHasListener(elem: HTMLSidebarElement, value?: boolean): boolean;
    destroy(sidebarName?: string): void;
}
