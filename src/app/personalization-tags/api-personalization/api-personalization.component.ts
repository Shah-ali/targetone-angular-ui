import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input, NgZone } from '@angular/core';
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
import { Subject, take } from 'rxjs';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-api-personalization',
  templateUrl: './api-personalization.component.html',
  styleUrls: ['./api-personalization.component.scss'],
})
export class ApiPersonalizationComponent implements OnInit {
  @Output() onAdd = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @ViewChild('t1', { static: false }) t1!: ElementRef; 
  onUpdateMergeTagInj: Subject<any> = new Subject();

  createSavedObj:any = {};
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
  blockNameLoadedFor:any = 'api';
  isRowEditModeEnable: boolean = false;
  openedFrom!: string;
  commChannelKey!: string;
  isMergedTagOffersDrawerOpen: boolean = false;
  sliderOptions: Options = {
    floor: 1,
    showSelectionBar: true,
    ceil: 4
  };
  sliderValue:any = 4;
  noofRecoConfig: number = 12;

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
  columnHeadersRuleReco:ColDef[]  = [];
    
  customLayoutEnabled:boolean = false;
  selectedApiDataObj: any = {};
  inputParamSelected: any;
  viewParameterSectionEnabled: boolean = false;
  temporaryObjForSearch: any;
  searchDataModels: any;
  singleMultiCheckEnable:any = [];
  singleOrMultiVal: number = 0;
  multiArrayPath: boolean = false;
  recoArributesObj: any = {};
  chooseLayoutSavedDataObj: any = {};
  savedHtmlContent: any;
  editModeEnabled: boolean = false;
  isNewApiConsumeBlock: boolean = true;
  modelNameSelectedForLayoutPg: any;
  selectedApiuuid: any;
  noDataSavedYet: boolean = true;
  bsModalGlobal:any =  BsModalRef;
  ispromoExecutedOrRunning: boolean = false;
  isPublishedPersonalization: boolean = false;
  rowNameValue: string = "";
  selectedMergeTagData: any;

  constructor(private bsModalRef: BsModalRef, private httpService: HttpService, private clipboard: Clipboard, private translate: TranslateService, private shareService: SharedataService,private ngZone: NgZone, private dataService: DataService, private randomNameService: RandomNameService) {
    

    this.agGridLocaleLabels = {
      "to": this.translate.instant('agGridLocaleLabels.to'),
      "of": this.translate.instant('agGridLocaleLabels.of'),
      "page": this.translate.instant('agGridLocaleLabels.page'),
      "noRowsToShow": this.translate.instant('agGridLocaleLabels.noRowsToShow') 
    };
    this.columnHeadersRuleReco = [
      { field: "checkbox",headerName:'',maxWidth:50,cellStyle:{"text-align":"center"},
      cellRenderer: RadioRowSelectionComponent,
      cellRendererParams: { context: this }
      },
      { field: 'apiName',headerName:this.translate.instant('apiPersonalization.apiNameLbl'),maxWidth:400,tooltipField:'apiName'},
      { field: 'apiDescription',headerName:this.translate.instant('apiPersonalization.apiDescriptionLbl'),maxWidth:400,tooltipField:'apiDescription',sortable:false},
      { field: 'apiTypeText',headerName:this.translate.instant('apiPersonalization.apiTypeColumnLbl'),maxWidth:400,tooltipField:'apiTypeText',sortable:false}   
    ];
    this.singleMultiCheckEnable = [{id:0,name:this.translate.instant('apiPersonalization.singleObjectLbl'),singleVal:0,checked:true},{id:1,name:this.translate.instant('apiPersonalization.multiObjectLbl'),singleVal:1,checked:false},];
    GlobalConstants.parentComponentName = 'ApiPersonalizationComponent';
    
    this.tagKey = this.dataService.activeContentTagKey;//localStorage.getItem('tagKeyPersonalization');
    this.viewParameterSectionEnabled = false;
    
    this.resetAllSelectedData();    
    this.getApiNames();
    
    //this.getApiNames();
  
  }

  editModeDataMethod(dataObj){
    this.getEditObjMethodnew(dataObj);    
    this.viewParameterSectionEnabled = true;
  }
  
