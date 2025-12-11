import { Component, OnInit, Output, Input, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef, HostListener, Renderer2} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpService } from '@app/core/services/http.service';
import { DataService } from '@app/core/services/data.service';
import { SharedataService } from '@app/core/services/sharedata.service';
import { AppConstants } from '@app/app.constants';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@env/environment';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-journey-choose-template-layout',
  templateUrl: './journey-choose-template-layout.component.html',
  styleUrls: ['./journey-choose-template-layout.component.scss']
})
export class JourneyChooseTemplateLayoutComponent implements OnInit {
  @Output() dynamicContentObj = new EventEmitter<any>();
  showActivityRulesGrid: boolean = false;
  noofRecoConfig: number = AppConstants.PTAG_STATIC_DATA.defaultSelectedProduct;
  JSONInbuild = JSON;
  dataSetName: any;
  imgUrlCard:any;
  maxCountLayout:any = 0;
  pageTypeData: any = [];
  pageTypeWithCount:any = [];
  pageSelectedId: any;
  placementDataWithPageType: any = [];
  placementType:any = 'productReco';
  placementIdsArry:any = [];
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
  settingsPanelDrawer:boolean = true;
  layoutPanelDrawer:boolean = true;
  fixedLayout:boolean=true;
  baseUrl:any = environment.BASE_URL;
  pageTypeSelected: any;
  isProductOffersEnabled: boolean = false;
  navigatorActiveStage1:boolean = true;
  navigatorActiveStage2:boolean = false;
  navigatorActiveStage3:boolean = true;
  emailPageData: any;
  advancePageEnabled: boolean = false;
  checkmarkEnable1:boolean = false;
  checkmarkEnable2:boolean = false;
  enableFooterBtns:boolean = false;
  selctedDataJsonObj: any = {};
  selectedActiveRow: boolean = false;
  searchDataModels: any;
  modelDataListsArry: any = [];
  isBasicSelected:any;
  basicAdvaceVal: any;
  basicDataSavingJson:any = {};
  myDataRowInsert: any;
  advanceDataSavingJsonObj:any = {};
  advanceSavedDataObj: any = {};
  @Input() createSavedObj:any = {};
  layoutName: any = "";
  layoutJson: any = [];
  layout1Content: any;
  layoutHtmlHeader: any;
  layoutHtmlFooter: any;
  selectedLayoutJSON: any = {};
  navigatorActiveFinalStage3: boolean = false;
  advanceStage2: boolean = false;
  isPersonalizeTagMode: boolean = false;
  browseActiveStage: boolean = false;
  promotionKey: any;
  currentSplitId: any;
  commChannelKey: any;
  selectedReco: any;
  layoutArray: any;
  templateKey: any;
  editModeEnable: boolean = false;
  recoType: any;
  searchText: any;
  tempListArray: any;
  combinedArray: any;
  noResultFound: boolean = false;
  sliderOptions: Options = {
    floor: 1,
    showSelectionBar: true,
    ceil: AppConstants.PTAG_STATIC_DATA.defaultSelectedProduct 
  };
  sliderValue:any = AppConstants.PTAG_STATIC_DATA.defaultSelectedProduct;;
  customLayoutEnabled: any;
  childProductArrtibuteComponent: any;
  chooseLayoutType: any = 0;
  noOfReco: any;
  tagKey = ""; //localStorage.getItem('tagKeyPersonalization');
  previewArr: any[] = [1,2,3,4];
  layout: any;
  layoutIndex: any;
  rowDataForPlacementTable :any = [];
  showLoader: boolean = false;
  @Input() blockNameLoadedFor:any = "";
  @Input() modelNameSelectedForLayoutPg:any = "";
  selectedLayout: string="fixedLayout";
  blockNameSelected: any;
  constructor(
    private bsModalRef: BsModalRef, 
    private ref: ChangeDetectorRef, 
    private httpService: HttpService,
    private dataService: DataService,
    private shareService: SharedataService,
    private translate: TranslateService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
  ) { 
    this.tagKey = this.dataService.activeContentTagKey;
    this.dataService.$sharedPromoKey.subscribe((result) => {
      this.promotionKey = result;
    });
    this.shareService.currentSelectedChannelObj.subscribe((res: any) => {
      this.currentSplitId = res.currentSplitId;
      this.commChannelKey=res.commChannelKey;
    });
    this.shareService.personalizeTagService.subscribe((result) => {
      this.isPersonalizeTagMode = result;
    });
    this.shareService.addOnContentDialogId.subscribe((res:any) => {
      if(res != ''){
        this.productContentDialogId = res;
      }          
     });
     setTimeout(() => {
      if(this.blockNameLoadedFor !== ""){
        if(this.blockNameLoadedFor === 'api'){
          //this.getGridDataOnloadMethod(res,'apiName',this.createSavedObj);          
          this.blockNameSelected = this.modelNameSelectedForLayoutPg;
        }else if(this.blockNameLoadedFor === 'dme'){
          //this.getGridDataOnloadMethod(res,'modelName',this.createSavedObj);
          this.blockNameSelected = this.modelNameSelectedForLayoutPg;
        }
        // if(Object.keys(this.createSavedObj).length > 0){
        //   this.editModeEnable = true;
        //  }
      }
    }, 500);  
     
     this.getpreBuildBindingAttrData();       
     this.selectRecommendation({}); 
     
      //  if(this.productContentDialogId != ""){
      //   if(this.productContentDialogId == 'rule-offer'){ // Product offer
      //     this.isProductOffersEnabled = true;
      //     this.selectRecommendation({});
      //   }else{  // Production Recomendation  
      //     this.isProductOffersEnabled = false;
      //   }
      // }    
  }
  getGridDataOnloadMethod(res,model,editObj){
    if(res !== undefined && res.data !== undefined){
      //this.selectRecommendation(res.data);  
      if(Object.keys(editObj).length > 0){    
        this.selctedDataJsonObj = editObj;
        this.selectedActiveRow = true;  
      }else{
        this.selctedDataJsonObj = res.data;        
        this.selectedActiveRow = true;  
      }               
    }else{
      this.selctedDataJsonObj[model] = '';
    }
   }
  selectRecommendation(recoItem:any): void {
    // this.editModeEnable = true;
     this.selectedReco = recoItem;
     this.selectedReco.recoType = 1;

    let url: any;
    if(this.isPersonalizeTagMode) {
      url = AppConstants.API_END_POINTS.GET_PRODUCT_RECO_LAYOUT+ '0&recoType=' + this.selectedReco.recoType;
    } else {
      url = AppConstants.API_END_POINTS.GET_PRODUCT_RECO_LAYOUT+ this.commChannelKey + '&recoType=' + this.selectedReco.recoType;
    } 
    this.httpService.post(url).subscribe((data) => {
          this.layoutArray = data.response;          
          this.selectedLayoutJSON = JSON.parse(this.layoutArray[0].templateJson);
          this.layoutName = this.layoutArray[0].templateName;
          this.noofRecoConfig = this.layoutArray[0].maxProductConfig;
          if(this.layoutArray.length !== 0) {
            this.templateKey = this.layoutArray[0].dbKey;
            this.selectedReco.imgUrl = data.response[0].imgUrl;
            this.imgUrlCard = data.response[0].imgUrl;
          }
          setTimeout(() => {
            if(Object.keys(this.createSavedObj).length > 0){
              this.sliderValue = this.createSavedObj.maxCount;
              if(this.sliderValue === undefined){
                this.sliderValue = AppConstants.PTAG_STATIC_DATA.defaultSelectedProduct;; // switching to default value when switching b/w single and multirow.
              }
              if(this.createSavedObj.dbKey === undefined){
                this.templateKey = this.layoutArray[0].dbKey;
              }else{
                this.templateKey = this.createSavedObj.dbKey;
              }
              let indexOfTemp = this.layoutArray.findIndex(x => x.dbKey == this.templateKey);
              this.layoutIndex = indexOfTemp;
              if(this.createSavedObj.layout === undefined){
                this.createSavedObj.layout = 'layout1';
              }
              this.selectLayout(this.createSavedObj.layout,this.templateKey, indexOfTemp); 
              this.maxCountLayout = this.sliderValue;
              this.resetEditSection(this.sliderValue);
              //this.templateKey = recoItem.dbKey;
            }else{
              this.selectLayout('layout1',this.templateKey, 0); 
              this.maxCountLayout = this.sliderValue;
              this.resetEditSection(this.sliderValue);
            } 
            this.fixedLayout = !this.createSavedObj.freeStyle;
            this.selectedLayout = this.createSavedObj.freeStyle ? 'freeStyleLayout' : 'fixedLayout';
            this.shareService.freeStyleLayout[this.createSavedObj.apiName || this.createSavedObj.modelName]  = {
              isFreeStyleLayout : !this.fixedLayout,
              maxCount : this.maxCountLayout
            }

            // if(Object.keys(this.createSavedObj).length > 0){
            //   if(this.createSavedObj.maxCount !== undefined){
            //     this.sliderValue = parseInt(this.createSavedObj.maxCount);
            //     this.selectLayout(this.createSavedObj.layout,0, 0);
            //   }else{
            //     this.selectLayout('layout1',0, 0);
            //     this.sliderValue = 8;                
            //   }              
            //   this.selctedDataJsonObj = this.createSavedObj;
            // }else{
            //   this.selectLayout('layout1',0, 0);
            // }             
          }, 500);
              
    });
    this.selectedReco.key = 15;
    this.selectedReco.dataSet = recoItem.placementName;
    this.selectedReco.ruleName = recoItem.placementName;
    this.selectedReco.datasetType = recoItem.datasetType;
  //  this.dataSetName = recoItem.placementName;
   // this.pageTypeSelected = recoItem.pageType;
   // this.maxCountLayout = this.sliderValue;
    this.checkmarkEnable1 =  true;
    this.checkmarkEnable2 =  true;
    this.navigatorActiveStage1 = false;
    this.navigatorActiveStage2 = false;
    this.navigatorActiveStage3 = true;
    //this.resetEditSection(this.sliderValue);
  }
  editRecoSelection(): void {
    this.editModeEnable = false;
    this.resetcommendation();
  }
  getpreBuildBindingAttrData(){
    let url: any;
    if(this.isPersonalizeTagMode) {
      url = AppConstants.API_END_POINTS.GET_PRODUCT_RECO_PREBUILD+'0&recoType=4';
    } else {
      url = AppConstants.API_END_POINTS.GET_PRODUCT_RECO_PREBUILD+this.commChannelKey+'&recoType=4';
    }
    this.httpService
      .post(url).subscribe((data) => {
        if(data.status === 'SUCCESS'){
          this.prebuildBindAttributesObj = data.response;
          //this.dataSetApiCall();
          //console.log(data.response);
        }
      });
  }
  
