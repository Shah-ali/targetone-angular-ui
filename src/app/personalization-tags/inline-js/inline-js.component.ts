import { ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RESERVED_WORDS } from './reserved-words';
import { DataService } from '@app/core/services/data.service';
import { HttpService } from '@app/core/services/http.service';
import { TranslateService } from '@ngx-translate/core';
import 'codemirror/mode/javascript/javascript'; // Import JavaScript mode
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { SharedataService } from '@app/core/services/sharedata.service';
import Swal from 'sweetalert2';

interface DynamicInput {
  id: string;
  value: string;
  error: string;
}

const defaults = {
  'text/typescript': `const hello: string = 'world';`,
};

@Component({
  selector: 'app-inline-js',
  templateUrl: './inline-js.component.html',
  styleUrls: ['./inline-js.component.scss'],
})
export class InlineJSComponent implements OnInit {
  @Input() savedFuncData: any;
  @ViewChild('parentDiv', { static: false }) parentDiv!: ElementRef;
  @ViewChild('codemirrorElementReference') codemirrorElementReference!: ElementRef;
  @ViewChild(CodemirrorComponent) codemirror!: CodemirrorComponent;
  showLoader: boolean = false;
  dynamicInputs: DynamicInput[] = [{ id: 'field1', value: '', error: '' }];
  dynamicOutputs: DynamicInput[] = [{ id: 'output1', value: '', error: '' }];
  maxFields: number = 5;
  editModeInlineJS: boolean = false;
  viewModeInlineJS: boolean = false;
  disabledAddBttn: boolean = false;
  disabledAddBttn2: boolean = false;
  scriptName: string = 'myFunction';
  scriptDesc: string = '';
  scriptNameError: string = '';
  input1: string | null = null;
  output: string = '';
  logic: any;
  reservedWordsRegex: RegExp = new RegExp(`^(${RESERVED_WORDS.join('|')})$`);
  isTestConsoleOpened: boolean = false;
  tagKey: any;
  codeMirrorOptions: any = {
    theme: 'default',
    mode: 'javascript',
    indentWithTabs: true,
    smartIndent: true,
    lineNumbers: true,
    lineWrapping: false,
    extraKeys: { 'Ctrl-Space': 'autocomplete' },
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: true,
  };
  isFuncExecuteSuccess: boolean = false;
  isPublishedPersonalization: boolean = false;
  isMultiOutputChecked: boolean = false;
  showConsoleSwitch:any = '';
  constructor(
    public bsModalRef: BsModalRef,
    private renderer: Renderer2,
    private dataService: DataService,
    private httpService: HttpService,
    private translate: TranslateService,
    private modalService: BsModalService,
    private shareService: SharedataService
  ) {
    this.shareService.isPublishEnabledForPersonalization.subscribe((res) => {
      if (res !== undefined) {
        this.isPublishedPersonalization = res;
      }
    });
  }

  ngOnInit(): void {
    this.showConsoleSwitch = this.translate.instant('fusionJSComponent.showLbl');
    if (this.savedFuncData) {
      this.editModeInlineJS = this.savedFuncData.edit;
      this.viewModeInlineJS = this.savedFuncData.view;
      this.scriptName = this.savedFuncData.functionName;
      this.scriptDesc = this.savedFuncData.functionDesc;
      let inputObj = this.savedFuncData.inlineJsFunction.input;
      let outputObj = this.savedFuncData.inlineJsFunction.output;

      this.dynamicInputs = [];
      inputObj.forEach((p, i) => {
        this.dynamicInputs.push({ id: 'field' + i, value: p, error: '' });
      });

      this.dynamicOutputs = [];
      outputObj.forEach((p, i) => {
        this.dynamicOutputs.push({ id: 'outputField' + i, value: p, error: '' });
      });

      this.logic = this.savedFuncData.inlineJsFunction.content;
      
      if(this.savedFuncData.inlineJsFunction.outputType == 'multi') {
        this.isMultiOutputChecked = true;
      } else {
        this.isMultiOutputChecked = false;
      }
    }
  }

  ngAfterViewInit() {
    this.modalService.onShown.subscribe(() => {
      setTimeout(() => this.codemirror.codeMirror?.refresh(), 0);
    });
  }

  get activeParameters(): string {
    const params: any = [];
    this.dynamicInputs.forEach((input) => {
      if (input.value !== null && input.value.trim() !== '') {
        params.push(input.value.trim());
      }
    });

    return params.join(',');
  }

  get outputParameters(): string {
    const params: any = {};
    this.dynamicOutputs.forEach((input) => {
      if (input.value !== null && input.value.trim() !== '') {
        params[input.value] = "";
      }
    });

    return params;
  }

  addInputField() {
    if (this.dynamicInputs.length < this.maxFields) {
      const newId = `field${this.dynamicInputs.length + 1}`;
      this.dynamicInputs.push({ id: newId, value: '', error: '' });
    }
    this.disabledAddBttn = this.dynamicInputs.length >= this.maxFields;
  }