  getEditObjMethodnew(resObj){    
    if(resObj.input_params !== null){
      this.createSavedObj.input_params = JSON.parse(resObj.input_params);
    }else{
      this.createSavedObj.input_params = {};
    }                    
    this.createSavedObj.apiName = resObj.apiName;
    this.createSavedObj.type = resObj.type;
    this.createSavedObj.apiType = resObj.apiType;
    this.createSavedObj.freeStyle = resObj.freeStyle;
    this.createSavedObj.rowName = resObj.rowName;

    if(resObj.maxCount !== undefined){
      this.createSavedObj.layout = resObj.layout; 
      this.createSavedObj.maxCount = resObj.maxCount;
      this.createSavedObj.dbKey = resObj.dbKey;
      this.singleMultiCheckMethod(1);
    }else{
      this.singleMultiCheckMethod(0);
    } 
    this.shareService.freeStyleLayout[resObj.apiName]  = {
      isFreeStyleLayout : resObj.freeStyle,
      maxCount : this.createSavedObj.maxCount
    }
    this.inputParamSelected = this.createSavedObj.input_params;
    this.selectedApiDataObj = this.createSavedObj;
    
    if(this.isMergedTagOffersDrawerOpen) {
      this.sliderValue = resObj.maxCount;
    }

    if(!this.isNewApiConsumeBlock){
      setTimeout(() => {        
        this.shareService.selectedRowCheckedbox.next({name:this.createSavedObj.apiName,blockName:'api',editMode:true});
      }, 0);      
    }  
  
  }
  swapSelectedModelTopMethod(editModel){
    let initialModel = this.modelDataListsArry[0];
    let swapModel = this.modelDataListsArry.filter(x => x.apiName == editModel.apiName);
    let indxModel = this.modelDataListsArry.findIndex(x => x.apiName == editModel.apiName);
    if(swapModel[0] !== undefined){
      this.modelDataListsArry[0] = swapModel[0];
    }
    if(indxModel !== -1){
      this.modelDataListsArry[indxModel] = initialModel;
    }
  }
  // getEditObjMethod(ele){
  //   this.swapSelectedModelTopMethod(ele);
  //   this.createSavedObj.layout = ele.getAttribute('layout'); 
  //   if(ele.getAttribute('parametervalues') !== null){
  //     this.createSavedObj.parameterValues = JSON.parse(ele.getAttribute('parametervalues'));
  //   }else{
  //     this.createSavedObj.parameterValues = {};
  //   }                             
  // this.createSavedObj.maxCount = ele.getAttribute('maxcount');
  // this.createSavedObj.apiName = ele.getAttribute('apiname');
  // this.createSavedObj.type = ele.getAttribute('type');   
  // if(this.createSavedObj.maxCount !== null || this.createSavedObj.maxCount !== undefined){
  //   this.singleMultiCheckMethod(1);
  // }else{
  //   this.singleMultiCheckMethod(0);
  // }
  // this.inputParamSelected = this.createSavedObj.parameterValues;
  //             this.selectedApiDataObj = this.createSavedObj;
  //             //setTimeout(() => {
  //               if(!this.isNewApiConsumeBlock){
  //                 this.shareService.selectedRowCheckedbox.next({name:this.createSavedObj.apiName,blockName:'api',editMode:true});
  //               }     
               
