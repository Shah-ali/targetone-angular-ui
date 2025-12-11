import { Component, OnInit, Output,EventEmitter, ViewChild, ElementRef,HostListener, AfterViewInit,NgZone, TemplateRef} from "@angular/core";
import { AppConstants } from "@app/app.constants";
import { GlobalConstants } from '../../design-channels/common/globalConstants';
import { HttpService } from "@app/core/services/http.service";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataService } from '@app/core/services/data.service';
import { LoaderService } from '@app/core/services/loader.service';
import { SharedataService } from '@app/core/services/sharedata.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sms-channel',
  templateUrl: './sms-channel.component.html',
  styleUrls: ['./sms-channel.component.scss']
})
export class SmsChannelComponent implements OnInit {
  @ViewChild('smsInputContent') smsInputContent! : ElementRef;
  @ViewChild('previewHtmlElement') previewHtmlElement! : ElementRef;
  @ViewChild('columnarTemplateElement') columnarTemplateElement! : ElementRef;
  
  offerDrawerSectionEnable: boolean = false;
  backropOffersEnable: boolean = false;
  modalRef?: BsModalRef;
  insertOfferAt: any;
  selectedPlaceHolderInput: any;
  isSMSEditModeEnable: any = {};
  currentSplitId: any;
  channelsPayloadObj: any;
  senderDetails: any;
  senderId: any;
  columnHerderVal: any;
  venderDesc: any;
  selectedRecoOffersToSubmit: any = [];
  selectedOffersToSubmit: any = [];
  promoKey: any;
  commChannelKey: any;
  finalDmPayloadData:any;
  dbKey: any;
  channelName: any;
  currentObj: any;
  channelObj: any;
  collectOffersFromInputSelected: any = [];
  emojiObj: any;
  customEmojis: any = [];
  emojisToggle: boolean = false;
  enablePlusBtn:boolean = false;
  isSaveAsTemplateEnable: boolean = false;
  templateNameEntered:any;
  columnarTemplates:any = [];
  promotionSplitHelper: any;
  channelSavedArray: any;
  isShortUrlEnabled:boolean = true;
  totalCharacterCountVal:any;
  smsTemplates: any;
  smsUnicodeEnabledCheck: boolean = false;
  smsMultiSplitFlgCheck: boolean = false;
  previewSMSText: any;
  venderDetails: any;
  selectedSMSTemplate: any;
  smsContentText: any;
  shortUrlDomain: any;
  selectedRecoOffersEdit: any;
  tempPublishArry: any = [];
  publishRecommendationOffers: any = [];
  i18nObject: any = {};
  constructor(private httpService: HttpService, private dataService: DataService, private shareService:SharedataService,
    private modalService:BsModalService, private loader:LoaderService,private translate:TranslateService, private ngzone: NgZone) { 
      AppConstants.OFFERS_ENABLE.MERGE_TAG = true;
      AppConstants.OFFERS_ENABLE.RECOMMENDATION_OFFERS = true;
      AppConstants.OFFERS_ENABLE.STATIC_OFFERS = true;
      this.i18nObject = {
        search: this.translate.instant('searchLbl'),
        notfound: this.translate.instant('emojiComponent.noEmojiFoundLbl'),
        pickyourEmojiTooltip:this.translate.instant('emojiComponent.pickyouremojiLbl'),
        categories: {
          search: this.translate.instant('emojiComponent.searchResultsLbl'),
          recent: this.translate.instant('emojiComponent.searchResultsLbl'),
          custom: this.translate.instant('emojiComponent.customLbl')
        }
        }
      this.shareService.currentSelectedChannelObj.subscribe((res:any) => {
        if(Object.keys(res).length > 0){
          this.currentSplitId = res.currentSplitId;
          this.promoKey = res.promotionKey;
          this.commChannelKey=res.commChannelKey;
          this.channelName = res.channelName;
          this.currentObj = res.currentObj;
        }      
      });
      this.shareService.channelObj.subscribe(res => {
        this.channelObj = res;   
      });
      
      this.shareService.offersToSubmit.subscribe(res => {
        if(Object.keys(res).length > 0){
          if(this.selectedOffersToSubmit.length > 0){
            this.selectedOffersToSubmit.push(...res); // insert items add newly.
          }else{
            this.selectedOffersToSubmit = res;
          }
                    
        }
      });
      this.shareService.recomendationOffersToSubmit.subscribe(res => {
        if(Object.keys(res).length > 0){
          if(this.selectedRecoOffersToSubmit.length > 0){
            this.selectedRecoOffersToSubmit.push(...res); // insert items add newly.
          }else{
            this.selectedRecoOffersToSubmit = res;
          }
        }
      });
      setTimeout(() => {
        this.getEmojiObj();
        this.getVendorNameObj();
        this.loadSmsTemplates();
        this.getSavedData();
      },1000);  
      }
     async loadSmsTemplates(){
      const resultObj = await this.httpService.post(AppConstants.API_END_POINTS.GET_SMS_FACEBOOK_TEMPLATES+this.commChannelKey).toPromise();
      if(resultObj.status == 'SUCCESS'){
        console.log(resultObj.response);
        this.selectedSMSTemplate = '-1';
        this.smsTemplates = JSON.parse(resultObj.response.templates);  
        this.smsUnicodeEnabledCheck = this.currentObj.smsUnicodeEnabled;
        this.smsMultiSplitFlgCheck = this.currentObj.smsMultiSplitFlg;
      }
     }
     updateEditViewSMS(editObj){
      let smsInpEle = this.columnarTemplateElement.nativeElement;
       smsInpEle.value = editObj.templateParentKey;
       this.smsUnicodeEnabledCheck = this.currentObj.smsUnicodeEnabled;
       this.smsMultiSplitFlgCheck = this.currentObj.smsMultiSplitFlg;
       let smsEleParent = this.smsInputContent.nativeElement;
        let smsEleChild = smsEleParent.getElementsByClassName('smsInputVal')[0];
        smsEleChild.innerHTML = JSON.parse(editObj.templateText);
        let prevEle = this.previewHtmlElement.nativeElement;
        prevEle.innerHTML = JSON.parse(editObj.templateText);
        this.selectedSMSTemplate = editObj.templateParentKey;
        this.totalCharacterCountVal = smsEleChild.innerHTML.trim().length;
      //--------- collect Saved selected offer and Reco
      let selOffrs = this.promotionSplitHelper.splitsGroups.find(x => x.splitId === this.currentSplitId).channels[0].selectedOffers;
      let selectOffersStatic = selOffrs.filter(x => x.ruleKey === 0);
      this.selectedRecoOffersEdit = selOffrs.filter((y:any) => y.ruleKey !== 0);
      const recoFilteredObj =  [...new Map(selOffrs.map(item =>
        [item['ruleKey'], item])).values()];
      let selectRecoOffers = recoFilteredObj.filter((y:any) => y.ruleKey !== 0);
      if(selectOffersStatic !== undefined){
        if(selectOffersStatic.length > 0 ){
          selectOffersStatic.forEach(each => {
            const savedAttrsObj = {"offerKey":each.offerKey,"couponFlg":each.noTemplateCouponEnabled};
            this.collectOffersFromInputSelected.push(savedAttrsObj);
          });
          this.selectedOffersToSubmit = this.collectOffersFromInputSelected;
        } 
      }
      if(selectRecoOffers !== undefined){
        if(selectRecoOffers.length > 0 ){
          selectRecoOffers.forEach((each:any,i) => {
            let countVal = this.selectedRecoOffersEdit.filter(x => x.ruleKey === each.ruleKey);
            if(countVal !== undefined){
              countVal = countVal.length;
            }
            var couponFlg;
            if(each.noTemplateCouponEnabled){
              couponFlg = 1;
            }else{
              couponFlg = 0;
            }

            this.tempPublishArry.push({
              key: each.ruleKey,
              offerTemplateKey:0,
              widgetId:i+1,
              count: countVal,
              couponFlg: couponFlg,  
              ruleTemplateKey:'-1',
              type: "RO"
            });
          });
        }
      }
      this.publishRecommendationOffers.push(
        {
          promotionKey: this.promoKey,
          splitKey: this.currentSplitId,
          commChannelKey: this.commChannelKey,
          item: this.tempPublishArry
        }
      );
      this.shareService.recomendationOffersToSubmit.next(this.publishRecommendationOffers);
      this.updateSMSPreviewSection();
     }
     getOffersAndRecoBack(){
      //--------- collect Saved selected offer and Reco
      let selOffrs = this.promotionSplitHelper.splitsGroups.find(x => x.splitId === this.currentSplitId).channels[0].selectedOffers;
      let selectOffersStatic = selOffrs.filter(x => x.ruleKey === 0);
      this.selectedRecoOffersEdit = selOffrs.filter((y:any) => y.ruleKey !== 0);
      const recoFilteredObj =  [...new Map(selOffrs.map(item =>
        [item['ruleKey'], item])).values()];
      let selectRecoOffers = recoFilteredObj.filter((y:any) => y.ruleKey !== 0);
      if(selectOffersStatic !== undefined){
        if(selectOffersStatic.length > 0 ){
          selectOffersStatic.forEach(each => {
            const savedAttrsObj = {"offerKey":each.offerKey,"couponFlg":each.noTemplateCouponEnabled};
            this.collectOffersFromInputSelected.push(savedAttrsObj);
          });
          this.selectedOffersToSubmit = this.collectOffersFromInputSelected;
        } 
      }
      if(selectRecoOffers !== undefined){
        if(selectRecoOffers.length > 0 ){
          selectRecoOffers.forEach((each:any,i) => {
            let countVal = this.selectedRecoOffersEdit.filter(x => x.ruleKey === each.ruleKey);
            if(countVal !== undefined){
              countVal = countVal.length;
            }
            var couponFlg;
            if(each.noTemplateCouponEnabled){
              couponFlg = 1;
            }else{
              couponFlg = 0;
            }

            this.tempPublishArry.push({
              key: each.ruleKey,
              offerTemplateKey:0,
              widgetId:i+1,
              count: countVal,
              couponFlg: couponFlg,  
              ruleTemplateKey:'-1',
              type: "RO"
            });
          });
          

      } 
      this.publishRecommendationOffers.push(
        {
          promotionKey: this.promoKey,
          splitKey: this.currentSplitId,
          commChannelKey: this.commChannelKey,
          item: this.tempPublishArry
        }
      )
      this.shareService.recomendationOffersToSubmit.next(this.publishRecommendationOffers);
     }
    }
     getSelectedSmsTemplateData(evt){
      let dbkeyTemp = evt.target.value;      
        let objTemp = this.smsTemplates.find(x => x.dbKey == dbkeyTemp);
        let smsEleParent = this.smsInputContent.nativeElement;
        let smsEleChild = smsEleParent.getElementsByClassName('smsInputVal')[0];
        let prevEle = this.previewHtmlElement.nativeElement;//getElementsByClassName('smartphone')[0];
        this.selectedSMSTemplate = dbkeyTemp;
        if(this.smsTemplates !== undefined){
          if(dbkeyTemp === '-1'){
            smsEleChild.innerHTML = "";
            prevEle.innerHTML = "";
            this.totalCharacterCountVal = 0;
          }else{
            smsEleChild.innerHTML = objTemp.templateText+'&nbsp;';
            prevEle.innerHTML = objTemp.templateText;
            this.totalCharacterCountVal = objTemp.templateText.trim().length;
            this.updateSMSPreviewSection();
          }
          
        }          
     }
     getVendorNameObj() {
      if(this.channelObj !== undefined && this.currentSplitId !== undefined){
        this.currentObj = this.channelObj.find(x => x.promoSplitId === this.currentSplitId);
        this.senderId = this.currentObj.senderId;
        this.dbKey = this.currentObj.dbKey;
      }     
      if(typeof(GlobalConstants.promoKey) !== 'undefined'){
        let url = AppConstants.API_END_POINTS.GET_VENDOR_NAMES+`?promoKey=${GlobalConstants.promoKey}`;
        this.httpService.post(url).subscribe((resultObj) => {
          this.venderDetails = JSON.parse(resultObj.response);
          this.senderDetails = this.venderDetails[this.commChannelKey]['senderIds'][this.senderId];
          this.venderDesc = this.venderDetails[this.commChannelKey]['vendorDesc'];
          this.shortUrlDomain = this.venderDetails[this.commChannelKey]['shortUrlDomain'];
          //this.getoffersDataObj("");
        });
      }
    }
     @HostListener('document:click', ['$event.target'])
      clickout(event) {        
        if(event.className.includes('smsInputVal')){
          let id = event.id;
        // if(id !== undefined){
        //   id = id.split('_')[1];
        // }
          //this.orderRowId = id;
          this.enablePlusBtn = true;
        }else{
          this.enablePlusBtn = false;
        }
      }