  addOutputField() {
    if (this.dynamicOutputs.length < this.maxFields) {
      const newId = `field${this.dynamicOutputs.length + 1}`;
      this.dynamicOutputs.push({ id: newId, value: '', error: '' });
    }
    this.disabledAddBttn2 = this.dynamicOutputs.length >= this.maxFields;
  }

  removeInputField(index: number) {
    if (this.dynamicInputs.length > 1) {
      this.dynamicInputs.splice(index, 1);
    }
    this.disabledAddBttn = false;
  }

  removeOutputField(index: number) {
    if (this.dynamicOutputs.length > 1) {
      this.dynamicOutputs.splice(index, 1);
    }
    this.disabledAddBttn2 = false;
  }

  onClose(): void {
    if (this.bsModalRef !== undefined) {
      this.bsModalRef.hide();
    }
  }

  runTest() {
    const params: string[] = [];
    const oparams: string[] = [];
    const args: string[] = [];
    let funcHeader = '';

    if(this.isMultiOutputChecked) {
      this.dynamicOutputs.forEach((output, index) => {
        if (output.value !== null && output.value.trim() !== '') {
          oparams.push(output.value);
        }
      });
    }

    this.dynamicInputs.forEach((input, index) => {
      if (input.value !== null && input.value.trim() !== '') {
        params.push(input.value);
        const inputElement = document.getElementById(`pfield${index}`) as HTMLInputElement;
        if (inputElement) {
          args.push(inputElement.value);
        }
      }
    });

    try {
      funcHeader = `${this.scriptName}(${params.join(',')})`;
      let outputVar;
      let newOparams = JSON.stringify(oparams);
      if(this.isMultiOutputChecked) {
        outputVar = `let output = ${newOparams}`;
      } else {
        outputVar = 'let output';
      }
      const fullLogic = `
          function ${this.scriptName}(${params.join(',')}) {
            ${outputVar};
            ${this.logic};
            return output;
          }
          ${this.scriptName}(${args.join(',')});
      `;

      if (this.logic == '') {
        let errorStyle = 'color:#CC0000;border-bottom: 3px double #000;padding:10px';
        const translatedText = this.translate.instant('inlineJSComponent.validationMessages.noLogicOrContent');
        this.output = `<span style="${errorStyle}">${translatedText}</span>`;
        this.isFuncExecuteSuccess = false;
      } else {
        const result = eval(fullLogic.trim());
        let outputStyle = 'color:#000;border-bottom: 1px dashed #000;padding:10px';
        const translatedText = this.translate.instant('inlineJSComponent.validationMessages.codeRunSuccessfullyMsg');
        let gout = result !== undefined ? result : translatedText;
        if (this.isMultiOutputChecked) {
          let resultString = '';
          for (const [key, value] of Object.entries(result)) {
            resultString += `${key}: ${value}\n`;  // Add a newline after each key-value pair
          }
          this.output = `<pre class="m-0" style="${outputStyle}">Output:\n${resultString}</pre>`;
        } else {
          this.output = `<span style="${outputStyle}">Output: ${gout}</span>`;
        }
        
        if (result == undefined) {
          this.isFuncExecuteSuccess = false;
        } else {
          this.isFuncExecuteSuccess = true;
        }
      }
    } catch (error: any) {
      let errorStyle = 'color:#CC0000;border-bottom: 3px double #000;padding:10px';
      this.output = `<span style="${errorStyle}">Error: ${error.message}</span>`;
      this.isFuncExecuteSuccess = false;
    }

    let heightD = '89px';
    if(this.isMultiOutputChecked) {
      heightD = "auto";
    }
    const childDivHtml = `<div style="display:flex;flex-direction:column;height:${heightD}">
      <span style="color:#C478FF;border-bottom: 1px dashed #000;padding:10px">${this.scriptName}&#40;${args.join(
      ','
    )}&#41;</span>
      ${this.output}
      <hr class="m-0" />
    </div>`;

    const childDiv = this.renderer.createElement('div');
    this.renderer.setProperty(childDiv, 'innerHTML', childDivHtml);
    this.renderer.appendChild(this.parentDiv.nativeElement, childDiv);

    setTimeout(() => {
      this.parentDiv.nativeElement.scrollTop = this.parentDiv.nativeElement.scrollHeight;
    }, 0);

    return this.isFuncExecuteSuccess;
  }

  cleanConsole() {
    this.renderer.setProperty(this.parentDiv.nativeElement, 'innerHTML', '');

    // Optionally scroll to the top after cleaning
    setTimeout(() => {
      this.parentDiv.nativeElement.scrollTop = 0;
    }, 0);
  }

  validateDynamicInput(input: DynamicInput) {
    const variableName = this.translate.instant('inlineJSComponent.label.variableName');
    input.error = this.validate(input.value, variableName);
  }

  validateScriptName() {
    const scriptName = this.translate.instant('inlineJSComponent.label.scriptName');
    this.scriptNameError = this.validate(this.scriptName, scriptName);
  }

