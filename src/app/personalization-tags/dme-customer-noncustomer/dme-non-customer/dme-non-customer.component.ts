import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, NgZone } from '@angular/core';
import { AppConstants } from '@app/app.constants';
import { DataService } from '@app/core/services/data.service';
import { HttpService } from '@app/core/services/http.service';
import { RandomNameService } from '@app/core/services/random-name.service';
import { SharedataService } from '@app/core/services/sharedata.service';
import { GlobalConstants } from '@app/design-channels/common/globalConstants';
import { RadioRowSelectionComponent } from '@app/design-channels/recommendation-offers/radio-row-selection.component';
import { TranslateService } from '@ngx-translate/core';
import { ColDef, GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';
import lodash from 'lodash';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TreeviewItem, TreeviewConfig, TreeItem } from 'ngx-treeview';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-dme-non-customer',
  templateUrl: './dme-non-customer.component.html',
  styleUrls: ['./dme-non-customer.component.scss']
})
export class DMENonCustomerComponent implements OnInit {
  @Output() onAdd = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @ViewChild('t1', { static: false }) t1!: ElementRef; 
  showLoader: boolean = false;
  isDoneClicked: boolean = false;
  myDataRowInsert: any;
  mergeTagDataItems: any;
  values!: number[];
  items!: TreeviewItem[];
  configuration = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 500,
  });
  customBootstrapStyle: any = ['btn btn-outline-primary buttonStyle shadow-none'];
  tagKey: any;
  copiedDivEnabled: boolean = false;
  copiedValue: string = '';
  apiName: string = '';
  apiParams = [];
  api_responses: any = [];
  api_select_params: any = [];
  selectedApiKey = 1;
  paramLabel: any;
  paramValue: any;
  navigatorActiveStage1:boolean = true;
  navigatorActiveStage2:boolean = false;
  checkmarkEnable1:boolean = false;
  checkmarkEnable2:boolean = false;
  modelDataListsArry: any = [];
  rowSelection:any = 'single';
  searchText: string = '';
  public defaultColDef: ColDef  = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    cellStyle:{"outline":"none","text-align":"left"},
    //filter:true
  };
  public getRowId: GetRowIdFunc = (params: GetRowIdParams) => params.data.id;
    agGridLocaleLabels:any = {
    "to": "",
    "of": "",
    "page": "",
    "noRowsToShow": ""   
};
  public localeText: {
    [key: string]: any;
  } = this.agGridLocaleLabels;
  columnHeadersRuleReco: ColDef[] = [];

  rowDataForPlacementTable :any = [];
  customLayoutEnabled:boolean = false;
  selectedDmeDataObj: any;
  inputParamSelected: any;
  viewParameterSectionEnabled: boolean = false;
  temporaryObjForSearch: any;
  searchDataModels: any;
  singleMultiCheckEnable:any = [];
  singleOrMultiVal: number = 0;
  multiArrayPath: boolean = false;
  recoArributesObj: any = {};
  chooseLayoutSavedDataObj: any = {};
  blockNameLoadedFor:any = 'dme';
  savedHtmlContent: any;
  createSavedObj: any = {};
  editModeEnabled: boolean =  false;
  selectionRuleType: boolean = false;
  showActivityRulesGrid: boolean = false;
  isNewDmeNonCustomerBlock: boolean = true;
  modelNameSelectedForLayoutPg: any;
  selectedNonDMEuuid: any;
  dmeNonCustomerObject: any = [];
  savedModelObjEditMode: any;
  parameterValueArray: any = [];
  sortableExpandCollapse: boolean = false;
  sortedAreaEnabled:boolean = false;
  fieldsOfSelectedDMEModel: any = [];
  ascDscArray:any = [];
  sortableObj:any = {};
  sortByObj: any;
  isSortable: boolean = false;
  sortedFieldEditmode: any = "-1";
  sortedOrderEditmode: any = "-1";
  sortInputCheck: boolean = false;
  isPublishedPersonalization: boolean = false;
  isRowEditModeEnable: boolean = false;
  rowNameValue: string = "";
  tempSavedObj:any = {};
  backBtnEnabled: boolean = false;
  sendDataToProductFilters: any = '';
  openedFrom!: string;
  isMergedTagOffersDrawerOpen: boolean = false;
  selectedMergeTagData: any;
  onUpdateMergeTagInj: Subject<any> = new Subject();
  sliderOptions: Options = {
      floor: 1,
      showSelectionBar: true,
      ceil: 4
    };
    sliderValue:any = 4;
    noofRecoConfig: number = 12;

  constructor(private bsModalRef: BsModalRef, private httpService: HttpService, private clipboard: Clipboard, private translate: TranslateService, private shareService: SharedataService, private ngZone:NgZone, private dataService: DataService, private randomNameService: RandomNameService) {
    this.agGridLocaleLabels = {
      "to": this.translate.instant('agGridLocaleLabels.to'),
      "of": this.translate.instant('agGridLocaleLabels.of'),
      "page": this.translate.instant('agGridLocaleLabels.page'),
      "noRowsToShow": this.translate.instant('agGridLocaleLabels.noRowsToShow')   
    };
    this.columnHeadersRuleReco = [
      {
        field: 'checkbox',
        headerName: '',
        maxWidth: 50,
        cellStyle: { 'text-align': 'center' },
        cellRenderer: RadioRowSelectionComponent,
        cellRendererParams: { context: this }
      },
      { field: 'modelName', headerName: this.translate.instant('DMEOffersComponent.modelNameColumnLbl'), maxWidth: 400, sortable: true, filter: false,tooltipField:'modelName'},
      { field: 'createdFrom', headerName: this.translate.instant('DMEOffersComponent.createdFromColumnLbl'), maxWidth: 300, sortable: true, filter: false },
      { field: 'segmentSize', headerName: this.translate.instant('DMEOffersComponent.segmentSizeColumnLbl'), maxWidth: 200, sortable: true, filter: false },
      { field: 'refreshedOn', headerName: this.translate.instant('DMEOffersComponent.refreshedOnColumnLbl'), maxWidth: 300, sortable: true, filter: false,tooltipField:'refreshedOn'},
    ];
    this.singleMultiCheckEnable = [{id:0,name:this.translate.instant('customerNonCustomerDMEComponents.singleRowLbl'),singleVal:0,checked:true},{id:1,name:this.translate.instant('customerNonCustomerDMEComponents.multiRowLbl'),singleVal:1,checked:false},];
    GlobalConstants.parentComponentName = 'ApiPersonalizationComponent';
    this.tagKey = this.dataService.activeContentTagKey;//localStorage.getItem('tagKeyPersonalization');
    this.viewParameterSectionEnabled = false;    
    this.ascDscArray = [{id:"asc",value:this.translate.instant('customerNonCustomerDMEComponents.ascMsgLbl')},{id:"desc",value:this.translate.instant('customerNonCustomerDMEComponents.descMsgLbl')}]
    this.shareService.isPublishEnabledForPersonalization.subscribe((res) => {
      if(res !== undefined){
        this.isPublishedPersonalization = res; 
      }
    });
    // this.shareService.savedPersonalizationDataObj.subscribe((res:any) => {
    //   if(res !== undefined){
    //     this.savedHtmlContent = res;
    //     if(Object.keys(this.savedHtmlContent).length > 0){
    //       let eleContent = document.createElement('div');
    //       eleContent.innerHTML = this.savedHtmlContent.templateText;
    //       //if(this.editModeEnabled){
    //         let dynCont:any = eleContent.getElementsByTagName('dynamic-content');            
    //         let dynamicContentArray = [...dynCont];
    //         //let filterDynCont = lodash.filter(dynamicContentArray,{entityType:0});   
    //        // const conditionsAttributeValue = this.getAttributeValueFromHtmlString(eleContent, 'name');         
    //         if(dynamicContentArray.length > 0){
    //           dynamicContentArray.forEach((ele,i) => {
    //             let currtBlockType = ele.getAttribute('type');
    //             let currtBlckid = ele.getAttribute('id');
    //             let filterByModelName = ele.getAttribute('modelname');
    //             if(currtBlockType === this.blockNameLoadedFor && this.selectedNonDMEuuid === currtBlckid){
    //               if(!this.isNewDmeNonCustomerBlock){ // Saved DME
    //                 this.getEditObjMethod(ele);    
    //                 this.viewParameterSectionEnabled = true;
    //               }                           
    //             }                
    //           });                     
              
    //         }    
            
    //       //}                
    //     }else{
    //       this.viewParameterSectionEnabled = false;
    //     }
    //   }
    // });
    this.getDMEModelData();
  }
  getAttributeValueFromHtmlString(htmlString, attributeName) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const dynamicContentElement = doc.querySelector('dynamic-content');
    return dynamicContentElement ? dynamicContentElement.getAttribute(attributeName) : null;
  }
  loadDmeNonCustomerMethod(){
    this.shareService.isDMENonCustomerEditMode.subscribe((res:any) => {
      if(GlobalConstants.isRowEditModeEnable) {
        this.isRowEditModeEnable = true;
      } else {
        this.isRowEditModeEnable = false;
      }

      if(res != undefined) {
        if(Object.keys(res).length > 0){ 
          if(res.selectedValue !== undefined ){
              this.isNewDmeNonCustomerBlock = false;
              let selectedValParams = JSON.parse(res.selectedValue);
              this.editModeEnabled = true;
              this.editModeDataMethod(selectedValParams);        
          }else{
            this.isNewDmeNonCustomerBlock = true;
            this.editModeEnabled = false;
            this.clearSelectionRowMethod();
          }
          this.selectedNonDMEuuid = res?.id;
        }else{
          this.isNewDmeNonCustomerBlock = true;
            this.editModeEnabled = false;
            this.clearSelectionRowMethod();
        }
      }else{
        this.isNewDmeNonCustomerBlock = true;
        this.shareService.selectedRowCheckedbox.next({name:"",blockName:'dmeNonCustomer',editMode:false});
      }
    });

    // this.shareService.sendParamsFromRecoOffersDynamic.subscribe((res:any) => {
    //   if(Object.keys(res).length > 0){        
    //     if(!this.isNewDmeNonCustomerBlock){
    //       if(Object.keys(this.createSavedObj).length > 0){
    //         if(this.createSavedObj.modelName == res.data.modelName){ // edit is overide with new selection       
    //           this.selectedDmeDataObj = this.createSavedObj;
    //           let arrayParms:any = [];
    //           if(Object.keys(this.createSavedObj.parameterValues).length > 0){
    //             lodash.mapKeys(this.createSavedObj.parameterValues, function(val, key) {
    //               return arrayParms.push({ displayName: key, value: val });
    //             });
    //           }else{
    //             arrayParms = [];
    //           }            
    //           this.inputParamSelected = arrayParms;
    //           this.editModeEnabled = true;
    //           this.viewParameterSectionEnabled = true;
    //         }else{
    //           this.selectedDmeDataObj = res.data;
    //           if(this.selectedDmeDataObj.fields !== undefined){
    //             this.inputParamSelected = this.selectedDmeDataObj.fields;
    //           }  
    //           this.createSavedObj = {}; //edit mode reset
    //           this.editModeEnabled = false;
    //           this.viewParameterSectionEnabled = true;
    //          // this.shareService.selectedRowCheckedbox.next({name:"",blockName:'dmeNonCustomer'});
    //         }
    //       }else{
    //           this.selectedDmeDataObj = res.data;
    //           if(this.selectedDmeDataObj.fields !== undefined){
    //             this.inputParamSelected = this.selectedDmeDataObj.fields;
    //           }  
    //           this.editModeEnabled = false;
    //           this.viewParameterSectionEnabled = true;
    //       }
    //     }else{
    //       this.selectedDmeDataObj = res.data;
    //       if(this.selectedDmeDataObj.fields !== undefined){
    //         this.inputParamSelected = this.selectedDmeDataObj.fields;
    //       }  
    //       this.editModeEnabled = false;
    //       this.viewParameterSectionEnabled = true;
    //       this.shareService.selectedRowCheckedbox.next({name:"",blockName:'dmeNonCustomer',editMode:false});
    //     } 
    //   }
    // });
  }
  clearSelectionRowMethod(){
    this.modelDataListsArry = [];    
    this.viewParameterSectionEnabled = false;
    this.shareService.selectedRowCheckedbox.next({name:"",blockName:'dmeNonCustomer',editMode:false});
    this.parameterValueArray = [];
    setTimeout(() => {
      this.modelDataListsArry = this.rowDataForPlacementTable;      
    }, 100);  
    
  }
  editModeDataMethod(dataObj){
    this.getEditObjMethodnew(dataObj);    
    //this.viewParameterSectionEnabled = true;
  }
  getEditObjMethodnew(resObj){ 
    let isModelExist = this.modelDataListsArry.find(x => x.modelName == resObj.modelName);
      if(isModelExist !== undefined){ 
    this.swapSelectedModelTopMethod(resObj);   
    if(resObj.input_params !== null){
      this.createSavedObj.parameterValues = JSON.parse(resObj.input_params);
    }else{
      this.createSavedObj.parameterValues = {};
    }                    
    this.createSavedObj.modelName = resObj.modelName;
    this.createSavedObj.modelNameHash = resObj.modelNameHash;
    this.createSavedObj.rowName = resObj.rowName;
    this.createSavedObj.type = resObj.type;
    this.createSavedObj.freeStyle = resObj.freeStyle;
    if(resObj.sortAttributes !== undefined){
      this.sortByObj = Object.keys(resObj.sortAttributes).length;
      if(this.sortByObj > 0){
        this.sortInputCheck = true;
        this.sortableObj = resObj.sortAttributes;
        
        this.expandSortableAreaMethod(true);
      }
    }else{
      this.sortableObj =  {"sortedCol":"-1","order":'-1'};
    }
    
    
    if(resObj.maxCount !== undefined){
      this.createSavedObj.layout = resObj.layout; 
      this.createSavedObj.maxCount = resObj.maxCount;
      this.createSavedObj.dbKey = resObj.dbKey;
      this.savedModelObjEditMode = this.createSavedObj;
      this.singleMultiCheckMethod(1);
    }else{
      this.singleMultiCheckMethod(0);
    }

    this.inputParamSelected = this.createSavedObj.parameterValues;
    this.selectedDmeDataObj = this.createSavedObj;
    
    if(!this.isNewDmeNonCustomerBlock){
      this.shareService.selectedRowCheckedbox.next({name:this.createSavedObj.modelName,blockName:'dmeNonCustomer',editMode:true});
    }  
    //this.shareService.getDataModelIdForProductFilters.next({"id":resObj.id,'isEdit':this.editModeEnabled,"savedObj":this.createSavedObj});
    if(this.backBtnEnabled){
      this.sendDataToProductFilters = {"id":this.tempSavedObj.id,'isEdit':this.editModeEnabled,"savedObj":this.tempSavedObj,"fromBackbtn":true};
    }else{
      this.sendDataToProductFilters = {"id":resObj.id,'isEdit':this.editModeEnabled,"savedObj":this.createSavedObj,"fromBackbtn":false};
    }
    
    this.viewParameterSectionEnabled = true;
  }else{
     // ---- when DataModel not exist in the list option, if name updated or deleted.
    this.shareService.selectedRowCheckedbox.next({name:"",blockName:'dmeNonCustomer',editMode:false});
    this.viewParameterSectionEnabled = false;
  }
  }
  arrayToObjectParameters(arryObj){
    let obj = {};
    arryObj.forEach(element => {      
      obj[element.displayName] = "";
    });
    return obj;
  }
  getEditObjMethod(ele){
    this.createSavedObj.layout = ele.getAttribute('layout'); 
    if(ele.getAttribute('parametervalues') !== null){
      this.createSavedObj.parameterValues = JSON.parse(ele.getAttribute('parametervalues'));
    }else{
      this.createSavedObj.parameterValues = {};
    }                             
  this.createSavedObj.maxCount = ele.getAttribute('maxcount');
  this.createSavedObj.modelName = ele.getAttribute('modelname');
  this.createSavedObj.type = ele.getAttribute('type');  
  this.shareService.selectedRowCheckedbox.next({name:this.createSavedObj.modelName,blockName:'dmeNonCustomer',editMode:true});
  if(this.createSavedObj.maxCount !== null){
    this.singleMultiCheckMethod(1);
  }else{
    this.singleMultiCheckMethod(0);
  }
  }
  updateParamsInputs(key,evt){
    let valueInp = evt.target.value;
    let intParams = this.selectedDmeDataObj.fields;
    let filterCurrt:any = lodash.filter(intParams,{displayName:key})[0];
    filterCurrt['value'] = valueInp;
    this.selectedDmeDataObj.fields = intParams;
  }
  collectDataFromLayoutTemplate(layoutData){
    // this.bsModalRef.content.dynamicContentObj.subscribe(res => {
    //   if(res !== undefined){

    //   }
    // });
    this.chooseLayoutSavedDataObj = layoutData;    
  }
  redirectToLayoutPage(evt){
    let validCheck:any = this.multiRowNextValidayionMethod();
    if(validCheck){      
      return;
    }else{
      this.navigatorActiveStage1 = false;
      this.navigatorActiveStage2 = true;
      this.checkmarkEnable1 = true;
      this.checkmarkEnable2 = false;  
      this.backBtnEnabled = false; 
      setTimeout(() => {
        this.blockNameLoadedFor = 'dme'; 
        this.modelNameSelectedForLayoutPg = this.selectedDmeDataObj.modelName;
        this.tempSavedObj = {
          "type": "dme",
          "layout": this.chooseLayoutSavedDataObj.layout,
          "maxCount": this.chooseLayoutSavedDataObj.maxCount,
          "parameterValues": this.parameterValueArray,
          "modelName":this.selectedDmeDataObj.modelName,
          "modelNameHash":this.selectedDmeDataObj.modelNameHash,
          "dbKey":this.chooseLayoutSavedDataObj.templateKey,
          "freeStyle":this.chooseLayoutSavedDataObj.freeStyle,
          "sortAttributes":this.sortableObj,
          "rowName": this.rowNameValue,
          "id":this.selectedDmeDataObj.id
        };
      }, 200);
    }          
      
  }
  backToGridPage(evt){
    this.navigatorActiveStage1 = true;
    this.navigatorActiveStage2 = false;
    this.checkmarkEnable1 = false;
    this.checkmarkEnable2 = false;  
    // if(Object.keys(this.createSavedObj).length > 0){
    //   //this.shareService.getDataModelIdForProductFilters.next(this.createSavedObj);
    //   //this.inputParamSelected = this.createSavedObj.parameterValues;
    //   this.viewParameterSectionEnabled = true;
    // }else{
    //   //this.shareService.getDataModelIdForProductFilters.next(this.selectedDmeDataObj);
    //   //this.inputParamSelected = this.selectedDmeDataObj.fields;
    //   //this.resetAllSelectedData(); 
    // }
    this.backBtnEnabled = true;
    this.shareService.selectedRowCheckedbox.next({name:this.tempSavedObj.modelName,blockName:'dmeNonCustomer',editMode:true});
    if(!this.editModeEnabled){          
      this.sendDataToProductFilters = {"id":this.tempSavedObj.id,'isEdit':this.editModeEnabled,"savedObj":this.tempSavedObj,"fromBackbtn":this.backBtnEnabled};
    }
  }
  ngOnInit(): void {
    if(this.openedFrom === 'mergeTagOffersDrawer'){
      this.isMergedTagOffersDrawerOpen = true;
      GlobalConstants.parentComponentName = 'MergeTagInjectionComponent';
    } else {
      this.isMergedTagOffersDrawerOpen = false;
      GlobalConstants.parentComponentName = 'ApiPersonalizationComponent';
    }
    console.log("Modal opened from:", this.openedFrom);
  }
  singleMultiCheckMethod(evtVal){
    let inpVal = evtVal.target;
    let val;
    if(inpVal === undefined){
      val = evtVal;
    }else{
      val = inpVal.value;
    }
    if(val == 0){ // single object
      this.singleMultiCheckEnable[0].checked = true;
      this.singleMultiCheckEnable[1].checked = false; 
      this.multiArrayPath = false;
      this.shareService.MultiArryAPIorDMEObj.next('single');
      this.singleOrMultiVal = 0;
      this.isSortable = false;
      this.sortableObj = {};
      this.clearSelectionRowMethod();
            
    }else{ // multi object
      this.singleMultiCheckEnable[1].checked = true;
      this.singleMultiCheckEnable[0].checked = false;
      this.multiArrayPath = true;
      this.shareService.MultiArryAPIorDMEObj.next('multi');
      this.singleOrMultiVal = 1;
      this.clearSelectionRowMethod();
    }
  }
  searchByModelName(evt){
    let strVal;
    if(evt.target !== undefined){
      strVal = evt.target.value;
    }else{
      strVal = evt;
    }
    let filterModelNonCustomerDME = lodash.filter(this.rowDataForPlacementTable, {entityType:0}); 
    this.searchDataModels = this.rowDataForPlacementTable.filter((item)=> {
      return item.modelName.toLowerCase().indexOf(strVal.toLowerCase().trim()) > -1;
    });
    this.modelDataListsArry = [];
    setTimeout(() => {    
      this.modelDataListsArry = this.searchDataModels;  
      if(this.selectedDmeDataObj !== undefined){
        if(this.selectedDmeDataObj.modelName != null) {
          this.shareService.selectedRowCheckedbox.next({name:this.selectedDmeDataObj.modelName,blockName:'dmeNonCustomer',editMode:true});
        }
      }      
      
    }, 500);

    
     
  }
  swapSelectedModelTopMethod(editModel){
    let initialModel = this.modelDataListsArry[0];
    let swapModel = this.modelDataListsArry.filter(x => x.modelName == editModel.modelName);
    let indxModel = this.modelDataListsArry.findIndex(x => x.modelName == editModel.modelName);
    if(swapModel.length > 0){
      this.modelDataListsArry[0] = swapModel[0];
      this.modelDataListsArry[indxModel] = initialModel;
    }    
  }

  getDMEModelData() {
    this.showLoader = true;
    let url = AppConstants.API_END_POINTS.GET_DME_MODEL_DATA;
    this.httpService.post(url).subscribe((data) => {
      if (data.status === 'SUCCESS') {
        this.showLoader = false;
        this.selectionRuleType = false;
        this.showActivityRulesGrid = true;
        let dataRes = JSON.parse(data.result);
        //this.dmeNonCustomerObject = dataRes;
        let filterModelNonCustomerDME = lodash.filter(dataRes, {entityType:0});        
        this.dmeNonCustomerObject = filterModelNonCustomerDME;
        this.rowDataForPlacementTable = filterModelNonCustomerDME;
        this.modelDataListsArry = filterModelNonCustomerDME;
        //this.rowDataForPlacementTable = this.sampleJsonToLoadContextData;
        //console.log(this.rowDataForPlacementTable);
        //console.log(JSON.parse(data.result));
        this.loadDmeNonCustomerMethod();
      }
    });
  }
  addIdToArray(arrayObj,uid){
    //this.agGridParams.api.deselectAll();
    if(arrayObj.length > 0){
      arrayObj.forEach((element:any,i) => {
        element['id']= element[uid];
      });
    }
}
showSelectedRowAgGrid(){
    setTimeout(() => {
      if(this.selectedDmeDataObj !== undefined){
        this.shareService.selectedRowCheckedbox.next({name:this.selectedDmeDataObj.modelName,blockName:'dmeNonCustomer',editMode:true});
      }
    },100);
  } 
