import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { SharedataService } from '@app/core/services/sharedata.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { GlobalConstants } from '../common/globalConstants';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-text',
  templateUrl: './text-addons.component.html',
  styleUrls: ['./text-addons.component.scss'],
})
export class TextAddonsComponent implements OnInit {
  @Output() onAdd = new EventEmitter<any>();
  @ViewChild('heightFieldControl') heightFieldControl!: NgModel;
  @ViewChild('widthFieldControl') widthFieldControl!: NgModel;
  @ViewChild('linesFieldControl') linesFieldControl!: NgModel;
  @ViewChild('condFieldControl') condFieldControl!: NgModel;
  isCollapsed = [true, true, true, true];
  widthValue: string = '';
  heightValue: string = '';
  conditionTextArea: string = '';
  linesValue: number = 1;
  textStyle: string = 'none';
  textConfigureAccorActive: boolean = false;
  conditionAccorActive: boolean = false;
  setWidthAccorActive: boolean = false;
  setStyleAccorActive: boolean = false;
  showFieldErrors: boolean = false;
  editModeEnable: boolean = false;
  fullObject: any = {};
  extractedText: string = '';
  selectedSpaceOption: boolean = true;

  constructor(
    private bsModalRef: BsModalRef,
    private shareService: SharedataService,
    private authService: AuthenticationService
  ) {
    GlobalConstants.parentComponentName = 'TextAddonsComponent';
    this.shareService.savedAddOnsJSON.subscribe((res: any) => {
      this.editModeEnable = true;

      this.fullObject = res;

      const customFields = res.customFields || {};
      const metadata = customFields.metadata || {};
      const { lines, height, width, textStyle, condition, selectedSpaceOption } = metadata;

      // Check and set width, height and lines values
      if (lines || height) {
        this.textConfigureAccorActive = true;
        if (lines) {
          this.linesValue = lines;
        }
        if (height) {
          this.heightValue = height;
        }
        this.toggleCollapse(0);
      }

      // Check and set width value
      if (width) {
        this.setWidthAccorActive = true;
        this.widthValue = width;
        this.toggleCollapse(1);
      }

      // Check and set style
      if (textStyle && textStyle != 'none') {
        this.setStyleAccorActive = true;
        this.textStyle = textStyle;
        this.toggleCollapse(3);
      }

      // Check and set condition value
      if (condition) {
        this.conditionAccorActive = true;
        this.conditionTextArea = condition;
        if (!lines && !height && !width && !textStyle) {
          this.toggleCollapse(2);
        }
        this.selectedSpaceOption = selectedSpaceOption;
      }
    });
  }

  ngOnInit(): void {}

  toggleCollapse(index: number) {
    this.isCollapsed[index] = !this.isCollapsed[index];
  }

  activeHeightAndLines() {
    this.textConfigureAccorActive = !this.textConfigureAccorActive;
    if (this.textConfigureAccorActive) {
      this.isCollapsed[0] = true;
    } else {
      this.isCollapsed[0] = false;
    }
  }

  activeSetWidth() {
    this.setWidthAccorActive = !this.setWidthAccorActive;
    if (this.setWidthAccorActive) {
      this.isCollapsed[1] = true;
    } else {
      this.isCollapsed[1] = false;
    }
  }

  activeSetStyle() {
    this.setStyleAccorActive = !this.setStyleAccorActive;
    if (this.setStyleAccorActive) {
      this.isCollapsed[3] = true;
    } else {
      this.isCollapsed[3] = false;
    }
  }

  activeCondition() {
    this.conditionAccorActive = !this.conditionAccorActive;
    if (this.conditionAccorActive) {
      this.isCollapsed[2] = true;
    } else {
      this.isCollapsed[2] = false;
    }
  }