  //             //}, 1000);
  //             //this.viewParameterSectionEnabled = true;
  // }
  resetAllSelectedData(){
    this.selectedApiDataObj = {};
        this.inputParamSelected = [];
        this.viewParameterSectionEnabled = false;
  }
  updateParamsInputs(key,evt){    
    // if(this.editModeEnabled){
    //   if(typeof(this.selectedApiDataObj.input_params) === 'object'){
    //     paramsObj = this.selectedApiDataObj.input_params;
    //   }else{
    //     paramsObj = JSON.parse(this.selectedApiDataObj.input_params);
    //   }      
    // }else{
    //   paramsObj = JSON.parse(this.selectedApiDataObj.input_params);
    // }
    let valueInp = evt.target.value;
    let paramsObj = this.parseValIfObjOrStringMethod(this.selectedApiDataObj.input_params);
    let intParams = paramsObj;
    intParams[key] = valueInp;
    //this.inputParamSelected[key] = valueInp;
    this.selectedApiDataObj.input_params = intParams;
  }
  collectDataFromLayoutTemplate(layoutData){
    // this.bsModalRef.content.dynamicContentObj.subscribe(res => {
    //   if(res !== undefined){

    //   }
    // });
    this.chooseLayoutSavedDataObj = layoutData;    
  }
  multiRowNextValidationMethod(){
    let noParamflag = false;
    let objParams = {};
    let paramsObj = this.parseValIfObjOrStringMethod(this.selectedApiDataObj.input_params);;
    
      if(!this.editModeEnabled){
          if(lodash.filter(lodash.values(paramsObj)).length > 0){
            lodash.mapKeys(paramsObj, (value,key) => {
              if(value !== undefined){
                objParams[key] = value;
              }else{
                objParams[key] = "";
              }
            });        
        }   
      }else{ // edit mode
        if(paramsObj !== undefined){
          objParams = paramsObj;
        }else{
          if(lodash.filter(lodash.values(paramsObj)).length > 0){
            lodash.mapKeys(paramsObj, (value,key) => {
              if(value !== undefined){
                objParams[key] = value;
              }else{
                objParams[key] = "";
              }
            });        
        } 
        }  
      }
     // let parameterValues = JSON.stringify(objParams);
      if(lodash.filter(lodash.values(objParams)).length == 0){     
        noParamflag = true;
      }
      return noParamflag;
  }
  redirectToLayoutPage(evt){
    let validCheck = this.multiRowNextValidationMethod();
    if(validCheck){
      Swal.fire({
        titleText: this.translate.instant('apiPersonalization.parametersValueArenotDefinedErrorMsgLbl'),
        showCancelButton: true,
        confirmButtonText: this.translate.instant('yes'),
        cancelButtonText: this.translate.instant('cancel'),        
        allowOutsideClick: false,
        allowEscapeKey: false,
        customClass: {
          cancelButton: 'buttonCssStyle',
          confirmButton: 'buttonCssStyle',
        },
      }).then((result) => {
        if(result.isConfirmed){
          this.navigatorActiveStage1 = false;
          this.navigatorActiveStage2 = true;
          this.checkmarkEnable1 = true;
          this.checkmarkEnable2 = false;  
          setTimeout(() => {
            this.blockNameLoadedFor = 'api'; 
            this.modelNameSelectedForLayoutPg = this.selectedApiDataObj.apiName;
          }, 100);
        }
      });
    }else{
      this.navigatorActiveStage1 = false;
      this.navigatorActiveStage2 = true;
      this.checkmarkEnable1 = true;
      this.checkmarkEnable2 = false;  
      setTimeout(() => {
        this.blockNameLoadedFor = 'api'; 
        this.modelNameSelectedForLayoutPg = this.selectedApiDataObj.apiName;
      }, 100);
    }      
  }
  backToGridPage(evt){
    this.navigatorActiveStage1 = true;
    this.navigatorActiveStage2 = false;
    this.checkmarkEnable1 = false;
    this.checkmarkEnable2 = false;     
    
    if(Object.keys(this.createSavedObj).length > 0){
      this.inputParamSelected = this.createSavedObj.input_params;
      this.viewParameterSectionEnabled = true;
    }else{
      let paramsObj = this.parseValIfObjOrStringMethod(this.selectedApiDataObj.input_params);
      this.inputParamSelected = paramsObj;
      //this.resetAllSelectedData(); 
    }  
    this.searchByModelName('');          
  }
  ngOnInit(): void {
    //this.showLoader = true;
    if(this.openedFrom === 'mergeTagOffersDrawer'){
      this.isMergedTagOffersDrawerOpen = true;
      GlobalConstants.parentComponentName = 'MergeTagInjectionComponent';
    } else {
      this.isMergedTagOffersDrawerOpen = false;
      GlobalConstants.parentComponentName = 'ApiPersonalizationComponent';
    }
    console.log("Modal opened from:", this.openedFrom);
    //this.shareService.selectedRowCheckedbox.next({}); //Initialies with empty.
  }
  loadApiSelected(){
    this.shareService.isPublishEnabledForPersonalization.subscribe(res => {
      if(res !== undefined){
        this.ispromoExecutedOrRunning = res;
        this.isPublishedPersonalization = res; 
      }      
    });
    this.shareService.isApiConsumeEditMode.pipe(take(1)).subscribe((res:any) => {
      if(GlobalConstants.isRowEditModeEnable) {
        this.isRowEditModeEnable = true;
      } else {
        this.isRowEditModeEnable = false;
      }
      
      if (!res || !Object.keys(res).length) {
        this.noDataSavedYet = true;
        this.editModeEnabled = false;
        this.isNewApiConsumeBlock = true;
        this.shareService.selectedRowCheckedbox.next({name:"",blockName:'api',editMode:false}); 
        return;
      }
      
      this.noDataSavedYet = false;
      this.selectedApiuuid = res?.id;
      this.isNewApiConsumeBlock = res.selectedValue === undefined;
      this.editModeEnabled = !this.isNewApiConsumeBlock;
      
      if (!this.isNewApiConsumeBlock) {
        const selectedValParams = JSON.parse(res.selectedValue);
        this.editModeDataMethod(selectedValParams);
        //this.shareService.sendParamsFromRecoOffersDynamic.next({});
      }
    });
   
     // --------- Grid radio button selected ----------
    //  this.shareService.sendParamsFromRecoOffersDynamic.subscribe((res:any) => {
    //   if(Object.keys(res).length > 0){   
    //     if(!this.isNewApiConsumeBlock){
    //       if(Object.keys(this.createSavedObj).length > 0){
    //         if(this.createSavedObj.apiName == res.data.apiName ){ // edit is overide with new selection       
    //           this.selectedApiDataObj = this.createSavedObj;
    //           this.inputParamSelected = this.createSavedObj.parameterValues;
    //           this.editModeEnabled = true;
    //           this.viewParameterSectionEnabled = true;
    //         }else{
    //           this.selectedApiDataObj = res.data;
    //           if(this.selectedApiDataObj.input_params !== undefined){
    //             this.inputParamSelected = JSON.parse(this.selectedApiDataObj.input_params);
    //           }              
    //           this.createSavedObj = {}; //edit mode reset
    //           this.editModeEnabled = false;
    //           this.viewParameterSectionEnabled = true;
    //         }
    //       }else{
    //           this.selectedApiDataObj = res.data;
    //           if(this.selectedApiDataObj.input_params !== undefined){
    //             this.inputParamSelected = JSON.parse(this.selectedApiDataObj.input_params);
    //           } 
    //           this.editModeEnabled = false;
    //           this.viewParameterSectionEnabled = false;
    //       }
    //     }else{
    //       this.selectedApiDataObj = res.data;
    //       if(this.selectedApiDataObj.input_params !== undefined){
    //         this.inputParamSelected = JSON.parse(this.selectedApiDataObj.input_params);
    //       } 
    //       this.editModeEnabled = false;
    //       if(this.isNewApiConsumeBlock){
    //         if(this.noDataSavedYet){
    //           this.viewParameterSectionEnabled = false;
    //         }else{
    //           this.viewParameterSectionEnabled = true;
    //         }            
    //       }else{
    //         this.viewParameterSectionEnabled = false;
    //       }
          
    //       this.shareService.selectedRowCheckedbox.next({name:"",blockName:'api',editMode:false});
    //     }
             
       
        
    //   }
    // });
  }
  
