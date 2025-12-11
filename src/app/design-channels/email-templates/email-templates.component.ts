import { Component, OnInit,Input, Output, EventEmitter,TemplateRef,ViewChild, ElementRef,NgZone} from '@angular/core';
import { HttpService } from '@app/core/services/http.service';
import { GlobalConstants } from '../common/globalConstants';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router, RouterLink } from '@angular/router';
import { AppConstants } from '@app/app.constants';
import { HttpParams } from '@angular/common/http';
import { SharedataService } from '@app/core/services/sharedata.service';
import { LoaderService } from '@app/core/services/loader.service';
import BeefreeSDK from '@beefree.io/sdk';
import { showThumbnail } from '../modalInterface';
import { DataService } from '@app/core/services/data.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import moment from 'moment';
@Component({
  selector: 'app-email-templates',
  templateUrl: './email-templates.component.html',
  styleUrls: ['./email-templates.component.scss']
})
export class EmailTemplatesComponent implements OnInit {
  // @ViewChild('imgThumbnail') thumbnailImg;
  // @ViewChild('thumbnailPreviewSection') previewSection;
  loadTemplates: any;
  imgThumbnailView: any;
  public tempId: any;
  selectedItem:any = 0;
  isTemplateType: any = 0;
  modalRef?: BsModalRef;
  deviceViewStyle: Record<string, string> = {};
  isMobileView: boolean = false;
  isPreTemplate:boolean = true;
  isPreview:boolean = false;
  isTemplateEditMode:boolean = false;
  promoKey:any;
  promoCommKey: any;
  promotionObj:any;
  channelObj:any;
  @Output() onAdd = new EventEmitter<any>();
  vendorObj: any;
  commChannelKey: any;
  vendorDataObj: any = [];
  editModeData:any;
  ischannelTabs:boolean=true;
  imgThumbnailMobileView: any;
  defaultPreview: any;
  payloadSavingJson: any;
  isPayload: boolean = false;
  templateConentObj: any;
  promoExecutedOrRunning: any;
  currentSplitId:any;
  _object = Object;
  latest: boolean = false;
  searchObj: any;
  vendorDesc: any;
  subject: any;
  preHeader: any;
  currentChannelName: any;
  channelName: any;
  loadThumbnailContent: any;
  previewHTMl: any;
  isDefaultStorageBEE:any;
  isFailsafeactiveTab: any;
  isTemplateLibraryMode:boolean = false;
  gridView:boolean = false;
  page:any = 1;
  pageSize:any  = 6;
  collectionSize:any;
  paginateData: any;
  overLayEditTempPopup: boolean = false;
  activeLayoutView: number = 0;
  emptyLoadJsonMode: boolean = false;
  isDeleteEnable:boolean = true;
  arrayOfDeleteTemp: string[] = [];
  isMultidelete: any;
  isSelecteDeleteId: any;
 // @Output() previewMode = new EventEmitter<boolean>();
  constructor(private http: HttpService, private router: Router,private shareService:SharedataService, private loader: LoaderService, private dataService: DataService, private ngZone: NgZone,
    private translate: TranslateService) { 
    this.shareService.templateLibrary.subscribe(res => {
      this.isTemplateLibraryMode = res;
      if(!this.isTemplateLibraryMode){
        this.gridView = true;
      }
    });
    
    this.initializeComponent();  
    
    this.loader.ShowLoader();
    this.shareService.failSafeTabActive.subscribe(res => {
      this.isFailsafeactiveTab = res;
    });
    
    this.loadEditorFresh();
    this.loader.HideLoader();     
  }

  async initializeComponent() {
    try {
      if(!this.isTemplateLibraryMode){
        await this.getPromotionKey(); 
        await this.getpromoChannelObj();
        await this.getSavedTemplatePromo();

        this.loader.ShowLoader();
        if (GlobalConstants.isPreviewMode) {
          await this.getPayLoadJson();
        }
      } else{
        this.loadCurrentObj();
      }
    } catch (error) {
      console.error('Initialization error:', error);
    }
  }

