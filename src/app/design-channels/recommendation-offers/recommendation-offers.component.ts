import { Component, OnInit, Output, Input, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef, HostListener, Renderer2} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpService } from '@app/core/services/http.service';
import { DataService } from '@app/core/services/data.service';
import { SharedataService } from '@app/core/services/sharedata.service';
import { GlobalConstants } from '../common/globalConstants';
import { AgGridAngular } from "ag-grid-angular";
import { ColDef, GetRowIdFunc, GetRowIdParams, ICellRendererParams } from 'ag-grid-community';
import { Options } from '@angular-slider/ngx-slider';
import { AppConstants } from '@app/app.constants';
import { RadioRowSelectionComponent } from './radio-row-selection.component';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { CdkDragDropComponent } from '../cdk-drag-drop/cdk-drag-drop.component';
import { environment } from '@env/environment';
import { ProductRecoAdvanceComponent } from '../product-reco-advance/product-reco-advance.component';
import { v4 as uuidv4 } from 'uuid';
import { RandomNameService } from '@app/core/services/random-name.service';

@Component({
  selector: 'app-recommendation-offers',
  templateUrl: './recommendation-offers.component.html',
  styleUrls: ['./recommendation-offers.component.scss'],
})
export class RecommendationOffersComponent implements OnInit {
  @ViewChild('recoDiv', { static: false }) recoDiv!: ElementRef;
  @ViewChild('customLayoutAppendHtmlArea') customLayoutAppendHtmlArea!: ElementRef;
  @ViewChild('parentProductElement', { static: false }) parentProductElement!: ElementRef;
  @ViewChild('childProductArrtibuteComponent')
  childProductArrtibuteComponent!: CdkDragDropComponent;
  @Output() onAdd = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  @ViewChild('radioBtnClick') radioBtnClick!: ElementRef;
  @ViewChild('productPageAdvance') productPageAdvance!: ProductRecoAdvanceComponent;
  editModeEnable: boolean = false;
  searchText: string = '';
  layout: string = 'layout1';
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
  templateKey: any = 1;
  layoutIndex: any = 0;
  commChannelKey: any;
  widgetAttributes: any[] = [];
  placementId: any;
  tempWidgetCount: any;
  channelObj: any;
  tempRecoSelected: any = {};
  isDoneClicked: boolean = false;
  rowSelection: any = 'single';
  frameworkComponents: any = {};
  sliderOptions: Options = {
    floor: 1,
    showSelectionBar: true,
    ceil: AppConstants.PTAG_STATIC_DATA.defaultSelectedProduct,
  };
  sliderValue: any = AppConstants.PTAG_STATIC_DATA.defaultSelectedProduct;
  chooseLayoutType: any = 0;
  tagKey: any;
  agGridLocaleLabels: any = {
    to: "",
    of: "",
    page: "",
    noRowsToShow: "",
  };
  public localeText: {
    [key: string]: any;
  } = this.agGridLocaleLabels;
  columnHeadersRuleReco: ColDef[] = [];
  rowDataForPlacementTable: any = [];
  customLayoutEnabled: boolean = false;
  // rowDataForPlacementTable :any = [
  //   { checkbox:"1",
  //   placementId: "Jan_promo",
  //   placementDesc: "Jan promotion",

  //     },
  //     { checkbox:"2",
  //     placementId: "Jan_promo",
  //     placementDesc: "Jan promotion",

  //     },
  //     { checkbox:"3",
  //   ruleName: "Jan_promo",
  //   datasetName: "Jan promotion",

  //     },

  // ]
  showActivityRulesGrid: boolean = false;
  noofRecoConfig: number = AppConstants.PTAG_STATIC_DATA.defaultSelectedProduct;
  JSONInbuild = JSON;
  dataSetName: any;
  imgUrlCard: any;
  maxCountLayout: any = 0;
  pageTypeData: any = [];
  pageTypeWithCount: any = [];
  pageSelectedId: any;
  placementDataWithPageType: any = [];
  placementType: any = 'productReco';
  placementIdsArry: any = [];
  htmlCustom: any;
  contextFlagToShowPersonalization: boolean = false;
  typeDefObj: any;
  enablePresonlize: boolean = false;
  prebuildBindAttributesObj: any = {};
  productPreBuildAttrObj: any = {};
  prodCode: any;
  prodDesc: any;
  prodImg: any;
  productContentDialogId: any;
  settingsPanelDrawer: boolean = true;
  layoutPanelDrawer: boolean = true;
  baseUrl: any = environment.BASE_URL;
  pageTypeSelected: any;
  isProductOffersEnabled: boolean = false;
  navigatorActiveStage1: boolean = true;
  navigatorActiveStage2: boolean = false;
  navigatorActiveStage3: boolean = false;
  emailPageData: any;
  advancePageEnabled: boolean = false;
  checkmarkEnable1: boolean = false;
  checkmarkEnable2: boolean = false;
  enableFooterBtns: boolean = false;
  selctedDataJsonObj: any;
  selectedActiveRow: boolean = false;
  searchDataModels: any;
  modelDataListsArry: any = [];
  isBasicSelected: any;
  basicAdvaceVal: any;
  basicDataSavingJson: any = {};
  myDataRowInsert: any;
  advanceDataSavingJsonObj: any = {};
  advanceSavedDataObj: any = {};

