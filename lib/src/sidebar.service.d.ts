import { HTMLSidebarElement, SidebarBase, SidebarConfig, SidebarPosition } from './sidebar.core';
import { SidebarElement } from './sidebar.element';
export declare class SidebarService implements SidebarBase {
    private readonly instances;
    constructor();
    private fallbackName;
    private getInstance;
    create(options?: SidebarConfig): SidebarElement;
    open(sidebarName?: string): void;
    close(sidebarName?: string): void;
    toggle(sidebarName?: string): void;
    isVisible(sidebarName?: string): boolean;
    setPosition(position: SidebarPosition, sidebarName?: string): void;
    elemHasListener(elem: HTMLSidebarElement, value?: boolean): boolean;
    destroy(sidebarName?: string): void;
}