paginationChangeMethod(evtObj){
  if(evtObj.newPage){
    this.showSelectedRowAgGrid();
  }
}
onChangeApiNames(params,isEdit) {
  let resObj = params.data;
  if(isEdit){
    if(this.editModeEnabled){   
      if(this.createSavedObj.modelName == resObj.modelName){
        this.viewParameterSectionEnabled = true;
        //this.shareService.getDataModelIdForProductFilters.next({"id":resObj.id,'isEdit':isEdit,"savedObj":this.createSavedObj});
        if(this.backBtnEnabled){
        this.selectedDmeDataObj = this.tempSavedObj;
        this.inputParamSelected = this.tempSavedObj.parameterValues;
        this.createSavedObj.id = this.tempSavedObj.id;
          this.sendDataToProductFilters = {"id":this.tempSavedObj.id,'isEdit':isEdit,"savedObj":this.tempSavedObj,"fromBackbtn":this.backBtnEnabled};
          this.parameterValueArray = this.tempSavedObj.parameterValues;
        }else{
        this.selectedDmeDataObj = this.createSavedObj;
        this.inputParamSelected = this.createSavedObj.parameterValues;
        this.createSavedObj.id = resObj.id;
          this.sendDataToProductFilters = {"id":resObj.id,'isEdit':isEdit,"savedObj":this.createSavedObj,"fromBackbtn":false};
          this.parameterValueArray = this.createSavedObj.parameterValues;
        }        
        
      }else{
        this.createSavedObj.layout = resObj.layout;  
        this.createSavedObj.maxCount = resObj.maxCount;
        this.createSavedObj.modelName = resObj.modelName;
        this.createSavedObj.type = resObj.createdFrom;
        this.selectedDmeDataObj = resObj;
        this.inputParamSelected = this.arrayToObjectParameters(resObj.fields);
        this.viewParameterSectionEnabled = true;
        //this.shareService.getDataModelIdForProductFilters.next({"id":resObj.id,'isEdit':false,"savedObj":resObj});
        if(this.backBtnEnabled){
          this.sendDataToProductFilters = {"id":this.tempSavedObj.id,'isEdit':isEdit,"savedObj":this.tempSavedObj,"fromBackbtn":this.backBtnEnabled};
        }else{
          this.sendDataToProductFilters = {"id":resObj.id,'isEdit':isEdit,"savedObj":this.createSavedObj,"fromBackbtn":false};
        }
        this.parameterValueArray = this.createSavedObj.parameterValues;
      }
      
    }else{
      this.createSavedObj.layout = resObj.layout;  
      this.createSavedObj.maxCount = resObj.maxCount;
      this.createSavedObj.modelName = resObj.modelName;
      this.createSavedObj.type = resObj.createdFrom;
      this.selectedDmeDataObj = resObj;
      this.inputParamSelected = this.arrayToObjectParameters(resObj.fields);
      this.viewParameterSectionEnabled = true;
    }     
  }else{ // Create mode.
    this.inputParamSelected = this.arrayToObjectParameters(resObj.fields);
    this.selectedDmeDataObj = resObj;
    //this.shareService.getDataModelIdForProductFilters.next({"id":resObj.id,'isEdit':isEdit,"savedObj":resObj});
    this.tempSavedObj = {}; // on changes of new DME.
    this.createSavedObj.modelName = resObj.modelName;
    this.createSavedObj.modelNameHash = resObj.modelNameHash;
    this.sendDataToProductFilters = {"id":resObj.id,'isEdit':isEdit,"savedObj":this.createSavedObj,"fromBackbtn":false};
    resObj.fields.map((item,i) => {
      if(item.value !== undefined){
        item.value = "";
      }
    });
    this.selectedDmeDataObj.fields = resObj.fields;
    if(this.editModeEnabled){
      this.createSavedObj.parameterValues = this.inputParamSelected;
    }
    if(this.sortableObj !== undefined){
      this.sortableObj = {};
    }
    this.viewParameterSectionEnabled = true;
  }
    
 
}
expandSortableAreaMethod(evt){
  let sortChecked;
  if(evt.target !== undefined){
    sortChecked = evt.target.checked;
  }else{
    sortChecked = evt;
  }  
  
  if(sortChecked){
    this.sortableExpandCollapse = true;
    if(!this.editModeEnabled){
      this.sortableObj = {"sortedCol":"-1","order":"-1"};
    }
  }else{
    this.sortableExpandCollapse = false;
    this.sortableObj = {};
    this.isSortable = false;
  }
  if(this.editModeEnabled){   
    if(this.sortableObj.sortedCol === undefined || this.sortableObj.order === undefined){
      if(this.isSortable){
        this.sortableObj = {"sortedCol":"-1","order":"-1"};
        this.sortedFieldEditmode = this.sortableObj.sortedCol;
        this.sortedOrderEditmode = this.sortableObj.order;
      }      
    }else{
      this.sortedFieldEditmode = this.sortableObj.sortedCol;
      this.sortedOrderEditmode = this.sortableObj.order;
    }
    
  }else{
    this.sortableObj = {"sortedCol":"-1","order":"-1"};
  }
  
}
sortedSelectedFieldMethod(evt){
  this.sortableObj["sortedCol"] = evt.target.value;
  this.sortedFieldEditmode = evt.target.value

}
sortedSelectedAscDscMethod (evt){
  this.sortableObj["order"] = evt.target.value;
  this.sortedOrderEditmode = evt.target.value;
}
updateSortSelectedMethod(obj){
  let selectorEleRefField:any = document.getElementById('sortableField');
  let selectorEleRefOrder:any = document.getElementById('ascDscField');
  if(selectorEleRefField !== null || selectorEleRefOrder !== null){
    if(Object.keys(obj).length > 0){
      selectorEleRefField.value = obj.sortedCol;
      selectorEleRefOrder.value = obj.order;  
    }else{
      selectorEleRefField.value = '-1';
      selectorEleRefOrder.value = '-1';  
    }
  }
}
getParemeterValFromFIltersMethod(paramObj){
  this.parameterValueArray = paramObj;
  //this.selectedDmeDataObj.parameterValues = paramObj;

}
getFieldsArrayListMethod(arryObj){  
  let filterBySortTrue = arryObj.fields.filter(x => x.sortable == 'true');
  this.fieldsOfSelectedDMEModel = filterBySortTrue;
  this.isSortable = arryObj.isSortable;
  if(Object.keys(this.sortableObj).length === 0){
    this.sortInputCheck = false;
  }else{
    this.sortInputCheck = true;
  }
  
  if(this.singleOrMultiVal !== 0){
      this.sortedAreaEnabled = this.isSortable;
  }else{
    this.sortedAreaEnabled = false;
  }  
  setTimeout(() => {
    this.updateSortSelectedMethod(this.sortableObj);
  }, 300);  
}
multiRowNextValidayionMethod(){
  let noParamflag = false;
  let objParams:any = {};
    // if(!this.editModeEnabled){
    //   if(this.selectedDmeDataObj.fields.length > 0){
    //   this.selectedDmeDataObj.fields.forEach(item => {
    //     if(item.value !== undefined){
    //       objParams[item.displayName] = item.value;
    //     }else{
    //       objParams[item.displayName] = "";
    //     }
    //   });
    // }   
    // }else{ // edit mode
    //   if(this.selectedDmeDataObj.parameterValues !== undefined){
    //     objParams = this.selectedDmeDataObj.parameterValues;
    //   }else{
    //     this.selectedDmeDataObj.fields.forEach(item => {
    //       if(item.value !== undefined){
    //         objParams[item.displayName] = item.value;
    //       }else{
    //         objParams[item.displayName] = "";
    //       }
    //     });
    //   }  
    // }
   // let parameterValues = JSON.stringify(objParams);
    if(this.parameterValueArray.length > 0){
      objParams = this.parameterValueArray;    
    
    let validateParamsColumnName = objParams.map(x => x.columnName);
    let validateParamsOpretor = objParams.map(x => x.operator);
    let validateParamsValue = objParams.map(x => x.value);
    if(validateParamsColumnName.includes('')){
      noParamflag = this.validateParamsValMethod(this.translate.instant('customerNonCustomerDMEComponents.columnNameCannotBeEmptyMsgLbl'),true);
    }else if(validateParamsOpretor.includes('-1')){
      noParamflag = this.validateParamsValMethod(this.translate.instant('customerNonCustomerDMEComponents.operatorCannotBeEmptyMsgLbl'),true);
    }else if(validateParamsValue.includes('')){
      noParamflag = this.validateParamsValMethod(this.translate.instant('customerNonCustomerDMEComponents.valueFieldCannotBeEmptyMsgLbl'),true);
    }
  }else{
    noParamflag = this.validateParamsValMethod(this.translate.instant('customerNonCustomerDMEComponents.columnNameCannotBeEmptyMsgLbl'),true);
  }
    if(this.isSortable && this.multiArrayPath){
      if(Object.keys(this.sortableObj).length > 0 && this.sortableObj){
        if(this.sortableObj.sortedCol == '-1' || this.sortableObj.order == '-1'){
          noParamflag = this.validateParamsValMethod(this.translate.instant('customerNonCustomerDMEComponents.sortByDefineCriteriatoContinueAlertMsgLbl'),true);
        }
      }
    } 
    return noParamflag;
}
  validateParamsValMethod(typeStrError,noParamflag){
    Swal.fire({
          titleText: typeStrError,
          allowEscapeKey: false,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: this.translate.instant('ok'),
        });
        noParamflag = true;
        return noParamflag;
    
  }
  insertApiRow(isMergedTagOffersDrawerOpen): void {
    let uuid = uuidv4();
    this.rowNameValue = this.randomNameService.generateRandomName("rowName-");
    this.selectedDmeDataObj.rowName = this.createSavedObj.rowName;
    if(this.isRowEditModeEnable) {
      uuid = this.selectedNonDMEuuid;
      this.rowNameValue = this.selectedDmeDataObj.rowName;
    }
    const localExistingRowLabels = GlobalConstants.existingRowLabels;
    localExistingRowLabels[uuid] = this.rowNameValue;
    this.isDoneClicked = true;
    let noParamflag = false;
    //const selectedAPi = this.api_responses.find((x) => x.apiKey == this.selectedApiKey);
    //const inputParams = Object.entries(JSON.parse(selectedAPi.input_params));
    //const params = JSON.parse(selectedAPi.input_params);
    let objParams:any = [];
    // if(!this.editModeEnabled){
    //   if(this.selectedDmeDataObj.fields.length > 0){
    //   this.selectedDmeDataObj.fields.forEach(item => {
    //     if(item.value !== undefined){
    //       objParams[item.displayName] = item.value;
    //     }else{
    //       objParams[item.displayName] = "";
    //     }
    //   });
    // }   
    // }else{ // edit mode
    //   if(this.selectedDmeDataObj.parameterValues !== undefined){
    //     objParams = this.selectedDmeDataObj.parameterValues;
    //   }else{
    //     this.selectedDmeDataObj.fields.forEach(item => {
    //       if(item.value !== undefined){
    //         objParams[item.displayName] = item.value;
    //       }else{
    //         objParams[item.displayName] = "";
    //       }
    //     });
    //   }      
      
    // }
    let parameterValues:any;
    if(this.parameterValueArray.length > 0){
          objParams = this.parameterValueArray;

    let validateParamsColumnName = objParams.map(x => x.columnName);
    let validateParamsOpretor = objParams.map(x => x.operator);
    let validateParamsValue = objParams.map(x => x.value);
    if(validateParamsColumnName.includes('')){
      noParamflag = this.validateParamsValMethod(this.translate.instant('customerNonCustomerDMEComponents.columnNameCannotBeEmptyMsgLbl'),true);
    }else if(validateParamsOpretor.includes('-1')){
      noParamflag = this.validateParamsValMethod(this.translate.instant('customerNonCustomerDMEComponents.operatorCannotBeEmptyMsgLbl'),true);
    }else if(validateParamsValue.includes('')){
      noParamflag = this.validateParamsValMethod(this.translate.instant('customerNonCustomerDMEComponents.valueFieldCannotBeEmptyMsgLbl'),true);
    }
    
    }else{
      noParamflag = this.validateParamsValMethod(this.translate.instant('customerNonCustomerDMEComponents.columnNameCannotBeEmptyMsgLbl'),true);
    }
    parameterValues = JSON.stringify(objParams);
    
    if(isMergedTagOffersDrawerOpen) {
      this.updateMergeTagInjection(objParams);
      return;
    }
    // if(lodash.filter(lodash.values(parameterValues)).length == 0){
    //   Swal.fire({
    //     titleText: 'No parameters are defined, please define the any one parameters to continue',
    //     allowEscapeKey: false,
    //     allowOutsideClick: false,
    //     showConfirmButton: true,
    //     confirmButtonText: this.translate.instant('ok'),
    //   });
    //   noParamflag = true;
    //   return;
    // }
    if(!noParamflag){
    
    
    // this.recoArributesObj = 
    //   {"basicEnable":true,"advanceEnable":false,"pageType":this.selectedApiDataObj.apiName,"maxCount":this.chooseLayoutSavedDataObj.maxCount,"placementId":""};
    //   this.recoArributesObj = JSON.stringify(this.recoArributesObj);
    let dynamicTemplateInsert:any;
    let jsonObject:any;
    let layout = this.chooseLayoutSavedDataObj.layout;
    if(this.chooseLayoutSavedDataObj.freeStyle){
       layout = 'layout0';
    }
    if(this.isSortable){
      if(Object.keys(this.sortableObj).length > 0){
        if(this.sortableObj.sortedCol == '-1' || this.sortableObj.order == '-1'){
            Swal.fire({
            titleText: this.translate.instant('customerNonCustomerDMEComponents.sortByDefineCriteriatoContinueAlertMsgLbl'),
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonText: this.translate.instant('ok'),
          });     
          return;  
        }
      }
    }    
   let sortedAttributesObj = JSON.stringify(this.sortableObj);
   
   if(this.multiArrayPath){
    dynamicTemplateInsert = "<dynamic-content id='"+uuid+"' rowName='"+this.rowNameValue+"' type='dme' layout='"+layout+"' modelName='" + this.selectedDmeDataObj.modelNameHash + "' modelDisplayName='" + this.selectedDmeDataObj.modelName + "' maxCount='"+this.chooseLayoutSavedDataObj.maxCount+ "' freeStyle='" +this.chooseLayoutSavedDataObj.freeStyle +"' parameterValues='" + parameterValues + "' rowStyle='' layoutStyle='' sortAtrributes='"+sortedAttributesObj+"' data-isDmeBlock='0'>";

    jsonObject = {
      "type": "dme",
      "layout": this.chooseLayoutSavedDataObj.layout,
      "maxCount": this.chooseLayoutSavedDataObj.maxCount,
      "input_params": parameterValues,
      "modelName":this.selectedDmeDataObj.modelName,
      "modelNameHash":this.selectedDmeDataObj.modelNameHash,
      "dbKey":this.chooseLayoutSavedDataObj.templateKey,
      "freeStyle":this.chooseLayoutSavedDataObj.freeStyle,
      "sortAttributes":this.sortableObj,
      "rowName": this.rowNameValue,
      "id":this.selectedDmeDataObj.id
    };
   }else{
    dynamicTemplateInsert = "<dynamic-content id='"+uuid+"' rowName='"+this.rowNameValue+"' type='dme' layout='layout0' maxCount='1' modelName='" + this.selectedDmeDataObj.modelNameHash + "' modelDisplayName='" + this.selectedDmeDataObj.modelName + "' parameterValues='"+parameterValues+"' sortAtrributes='"+sortedAttributesObj+"' data-isDmeBlock='0'>";

    jsonObject = {
      "type": "dme",      
      "input_params": parameterValues,
      "modelName":this.selectedDmeDataObj.modelName,
      "modelNameHash":this.selectedDmeDataObj.modelNameHash,
      "sortAttributes":this.sortableObj,
      "rowName": this.rowNameValue,
      "id":this.selectedDmeDataObj.id
    };
   }
   const jsonString = JSON.stringify(jsonObject);
    let rowData = {
      0: {
        type: 'rowAddon',
        value: {
          name: 'Empty row',
          'background-color': '#ffffff',
          'display-condition': {
            type: 'api',
            label: 'API',
            description: this.selectedDmeDataObj.modelName,
            before:
              dynamicTemplateInsert,
            after: '</dynamic-content>',
          },
          metadata: { selectedValue: jsonString, id:uuid },
          columns: [
            {
              weight: 12,
              modules: [],
            },
          ],
        },
      },
    };
    this.myDataRowInsert = rowData[0];
    this.onClose();
    if(this.isRowEditModeEnable) {
      this.onEdit.emit(this.myDataRowInsert);
    } else {
      this.onAdd.emit(this.myDataRowInsert);
    }
  }
  }

  updateMergeTagInjection(params){
    /* console.log("Updating params: "+ params);
    console.log("API Name: "+ this.selectedApiDataObj.apiName);
    console.log("CommChannelKey: "+ this.commChannelKey); */
    let maxCountVal = this.multiArrayPath? this.sliderValue : 0;
    this.selectedMergeTagData = {
      filters: params,
      name: this.selectedDmeDataObj.modelName,
      type: 'DME',
      maxCount: maxCountVal
    };
    this.onUpdateMergeTagInj.next({
      selectedMergeTagData: this.selectedMergeTagData
    });
    
    this.onClose();
  }
 
  onClose(): void {
    if (this.bsModalRef !== undefined) {
      this.bsModalRef.hide();
    }
  }

  selectMaxProductSlider(e) {
    let floorVal = 1;
    let selectValue = e;
    if (selectValue === 1) {
      floorVal = 0;
    } else {
      floorVal = 1;
    }
    let newsliderOptions: Options = {
      floor: floorVal,
      showSelectionBar: true,
      ceil: selectValue,
    };
    this.sliderOptions = newsliderOptions;
    this.sliderValue = parseInt(selectValue);
  }

  prevItem(): void {
    if (this.sliderValue > 1) {
      this.sliderValue--;
      this.selectMaxProductSlider(this.sliderValue);
    }
  }

  nextItem(): void {
    if (this.sliderValue < this.noofRecoConfig) {
      this.sliderValue++;
      this.selectMaxProductSlider(this.sliderValue);
    }
  }
}
