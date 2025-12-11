import { Component, NgZone, OnInit } from '@angular/core';
import { SharedataService } from '@app/core/services/sharedata.service';
import { TranslateService } from '@ngx-translate/core';
import { InlineJSComponent } from '../inline-js/inline-js.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LoaderService } from '@app/core/services/loader.service';
import { UseInlineFuncComponent } from '../use-inline-func/use-inline-func.component';
import { HttpService } from '@app/core/services/http.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { AppConstants } from '@app/app.constants';
import Swal from 'sweetalert2';
import { DataService } from '@app/core/services/data.service';
import { GlobalConstants } from '@app/design-channels/common/globalConstants';

@Component({
  selector: 'app-personalizedTag-editor',
  templateUrl: './personalizedTag-editor.component.html',
  styleUrls: ['./personalizedTag-editor.component.scss'],
})
export class PersonalizedTagEditorComponent implements OnInit {
  isPersonalizeTagMode: boolean = true;
  isExpendedSection: boolean = false;
  expandedScriptIndex: number = 0;
  loadAllFunctions: any;
  /* scriptsData = [
    {
      inlineJSKey: 1,
      name: 'adjustParams',
      description: 'adjustParams Function description appears here.',
      inputOutput: `{"inlineJsFunction": [{"input": ["param1", "param2", "param3"], "footer": "return output;}", "header": "function adjustParams(param1, param2, param3){var output;", "output": ["output"], "content": "output = param1+param2+param3"}]}`,
      jsType: 2,
      tagKey: '121',
      s3JsFilePath: "${this.CLOUD_FRONT_URL}/resources/js/tenant_v1.js}",
      active: 1
    },
    {
      inlineJSKey: 2,
      name: 'priceInCents',
      description: 'priceInCents Function description appears here.',
      inputOutput: `{"inlineJsFunction": [{"input": ["Price", "offerPrice"], "footer": "return output;}", "header": "function priceInCents(Price, offerPrice){var output;", "output": ["output"], "content": "output = Price-offerPrice"}]}`,
      jsType: 1,
      tagKey: '122',
      s3JsFilePath: "${this.CLOUD_FRONT_URL}/resources/js/tenant_v2.js}",
      active: 0
    },
    {
      inlineJSKey: 3,
      name: 'additionNumbers',
      description: 'additionNumbers Function description appears here.',
      inputOutput: `{"inlineJsFunction": [{"input": ["A", "B"], "footer": "return output;}", "header": "function additionNumbers(A, B){var output;", "output": ["output"], "content": "output = A+B"}]}`,
      jsType: 2,
      tagKey: '123',
      s3JsFilePath: "${this.CLOUD_FRONT_URL}/resources/js/tenant_v1.js}",
      active: 1
    },
    {
      inlineJSKey: 4,
      name: 'squareRoot',
      description: 'squareRoot Function description appears here.',
      inputOutput: `{"inlineJsFunction": [{"input": ["num"], "footer": "return output;}", "header": "function squareRoot(num){var output;", "output": ["output"], "content": "output = num*num"}]}`,
      jsType: 2,
      tagKey: '124',
      s3JsFilePath: null,
      active: 0
    },
  ]; */

  selectedTab = 1; // Default tab
  searchQuery: string = '';
  scriptsData: any;
  isPublishedPersonalization: boolean = false;
  isGrapesJsFeatureEnabled: boolean = false;
  selectedCurrEditor: 'email' | 'whatsapp' | null = null;

  constructor(
    private shareService: SharedataService,
    private translate: TranslateService,
    private httpService: HttpService,
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private loader: LoaderService,
    private ngZone: NgZone,
    private clipboard: Clipboard,
    private dataService: DataService
  ) {
    this.shareService.personalizeTagService.next(this.isPersonalizeTagMode);
    this.shareService.setNavigationCodeForPersonalizedTag.next('2');

    this.shareService.isPublishEnabledForPersonalization.subscribe((res) => {
      if (res !== undefined) {
        this.isPublishedPersonalization = res;
      }
    });

    this.shareService.grapesJsEnabled.subscribe((res) => {
      if (res !== undefined) {
        this.isGrapesJsFeatureEnabled = res;
      }
    });

    const storedType = sessionStorage.getItem('selectedEditor') as 'email' | 'whatsapp' | null;
    this.selectedCurrEditor = storedType === 'whatsapp' ? 'whatsapp' : 'email';
    GlobalConstants.editorType = this.selectedCurrEditor === 'email' ? 1 : 2;
  }

  ngOnInit(): void {}

  openInlineJsList() {
    this.isExpendedSection = !this.isExpendedSection;
    if (this.isExpendedSection) {
      this.httpService.get(AppConstants.INLINEJS.LIST_OF_ALL_FUNCTIONS).subscribe((data) => {
        let fetchedData = JSON.parse(data.body.response.inlineJsJson);
        this.loadAllFunctions = fetchedData.previewinlineJSs;
        this.scriptsData = this.loadAllFunctions;
        this.searchQuery = "";
      });
    }
  }

