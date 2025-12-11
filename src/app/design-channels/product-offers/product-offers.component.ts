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
import { TreeviewItem, TreeviewConfig, TreeItem, TreeviewI18n } from 'ngx-treeview';
import { Clipboard } from '@angular/cdk/clipboard';
import { v4 as uuidv4 } from 'uuid';
import { DefaultTreeviewI18n } from '../default-treeview-i18n';
import { RandomNameService } from '@app/core/services/random-name.service';

@Component({
  selector: 'app-product-offers',
  templateUrl: './product-offers.component.html',
  styleUrls: ['./product-offers.component.scss'],
  providers: [{ provide: TreeviewI18n, useClass: DefaultTreeviewI18n }],
})
export class ProductOffersComponent implements OnInit {
  @ViewChild('recoDiv', { static: false }) recoDiv!: ElementRef;
  @ViewChild('customLayoutAppendHtmlArea') customLayoutAppendHtmlArea!: ElementRef;
  @ViewChild('childProductArrtibuteComponent')
  childProductArrtibuteComponent!: CdkDragDropComponent;
  @Output() onAdd = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  @ViewChild('radioBtnClick') radioBtnClick!: ElementRef;
  @ViewChild('mergeTagsListData', { static: false }) mergeTagsListData!: ElementRef;