  layoutName: any = '';
  layoutJson: any = [];
  layout1Content: any;
  layoutHtmlHeader: any;
  layoutHtmlFooter: any;
  selectedLayoutJSON: any = {};
  navigatorActiveFinalStage3: boolean = false;
  advanceStage2: boolean = false;
  isPersonalizeTagMode: boolean = false;
  browseActiveStage: boolean = false;
  productRecoPageLoadedEnabled: boolean = false;
  selectedProdRecoObj: object = {};
  isPublishedPersonalization: boolean = false;
  isRowEditModeEnable: boolean = false;
  selectedRecoOfferUUID: any;
  rowNameValue:string = "";

  constructor(
    private bsModalRef: BsModalRef,
    private ref: ChangeDetectorRef,
    private httpService: HttpService,
    private dataService: DataService,
    private shareService: SharedataService,
    private translate: TranslateService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private randomNameService: RandomNameService
  ) {

    this.agGridLocaleLabels = {
      to: this.translate.instant('agGridLocaleLabels.to'),
      of: this.translate.instant('agGridLocaleLabels.of'),
      page: this.translate.instant('agGridLocaleLabels.page'),
      noRowsToShow: this.translate.instant('agGridLocaleLabels.noRowsToShow'),
    };

    this.columnHeadersRuleReco = [{
        field: 'checkbox',
        headerName: '',
        maxWidth: 50,
        cellStyle: { 'text-align': 'center' },
        // cellRenderer: ({}) =>
        // `<input type="radio" id="radio_" #radioBtnClick class="form-input mt-2 radioBtnClick">`
        // },
        cellRenderer: RadioRowSelectionComponent,
        cellRendererParams: { context: this },
      },

      {
        field: 'placementName',
        headerName: this.translate.instant('recommendationComponent.placementsLbl'),
        maxWidth: 400,
        tooltipField: 'placementName',
      },
      {
        field: 'placementDesc',
        headerName: this.translate.instant('recommendationComponent.placementDescLbl'),
        maxWidth: 400,
        tooltipField: 'placementDesc',
      },
    ];

    this.tagKey = this.dataService.activeContentTagKey; //localStorage.getItem('tagKeyPersonalization');
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
    this.shareService.personalizeTagService.subscribe((result) => {
      this.isPersonalizeTagMode = result;
    });
    this.shareService.addOnContentDialogId.subscribe((res: any) => {
      if (res != '') {
        this.productContentDialogId = res;
      }
    });
    this.shareService.isPublishEnabledForPersonalization.subscribe((res) => {
      if (res !== undefined) {
        this.isPublishedPersonalization = res;
      }
    });
    this.shareService.selectedRowCheckedbox.next({ name: '', blockName: 'productReco', editMode: false });

    this.shareService.isRecomendationOfferEditMode.subscribe((res: any) => {
      if (GlobalConstants.isRowEditModeEnable) {
        this.isRowEditModeEnable = true;
      } else {
        this.isRowEditModeEnable = false;
      }

      const hasRes = res && Object.keys(res).length > 0;
      this.editModeEnable = hasRes;
      this.selectedProdRecoObj = hasRes ? JSON.parse(res.selectedValue) : {};
      this.selctedDataJsonObj = this.selectedProdRecoObj;
    });
    //  this.shareService.sendParamsFromRecoOffersDynamic.subscribe((res:any) => {
    //   if(res !== undefined && res.data !== undefined){
    //     //this.selectRecommendation(res.data);
    //     this.selctedDataJsonObj = res.data;
    //     this.selectedActiveRow = true;
    //   }
    //  });
    this.getpreBuildBindingAttrData();
    if (this.productContentDialogId != '') {
      if (this.productContentDialogId == 'rule-offer') {
        // Product offer
        this.isProductOffersEnabled = true;
        this.selectRecommendation({});
      } else {
        // Production Recomendation
        this.isProductOffersEnabled = false;
      }
    }
  }

