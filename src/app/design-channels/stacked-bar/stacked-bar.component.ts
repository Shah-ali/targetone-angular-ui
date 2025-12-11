import { Component, EventEmitter, OnInit, ViewChild, ElementRef, Output, Renderer2 } from '@angular/core';
import { SharedataService } from '@app/core/services/sharedata.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GlobalConstants } from '../common/globalConstants';
import { DataService } from '@app/core/services/data.service';

@Component({
  selector: 'app-stacked-bar',
  templateUrl: './stacked-bar.component.html',
  styleUrls: ['./stacked-bar.component.scss']
})
export class StackedBarComponent implements OnInit {
    
  @ViewChild('progressWrapper') progressWrapperRef!: ElementRef;
  
  sizeRangeMaxVal: any = 0;
  sizeOptions = ["S", "M", "L"];
  selectedIndex = 0;
  selectedSize = this.sizeOptions[0];

  roundedCorners = true;

  maxValue ;
  currentValue ;

  enableIntervals = false; // start as FALSE now
  intervals; 

  bgColor = '#D9D9D9';
  fillColor = '#edc04e';
  showLoader = false;
  
  sizeHeights = {
    'S': '15px',
    'M': '25px',
    'L': '40px'
  };

 savedState = {}; 

  @Output() onAdd = new EventEmitter<any>();

  constructor(private bsModalRef: BsModalRef,
    private shareService: SharedataService,
    private dataService:DataService,
  ) {

     GlobalConstants.parentComponentName = 'StackedBarComponent';
    this.subscribeToSavedAddOnsJSON();

  }

  ngOnInit(): void { 

   }

  subscribeToSavedAddOnsJSON(): void {
    this.shareService.savedAddOnsJSON.subscribe((res: any) => {
      const savedState = res.savedState || {};
      if (!savedState || Object.keys(savedState).length === 0) return;
      this.selectedSize = savedState.selectedSize;
      this.selectedIndex = savedState.selectedIndex;
      this.roundedCorners = savedState.roundedCorners;
      this.maxValue = savedState.maxValue;
      this.currentValue = savedState.currentValue;
      this.enableIntervals = savedState.enableIntervals;
      this.intervals = savedState.intervals;
      this.bgColor = savedState.bgColor;
      this.fillColor = savedState.fillColor;

      // Trigger side effects if necessary
      this.updateSizeRange({ target: { value: this.selectedIndex } });
    });
  }

  updateSizeRange(event: any): void {
    const index = +event.target.value;
    this.selectedIndex = index;
    this.selectedSize = this.sizeOptions[index];
  }

  onClose(): void {
    if (this.bsModalRef) {
      this.bsModalRef.hide();
    }
  }

 
  
  isMergeTag(value: any): boolean {
    return typeof value === 'string' && value.includes('{') && value.includes('}');
  }
  
  getProgressWidth(): string {
    if (this.isMergeTag(this.currentValue) || this.isMergeTag(this.maxValue)) {
      return `calc((${this.currentValue}) / (${this.maxValue}) * 100%)`;
    } else {
      const percent = (Number(this.currentValue) / Number(this.maxValue)) * 100;
      return `${percent}%`;
    }
  }

  isFormValid(): boolean {
    const isEmpty = (val: any) =>
      val === null ||
      val === undefined ||
      (typeof val === 'string' && val.trim() === '');
  
    if (isEmpty(this.maxValue)) {
      this.dataService.SwalAlertMgs('"Max Value" is required.');
      return false;
    }
  
    if (isEmpty(this.currentValue)) {
      this.dataService.SwalAlertMgs('"Current Value" is required.');
      return false;
    }
  
    return true;
  }
  
  
  

  insertData() {
    if (!this.isFormValid()) {
      return;
    }
    this.showLoader = true;

    try {
      const progressHTML = `
      <div style="position: relative; height: ${this.sizeHeights[this.selectedSize]}; width: 100%; overflow: hidden; border-radius: ${this.roundedCorners ? '999px' : '0'}; background-color: ${this.bgColor};">
        <div style="position: absolute; top: 0; left: 0; height: 100%; width: ${this.getProgressWidth()}; background-color: ${this.fillColor}; border-radius: ${this.roundedCorners ? '999px' : '0'};"></div>
      </div>
    `;
      // Handle interval labels if enabled
      let intervalHTML = '';
      if (this.enableIntervals) {

      intervalHTML = ` <div style="display: flex; justify-content: space-between; margin-top: 4px;">
                      <span ng-repeat="label in getLabels(${this.enableIntervals}, ${this.maxValue}, ${this.intervals})" style="font-size: 0.8rem; color: #333;">
                        {{ label }}
                      </span>
                    </div>`.trim();
      }
      // persisting the state ...
      this.savedState = {
        selectedSize: this.selectedSize,
        selectedIndex: this.selectedIndex,
        roundedCorners: this.roundedCorners,
        maxValue: this.maxValue,
        currentValue: this.currentValue,
        enableIntervals: this.enableIntervals,
        intervals: this.intervals,
        bgColor: this.bgColor,
        fillColor: this.fillColor
      };
      

      // Combine final HTML
      const finalHTML = `
        <div style="padding: 20px; min-width: 300px;">
          ${progressHTML}
          ${intervalHTML}
        </div>
      `.trim();

      const valHtml = {
        type: "html",
        componentName: "StackedBar",
        value: {
          html: finalHTML,
          savedState : this.savedState,
        }
      };

      this.onClose();
      this.onAdd.emit(valHtml);
    } catch (error) {
      console.error('Error during map initialization:', error);
    } finally {
      this.showLoader = false;
    }
  }

}