  agGridLocaleLabels:any = {
    "to": "",
    "of": "",
    "page": "",
    "noRowsToShow": ""  
  };

  
  public localeText: {
    [key: string]: any;
  } = this.agGridLocaleLabels;
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
  sliderValue: any = AppConstants.PTAG_STATIC_DATA.defaultSelectedProduct;
  chooseLayoutType: any = 0;
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
  productAttributesArry: any = [];
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
  queryProductDrawer: boolean = true;
  layoutPanelDrawer: boolean = true;
  baseUrl: any = environment.BASE_URL;
  pageTypeSelected: any;
  isProductOffersEnabled: boolean = false;
  dynamicContent: any = '';
  myDataRowInsert: any;
  isPersonalizeTagMode: boolean = false;
  tagKey: any;
  queryProductValue: string = '';
  customBootstrapStyle: any = ['btn btn-outline-primary buttonStyle shadow-none'];
  copiedDivEnabled: boolean = false;
  items!: TreeviewItem[];
  configuration = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 500,
  });
  mergeTagDataItems: any;
  selectedSavedObject: any;

  layoutName: any = '';
  layoutHtmlHeader: any;
  layoutHtmlFooter: any;
  layoutIndex: any = 0;
  isPublishedPersonalization: boolean = false;
  isRowEditModeEnable: boolean = false;
  selectedProductUUID: any;
  rowNameValue: string = "";

  constructor(
    private bsModalRef: BsModalRef,
    private ref: ChangeDetectorRef,
    private httpService: HttpService,
    private dataService: DataService,
    private shareService: SharedataService,
    private translate: TranslateService,
    private clipboard: Clipboard,
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
        headerName: this.translate.instant('recommendationComponent.placementIdLbl'),
        maxWidth: 400,
        tooltipField: 'placementName',
      },
      {
        field: 'placementDesc',
        headerName: this.translate.instant('recommendationComponent.placementDescLbl'),
        maxWidth: 400,
        tooltipField: 'placementDesc',
      },
      // { field: 'datasetType',headerName:'Activity type',maxWidth:200},
      // { field: 'createdBy',headerName:'Created by',maxWidth:200},
      // { field: 'validDate',headerName:'Valid till',maxWidth:200},
    ];

    this.tagKey = this.dataService.activeContentTagKey; //localStorage.getItem('tagKeyPersonalization');
    ref.detach();
    setInterval(() => {
      this.ref.detectChanges();
    }, 100);
    this.shareService.personalizeTagService.subscribe((result) => {
      this.isPersonalizeTagMode = result;
    });

    this.dataService.$sharedPromoKey.subscribe((result) => {
      this.promotionKey = result;
    });
    this.shareService.currentSelectedChannelObj.subscribe((res: any) => {
      this.currentSplitId = res.currentSplitId;
      this.commChannelKey = res.commChannelKey;
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
    //this.getpreBuildBindingAttrData();

    if (this.productContentDialogId != '') {
      if (this.productContentDialogId == 'rule-offer') {
        // Product offer
        this.isProductOffersEnabled = true;
        //this.selectRecommendation({});
        this.getpreBuildBindingAttrData();
      } else {
        // Production Recomendation
        this.isProductOffersEnabled = false;
      }
    }

    this.shareService.savedAddOnsJSON.subscribe((res: any) => {
      this.editModeEnable = true;
      this.selectedProductUUID = res?.id;

      if (GlobalConstants.isRowEditModeEnable) {
        this.isRowEditModeEnable = true;
      } else {
        this.isRowEditModeEnable = false;
      }

      if (res != '' && res != undefined) {
        this.selectedSavedObject = JSON.parse(res.selectedValue);
        this.queryProductValue = this.selectedSavedObject.queryParams;
      } else if (res == undefined) {
        this.queryProductValue = '';
      }
    });

    this.getMergeTagData();
  }

  customProductLayout() {
    this.layout = 'customDesign';
    //console.log(evt);
  }
  // @HostListener('document:click', ['$event.target'])
  // clickout(event) {
  //   if (event.className.includes('radioGridSelected')) {
  //     var rowId = event.name;
  //     this.shareService.sendParamsFromRecoOffersDynamic.subscribe((res: any) => {
  //       if (res !== undefined && res.data !== undefined) {
  //         this.selectRecommendation(res.data);
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
  onChangeApiNames(params, isEdit) {
    if (isEdit) {
    } else {
      if (params !== undefined && params.data !== undefined) {
        this.selectRecommendation(params.data);
      }
    }
  }
  getpreBuildBindingAttrData() {
    let url = '';
    if (this.isPersonalizeTagMode) {
      url = AppConstants.API_END_POINTS.GET_PRODUCT_RECO_PREBUILD + '1&recoType=4';
    } else {
      url = AppConstants.API_END_POINTS.GET_PRODUCT_RECO_PREBUILD + this.commChannelKey + '&recoType=4';
    }
    this.httpService.post(url).subscribe((data) => {
      if (data.status === 'SUCCESS') {
        this.showLoader = false;
        this.prebuildBindAttributesObj = data.response;
        this.dataSetApiCall();
        this.selectRecommendation({});
        //console.log(data.response);
      }
    });
  }

  dataSetApiCall() {
    let url = '';
    if (this.isPersonalizeTagMode) {
      url = AppConstants.API_PERSONSOALIZATION_TAGS_END_POINTS.GET_All_PERSONALIZATION_PLACEMENTS + this.tagKey;
    } else {
      url = AppConstants.API_END_POINTS.GET_All_PLACEMENTS_PAGE_TYPE + this.promotionKey;
    }
    this.httpService.post(url).subscribe((data) => {
      if (data.status === 'SUCCESS') {
        this.placementDataWithPageType = JSON.parse(data.response.placement);
        this.rowDataForPlacementTable = JSON.parse(data.response.placement);
        this.productAttributesArry = JSON.parse(data.response.productAttributes);
        if (!this.isPersonalizeTagMode && this.queryProductValue == '') {
          this.queryProductValue = data.response.cName[0];
        }

        let productAttrTemp = this.productAttributesArry;
        let proArray: any[] = [];
        for (let key in productAttrTemp) {
          let p: any = {};
          p['name'] = productAttrTemp[key];
          p['value'] = key;
          proArray.push(p);
        }
        const parentProductMerge = {
          id: 'Product',
          text: 'Product',
          userdata: proArray,
        };

        if (!GlobalConstants.productMergeTags.some((obj) => obj.id === parentProductMerge.id)) {
          GlobalConstants.productMergeTags.push(parentProductMerge);
        }

        this.pageTypeData = JSON.parse(data.response.pageType);
        this.contextFlagToShowPersonalization = data.response.contextFlg;
        this.typeDefObj = data.response.typeDef;

        this.pageTypeData.forEach((item) => {
          var pageCount = this.rowDataForPlacementTable[item].length;
          var obj = { pageName: item, pageCount: pageCount };
          this.pageTypeWithCount.push(obj);
        });
        this.pageTypeMethod(this.pageTypeData[0]);
        this.pageSelectedId = this.pageTypeData[0];
        //this.selectLayout('layout1',0);
        this.selectionRuleType = false;
        this.showActivityRulesGrid = true;
        console.log(this.rowDataForPlacementTable);
      }
    });
  }
  pageTypeMethod(pageType) {
    this.rowDataForPlacementTable = this.placementDataWithPageType[pageType];
    this.pageSelectedId = pageType;
    if (this.rowDataForPlacementTable.length > 0) {
      this.rowDataForPlacementTable.forEach((element: any, i) => {
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
      this.selectionRuleType = false;
      this.showActivityRulesGrid = true;
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
      url = AppConstants.API_END_POINTS.GET_PRODUCT_RECO_LAYOUT + '1&recoType=' + this.selectedReco.recoType;
    } else {
      url =
        AppConstants.API_END_POINTS.GET_PRODUCT_RECO_LAYOUT +
        this.commChannelKey +
        '&recoType=' +
        this.selectedReco.recoType;
    }
    this.httpService.post(url).subscribe((data) => {
      //this.previewArr=[];
      this.layoutArray = data.response;
      this.layoutName = this.layoutArray[0].templateName;
      this.noofRecoConfig = this.layoutArray[0].maxProductConfig;
      if (this.layoutArray.length !== 0) {
        this.templateKey = this.layoutArray[1].dbKey;
        this.selectedReco.imgUrl = data.response[0].imgUrl;
        this.imgUrlCard = data.response[0].imgUrl;
        //this.previewArr.push(data.response[0]);
      }
      setTimeout(() => {
        if (this.selectedSavedObject != undefined && this.editModeEnable) {
          this.selectMaxProductSlider(this.selectedSavedObject.maxCount, this.selectedSavedObject.layout);
          this.selectLayout(this.selectedSavedObject.layout, 0, this.selectedSavedObject.count);
        } else {
          this.selectLayout('layout1', 0, 0);
          this.maxCountLayout = this.sliderValue;
        }
      }, 1000);
    });
    this.selectedReco.key = 15;
    this.selectedReco.dataSet = recoItem.placementName;
    this.selectedReco.ruleName = recoItem.placementName;
    this.selectedReco.datasetType = recoItem.datasetType;
    this.dataSetName = recoItem.placementName;
    this.pageTypeSelected = recoItem.pageType;
    this.maxCountLayout = this.sliderValue;
    this.resetEditSection(this.sliderValue);
  }

  editRecoSelection(): void {
    this.editModeEnable = false;
    this.resetcommendation();
  }

  selectLayout(layout: string, templateKey: number, count, source?: string): void {
    const selectLayoutSection = () => {
      this.layout = layout;
      this.templateKey = templateKey;
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
        parentElement.innerHTML = '';
        // this.renderer.appendChild(parentElement, htmlNode);
        let copiedElement: any = [];
        let str: any;
        let htmlParent = '';

        htmlParent = this.layoutArray[count].templateContent;
        this.layoutName = this.layoutArray[count].templateName;
        for (let i = 0; i < this.sliderValue; i++) {
          copiedElement.push(htmlParent);
          str = copiedElement.join('');
        }
        str = this.layoutArray[count].htmlHeader + str + this.layoutArray[count].htmlFooter;
        parentElement.innerHTML = str;
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
  insertAttributesintoHtml(layout: string) {
    if (this.prebuildBindAttributesObj && Object.keys(this.prebuildBindAttributesObj).length > 0) {
      var selObj = JSON.parse(this.prebuildBindAttributesObj.find((x) => x.templateName == layout).templateText);
      this.productPreBuildAttrObj = selObj;
      this.prodImg = '{' + selObj.imgURL + '}';
      this.prodCode = '{' + selObj.code + '}';
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
      this.confirmAlert(evt);
    }
  }
  enablePresonalizationMethod(evt) {
    if (evt.target.checked) {
      this.enablePresonlize = true;
    } else {
      this.enablePresonlize = false;
    }
  }
  confirmAlert(evt) {
    Swal.fire({
      title: this.translate.instant('recommendationComponent.changingPrebuildTemplateCustomTemplateConfirmMsgLbl'), //this.translate.instant('designEditor.failsafePage.confirmationMgs.savedDatawillbeLostMgslbl'),
      //text: 'Your saved data will be lost!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('designEditor.yesBtn'),
      cancelButtonText: this.translate.instant('designEditor.cancelBtn'),
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.value) {
        this.layout = '1';
        this.customLayoutEnabled = true;
        this.customProductLayout();
      } else {
        this.chooseLayoutType = 0;
      }
    });
  }

  selectMaxProductSlider(e, layout) {
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
    if (layout != '') {
      this.layout = layout;
    }
    this.onChangeSLiderVal(selectValue, this.layout);
  }

  prevItem(): void {
    if (this.sliderValue > 1) {
      this.sliderValue--;
      this.selectMaxProductSlider(this.sliderValue, '');
    }
  }

  nextItem(): void {
    if (this.sliderValue < this.noofRecoConfig) {
      this.sliderValue++;
      this.selectMaxProductSlider(this.sliderValue, '');
    }
  }

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
    this.selectLayout(layout, 0, this.layoutIndex);
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

  changeQueryProduct(text: string): void {
    console.log(text);
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

  // search recommendation by name
  // this function is not in use currently
  searchRecommendation(searchText: string): void {
    if (searchText === '') {
      if (this.recoType === 'Personalization-Recommend-Template') {
        this.tempListArray = this.personalizationListArray;
      } else if (this.recoType === 'Personalization-Discover-Template') {
        this.tempListArray = this.discoverListArray;
      } else {
        this.tempListArray = this.combinedArray;
      }
    } else {
      this.tempListArray = this.tempListArray.filter((item) => {
        return item.name.toLowerCase().indexOf(searchText.toLowerCase().trim()) > -1;
      });
    }
    if (this.tempListArray.length === 0) {
      this.noResultFound = true;
    } else {
      this.noResultFound = false;
    }
  }

  insertData(): void {
    let type: string;
    if (this.selectedReco != undefined) {
      if (this.selectedReco.recoType == '1') {
        type = 'RO';
      } else if (this.selectedReco.recoType == '2') {
        type = 'RP';
      } else {
        type = 'SO';
      }
    }
  }
  insertCustomLayout(html) {
    let uuid = uuidv4();
    this.rowNameValue = this.randomNameService.generateRandomName("rowName-");
    if (this.isRowEditModeEnable) {
      uuid = this.selectedProductUUID;
      this.rowNameValue = this.selectedSavedObject.rowName;
    }
    GlobalConstants.existingRowLabels[uuid] = this.rowNameValue;
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
  insertProduct(): void {
    let uuid = uuidv4();
    this.rowNameValue = this.randomNameService.generateRandomName("rowName-");
    if (this.isRowEditModeEnable) {
      uuid = this.selectedProductUUID;
      this.rowNameValue = this.selectedSavedObject.rowName;
    }
    GlobalConstants.existingRowLabels[uuid] = this.rowNameValue;
    this.isDoneClicked = true;
    //this.insertData();
    let insertHtml;
    if (this.customLayoutEnabled) {
      insertHtml = this.htmlCustom;
    } else {
      /* if(this.recoDiv.nativeElement !== undefined){
        var eachCard = this.recoDiv.nativeElement.getElementsByClassName('productPreview');
        eachCard = [...eachCard];
        eachCard.forEach(eachobj => {
          eachobj.style.display = 'none';
        });
        eachCard[0].style.display = 'inline-block';
        console.log(eachCard);
      }
      let htmlInsertContent = this.recoDiv.nativeElement.innerHTML;
      insertHtml = this.insertCustomLayout(htmlInsertContent);
      
    }
    
    this.myjson = insertHtml;
    const valHtml = {
      type: "html",
      value: {
        html: this.myjson,
      },
    }; */

      // GlobalConstants.rrWidgetCount =  GlobalConstants.rrWidgetCount+1;
      const queryProductValue = this.queryProductValue;
      if (queryProductValue == '') {
        this.dataService.SwalValidationMsg(
          this.translate.instant('productRecoAdvanceComponent.productContextQueryProductsByValidation')
        );
        return;
      }
      this.dynamicContent = `<dynamic-content id='${uuid}' rowName='${this.rowNameValue}' type='contextProduct' layout='${this.layout}' maxCount='${this.maxCountLayout}' queryParams='${queryProductValue}'>`;
    }

    const jsonObject = {
      type: 'contextProduct',
      layout: this.layout,
      maxCount: this.maxCountLayout,
      queryParams: this.queryProductValue,
      count: this.layoutIndex,
      "rowName": this.rowNameValue
    };
    const jsonString = JSON.stringify(jsonObject);

    let rowData = {
      0: {
        type: 'rowAddon',
        value: {
          name: 'Layout 1',
          'background-color': '#ffffff',
          'display-condition': {
            type: 'productReco',
            label: 'Product Recommendation',
            description: 'Content will decide here....',
            before: this.dynamicContent,
            after: '</dynamic-content>',
          },
          metadata: { selectedValue: jsonString, id: uuid },
          columns: [
            {
              weight: 4,
              modules: [
                {
                  type: 'image',
                  src: this.baseUrl + '/resources/img/inApp/PreviewImage.png',
                  dynamicSrc: this.prodImg,
                },
              ],
            },
            {
              weight: 8,
              modules: [
                {
                  type: 'title',
                  text: this.prodCode,
                  size: 14,
                  align: 'center',
                },
                {
                  type: 'paragraph',
                  text: this.prodDesc,
                  size: 14,
                  align: 'center',
                },
              ],
            },
          ],
        },
      },
      1: {
        type: 'rowAddon',
        value: {
          name: 'Layout 2',
          'background-color': '#ffffff',
          'display-condition': {
            type: 'productReco',
            label: 'Product Recommendation',
            description: 'Content will decide here....',
            before: this.dynamicContent,
            after: '</dynamic-content>',
          },
          metadata: { selectedValue: jsonString, id: uuid },
          columns: [
            {
              weight: 12,
              modules: [
                {
                  type: 'image',
                  src: this.baseUrl + '/resources/img/inApp/PreviewImage.png',
                  dynamicSrc: this.prodImg,
                },
                {
                  type: 'title',
                  text: this.prodCode,
                  size: 14,
                  align: 'center',
                },
                {
                  type: 'paragraph',
                  text: this.prodDesc,
                  size: 14,
                  align: 'center',
                },
              ],
            },
          ],
        },
      },
    };

    switch (this.layout) {
      case 'layout1':
        this.myDataRowInsert = rowData[0];
        break;
      case 'layout2':
        this.myDataRowInsert = rowData[1];
        break;
      case 'layout3':
        this.myDataRowInsert = rowData[0];
        break;
      case 'layout4':
        this.myDataRowInsert = rowData[1];
        break;
    }
    this.onClose();
    if (this.isRowEditModeEnable) {
      this.onEdit.emit(this.myDataRowInsert);
    } else {
      this.onAdd.emit(this.myDataRowInsert);
    }
    //this.onAdd.emit(valHtml);
  }

  onClose(): void {
    if (this.bsModalRef !== undefined) {
      this.bsModalRef.hide();
    }
  }

  ngOnInit(): void {
    //this.showLoader = true;
    //this.getRecommendationList();

    this.tempWidgetCount = GlobalConstants.rrWidgetCount;
  }

  /* onImgError(event) { 
    event.target.src = this.BASE_URL_ANGULAR+'/assets/images/previewImg.png';
  } */

  getMergeTagData() {
    let url: any;
    if (this.isPersonalizeTagMode) {
      url = AppConstants.API_END_POINTS.GET_DME_MERGE_TAG_OBJ + '?tagKey=' + this.tagKey + '&wa=true&prod=false&dme=false';
    } else {
      url =
        AppConstants.API_END_POINTS.GET_DME_MERGE_TAG_OBJ +
        '?promoKey=' +
        this.promotionKey +
        '&splitKey=' +
        this.currentSplitId +
        '&wa=false&prod=true&dme=false';
    }

    this.httpService.post(url).subscribe((data) => {
      if (data.status === 'SUCCESS') {
        this.mergeTagDataItems = JSON.parse(data.response).root;
        this.loadData();
        console.log(this.mergeTagDataItems);
      }
    });
  }

  onSelectedChange(item): void {
    if (item.length == 1 && item.length != 0 && item[0] !== '') {
      this.copyText('{' + item + '}');
      this.copiedDivEnabled = true;
      setTimeout(() => {
        this.copiedDivEnabled = false;
      }, 1500);
      this.resetCheckedFalseInMergeTag();
    } else {
      this.resetCheckedFalseInMergeTag();
    }
  }
  copyText(textToCopy: string) {
    this.clipboard.copy(textToCopy);
  }
  loadData() {
    this.items = this.getItems(this.mergeTagDataItems);
    setTimeout(() => {
      this.resetCheckedFalseInMergeTag();
    }, 500);
  }
  resetCheckedFalseInMergeTag() {
    let dropdownEMl: any = this.mergeTagsListData;
    dropdownEMl.buttonLabel = this.translate.instant('recommendationComponent.CopyFromMergeTags');
    dropdownEMl.items.forEach((item) => {
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
  getItems(parentChildObj: any[]) {
    let itemsArray: TreeviewItem[] = [];
    parentChildObj.forEach((set: TreeItem) => {
      if (set.children != undefined) {
        itemsArray.push(new TreeviewItem(set, true));
      }
    });
    return itemsArray;
  }

  ngAfterViewInit() {}
}