  singleMultiCheckMethod(evtVal){
    //let inpVal = evtVal.target;
    let val = evtVal;
    // if(evtVal === undefined){
    //   val = evtVal;
    // }else{
    //   val = inpVal.value;
    // }
    if(val == 0){ // single object
      this.singleMultiCheckEnable[0].checked = true;
      this.singleMultiCheckEnable[1].checked = false; 
      this.multiArrayPath = false;
      this.shareService.MultiArryAPIorDMEObj.next('single');
      this.singleOrMultiVal = 0;
      let filterOBj = this.singleOrMultiObjMethod(this.api_responses,0);
      
      this.clearSelectionRowMethod();
      setTimeout(() => {
        this.modelDataListsArry = filterOBj;  
        this.addIdToArray(this.modelDataListsArry,'apiKey');
        if(this.editModeEnabled){
          this.shareService.selectedRowCheckedbox.next({name:this.createSavedObj.apiName,blockName:'api',editMode:true});
          this.swapSelectedModelTopMethod(this.createSavedObj);   
        } 
      }, 300); 
            
    }else{ // multi object
      this.singleMultiCheckEnable[1].checked = true;
      this.singleMultiCheckEnable[0].checked = false;
      this.multiArrayPath = true;
      this.shareService.MultiArryAPIorDMEObj.next('multi');
      this.singleOrMultiVal = 1;
      let filterOBj = this.singleOrMultiObjMethod(this.api_responses,1);
      this.clearSelectionRowMethod();
      setTimeout(() => {
        this.modelDataListsArry = filterOBj; 
        this.addIdToArray(this.modelDataListsArry,'apiKey');
        if(this.editModeEnabled){
          this.shareService.selectedRowCheckedbox.next({name:this.createSavedObj.apiName,blockName:'api',editMode:true});
          this.swapSelectedModelTopMethod(this.createSavedObj);   
        }      
      }, 300);      
          
    }    
    if(!this.editModeEnabled){
      this.selectedApiDataObj = {};
      this.clearSelectionRowMethod();
    }  
    // if(this.editModeEnabled){
    //   this.searchByModelName('');
    // }
  }
  clearSelectionRowMethod(){
    this.modelDataListsArry = [];    
    this.viewParameterSectionEnabled = false;
    this.shareService.selectedRowCheckedbox.next({name:"",blockName:'api',editMode:false});     
  }
  searchByModelName(evt){
    let strVal,filterObjects;
    if(evt.target !== undefined){
      strVal = evt.target.value;
    }else{
      strVal = evt;
    }
    if(this.multiArrayPath){
      filterObjects = this.singleOrMultiObjMethod(this.api_responses,1);
    }else{
      filterObjects = this.singleOrMultiObjMethod(this.api_responses,0);
    }      
    this.searchDataModels = filterObjects.filter((item)=> {
      return item.apiName.toLowerCase().indexOf(strVal.toLowerCase().trim()) > -1;
    });
    this.modelDataListsArry = [];
    
    setTimeout(() => {    
      this.modelDataListsArry = this.searchDataModels;  
      this.shareService.selectedRowCheckedbox.next({name:this.selectedApiDataObj.apiName,blockName:'api',editMode:true});
      if(this.editModeEnabled){
        this.swapSelectedModelTopMethod(this.createSavedObj);   
      }
    }, 200);    
  }  
  getApiNames(): void {
    this.showLoader = true;
    let url: any;
    url = AppConstants.API_PERSONSOALIZATION_TAGS_END_POINTS.GET_ALL_APIS_PERSONALIZATION;
    this.httpService.post(url).subscribe((data) => {
      this.api_responses = data.response;
      let filterBySingleOrMultiObj  = this.singleOrMultiObjMethod(data.response,0);
      this.modelDataListsArry = filterBySingleOrMultiObj;      
      this.temporaryObjForSearch = filterBySingleOrMultiObj; 
      this.addIdToArray(this.modelDataListsArry,'apiKey');
      //this.onChangeApiNames(this.api_responses[0].apiKey);
      //this.editDataLoadingMethod();
      this.showLoader =false;
      this.loadApiSelected();
    });
  }
  addIdToArray(arrayObj,uid){
    //this.agGridParams.api.deselectAll();
    if(arrayObj.length > 0){
      arrayObj.forEach((element:any,i) => {
        element['id']= element[uid];
        if(element.apiType == 2){
          element['apiTypeText'] = this.translate.instant('apiPersonalization.JSAPIlbl');
        }else{
          element['apiTypeText'] = this.translate.instant('apiPersonalization.RESTAPILbl');
        }
      });
    }
}
singleOrMultiObjMethod(obj,type){
  let filterObj;
 if(obj !== undefined){
  let xobjSingle = lodash.filter(obj,{'multiObjectOutput':'false'});
  let xobjMulti = lodash.filter(obj,{'multiObjectOutput':'true'});
  if(type == 0){
    filterObj = xobjSingle;
  }else{
    filterObj = xobjMulti;
  }  
  return filterObj;
 }
}
validationCheckMethod(paramsObj){
  let flag = false;
  Object.keys(paramsObj).forEach(item => {
    if(paramsObj[item] === undefined){
      flag = true;
    }else{
      flag = false;
    }
  });
  return flag;
}

