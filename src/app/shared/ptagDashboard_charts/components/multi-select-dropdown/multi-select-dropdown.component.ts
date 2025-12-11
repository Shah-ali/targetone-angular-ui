import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DrawerService } from '@app/core/services/drawer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-multi-select-dropdown',
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.scss']
})
export class MultiSelectDropdownComponent {
  @Input() list: any[] | undefined;

  @Output() shareCheckedList = new EventEmitter();
  @Output() applyCompaignsFilter = new EventEmitter();
  @Output() shareIndividualCheckedList = new EventEmitter();

  searchCompaign: string = '';
  checkedList: any[];
  currentSelected: {} | undefined;
  showDropDown = false;
  isDrawerOpen = false;
  selectAllChecked = false;
  private subscription: Subscription;

  constructor(private drawerService: DrawerService) {
    this.checkedList = [];
    this.subscription = this.drawerService.drawerOpen$.subscribe((isOpen) => {
      this.isDrawerOpen = isOpen;
      if (!isOpen) {
        this.checkedList = [];
        this.selectAllChecked = false;
      }
    });
  }

  getSelectedValue(status: Boolean, value: String, id) {
    if (id === -1) {
      // "All Campaigns" selected
      this.selectAllCampaigns();
    } else {
      if (status) {
        this.checkedList.push(id);
      } else {
        const index = this.checkedList.indexOf(id);
        this.checkedList.splice(index, 1);
      }

      // Check/uncheck "All Campaigns" based on the selection
      this.selectAllChecked = this.list?.every((campaign) => campaign.checked) || false;
    }

    this.currentSelected = { checked: status, name: value, id: id };

    // Share checked list
    this.shareCheckedlist();

    // Share individual selected item
    this.shareIndividualStatus();
  }

  shareCheckedlist() {
    this.shareCheckedList.emit(this.checkedList);
  }

  shareIndividualStatus() {
    this.shareIndividualCheckedList.emit(this.currentSelected);
  }

  applySearchCompaign(): void {
    this.applyCompaignsFilter.emit(this.searchCompaign);
  }

  toggleDropDown() {
    this.showDropDown = !this.showDropDown;
  }

 selectAllCampaigns() {



  if (this.list) {
    if (this.selectAllChecked) {
      this.checkedList = this.list.map((campaign) => campaign.id);
        // Share checked list before updating individual campaign checkboxes
        this.shareCheckedlist();
    } else {
      this.checkedList = [];
    }

    // Update the checked status of individual campaigns
    this.list.forEach((campaign) => {
      if (campaign) {
        campaign.checked = this.selectAllChecked;
      }
    });
  } else {
    this.checkedList = [];
  }
}

  
}
