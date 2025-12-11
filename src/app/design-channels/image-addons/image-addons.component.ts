import { style } from '@angular/animations';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { SharedataService } from '@app/core/services/sharedata.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { v4 as uuidv4 } from 'uuid';
import { GlobalConstants } from '../common/globalConstants';
import { environment } from '@env/environment';
import { AuthenticationService } from '@app/core/services/authentication.service';

@Component({
  selector: 'app-image-addons',
  templateUrl: './image-addons.component.html',
  styleUrls: ['./image-addons.component.scss'],
})
export class ImageAddonsComponent implements OnInit {
  @Output() onAdd = new EventEmitter<any>();
  @ViewChild('widthFieldControl') widthFieldControl!: NgModel;
  @ViewChild('condFieldControl') condFieldControl!: NgModel;
  baseUrl: any = environment.BASE_URL;
  isCollapsed = [true, true, true];
  widthValue: string = '';
  imageSrc: string = '';
  imageHref: string = '';
  dynamicSrc: string = '';
  conditionTextArea: string = '';
  viewPortAccorActive: boolean = false;
  maxWidthAccorActive: boolean = false;
  conditionAccorActive: boolean = false;
  showFieldErrors: boolean = false;
  editModeEnable: boolean = false;
  fullObject: any = {};
  golobalVars: any = {};
  tempImageData: any;

  constructor(
    private bsModalRef: BsModalRef,
    private shareService: SharedataService,
    private authService: AuthenticationService
  ) {
    GlobalConstants.parentComponentName = 'ImageAddonsComponent';
    this.shareService.savedAddOnsJSON.subscribe((res: any) => {
      this.editModeEnable = true;
      let width, viewPort, condition;

      this.fullObject = res;
      if (res.customFields) {
        this.tempImageData = JSON.parse(res.customFields.customField_value);
        GlobalConstants.globalImageData = this.tempImageData;
      }

      this.imageSrc = res.src ? res.src : this.baseUrl + '/resources/img/inApp/PreviewImage.png';
      this.imageHref = res.href ? res.href : 'http://www.example.com/';
      this.dynamicSrc = res.dynamicSrc ? res.dynamicSrc : '';

      if (this.tempImageData) {
        width = this.tempImageData.maxWidth.width;
        viewPort = this.tempImageData.viewPort.value;
        condition = this.tempImageData.condition.value;
      }

      if (width) {
        this.maxWidthAccorActive = true;
        if (width.toString().includes('px')) {
          let widthMatch = width.match(/^(\d+(\.\d+)?)(%|px)?$/i);
          this.widthValue = widthMatch[1];
        } else {
          this.widthValue = width;
        }
        this.toggleCollapse(0);
      }

      if (viewPort) {
        this.viewPortAccorActive = true;
        this.toggleCollapse(1);
      }

      // Check and set condition value
      if (condition) {
        this.conditionAccorActive = true;
        this.conditionTextArea = condition;
        if (width === undefined) {
          this.toggleCollapse(2);
        }
      }
    });
  }

  onClose(): void {
    if (this.bsModalRef) {
      this.bsModalRef.hide();
    }
  }

  toggleCollapse(index: number) {
    this.isCollapsed[index] = !this.isCollapsed[index];
  }

  activateMaxWidth() {
    this.maxWidthAccorActive = !this.maxWidthAccorActive;
    if (!this.maxWidthAccorActive) {
      this.widthValue = '';
    }

    if (this.maxWidthAccorActive) {
      this.isCollapsed[0] = true;
    } else {
      this.isCollapsed[0] = false;
    }
  }

  activateViewPort() {
    this.viewPortAccorActive = !this.viewPortAccorActive;
  }

  activateCondition() {
    this.conditionAccorActive = !this.conditionAccorActive;
    if (!this.conditionAccorActive) {
      this.conditionTextArea = '';
    }
    if (this.conditionAccorActive) {
      this.isCollapsed[2] = true;
    } else {
      this.isCollapsed[2] = false;
    }
  }

  insertData() {
    if (this.maxWidthAccorActive && this.widthFieldControl.invalid && !this.widthValue) {
      this.showFieldErrors = true;
      this.widthFieldControl.control.markAsTouched();
      return;
    }

    if (this.conditionAccorActive && this.condFieldControl.invalid && !this.conditionTextArea) {
      this.showFieldErrors = true;
      this.condFieldControl.control.markAsTouched();
      return;
    }

    const getImageCond = (condition) => {
      return `${condition}`;
    };

    const imageCondition = this.conditionAccorActive ? getImageCond(this.conditionTextArea) : '';
    const imageMaxWidth = this.maxWidthAccorActive ? this.widthValue : '';
    const imageViewPortCoordinates = this.viewPortAccorActive
      ? 'object-fit:contain;max-width:100%;max-height:100%;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transition:opacity .2s;'
      : '';
    const uniq_id = uuidv4();

    let newImage = {
      id: uniq_id,
      maxWidth: {
        enable: this.maxWidthAccorActive,
        width: imageMaxWidth,
      },
      viewPort: {
        enable: this.viewPortAccorActive,
        value: imageViewPortCoordinates,
      },
      condition: {
        enable: this.conditionAccorActive,
        value: imageCondition,
      },
    };

    this.addImageDetail(newImage);

    setTimeout(() => {
      let rowData = {
        1: {
          type: 'image',
          value: {
            alt: uniq_id,
            href: this.imageHref,
            src: this.imageSrc,
            dynamicSrc: this.dynamicSrc,
            title: uniq_id,
            width: imageMaxWidth,
            customFields: {
              customField_value: JSON.stringify(newImage),
            },
          },
        },
      };

      this.onClose();
      this.onAdd.emit(rowData[1]);
      //this.onAdd.emit(valHtml);
    }, 1000);
  }

  ngOnInit(): void {}
  addImageDetail(newDetail: any): void {
    if (!this.golobalVars.imageDetails) {
      this.golobalVars.imageDetails = [];
    }
    this.golobalVars.imageDetails.push(newDetail);
    GlobalConstants.globalImageData = this.golobalVars;
  }

  helpOLH(section: string) {
    this.authService.globalHelpOLH(section);
  }
}