  dataSetApiCall(){
    this.showLoader = true;
    let url: any;
    if(this.isPersonalizeTagMode) {
      url = AppConstants.API_PERSONSOALIZATION_TAGS_END_POINTS.GET_All_PERSONALIZATION_PLACEMENTS+this.tagKey;
    } else {
      url = AppConstants.API_END_POINTS.GET_All_PLACEMENTS_PAGE_TYPE+this.promotionKey;
    }
    this.httpService
      .post(url).subscribe((data) => {
        if(data.status === 'SUCCESS'){ 
          this.showLoader = false;
          this.placementDataWithPageType= JSON.parse(data.response.placement);
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
            
            //this.pageTypeMethod(this.pageTypeData[0]);
            this.emailPageData = this.rowDataForPlacementTable[this.pageTypeData[0]];
            this.modelDataListsArry = this.emailPageData;
            

            //this.pageSelectedId = this.pageTypeData[0];
            //this.selectLayout('layout1',0);
           // this.selectionRuleType = false;
            this.showActivityRulesGrid = true;
           // setTimeout(() => {
              this.enableFooterBtns = true;
           // }, 500);           
            console.log(this.rowDataForPlacementTable);
          }
          
      });
  }
  
  resetcommendation(): void {
    this.recoType = 'All';
    this.searchText = '';
    this.tempListArray = this.combinedArray;
    this.noResultFound = false;
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

  onChangeSLiderVal(evt,layout){
    if(evt.currentTarget == undefined) {
     this.sliderValue = parseInt(evt);
    } else {
    this.sliderValue = evt.currentTarget.getElementsByClassName('ngx-slider-model-value')[0].innerText;
    }
    if(this.sliderValue == 0){
     this.sliderValue = 1
    }
    this.maxCountLayout = this.sliderValue;
    this.resetEditSection(this.sliderValue);
    if(this.customLayoutEnabled){
     this.childProductArrtibuteComponent.counterUpdatePreview(this.sliderValue);
    }   
        this.selectLayout(this.layout,this.templateKey, this.layoutIndex);
   }
  selectLayoutRecoProduct(type, evt){
    if(type === 0){ // Default layout design
      this.chooseLayoutType = 0;
      this.customLayoutEnabled = false;
      this.selectLayout('layout1',0, 0);
    }else{ // Custom Layout design
      this.chooseLayoutType = 1;
      //this.confirmAlert(evt);
    }
  }
  resetEditSection(n:number): void {
    this.noOfReco = n;
    this.previewArr.length = n;
  }
  insertAttributesintoHtml(layout: string) {
    if(this.prebuildBindAttributesObj !== undefined){
      var selObj = JSON.parse(this.prebuildBindAttributesObj.find(x => x.templateName == layout)?.templateText);
      this.productPreBuildAttrObj = selObj;
      this.prodImg = '{'+selObj.imgURL+'}';
      this.prodCode = '{'+selObj.title+'}';
      this.prodDesc = '{'+selObj.desc+'}';
    }
  }
  selectLayout(layout:string, templateKey:number, count): void {
    this.layout = layout;
    this.templateKey = templateKey;
    this.layoutIndex = count;
    this.dynamicContentObj.emit({'layout':layout,'templateKey':templateKey,'maxCount':this.sliderValue, 'freeStyle':!this.fixedLayout});
    if(layout === 'layout1' || layout === 'layout3') {
      this.resetEditSection(this.sliderValue);
    } else {
      this.resetEditSection(this.sliderValue);
    }
    this.insertAttributesintoHtml(layout);
    this.insertData();
    const parentElement = this.elementRef.nativeElement.querySelector('.scrollViewTemp');
    if(parentElement != null) {
      //const htmlNode = this.convertToHtmlNode(this.layoutArray[count].htmlHeader);
      //const htmlBody = this.convertToHtmlNode(this.layoutArray[count].templateContent);
      // this. renderer.appendChild(htmlNode, htmlBody);
      parentElement.innerHTML = ''
      // this.renderer.appendChild(parentElement, htmlNode);
      let copiedElement:any = [];let str:any;
      let htmlParent = "";

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
       str = this.layoutArray[count].htmlHeader+str+this.layoutArray[count].htmlFooter;
       parentElement.innerHTML = str;

       this.selectedLayoutJSON = JSON.parse(this.layoutArray[count].templateJson);
    }
  }
  layoutChange(){
    
    if(this.selectedLayout === "freeStyleLayout"){
      this.fixedLayout=false;
    }
    else{
      this.fixedLayout=true;
      this.selectLayout(this.layout,this.templateKey, this.layoutIndex);
    }

    this.shareService.freeStyleLayout[this.modelNameSelectedForLayoutPg]  = {
      isFreeStyleLayout : !this.fixedLayout,
      maxCount : this.maxCountLayout
    }
    
    this.shareService.maxCount = this.maxCountLayout;
    this.selectLayout(this.layout,this.templateKey, this.layoutIndex);
  }
  insertData(): void {
    let type: string;
    if(this.selectedReco.recoType == '1') {
      type = 'RO';
    } else if(this.selectedReco.recoType == '2') {
      type = 'RP';
    } else {
      type = 'SO';
    }

    
  }
  onClose(): void {
    if(this.bsModalRef !== undefined) {
      this.bsModalRef.hide();
    }
  }
  gobackToGridPage(){
    //this.navigateStage1();
  }
  // goBackToMergeTagNBrowse(){
  //   this.advancePageEnabled = true;
  //   this.checkmarkEnable1 =  true;
  //   this.checkmarkEnable2 =  true;
  //   this.navigatorActiveStage1 = false;
  //   this.navigatorActiveStage2 = true;      
  //   this.navigatorActiveStage3 = false; 
  //     this.navigatorActiveFinalStage3 = false;
  //     if(this.basicAdvaceVal.advance){
  //       GlobalConstants.browseProdActiveEnable = true;
  //     }else{
  //       GlobalConstants.browseProdActiveEnable = false;
  //     }     
  //   this.advanceStage2 = true; 
  //   setTimeout(() => {
  //       if(this.productPageAdvance !== undefined){
  //         // this.productPageAdvance.basicAdvanceEnabled = false;
  //         // this.productPageAdvance.advanceDetailsPage = true;
  //         this.productPageAdvance.advanceChecked = true;
  //     this.productPageAdvance.showContentAgGrid = false;      
  //     this.productPageAdvance.collectDataForAdvance();
  //       //this.selectRecommendation(this.selctedDataJsonObj); 
  //     this.productPageAdvance.getMergeTagData();
  //     //console.log(this.advanceSavedDataObj);
  //   }
  //   }, 500);
    
  // }
  gobackToAdvancePage(){
    //this.navigateStage2();
  }
  backToTipicalFromAdvance(basic){
    //this.navigateStage2();
  }
  basicAdvanceMethod(obj){
    this.basicAdvaceVal = obj;
  }
  modelDataCollectionMethod(savedObj){
    this.advanceSavedDataObj = savedObj;
  }
  ngOnInit(): void {
  }
}
