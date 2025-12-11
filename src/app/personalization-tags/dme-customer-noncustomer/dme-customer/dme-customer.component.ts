import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpService } from '@app/core/services/http.service';
import { DataService } from '@app/core/services/data.service';
import { SharedataService } from '@app/core/services/sharedata.service';
import { GlobalConstants } from '@app/design-channels/common/globalConstants';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';
import { Options } from '@angular-slider/ngx-slider';
import { AppConstants } from '@app/app.constants';
import { RadioRowSelectionComponent } from '@app/design-channels/recommendation-offers/radio-row-selection.component';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { CdkDragDropComponent } from '@app/design-channels/cdk-drag-drop/cdk-drag-drop.component';
import { environment } from '@env/environment';
import lodash from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { RandomNameService } from '@app/core/services/random-name.service';

@Component({
  selector: 'app-dme-customer',
  templateUrl: './dme-customer.component.html',
  styleUrls: ['./dme-customer.component.scss'],
})
export class DMECustomerComponent implements OnInit {

  @ViewChild('recoDiv', { static: false }) recoDiv!: ElementRef;
  @ViewChild('customLayoutAppendHtmlArea') customLayoutAppendHtmlArea!: ElementRef;
  @ViewChild('childProductArrtibuteComponent')
  childProductArrtibuteComponent!: CdkDragDropComponent;
  @Output() onAdd = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  @ViewChild('radioBtnClick') radioBtnClick!: ElementRef;
  @ViewChild('myAgGrid') agGridElementEvents!: ElementRef;
  
  editModeEnable: boolean = false;
  searchText: string = '';
  layout: string = 'layout2';
  previewArr: any[] = [1, 2, 3, 4];
  recommendationNodes: any[] = [];
  personalizationListArray: any[] = [];
  discoverListArray: any[] = [];
  combinedArray: any[] = [];
  recoType: string = 'All';
  showLoader: boolean = false;
  myjson: string = '';
  selectedReco: any;
  tempListArray: any[] = [];
  noResultFound: boolean = false;
  layoutArray: any[] = [];
  promotionKey: number = 0;
  currentSplitId: any;
  noOfReco: number = 4;
  templateKey: any;
  commChannelKey: any;
  widgetAttributes: any[] = [];
  placementId: any;
  tempWidgetCount: any;
  channelObj: any;
  tempRecoSelected: any = {};
  isDoneClicked: boolean = false;
  rowSelection: any = 'single';
  selectionRuleType: boolean = false;
  frameworkComponents: any = {};
  sliderOptions: Options = {
    floor: 1,
    showSelectionBar: true,
    ceil: AppConstants.PTAG_STATIC_DATA.defaultSelectedProduct,
  };
  sliderValue: any = 8;
  chooseLayoutType: any = 0;
  entityPanelDrawer: any = false;
  singleMultiCheckEnable:any = [];
  singleOrMultiVal: number = 0;
  multiArrayPath: boolean = false;
  recoArributesObj: any = {};
  chooseLayoutSavedDataObj: any = {};
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

  rowDataForPlacementTable: any = [];
  customLayoutEnabled: boolean = false;
  showActivityRulesGrid: boolean = true;
  noofRecoConfig: number[] = [];
  isNoofRecoLimit: any = 8;
  JSONInbuild = JSON;
  dataSetName: any;
  imgUrlCard: any;
  maxCountLayout: any = 0;
  pageTypeData: any = [];
  pageTypeWithCount: any = [];
  pageSelectedId: any;
  placementDataWithPageType: any = [];
  productAttributesArry: any = [];
  placementType: any = 'productReco';
  placementIdsArry: any = [];
  htmlCustom: any;
  typeDefObj: any;
  contextTypedropDown: boolean = true;
  selectedRowData: any;
  myDataRowInsert: any;
  searchDataModels: any;
  modelDataListsArry: any = [];
  entityTypeVal: any;
  navigateToDesignPageEnable: boolean = false;
  navigatorActiveStage1: boolean = true;
  navigatorActiveStage2: boolean = false;
  checkmarkEnable1: boolean = false;
  checkmarkEnable2: boolean = false;
  viewParameterSectionEnabled: boolean = false;
  selectedDmeDataObj: any;
  inputParamSelected: any;
  blockNameLoadedFor:any = 'dme';
  savedHtmlContent: any;
  createSavedObj: any = {};
  editModeEnabled: boolean = false;
  isNewDmeCustomerBlock: boolean = true;
  modelNameSelectedForLayoutPg: any;
  selectedDMEuuid: any;
  isPublishedPersonalization: boolean = false;
  isRowEditModeEnable: boolean = false;
  rowNameValue: string = "";

