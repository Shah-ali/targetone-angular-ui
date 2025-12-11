import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OpenMenuService {
  private renderer: Renderer2;
  private editor: any;

  private readonly COMMAND_OPEN_TOOLBAR_MENU = 'open-toolbar-menu';
  private readonly COMMAND_ICON_MENU = 'fa fa-ellipsis-v';
  private readonly MENU_ID = 'customToolbarMenu';
  private readonly MENU_CLASSNAME = 'custom-toolbar-menu';
  private readonly MENU_STYLE = `
    position: absolute;
    background: #fff;
    border: 1px solid #ccc;
    padding: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    z-index: 9999;
  `;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  initialize(editor: any): void {
    this.editor = editor;

    this.setupComponentSelectionListener();
    this.addOpenToolbarMenuCommand();
  }

  private setupComponentSelectionListener(): void {
    this.editor.on('component:selected', () => {
      const selectedComponent = this.editor.getSelected();
      const canvasArea = this.editor.Canvas.getBody().querySelector('.canvas-area');

      /* if (!selectedComponent || !canvasArea) {
        return;
      }

      const element = selectedComponent.view.el;
      if (element.parentElement !== canvasArea || element.classList.contains('canvas-area')) {
        return;
      } */

      let toolbar = selectedComponent.get('toolbar') || [];
      toolbar = toolbar.filter((item) => item.command !== 'tlb-move');

      if (!toolbar.some((item) => item.command === this.COMMAND_OPEN_TOOLBAR_MENU)) {
        toolbar.push({ attributes: { class: this.COMMAND_ICON_MENU }, command: this.COMMAND_OPEN_TOOLBAR_MENU });
      }

      selectedComponent.set({ toolbar });
    });
  }

  private addOpenToolbarMenuCommand(): void {
    this.editor.Commands.add(this.COMMAND_OPEN_TOOLBAR_MENU, {
      run: (editor) => this.openToolbarMenu(editor),
    });
  }

  private openToolbarMenu(editor: any): void {
    const selected = editor.getSelected();
    const canvasArea = editor.Canvas.getBody().querySelector('.canvas-area');

    /* if (!selected || !canvasArea || selected.view.el.parentElement !== canvasArea) {
      return;
    } */

    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('click', (event) => this.handleMenuClick(event), { once: true });
  }

  private handleMenuClick(event: MouseEvent): void {
    if (!event || event.clientX === undefined || event.clientY === undefined) {
      return;
    }

    this.removeExistingMenu();

    const menu = this.createMenu(event.clientX, event.clientY);
    document.body.appendChild(menu);

    this.setupMenuCloseListeners(menu);
  }

  private removeExistingMenu(): void {
    const existingMenu = document.getElementById(this.MENU_ID);
    if (existingMenu) {
      existingMenu.remove();
    }
  }

  private createMenu(x: number, y: number): HTMLElement {
    const menu = document.createElement('div');
    menu.id = this.MENU_ID;
    menu.className = this.MENU_CLASSNAME;
    menu.style.cssText = this.MENU_STYLE;
    menu.style.top = `${y}px`;
    menu.style.left = `${x}px`;

    menu.innerHTML = `
      <div style="padding: 5px; cursor: pointer;" data-action="selectCondition">Visibality Condition</div>
      <div style="padding: 5px; cursor: pointer;" data-action="selectParent">Select Parent</div>
      <div style="padding: 5px; cursor: pointer;" data-action="duplicateElement">Duplicate</div>
      <div style="padding: 5px; cursor: pointer;" data-action="toFrontElement">To front</div>
      <div style="padding: 5px; cursor: pointer;" data-action="createSymbol">Create Symbol</div>
      <div style="padding: 5px; cursor: pointer; color: red;" data-action="deleteElement">Delete</div>
    `;

    menu.addEventListener('click', (event) => this.handleMenuAction(event));
    return menu;
  }

  private setupMenuCloseListeners(menu: HTMLElement): void {
    this.editor.on('component:selected', () => {
      if (menu.parentNode) {
        menu.parentNode.removeChild(menu);
      }
    });

    document.addEventListener(
      'click',
      (event: MouseEvent) => {
        if (!menu.contains(event.target as Node)) {
          if (menu.parentNode) {
            menu.parentNode.removeChild(menu);
          }
        }
      },
      { once: true }
    );
  }

  private handleMenuAction(event: Event): void {
    const target = event.target as HTMLElement;
    const action = target.getAttribute('data-action');

    if (action && typeof this[action] === 'function') {
      (this[action] as Function).call(this);
    }
  }

  private selectParent(): void {
    alert('Select Parent Clicked');
  }

  private duplicateElement(): void {
    alert('Duplicate Clicked');
  }

  private toFrontElement(): void {
    const selected = this.editor.getSelected();
    const canvasArea = this.editor.Canvas.getBody().querySelector('.canvas-area');
    if (selected && canvasArea) {
      const selectedEl = selected.view.el;
      if (selectedEl.parentElement === canvasArea) {
        Array.from(canvasArea.children).forEach((child) => {
          (child as HTMLElement).style.removeProperty('z-index');
        });
        selected.addStyle({ 'z-index': '9999' });
      }
    }
  }

  private createSymbol(): void {
    alert('Create Symbol Clicked');
  }

  private deleteElement(): void {
    this.editor.runCommand('core:component-delete');
    alert('Delete Clicked');
  }
}