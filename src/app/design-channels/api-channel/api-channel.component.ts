import { Component, OnInit,Input, Output, EventEmitter,TemplateRef,ViewChild, ElementRef,NgZone} from '@angular/core';
import { HttpService } from '@app/core/services/http.service';
import { GlobalConstants } from '../common/globalConstants';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router, RouterLink } from '@angular/router';
import { AppConstants } from '@app/app.constants';
import { HttpParams } from '@angular/common/http';
import { SharedataService } from '@app/core/services/sharedata.service';
import { LoaderService } from '@app/core/services/loader.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { DataService } from '@app/core/services/data.service';
import { OffersDrawerComponent } from '../offers-drawer/offers-drawer.component';
import lodash from "lodash";

@Component({
  selector: 'app-api-channel',
  templateUrl: './api-channel.component.html',
  styleUrls: ['./api-channel.component.scss']
})
export class ApiChannelComponent implements OnInit {
  @ViewChild('requestBodyElementRefence') requestBodyElementRefence! : ElementRef;
  @ViewChild('mergeTagComponentElem') mergeTagComponentFromAPIChannel! : OffersDrawerComponent;
  channelObj: any;
  currentSplitId: any;
  promoKey: any;
  commChannelKey: any;
  channelName: any;
  isPayload: any;
  isTemplateEditMode: any;
  isPreview: any;
  vendorDesc: any;
  imgThumbnailMobileView: any;
  imgThumbnailView: any;
  isFailsafeactiveTab: any;
  preHeader: any;
  subject: any;
  loadThumbnailContent: any;
  isTemplateLibraryMode: boolean = false;
  gridView: boolean = false;
  smsTemplates:any = [];
  keyValueArray: any[] = [{key: '', value: '', add: true}];
  keyValueArrayFormData: any[] = [{key: '', value: '', add: true}];
  keyValueArrayUrlEncode:any[] = [{key: '', value: '', add: true}];
  offerDrawerSectionEnable: boolean = false;
  backropOffersEnable: boolean = false;
  modalRef?: BsModalRef;
  channelSavedArray: any;
  promotionSplitHelper: any;
  noneFlagEnable:boolean = false;
  formDataFlagEnable:boolean = false;
  urlEncodeFlagEnable:boolean = false;
  rawJsonFlagEnable:boolean = false;
  mergeTagEnabled:boolean = false;
  requestMethodType: any = 'POST';
  APIUrlLink:any;
  apiSelectedTemplate: any = '0';
  finalAPIPayloadData: any;
  rawJsonContentText:any = "";
  codeMirrorOptions: any = {
    theme: 'paraiso-light',
    mode: 'javascript',
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: true,
    //gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: true
  };
  selectedTypeRequestBody: any;
  submitKeyValueDataObj: any;
  throttlingEnabled:boolean = false;
  isSaveAsTemplateEnable: boolean = false;
  currentObj: any;
  requestHeaderEnabled: boolean = false;
  isEditModeEnabled: boolean = false;
  apiChannelSavedTemplatesArray: any = [];
  isRequestMethodTypeDisabled: boolean = false;
  apiResponseType: any;
  APIEditObj: any;
  previousTemplateSelected: any;
  
  constructor(private http: HttpService, private router: Router,private shareService:SharedataService, private loader: LoaderService, private dataService: DataService, private ngZone: NgZone,
    private translate: TranslateService,private modalService:BsModalService) {
      AppConstants.OFFERS_ENABLE.MERGE_TAG = true;
      AppConstants.OFFERS_ENABLE.RECOMMENDATION_OFFERS = false;
      AppConstants.OFFERS_ENABLE.STATIC_OFFERS = false;
      this.shareService.templateLibrary.subscribe(res => {
        this.isTemplateLibraryMode = res;
        if(!this.isTemplateLibraryMode){
          this.gridView = true;
        }
      });
      this.shareService.currentSelectedChannelObj.subscribe((res:any) => {
        if(Object.keys(res).length > 0){
          this.currentSplitId = res.currentSplitId;
          this.promoKey = res.promotionKey;
          this.commChannelKey=res.commChannelKey;
          this.channelName = res.channelName;
          this.currentObj = res.currentObj;
          this.apiResponseType = JSON.parse(res.currentObj.apiType);
        }      
      });
      this.shareService.channelObj.subscribe(res => {
        this.channelObj = res;   
      });
      setTimeout(() => {
        this.getSavedData();
      }, 1000);
     }