  constructor(
    private bsModalRef: BsModalRef,
    private ref: ChangeDetectorRef,
    private httpService: HttpService,
    private dataService: DataService,
    private shareService: SharedataService,
    private translate: TranslateService,
    private randomNameService: RandomNameService
  ) {
    this.singleMultiCheckEnable = [{id:0,name:this.translate.instant('customerNonCustomerDMEComponents.singleRowLbl'),singleVal:0,checked:true},{id:1,name:this.translate.instant('customerNonCustomerDMEComponents.multiRowLbl'),singleVal:1,checked:false},];
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
    this.noofRecoConfig = AppConstants.PTAG_STATIC_DATA.noOfProductConfig;
    ref.detach();
    setInterval(() => {
      this.ref.detectChanges();
    }, 100);
    this.dataService.$sharedPromoKey.subscribe((result) => {
      this.promotionKey = result;
    });
    this.shareService.currentSelectedChannelObj.subscribe((res: any) => {
      this.currentSplitId = res.currentSplitId;
      this.commChannelKey = res.commChannelKey;
    });
    this.viewParameterSectionEnabled = false;
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

    //         if(dynamicContentArray.length > 0){
    //           dynamicContentArray.forEach((ele,i) => {
    //             let currtBlockType = ele.getAttribute('type');
    //             let currtBlckid = ele.getAttribute('id');
    //             //let filterByModelName = ele.getAttribute('modelname');
    //             if(currtBlockType === this.blockNameLoadedFor && this.selectedDMEuuid === currtBlckid){
    //               if(!this.isNewDmeCustomerBlock){ // Saved DME
    //                 this.getEditObjMethod(ele);    
    //                 this.viewParameterSectionEnabled = true;
    //               }                           
    //             }                
    //           });                     
              
    //         }                
    //     }        
    //   }
    // });
    this.getDMEModelData();
  }
  
