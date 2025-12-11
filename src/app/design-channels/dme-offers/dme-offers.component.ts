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
import { GlobalConstants } from '../common/globalConstants';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GetRowIdFunc, GetRowIdParams, ICellRendererParams } from 'ag-grid-community';
import { Options } from '@angular-slider/ngx-slider';
import { AppConstants } from '@app/app.constants';
import { RadioRowSelectionComponent } from '../recommendation-offers/radio-row-selection.component';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { CdkDragDropComponent } from '../cdk-drag-drop/cdk-drag-drop.component';
import { environment } from '@env/environment';
import { v4 as uuidv4 } from 'uuid';
import lodash from 'lodash';

@Component({
  selector: 'app-dme-offers',
  templateUrl: './dme-offers.component.html',
  styleUrls: ['./dme-offers.component.scss'],
})
export class DMEOffersComponent implements OnInit {
  @ViewChild('recoDiv', { static: false }) recoDiv!: ElementRef;
  @ViewChild('customLayoutAppendHtmlArea') customLayoutAppendHtmlArea!: ElementRef;
  @ViewChild('childProductArrtibuteComponent')
  childProductArrtibuteComponent!: CdkDragDropComponent;
  @Output() onAdd = new EventEmitter<any>();
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  @ViewChild('radioBtnClick') radioBtnClick!: ElementRef;
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

  navigatorActiveStage1: boolean = true;
  navigatorActiveStage2: boolean = true;
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
  selectedDMEModel: any;
  constructor(
    private bsModalRef: BsModalRef,
    private ref: ChangeDetectorRef,
    private httpService: HttpService,
    private dataService: DataService,
    private shareService: SharedataService,
    private translate: TranslateService
  ) {
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
        // cellRenderer: ({}) =>
        // `<input type="radio" id="radio_" #radioBtnClick class="form-input mt-2 radioBtnClick">`
        // },
        cellRenderer: RadioRowSelectionComponent,
        cellRendererParams: { context: this }
      },

      { field: 'modelName', headerName: this.translate.instant('DMEOffersComponent.modelNameColumnLbl'), maxWidth: 400, sortable: true, filter: false,tooltipField:'modelName'},
      { field: 'createdFrom', headerName: this.translate.instant('DMEOffersComponent.createdFromColumnLbl'), maxWidth: 300, sortable: true, filter: false },
      { field: 'segmentSize', headerName: this.translate.instant('DMEOffersComponent.segmentSizeColumnLbl'), maxWidth: 200, sortable: true, filter: false },
      /* { field: 'entityType', headerName: 'Entity Type', maxWidth: 200, sortable: true, filter: false },
      { field: 'frequency', headerName: 'Frequency', maxWidth: 200, sortable: true, filter: false },
      { field: 'createdBy', headerName: 'Created by', maxWidth: 200, sortable: true, filter: false }, */
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
    this.shareService.selectedRowCheckedbox.next({name:"",blockName:'dmeOffers',editMode:false})
    this.shareService.dmeOffersEditMode.subscribe((res:any) => {
      if(res !== undefined){ 
        if(res.selectedValue !== undefined ){
            //this.isNewDmeCustomerBlock = false;
            this.selectedDMEModel = res.selectedValue;
            this.editModeEnable = true;
            }
      }
    });    
      this.getDMEModelData();
  }

  // @HostListener('document:click', ['$event.target'])
  // clickout(event) {
  //   if (event.className.includes('radioGridSelected')) {
  //     var rowId = event.name;
  //     this.shareService.sendParamsFromRecoOffersDynamic.subscribe((res: any) => {
  //       if (res !== undefined && res.data !== undefined) {
  //         this.selectedRowData = res.data;
  //         this.shareService.selectedDmeInTemplate.next(this.selectedRowData);
  //         this.navigateToDesignPageEnable = false;
  //         //this.selectRecommendation(res.data);
  //       }
  //     });
  //     // this.selectRecommendation(event);
  //   }
  // }
  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    cellStyle: { outline: 'none', 'text-align': 'left' },
    //filter:true
  };
  public getRowId: GetRowIdFunc = (params: GetRowIdParams) => params.data.id;
  onChangeApiNames(params,isEdit) {
    if(isEdit){

    }else{
      if(params !== undefined && params.data !== undefined){
        this.selectedRowData = params.data;
        this.shareService.selectedDmeInTemplate.next(this.selectedRowData);
        this.navigateToDesignPageEnable = false;       
      }
    }     
   
  }
  // reset edit section
  resetEditSection(n: number): void {
    this.noOfReco = n;
    this.previewArr.length = n;
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
    this.modelDataListsArry = this.searchDataModels;
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

  insertDmeRow(): void {
    const uuid = uuidv4();
    this.isDoneClicked = true;
    let jsonObject:any;
    jsonObject = {
      "type": "dme",    
      "modelName":this.selectedRowData.modelName
    };
    let rowData = {
      0: {
        type: 'rowAddon',
        value: {
          name: 'Empty row',
          'background-color': '#ffffff',
          'display-condition': {
            type: 'dme',
            label: 'DME',
            description: this.selectedRowData.modelName,
            before: `<dynamic-content id='${uuid}' type="dme" modelName="` + this.selectedRowData.modelName + `" maxCount="1">`,
            after: '</dynamic-content>',
          },
          metadata: { selectedValue: jsonObject },
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
    this.onAdd.emit(this.myDataRowInsert);
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

  getDMEModelData() {
    let url = AppConstants.API_END_POINTS.GET_DME_MODEL_DATA;
    this.httpService.post(url).subscribe((data) => {
      if (data.status === 'SUCCESS') {
        this.showLoader = false;
        this.selectionRuleType = false;
        this.showActivityRulesGrid = true;

        let dmeResultData = JSON.parse(data.result);
        this.rowDataForPlacementTable = lodash.filter(dmeResultData, {entityType:1}); 
        this.modelDataListsArry = this.rowDataForPlacementTable;
        /* this.rowDataForPlacementTable = JSON.parse(data.result);
        this.modelDataListsArry = JSON.parse(data.result); */
         
        //this.rowDataForPlacementTable = this.sampleJsonToLoadContextData;
        //console.log(this.rowDataForPlacementTable);
        //console.log(JSON.parse(data.result));
        if(this.editModeEnable){
          this.swapSelectedModelTopMethod(this.selectedDMEModel);
          this.retainEditModeMethod(this.selectedDMEModel);
        }        
      }
    });
  }
  retainEditModeMethod(objSelected){
    if(objSelected !== undefined){
      this.shareService.selectedRowCheckedbox.next({name:objSelected.modelName,blockName:'dmeOffers',editMode:true});
    }    
  }
  swapSelectedModelTopMethod(editModel){
    let initialModel = this.modelDataListsArry[0];
    let swapModel = this.modelDataListsArry.filter(x => x.modelName == editModel.modelName);
    let indxModel = this.modelDataListsArry.findIndex(x => x.modelName == editModel.modelName);
    this.modelDataListsArry[0] = swapModel[0];
    this.modelDataListsArry[indxModel] = initialModel;
  }
  /* onImgError(event) { 
    event.target.src = this.BASE_URL_ANGULAR+'/assets/images/previewImg.png';
  } */
  }