  ngOnInit(): void {   
       
  }
  async getpromoChannelObj() {
    let url = AppConstants.API_END_POINTS.GET_MAP_PROMO_CHANNELS+`?promoKey=${GlobalConstants.promoKey}`;
    const resultObj = await this.http.post(url).toPromise();
    this.channelObj = resultObj;
    GlobalConstants.channelObj = this.channelObj;
    this.shareService.channelObj.next(this.channelObj);
    this.loadCurrentObj();
    //this.shareService.tenentKeyAsCompanyKey.next(this.channelObj[0].companyKey);
    console.log(this.channelObj);    
  }   
  setActiveTab(){
    if(this.currentSplitId !== undefined){
      if(this.channelObj !== undefined){
        const setAct = this.channelObj.findIndex(x => x.promoSplitId === this.currentSplitId);
        this.shareService.setActiveChannelTab.next(setAct);
      }
    }
  }
  async getSavedTemplatePromo(){ 
    let url = AppConstants.API_END_POINTS.GET_SAVED_USAGE_TEMPLATES+`?promoKey=${GlobalConstants.promoKey}`;
    const data = await this.http.post(url).toPromise();
   // this.http.post(url).subscribe(data => {
      if(data.status == "SUCCESS" ){
        if(data.response == ""){
          this.isTemplateEditMode = false;
        }else{         
          if(Object.keys(data.response.adminCommTemplate).length > 0){ 
            this.editModeData = JSON.parse(data.response.adminCommTemplate);
            console.log(this.editModeData);
            //const findId = this.editModeData.find(x => x.channelType === AppConstants.CHANNEL_INFO.CHANNEL_TYPE.EMAIL);
            const findId = this.editModeData.find(x => x.promoSplitKey == this.currentSplitId);
            if(findId === undefined){
              GlobalConstants.isEditMode = false;
              this.isTemplateEditMode = false;
            }else{
              this.isTemplateEditMode = true;
              GlobalConstants.isEditMode = true;
              this.shareService.savedAdminComTemplateObj.next(this.editModeData);
            }
          }            
          if(Object.keys(data.response.promotion).length > 0) {
            this.promoExecutedOrRunning = data.response.promotion.promoExecutedOrRunning;
            this.dataService.setLastSavedStep = data.response.promotion.lastSavedStep;
            this.dataService.setRunningPromotion = data.response.promotion.promoExecutedOrRunning;
            this.shareService.ispromoExecutedOrRunning.next(this.promoExecutedOrRunning);
          }
          
          GlobalConstants.promotionSplitHelper = JSON.parse(data.response.promotionSplitHelper);
          if(Object.keys(data.response.promotionSplitHelper).length > 0) {
            GlobalConstants.varArgs = GlobalConstants.promotionSplitHelper.splitsGroups[0].channels[0].varArgs.root.item;
          }
        }
        //GlobalConstants.isEditMode = this.isTemplateEditMode;
       // this.loadCurrentObj();
        this.EditLoadData();
      }else if(data.status == "FAIL"){
        this.loader.HideLoader();
      }
   // });
  }
  getChannelObj(){
    this.shareService.channelObj.subscribe(res => {
      this.channelObj = res;
    });
  }
  EditLoadData(){    
    if(this.isTemplateEditMode){
      // load Edit Template        
      //if(GlobalConstants.isSavedEmails){
        this.shareService.channelsPayloadObj.next(this.editModeData);
        GlobalConstants.payLoadSavedObjAllChannels = this.editModeData; // set channel obj
        const curtObj = this.editModeData.find(x => x.promoSplitKey == this.currentSplitId);
        if(typeof(curtObj) != "undefined"){
          this.vendorDesc = curtObj.senderName;
          this.preHeader = this.dataService.checkNullUndefinedEmpty(curtObj.preHeader);
          this.subject = curtObj.subjectLine.replaceAll("<tonewidget>","&lt;tonewidget&gt;").replaceAll("</tonewidget>","&lt;/tonewidget&gt;");
          this.getRunningOrExecutedObj();
          GlobalConstants.isPreviewMode = true;      
          this.isPreview = true;          
          this.setIframeStyle(this.loadThumbnailContent);
          this.shareService.failSafePreviousTab.next(0);
          this.shareService.isTemperarySave.next(true);
          //this.shareService.subjectObj.next();       
        }else{          
         this.backToTemplateView();
        }    
      // }else{
      //   this.shareService.channelsPayloadObj.next(GlobalConstants.payLoadSavedObjAllChannels);
      // }      
     
     // this.directCallToBeeEditor();
      this.loader.HideLoader();
    }
    else if(this.isPayload){
      // indiviual tab preview after save email        
      this.isPreview = true; 
      GlobalConstants.isPreviewMode = this.isPreview;             
      this.loader.HideLoader();
    } 
  }
  loadEditorFresh(){
    //Load Bee Editor pre-template
    this.defaultTemplateEnabled();     
    this.isPreview = false;
    GlobalConstants.isPreBuildTemp = this.isPreTemplate;
    this.loader.HideLoader();
    //}
  }
  loadCurrentObj(){
    this.shareService.currentSelectedChannelObj.subscribe((res:any) => {
      this.currentSplitId = res.currentSplitId;
      this.promoKey = res.promotionKey;
      this.commChannelKey=res.commChannelKey;
      this.channelName = res.channelName;
    });
    this.setActiveTab();
  }
  