  editModeDataMethod(dataObj){
    this.getEditObjMethodnew(dataObj);    
    //this.viewParameterSectionEnabled = true;
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
  getEditObjMethodnew(resObj){
    let isModelExist = this.modelDataListsArry.find(x => x.modelName == resObj.modelName);
      if(isModelExist !== undefined){    
      this.swapSelectedModelTopMethod(resObj);
      this.createSavedObj.modelName = resObj.modelName;
      this.createSavedObj.type = resObj.type;
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
      //this.inputParamSelected = this.createSavedObj.parameterValues;
      this.selectedDmeDataObj = this.createSavedObj;
      if(!this.isNewDmeCustomerBlock){
        this.shareService.selectedRowCheckedbox.next({name:this.createSavedObj.modelName,blockName:'dmeCustomer',editMode:true});
      }  
      this.viewParameterSectionEnabled = true;
    }else{
      // ---- when DataModel not exist in the list option, if name updated or deleted.
      this.shareService.selectedRowCheckedbox.next({name:"",blockName:'dmeCustomer',editMode:false});
      this.viewParameterSectionEnabled = false;
    }
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
  this.shareService.selectedRowCheckedbox.next({name:this.createSavedObj.modelName,blockName:'dmeCustomer',editMode:true});
  if(this.createSavedObj.maxCount !== null){
    this.singleMultiCheckMethod(1);
  }else{
    this.singleMultiCheckMethod(0);
  }
  }
  loadDmeCustomerSelectedMethod(){
    this.shareService.isDMECustomerEditMode.subscribe((res:any) => {
      if(GlobalConstants.isRowEditModeEnable) {
        this.isRowEditModeEnable = true;
      } else {
        this.isRowEditModeEnable = false;
      }
      if(res != undefined) {
        if(Object.keys(res).length > 0){ 
          if(res.selectedValue !== undefined ){
              this.isNewDmeCustomerBlock = false;
              let selectedValParams = JSON.parse(res.selectedValue);
              this.editModeEnable = true;
              this.editModeDataMethod(selectedValParams);        
          }else{
            this.isNewDmeCustomerBlock = true;
            this.editModeEnable = false;
            this.clearSelectionRowMethod();
          }
          this.selectedDMEuuid = res?.id;
        }else{
          this.isNewDmeCustomerBlock = true;
            this.editModeEnable = false;
            this.clearSelectionRowMethod();
        }
      }else{
        this.isNewDmeCustomerBlock = true;
        this.editModeEnable = false;
        this.shareService.selectedRowCheckedbox.next({name:"",blockName:'dmeCustomer',editMode:false});
      }
       
    });    
  }
  
  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    cellStyle: { outline: 'none', 'text-align': 'left' },
    //filter:true
  };
  public getRowId: GetRowIdFunc = (params: GetRowIdParams) => params.data.id;
  // reset edit section
  resetEditSection(n: number): void {
    this.noOfReco = n;
    this.previewArr.length = n;
  }
  redirectToLayoutPage(evt){
      this.navigatorActiveStage1 = false;
      this.navigatorActiveStage2 = true;
      this.checkmarkEnable1 = true;
      this.checkmarkEnable2 = false; 
      setTimeout(() => {
        this.blockNameLoadedFor = 'dme'; 
        this.modelNameSelectedForLayoutPg = this.selectedDmeDataObj.modelName;
      }, 100); 

  }
  agGridapiMethod(paramsNode){
    this.agGrid = paramsNode;
  }
  onChangeApiNames(params,isEdit) {
    //this.gridApi = gridApinode;
    let resObj = params.data;
    if(isEdit){

      if(this.editModeEnable){   
        if(this.createSavedObj.modelName == resObj.modelName){
          this.selectedDmeDataObj = this.createSavedObj;
          this.viewParameterSectionEnabled = true;
        }else{
          this.createSavedObj.layout = resObj.layout;  
          this.createSavedObj.maxCount = resObj.maxCount;
          this.createSavedObj.modelName = resObj.modelName;
          this.createSavedObj.type = resObj.createdFrom;
          this.selectedDmeDataObj = resObj;
          this.viewParameterSectionEnabled = true;
        }
        
      }else{
        this.createSavedObj.layout = resObj.layout;  
        this.createSavedObj.maxCount = resObj.maxCount;
        this.createSavedObj.modelName = resObj.modelName;
        this.createSavedObj.type = resObj.createdFrom;
        this.selectedDmeDataObj = resObj;
        this.viewParameterSectionEnabled = true;
      }      
    }else{
      //this.inputParamSelected = JSON.parse(resObj.input_params);;
      const rowName = this.createSavedObj?.rowName || "";
      this.selectedDmeDataObj = this.createSavedObj = resObj;
      this.createSavedObj.rowName = this.selectedDmeDataObj.rowName = rowName;
      this.viewParameterSectionEnabled = true;

    }
      
   
  }
  backToGridPage(evt){
    this.navigatorActiveStage1 = true;
    this.navigatorActiveStage2 = false;
    this.checkmarkEnable1 = false;
    this.checkmarkEnable2 = false;    
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
      this.singleOrMultiVal = 0;
      
    }else{ // multi object
      this.singleMultiCheckEnable[1].checked = true;
      this.singleMultiCheckEnable[0].checked = false;
      this.multiArrayPath = true;
      this.singleOrMultiVal = 1;
          
    }    
    
  }
  clearSelectionRowMethod(){
    this.shareService.selectedRowCheckedbox.next({name:"",blockName:'dmeCustomer',editMode:false});
    this.viewParameterSectionEnabled = false;
  }
  searchByModelName(evt) {
    let strVal;
    if (evt.target !== undefined) {
      strVal = evt.target.value;
    } else {
      strVal = evt;
    }
    this.searchDataModels = this.rowDataForPlacementTable.filter((item) => {
      return item.modelName.toLowerCase().indexOf(strVal.toLowerCase().trim()) > -1;
    });
    this.modelDataListsArry = [];

    this.selectedModelToShowMethod(this.searchDataModels);
  }
  selectedModelToShowMethod(modelListArry){
    setTimeout(() => {
      this.modelDataListsArry = modelListArry;  
      this.shareService.selectedRowCheckedbox.next({name:this.selectedDmeDataObj.modelName,blockName:'dmeCustomer',editMode:true});
    }, 200);
  }
  showSelectedRowAgGrid(){
    setTimeout(() => {
      if(this.selectedDmeDataObj !== undefined){
        this.shareService.selectedRowCheckedbox.next({name:this.selectedDmeDataObj.modelName,blockName:'dmeCustomer',editMode:true});
      }
    },100);
  } 
   paginationChangeMethod(evtObj){
    if(evtObj.newPage){
      this.showSelectedRowAgGrid();
    }
  }
  insertData(): void {
    let type: string;
    if (this.selectedReco.recoType == '1') {
      type = 'RO';
    } else if (this.selectedReco.recoType == '2') {
      type = 'RP';
    } else {
      type = 'SO';
    }
  }

  
  insertDmeCustomerRow(): void {
    let uuid = uuidv4();
    this.rowNameValue = this.randomNameService.generateRandomName("rowName-");
    this.selectedDmeDataObj.rowName = this.createSavedObj.rowName;
    if(this.isRowEditModeEnable) {
      uuid = this.selectedDMEuuid;
      this.rowNameValue = this.selectedDmeDataObj.rowName;
    }
    GlobalConstants.existingRowLabels[uuid] = this.rowNameValue;
    this.isDoneClicked = true;    
    const params = this.selectedRowData;    
    let dynamicTemplateInsert:any;
    let parameterValues = params;
    let jsonObject:any;
    let layout = this.chooseLayoutSavedDataObj.layout;
    if(this.chooseLayoutSavedDataObj.freeStyle){
      layout = 'layout0';
    }
   if(this.multiArrayPath){
    dynamicTemplateInsert = "<dynamic-content id='"+uuid+"' rowName='"+this.rowNameValue+"' type='dme' layout='"+layout+"' rowStyle='' layoutStyle='' modelName='" + this.selectedDmeDataObj.modelNameHash + "' modelDisplayName='" + this.selectedDmeDataObj.modelName + "' freeStyle='" +this.chooseLayoutSavedDataObj.freeStyle + "' maxCount='"+this.chooseLayoutSavedDataObj.maxCount+"' data-isDmeBlock='1'>";
    jsonObject = {
      "type": "dme",
      "layout": this.chooseLayoutSavedDataObj.layout,
      "maxCount": this.chooseLayoutSavedDataObj.maxCount,
      "modelName":this.selectedDmeDataObj.modelName,
      "modelNameHash":this.selectedDmeDataObj.modelNameHash,
      "dbKey":this.chooseLayoutSavedDataObj.templateKey,
      "rowName": this.rowNameValue,
      "modelId":this.selectedDmeDataObj.id
    };
   }else{ 
    dynamicTemplateInsert = "<dynamic-content id='"+uuid+"' rowName='"+this.rowNameValue+"' type='dme' layout='layout0' maxCount='1' modelName='" + this.selectedDmeDataObj.modelNameHash + "' modelDisplayName='" + this.selectedDmeDataObj.modelName + "' data-isDmeBlock='1'>";
    jsonObject = {
      "type": "dme",    
      "modelName":this.selectedDmeDataObj.modelName,
      "modelNameHash":this.selectedDmeDataObj.modelNameHash,
      "rowName": this.rowNameValue,
      "modelId":this.selectedDmeDataObj.id
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

  onClose(): void {
    if (this.bsModalRef !== undefined) {
      this.bsModalRef.hide();
    }
  }

  ngOnInit(): void {
    this.showLoader = true;
    this.tempWidgetCount = GlobalConstants.rrWidgetCount;
    this.shareService.selectedDmeInTemplate.next([]);
  }
  collectDataFromLayoutTemplate(layoutData){
       this.chooseLayoutSavedDataObj = layoutData; 
  }
  getDMEModelData() {
    let url = AppConstants.API_END_POINTS.GET_DME_MODEL_DATA;
    this.httpService.post(url).subscribe((data) => {
      if (data.status === 'SUCCESS') {
        this.showLoader = false;
        this.selectionRuleType = false;
        this.showActivityRulesGrid = true;
        let dataRes = JSON.parse(data.result);
        let filterModelNonCustomerDME = lodash.filter(dataRes, {entityType:1});        
        this.rowDataForPlacementTable = filterModelNonCustomerDME;
        this.modelDataListsArry = filterModelNonCustomerDME;
        //this.rowDataForPlacementTable = this.sampleJsonToLoadContextData;
        //console.log(this.rowDataForPlacementTable);
       // console.log(JSON.parse(data.result));
       this.loadDmeCustomerSelectedMethod();
      }
    });
  }
  /* onImgError(event) { 
    event.target.src = this.BASE_URL_ANGULAR+'/assets/images/previewImg.png';
  } */
}
