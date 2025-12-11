import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GlobalConstants } from '../common/globalConstants';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.scss'],
})
export class RatingsComponent implements OnInit {
  @Output() onAdd = new EventEmitter<any>();
  @Input() maxStars: number = 5;

  isCollapsed = [true, true, true, true];
  parentComponentName: string = '';
  starsArray: any[] = [];
  starColor: string = '#F5CC3B';
  starRangeSize: string = '20';
  starSize: string = '20px';
  ratingValue: string = '';
  conditionTextArea: string = '';
  textConfigureAccorActive: boolean = false;
  conditionAccorActive: boolean = false;
  ratingConditionValue: any;
  numberOfRatingValue: any;
  ratingValues = false;
  values: any;
  selectedSpaceOption: boolean = true;
   fontColor: string = '#000000';
   

  bgColor = '#D9D9D9';
  fillColor = '#edc04e';
  showLoader = false;

  addRatingsAccorActive: boolean = false;
  noOfRatings: string = '';

  selectedFont: string = 'Poppins';
  fontOptions: string[] = ['Arial', 'Courier New', 'Georgia', 'Poppins', 'Times New Roman'];

  weightOptions: { label: string; value: string }[] = [
  { label: 'Normal', value: '400' },
  { label: 'Medium', value: '600' },
  { label: 'Bold', value: '800' },
  { label: 'Light', value: '100' }
];
selectedWeight = '400'; // Default Normal


  selectedFontSize: string = '14px';
  fontSizes: string[] = ['10px', '12px', '14px', '16px', '18px', '20px', '24px'];

  presetColors: string[] = ['#FF5733', '#33B5FF', '#4CAF50', '#F5CC3B', '#9C27B0', '#E91E63'];

  constructor(
    private bsModalRef: BsModalRef,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
    GlobalConstants.parentComponentName = 'RatingsComponent';
  }

ngOnInit(): void {
  this.starsArray = new Array(this.maxStars);
  this.fontColor = '#000000'; // Force reset on init
  if (this.ratingValues) {
    this.conditionAccorActive = true;
    this.isCollapsed[2] = false;
  }
}


onColorChange(color: string): void {
  this.fontColor = color;
}


  adjustStars(amount: number): void {
    this.maxStars = Math.max(1, Math.min(5, this.maxStars + amount));
    this.starsArray = new Array(this.maxStars);
    if (+this.ratingValue > this.maxStars) {
      this.ratingValue = this.maxStars.toString();
    }
  }

  updateStarSize(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let size = inputElement.value.trim();
    if (size === '' || isNaN(parseFloat(size))) {
      this.starSize = '20px';
    } else {
      const parsedSize = Math.max(10, Math.min(parseFloat(size), 100));
      this.starSize = `${parsedSize}px`;
    }
  }

  checkMaxRatingCondValue(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value.trim();
    if (value === '' || isNaN(parseFloat(value))) {
      this.ratingConditionValue = '';
    } else {
      let parsedValue = Math.min(this.maxStars, Math.max(1, parseFloat(value)));
      this.ratingConditionValue = parsedValue;
    }
    inputElement.value = this.ratingConditionValue.toString();
  }

  toggleCollapse(index: number): void {
    this.isCollapsed[index] = !this.isCollapsed[index];
  }

  activeCondition(): void {
    this.conditionAccorActive = !this.conditionAccorActive;
    this.ratingValues = this.conditionAccorActive;
    this.isCollapsed[2] = !this.conditionAccorActive;
  }
 
  toggleAddRatings(): void {
  this.addRatingsAccorActive = !this.addRatingsAccorActive;
  if (this.addRatingsAccorActive) {
    this.fontColor = '#000000'; // Reset to black when opening
  }
}



  onClose(): void {
    this.bsModalRef.hide();
  }

  setFontColor(newColor: string): void {
    this.fontColor = newColor;
  }

  get shouldShowFalseConditionOptions(): boolean {
    const ratingStr = (this.ratingValue || '').toString().trim();
    const conditionStr = (this.ratingConditionValue || '').toString().trim();
    const conditionVal = parseFloat(conditionStr);
    if (isNaN(conditionVal)) return false;

    const isMergeTag = ratingStr.startsWith('{{') && ratingStr.endsWith('}}');
    const isClearlyInvalid = /[^\d.-]/.test(ratingStr);
    const numericRating = parseFloat(ratingStr);
    const isNumeric = !isNaN(numericRating) && isFinite(numericRating);

    if (isMergeTag || isClearlyInvalid || !isNumeric) {
      return true;
    }

    return numericRating <= conditionVal;
  }

  get shouldHideRatings(): boolean {
    return this.shouldShowFalseConditionOptions && this.selectedSpaceOption === true;
  }

  saveRatings(): void {
    const conditionVal = parseFloat(this.ratingConditionValue || '0');
    const fontSize = this.selectedFontSize || '14px';

    let ratingNumberHtml = '';
    if (this.addRatingsAccorActive) {
     ratingNumberHtml = `<span style="display: inline-block; line-height: 1; font-family: ${this.selectedFont}; font-size: ${fontSize}; font-weight: ${this.selectedWeight}; color: ${this.fontColor}; margin-left: -4px; margin-top: 3px;vertical-align: text-top;">(${this.noOfRatings})</span>`;
    }

    let paragraphHtml = '';

    /* if (this.shouldShowFalseConditionOptions) {
      if (this.selectedSpaceOption) {
        paragraphHtml = `<div id="rating-parent-section">&nbsp;</div>`;
      } else {
        paragraphHtml = ''; 
      }
    } else {
     
      
    } */

    //paragraphHtml = `<div id="rating-parent-section"><em data-star="${this.ratingValue}" style="color: ${this.starColor}; font-size: ${this.starSize}; font-family: ${this.selectedFont}; font-weight: ${this.selectedWeight}">&nbsp;</em>${ratingNumberHtml}</div>`;

    const shouldShowStar = `${this.ratingValue} > ${conditionVal}`;
    const shouldShowNoOfRatings = `${this.noOfRatings} > ${this.numberOfRatingValue}`;
    const dataStar = this.ratingValue || '0';
    const style = `
      color: ${this.starColor};
      font-size: ${this.starSize};
      font-family: ${this.selectedFont};
      font-weight: ${this.selectedWeight};
    `;

    const divNgIf = `${this.selectedSpaceOption} || (${shouldShowStar})`;
    const divStyle = this.selectedSpaceOption ? 'style="height:30px"' : '';

    paragraphHtml = `
      <div id="rating-parent-section" data-ng-if="${divNgIf}" ${divStyle}>
        <em 
          data-ng-if="${shouldShowStar}" 
          data-star="${dataStar}" 
          style="${style.trim()}"
        >&nbsp;</em>
        <span data-ng-if="${shouldShowStar} && ${shouldShowNoOfRatings} && ${this.addRatingsAccorActive}">${ratingNumberHtml}</span>
      </div>
    `;

    setTimeout(() => {
      const rowData = {
        1: {
          type: 'mixed',
          value: [
        {
          type: 'paragraph',
          value: {
            html: paragraphHtml
          },
        },
          ],
        },
      };
      this.onClose();
      this.onAdd.emit(rowData[1]);
    }, 1000);
  }
}