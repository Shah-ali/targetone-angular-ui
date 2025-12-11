import { Clipboard } from '@angular/cdk/clipboard';
import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { DataService } from '@app/core/services/data.service';

@Component({
  selector: 'app-copy-clipboard',
  templateUrl: './copy-clipboard.component.html',
  styleUrls: ['./copy-clipboard.component.scss'],
})
export class CopyClipboardComponent implements AfterViewInit {
  @ViewChild('clipboardModal', { static: true }) clipboardModalRef!: ElementRef;
  state: boolean = false;
  clipboardData: any;
  /* accordionData = [{"title":"Item 1","content":"Content for item 1","tableData":[{"name":"Field 1","code":"{Customer.ext.externalCustomerCodeAvailable}","icon":"fas fa-circle"},{"name":"Field 2","code":"{Customer.externalCustomerCodeAvailable}","icon":"fas fa-square"},{"name":"Field 3","code":"{Customer.node.externalCustomerCodeAvailable}","icon":"fas fa-triangle"}]},{"title":"Item 2","content":"Content for item 2","tableData":[{"name":"Field A","code":"{Customer.externalCustomerCodeAvailable}","icon":"fas fa-circle"},{"name":"Field B","code":"{Customer.externalCustomerCodeAvailable}","icon":"fas fa-square"},{"name":"Field C","code":"{Customer.externalCustomerCodeAvailable}","icon":"fas fa-triangle"}]},{"title":"Item 3","content":"Content for item 3","tableData":[{"name":"Field X","code":"{Customer.externalCustomerCodeAvailable}","icon":"fas fa-circle"},{"name":"Field Y","code":"{Customer.externalCustomerCodeAvailable}","icon":"fas fa-square"},{"name":"Field Z","code":"{Customer.externalCustomerCodeAvailable}","icon":"fas fa-triangle"}]}]; */

  isCollapsed: boolean[] = [];
  innerTableExpanded: boolean = false;
  tagKey: any;
  //  an array to store the expansion state for each row
  rowExpansionState: boolean[] = [];

  constructor(private ngZone: NgZone, private clipboard: Clipboard, private dataService: DataService) {
    this.tagKey = this.dataService.activeContentTagKey;
    const jsonData = sessionStorage.getItem(`clipboard-data[${this.tagKey}]`);
    this.clipboardData = jsonData ? JSON.parse(jsonData) : [];

    //this.isCollapsed = this.clipboardData.map(() => true);
  }
  ngAfterViewInit() {
    /* this.ngZone.run(() => {
      this.registerDragElement();
    }); */
  }

  copyToPaste(tooltip, refEl: any) {
    tooltip.open({ refEl });
    this.clipboard.copy('{' + refEl + '}');
    setTimeout(() => tooltip.close(), 1000);
  }

  copyPasteChildElement(tooltip, refEl: any) {
    tooltip.open({ refEl });
    this.clipboard.copy('{' + refEl + '}');
    setTimeout(() => tooltip.close(), 1000);
  }

  toggleClipboardPopup() {
    this.tagKey = this.dataService.activeContentTagKey;
    const jsonData = sessionStorage.getItem(`clipboard-data[${this.tagKey}]`);
    this.clipboardData = jsonData ? JSON.parse(jsonData) : [];
    this.isCollapsed = this.clipboardData.map(() => true);

    const elmnt = this.clipboardModalRef.nativeElement;
    if (this.state) {
      this.state = false;
      elmnt.style.visibility = 'hidden';
    } else {
      this.state = true;
      elmnt.style.visibility = 'visible';
      this.registerDragElement();
    }
  }

  // Method to toggle the expansion state for a specific row
  toggleRowExpansion(index: number) {
    this.rowExpansionState[index] = !this.rowExpansionState[index];
  }

  toggleInnerTable(event, action: string, i): void {
    const parentRow = (event.currentTarget as HTMLElement).closest('.inner-table-cell');
    const innerTable = parentRow?.querySelector('.inner-table');
    // Toggle the 'show' class for the clicked inner table
    innerTable?.classList?.toggle('show');

    // Toggle the 'show' class for the parent row
    this.toggleRowExpansion(i);
  }

  ifFreeStyleLayout(value) {
    return Array.isArray(value);
  }

  registerDragElement() {
    //const elmnt = document.getElementById('clipboardModal');
    const elmnt = this.clipboardModalRef.nativeElement;
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    const dragMouseDown = (e: MouseEvent) => {
      e = e || (window.event as MouseEvent);
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    };

    const elementDrag = (e: MouseEvent) => {
      e = e || (window.event as MouseEvent);
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      // Ensure the modal stays within the viewport
      const modalRect = elmnt.getBoundingClientRect();
      const modalWidth = modalRect.width;
      const modalHeight = modalRect.height;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newLeft = elmnt.offsetLeft - pos1;
      let newTop = elmnt.offsetTop - pos2;

      if (newLeft < 321) {
        newLeft = 321;
      }

      if (newTop < 240) {
        newTop = 240;
      }

      elmnt.style.top = newTop + 'px';
      elmnt.style.left = newLeft + 'px';
    };

    const closeDragElement = () => {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    };

    const header = elmnt.querySelector('.header');
    if (header) {
      header.addEventListener('mousedown', dragMouseDown);
    } else {
      elmnt.addEventListener('mousedown', dragMouseDown);
    }
  }

  toggleCollapse(index: number) {
    this.isCollapsed[index] = !this.isCollapsed[index];
  }

  deleteAccordionItem(index: number, acc) {
    this.tagKey = this.dataService.activeContentTagKey;
    if (acc == 'All') {
      sessionStorage.removeItem(`clipboard-data[${this.tagKey}]`);
      this.clipboardData = [];
    } else {
      const jsonData = sessionStorage.getItem(`clipboard-data[${this.tagKey}]`);
      this.clipboardData = jsonData ? JSON.parse(jsonData) : [];
      this.clipboardData.splice(index, 1);
      sessionStorage.removeItem(`clipboard-data[${this.tagKey}]`);
      if (this.clipboardData.length > 0) {
        sessionStorage.setItem(`clipboard-data[${this.tagKey}]`, JSON.stringify(this.clipboardData));
      }
      this.isCollapsed.splice(index, 1);
    }
  }

  minimizeAndMaximizeClipboard(e) {
    const elmnt = this.clipboardModalRef.nativeElement;
    const iconElement = e.currentTarget.querySelector('.far');
    if (iconElement.classList.contains('fa-minus')) {
      iconElement.classList.remove('fa-minus');
      iconElement.classList.add('fa-expand');
    } else {
      iconElement.classList.add('fa-minus');
      iconElement.classList.remove('fa-expand');
    }
    const body = elmnt.querySelector('.body');
    if (body) {
      body.style.display = body.style.display === 'none' ? 'block' : 'none';
    }
  }
}