  insertData() {
    if (this.setWidthAccorActive && this.widthFieldControl.invalid && !this.widthValue) {
      this.showFieldErrors = true;
      this.widthFieldControl.control.markAsTouched();
      return;
    }

    if (this.textConfigureAccorActive && this.heightFieldControl.invalid && !this.heightValue) {
      this.showFieldErrors = true;
      this.heightFieldControl.control.markAsTouched();
      return;
    }

    if (this.textConfigureAccorActive && this.linesFieldControl.invalid && !this.linesValue) {
      this.showFieldErrors = true;
      this.linesFieldControl.control.markAsTouched();
      return;
    }

    if (this.conditionAccorActive && this.condFieldControl.invalid && !this.conditionTextArea) {
      this.showFieldErrors = true;
      this.condFieldControl.control.markAsTouched();
      return;
    }

    const getTextStyle = (height, width, lines, textStyle) => {
      return `
        ${this.setWidthAccorActive && width ? `width: ${width}px;` : ''}
        ${this.textConfigureAccorActive && height ? `height: ${height}px;` : ''}
        ${textStyle ? `text-transform: ${textStyle};` : ''}
        display: -webkit-box;
        ${this.textConfigureAccorActive ? `overflow: hidden;` : ''}
        ${this.textConfigureAccorActive ? `text-overflow: ellipsis;` : ''}
        ${this.textConfigureAccorActive ? `-webkit-line-clamp: ${lines};` : ''}
        -webkit-box-orient: vertical;
      `;
    };

    const getTextCond = (condition) => {
      return `data-ng-if="${condition}"`;
    };

    let textStyle = getTextStyle(this.heightValue, this.widthValue, this.linesValue, this.textStyle);
    textStyle = textStyle.trim();
    const textCondition = this.conditionAccorActive ? getTextCond(this.conditionTextArea) : '';

    setTimeout(() => {
      let customFields: any = { metadata: {} };
      const uniq_id = uuidv4();
      customFields.metadata.id = uniq_id;

      if (this.textConfigureAccorActive) {
        customFields.metadata.height = this.heightValue;
        customFields.metadata.lines = this.linesValue;
      }

      if (this.setWidthAccorActive) {
        customFields.metadata.width = this.widthValue;
      }

      if (this.setStyleAccorActive) {
        customFields.metadata.textStyle = this.textStyle;
      }

      if (this.conditionAccorActive) {
        customFields.metadata.condition = this.conditionTextArea;
        customFields.metadata.selectedSpaceOption = this.selectedSpaceOption;
      }

      // Remove metadata if it is empty
      if (Object.keys(customFields.metadata).length === 0) {
        delete customFields.metadata;
      }

      let savedHTML = '';
      let savedStyle = {};
      if (this.editModeEnable && this.fullObject.html != '') {
        this.extractTextFromHTML(this.fullObject.html, 'parentTextDiv');
        savedHTML = `<section style="${textStyle}" ><div id="parentTextDiv" title="${uniq_id}" ${textCondition}>${this.extractedText}</div></section>`;
        savedStyle = this.fullObject.style;
      } else {
        savedHTML = `<section style="${textStyle}" ><div id="parentTextDiv" title="${uniq_id}" ${textCondition}>New paragraph block.</div></section>`;
      }

      let paraData = {
        1: {
          type: 'paragraph',
          value: {
            html: savedHTML,
            style: savedStyle,
            customFields: customFields,
          },
        },
      };

      this.onClose();
      this.onAdd.emit(paraData[1]);
    }, 1000);
  }

  extractTextFromHTML(html: string, id: string): void {
    var innerContent = '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    /* const divs = tempDiv.querySelectorAll('div');
    divs.forEach(div => {
      div.removeAttribute('style');
      div.removeAttribute('data-ng-if');
      div.removeAttribute('title');
    });
    html = tempDiv.innerHTML; */

    const textContents = Array.from(tempDiv.querySelectorAll('p, div'))
      .map((div) => div.textContent?.trim())
      .filter((text) => text);
    const newDiv = document.createElement('div');
    newDiv.textContent = textContents.join(' ');
    html = newDiv.innerHTML;

    innerContent = html.replace(new RegExp(`\\s*id="${id}"`, 'g'), '');
    this.extractedText = innerContent;
  }

  onClose(): void {
    if (this.bsModalRef) {
      this.bsModalRef.hide();
    }
  }
  helpOLH(section: string) {
    this.authService.globalHelpOLH(section);
  }

  isConditionValid(): boolean {
    try {
      return eval(this.conditionTextArea) === true;
    } catch (e) {
      return false;
    }
  }
}