  customProductLayout() {
    this.layout = 'customDesign';
    //console.log(evt);
  }
  // @HostListener('document:click', ['$event.target'])
  //     clickout(event) {
  //       if(event.className.includes('radioGridSelected')){
  //        var rowId = event.name;
  //       //  this.shareService.sendParamsFromRecoOffersDynamic.subscribe((res:any) => {
  //       //   if(res !== undefined && res.data !== undefined){
  //       //     //this.selectRecommendation(res.data);
  //       //     this.selctedDataJsonObj = res.data;
  //       //     this.selectedActiveRow = true;
  //       //   }
  //       //  });
  //       // this.selectRecommendation(event);
  //       }
  // }
  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    cellStyle: { outline: 'none', 'text-align': 'left' },
    //filter:true
  };
  public getRowId: GetRowIdFunc = (params: GetRowIdParams) => params.data.id;
  onChangeApiNames(params, isEdit) {
    if (isEdit) {
      this.selectedActiveRow = true;
    } else {
      if (this.isRowEditModeEnable) {
        this.selectedActiveRow = true;
        this.selctedDataJsonObj.placementName = params.data.placementName;
        this.selctedDataJsonObj.ruleName = params.data.placementName;
        this.selctedDataJsonObj.dataSet = params.data.placementName;
      } else {
        if (params !== undefined && params.data !== undefined) {
          //this.selectRecommendation(res.data);
          if (this.editModeEnable && params.data.placementName != this.selctedDataJsonObj.placementName) {
            this.selctedDataJsonObj = params.data;
            this.selectedActiveRow = true;
            this.layout = 'layout1';
            this.templateKey = 1;
            this.layoutIndex = 0;
            this.sliderValue = AppConstants.PTAG_STATIC_DATA.defaultSelectedProduct;
          } else {
            this.selctedDataJsonObj = params.data;
            this.selectedActiveRow = true;
          }
        }
      }
    }
  }
  getpreBuildBindingAttrData() {
    let url: any;
    if (this.isPersonalizeTagMode) {
      url = AppConstants.API_END_POINTS.GET_PRODUCT_RECO_PREBUILD + '0&recoType=4';
    } else {
      url = AppConstants.API_END_POINTS.GET_PRODUCT_RECO_PREBUILD + this.commChannelKey + '&recoType=4';
    }
    this.httpService.post(url).subscribe((data) => {
      if (data.status === 'SUCCESS') {
        this.prebuildBindAttributesObj = data.response;
        this.dataSetApiCall();
        //console.log(data.response);
      }
    });
  }

  dataSetApiCall() {
    this.showLoader = true;
    let url: any;
    if (this.isPersonalizeTagMode) {
      url = AppConstants.API_PERSONSOALIZATION_TAGS_END_POINTS.GET_All_PERSONALIZATION_PLACEMENTS + this.tagKey;
    } else {
      url = AppConstants.API_END_POINTS.GET_All_PLACEMENTS_PAGE_TYPE + this.promotionKey;
    }
    this.httpService.post(url).subscribe((data) => {
      if (data.status === 'SUCCESS') {
        this.showLoader = false;
        this.placementDataWithPageType = JSON.parse(data.response.placement);
        this.rowDataForPlacementTable = JSON.parse(data.response.placement);
        //this.modelDataListsArry = JSON.parse(data.response.placement);

        this.pageTypeData = JSON.parse(data.response.pageType);
        this.contextFlagToShowPersonalization = data.response.contextFlg;
        this.typeDefObj = data.response.typeDef;

        // this.pageTypeData.forEach(item => {
        //   var pageCount = this.rowDataForPlacementTable[item].length;
        //   // if(item == 'email_page'){
        //   //   this.emailPageData = this.rowDataForPlacementTable[item];
        //   // }
        //   var obj = {"pageName":item,"pageCount":pageCount}
        //   this.pageTypeWithCount.push(obj);
        // });

        this.pageTypeMethod(this.pageTypeData[0]);
        this.emailPageData = this.rowDataForPlacementTable[this.pageTypeData[0]];
        this.modelDataListsArry = this.emailPageData;

        //this.pageSelectedId = this.pageTypeData[0];
        //this.selectLayout('layout1',0);
        // this.selectionRuleType = false;
        this.showActivityRulesGrid = true;
        // setTimeout(() => {
        this.enableFooterBtns = true;
        // }, 500);
        //console.log(this.rowDataForPlacementTable);
        if (this.editModeEnable) {
          if (this.selctedDataJsonObj.basicEnable !== undefined) {
            this.basicAdvaceVal = {};
            this.basicAdvaceVal.basic = this.selctedDataJsonObj.basicEnable;
          } else {
            this.basicAdvaceVal = {};
            this.basicAdvaceVal.advance = this.selctedDataJsonObj.advanceEnable;
          }

          //this.switchToAdvancePage(2);
          this.onEditCallLoadLayoutPage(this.selectedProdRecoObj);
        }
      }
    });
  }
  onEditCallLoadLayoutPage(editObj) {
    this.selectRecommendation(editObj);
  }
  pageTypeMethod(pageType) {
    // this.rowDataForPlacementTable = this.placementDataWithPageType[pageType];
    this.pageSelectedId = pageType;
    if (this.rowDataForPlacementTable[pageType].length > 0) {
      this.rowDataForPlacementTable[pageType].forEach((element: any, i) => {
        element['id'] = i + 1;
      });
    }
  }
  getPageDataOnChange(pageName) {
    this.pageTypeMethod(pageName);
  }
  selectRuleTypeDropdown(evt) {
    let selectTypeVal;
    if (evt.target.value === undefined) {
      selectTypeVal = evt;
    } else {
      selectTypeVal = evt.target.value;
    }
    if (selectTypeVal === '1') {
      //this.selectionRuleType = false;
      this.showActivityRulesGrid = true;
    }
  }
  navigateStage1() {
    this.advancePageEnabled = false;
    this.checkmarkEnable1 = false;
    this.checkmarkEnable2 = false;
    GlobalConstants.browseProdActiveEnable = false;
    this.navigatorActiveStage1 = true;
    this.navigatorActiveStage2 = false;
    this.navigatorActiveStage3 = false;
    this.selectedActiveRow = false;
    if (this.editModeEnable && Object.keys(this.selctedDataJsonObj).length > 0) {
      this.shareService.selectedRowCheckedbox.next({
        name: this.selctedDataJsonObj.placementName,
        blockName: 'productReco',
        editMode: true,
      });
    }
  }
  navigateStage2() {
    this.advancePageEnabled = true;
    this.checkmarkEnable1 = true;
    this.checkmarkEnable2 = false;
    GlobalConstants.browseProdActiveEnable = false;
    this.navigatorActiveStage1 = false;
    this.navigatorActiveStage2 = true;
    this.navigatorActiveStage3 = false;
    this.navigatorActiveFinalStage3 = false;
    this.advanceStage2 = false;
    if (this.productPageAdvance !== undefined) {
      this.productRecoPageLoadedEnabled = true;
      this.productPageAdvance.advanceChecked = false;
      this.productPageAdvance.basicChecked = true;
      this.productPageAdvance.basicAdvanceEnabled = true;
      this.productPageAdvance.advanceDetailsPage = false;
      this.basicAdvaceVal.basic = true;
    }
    if (this.editModeEnable) {
      if (this.selctedDataJsonObj.advanceEnable) {
        GlobalConstants.browseProdActiveEnable = true;
        setTimeout(() => {
          this.productPageAdvance.basicChecked = false;
          this.productPageAdvance.advanceChecked = true;
          //this.productPageAdvance.advanceDetailsPage =true;
          this.basicAdvaceVal.basic = false;
        }, 500);
      } else {
        //GlobalConstants.browseProdActiveEnable = false;
      }
      this.dataService.prodRecoSelectedModelObj.next(this.selctedDataJsonObj);
    }
  }
  navigateStage3() {
    this.insertRecommendation();
  }
  switchToAdvancePage(navPage) {
    if (navPage === 1) {
      this.advancePageEnabled = false;
      this.checkmarkEnable1 = true;
      this.checkmarkEnable2 = false;
      GlobalConstants.browseProdActiveEnable = false;
      this.navigatorActiveStage1 = false;
      this.navigatorActiveStage2 = true;
      this.navigatorActiveStage3 = false;
      this.advanceStage2 = false;
      if (this.selctedDataJsonObj.advanceEnable) {
        //GlobalConstants.browseProdActiveEnable = true;
        setTimeout(() => {
          GlobalConstants.browseProdActiveEnable = false;
          this.advanceStage2 = true;
          this.productPageAdvance.basicChecked = false;
          this.basicAdvaceVal.basic = false;
          this.productPageAdvance.advanceChecked = true;
        }, 500);
      }
    } else if (navPage === 2) {
      if (this.basicAdvaceVal.basic) {
        this.advancePageEnabled = false;
        this.checkmarkEnable1 = true;
        this.checkmarkEnable2 = true;
        GlobalConstants.browseProdActiveEnable = false;
        this.navigatorActiveStage1 = false;
        this.navigatorActiveStage2 = true;
        this.navigatorActiveStage3 = true;
        this.navigatorActiveFinalStage3 = false;
        this.advanceStage2 = false;
        this.selectRecommendation(this.selctedDataJsonObj);
        //this.productRecoAdvance.getMergeTagData();
      } else {
        this.advancePageEnabled = true;
        this.checkmarkEnable1 = true;
        this.checkmarkEnable2 = true;
        this.navigatorActiveStage1 = false;
        this.navigatorActiveStage2 = true;
        GlobalConstants.browseProdActiveEnable = false;
        this.advanceStage2 = true;
        if (this.productPageAdvance !== undefined) {
          if (this.productPageAdvance.advanceChecked) {
            this.productPageAdvance.basicAdvanceEnabled = false;
            this.productPageAdvance.advanceDetailsPage = true;
          } else {
            this.productPageAdvance.basicAdvanceEnabled = true;
            this.productPageAdvance.advanceDetailsPage = false;
          }
          this.productPageAdvance.showContentAgGrid = false;
          //this.productPageAdvance.getMergeTagData();
        }
        if (this.productPageAdvance.advanceDetailsPage) {
          this.productPageAdvance.getMergeTagData();
          this.navigatorActiveFinalStage3 = true;
        } else if (this.navigatorActiveFinalStage3) {
          this.productPageAdvance.advanceDetailsPage = false;
          this.navigatorActiveStage3 = true;
          this.selectRecommendation(this.selctedDataJsonObj);
        }

        // this.callMergeTagMethod.emit(true);
        //this.shareService.callGetMergeTagMethod.next(true);
        //this.selectRecommendation(this.selctedDataJsonObj);
      }
    } else if (navPage === 3) {
      GlobalConstants.browseProdActiveEnable = false;
      this.navigatorActiveStage3 = true;
      this.navigatorActiveFinalStage3 = true;
      this.productPageAdvance.collectDataForAdvance();
      this.selectRecommendation(this.selctedDataJsonObj);
      if (this.productPageAdvance.advanceDetailsPage) {
        this.advancePageEnabled = true;
      } else {
        this.advancePageEnabled = false;
      }
      // this.advancePageEnabled = false;
      // this.checkmarkEnable1 =  true;
      // this.checkmarkEnable2 =  true;
      // this.navigatorActiveStage1 = false;
      // this.navigatorActiveStage2 = false;
      // this.navigatorActiveStage3 = true;
    } else if (navPage === 4) {
      GlobalConstants.browseProdActiveEnable = false;
      this.navigateStage3();
    }
  }

  // this function is not in use currently
  getRecommendationList(): void {
    this.httpService.post(AppConstants.API_END_POINTS.GET_RECOMMENDATION_OBJ).subscribe((data) => {
      this.showLoader = false;
      this.recommendationNodes = data.nodes;

      // todo Logic
      for (let x of this.recommendationNodes) {
        for (let y of x.nodes) {
          y.nodeType = x.name;
          for (let z of y.aliasValueMap.map) {
            if (z.name === 'pageType') {
              y.pageType = z.valueData[0];
            }
            if (z.name === 'placement') {
              y.placement = z.valueData[0];
            }
            if (z.name === 'backfillOffers') {
              y.backfillOffers = z.valueData[0];
            }
            if (z.name === 'recoType') {
              y.recoType = z.valueData[0];
            }
          }
        }
      }

      this.personalizationListArray = this.recommendationNodes[0].nodes;
      this.discoverListArray = this.recommendationNodes[0].nodes;
      this.combinedArray = this.personalizationListArray.concat(this.discoverListArray);
      this.tempListArray = this.combinedArray;
      this.searchText = '';
      if (this.tempListArray.length === 0) {
        this.noResultFound = true;
      } else {
        this.noResultFound = false;
      }
    });
  }

  // reset recommendation
  resetcommendation(): void {
    this.recoType = 'All';
    this.searchText = '';
    this.tempListArray = this.combinedArray;
    this.noResultFound = false;
  }

  // reset edit section
  resetEditSection(n: number): void {
    this.noOfReco = n;
    this.previewArr.length = n;
  }
  selectRecommendation(recoItem: any): void {
    this.editModeEnable = true;
    this.selectedReco = recoItem;
    this.selectedReco.recoType = 1;

    let url: any;
    if (this.isPersonalizeTagMode) {
      url = AppConstants.API_END_POINTS.GET_PRODUCT_RECO_LAYOUT + '0&recoType=' + this.selectedReco.recoType;
    } else {
      url =
        AppConstants.API_END_POINTS.GET_PRODUCT_RECO_LAYOUT +
        this.commChannelKey +
        '&recoType=' +
        this.selectedReco.recoType;
    }
    this.httpService.post(url).subscribe((data) => {
      this.layoutArray = data.response;
      this.selectedLayoutJSON = JSON.parse(this.layoutArray[0].templateJson);
      this.layoutName = this.layoutArray[0].templateName;
      this.noofRecoConfig = this.layoutArray[0].maxProductConfig;
      if (this.layoutArray.length !== 0) {
        this.templateKey = this.layoutArray[1].dbKey;
        this.selectedReco.imgUrl = data.response[0].imgUrl;
        this.imgUrlCard = data.response[0].imgUrl;
      }
      setTimeout(() => {
        if (Object.keys(this.selectedProdRecoObj).length > 0 && this.editModeEnable) {
          this.sliderValue = recoItem.maxCount;
          let indexOfTemp = this.layoutArray.findIndex((x) => x.dbKey == recoItem.dbKey);
          this.layoutIndex = indexOfTemp;
          this.selectLayout(recoItem.layout, recoItem.dbKey, indexOfTemp);
          this.maxCountLayout = this.sliderValue;
          this.resetEditSection(this.sliderValue);
          this.templateKey = recoItem.dbKey;
        } else {
          if (this.layout !== undefined) {
            this.selectLayout(this.layout, this.templateKey, this.layoutIndex);
          } else {
            this.selectLayout(this.layout, 0, 0);
          }

          this.maxCountLayout = this.sliderValue;
          this.resetEditSection(this.sliderValue);
        }
      }, 500);
    });
    this.selectedReco.key = 15;
    this.selectedReco.dataSet = recoItem.placementName;
    this.selectedReco.ruleName = recoItem.placementName;
    this.selectedReco.datasetType = recoItem.datasetType;
    this.dataSetName = recoItem.placementName;
    this.pageTypeSelected = recoItem.pageType;
    this.checkmarkEnable1 = true;
    this.checkmarkEnable2 = true;
    this.navigatorActiveStage1 = false;
    this.navigatorActiveStage2 = false;
    this.navigatorActiveStage3 = true;
    this.navigatorActiveFinalStage3 = true;
    if (recoItem.basicEnable !== undefined) {
      if (recoItem.basicEnable) {
        this.advancePageEnabled = false;
      } else {
        this.advancePageEnabled = true;
      }
    } else if (recoItem.advanceEnable !== undefined) {
      if (recoItem.advanceEnable) {
        this.advancePageEnabled = true;
      } else {
        this.advancePageEnabled = false;
      }
    }
  }

  editRecoSelection(): void {
    this.editModeEnable = false;
    this.resetcommendation();
  }

  selectLayout(layout: string, templateKey: number, count, source?: string): void {
    const selectLayoutSection = () => {
      this.layout = layout;
      this.templateKey = templateKey;
      //this.layoutIndex = (templateKey !== 0) ? (templateKey - 1) : 0;
      this.layoutIndex = count;
      if (layout === 'layout1' || layout === 'layout3') {
        this.resetEditSection(this.sliderValue);
      } else {
        this.resetEditSection(this.sliderValue);
      }
      this.insertAttributesintoHtml(layout);
      this.insertData();
      const parentElement = this.elementRef.nativeElement.querySelector('.scrollViewTemp');
      if (parentElement != null) {
        //const htmlNode = this.convertToHtmlNode(this.layoutArray[count].htmlHeader);
        //const htmlBody = this.convertToHtmlNode(this.layoutArray[count].templateContent);
        // this. renderer.appendChild(htmlNode, htmlBody);
        parentElement.innerHTML = '';
        // this.renderer.appendChild(parentElement, htmlNode);
        let copiedElement: any = [];
        let str: any;
        let htmlParent = '';

        //htmlParent = this.layoutArray[count].htmlHeader+this.layoutArray[count].templateContent+this.layoutArray[count].htmlFooter;
        htmlParent = this.layoutArray[count].templateContent;
        this.layoutName = this.layoutArray[count].templateName;
        for (let i = 0; i < this.sliderValue; i++) {
          // var toAdd = document.createDocumentFragment();
          copiedElement.push(htmlParent);
          str = copiedElement.join('');
          //toAdd.innerHTML = htmlParent;
          //copiedElement = htmlParent2.cloneNode(true) as HTMLElement;
          // const copiedElement = htmlParent2.cloneNode(true) as HTMLElement;
          // mainParentElement.appendChild(copiedElement);
        }
        str = this.layoutArray[count].htmlHeader + str + this.layoutArray[count].htmlFooter;
        parentElement.innerHTML = str;

        this.selectedLayoutJSON = JSON.parse(this.layoutArray[count].templateJson);
      }
    };
    if (GlobalConstants.isRowEditModeEnable && source == 'fromHTML') {
      Swal.fire({
        titleText: this.translate.instant('apiPersonalization.changingLayoutValidation'),
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
        if (result.isConfirmed) {
          selectLayoutSection();
        }
      });
    } else {
      selectLayoutSection();
    }
  }
  convertToHtmlNode(htmlString: string): HTMLElement {
    const wrapper = this.renderer.createElement('div');
    wrapper.innerHTML = htmlString.trim();
    return wrapper.firstChild as HTMLElement;
  }
  insertAttributesintoHtml(layout: string) {
    if (this.prebuildBindAttributesObj !== undefined) {
      var selObj = JSON.parse(this.prebuildBindAttributesObj.find((x) => x.templateName == layout).templateText);
      this.productPreBuildAttrObj = selObj;
      this.prodImg = '{' + selObj.imgURL + '}';
      this.prodCode = '{' + selObj.title + '}';
      this.prodDesc = '{' + selObj.desc + '}';
    }
  }
  selectLayoutRecoProduct(type, evt) {
    if (type === 0) {
      // Default layout design
      this.chooseLayoutType = 0;
      this.customLayoutEnabled = false;
      this.selectLayout('layout1', 0, 0);
    } else {
      // Custom Layout design
      this.chooseLayoutType = 1;
      //this.confirmAlert(evt);
    }
  }
  enablePresonalizationMethod(evt) {
    if (evt.target.checked) {
      this.enablePresonlize = true;
    } else {
      this.enablePresonlize = false;
    }
  }
  // confirmAlert(evt){
  //   Swal.fire({
  //     title: this.translate.instant('recommendationComponent.changingPrebuildTemplateCustomTemplateConfirmMsgLbl'),//this.translate.instant('designEditor.failsafePage.confirmationMgs.savedDatawillbeLostMgslbl'),
  //     //text: 'Your saved data will be lost!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: this.translate.instant('designEditor.yesBtn'),
  //     cancelButtonText: this.translate.instant('designEditor.cancelBtn'),
  //     allowOutsideClick:false,
  //     allowEscapeKey:false,
  //   }).then((result) => {
  //     if (result.value) {
  //       this.layout = '1';
  //       this.customLayoutEnabled = true;
  //       this.customProductLayout();
  //     }else{
  //       this.chooseLayoutType = 0;
  //     }
  //   })
  // }
  onChangeSLiderVal(evt, layout) {
    if (evt.currentTarget == undefined) {
      this.sliderValue = parseInt(evt);
    } else {
      this.sliderValue = evt.currentTarget.getElementsByClassName('ngx-slider-model-value')[0].innerText;
    }
    if (this.sliderValue == 0) {
      this.sliderValue = 1;
    }
    this.maxCountLayout = this.sliderValue;
    this.resetEditSection(this.sliderValue);
    if (this.customLayoutEnabled) {
      this.childProductArrtibuteComponent.counterUpdatePreview(this.sliderValue);
    }
    this.selectLayout(this.layout, this.templateKey, this.layoutIndex);
  }
  changeNumberOfCards(num: number): void {
    if (num > 8) {
      this.dataService.SwalValidationMsg(
        this.translate.instant('recommendationComponent.valueShouldBeLessThanOrEqualTo8ALertMsgLbl')
      );
      this.resetEditSection(2);
      return;
    }
    this.previewArr.length = num;
    this.insertData();
  }

  // filter recommendation based on type
  // this function is not in use currently
  selectRecoType(recoType: any): void {
    if (recoType === 'Personalization-Recommend-Template') {
      this.tempListArray = this.personalizationListArray;
    } else if (recoType === 'Personalization-Discover-Template') {
      this.tempListArray = this.discoverListArray;
    } else {
      this.tempListArray = this.combinedArray;
    }
    if (this.tempListArray.length === 0) {
      this.noResultFound = true;
    } else {
      this.noResultFound = false;
    }
  }

  searchByModelName(evt) {
    let strVal;
    if (evt.target !== undefined) {
      strVal = evt.target.value;
    } else {
      strVal = evt;
    }
    this.searchDataModels = this.emailPageData.filter((item) => {
      return item.placementName.toLowerCase().indexOf(strVal.toLowerCase().trim()) > -1;
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
  insertCustomLayout(html) {
    let uuid = uuidv4();
    if (this.isRowEditModeEnable) {
      uuid = this.selectedRecoOfferUUID;
    }
    let prodType;
    if (this.productContentDialogId == 'rule-offer') {
      prodType = this.typeDefObj.Product;
    } else {
      prodType = this.typeDefObj.Product_Recommendation;
    }
    this.htmlCustom =
      '<dynamic-content id="' +
      uuid +
      '" class="cmp-dynamic-content productPreview" type="' +
      prodType +
      '" placementId="' +
      this.dataSetName +
      '" name="' +
      this.dataSetName +
      '" pageType="' +
      this.pageTypeSelected +
      '" maxCount="' +
      this.maxCountLayout +
      '" useContext="' +
      this.enablePresonlize +
      '">' +
      '<style>.productPreview img{max-width: 100%;width: 8rem;height: 8rem;margin: 0.8rem;}' +
      '.productPreview  * {margin: .3rem;padding: .2rem;background:#FFF;}</style>' +
      html +
      '</dynamic-content>';
    return this.htmlCustom;
  }

  insertRecommendation(): void {
    this.isDoneClicked = true;

    let uuid = uuidv4();
    this.rowNameValue = this.randomNameService.generateRandomName("rowName-");
    if (this.isRowEditModeEnable) {
      uuid = this.selectedRecoOfferUUID;
      this.rowNameValue = this.selctedDataJsonObj.rowName;
    }
    GlobalConstants.existingRowLabels[uuid] = this.rowNameValue;
    let dynamicContent;
    let recoData: any;
    let jsonStringObj = {};
    if (this.basicAdvaceVal.basic) {
      recoData = {
        basicEnable: this.basicAdvaceVal.basic,
        advanceEnable: this.basicAdvaceVal.advance,
        pageType: this.pageTypeSelected,
        maxCount: this.sliderValue,
        placementName: this.dataSetName,
        useContext: this.enablePresonlize,
        layout: this.layoutName,
        dbKey: this.templateKey,
      };
    } else {
      recoData = {
        advanceEnable: this.basicAdvaceVal.advance,
        pageType: this.pageTypeSelected,
        maxCount: this.sliderValue,
        placementName: this.dataSetName,
        useContext: this.enablePresonlize,
        modelData: this.advanceSavedDataObj,
        layout: this.layoutName,
        dbKey: this.templateKey,
      };
    }
    let tempDynamicContent = JSON.stringify(recoData);
    dynamicContent = `<dynamic-content id='${uuid}' rowName='${this.rowNameValue}' type='productReco' layout='${this.layoutName}' placementId='${this.dataSetName}' maxCount='${this.sliderValue}' recoAttributes='${tempDynamicContent}'>`;

    this.selectedLayoutJSON.value['display-condition'].before = dynamicContent;
    this.selectedLayoutJSON.value.metadata.selectedValue = tempDynamicContent;
    this.selectedLayoutJSON.value.metadata.id = uuid;
    if (this.selectedLayoutJSON.value.columns[0].modules[0].src == '') {
      this.selectedLayoutJSON.value.columns[0].modules[0].src = this.baseUrl + '/resources/img/inApp/PreviewImage.png';
    }
    this.myDataRowInsert = this.selectedLayoutJSON;
    this.onClose();
    if (this.isRowEditModeEnable) {
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
  gobackToGridPage() {
    this.productRecoPageLoadedEnabled = false;
    this.navigateStage1();
  }
  goBackToMergeTagNBrowse() {
    this.advancePageEnabled = true;
    this.checkmarkEnable1 = true;
    this.checkmarkEnable2 = true;
    this.navigatorActiveStage1 = false;
    this.navigatorActiveStage2 = true;
    this.navigatorActiveStage3 = false;
    this.navigatorActiveFinalStage3 = false;
    this.productRecoPageLoadedEnabled = false;
    if (this.basicAdvaceVal.advance) {
      GlobalConstants.browseProdActiveEnable = true;
    } else {
      GlobalConstants.browseProdActiveEnable = false;
    }
    this.advanceStage2 = true;
    setTimeout(() => {
      if (this.productPageAdvance !== undefined) {
        this.productPageAdvance.basicAdvanceEnabled = false;
        this.basicAdvaceVal.basic = false;
        // this.productPageAdvance.advanceDetailsPage = true;
        this.productPageAdvance.advanceChecked = true;
        this.productPageAdvance.showContentAgGrid = false;
        this.productPageAdvance.collectDataForAdvance();
        //this.selectRecommendation(this.selctedDataJsonObj);
        this.productPageAdvance.getMergeTagData();
        //console.log(this.advanceSavedDataObj);
      }
      this.dataService.prodRecoSelectedModelObj.next(this.selctedDataJsonObj);
    }, 500);
  }
  gobackToAdvancePage() {
    this.productRecoPageLoadedEnabled = false;
    this.navigateStage2();
  }
  backToTipicalFromAdvance(basic) {
    this.navigateStage2();
  }
  basicAdvanceMethod(obj) {
    this.basicAdvaceVal = obj;
    if (this.basicAdvaceVal.basic) {
      this.advanceStage2 = false;
    } else {
      this.advanceStage2 = true;
    }
    this.productRecoPageLoadedEnabled = true;
  }
  modelDataCollectionMethod(savedObj) {
    this.advanceSavedDataObj = savedObj;
  }

  ngOnInit(): void {
    this.showLoader = true;
    //this.getRecommendationList();
    this.tempWidgetCount = GlobalConstants.rrWidgetCount;
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
    this.onChangeSLiderVal(selectValue, '');
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
  /* onImgError(event) { 
    event.target.src = this.BASE_URL_ANGULAR+'/assets/images/previewImg.png';
  } */
}