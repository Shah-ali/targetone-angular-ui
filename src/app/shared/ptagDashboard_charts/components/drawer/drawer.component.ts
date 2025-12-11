// drawer.component.ts
import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { DrawerService } from '@app/core/services/drawer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent implements OnDestroy {
  @Output() applySelectedCompaigns = new EventEmitter();
  isDrawerOpen = false;
  searchTerm:string ='';
  filterText: string = '';
  showDropdown: boolean = true;
  dropdownData: { name: string }[] = [];
  dropdownDataOriginal: { name: string }[] = [];
  
  i;
  private subscription: Subscription;

  selectedItems: any[] = [];
  searchText = '';

  constructor(private drawerService: DrawerService) {
    this.subscription = this.drawerService.drawerOpen$.subscribe((isOpen) => {
      this.isDrawerOpen = isOpen;
      if (!isOpen) {
        // Drawer is closed, reset dropdown data
        this.dropdownData = [];
        this.dropdownDataOriginal=[];
      }
    });
    this.drawerService.dropdownData$.subscribe((data) => {
      this.dropdownData = data;
      this.dropdownDataOriginal=data;
      this.selectedItems=[];
       this.updateDropDownData();
    });
   
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  closeDrawer() {
    this.drawerService.closeDrawer();
  }
  updateDropDownData(){
    this.dropdownData.forEach((item:any)=> {
      item.checked = this.selectedItems.includes(item.id);
    });
  }
  applyFilter() {
    this.applySelectedCompaigns.emit(this.selectedItems);
  }

  selectOption(option: string) {
    this.filterText = option;
    this.showDropdown = false;
  }

  shareCheckedList(item: any) {
    if (item.length > 0) {
    item.map(e=> this.i = e)
    }
    this.selectedItems=item;
    this.drawerService.setDropdownSelectedData(item);
    item.indexOf("");
  }
  applyCompaignsFilter(item: string) {
    this.dropdownData =[...this.dropdownDataOriginal];
    if (item !== '') {
      this.dropdownData = this.dropdownData.filter(compaign => {
        // Check if compaign is an object and has the 'compaignName' property
        if (typeof compaign === 'object' && compaign.name) {
          return compaign.name.toLowerCase().includes(item.toLowerCase());
        }
        return false;
      });
    }
  }
  shareIndividualCheckedList(item: {}) {
    console.log(item);
  }
}