  OpenInlineJsPopup(dataObj) {
    this.openInlineJsList();
    this.callPopupComponent(InlineJSComponent, dataObj, 'simulatePopupCss m-0');
  }
  callPopupComponent(modalTemplate, dataObj, classCss) {
    const initialState = {
      savedFuncData: dataObj, // Pass the object value here
    };
    this.modalRef = this.modalService.show(modalTemplate, {
      class: 'modal-dialog-centered ' + classCss,
      backdrop: 'static',
      keyboard: false,
      initialState: initialState,
    });
    this.removeLoader();
  }

  removeLoader() {
    this.ngZone.run(() => {
      this.loader.loadCount = 0;
      this.loader.HideLoader();
    });
  }

  // Toggle expand/collapse
  toggleExpand(index: number) {
    if (this.expandedScriptIndex === index) {
      this.expandedScriptIndex = -1; // Collapse if the same script is clicked
    } else {
      this.expandedScriptIndex = index; // Expand the clicked script
    }
  }

  // Set the selected tab
  setTab(tab) {
    this.selectedTab = tab;
    this.filteredScripts();
  }

  filteredScripts() {
    this.scriptsData = this.loadAllFunctions.filter((script) => {
      const matchesTab =
        this.selectedTab === 1 ||
        (this.selectedTab === 2 && script.active == 1) ||
        (this.selectedTab === 3 && script.active == 2);
      const matchesSearch = script.functionName.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }

  openUseFunction(scriptId: any) {
    const matchesFunc = this.scriptsData.find((script) => script.inlineJSKey === scriptId);
    //console.log(matchesFunc);
    this.callUseFunction(UseInlineFuncComponent, matchesFunc, 'useScriptPopup');
  }

  // Function for handling "Use function" button
  callUseFunction(modalTemplate, dataObject, classCss) {
    const initialState1 = {
      selectedFuncData: dataObject, // Pass the object value here
    };

    this.modalRef = this.modalService.show(modalTemplate, {
      class: 'modal-dialog-centered ' + classCss,
      backdrop: 'static',
      keyboard: false,
      initialState: initialState1,
    });
    this.removeLoader();
  }

  editFunction(obj) {
    obj.view = false;
    obj.edit = true;
    this.OpenInlineJsPopup(obj);
  }

  ViewFunction(obj) {
    obj.view = true;
    obj.edit = false;
    this.OpenInlineJsPopup(obj);
  }

  copyFuncScript(tooltip, scriptObj) {
    let paramValues = scriptObj.inlineJsFunction.input.join(', ');
    let copyText = `{{ ${scriptObj.functionName}(${paramValues}) }}`;
    tooltip.open(copyText);
    this.clipboard.copy(copyText);
    setTimeout(() => tooltip.close(), 1000);
  }

  activatePTag(el, inlineJSKey, functionName) {
      let stateControl: boolean;
      let cid = el.target.getAttribute('cid');
      let msg: string = '';
      let confirmMsg = '';
      if (cid == 1) {
        stateControl = true;
        confirmMsg = this.translate.instant('inlineJSComponent.validationMessages.deactivateConfirmMsg');
        let msgResplace = this.translate.instant('inlineJSComponent.label.scriptnameHasBeenDeactivedLbl');
        msg = msgResplace.replace('#xyz#',functionName);
      } else {
        stateControl = false;
        confirmMsg = this.translate.instant('inlineJSComponent.validationMessages.activateConfirmMsg');
        let msgResplace = this.translate.instant('inlineJSComponent.label.scriptnameHasBeenActivatedLbl');
        msg = msgResplace.replace('#xyz#',functionName);
      }
      confirmMsg = confirmMsg.replace('#xyz#',functionName);
      let endpoint = AppConstants.INLINEJS.DEACTIVATE_FUNCTION +'?jsKey=' +inlineJSKey+'&disable='+stateControl;
      /* let endpoint = AppConstants.INLINEJS.DEACTIVATE_FUNCTION +
               '?jsKey=' + inlineJSKey +
               (stateControl ? '&disable=' + stateControl : ''); */
      Swal.fire({
        titleText: confirmMsg,
        imageUrl: "./assets/images/warning-icon.png",
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: this.translate.instant('yes'),
        cancelButtonText: this.translate.instant('cancel'),
        cancelButtonColor: '',
        allowOutsideClick: false,
        allowEscapeKey: false,
        customClass: {
          cancelButton: 'buttonCssStyle',
          confirmButton: 'buttonCssStyle',
        },
      }).then((result) => {
        if (result.value) {
          this.httpService.post(endpoint).subscribe((data) => {
            if (data.status == 'SUCCESS') {
              this.selectedTab = 1;
              this.dataService.SwalSuccessMsg(functionName+"&nbsp"+msg);
              this.openInlineJsList();
            }
          });
        }
      })
    }
}
