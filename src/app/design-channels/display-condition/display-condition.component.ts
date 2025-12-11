import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ElementRef,
  ViewChild,
  Input,
  ChangeDetectorRef,
  HostListener,
  NgZone,
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GlobalConstants } from '../common/globalConstants';
import { QueryBuilderClassNames, QueryBuilderConfig, RuleSet } from 'ngx-angular-query-builder';
import { AppConstants } from '@app/app.constants';
import { HttpService } from '@app/core/services/http.service';
import { DataService } from '@app/core/services/data.service';
import { SharedataService } from '@app/core/services/sharedata.service';
import {
  TreeviewItem,
  TreeviewConfig,
  TreeItem,
  TreeviewHelper,
  DropdownTreeviewComponent,
  TreeviewI18n,
} from 'ngx-treeview';
import { Clipboard } from '@angular/cdk/clipboard';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { DcRowPreviewComponent } from '../dc-row-preview/dc-row-preview.component';
import Swal from 'sweetalert2';
import { DefaultTreeviewI18n } from '../default-treeview-i18n';
import { CustomTreeExpandMergeTagComponent } from '@app/utils/custom-tree-expand-merge-tag/custom-tree-expand-merge-tag.component';
import { difference, filter, xor } from 'lodash';
import { RandomNameService } from '@app/core/services/random-name.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-display-condition',
  templateUrl: './display-condition.component.html',
  styleUrls: ['./display-condition.component.scss'],
  providers: [{ provide: TreeviewI18n, useClass: DefaultTreeviewI18n }],
})
export class DisplayConditionComponent implements OnInit {
  @Output() onSaveCond = new EventEmitter<any>();
  @Output() onHidden = new EventEmitter<any>();
  @ViewChild('mergeTagsListData', { static: false }) mergeTagsListData!: ElementRef;
  @ViewChild('filterInputElement', { static: false }) filterInputElementeach!: ElementRef;
  @ViewChild(DropdownTreeviewComponent, { static: false }) dropdownTreeviewComponent!: DropdownTreeviewComponent;
  @ViewChild('dcRowPreview') dcRowPreview!: DcRowPreviewComponent;
  @ViewChild('customTreeMergeTagComponentReference')
  customTreeMergeTagComponentReference!: CustomTreeExpandMergeTagComponent;
  extInputValues: string[] = [];

