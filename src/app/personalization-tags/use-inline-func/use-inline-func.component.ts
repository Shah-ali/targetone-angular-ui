import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { GlobalConstants } from '@app/design-channels/common/globalConstants';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

interface DynamicInput {
  id: string;
  value: string;
  error: string;
}

@Component({
  selector: 'app-use-inline-func',
  templateUrl: './use-inline-func.component.html',
  styleUrls: ['./use-inline-func.component.scss'],
})
export class UseInlineFuncComponent implements OnInit {
  @Input() selectedFuncData: any;
  closeHelpSection: boolean = true;
  formData: { [key: string]: string } = {};
  selectedParams: DynamicInput[] = [{ id: '', value: '', error: '' }];
  selectedOutParams: DynamicInput[] = [{ id: '', value: '', error: '' }];
  outputDisplayObjString: any;

  constructor(private translate: TranslateService, public bsModalRef: BsModalRef, private clipboard: Clipboard) {
    GlobalConstants.parentComponentName = 'UseInlineFuncComponent';
    GlobalConstants.isOpenGlobalTags = true;
  }

  ngOnInit(): void {
    let inputObj = this.selectedFuncData.inlineJsFunction.input;
    let outputObj = this.selectedFuncData.inlineJsFunction.output;
    this.selectedParams = [];
    inputObj.forEach((p, i) => {
      this.selectedParams.push({ id: p, value: '', error: '' });
    });

    this.selectedOutParams = [];
    outputObj.forEach((p, i) => {
      this.selectedOutParams.push({ id: p, value: '', error: '' });
    });

    if (this.selectedFuncData.inlineJsFunction.outputType == 'multi') {
      outputObj.forEach((p, i) => {
        if (this.outputDisplayObjString == undefined) {
          this.outputDisplayObjString = `{{ outputDisplayObj.${p} }}`;
        } else {
          this.outputDisplayObjString = this.outputDisplayObjString +`{{ outputDisplayObj.${p} }}`;
        }
      });
    }
    //this.selectedParams = this.selectedFuncData.inlineJsFunction.input;
    //this.selectedParams.forEach((param) => (this.formData[param] = ''));
  }

  onClose(): void {
    if (this.bsModalRef !== undefined) {
      this.bsModalRef.hide();
    }
  }

  selectionFunction(): string {
    let paramValues = this.selectedParams.map((param) => this.formData[param.id]).join(', ');
    let paramOutValues = this.selectedOutParams.map((param) => this.formData[param.id]).join(', ');
    if (this.selectedFuncData.inlineJsFunction.outputType == 'single') {
      return `{{ ${this.selectedFuncData.functionName}(${paramValues}) }}`;
    } else {
      return `<div ng-init="{{ outputDisplayObj = ${this.selectedFuncData.functionName}(${paramValues}) }}">
         ${this.outputDisplayObjString}
</div>`;
    }
  }

  copyFuncScript(tooltip) {
    this.selectedParams.forEach((param) => {
      param.value = this.formData[param.id];
      param.error = this.validateParam(param.id, param.value);
    });

    const hasError = this.selectedParams.some((param) => param.error);
    if (hasError) {
      this.clipboard.copy(' ');
      return; // Stop execution if any param has an error
    }

    const copyText = this.selectionFunction();
    tooltip.open(copyText);
    this.clipboard.copy(copyText);
    setTimeout(() => tooltip.close(), 1000);

    if (this.bsModalRef !== undefined) {
      this.bsModalRef.hide();
    }
  }
  validateParam(id: string, value: string): string {
    if (!value) {
      return `${id.trim()} value is required.`;
    }
    return '';
  }
}