  getPayLoadJson(){
    //this.loadCurrentObj();
    this.payloadSavingJson = GlobalConstants.payLoadSavedObjAllChannels;
    if(this.payloadSavingJson.channels !== undefined){
    this.vendorDesc = this.payloadSavingJson.channels[0].subjectObj.vendorDesc;
    this.subject = this.payloadSavingJson.channels[0].subjectObj.subject;
    this.preHeader = this.payloadSavingJson.channels[0].subjectObj.preHeader;
    this.tempId = this.payloadSavingJson.channels[0].uuid;
    this.isPayload = true;
    this.imgThumbnailView = JSON.parse(this.payloadSavingJson.channels[0].thumbnailImage).thumbnail_desktop;
    this.imgThumbnailMobileView = JSON.parse(this.payloadSavingJson.channels[0].thumbnailImage).thumbnail_mobile;
    }
  }
  getRunningOrExecutedObj(){// old promotion saved already on load data
    let subObj = {};
    this.payloadSavingJson = GlobalConstants.payLoadSavedObjAllChannels;
    const cuurtObj = this.payloadSavingJson.find(x => x.promoSplitKey == this.currentSplitId);
    this.isPayload = true;
    this.imgThumbnailView = JSON.parse(cuurtObj.thumbnailImage).thumbnail_desktop;
    this.imgThumbnailMobileView = JSON.parse(cuurtObj.thumbnailImage).thumbnail_mobile;
    this.loadThumbnailContent = cuurtObj.templateText;    
  }
  getPromotionKey(): void {   
    const url = window.location.href;
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      this.promoKey = httpParams.get("promotionKey");
      GlobalConstants.promoKey = this.promoKey;      
      this.promoCommKey = httpParams.get("promoCommunicationKeys");
      GlobalConstants.promoCommKey = this.promoCommKey;
      this.promotionObj={ "promoKey":this.promoKey,"promoCommKey":this.promoCommKey }
      this.shareService.promoKeyObj.next(this.promotionObj);      
    }else{
      if(GlobalConstants.isSavedEmails && GlobalConstants.promoKey !== undefined){
        this.promoKey=GlobalConstants.promoKey;
        this.promoCommKey = GlobalConstants.promoCommKey;

      }
    }
  }
  directCallToBeeEditor(){
    this.isPreview = false;
    if(Object.keys(this.editModeData.length > 0)){
      this.shareService.failSafeTabActive.next(false);
      this.shareService.savedTemplateObj.next(this.editModeData);
      // reset when incomplete promo edit again
      this.payloadSavingJson={}
    GlobalConstants.payLoadSavedObjAllChannels = [];    
      this.router.navigate(['/bee-editor']);
    }    
}
  getDeviceView(deviceId){
    if(deviceId == "Desktop"){
      this.isMobileView = false;
    }else{
      this.isMobileView = true;
    }
    
  }
  openPreviewModal() {
    if(typeof(this.tempId) !== 'undefined'){
      if(this.selectedItem == '0' && this.tempId === 1){
      //this.shareService.isDefaultStorageBee.next(this.isDefaultStorageBEE); 
      let urlPath = this.accessTemplatesContentFrom(this.isDefaultStorageBEE,this.tempId);  
      GlobalConstants.urlPath = urlPath;
      this.onAdd.emit(urlPath);
      GlobalConstants.vendorObj = this.vendorObj;
      GlobalConstants.channelObj = this.channelObj;
      GlobalConstants.promoKey=this.promoKey;
      GlobalConstants.promoCommKey=this.promoCommKey;
      GlobalConstants.isPreviewMode = this.isPreview;
      GlobalConstants.templateKey = this.tempId;
      this.shareService.isEmptyJsonToload.next(false);
      this.router.navigate(['/bee-editor']);      
        //this.directCallToBeeEditor();
      }else{
        if(this.imgThumbnailView === undefined && this.imgThumbnailMobileView === undefined){
         //this.shareService.isDefaultStorageBee.next(this.isDefaultStorageBEE);
         const urlPath = this.accessTemplatesContentFrom(this.isDefaultStorageBEE,this.tempId);
          if(this.isPreTemplate){
            this.getPreviewTemplateHTML(urlPath);
          }else{
            this.getPreviewTemplateHTML(AppConstants.API_END_POINTS_OTHERS.GET_SELECTED_TEMPLATE_CONTENT+this.tempId);
          }        
        }        
        this.isPreview = true;  
        GlobalConstants.isPreviewMode = this.isPreview;  
        //------ Create Thumbnail using Html code---------  
        // setTimeout(() => {
        //   let ele: any = document.querySelector('#thumbnailContent');
        //   ele.contentDocument.body.insertAdjacentHTML('beforebegin',this.loadThumbnailContent);
        // },1000);  
      }  
    }       
  }
   deleteMySaveTemplateS3(deleteId?){     
     if(deleteId === undefined){
      deleteId = this.arrayOfDeleteTemp;
     }
      Swal.fire({
        title:this.translate.instant('designEditor.emailEditor.validationMgs.deleteTemplate'),
        text: this.translate.instant('designEditor.emailEditor.validationMgs.deleteTemplateMgslbl'),
        //titleText:'Delete Template',
        //icon: 'warning',
		    showCloseButton:true,
        showCancelButton: true,
        confirmButtonText: this.translate.instant('designEditor.yesBtn'),
        cancelButtonText: this.translate.instant('designEditor.cancelBtn'),
        allowOutsideClick:false,
        allowEscapeKey:false,
        customClass:{
          //cancelButton:"buttonCssStyleRed",
          confirmButton:"buttonCssStyleRed",
        },
      }).then((result) => {
        if (result.value) {
          //this.deleteMethod(this.arrayOfDeleteTemp); // multiple delter scenario
          this.deleteMethod(deleteId);
        }
      });

   
  }
  async deleteMethod(delId){
    await this.http.delete(AppConstants.API_END_POINTS_OTHERS.DELETE_S3_MY_TEMPLATE+delId).toPromise().then((result) => {
      if(result.status == "SUCCESS"){
        this.accessDefaultTemplatesFrom(this.isDefaultStorageBEE);
        Swal.fire({
          title: result.response,
          allowEscapeKey: false,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: this.translate.instant('designEditor.okBtn'),
        });
      }else{
        Swal.fire({
          title: result.response,
          allowEscapeKey: false,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: this.translate.instant('designEditor.okBtn'),
        });
      }
    });
  }
  getDefaultTemplates(url){
    if(this.isDefaultStorageBEE){
      this.http.BeePost(url).subscribe(data => {
        this.getResponeData(data.results);  
      });     
    }else{
      this.http.post(url).subscribe(data => {
        this.getResponeData(data.results);  
      });     
    } 
  }
  async getPreviewTemplateHTML(url){      
    const html = await this.http.post(url).toPromise();
    if(html !== undefined){
      //this.loadThumbnailContent = html; 
      this.imgThumbnailView = html.thumbnail;
      this.imgThumbnailMobileView=html.thumbnail;
    }    
}

  
  getResponeData(data){
    // ---------- Pre template -----------
    if(this.isTemplateType == 0){
      this.loadTemplates = data;
      this.collectionSize = data.length;
      if (this.loadTemplates.some(item => item.uuid === undefined)) {
        this.loadTemplates.forEach(item => {
          item.uuid = item.id;
        });
      }
      this.tempId = this.loadTemplates[0].uuid;
      this.sortByDate('desc',this.loadTemplates);
      this.getPaginateData();
      this.latest = false;
      //this.getPaginateData(this.loadTemplates);
    }else{
      //--------- My template ------------
      this.loadTemplates = data;
      this.collectionSize = data.length;
      if (this.loadTemplates.some(item => item.uuid === undefined)) {
        this.loadTemplates.forEach(item => {
          item.uuid = item.id;
        });
      }
      this.tempId = this.loadTemplates[0].uuid;
      this.getPaginateData();
      this.latest = false;
      //this.getPaginateData(this.loadTemplates);
    }       
  }
  getThumbnailImg(obj: showThumbnail){
    // obj.thumbnail_desktop = this.templateConentObj.thumbnail_large;
    // obj.thumbnail_mobile = this.templateConentObj.thumbnail;
    this.shareService.thumnailImages.next(obj);
  }  
  sortByDate(order: 'asc' | 'desc' = 'asc', templatesObj) {
    templatesObj.sort((a, b) => {
      let adt:any = moment(a.modifiedDate,"DD-MM-YYYY"); // Same format is hardcoded frombackend as well, so keeping the same.
      let bdt:any = moment(b.modifiedDate,"DD-MM-YYYY");
      const dateA = new Date(adt).getTime();
      const dateB = new Date(bdt).getTime();
  
      if (order === 'asc') {
        return dateA - dateB; // Ascending order
      } else {
        return dateB - dateA; // Descending order
      }
    });
    
  }
  searchTemplate(event){
    if(event.target.value === '') {
      this.accessDefaultTemplatesFrom(this.isDefaultStorageBEE);    
    } else {
      this.loadTemplates = this.loadTemplates.filter((item) => {
        return item.title.toLowerCase().indexOf(event.target.value.toLowerCase().trim()) > -1;
      });
      if(this.isTemplateLibraryMode){
        //this.paginateData = this.loadTemplates;
        this.getPaginateData();
      }
      
    }    
  }
  getThumbnailView(imgView, mobileView){
   // this.overLayEditTempPopup = true;
    this.defaultPreview =   imgView;
  }
  getThumbnailId(imgView, mobileView,id,index){
    this.tempId = "";
    this.tempId = id;    
    this.selectedItem = index;
    this.imgThumbnailView = imgView;
   this.imgThumbnailMobileView = mobileView;
  GlobalConstants.templateKey = this.tempId;
  this.templateConentObj={"thumbnail_desktop":this.imgThumbnailView,"thumbnail_mobile":this.imgThumbnailMobileView}
  this.getThumbnailImg(this.templateConentObj);
  }
  editTemplateSelected(){
    if(this.isTemplateEditMode){
      this.templateConentObj={"thumbnail_desktop":this.imgThumbnailView,"thumbnail_mobile":this.imgThumbnailMobileView}
      this.getThumbnailImg(this.templateConentObj);
      this.directCallToBeeEditor();
      GlobalConstants.isPreviewMode = this.isPreview;
    }else{
      let urlPath: any;
      this.isPreview = false;
      GlobalConstants.isPreviewMode = this.isPreview;
      //this.shareService.isDefaultStorageBee.next(this.isDefaultStorageBEE);
      this.shareService.failSafeEnable.next(false);
      this.shareService.failSafeTabActive.next(false);
      this.shareService.isEmptyJsonToload.next(false);
      if(this.isPreTemplate){
        urlPath = this.accessTemplatesContentFrom(this.isDefaultStorageBEE,this.tempId);  
      }else{
        urlPath = AppConstants.API_END_POINTS_OTHERS.GET_SELECTED_TEMPLATE_CONTENT+this.tempId;  
      }        
      GlobalConstants.urlPath = urlPath;      
      this.onAdd.emit(urlPath);
      this.loadCurrentObj();
    }   
  }
  switchLink(evnt){
    const ele = evnt.target.value;
    this.loadTemplates = [];
    if(ele == '0'){
      this.isPreTemplate = true;
      this.selectedItem = 0;
      GlobalConstants.isPreBuildTemp = this.isPreTemplate;      
      //'https://beefree.io/wp-json/v1/catalog/templates//?page=1&pagesize=30&context=free',ele);
      this.accessDefaultTemplatesFrom(this.isDefaultStorageBEE);
    }else{
      this.isPreTemplate = false;
      this.selectedItem = 0;      
      this.imgThumbnailView = undefined;
      GlobalConstants.isPreBuildTemp = this.isPreTemplate;      
      this.accessDefaultTemplatesFrom(this.isDefaultStorageBEE);     
    }
  }
  accessDefaultTemplatesFrom(storageFrom){
    if(storageFrom){
      // From BEE Storage
      this.getDefaultTemplates(AppConstants.API_END_POINTS_OTHERS.GET_BEE_TEMPLATES);
    }else{
      // From S3 Storage
      if(this.isPreTemplate){
        if(this.isTemplateLibraryMode){
          this.getDefaultTemplates(AppConstants.API_END_POINTS_OTHERS.GET_MY_TEMPLATES);
        }else{
          this.getDefaultTemplates(AppConstants.API_END_POINTS_OTHERS.GET_S3_TEMPLATES);
        }
      }else{
        this.getDefaultTemplates(AppConstants.API_END_POINTS_OTHERS.GET_MY_TEMPLATES);
      }      
    }
  }
  accessTemplatesContentFrom(storageFrom,templateId){
    let url:any = "";
    if(storageFrom){
      // From BEE Storage Content
      url = AppConstants.API_END_POINTS_OTHERS.GET_TEMPLATE_CONTENT+templateId;
    }else{
      // From S3 Storage Content
      url =  AppConstants.API_END_POINTS_OTHERS.GET_S3_TEMPLATE_CONTENT+templateId;
    }
    return url;
  }
  async defaultTemplateEnabled(){
    const defaultStorageFlagBackEnd = await this.http.get("/configurationProperty/getProperty?property.name=pp.bee.template.default.enabled").toPromise();
    if(defaultStorageFlagBackEnd !== null || defaultStorageFlagBackEnd !== undefined){
      this.isDefaultStorageBEE = defaultStorageFlagBackEnd.body;
      if(this.isDefaultStorageBEE){
        this.isPreTemplate = true; // links active
      }else{
        this.isPreTemplate = false; // links active
      }   
      this.shareService.isDefaultStorageBee.next(this.isDefaultStorageBEE); 
      this.accessDefaultTemplatesFrom(this.isDefaultStorageBEE);
      console.log(defaultStorageFlagBackEnd.body);
    }
  }

  backToTemplateView(){    
    if(this.isTemplateEditMode && this.isPreview){
    this.confirmAlert();            
    }else{
      this.initTempLoad();
    }
  }
  initTempLoad(){
    this.isTemplateEditMode = false;
    this.isPreview = false;
    GlobalConstants.isPreviewMode = this.isPreview;
    this.selectedItem = 0;
    this.imgThumbnailView = undefined;
    this.imgThumbnailMobileView = undefined; 
    this.defaultPreview = undefined;
    if(this.loadTemplates !== undefined){
      this.tempId = this.loadTemplates[0].uuid; // asigning to default empty template.
    }else{
      this.tempId = undefined // asigning to default empty template.
    }
    if(this.loadTemplates !== undefined){
      this.tempId = this.loadTemplates[0].uuid; // asigning to default empty template.  
    }
    if(this.isTemplateLibraryMode){
      this.tempId = undefined;
    }
    this.isPayload = false;
    GlobalConstants.isEditMode = false;
  }
  onsave(){
    const beeInit = new BeefreeSDK();
  }
  confirmAlert(){
    Swal.fire({
      title: this.translate.instant('designEditor.emailEditor.validationMgs.changeTempateAfeterSaveWaringMgslbl'),
      //text: 'Your saved data will be lost!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('designEditor.yesBtn'),
      cancelButtonText: this.translate.instant('designEditor.cancelBtn')
    }).then((result) => {
      if (result.value) {
        this.initTempLoad();
      }
    })
  }
  loadFreshChannel(isFalse){
    this.isPayload = isFalse;
    this.isTemplateEditMode = isFalse;
    GlobalConstants.isEditMode = isFalse;
    GlobalConstants.isPreviewMode = isFalse;
    this.isPreview = isFalse;
    GlobalConstants.templateKey = 1;
  }
  loadSavedChannel(savedObj){
    if(savedObj !== undefined){
    const savedObjCurrent = savedObj.find(x => x.promoSplitKey == this.currentSplitId);
    //this.payloadSavingJson = savedObj;
    const isTrue = true;
    const thumbnailImg = JSON.parse(savedObjCurrent.thumbnailImage);
    let index = this.channelObj.findIndex(x => x.promoSplitId == savedObj.promoSplitKey);
    if(index == undefined){
      index = 0;
    }  
    this.vendorDesc= savedObjCurrent.senderName;
    this.imgThumbnailMobileView= thumbnailImg.thumbnail_mobile;
    this.imgThumbnailView=thumbnailImg.thumbnail_desktop;
    this.isPayload = isTrue;
    this.isTemplateEditMode = isTrue;
    GlobalConstants.isEditMode = isTrue;
    GlobalConstants.isPreviewMode = isTrue;
    this.isPreview = isTrue;
    GlobalConstants.templateKey = savedObjCurrent.templateParentKey; 
    if(this.isFailsafeactiveTab){
      index = 1;
      if(savedObjCurrent.failSafe){
        this.preHeader= this.dataService.checkNullUndefinedEmpty(savedObjCurrent.failSafePreHeader);
        this.subject= savedObjCurrent.failSafeSubjectLine;
        GlobalConstants.setActiveTab = index;
        this.shareService.activeSplitId.next(index); 
        this.loadThumbnailContent = savedObjCurrent.failSafetemplateText;
        this.setIframeStyle(this.loadThumbnailContent);
      }      
    }else{
      index = 0;
      this.preHeader= this.dataService.checkNullUndefinedEmpty(savedObjCurrent.preHeader);
      this.subject= savedObjCurrent.subjectLine;
      GlobalConstants.setActiveTab = index;
      this.shareService.activeSplitId.next(index); 
      this.loadThumbnailContent = savedObjCurrent.templateText;
      this.setIframeStyle(this.loadThumbnailContent);
    }  
   }else{
    if(Object.keys(this.loadTemplates).length > 0){
      this.accessDefaultTemplatesFrom(this.isDefaultStorageBEE);
    }
   }
  // this.removeLoader();
 }