  validate(value: string, fieldName: string): string {
    const trimmedValue = value.trim();
    const trimmedValue1 = value;

    // Check if the input is empty
    if (trimmedValue === '') {
      const isRequired = this.translate.instant('inlineJSComponent.label.shouldntBeEmptyLbl');
      return `${fieldName} ${isRequired}`;
    }

    if (/\s/.test(trimmedValue1)) {
      const cannotContainSpaces = this.translate.instant('inlineJSComponent.validationMessages.cannotContainSpaces');
      return `${fieldName} ${cannotContainSpaces}`;
    }

    // Check if the input is longer than 50 characters
    if (trimmedValue.length > 50) {
      const cannotExceedCharacters = this.translate.instant(
        'inlineJSComponent.validationMessages.cannotExceedCharacters',
        { value1: 50 }
      );
      return `${fieldName} ${cannotExceedCharacters}`;
    }

    // Check if the input starts with an alphabet
    const startsWithAlphabet = /^[A-Za-z]/.test(trimmedValue1);
    if (!startsWithAlphabet) {
      const mustStartWithAnAlphabet = this.translate.instant('inlineJSComponent.validationMessages.mustStartWithAnAlphabet');
      return `${fieldName} ${mustStartWithAnAlphabet}`;
    }

    // Check if the input contains only allowed characters (alphanumeric and underscore)
    const isValidFormat = /^[A-Za-z0-9_]+$/.test(trimmedValue);
    if (!isValidFormat) {
      const canOnlyContainAlphanumericUnderscores = this.translate.instant('inlineJSComponent.validationMessages.canOnlyContainAlphanumericUnderscores');
      return `${fieldName} ${canOnlyContainAlphanumericUnderscores}`;
    }

    // Check for reserved words
    if (this.reservedWordsRegex.test(trimmedValue)) {
      const isReservedJavaScriptKeyword = this.translate.instant('inlineJSComponent.validationMessages.isReservedJavaScriptKeyword');
      return `"${trimmedValue}" ${isReservedJavaScriptKeyword}`;
    }

    return ''; // No errors
  }

  toggleTestConsole() {
    this.isTestConsoleOpened = !this.isTestConsoleOpened;
  }

  openTestConsole() {
    this.isTestConsoleOpened = true;
  }

  saveInlineJs() {
    this.showLoader = true;
    let inlineJSKey = -1;
    let newOparams = JSON.stringify(this.outputParameters);
    let outputVar;
    let outputObj = {};
    let outputType = "";
    let outputParam: any;

    if(this.isMultiOutputChecked) {
      outputVar = `let output = ${newOparams}`;
      outputType = 'multi';
      outputObj = this.outputParameters;
      outputParam = Object.keys(this.outputParameters)
    } else {
      outputVar = 'let output';
      outputType = 'single';
      outputObj = [];
      outputParam = ['output']
    }

    try {
      const fullLogic = `
      function ${this.scriptName}(${this.activeParameters}) {
        ${outputVar};
        ${this.logic};
        return output;
      }`;
      let testFunc = eval(`(${fullLogic})`);
    } catch (error) {
      this.showLoader = false;
      this.dataService.SwalValidationMsg(this.translate.instant('inlineJSComponent.label.funtionConnotBeSavedDueToErrorLbl') + error);
      return;
    }

    this.tagKey = this.dataService.activeContentTagKey;
    let inputOutput = {
      input: this.activeParameters.trim().split(','),
      footer: '\nreturn output;\n}',
      header: `function ${this.scriptName}(${this.activeParameters}){\n${outputVar};\n`,
      output: outputParam,
      content: this.logic,
      outputType: outputType
    };

    if (this.tagKey == -1) {
      this.showLoader = false;
      this.dataService.SwalValidationMsg(this.translate.instant('inlineJSComponent.label.itsNotSavedActiveContentValidationMesgLbl'));
      return;
    }

    if (inputOutput.content == undefined || inputOutput.content == '') {
      this.showLoader = false;
      this.dataService.SwalValidationMsg(this.translate.instant('inlineJSComponent.label.contentOfthefuntionIsEmptyLbl'));
      return;
    }

    if (this.editModeInlineJS) {
      inlineJSKey = this.savedFuncData.inlineJSKey;
    }
    let inlineJSObj = {
      inlineJsKey: inlineJSKey,
      name: this.scriptName,
      description: this.scriptDesc,
      inputOutput: JSON.stringify(inputOutput),
      jsType: 2,
      tagKey: this.tagKey,
      active: 1
    };
    const body = inlineJSObj;
    this.httpService.post('/inlineJs/save', body).subscribe((data) => {
      this.showLoader = false;
      if(data.status == 'FAIL'){
          Swal.fire({
          icon: 'warning',
          text: this.translate.instant(data.message),
          showConfirmButton:true,
          confirmButtonText:this.translate.instant('designEditor.okBtn')
          });        
      }else{
          this.dataService.SwalSuccessMsg(data.message);
      }
    });
  }

  setEditorContent(event) {
    // console.log(event, typeof event);
    //console.log(event);
  }

  validateDynamicOutput(input: DynamicInput) {
    const variableName = this.translate.instant('inlineJSComponent.label.variableName');
    input.error = this.validate(input.value, variableName);
  }

  toggleMultiOutput() {
    this.isMultiOutputChecked = !this.isMultiOutputChecked;
  }
}