  insertApiRow(isMergedTagOffersDrawerOpen): void {
    let uuid = uuidv4();
    this.rowNameValue = this.randomNameService.generateRandomName("rowName-");
    if(this.isRowEditModeEnable) {
      uuid = this.selectedApiuuid;
      this.rowNameValue = this.createSavedObj.rowName;
    }
    GlobalConstants.existingRowLabels[uuid] = this.rowNameValue;
    this.isDoneClicked = true;
    let params:any;
   if(this.editModeEnabled){
    if(this.selectedApiDataObj.input_params !== undefined){
      params = this.selectedApiDataObj.input_params;
    }else{
      params = this.selectedApiDataObj.input_params;
    }   
   }else{
    params = this.selectedApiDataObj.input_params;
   }  
    if(this.navigatorActiveStage1){
      if(lodash.filter(lodash.values(params)).length == 0){
        Swal.fire({
          titleText: this.translate.instant('apiPersonalization.parametersValueArenotDefinedErrorMsgLbl'),
          showCancelButton: true,
          confirmButtonText: this.translate.instant('yes'),
          cancelButtonText: this.translate.instant('cancel'),        
          allowOutsideClick: false,
          allowEscapeKey: false,
          customClass: {
            cancelButton: 'buttonCssStyle',
            confirmButton: 'buttonCssStyle',
          },
        }).then((result) => {
          if(result.isConfirmed){
            if(isMergedTagOffersDrawerOpen) {
              this.updateMergeTagInjection(params);
            } else {
              this.insertRowConfirmationMethod(params,uuid);
            }
          }
        });
        
      }else{
        if(isMergedTagOffersDrawerOpen) {
          this.updateMergeTagInjection(params);
        } else {
          this.insertRowConfirmationMethod(params,uuid);
        }
      }
    }else{
      if(isMergedTagOffersDrawerOpen) {
        this.updateMergeTagInjection(params);
      } else {
        this.insertRowConfirmationMethod(params,uuid);
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
      name: this.selectedApiDataObj.apiName,
      type: 'API',
      maxCount: maxCountVal
    };
    this.onUpdateMergeTagInj.next({
      selectedMergeTagData: this.selectedMergeTagData
    });
    
    this.onClose();
  }

  insertRowConfirmationMethod(params,uuid){
    let parameterValues = JSON.stringify(params);
   let dynamicTemplateInsert:any;
   let jsonObject:any = {};
   let layout = this.chooseLayoutSavedDataObj.layout;
   if(this.chooseLayoutSavedDataObj.freeStyle){
    layout = 'layout0';
   }   
   if(this.multiArrayPath){
    if(this.selectedApiDataObj.apiType == 2){
      dynamicTemplateInsert = "<dynamic-content id='"+uuid+"' rowName='"+this.rowNameValue+"' type='api' layout='"+layout+"' parameterValues='"+parameterValues+"' apiType='" + this.selectedApiDataObj.apiType +"' apiName='" + this.selectedApiDataObj.apiName +"' freeStyle='" +this.chooseLayoutSavedDataObj.freeStyle+ "' maxCount='"+this.chooseLayoutSavedDataObj.maxCount+"' rowStyle=''>";
    }else{
      dynamicTemplateInsert = "<dynamic-content id='"+uuid+"' rowName='"+this.rowNameValue+"' type='api' layout='"+layout+"' parameterValues='"+parameterValues+"' apiName='" + this.selectedApiDataObj.apiName +"' freeStyle='" +this.chooseLayoutSavedDataObj.freeStyle+ "' maxCount='"+this.chooseLayoutSavedDataObj.maxCount+"' rowStyle=''>";
    }
    jsonObject = {
      "type": "api",
      "layout": this.chooseLayoutSavedDataObj.layout,
      "maxCount": this.chooseLayoutSavedDataObj.maxCount,
      "input_params": parameterValues,
      "apiName":this.selectedApiDataObj.apiName,
      "dbKey":this.chooseLayoutSavedDataObj.templateKey,
      "freeStyle":this.chooseLayoutSavedDataObj.freeStyle,
      "rowName": this.rowNameValue
    };
    if(this.selectedApiDataObj.apiType == 2){
      jsonObject['apiType'] = '2'
    }
   }else{
    if(this.selectedApiDataObj.apiType == '2'){
      dynamicTemplateInsert = "<dynamic-content id='"+uuid+"' rowName='"+this.rowNameValue+"' type='api' layout='layout0' maxCount='1' parameterValues='"+parameterValues+"' apiType='" + this.selectedApiDataObj.apiType +"' apiName='" + this.selectedApiDataObj.apiName + "' rowStyle='' layoutStyle='' sortAtrributes='{}' freeStyle='false'>";
    }else{
      dynamicTemplateInsert = "<dynamic-content id='"+uuid+"' rowName='"+this.rowNameValue+"' type='api' layout='layout0' maxCount='1' parameterValues='"+parameterValues+"' apiName='" + this.selectedApiDataObj.apiName + "' rowStyle='' layoutStyle='' sortAtrributes='{}' freeStyle='false'>";
    }
    jsonObject = {
      "type": "api",      
      "input_params": parameterValues,
      "apiName":this.selectedApiDataObj.apiName,
      "rowName": this.rowNameValue
    };
    if(this.selectedApiDataObj.apiType == 2){
      jsonObject['apiType'] = '2'
    }
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
           description: this.selectedApiDataObj.apiName,
           before:
           dynamicTemplateInsert,
           after: '</dynamic-content>',
         },
         metadata: { selectedValue: jsonString,id:uuid },
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
  showSelectedRowAgGrid(){
    setTimeout(() => {
      if(this.selectedApiDataObj !== undefined){
        this.shareService.selectedRowCheckedbox.next({name:this.selectedApiDataObj.apiName,blockName:'api',editMode:true});
      }
    },200);
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
        if(this.createSavedObj.apiName == resObj.apiName){
          this.selectedApiDataObj = this.createSavedObj;
          this.inputParamSelected = this.createSavedObj.input_params;
          this.viewParameterSectionEnabled = true;
        }else{
          let paramsObj = this.parseValIfObjOrStringMethod(resObj.input_params);;
          this.createSavedObj.layout = resObj.layout;  
          this.createSavedObj.maxCount = resObj.maxCount;
          this.createSavedObj.apiName = resObj.apiName;
          this.createSavedObj.type = resObj.createdFrom;
          this.createSavedObj.rowName = resObj.rowName;
          this.selectedApiDataObj = resObj;
          this.inputParamSelected = paramsObj;
          this.viewParameterSectionEnabled = true;
        }
        
      }else{
        if(isEdit){         
          let paramsObj = this.parseValIfObjOrStringMethod(resObj.input_params);
          this.createSavedObj.layout = resObj.layout;  
          this.createSavedObj.maxCount = resObj.maxCount;
          this.createSavedObj.apiName = resObj.apiName;
          this.createSavedObj.type = resObj.createdFrom;
          this.createSavedObj.rowName = resObj.rowName;
          this.selectedApiDataObj = resObj;
          this.inputParamSelected = paramsObj;
          this.selectedApiDataObj.input_params = this.inputParamSelected;
          this.viewParameterSectionEnabled = true;
        }
      }     
    }else{
      let paramsObj = this.parseValIfObjOrStringMethod(resObj.input_params);
      this.inputParamSelected = paramsObj;
      this.selectedApiDataObj = resObj;
      let newoBj = {};
      lodash.mapKeys(paramsObj, (value,key) => {
        if(value !== undefined){
          newoBj[key] = "";
        }
      });
      this.inputParamSelected = newoBj;
      this.selectedApiDataObj.input_params = newoBj;
      if(this.editModeEnabled){
        this.createSavedObj.input_params = this.inputParamSelected;
      }    
      this.viewParameterSectionEnabled = true;
    }
      
   
  }
  parseValIfObjOrStringMethod(ObjOrStr){
    let paramsObj;
    if(typeof(ObjOrStr) === 'object'){
      paramsObj = ObjOrStr;
    }else{
      paramsObj = JSON.parse(ObjOrStr);
    }
    return paramsObj;
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