removeLoader(){
   this.ngZone.run(() => {
   this.loader.loadCount = 0;
   this.loader.HideLoader();
  });
}
layoutView(view){
 if(view == 0){
   this.activeLayoutView = 0; //0 is List view
   this.gridView = false;
 }else{
  this.activeLayoutView = 1; //1 is Grid view
  this.gridView = true;
 }
 this.latest = false;
}
sortingTypeMethod(type){
  // true -> 'asc', false-> 'desc'
  if(type){
    this.latest = true;
  }else{
    this.latest = false;
  }
  
  this.getPaginateData();
}
getPaginateData(){  
  if(!this.gridView){
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginateData = this.loadTemplates.slice(start, end);
    if(this.latest){
      this.sortByDate('asc',this.paginateData);
    }else{
      this.sortByDate('desc',this.paginateData);
    }   
    
   if(this.isMultidelete){
    this.arrayOfDeleteTemp = [];
    this.paginateData.forEach((element,index) => {
      //this.isSelecteDeleteId = element.uuid;
      this.arrayOfDeleteTemp.push(element.uuid);
    });
   }
  }else{
    if(this.latest){
      this.sortByDate('asc',this.loadTemplates);
    }else{
      this.sortByDate('desc',this.loadTemplates);
    } 
  }
    
 }