  ngOnInit(): void {
  }
  setEditorContent(event) {
    // console.log(event, typeof event);
    console.log(event);
  }
  openTestAPIModal(modalTemplate: TemplateRef<any>){  
    let callSaveMethod = this.validationCheck();
    if(!callSaveMethod){
      return;
    }else{
      let currObj = this.channelObj.find(x => x.promoSplitId == this.currentSplitId);
      let APIJsonObj = JSON.stringify(this.makeRequestBodyJsonMethod());
      let encodedAPPIJsonObj = encodeURIComponent(APIJsonObj);

      let payloadJson = {
        channels: [{
          commChannelKey: currObj.commChannelKey,
          currentSplitid: currObj.promoSplitId,
          customercode: "",
          isTestList: false,
          msgContent: encodedAPPIJsonObj,
          promoKey: this.promoKey,
          senderId: currObj.senderId,
          senderName: currObj.senderId,
          testListId: 0,
          toAndroid :"",
          toIOS: "",       
          selectedOffers: currObj.selectedOffers,
          selectedRecoWidgets:[],
        }]
      }
    
    this.finalAPIPayloadData = payloadJson.channels[0];

    this.shareService.channelsPayloadObj.next(payloadJson.channels);
  }
    this.modalRef = this.modalService.show(modalTemplate,
      {
        class: 'modal-dialog-centered testPushModel',
        backdrop: 'static',
        keyboard: false
      }
    )
  }
  async getApiChannelSavedTemplatesMethod(){
    let endpoint = AppConstants.API_END_POINTS.GET_API_CHANNEL_SAVED_TEMPALTES+this.commChannelKey;
    let resultObj = await this.http.post(endpoint).toPromise();
    if(resultObj.status == 'SUCCESS'){
      let savedTemparry = JSON.parse(resultObj.response.templates);
      if(savedTemparry !== undefined){
        this.apiChannelSavedTemplatesArray = savedTemparry;
      }
    }else{
      Swal.fire({
        icon: 'warning',
        text: resultObj.response         
      })
    }
  }
  switchRequestBodyTypeMethod (evt,type) {
    let radioElem = this.requestBodyElementRefence.nativeElement;
    let radioCheckInpt = radioElem.getElementsByClassName('radioCheck');
    let evtRadio = radioElem.getElementsByClassName(type+'InputElem')[0];
     // set all radio to false
     [...radioCheckInpt].map( x => { x.checked = false;});
     this.selectedTypeRequestBody = type;
     if(!this.isEditModeEnabled){
      this.keyValueArrayFormData = [{key: '', value: '', add: true}];
      this.keyValueArrayUrlEncode = [{key: '', value: '', add: true}];
      this.rawJsonContentText = "";
     }    
   switch (type) {
    case 'none':
      this.noneFlagEnable = true;
      this.formDataFlagEnable = false;
      this.urlEncodeFlagEnable = false;
      this.rawJsonFlagEnable = false;            
      // if(evt === undefined){
      //   evtRadio.checked = true;
      // }else{
      //   evt.target.checked = true;
      // }
    break;
    case 'formData':
      this.noneFlagEnable = false;
      this.formDataFlagEnable = true;
      this.urlEncodeFlagEnable = false;
      this.rawJsonFlagEnable = false;
      //evt.target.checked = true;
    break;
    case 'urlEncode':
      this.noneFlagEnable = false;
      this.formDataFlagEnable = false;
      this.urlEncodeFlagEnable = true;
      this.rawJsonFlagEnable = false;
      //evt.target.checked = true;
    break;
    case 'rawJson':
      this.noneFlagEnable = false;
      this.formDataFlagEnable = false;
      this.urlEncodeFlagEnable = false;
      this.rawJsonFlagEnable = true;
      //evt.target.checked = true;
    break;
    
   }
   if(evt === undefined){
      evtRadio.checked = true;
    }else{
      evt.target.checked = true;
    }    
  }
  setActiveTab(){
    if(this.currentSplitId !== undefined){
      if(this.channelObj !== undefined){
        const setAct = this.channelObj.findIndex(x => x.promoSplitId === this.currentSplitId);
        this.shareService.setActiveChannelTab.next(setAct);
      }
    }
  }
  // Key Value Pair
  addNewKeyValue(item:any,type): void {
    let keyValueArrayTemp:any = [];
    if(type == 'formData'){
      keyValueArrayTemp = this.keyValueArrayFormData;
      this.addKeyvalueFromArrayMethod(keyValueArrayTemp,item);
    }else if(type == 'urlEncode'){
      keyValueArrayTemp = this.keyValueArrayUrlEncode
      this.addKeyvalueFromArrayMethod(keyValueArrayTemp,item);
    }else{
      keyValueArrayTemp = this.keyValueArray;
      this.addKeyvalueFromArrayMethod(keyValueArrayTemp,item);
    }    
  }
  addKeyvalueFromArrayMethod(arrayObj,item){
    if(arrayObj.length >= AppConstants.MOBILE_PUSH_RANGE.MIN && arrayObj.length < AppConstants.MOBILE_PUSH_RANGE.MAX) {
      item.add = false;
      if(arrayObj.length === 4) {
        arrayObj.push({key: '', value: '', add: false});
      } else {
        arrayObj.push({key: '', value: '', add: true});
      }
    }
  }
  removeKeyVlaueForArrayMethod(arrayObj,item){
    if(arrayObj.length <= AppConstants.MOBILE_PUSH_RANGE.MAX) {
      let index = arrayObj.indexOf(item);
      arrayObj.splice(index, 1);
      arrayObj[arrayObj.length - 1].add = true;
    }
  }
  removeKeyValue(item:any,type): void {
    let keyValueArrayTemp:any = [];
    if(type == 'formData'){
      keyValueArrayTemp = this.keyValueArrayFormData;
    }else if(type == 'urlEncode'){
      keyValueArrayTemp = this.keyValueArrayUrlEncode
    }else{
      keyValueArrayTemp = this.keyValueArray;
    }
    if(item.key !== '' || item.value !== '') {
      Swal.fire({
        title: this.translate.instant('designEditor.mobilePushComponent.dataValidation'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: this.translate.instant('yes'),
        cancelButtonText: this.translate.instant('cancel'),
        allowEscapeKey: false,
        allowOutsideClick: false,
      }).then((result) => {
        if (result.value) {
          this.removeKeyVlaueForArrayMethod(keyValueArrayTemp,item);
        }
      });
    } else {
      this.removeKeyVlaueForArrayMethod(keyValueArrayTemp,item);
    }
  }
  getSavedData() {
    let url = AppConstants.API_END_POINTS.GET_SAVED_USAGE_TEMPLATES+`?promoKey=${GlobalConstants.promoKey}`;
    this.http.post(url).subscribe((data) => {
      if(data.status === 'SUCCESS') {
        if(data.response.adminCommTemplate !== "") {
          this.channelSavedArray = JSON.parse(data.response.adminCommTemplate);
          this.shareService.channelsPayloadObj.next(this.channelSavedArray);
          this.APIEditObj = this.channelSavedArray.find(x => x.promoSplitKey === this.currentSplitId);
          this.isEditModeEnabled = true;
        }
        this.promotionSplitHelper = JSON.parse(data.response.promotionSplitHelper);
          if(Object.keys(this.promotionSplitHelper).length > 0) {
            GlobalConstants.varArgs = this.promotionSplitHelper.splitsGroups[0].channels[0].varArgs.root.item;
          }
          this.getApiChannelSavedTemplatesMethod();
          if(this.APIEditObj !== undefined) {    
            this.editModeDataFromSavedJSONMethod(this.APIEditObj);    
            this.previousTemplateSelected = this.APIEditObj.templateParentKey;   
           }
           else {
            this.setActiveTab();
            this.switchRequestBodyTypeMethod(undefined,'none');
          }
      }
    });
    this.setActiveTab();
    
  }
  insertDataintoArrayMethod(arryobj){
    let objSize = arryobj.length;
    let keyObj:any= {};
    let tempKeyval:any = [];
    arryobj.forEach((item,i) => {
      item.add = false;
      tempKeyval.push(item);
    });
    
    if(objSize > 0 && objSize < 5){
      let lastObj = lodash.findLastIndex(tempKeyval);
      tempKeyval[lastObj].add = true;
     // tempKeyval[tempKeyval.length - 1].add = false;
    }
    return tempKeyval;
  }
  editModeDataFromSavedJSONMethod(editObj){
    let apiSavedObj = JSON.parse(editObj.templateText);
    if(apiSavedObj !== undefined){
      if(editObj.templateParentKey !== undefined){
        this.apiSelectedTemplate = editObj.templateParentKey;
      }else{
        this.apiSelectedTemplate = editObj.dbKey;
      }      
      this.APIUrlLink = apiSavedObj.url;
      this.requestMethodType = apiSavedObj.type;
      this.keyValueArray = this.insertDataintoArrayMethod(apiSavedObj.headerParams);
      if(apiSavedObj.typeFrom == 'formData'){
        this.keyValueArrayFormData = this.insertDataintoArrayMethod(apiSavedObj.data.keyValue);
      }else if(apiSavedObj.typeFrom == 'urlEncode'){
        this.keyValueArrayUrlEncode = this.insertDataintoArrayMethod(apiSavedObj.data.keyValue);
      }else if(apiSavedObj.typeFrom == 'rawJson'){
        this.rawJsonContentText = lodash.unescape(JSON.parse(apiSavedObj.data.json))
      }//else{
      // }
      this.getRequestHeaderMethod(apiSavedObj.requestHeader);
      this.switchRequestBodyTypeMethod(undefined,apiSavedObj.typeFrom);
      }    
  }
  getRequestHeaderMethod(evt){
    if(evt !== undefined){
      let selectedApi = evt.target;
      if(selectedApi === undefined){
        selectedApi = evt;
      }else{
        selectedApi = selectedApi.checked;
      }
      this.requestHeaderEnabled = selectedApi;
      if(this.keyValueArray.length == 0 && this.requestHeaderEnabled){
        this.keyValueArray = [{key: '', value: '', add: true}];
      }
   }
  }
  getAPiTemplateMethod(evt){
    let selectedApi = evt.target;
    if(selectedApi === undefined){
      selectedApi = evt;
    }else{
      selectedApi = selectedApi.value;
    }    
    this.apiSelectedTemplate = selectedApi;
    let switchedTemplateObj = this.apiChannelSavedTemplatesArray.find(x => x.dbKey == selectedApi);    
    this.confirmBeforeSwitchTenmplateMethod(switchedTemplateObj);
  }
  confirmBeforeSwitchTenmplateMethod(newTemplateObj){
    Swal.fire({
      title: this.translate.instant('designEditor.mobilePushComponent.dataValidation'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('yes'),
      cancelButtonText: this.translate.instant('cancel'),
      allowEscapeKey: false,
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {
        if(newTemplateObj !== undefined){
          this.editModeDataFromSavedJSONMethod(newTemplateObj);
          this.previousTemplateSelected = newTemplateObj.dbKey;
        }else{
          this.resetAllValuesMethod(); // load blank template
          this.previousTemplateSelected = '0';
        }
      }else{
        // load old template when cancel
        // if(this.APIEditObj !== undefined){
        //   let oldObjTempKey = this.APIEditObj.templateParentKey;
        //   this.apiSelectedTemplate = oldObjTempKey;
        // }     
        this.apiSelectedTemplate = this.previousTemplateSelected;
      }
    });
  }
  resetAllValuesMethod(){
    this.apiSelectedTemplate = '0';
    this.APIUrlLink = "";
    this.requestMethodType = 'POST';
    this.keyValueArray = [{key: '', value: '', add: true}];
    this.keyValueArrayFormData = [{key: '', value: '', add: true}];
    this.keyValueArrayUrlEncode = [{key: '', value: '', add: true}];
    this.rawJsonContentText = "";
    this.requestHeaderEnabled = false;
    this.switchRequestBodyTypeMethod(undefined,'none');
  } 

  makeRequestBodyJsonMethod(){
    //let headerPramsObj = this.keyValueArray;
    if(this.selectedTypeRequestBody == 'formData'){
      this.submitKeyValueDataObj = this.headerPramsObjMethod(this.keyValueArrayFormData);
      this.rawJsonContentText = "";
    }else if(this.selectedTypeRequestBody == 'urlEncode'){
      this.submitKeyValueDataObj = this.headerPramsObjMethod(this.keyValueArrayUrlEncode);
      this.rawJsonContentText = "";
    }else if(this.selectedTypeRequestBody == 'rawJson'){
      this.submitKeyValueDataObj  = [];
    }
    let obj:any = {
        type:this.requestMethodType,
        url:this.APIUrlLink,
        typeFrom:this.selectedTypeRequestBody,
        data:{
          keyValue:this.submitKeyValueDataObj,
          json:JSON.stringify(lodash.escape(this.rawJsonContentText))
        },
        throttle:false,
        throttleNs:0,
        requestHeader:this.requestHeaderEnabled,
        headerParams:this.headerPramsObjMethod(this.keyValueArray)
        
    }
    if(this.selectedTypeRequestBody == 'none'){
      obj.data = {
        keyValue : [],
        json : ""
      };
    }
    if(!this.requestHeaderEnabled){
      this.keyValueArray = [{"key":"","value":""}];
    }
    return obj;
  }
  headerPramsObjMethod(keyValObj){
    let objArry:any = [];
    keyValObj.forEach((item,i) => {
      objArry.push({"key":item.key,"value":item.value});
    })
    return objArry;
  }
  validationCheck(){
    let valid = true;    
     if(this.APIUrlLink === undefined || this.APIUrlLink == '') {
      this.dataService.SwalAlertSuccesOrFailMgs(this.translate.instant('APIChannelComponent.validationMessageForAPIUrlAPILbl'), 'warning');
      valid =  false;
    }
    return valid;
}

  finalSaveMethod(isSaveChannel){    
    let callSaveMethod = this.validationCheck();
    if(!callSaveMethod){
      return;
    }else{
      let currObj = this.channelObj.find(x => x.promoSplitId == this.currentSplitId);
    let payloadJson = {
      channels: [{
        PromotionKey: currObj.promotionKey,
        channelId: currObj.commChannelKey,
        failSafe: false,
        failsafeSelectedOffers: [],
        html: JSON.stringify(this.makeRequestBodyJsonMethod()),
        json: JSON.stringify(this.makeRequestBodyJsonMethod()),
        promoCommunicationKey: currObj.dbKey,
        promoSplitKey: currObj.promoSplitId,
        selectedOffers: currObj.selectedOffers,
        selectedRecoWidgets:[],
        subjectObj: null,
        preHeader: "",
        senderConfigKey: currObj.senderId,
        senderId: currObj.senderId,
        senderName: currObj.senderId,
        subject: "",
        vendorDesc: "",
        vendorId: currObj.senderId,
        templateKey: this.apiSelectedTemplate,
        thumbnailImage: "",
        title: "",
        uuid: "",
      }]
    }
    this.finalAPIPayloadData = payloadJson.channels[0];

    // if(!this.isSMSEditModeEnable[this.currentSplitId]) {
    //   if(Array.isArray(this.channelsPayloadObj) && this.channelsPayloadObj.length !== 0) {
    //     this.channelsPayloadObj.push(this.finalDmPayloadData);
    //   } else {
    //     this.shareService.channelsPayloadObj.next(payloadJson.channels);
    //   }
    // }
    this.shareService.channelsPayloadObj.next(payloadJson.channels);
    let url = AppConstants.API_END_POINTS.SAVE_ADMIN_PEOMO_TEMPLATE_USAGE;
     
    this.http.post(url, payloadJson).subscribe((data) => {
      if(data.status === 'FAIL'){
        Swal.fire({
          icon: 'warning',
          text: data.response         
        })
        //this.dataService.SwalValidationMsg(data.response);
      }else{
        Swal.fire({
          icon: 'success',
          text: data.message         
        })
        //this.dataService.SwalSuccessMsg(data.message);
      }
      
    });
  }
  }
  
  async callSaveAsMethod(){  
    Swal.fire({
      // title: this.translate.instant('dataServicesTs.areYouSureAlertMsgLbl'),      
      titleText: this.translate.instant('APIChannelComponent.confirmMessageForSaveAsTemplateAPILbl'),
      html: `<input type="text" id="apiName" class="swal2-input" maxlength="200" placeholder="`+this.translate.instant('APIChannelComponent.APIInputGhostText')+`">`,
      icon:'warning',
      showCancelButton: true,
      confirmButtonColor: '#026FE9',
      cancelButtonColor: '#FFF',
      confirmButtonText: this.translate.instant('yes'),
      cancelButtonText:this.translate.instant('cancel'),
      allowEscapeKey: false,
      allowOutsideClick: false,
      customClass: {
        cancelButton: 'buttonCssStyle',
        confirmButton: 'buttonCssStyle',
      },
      
  focusConfirm: true,
  preConfirm: () => {
    let  apiName:any = Swal.getPopup();
    //var regexp = "^([a-zA-Z])[a-zA-Z0-9-_]*$";
    
    apiName = apiName.querySelector('#apiName').value;
    
    //var regexPattern = "^([a-zA-Z\u3040-\u30FF\u4E00-\u9FAF])[a-zA-Z0-9_\-\u3040-\u30FF\u4E00-\u9FAF]*$";
    //const regex: RegExp = new RegExp(regexPattern);
    //const isMatch: boolean = regex.test(apiName);

    if (apiName == "") {
      //this.isPtagNameSaved = false;
      Swal.showValidationMessage(this.translate.instant('beeEditorGlobalComponent.enterNameTagLbl'));
    }
    return { apiName:apiName }
  }
}).then(async (result) => {
  if (result.isConfirmed){
    let apiTemplateName = result.value?.apiName;
    this.callSaveAsTemplate(apiTemplateName);
      }
    });

  }
  
  async callSaveAsTemplate(tempName){
    let savedJSon = this.saveAsTemplate(tempName);
    if(savedJSon.template_name === undefined){
      Swal.fire({
        icon: 'warning',
        text: this.translate.instant('dmColumnarCompontent.templateNameCannotBeEmptyAlertMsgLbl')        
      })
    }else{
      const resultObj = await this.http.post(AppConstants.API_END_POINTS.GET_DM_COLUMNAR_SAVEASTEMPLATE,savedJSon).toPromise();
    if(resultObj.status == 'SUCCESS'){
      let addSaveAsTemplate = JSON.parse(resultObj.message);
      if(addSaveAsTemplate !== undefined){
        this.smsTemplates.splice(this.smsTemplates.length,0,addSaveAsTemplate);
      }        
      Swal.fire({
        icon: 'success',
        text: resultObj.response         
      }) 
    }else{
      Swal.fire({
        icon: 'warning',
        text: resultObj.response         
      })
    }
    }
    
  }

  saveAsTemplate(tempName){      
    //let smsEle = this.smsInputContent.nativeElement;
    //let smsContent = smsEle.getElementsByClassName('smsInputVal')[0].innerHTML;
    //let channelType = this.channelObj.find(x => x.promoSplitId === this.currentSplitId).channelType;
  let mainSavedObj = {
      channelKey: this.channelObj[0].commChannelKey,
      channelType: this.channelObj[0].channelType,
      promotionKey: this.channelObj[0].promotionKey,
      templateKey: this.channelObj[0].dbKey,
      template_json: JSON.stringify(this.makeRequestBodyJsonMethod()),
      template_name: tempName
  }
      return mainSavedObj;
  }
  requestMethod(evt){
    let selectedVal = evt.target;
    if(selectedVal === undefined){
      selectedVal = evt;
    }else{
      selectedVal = selectedVal.value;
    }
    this.requestMethodType = selectedVal;
    if(this.requestMethodType == 'GET' || this.requestMethodType == 'PUT'){
      this.isRequestMethodTypeDisabled = true;
    }else{
      this.isRequestMethodTypeDisabled = false;
    }
  }
  openOfferSliderPopup(evt,isInput){
      this.shareService.showMergedTagCopyIcon.next(true);
      this.backropOffersEnable = false;
      this.offerDrawerSectionEnable = true;
      this.loader.HideLoader();    
  }
  onCloseOfferDrawer(){
    this.backropOffersEnable = false;
    this.offerDrawerSectionEnable = false;
  }
  finalOffersSelected(res){
    if(Object.keys(res).length > 0){
      Object.keys(res).map( key => {
        Object.values(res[key]).map((each:any) =>{
          if(each.type === 'RO'){
            each.attributes.map((attrList:any) => {
              //const offertemp = "&nbsp;<span class='offerDynamic pointer' contenteditable='false' spellcheck='false' data-currentInputClassName='"+this.selectedPlaceHolderInput+"' data-dbkey='"+key+"' data-selectedRecoCount='"+each.offerSelected+"' data-name='"+attrList+"'>"+attrList+"</span>&nbsp;";
              //this.insertHtmlAtCaret(offertemp);
            });            
          }else{
           // const offertemp = "&nbsp;<span class='offerDynamic pointer' contenteditable='false' spellcheck='false' data-currentInputClassName='"+this.selectedPlaceHolderInput+"' data-dbkey='"+key+"' data-name='"+each.name+"'>"+each.value+"</span>&nbsp;";
             //this.insertHtmlAtCaret(offertemp);
          //this.updateInappPreviewSection(this.currentInputFocused);
          }
          
        })
        //this.updateSMSPreviewSection();
      });
      
    }
    //this.shareService.smsEditModeOffersSelected.next();
  }  
  showloaderMethod(status){
    this.loader.HideLoader();
  }
}