  results: any = {};
  finalQuery: any;
  dynamicContent: string = '';
  tempCondition: string = '';
  tempDynamicContent: string = '';
  values!: number[];
  items!: TreeviewItem[];
  configuration = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 400,
  });
  customBootstrapStyle: any = ['btn btn-outline-primary buttonStyle shadow-none'];
  treeDropdownButtonStyle: any = ['btn buttonStyle inputparamTreeButton'];
  promotionKey: any;
  currentSplitId: any;
  commChannelKey: any;
  mergeTagDataItems: any;
  mergeTagDataItemsForCond: any;
  isPersonalizeTagMode: boolean = false;
  tagKey: any;
  selectedSectionIndex: number = 0;
  extensions = [
    { label: 'designEditor.mergeTagExtensions.mergeTags', hidden: true, display: true },
    { label: 'designEditor.mergeTagExtensions.conditionBuilder', hidden: false, display: true },
    { label: 'designEditor.mergeTagExtensions.preview', hidden: false, display: false },
    { label: 'designEditor.mergeTagExtensions.imageSettings', hidden: false, display: true }
  ];
  hiddenAddTagSection: boolean = true;
  mergeTagExtJSON: any = [];
  generateMTagExtJSON: any = [];
  selectedItem: any;
  selectedTableData: any;
  selectedRowModelName: any = GlobalConstants.selectedrowModelName;
  selectedRowModelData: any = GlobalConstants.selectedrowModelData;
  addDropdownObj: any;
  filteredExtOptions: any;
  isModelDME: boolean = false;
  modelTypeSelected: string = '';
  selectedExtValue: string = '';
  prevSelectedExtValue: string = '';
  selectExtObj: any = [];
  selectedInputs: any = [];
  childInputs: any = [];
  editMergeTagBttn: boolean = false;
  tempConfigObj = {};
  public queryCtrl: FormControl;
  public configCtrl: QueryBuilderConfig;
  queryDisplay: any;
  maxCountAttributeValue: any = 1;
  rowStyleSelected: any;
  layoutStyleSelected: any;
  enablePreviewOption: boolean = false;
  hiddenInputSection: boolean = true;
  showExtDropdown: boolean = false;
  enableApplyBttn: boolean = true;
  clipboardData: any[] = [];
  childInputTreeObj: any;
  resChildInputTreeObj: any = [];
  //  an array to store the expansion state for each row
  rowExpansionState: boolean[] = [];
  showTreeDropdown: boolean = false;
  showLoader: boolean = false;
  selectedAllExtValues: any[] = [];
  tempSavedQuery: any;
  currentSelectedInput: any;
  selectedDataObj: any = {};
  openMergeTagDataPopup: boolean = false;
  isEditModeEnabled: boolean = false;
  isCustomerTagEnabled: boolean = false;
  isPublishActiveContentEnabled: boolean = false;
  addRuleEnable: boolean = false;
  removeRuleEnable: boolean = false;
  isCustomerDmeBlockDragged: any = undefined;
  selectedLayout: any;
  rowNameValue: any;
  rowNameSavedValue: any;
  scriptNameError: string = '';
  isRowNameEditable: boolean = false;
  saveRowNames: any;
  localExistingRowLabels: any;  
  private rowNameValidate$ = new Subject<string>();
  imageTypeObj:any = {};
  imageTypeSelectedValue: any = 'JPG'; // default value
  imageQualitySelectedValue: any = '80'; // default value
  imageSettingsObj: any = {'imageType':'JPG','imageQuality':'80'}; 
  readyonlydepthEnable: boolean = false;
  imageQualityMinimumValue:any = '80';
  imageQualityMaximumValue:any = '100';
  ensembleAiEnabled:boolean = false;
  defaultOperatorsForMultiResponse = AppConstants.DEFAULT_OPERATORS_ROW_CONFIG.defaultOperatorsForMultiResponse;
  defaultOperatorsForUndefinedOperators = AppConstants.DEFAULT_OPERATORS_ROW_CONFIG.defaultOperatorsForUndefinedOperators;

  constructor(
    private bsModalRef: BsModalRef,
    private httpService: HttpService,
    private dataService: DataService,
    private shareService: SharedataService,
    private clipboard: Clipboard,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private cdref: ChangeDetectorRef,
    private elementRef: ElementRef,
    private randomNameService: RandomNameService,
    private ngZone: NgZone
  ) {

    this.emptyMessage = this.translate.instant('designEditor.displayConditions.emptyRulesetMessage');

    this.selectedAllExtValues.push(this.selectedRowModelName);
    this.dataService.$sharedPromoKey.subscribe((result) => {
      this.promotionKey = result;
    });

    this.shareService.personalizeTagService.subscribe((result) => {
      this.isPersonalizeTagMode = result;
    });
    this.tagKey = this.dataService.activeContentTagKey; //localStorage.getItem('tagKeyPersonalization');

    this.shareService.currentSelectedChannelObj.subscribe((res: any) => {
      this.currentSplitId = res.currentSplitId;
      this.commChannelKey = res.commChannelKey;
    });
    this.shareService.isPublishEnabledForPersonalization.subscribe((res) => {
      if (res !== undefined) {
        this.isPublishActiveContentEnabled = res;
      }
    });

    this.imageTypeObj = [
      {
        imageTypeOptions:[
          {id:0,label:'JPG',minVal:'80',maxVal:'100',value:'JPG'},
          {id:1,label:'PNG',minVal:'100',maxVal:'100',value:'PNG'},
        ]
      }
      
    ];
    this.getCustomerTagEnabledMethod();

    let query: RuleSet = {
      condition: 'and',
      rules: [],
    };
    let config: QueryBuilderConfig = {
      fields: {
        newFilter: { name: 'newFilter', type: 'string' },
      },
    };

    this.tempDynamicContent = GlobalConstants.savedDynamicContent;
    if (this.tempDynamicContent != undefined) {
      const conditionsAttributeValue = this.getAttributeValueFromHtmlString(this.tempDynamicContent, 'conditions');
      if (conditionsAttributeValue !== null && conditionsAttributeValue != '') {
        this.tempCondition = conditionsAttributeValue;
        GlobalConstants.savedDynamicConditions = JSON.parse(conditionsAttributeValue);
        query = GlobalConstants.savedDynamicConditions;
        if(query.rules !== undefined && query.rules.length > 0){
          query.rules.map((rule:any, index:any) => {  
                if(rule.operator?.trim() === 'between') {
                if(rule.value !== undefined && rule.value !== null && rule.value !== ''){
                  rule.value = rule.value.split(',');
              }
            }
              if(rule.condition !== undefined){
                rule.rules.map((childRule:any, childIndex:any) => {
                    if(childRule.operator?.trim() === 'between'){
                    if(childRule.value !== undefined && childRule.value !== null && childRule.value !== ''){
                      childRule.value = childRule.value.split(',');
                    }
                    }
                });

            }
          });
        }
        this.tempSavedQuery = JSON.parse(JSON.stringify(query));
        let tempQuery: any;
        this.tempConfigObj = {};
        tempQuery = query.rules;
        if (tempQuery != undefined) {
          tempQuery.forEach((item) => {
            let tempChidlObj = {};

            if (item.rules) {
              item.rules.forEach((item) => {
                let tempChidlObj1 = {};
                tempChidlObj1['name'] = item.field;
                tempChidlObj1['type'] = 'string';
                tempChidlObj1['index'] = item.index;
                tempChidlObj1['operator'] = item.operator;
                tempChidlObj1['operators'] = item.operators;
                this.tempConfigObj[item.field] = tempChidlObj1;
              });
            } else {
              tempChidlObj['name'] = item.field;
              tempChidlObj['type'] = 'string';
              tempChidlObj['entity'] = item.field;
              tempChidlObj['index'] = item.index;
              tempChidlObj['operator'] = item.operator;
              tempChidlObj['operators'] = item.operators;
              this.tempConfigObj[item.field] = tempChidlObj;
            }
          });

          config.fields = this.tempConfigObj;
        }
      } else {
        GlobalConstants.savedDynamicConditions = '';
      }

      const extAttributeValue = this.getAttributeValueFromHtmlString(this.tempDynamicContent, 'ext');
      if (extAttributeValue !== null) {
        GlobalConstants.savedDynamicExt = JSON.parse(extAttributeValue);
      } else {
        GlobalConstants.savedDynamicExt = {};
      }

      const layoutAttributeValue = this.getAttributeValueFromHtmlString(this.tempDynamicContent, 'layout');
      this.selectedLayout = layoutAttributeValue;
      if (layoutAttributeValue !== null && layoutAttributeValue != '') {
        this.extensions[2].display = true;
        this.maxCountAttributeValue = this.getAttributeValueFromHtmlString(this.tempDynamicContent, 'maxCount');
      } else {
        this.extensions[2].display = true;
      }

      const idAttributeValue = this.getAttributeValueFromHtmlString(this.tempDynamicContent, 'id');
      if (idAttributeValue !== null) {
        GlobalConstants.selectedRowId = idAttributeValue;
      } else {
        GlobalConstants.selectedRowId = '';
      }

      const rowStyleAttrValue = this.getAttributeValueFromHtmlString(this.tempDynamicContent, 'rowStyle');
      if (rowStyleAttrValue !== null) {
        this.rowStyleSelected = rowStyleAttrValue;
      } else {
        this.rowStyleSelected = '';
      }

      const layoutStyleAttrValue = this.getAttributeValueFromHtmlString(this.tempDynamicContent, 'layoutStyle');
      if (layoutStyleAttrValue !== null) {
        this.layoutStyleSelected = layoutStyleAttrValue;
      } else {
        this.layoutStyleSelected = '';
      }
      //----- image Quality ---------------
      const imageSettingsAttrValue = this.getAttributeValueFromHtmlString(this.tempDynamicContent, 'imageSettings');
      if (imageSettingsAttrValue !== null) {
        this.imageSettingsObj = JSON.parse(imageSettingsAttrValue);  
        if(this.imageSettingsObj.imageType == 'PNG'){
          this.readyonlydepthEnable = true;
        }      
      }

      /* const rowNameAttrValue = this.getAttributeValueFromHtmlString(this.tempDynamicContent, 'rowName');
      if (rowNameAttrValue !== null) {
        this.rowNameValue = rowNameAttrValue;
        this.rowNameSavedValue = rowNameAttrValue;
      } else {
        this.rowNameValue = '';
      } */
      const localExistingRowLabels = GlobalConstants.existingRowLabels;
      this.rowNameValue = localExistingRowLabels[GlobalConstants.selectedRowId];
      this.rowNameSavedValue = localExistingRowLabels[GlobalConstants.selectedRowId];
      if(this.rowNameValue == undefined || this.rowNameValue == ''){
        this.rowNameValue = this.randomNameService.generateRandomName("rowName-");
      }
    } else {
      GlobalConstants.savedDynamicExt = {};
    }

    this.queryDisplay = query;
    this.queryCtrl = this.formBuilder.control(query);
    this.configCtrl = config;

    /* setTimeout(() => {
      if(this.queryDisplay.rules.length != 0) {
        this.queryDisplay.rules.forEach((m) => {
          let dropdownEMl: any = this.mergeTagsListData;
          let mText: any;
          if(m.field.text) {
            mText = m.field.text;
          } else {
            mText = m.field;
          }
          this.resetCheckedFalseInMergeTag();
          const selectedItem = TreeviewHelper.findItemInList(dropdownEMl.items, mText);
          if (this.dropdownTreeviewComponent) {
            this.dropdownTreeviewComponent.treeviewComponent.selection.uncheckedItems = this.dropdownTreeviewComponent.treeviewComponent.selection.checkedItems;
            this.dropdownTreeviewComponent.treeviewComponent.selection.checkedItems = [];
            this.dropdownTreeviewComponent.treeviewComponent.selection.checkedItems.push(selectedItem);
            this.dropdownTreeviewComponent.onSelectedChange([selectedItem]);
          }
        });
      }
    }, 1000); */

    this.localExistingRowLabels = GlobalConstants.existingRowLabels;
  }
  onValueChange(event, rule){
    let findFieldIndex = this.queryDisplay.rules.findIndex((r) => r.field === rule.field);
    if(findFieldIndex !== -1){
      this.queryDisplay.rules[findFieldIndex].value = rule.value;
    }
  }
  onBetweenValueChange(event, rule){
    let findFieldIndex = this.queryDisplay.rules.findIndex((r) => r.field === rule.field);
    if(findFieldIndex !== -1){
      this.queryDisplay.rules[findFieldIndex].value = rule.value;
    }
  }
  ngAfterViewInit(): void {
    this.shareService.selectedRowOuterHTML.subscribe((res) => {
      if (res || res != '') {
        this.dcRowPreview.getRowPreview(res);
      }
    });
    /* const elements = document.querySelectorAll('.treeViewDropdownStyle');
    elements.forEach((button, i) => {
      const field = this.queryDisplay.rules[i]?.field || '';
      const previousSibling = button.previousElementSibling;

      if (previousSibling) {
        previousSibling.textContent = 'Selected tag: ' + field;
      }
      // button.textContent = field;
    }); */
  }

    selectImageTypeMethod(evt,isReset){
      let type:any;
      let imageObj:any;
      if(evt.target !== undefined){
        type = evt.target.value; // accessing from event
        imageObj = type;
      }else{
        type = evt; // giving direct value
        imageObj = type.imageType;
      }
      if(imageObj === 'PNG'){
        this.imageSettingsObj.imageQuality = '100';
        this.readyonlydepthEnable = true;
      }else{       
        if(isReset){
          this.imageSettingsObj.imageQuality = '80';
        }
        this.readyonlydepthEnable = false;
      }
      this.imageTypeSelectedValue = type; // set the value
    }
  updateParamsInputs(saveObj, index, rule, callQueryBuilderMethod) {
    this.selectedDataObj[index] = saveObj.value;
    if (rule.value === undefined) {
      rule['value'] = rule.field;
      //rule["type"] = "string";
    }
    let finalOperators = this.getOperatorFromMergeTagDataMethod(saveObj.value);
    rule.operators = finalOperators;
    this.operatorValChangedMethod(rule, saveObj.value);
    callQueryBuilderMethod(rule.field, rule);
    this.updateQueryDataMethod(saveObj.value, index);
  }
  operatorValChangedMethod(ruleObj, newVal) {
    let obj: any = [];
    if (this.configCtrl.fields !== undefined) {
      let arrayFields = Object.values(this.configCtrl.fields);
      arrayFields.map((x: any) => {
        if (x.index === ruleObj.index) {
          let finalOperators = this.getOperatorFromMergeTagDataMethod(newVal);
          this.configCtrl.fields[ruleObj.field].operators = finalOperators;
        }
      });
    }
  }
  parseValIfObjOrStringMethod(ObjOrStr) {
    let paramsObj;
    if (typeof ObjOrStr === 'object') {
      paramsObj = ObjOrStr;
    } else {
      paramsObj = JSON.parse(ObjOrStr);
    }
    return paramsObj;
  }
  getMergeTagData() {
    this.showLoader = true;
    let url: string;
    const baseEndpoint = AppConstants.API_END_POINTS.GET_DME_MERGE_TAG_OBJ;
    const commonParams = '&wa=true';

    if (this.isPersonalizeTagMode) {
      url = `${baseEndpoint}?tagKey=${this.tagKey}${commonParams}&api=true&prod=true`;
    } else {
      url = `${baseEndpoint}?promoKey=${this.promotionKey}&splitKey=${this.currentSplitId}${commonParams}&prod=true`;
    }

    //setTimeout(() => {
    this.httpService.post(url).subscribe((data) => {
      if (data.status === 'SUCCESS') {
        this.mergeTagDataItems = JSON.parse(data.response).root;
        this.mergeTagDataItemsForCond = this.mergeTagDataItems;
        //this.loadData();
        //console.log(this.mergeTagDataItems);
        //this.showLoader = false;
        this.getMergeTagExt();
      }
    });
    //}, 1000);
  }

  ifFreeStyleLayout(value) {
    return Array.isArray(value);
  }
  toggleInnerTable(event, action: string, i): void {
    const parentRow = (event.currentTarget as HTMLElement).closest('.inner-table-cell');
    const innerTable = parentRow?.querySelector('.inner-table');
    // Toggle the 'show' class for the clicked inner table
    innerTable?.classList?.toggle('show');
    this.toggleRowExpansion(i);
  }
  showMergeTagDropDownMethod(evt, key) {
    //this.uuidOnload = uuidv4();
    //  this.openMergeTagDataPopup = true;
    //  if(this.openMergeTagDataPopup)
    let keyname = evt.target.getAttribute('data-keyname');
    this.currentSelectedInput = key;
    this.openMergeTagDataPopup = !this.openMergeTagDataPopup;
    setTimeout(() => {
      if (this.customTreeMergeTagComponentReference !== undefined) {
        this.customTreeMergeTagComponentReference.showMergeTagDropDownMethod();
      }
    }, 100);

    //this.mergeTagComponentReference.openMergeTagDataPopup = !this.openMergeTagDataPopup;
  }
  getMergeTagExt() {
    /* this.httpService.get1('merge-tag-ext1.json').subscribe((res) => {
      this.mergeTagExtJSON = res.body;
      this.selectedItem = this.mergeTagExtJSON[0];
      this.selectedTableData = this.selectedItem.fields;
    }); */
    
    let url: string;
    const baseEndpoint = AppConstants.API_END_POINTS.GET_PMERGETAG_EXT_URL;
    const commonParams = '&wa=true';
    let freeStyle = this.selectedRowModelData?.freeStyle;
    let maxCount = this.selectedRowModelData?.maxCount;
    let type = this.selectedRowModelData?.type;
    let name = '';
    if (type == 'dme') {
      name = this.selectedRowModelData?.modelHashName;
    } else {
      name = this.selectedRowModelName;
    }
    this.isCustomerDmeBlockDragged = this.selectedRowModelData?.whichBlockDragged;
    if (this.isPersonalizeTagMode) {
      url = `${baseEndpoint}?tagKey=${this.tagKey}${commonParams}&pta=true`;
      // Check if freeStyle is true before adding it to the URL
      if (freeStyle) {
        url += `&freeStyle=${freeStyle}`;
      }

      // Check if maxCount is defined before adding it to the URL
      if (maxCount !== undefined) {
        url += `&maxCount=${maxCount}`;
      }
      url += `&type=${type}&name=${name}`;
    } else {
      url = `${baseEndpoint}?promoKey=${this.promotionKey}&splitKey=${this.currentSplitId}${commonParams}&pta=false&api=false`;
    }
    
    this.httpService.post(url).subscribe((res) => {
      this.mergeTagExtJSON = JSON.parse(res.response).root;

      for (let i = 0; i < this.mergeTagExtJSON.length; i++) {
        if (this.mergeTagExtJSON[i].type === 'dropdown') {
          this.resChildInputTreeObj = this.mergeTagExtJSON[i].dropDown;
          this.mergeTagExtJSON.splice(i, 1); // Remove the element from the array
          break; // Exit the loop after finding the first dropdown element
        }
        if (this.isPersonalizeTagMode) {
          // Active Content
          if (!this.isCustomerTagEnabled) {
            // open tags only
            if (this.mergeTagExtJSON[i].type === 'customerDme') {
              this.mergeTagExtJSON.splice(i, 1); // Remove the element from the array
              //break; // Exit the loop after finding the first dropdown element
            }
            if (this.mergeTagExtJSON[i].type === 'customer') {
              this.mergeTagExtJSON.splice(i, 1); // Remove the element from the array
              //break; // Exit the loop after finding the first dropdown element
            }
          } else {
            // contains Customer tags
            // Show All attributes
          }
        } else {
          // Journey
          if (this.mergeTagExtJSON[i].type === 'NonCustomerDme') {
            // in journey DME non customer is enabled, Hence Allowing the non-customer attributes
            if (!this.isCustomerTagEnabled) {
              //this.mergeTagExtJSON.splice(i, 1); // Remove the element from the array
              //break; // Exit the loop after finding the first dropdown element
            }
          }
        }
      }

      if (this.isPersonalizeTagMode) {
        // for Active content
        if (this.selectedRowModelName != 'productReco') {
          this.mergeTagExtJSON = this.mergeTagExtJSON.filter((item) => item.type !== 'contextProduct');
        }
      }

      if (!this.isPersonalizeTagMode) {
        // for journey
        this.mergeTagExtJSON = this.mergeTagExtJSON.filter((item) => item.type.toLowerCase() !== 'api');
      }

      this.selectedItem = this.mergeTagExtJSON[0];
      this.selectedTableData = this.selectedItem.fields;
      if (this.selectedTableData != null) {
        this.rowExpansionState = new Array(this.selectedTableData.length).fill(false);
      }

      if (GlobalConstants.savedDynamicExt.length > 0) {
        GlobalConstants.savedDynamicExt.forEach((p) => {
          let tempObj;
          if (p.type == 'dme') {
            tempObj = (this.mergeTagExtJSON.find((x) => x.type === p.ctype)?.child || []).find(
              (x) => x.modelNameHash === p.name
            );
          } else {
            tempObj = (this.mergeTagExtJSON.find((x) => x.type === p.ctype)?.child || []).find((x) => x.name === p.name);
          }
          let myArray = {};
          if (tempObj) {
            this.selectExtObj.push(tempObj);
            this.selectExtObj = [...new Set(this.selectExtObj)];
            this.hiddenAddTagSection = true;

            const inputs = p.inputs || {}; // Use an empty object as the default if p.inputs is undefined
            //const lookupFields = p.lookupFields || {};
            const myInputArray = Array.isArray(inputs)
              ? inputs
              : Object.keys(inputs).map((key) => ({
                  name: key,
                  value: inputs[key],
                }));

            /* const myLookupArray = Array.isArray(lookupFields)
              ? lookupFields
              : Object.keys(lookupFields).map((key) => ({
                  name: key,
                  value: lookupFields[key],
                })); */

            const tempExt = {
              type: tempObj.type,
              ctype: tempObj.ctype,
              name: tempObj.type == 'dme' ? tempObj.modelNameHash : tempObj.name,
              cName: tempObj.name,
              inputs: myInputArray,
              //lookupFields: myLookupArray,
            };

            const index = this.selectedInputs.findIndex((item) => item.name === tempExt.name);
            this.selectedAllExtValues.push(tempExt.cName); // old tempExt.name
            if (index !== -1) {
              this.selectedInputs[index] = tempExt;
            } else {
              this.selectedInputs.push(tempExt);
            }
          }
        });
      }
      setTimeout(() => {
        this.showLoader = false;
      }, 100);
    });
  }
  getCustomerTagEnabledMethod() {
    this.httpService
      .post(AppConstants.API_PERSONSOALIZATION_TAGS_END_POINTS.GET_VERIFY_CUSTOMER_TAG_ENABLE_API + this.tagKey)
      .subscribe((res) => {
        this.isCustomerTagEnabled = res;
        this.getMergeTagData();
      });
  }
  selectItem(event, item): void {
    if (event != '') {
      const selectedElement = document.querySelector('li.rowSelected');
      if (selectedElement) {
        selectedElement.classList.remove('rowSelected');
      }
      event.target.closest('li').classList.add('rowSelected');
    }

    this.selectedItem = item;
    this.selectedTableData = item.fields;
    if (this.selectedTableData != null) {
      this.rowExpansionState = new Array(this.selectedTableData.length).fill(false);
    }
  }

  openAddMergeTag(itemType) {
    this.enableApplyBttn = false;
    this.hiddenInputSection = true;
    this.hiddenAddTagSection = false;
    this.editMergeTagBttn = false;
    this.modelTypeSelected = itemType;
    this.isModelDME = itemType === AppConstants.PTAG_STATIC_DATA.CUSTOMER_DME;
    this.extInputValues = [];

    this.selectedExtValue = '';
    this.addDropdownObj = this.mergeTagExtJSON.find((x) => x.type === itemType)?.child || [];
    this.filteredExtOptions = this.addDropdownObj;
  }

  editExtMergeTag(itemType, selectedExtValue) {
    this.enableApplyBttn = false;
    this.hiddenAddTagSection = false;
    this.editMergeTagBttn = true;
    this.isModelDME = itemType === AppConstants.PTAG_STATIC_DATA.CUSTOMER_DME;
    this.selectedExtValue = selectedExtValue;
    this.prevSelectedExtValue = selectedExtValue;
    this.addDropdownObj = this.mergeTagExtJSON.find((x) => x.type === itemType)?.child || [];
    this.filteredExtOptions = this.addDropdownObj;
    this.onChangeExtValue(selectedExtValue, this.selectedInputs);
  }

  deleteExtMergeTag(selectedExtValue) {
    this.selectExtObj = this.selectExtObj.filter((item) => item.name !== selectedExtValue);
    this.selectedInputs = this.selectedInputs.filter((item) => item.name !== selectedExtValue);
    this.selectedAllExtValues = this.selectedAllExtValues.filter((item) => item !== selectedExtValue);
  }

  addExtMergeTags() {
    //console.log('Selected value:', this.selectedExtValue);
    if (this.editMergeTagBttn) {
      this.deleteExtMergeTag(this.prevSelectedExtValue);
    }
    const tempObj = this.addDropdownObj.find((x) => x.name === this.selectedExtValue);
    this.selectedAllExtValues.push(this.selectedExtValue);
    if (tempObj) {
      this.enableApplyBttn = true;
      this.selectExtObj.push(tempObj);
      this.selectExtObj = [...new Set(this.selectExtObj)];
      this.hiddenAddTagSection = true;

      let tempExt = {
        type: tempObj.type,
        ctype: tempObj.ctype,
        name: tempObj.type == 'dme' ? tempObj.modelNameHash : tempObj.name,
        cName: tempObj.name,
        inputs: tempObj.inputs != null ? tempObj.inputs : null,
        //inputs: tempObj.type === 'NonCustomerDme' ? null : tempObj.inputs,
        //lookupFields: tempObj.type === 'NonCustomerDme' ? tempObj.lookupFields || null : null,
      };

      const index = this.selectedInputs.findIndex((item) => item.name === tempExt.name);
      if (index !== -1) {
        this.selectedInputs[index] = tempExt;
      } else {
        this.selectedInputs.push(tempExt);
      }
    } else {
      Swal.fire({
        title: this.translate.instant('designEditor.mergeTagExtensions.validationMessages.mergeTagNotSelected'),
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: this.translate.instant('designEditor.okBtn'),
      });
    }

    /* const tempExt = {
      type: tempObj?.type,
      name: tempObj?.name,
      inputs: tempObj?.inputs?.reduce((tempInput, item) => {
        tempInput[item.name] = item.value;
        return tempInput;
      }, {}),
    }; */
  }

  handleMergeTagChange(eventTarget, inputObj) {
    inputObj.value = eventTarget.value;
  }

  closeMergeTagExt() {
    this.enableApplyBttn = true;
    this.hiddenAddTagSection = true;
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

  openTreeDropdown(inputObj: any): void {
    // Set showTreeDropdown property of the inputObj to true
    this.showTreeDropdown = true;
  }

  toggleArrowIcon(arrowIcon) {
    if (arrowIcon.classList.contains('fa-angle-down')) {
      arrowIcon.classList.remove('fa-angle-down');
      arrowIcon.classList.add('fa-angle-up');
    } else {
      arrowIcon.classList.remove('fa-angle-up');
      arrowIcon.classList.add('fa-angle-down');
    }
  }

  onChangeExtValue(evt, list) {
    this.hiddenInputSection = false;
    let selectedDropdown = this.addDropdownObj.find((x) => x.name === evt);
    if (list) {
      selectedDropdown.inputs = list.find((x) => x.cName === evt).inputs;
      /* if (selectedDropdown.type === 'NonCustomerDme') {
        selectedDropdown.lookupFields = list.find((x) => x.name === evt).lookupFields;
      } */
    }
    if (selectedDropdown) {
      this.childInputs = selectedDropdown.inputs || [];
      try {
        if (!this.childInputTreeObj) {
          let parentChildObj = JSON.parse(this.resChildInputTreeObj);
          this.childInputTreeObj = this.getFreeStyeTreeItems(parentChildObj);
        }

        // Handle parsed value
      } catch (error) {
        // Handle error when JSON parsing fails
        console.error('Error parsing JSON:', error);
      }
    }

    /* if (selectedDropdown.type === 'NonCustomerDme') {
      this.childInputs = selectedDropdown.lookupFields || [];
    } */

    this.selectItem('', selectedDropdown);
  }

  getFreeStyeTreeItems(parentChildObj) {
    let itemsArray: TreeviewItem[] = [];
    parentChildObj?.root?.forEach((set: TreeItem) => {
      if (set?.children != undefined) {
        itemsArray.push(new TreeviewItem(set, true));
      }
    });
    return itemsArray;
  }

  onSelectedMergeTagChange(item, inputElement: HTMLInputElement, inputObj) {
    let value;
    if (item.length == 1 && item.length != 0 && item[0] !== '') {
      value = item[0];
      inputElement.value = '{' + value + '}';
      inputObj.value = inputElement.value;

      this.resetCheckedFalseInInputMergeTag(item);
    } else {
      this.resetCheckedFalseInInputMergeTag(item);
    }
  }

  resetCheckedFalseInInputMergeTag(item) {
    let dropdownEMl: any = this.childInputTreeObj;
    dropdownEMl.buttonLabel = this.translate.instant('designEditor.displayConditions.selectMergeTags');
    dropdownEMl.forEach((item) => {
      item.checked = false;
      item.internalCollapsed = true;
      if (item['internalChildren'] !== undefined) {
        item['internalChildren'].forEach((item) => {
          item.checked = false;
          item.internalCollapsed = true;
          if (item['internalChildren'] !== undefined) {
            item['internalChildren'].forEach((item) => {
              item.checked = false;
              item.internalCollapsed = true;
            });
          }
        });
      }
    });
  }

  copyText(textToCopy: string) {
    this.clipboard.copy(textToCopy);
  }

  onSelectedChange(item, rule): void {
    item.forEach((searchText, i) => {
      const searchResultsTemp = searchText.text || searchText;
      const searchResults = this.searchOperatorFromJson(this.mergeTagDataItems, searchResultsTemp);

      const defaultOperators = [];//['=', '!=', 'is null', 'is not null'];
      const finalOperators =
        searchResults.length && searchResults[0].operators ? searchResults[0].operators.split(',') : defaultOperators;

      const fieldName = typeof item[i] === 'object' ? item[i].text : item[i];

      this.configCtrl.fields[fieldName] = {
        name: fieldName,
        type: 'string',
        operators: finalOperators,
        value: fieldName,
        nullable: true,
      };
      rule.field = fieldName;
    });
    //this.resetCheckedFalseInMergeTag();
  }
  getOperatorFromMergeTagDataMethod(searchResultsTemp) {
    const searchResults = this.searchOperatorFromJson(this.mergeTagDataItems, searchResultsTemp);
    let defaultOperators:any = [];
    if(searchResultsTemp === 'number_of_records'){
      defaultOperators = this.defaultOperatorsForMultiResponse;
    }else{
      defaultOperators = this.defaultOperatorsForUndefinedOperators;
    }
    const finalOperators =
      searchResults.length && searchResults[0].operators ? searchResults[0].operators.split(',') : defaultOperators;
    return finalOperators;
  }
  updateConfigCtrlFieldsMethod(finalOperators, arrayOj) {
    if (arrayOj.length > 0) {
      let obj = {};
      arrayOj.forEach((ele, inx) => {
        ele.operator = finalOperators;
        obj[ele.field] = ele;
      });
      this.configCtrl.fields = obj;
    }
  }
  updateQueryDataMethod(searchText, inx) {
    let rules = JSON.parse(this.tempCondition);
    const searchResultsTemp = searchText;
    let finalOperators = this.getOperatorFromMergeTagDataMethod(searchResultsTemp);

    // this.updateConfigCtrlFieldsMethod(finalOperators,rules);

    //const fieldName = typeof item[i] === 'object' ? item[i].text : item[i];
    // if(inx == 'inx_0_0'){
    //   let defaultObj = {
    //     name: "newFilters",
    //     entity:"",
    //     type: 'string',
    //     index:inx,
    //     operators: finalOperators,
    //     value: "",
    //     nullable: true,
    //   }
    //   this.configCtrl.fields['newFilters'] = defaultObj;
    // }
    let defaultObj = {
      name: searchText,
      entity: '',
      type: 'string',
      operators: finalOperators,
      index: inx,
      value: searchText,
      nullable: true,
    };
    //this.configCtrl.fields[searchText] = defaultObj;

    //this.configCtrl.fields[searchText].name = searchText;
    //this.configCtrl.fields[searchText].operators = finalOperators;
    if (this.configCtrl.fields[searchText] !== undefined) {
      let conFigControl = Object.values(this.configCtrl.fields);
      if (conFigControl.length > 0) {
        conFigControl.map((x) => {
          let xPlus: any = x;
          if (inx === xPlus.index) {
            this.configCtrl.fields[xPlus.name].operators = finalOperators;
            this.configCtrl.fields[xPlus.name].value = searchText;
          }
        });
      }
    } else {
      this.configCtrl.fields[searchText] = defaultObj;
    }

    //ruleobj.operators = finalOperators;
    if (rules.rules.length > 0) {
      if (this.isEditModeEnabled) {
        this.updatedFieldMethod(rules.rules, inx, searchText);
      } else {
        this.updatedFieldMethod(rules.rules, inx, searchText);
      }

      // rules.rules.forEach((each,i) => {
      //   if(each.condition !== undefined){
      //     //let currtRule = each.rules.find(x => x.index == inx);
      //     each.rules.forEach((inner,j) => {
      //       if("inx_"+i+"_"+j == inx){
      //         inner.field = searchText;
      //       }
      //     });
      //     this.updatedQueryDisplayMethod(this.queryDisplay.rules,inx,searchText);
      //     // let findInd =  this.queryDisplay.rules.find(x => x.index == 'inx_'+i);
      //     // let innerDisplay = findInd.rules.find(x => x.index == 'inx_'+i);
      //     // if(innerDisplay !== undefined && "inx_"+i == inx){
      //     //   innerDisplay.field = searchText;
      //     // }
      //   }
      // });
    }

    //this.queryDisplay = rules;
    //setTimeout(() => {
    if (this.customTreeMergeTagComponentReference !== undefined) {
      this.customTreeMergeTagComponentReference.showMergeTagDropDownMethod();
    }
    //}, 500);
  }
  updatedQueryDisplayMethod(arrayObj, inx, searchText) {
    arrayObj.forEach((each, i) => {
      if (each.condition !== undefined) {
        //let currtRule = each.rules.find(x => x.index == inx);
        each.rules.forEach((inner, j) => {
          if (each.index + '_' + j == inx) {
            inner.field = searchText;
            inner.entity = searchText;
            inner.operator = '=';
            // if(inner.value !== undefined){
            //   inner.value = undefined
            // }
          }
        });
      } else {
        if ('inx_' + i + '_' + i == inx) {
          each.field = searchText;
          each.entity = searchText;
          each.operator = '=';
        }
        // let findInd =  this.queryDisplay.rules.find(x => x.index == 'inx_'+i+"_"+i);
        // if(findInd !== undefined && "inx_"+i+"_"+i == inx){
        //   findInd.field = searchText;
        // }
      }
    });
  }
  updateSelectedObjOnQueryChangeMethod(arrayObj) {
    this.selectedDataObj = {};
    arrayObj.forEach((each, i) => {
      if (each.condition !== undefined) {
        each.rules.forEach((inner, j) => {
          this.selectedDataObj[inner.index] = inner.entity;
        });
      } else {
        this.selectedDataObj['inx_' + i + '_' + i] = each.entity;
      }
    });
  }

  updatedFieldMethod(arrayObj, inx, searchText) {
    arrayObj.forEach((each, i) => {
      if (each.condition !== undefined) {
        //let currtRule = each.rules.find(x => x.index == inx);
        each.rules.forEach((inner, j) => {
          if (each.index + '_' + j == inx) {
            inner.field = searchText;
            inner.entity = searchText;
            inner.operator = '=';
          }
        });
      } else {
        if ('inx_' + i + '_' + i == inx) {
          each.field = searchText;
          each.entity = searchText;
          each.operator = '=';
        }
        // let findInd =  this.queryDisplay.rules.find(x => x.index == 'inx_'+i+"_"+i);
        // if(findInd !== undefined && "inx_"+i+"_"+i == inx){
        //   findInd.field = searchText;
        // }
      }
    });

    this.updatedQueryDisplayMethod(this.queryDisplay.rules, inx, searchText);
  }


  searchOperatorFromJson(json: any[], searchText: string): any[] {
    const results: any[] = [];
    for (const item of json) {
      if (item.value === searchText) {
        results.push(item);
      } else if (item.operators && item.operators.includes(searchText)) {
        results.push(item);
      } else if (item.children) {
        const childResults = this.searchOperatorFromJson(item.children, searchText);
        results.push(...childResults);
      }
    }
    return results;
  }

  resetCheckedFalseInMergeTag() {
    let dropdownEMl: any = this.mergeTagsListData;
    if (dropdownEMl.buttonLabel.includes('options selected')) {
      dropdownEMl.buttonLabel = this.translate.instant('designEditor.displayConditions.selectMergeTags');
    }
    dropdownEMl.items.forEach((item) => {
      item.checked = false;
      item.internalCollapsed = true;
      if (item['internalChildren'] !== undefined) {
        item['internalChildren'].forEach((item) => {
          //item.text = item.value;
          item.checked = false;
          item.internalCollapsed = true;
          if (item['internalChildren'] !== undefined) {
            item['internalChildren'].forEach((item) => {
              //item.text = item.value;
              item.checked = false;
              item.internalCollapsed = true;
            });
          }
        });
      }
    });
  }
  loadData() {
    this.mergeTagDataItemsForCond = this.mergeTagDataItemsForCond.filter(x => x.children.length > 0);
    this.items = this.getItems(this.mergeTagDataItemsForCond);
    // setTimeout(() => {
    //   if (this.mergeTagsListData != undefined) {
    //     let dropdownEMl: any = this.mergeTagsListData;
    //     dropdownEMl.buttonLabel = this.translate.instant('designEditor.displayConditions.selectMergeTags');
    //     this.resetCheckedFalseInMergeTag();
    //   }
    // }, 500);
  }

  getItems(parentChildObj: any[]) {
    let itemsArray: TreeviewItem[] = [];
    parentChildObj.forEach((set: TreeItem) => {
      let newSet;
      if (
        set.children !== undefined &&
        set.text !== 'Customer' &&
        set.text !== 'Tag parameters' &&
        set.text !== 'Product' &&
        set.text !== 'Promotion' &&
        set.text !== 'Event'
      ) {
        //const filterTextValues = [this.selectedRowModelName, this.selectedExtValue];
        const filterTextValues = filter(this.selectedAllExtValues);
        const newSetChildren = set.children.filter(function (item) {
          return filterTextValues.includes(item.text);
        });
        if (newSetChildren.length != 0) {
          newSet = { ...set, children: newSetChildren };
        }
      } else {
        if (set.text === 'Product' && this.selectedRowModelName !== 'productReco') {
          newSet = undefined;
        } else {
          newSet = { ...set };
        }
      }
      if (newSet != undefined) {
        if (newSet.children != undefined) {
          newSet.children.forEach((level2) => {
            if (level2.value != '') {
              level2.text = level2.value;
            }
            if (level2.children != undefined) {
              level2.children.forEach((level3) => {
                if (level3.value != '') {
                  level3.text = level3.value;
                }
              });
            }
          });

          itemsArray.push(newSet);
        }
      }
    });
    return itemsArray;
  }

  bootstrapClassNames: QueryBuilderClassNames = {
    removeIcon: 'fal fa-times fa-lg',
    addIcon: 'fa fa-times',
    arrowIcon: 'fa fa-chevron-right px-2',
    button: 'btn',
    buttonGroup: 'btn-group algoBttnGroup',
    rightAlign: 'order-12 ml-auto',
    switchRow: 'd-flex px-2',
    switchGroup: 'd-flex align-items-center',
    switchRadio: 'custom-control-input',
    switchLabel: 'custom-control-label',
    switchControl: 'custom-control custom-radio custom-control-inline algoRadio',
    row: 'row p-2 m-1 algoRow',
    rule: 'algoRuleClass',
    ruleSet: 'border algoRuleSetClass',
    invalidRuleSet: 'alert alert-danger',
    emptyWarning: 'text-danger mx-auto',
    operatorControl: 'form-control algoOperator smallLabel',
    operatorControlSize: 'col-auto pr-0',
    fieldControl: 'form-control algoDropdown',
    fieldControlSize: 'col-auto pr-0',
    entityControl: 'form-control',
    entityControlSize: 'col-auto pr-0',
    inputControl: 'form-control algoInput smallLabel mt-1',
    inputControlSize: 'col-auto p-0',
  };

  public allowRuleset: boolean = true;
  public allowCollapse: boolean = false;
  public disabled: boolean = false;
  public emptyMessage: string = '';

  checkValidationsMethod() {
    let entityArray = this.queryDisplay.rules.map((x) => x.entity == '');
    let conditionsArray = this.queryDisplay.rules.filter((x) => x.condition !== undefined);
    let validationValue: any = [];
    let validationValueCondition: any = [];
    this.queryDisplay.rules.map((x) => {
      if (x.condition === undefined) {
        if (x.operator?.trim() !== 'is null' && x.operator?.trim() !== 'is not null' && x.operator?.trim() !== 'is NaN') {
          let addEntity: any = x.entity == '';
          let addVal: any = x.value == undefined || x.value == '';
          validationValue = validationValue.concat(addVal, addEntity);
        }
        if(x.operator?.trim() === 'between'){
          x.value = x.value.join(',');
        }
      } else {
        x.rules.map((y) => {
          if (y.operator?.trim() !== 'is null' && y.operator?.trim() !== 'is not null' && y.operator?.trim() !== 'is NaN') {
            let addEntity: any = y.entity == '';
            let addVal: any = y.value == undefined || x.value == '';
            validationValueCondition = validationValueCondition.concat(addVal, addEntity);
          }
          if(y.operator?.trim() === 'between'){
            y.value = y.value.join(',');
          }
        });
      }
    });
    return validationValue.concat(validationValueCondition);
  }

  saveQuery(source: string) {
    //console.log(this.dcRowPreview.styleString)
    let validCheck: boolean = false;
    let restult = this.checkValidationsMethod();
    if (restult !== undefined) {
      validCheck = restult.includes(true);
    }
    if (!validCheck) {
      this.tempSavedQuery = JSON.parse(JSON.stringify(this.queryDisplay));
      this.tempCondition = JSON.stringify(this.queryDisplay);
      const uuid = uuidv4();
      this.tempCondition = this.tempCondition || '{"condition":"and","rules":[],"@class":"LogicalCondition"}';
      if (this.tempDynamicContent) {
        const attributeName1 = 'conditions';
        let finalCondition1 = this.getFinalCondition(this.tempCondition);
        if (finalCondition1 !== undefined) {
          finalCondition1 = finalCondition1.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
        }
        const attributeName2 = 'ext';
        const attributeValue2 = JSON.stringify(this.selectedInputs);

        this.dynamicContent = this.modifyDynamicContent(this.tempDynamicContent, attributeName1, finalCondition1);
        this.dynamicContent = this.modifyDynamicContent(this.dynamicContent, attributeName2, attributeValue2);

        const rowName = 'rowName';
        const rowNameValue = this.rowNameSavedValue;
        this.dynamicContent = this.modifyDynamicContent(this.dynamicContent, rowName, rowNameValue);
        this.localExistingRowLabels[GlobalConstants.selectedRowId] = rowNameValue;
        console.log(GlobalConstants.existingRowLabels);
        //--------- Image quality --------------
        let imageSettingobj = JSON.stringify({imageType:this.imageSettingsObj.imageType,imageQuality:this.imageSettingsObj.imageQuality});
        this.dynamicContent = this.modifyDynamicContent(this.dynamicContent, 'imageSettings', imageSettingobj);
        if (this.dcRowPreview != undefined) {
          const rowStyleName = 'rowStyle';
          let rowStyleValue = this.dcRowPreview.styleString;
          if (this.selectedLayout == 'layout0') {
            rowStyleValue = '';
          }
          this.dynamicContent = this.modifyDynamicContent(this.dynamicContent, rowStyleName, rowStyleValue);

          const layoutStyleName = 'layoutStyle';
          const layoutStyleValue = this.dcRowPreview.styleLayoutString;
          this.dynamicContent = this.modifyDynamicContent(this.dynamicContent, layoutStyleName, layoutStyleValue);
        }
      } else {
        let finalCondition2 = this.getFinalCondition(this.tempCondition);
        if (finalCondition2 !== undefined) {
          finalCondition2 = finalCondition2.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
        }
        const selectedInputs = JSON.stringify(this.selectedInputs);
        
        if (this.dcRowPreview != undefined) {
          let styleRowString = JSON.stringify(this.dcRowPreview.styleString);
          if (this.selectedLayout == 'layout0') {
            styleRowString = '';
          }
          const styleLayoutString = JSON.stringify(this.dcRowPreview.styleLayoutString);
          this.dynamicContent = `<dynamic-content id='${uuid}' rowName="${this.rowNameValue}" type='condition' conditions='${finalCondition2}' ext='${selectedInputs}' rowStyle='${styleRowString}' layoutStyle='${styleLayoutString}' imageSettings=`+this.imageSettingsObj+`>`;
        } else {
          this.dynamicContent = `<dynamic-content id='${uuid}' rowName="${this.rowNameValue}" type='condition' conditions='${finalCondition2}' ext='${selectedInputs}'>`;
        }
      }

      this.results = {
        type: GlobalConstants.selectedrowModelName,
        label: 'Demo Condition',
        description: GlobalConstants.selectedrowModelName,
        before: this.dynamicContent,
        after: '</dynamic-content>',
      };

      //GlobalConstants.resolveFlag = true;
      if (source == 'clickFromBttn') {
        this.onClose();
      }

      this.onSaveCond.emit(this.results);
    } else {
      Swal.fire({
        title: this.translate.instant('designEditor.displayConditions.emptyFieldsMEssageLbl'),
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: this.translate.instant('ok'),
      });
      return;
    }
  }

  getFinalCondition(conditionString) {
    const tempCondition = JSON.parse(conditionString);
    return tempCondition.rules && tempCondition.rules.length ? conditionString : '';
  }

  modifyDynamicContent(content, attributeName, attributeValue) {
    let isAttributeExist = this.getAttributeValueFromHtmlString(content, attributeName);
    const attributeRegex = new RegExp(`(${attributeName}=')[^']*(')`, 'i');
    let dynamicInsertAttribute = content.substring(0, content.length - 1);
    if (isAttributeExist != null) {
      return content.replace(attributeRegex, `$1${attributeValue}$2`);
      //return dynamicInsertAttribute+`${attributeName}='${attributeValue}'>`
    } else {
      // @Mazhar The below line is not working, due to the regex expression, if the operator ">=" is selected ,then its inserting the attribute EXT[] at operator position ">"
      //return content.replace(/<(\w+)([^>]*)>/, `<$1$2 ${attributeName}='${attributeValue}'>`);
      return dynamicInsertAttribute + ` ${attributeName}='${attributeValue}'>`;
    }
  }
  addManualRuleSetMethod(rule, method) {
    this.addRuleEnable = true;
    this.removeRuleEnable = false;
    method(rule);
    let obj: any = [];
    rule.rules.map((x) => {
      if (x.condition === undefined) {
        obj.push(x.index);
      } else {
        x.rules.map((y) => {
          obj.push(y.index);
        });
      }
    });
    let addIndex = difference(obj, Object.keys(this.selectedDataObj));
    this.queryDisplay.rules.map((x) => {
      if (x.condition === undefined) {
        if (x.index === addIndex[0]) {
          x.entity = '';
        }
      } else {
        x.rules.map((y) => {
          if (x.index === addIndex[0]) {
            x.entity = '';
          }
        });
      }
    });
  }
  removeRuleManualMethod(rule, removeRule) {
    this.addRuleEnable = false;
    this.removeRuleEnable = true;
    if (rule.condition !== undefined) {
      let selectItems = Object.keys(this.selectedDataObj).length;
      rule.rules.map((x) => {
        delete this.selectedDataObj[x.index];
      });
    } else {
      let selectItems = Object.keys(this.selectedDataObj).length;
      if (selectItems > 0) {
        delete this.selectedDataObj[rule.index];
      }
    }
    removeRule(rule);
  }
  onQueryBuilderChange($event) {
    if ($event.rules != undefined) {
      const setArithmeticClass = (item, i, j) => {
        item.index = 'inx_' + i + '_' + j;
        if (item['@class'] === undefined) {
          item['@class'] = 'ArithmeticCondition';
          if(item.operator?.trim() === 'between'){
            item.value = [];
            item.type = 'object';            
          }
        }
      };

      const setDefaultLogicalClass = (item) => {
        if (item['@class'] === undefined) {
          item['@class'] = 'LogicalCondition';
        }
      };

      if ($event['@class'] == undefined) {
        $event['@class'] = 'LogicalCondition';
      }
      $event.rules.forEach((item, i) => {
        //if(item.index === undefined){
        item.index = 'inx_' + i + '_' + i;
        if (!item.condition && item.field) {
          if (item.field.text) {
            item.field = item.field.text;
          }
        }

        if (item.condition === undefined) {
          if (item['field'] !== undefined) {
            setArithmeticClass(item, i, i);
          } else {
            if (item.rule != undefined) {
              item.rules.forEach((subItem, j) => {
                if (subItem.index === undefined) {
                  setArithmeticClass(subItem, i, j);
                } else {
                  setArithmeticClass(subItem, i, j);
                }
              });
            }
          }
        } else {
          setDefaultLogicalClass(item);

          item.rules.forEach((subItem, k) => {
            if (subItem.index === undefined) {
              let index = item.index.split('_')[1] + '_' + item.index.split('_')[2];
              setArithmeticClass(subItem, index, k);
            } else {
              let index = item.index.split('_')[1] + '_' + item.index.split('_')[2];
              setArithmeticClass(subItem, index, k);
            }
          });
        }
        //}
      });
      let config: QueryBuilderConfig = {
        fields: {
          newFilter: { name: 'newFilter', type: 'string', entity: ''},
        },
      };
      if ($event.rules.length == 0) {
        this.configCtrl = config;                
      }
      if (this.removeRuleEnable && !this.addRuleEnable) {
        this.updateSelectedObjOnQueryChangeMethod($event.rules);
      }

      this.tempCondition = JSON.stringify($event);
      this.queryDisplay = $event;
    }
  }
  imageQualityValUpdateMethod(evt){
    if(evt.target.value < 80 || evt.target.value > 100){
      this.imageSettingsObj.imageQuality = '80';
      this.dataService.SwalAlertSuccesOrFailMgs(this.translate.instant('designEditor.displayConditions.imageMinimumMaximumValueLbl'),'warning');
      return;
    }else{
      this.imageSettingsObj.imageQuality = evt.target.value;
    }
    
  }
  ngOnInit(): void {
    this.shareService.enablePreviewAfterCall.subscribe((res) => {
      this.enablePreviewOption = res;
      let checkensembleflag = this.selectedRowModelData || '';
      this.ensembleAiEnabled = checkensembleflag.type == 'eapi';
      if(this.ensembleAiEnabled){
        this.enablePreviewOption = false;
        this.selectedSectionIndex = 3;
        this.extensions[3].hidden = true;
      }
      this.cdref.detectChanges();
    });    
  }
  onOperatorChange(event, rule, onchange) {
    //if (event === 'is null' || event === 'is not null' || event === 'is NaN') {
      rule.value = '';
    //}
    if(rule.operator?.trim() === 'between'){
      rule.value = [];
      rule.type = 'object';
      if(this.configCtrl.fields[rule.field] !== undefined){
        if(rule.operator?.trim() === 'between'){
          this.configCtrl.fields[rule.field].type = 'object';
        } 
    }    
            
    }
    let findFieldIndex = this.queryDisplay.rules.findIndex(x => x.index == rule.index);
    if(findFieldIndex !== -1){
      this.queryDisplay.rules[findFieldIndex].value = rule.value;
      this.queryDisplay.rules[findFieldIndex].operator = rule.operator;
    }    
  }

  // Method to toggle the expansion state for a specific row
  toggleRowExpansion(index: number) {
    this.rowExpansionState[index] = !this.rowExpansionState[index];
  }

  getAttributeValueFromHtmlString(htmlString, attributeName) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const dynamicContentElement = doc.querySelector('dynamic-content');
    return dynamicContentElement ? dynamicContentElement.getAttribute(attributeName) : null;
  }

  selectLeftTabs(index: number) {
    this.selectedSectionIndex = index;
    this.extensions.forEach((ext, i) => {
      ext.hidden = false;
    });
    this.extensions[index].hidden = true;
    
    if (index == 1) {
      // Condtions tab
      this.loadData();
      if (this.customTreeMergeTagComponentReference !== undefined) {
        this.customTreeMergeTagComponentReference.openMergeTagDataPopup = false;
      }
      // Retaining the selected tagName in conditon builder

      function collectValues(query) {
        var gval: any = [];

        function traverse(rules) {
          rules.forEach((rule) => {
            if (rule.value) {
              gval.push(rule.field);
            }
            if (rule.rules) {
              traverse(rule.rules);
            }
          });
        }

        traverse(query);
        return gval;
      }

      if (this.tempSavedQuery != undefined) {
        this.queryDisplay = this.tempSavedQuery;
        this.tempCondition = JSON.stringify(this.queryDisplay);
        let editModeObj = this.tempSavedQuery.rules;
        this.isEditModeEnabled = true;
        if (Object.keys(this.configCtrl.fields).length > 0) {
          Object.keys(this.configCtrl.fields).forEach((key, val) => {
            if(this.configCtrl.fields[key]['operator']?.trim() === 'between'){
              this.configCtrl.fields[key]['type'] = 'object';
            }
            this.configCtrl.fields[key]['operators'] = this.getOperatorFromMergeTagDataMethod(key);
          });
        }
        editModeObj.forEach((each, inx) => {
          if (each.condition !== undefined) {
            each.rules.forEach((item, jx) => {
              //let obj = {value:item.field};
              this.selectedDataObj[item.index] = item.field;
              //this.updateParamsInputs(obj,item.index);
            });
          } else {
            //let obj = {value:each.field};
            this.selectedDataObj[each.index] = each.field;
            //this.updateParamsInputs(obj,each.index);
          }
        });
      }
      var valuesArray = collectValues(this.queryDisplay.rules);
      setTimeout(() => {
        const elements = document.querySelectorAll('.treeViewDropdownStyle');
        elements.forEach((button, i) => {
          //const field = this.queryDisplay.rules[i]?.field || '';
          const field = valuesArray[i];
          const previousSibling = button.previousElementSibling;

          if (previousSibling) {
            previousSibling.textContent = 'Selected tag: ' + field;
          }

          let mText: any;
          if (field.text) {
            mText = field.text;
          } else {
            mText = field;
          }

          //this.resetCheckedFalseInMergeTag();
          // console.log(this.dropdownTreeviewComponent);
          // let dropdownEMl: any = this.mergeTagsListData;
          // const selectedItem = TreeviewHelper.findItemInList(dropdownEMl.items, mText);

          // if (this.dropdownTreeviewComponent) {
          //   /* this.dropdownTreeviewComponent.treeviewComponent.selection.uncheckedItems = this.dropdownTreeviewComponent.treeviewComponent.selection.checkedItems;
          //   this.dropdownTreeviewComponent.treeviewComponent.selection.checkedItems = [];
          //   this.dropdownTreeviewComponent.treeviewComponent.selection.checkedItems.push(selectedItem); */
          //   this.dropdownTreeviewComponent.onSelectedChange([selectedItem]);
          // }
        });
      }, 1000);
    }else if(index == 3){      
      this.selectImageTypeMethod(this.imageSettingsObj,false);
      // setTimeout(() => {
      //   this.imageQualitySelectedValue = this.imageSettingsObj.imageQuality;
      // }, 500);
    }    
  }

  onClose() {
    this.bsModalRef.hide();
    this.onHidden.emit(this.results);
  }

  openExtDropdown() {
    this.showExtDropdown = true;
  }

  filterExtOptions(event: any) {
    const searchText = event.target.value;
    this.filteredExtOptions = this.addDropdownObj.filter((option) =>
      option.name.toLowerCase().includes(searchText.toLowerCase())
    );
    this.showExtDropdown = this.filteredExtOptions.length > 0;
  }

  selectExtOption(option: string) {
    this.onChangeExtValue(option, '');
    this.selectedExtValue = option;    
    this.showExtDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as Element;
    if (!target.closest('.mergeTagExt-dropdown')) {
      this.showExtDropdown = false;
    }
  }
  
  copyAllToClipboard(selectedItem) {
    const jsonData = sessionStorage.getItem(`clipboard-data[${this.tagKey}]`);
    this.clipboardData = jsonData ? JSON.parse(jsonData) : [];
    let copiedFields = this.mergeTagExtJSON.find((x) => x.name === selectedItem)?.fields || [];
    if (copiedFields.length == 0) {
      copiedFields = this.mergeTagExtJSON
        .find((item) => item.child && item.child.some((childItem) => childItem.name === selectedItem))
        ?.child.find((childItem) => childItem.name === selectedItem)?.fields;

        if(copiedFields === undefined || copiedFields.length == 0 || copiedFields === null){
          Swal.fire({
            title: this.translate.instant('clipboard.validationMessages.noFieldsToCopy'),
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonText: this.translate.instant('ok'),
          });
          return;
        }
    }

    const existingIndex = this.clipboardData.findIndex((item) => item.name === selectedItem);
    if (existingIndex !== -1) {
      this.clipboardData[existingIndex].fields = copiedFields;
    } else {
      this.clipboardData.push({
        name: selectedItem,
        fields: copiedFields,
      });
    }

    sessionStorage.setItem(`clipboard-data[${this.tagKey}]`, JSON.stringify(this.clipboardData));
    Swal.fire({
      title: this.translate.instant('clipboard.validationMessages.copiedAllField', { value1: selectedItem }),
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: true,
      confirmButtonText: this.translate.instant('ok'),
    });
    //console.log(copiedFields);
  }

  /*copyAllToClipboard(selectedItem) {
    const jsonData = sessionStorage.getItem('clipboard-data');
    if (jsonData) {
      this.clipboardData = JSON.parse(jsonData);
    }

    let copiedFields = this.mergeTagExtJSON.find((x) => x.name === selectedItem)?.fields || [];
    let clipboardTempData: any[] = [
      {
        name: selectedItem,
        fields: copiedFields,
      }
    ];
    this.clipboardData.push(clipboardTempData);
    sessionStorage.setItem('clipboard-data', JSON.stringify(this.clipboardData));
    console.log(copiedFields);
  } */

  validateRowName(): void {
    this.showLoader = true;
    this.saveRowNames = GlobalConstants.existingRowLabels;
    if (this.rowNameSavedValue !== this.rowNameValue) {
      this.rowNameSavedValue = this.rowNameValue;
      const payload = {
        rowId: GlobalConstants.selectedRowId,
        rowName: this.rowNameValue,
        tagKey: this.tagKey,
      };

      this.httpService.post(AppConstants.API_END_POINTS.VALIDATE_PTAG_ROW_NAME, payload).subscribe((data: any) => {
        this.showLoader = false;
        if (data.response != null && data.status !== 'SUCCESS') {
          this.scriptNameError = data.response[0];
          this.isRowNameEditable = true;
        } else if(this.saveRowNames) {
          const exists = Object.values(this.saveRowNames).includes(this.rowNameValue);
          if (exists) {
            this.scriptNameError = this.translate.instant('designEditor.rowLabelName.rowLabelNameValidation');
            this.isRowNameEditable = true;
          } else {
            this.scriptNameError = '';
            this.isRowNameEditable = false;
            this.dataService.SwalSuccessMsg(data.message);
          }
        }
        this.saveQuery('clickFromRowName');
      });
    } else {
      this.showLoader = false;
      this.isRowNameEditable = false;
    }
  }
  editRowName() {
    this.isRowNameEditable = true;
  }
  blockEntering(evt){
    evt.preventDefault();
  }

  switchDeviceView(device) {
    this.ngZone.run(() => {
      if (device == 1) {
        this.dcRowPreview.isMobileView = false;
      } else if (device == 2) {
        this.dcRowPreview.isMobileView = true;
      }
    });
  }
}