setIframeStyle(loadIframeContent){
  setTimeout(() => {
    let ele: any = document.querySelector('#thumbnailContent');
    //let htmlEle = "<div style='overflow:hidden'>"+this.loadThumbnailContent+"</div>";
    if(ele !== null){
      ele.contentDocument.head.innerHTML = "";
      ele.contentDocument.head.innerHTML = "<style type='text/css'>dynamic-content .row-content .image_block .pad .alignment img {position: unset !important;transform: unset !important;transition: unset !important;object-fit: unset !important;} dynamic-content .row-content .image_block .pad .alignment > div {padding-top: unset !important; }<style>";
      ele.contentDocument.body.innerHTML = loadIframeContent;
    }    
    this.removeLoader();
    //ele.contentDocument.body.insertAdjacentHTML('beforebegin',this.loadThumbnailContent);
  },1000);
}
getEmptyTemplateJson(){
  this.shareService.isEmptyJsonToload.next(true);
  this.onAdd.emit(""); // urlPath is undefined when empty json is called.
  
}
deleteTemplateS3(deltId,evt){
  if(evt.target.checked){
    this.isDeleteEnable = false;
    this.arrayOfDeleteTemp.push(deltId);
  }else{
    const indexDel = this.arrayOfDeleteTemp.indexOf(deltId);
    this.arrayOfDeleteTemp.splice(indexDel,1);
    if(this.arrayOfDeleteTemp.length === 0){
      this.isDeleteEnable = true;
    }
  } 
  console.log(this.arrayOfDeleteTemp);
}
multiDeleteTemplate(evt,currtList){
  if(evt.target.checked){
    if(currtList.length > 0){
      currtList.forEach((element,index) => {
        //this.isSelecteDeleteId = element.uuid;
        this.arrayOfDeleteTemp.push(element.uuid);
      });
      this.isMultidelete = true;
    }    
    this.isDeleteEnable = false;
  }else{
    this.isMultidelete = false;
    this.arrayOfDeleteTemp = [];
    this.isDeleteEnable = true;
  }
}


}