     openPopupForSaveAsTemplate(){
      let resObj = this.checkColumnValuesArePresent();
      if(resObj){
        this.backropOffersEnable = true;
      this.isSaveAsTemplateEnable = true;
      }      
    }
    checkColumnValuesArePresent(){
      let flag = true;
      // if(this.createColumnData.length > 0){
      //   let lengthFieldName = this.createColumnData.filter(x => x.header == '').length;
      // let lengthFieldValue = this.createColumnData.filter(x => x.value == '').length;
      // if(lengthFieldName > 0 || lengthFieldValue > 0){
      //   Swal.fire({
      //   icon: 'warning',
      //   text: 'Column name or Column value cannot be empty'           
      // });
      //  flag = false;
      // }
      // }      
      return flag;
    }
     closeSaveAsTemplatePopup(){
      this.backropOffersEnable = false;
      this.isSaveAsTemplateEnable = false;
    }
    async callSaveAsTemplate(){
      let savedJSon = this.saveAsTemplate();
      if(savedJSon.template_name === undefined){
        Swal.fire({
          icon: 'warning',
          text: this.translate.instant('dmColumnarCompontent.templateNameCannotBeEmptyAlertMsgLbl')        
        })
      }else{
        const resultObj = await this.httpService.post(AppConstants.API_END_POINTS.GET_DM_COLUMNAR_SAVEASTEMPLATE,savedJSon).toPromise();
      if(resultObj.status == 'SUCCESS'){
        let addSaveAsTemplate = JSON.parse(resultObj.message);
        if(addSaveAsTemplate !== undefined){
          this.smsTemplates.splice(this.smsTemplates.length,0,addSaveAsTemplate);
        }        
        Swal.fire({
          icon: 'success',
          text: resultObj.response         
        }) 
        this.closeSaveAsTemplatePopup();
      }else{
        Swal.fire({
          icon: 'warning',
          text: resultObj.response         
        })
      }
      }
      
    }
       //------- Offers Slider ------------
   onCloseOfferDrawer(){
    this.backropOffersEnable = false;
    this.offerDrawerSectionEnable = false;
  }
  removeLoader(){
    this.ngzone.run(() => {
      this.loader.loadCount = 0;
      this.loader.HideLoader();         
    });
  }
  saveAsTemplate(){      
    let smsEle = this.smsInputContent.nativeElement;
    let smsContent = smsEle.getElementsByClassName('smsInputVal')[0].innerHTML;
    let channelType = this.channelObj.find(x => x.promoSplitId === this.currentSplitId).channelType;
  let mainSavedObj = {
      "channelKey": this.commChannelKey,
      "promotionKey": this.promoKey,
      "template_name": this.templateNameEntered,
      "template_json":encodeURIComponent(smsContent),
      "channelType":channelType,    
  }
  return mainSavedObj;
  }
  getSavedData() {
    let url = AppConstants.API_END_POINTS.GET_SAVED_USAGE_TEMPLATES+`?promoKey=${GlobalConstants.promoKey}`;
    this.httpService.post(url).subscribe((data) => {
      if(data.status === 'SUCCESS') {
        if(data.response.adminCommTemplate !== "") {
          this.channelSavedArray = JSON.parse(data.response.adminCommTemplate);
          this.shareService.channelsPayloadObj.next(this.channelSavedArray);
          var dmEditObj = this.channelSavedArray.find(x => x.promoSplitKey === this.currentSplitId);
          
        }
        this.promotionSplitHelper = JSON.parse(data.response.promotionSplitHelper);
          if(Object.keys(this.promotionSplitHelper).length > 0) {
            GlobalConstants.varArgs = this.promotionSplitHelper.splitsGroups[0].channels[0].varArgs.root.item;
          }
          if(dmEditObj !== undefined) {    
            this.updateEditViewSMS(dmEditObj);        
           }
           else {
            this.setActiveTab('');
          }
      }
    });
    this.setActiveTab('');
    
  }
  setActiveTab(currentObj:any): void {
    if(this.currentSplitId !== undefined){
      const setAct = this.channelObj.findIndex(x => x.promoSplitId === this.currentSplitId);
      this.shareService.setActiveChannelTab.next(setAct);
    }
  }
  finalOffersSelected(res){
    if(Object.keys(res).length > 0){
      Object.keys(res).map( key => {
        Object.values(res[key]).map((each:any) =>{
          if(each.type === 'RO'){
            each.attributes.map((attrList:any) => {
              const offertemp = "&nbsp;<span class='offerDynamic pointer' contenteditable='false' spellcheck='false' data-currentInputClassName='"+this.selectedPlaceHolderInput+"' data-dbkey='"+key+"' data-selectedRecoCount='"+each.offerSelected+"' data-name='"+attrList+"'>"+attrList+"</span>&nbsp;";
              this.insertHtmlAtCaret(offertemp);
            });            
          }else{
            const offertemp = "&nbsp;<span class='offerDynamic pointer' contenteditable='false' spellcheck='false' data-currentInputClassName='"+this.selectedPlaceHolderInput+"' data-dbkey='"+key+"' data-name='"+each.name+"'>"+each.value+"</span>&nbsp;";
             this.insertHtmlAtCaret(offertemp);
          //this.updateInappPreviewSection(this.currentInputFocused);
          }
          
        })
        this.updateSMSPreviewSection();
      });
      
    }
    //this.shareService.smsEditModeOffersSelected.next();
  }  
  getCaretIndex(evt:any, inptClassName) {
    this.selectedPlaceHolderInput = inptClassName;
    var sel, range;
    if (window.getSelection) {
      sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        //range.deleteContents();
        this.insertOfferAt = range;
        GlobalConstants.insertionPoint = this.insertOfferAt;
      }
    }
     this.updateSMSPreviewSection();
    //this.currentInputFocused = inptClassName;
    //if(GlobalConstants.inAppEditMode){
      this.collectDraggedOffers(evt,false);
    //}
  }
  // updateAttributeSection(){
  //   if(this.attributeInputContent !== undefined){
  //     let strText = this.attributeInputContent.nativeElement.getElementsByClassName('attribute')[0].innerHTML;
  //       if(strText !== undefined && strText.includes('tonewidget')){
  //         strText = this.formatToneWidgetText(strText);
  //         this.attributeInpVal = this.newLineContentToBr(strText);
  //       }else{
  //         this.attributeInpVal = this.newLineContentToBr(strText);
  //       }
  //   }
    
  // }
  newLineContentToBr(templateContent){
    if(templateContent != null)
    if(templateContent.indexOf("\n") != -1)
    {
      templateContent = templateContent.replaceAll("\n","<br>").replaceAll(/^(\ ?<br( \/)?>\ ?)+|(\ ?<br( \/)?>\ ?)+$/, '');
    }else if(templateContent.includes('div')){
      templateContent = templateContent.replaceAll("<div>","").replaceAll("</div>","<br>").replaceAll(/^(\ ?<br( \/)?>\ ?)+|(\ ?<br( \/)?>\ ?)+$/, '');
    }

    return templateContent;
 }
 formatToneWidgetText(inputText:any) {
  return inputText.replaceAll('&lt;tonewidget&gt;', '<tonewidget>').
  replaceAll('&lt;/tonewidget&gt;', '</tonewidget>')//.replace(/<[\/]{0,1}(div)[^><]*>/g,' ').replace(/(?:&nbsp;)/g,' ').replace(/\<p>/gi, '').replace(/\<\/p>/gi, '')
}
  collectDraggedOffers(evt,isEditLoad){
    this.collectOffersFromInputSelected = [];
    let eachSpan;
    if(isEditLoad){
       eachSpan = evt.getElementsByTagName('span');
    }else{
       eachSpan = evt.target.getElementsByTagName('span');
    }    
    if(eachSpan.length > 0){
    Object.values(eachSpan).map((obj:any) => {
      let dbkeyAttr = obj.getAttribute('data-dbkey');
      let nameAttr = obj.getAttribute('data-name');
      let offerCount = obj.getAttribute('data-selectedRecoCount');
      if(dbkeyAttr !== undefined && nameAttr !== undefined){
        const savedAttrsObj = {"id":dbkeyAttr,"value":nameAttr,"offerSelected":offerCount};
        this.collectOffersFromInputSelected.push(savedAttrsObj);
        //console.log(this.collectOffersFromInputSelected);  
      }
    });    
  }
  this.shareService.smsEditModeOffersSelected.next(this.collectOffersFromInputSelected);
  }
     openOfferSliderPopup(evt,isInput){
      let idEle = isInput;
      this.selectedPlaceHolderInput = idEle;
      this.shareService.showMergedTagCopyIcon.next(true);
      if(this.offerDrawerSectionEnable){
        this.backropOffersEnable = false;
        this.offerDrawerSectionEnable = false;
      }else{
        this.backropOffersEnable = true;
        this.offerDrawerSectionEnable = true;
      }   
      this.loader.HideLoader();
    }

    async getEmojiObj() {
      const url = AppConstants.API_END_POINTS.GET_EMOJI_OBJ;
      const emObj = await this.httpService.post(url).toPromise();
      if (Object.keys(emObj).length > 0) {
        if ((emObj.status = "SUCCESS")) {
          this.emojiObj = JSON.parse(emObj.response.Emojis);
          this.getCustomeObj();
        }
      }
    }
    getCustomeObj() {
      this.emojiObj.forEach((item) => {
        var obj = {};
        obj["name"] = item.emoji;
        obj["shortNames"] = item.aliases;
        obj["text"] = item.emoji;
        obj["label"] = item.emoji;
        obj["keywords"] = item.tags;
        this.customEmojis.push(obj);
      });
    }
    addEmojiItem(event:any, param:string) {
      const textNative = `${event.emoji.native}`;
      if(this.insertOfferAt !== undefined) {
        this.insertOfferAt.insertNode(document.createTextNode(textNative));
        this.emojisToggle = !this.emojisToggle;
        this.updateSMSPreviewSection();
      }
    }
  updateSMSPreviewSection(){
    let smsEleParent = this.smsInputContent.nativeElement;
        let prevEle = this.previewHtmlElement.nativeElement;//.getElementsByClassName('smartphone')[0];
        let smsContent = smsEleParent.getElementsByClassName('smsInputVal')[0];
        this.previewSMSText = smsContent.textContent.replaceAll(/<[\/]{0,1}(div)[^><]*>/g,' ').replaceAll(/(?:&nbsp;|<br>)/g,' ').replaceAll(/\<p>/gi, '').replaceAll(/\<\/p>/gi, '');
        this.smsContentText = smsContent.innerHTML.replaceAll('font','div').replaceAll(/<[\/]{0,1}(div)[^><]*>/g,' ').replaceAll(/(?:&nbsp;|<br>)/g,' ').replaceAll(/\<p>/gi, '').replaceAll(/\<\/p>/gi, '');
        if(this.previewSMSText.match('tonewidget')) {
          this.previewSMSText = this.smsContentText.replace(/\<xmp style="margin:0;display:inline">/gi,'').replace(/\<\/xmp>/gi, '')
          .replace(/\&lt;/gi, '<').replace(/&gt;/gi, '>').replace('<span style="font-size: 0.8125rem;"><tonewidget></span>', '<tonewidget>')
          .replace(/\<span style="font-size: 0.8125rem;"><tonewidget>/gi, '<tonewidget>').replace(/\<\/tonewidget><\/span>/gi, '</tonewidget>');
          this.smsContentText = this.dataService.formatToneWidgetText(this.smsContentText);
          this.smsContentText = this.newLineContentToBr(this.smsContentText);
        }else{
          this.smsContentText = this.newLineContentToBr(this.smsContentText);
        }
        // if(smsContent !== undefined && smsContent.includes('tonewidget')){
        //   smsContent = this.formatToneWidgetText(smsContent);
        //   this.previewSMSText = this.newLineContentToBr(smsContent);
        // }else{
        //   this.previewSMSText = this.newLineContentToBr(smsContent);
        // }
        this.previewSMSText = this.newLineContentToBr(this.previewSMSText);
        if(this.previewSMSText !== undefined){
          this.totalCharacterCountVal = this.previewSMSText.trim().length;
        }
                
  }
  validationCheck(){
    let valid = true;
    if(this.selectedSMSTemplate === undefined || this.selectedSMSTemplate == '-1'){
      Swal.fire({
        icon:'warning',
        text:this.translate.instant('designEditor.testSMSComponent.validationMsg.smsTemplateNotSelectedMsglbl')
      })
      valid = false;
    }else 
    if(this.smsContentText === undefined || this.smsContentText?.trim() == ""){
      Swal.fire({
        icon:'warning',
        text:this.translate.instant('designEditor.testSMSComponent.validationMsg.SMSContentCannotBeEmptyAlertMsgLbl')
      })
      valid = false;
    }
    return valid;
  }
     // final save
  finalSaveMethod(){    
    let callSaveMethod = this.validationCheck();
    if(!callSaveMethod){
      return;
    }else{
    this.smsContentText = this.dataService.formatToneWidgetText(this.smsContentText);
    let payloadJson = {
      channels: [{
        PromotionKey: this.promoKey,
        channelId: this.commChannelKey,
        failSafe: false,
        failsafeSelectedOffers: [],
        html: encodeURIComponent(JSON.stringify(this.smsContentText)),
        json: JSON.stringify(this.smsContentText),
        promoCommunicationKey: this.dbKey,
        promoSplitKey: this.currentSplitId,
        selectedOffers: this.selectedOffersToSubmit,
        selectedRecoWidgets:this.selectedRecoOffersToSubmit,
        subjectObj: null,
        preHeader: "",
        senderConfigKey: this.senderId,
        senderId: this.senderDetails,
        senderName: this.senderDetails,
        subject: this.columnHerderVal,
        vendorDesc: this.venderDesc,
        vendorId: this.senderId,
        templateKey: this.selectedSMSTemplate,
        thumbnailImage: "",
        title: "",
        uuid: "",
        smsUnicodeEnabled:this.smsUnicodeEnabledCheck,
        smsMultiSplitFlg :this.smsMultiSplitFlgCheck

        //hasDMOfferEnable:this.hasDmOffersEnable
      }]
    }
    this.finalDmPayloadData = payloadJson.channels[0];

    if(!this.isSMSEditModeEnable[this.currentSplitId]) {
      if(Array.isArray(this.channelsPayloadObj) && this.channelsPayloadObj.length !== 0) {
        this.channelsPayloadObj.push(this.finalDmPayloadData);
      } else {
        this.shareService.channelsPayloadObj.next(payloadJson.channels);
      }
    }

    const url = AppConstants.API_END_POINTS.SAVE_ADMIN_PEOMO_TEMPLATE_USAGE;
    this.httpService.post(url, payloadJson).subscribe((data) => {
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
  ngOnInit(): void {
  }
  smsUniCodeEnableMethod(evt){
    if(evt.target.checked){
      this.smsUnicodeEnabledCheck = true;
    }else{
      this.smsUnicodeEnabledCheck = false;
    }
  }
  smsMultiSplitEnableMethod(evt){
    if(evt.target.checked){
      this.smsMultiSplitFlgCheck = true;
    }else{
      this.smsMultiSplitFlgCheck = false;
    }
  }
    insertHtmlAtCaret(html) {
      if(GlobalConstants.insertionPoint !== undefined){
        this.insertOfferAt = GlobalConstants.insertionPoint;
      }
      if(this.insertOfferAt === undefined){
        // Swal.fire({
        //   icon: 'warning',
        //   text: 'Please select the position where you want to insert the offers'           
        // })
      } else {
        let el = document.createElement("div");
        el.innerHTML = html;
        let frag = document.createDocumentFragment(), node, lastNode;
        while ( (node = el.firstChild) ) {
            lastNode = frag.appendChild(node);
        }
        let firstNode = frag.firstChild;
        //if(this.inserEmojiAt.startContainer.parentElement.id === this.selectedPlaceHolderInput){
          this.insertOfferAt.insertNode(frag); 
          if (lastNode) {
            this.insertOfferAt = this.insertOfferAt.cloneRange();
            this.insertOfferAt.setStartAfter(lastNode);
            //sel.removeAllRanges();
            //sel.addRange(range);
          }
        //}
        //this.updateAttributeSection();
        this.updateSMSPreviewSection();
      } 
    }

  // open SMS attachment modal
  openTestSMSModal(modalTemplate: TemplateRef<any>) {
    let smsEle = this.smsInputContent.nativeElement;
    let smsContent = smsEle.getElementsByClassName('smsInputVal')[0].innerHTML;
    smsContent = this.dataService.formatToneWidgetText(smsContent);
    let payloadJson = {
      channels: [{
        commChannelKey: this.commChannelKey,
        currentSplitid: this.currentSplitId,
        customercode: "",
        isTestList: false,
        msgContent: encodeURIComponent(smsContent),
        promoKey: this.promoKey,
        senderId: this.senderDetails,
        senderName: this.senderDetails,
        testListId: 0,
        toAddr:"",
        smsMultiSplit: this.smsMultiSplitFlgCheck,
        unicodeEnable: this.smsUnicodeEnabledCheck,
        selectedOffers: this.selectedOffersToSubmit,
        selectedRecoWidgets:this.selectedRecoOffersToSubmit,
      }]
    }
    this.shareService.testSMSObj.next(payloadJson);  

    if(this.selectedSMSTemplate == undefined || this.selectedSMSTemplate == -1) {
      Swal.fire(this.translate.instant('designEditor.testSMSComponent.validationMsg.smsTemplateNotSelectedMsglbl'));
      return;
    }
    this.modalRef = this.modalService.show(modalTemplate,
      {
        class: 'modal-dialog-centered testSMSModel',
        backdrop: 'static',
        keyboard: false
      }
    );
  }

}
