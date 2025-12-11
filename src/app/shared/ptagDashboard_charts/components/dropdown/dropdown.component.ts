// dropdown.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  template: `
    <div class="dropdown">
      <button
        class="btn btn-secondary dropdown-toggle"
        type="button"
        id="multiSelectDropdown"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        Selected Items: {{ selectedItems.length }}
      </button>
      <div class="dropdown-menu" aria-labelledby="multiSelectDropdown">
        <div class="dropdown-header">
          <input type="text" class="form-control" (ngModel)="searchText" placeholder="Search..." />
        </div>
        <div class="dropdown-item" *ngFor="let item of items | filterItems: searchText">
          <input type="checkbox" (ngModel)="item.selected" (change)="toggleItemSelection(item)" /> {{ item.name }}
        </div>
      </div>
    </div>
  `,
})
export class DropdownComponent {
  @Input() items: any[] = [];
  @Output() selectionChange = new EventEmitter<any[]>();

  selectedItems: any[] = [];
  searchText: string = '';

  toggleItemSelection(item: any): void {
    if (item.selected) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems = this.selectedItems.filter(selectedItem => selectedItem !== item);
    }
    this.selectionChange.emit(this.selectedItems);
  }
}
