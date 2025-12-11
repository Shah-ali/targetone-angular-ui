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
  selector: 'app-whats-app-channel',
  templateUrl: './whats-app-channel.component.html',
  styleUrls: ['./whats-app-channel.component.scss']
})
export class WhatsAppChannelComponent implements OnInit {
  @ViewChild('whatsAppInputContent') whatsAppInputContent! : ElementRef;
  @ViewChild('whatsAppCarouselInputContent') whatsAppCarouselInputContent! : ElementRef;
  @ViewChild('previewHtmlElement') previewHtmlElement! : ElementRef;
  @ViewChild('carouselPreviewElement') carouselPreviewElement! : ElementRef;  
  @ViewChild('columnarTemplateElement') columnarTemplateElement! : ElementRef;
  currentSplitId: any;
  promoKey: any;
  commChannelKey: any;
  channelName: any;
  currentObj: any;
  channelObj: any;
  selectedOffersToSubmit: any = [];
  selectedRecoOffersToSubmit: any = [];
  emojiObj: any;
  customEmojis: any = [];
  insertOfferAt: any;
  emojisToggle: boolean = false;
  enablePlusBtn:boolean = true; 
  previewSMSText: any;
  whatsappContentText: any;
  totalCharacterCountVal: any;
  selectedWhatsAppTemplate: any;
  dbKey: any;
  senderId: any;
  senderDetails: any;
  columnHerderVal: any;
  venderDesc: any;
  smsUnicodeEnabledCheck: any;
  smsMultiSplitFlgCheck: any;
  finalDmPayloadData: any;
  isWhatsappEditModeEnable: any = {};
  modalRef?: BsModalRef;
  venderDetails: any;
  shortUrlDomain: any;
  channelsPayloadObj: any;
  isSaveAsTemplateEnable: boolean = false;
  backropOffersEnable: boolean = false;
  offerDrawerSectionEnable: boolean = false;
  templateNameEntered: any;
  selectedPlaceHolderInput: any;
  collectOffersFromInputSelected: any = [];
  isShortUrlEnabled:boolean = true;
  channelSavedArray: any;
  promotionSplitHelper: any;
  publishRecommendationOffers: any = [];
  tempPublishArry: any;
  selectedRecoOffersEdit: any;
  whatsAppTemplateObj: any = {};
  templateVariableObj: any = [];
  mediaLinkSavedVal:any;
  mediaContentTypeSelecton:any = "-1";
  editBtnDisabled:boolean = false;
  saveBtnDisabled:boolean = true;
  templateIdBindFlag: any;
  supportedMediaTypeSelected: any;
  whatsAppTemplates: any;
  templateIdContentHtml: any;
  promoExecutedOrRunning: any;
  quickReplyObj: any = [];
  calToActionObj: any = [];
  quickReplyObjCarousel: any = [];
  calToActionObjCarousel: any = [];
  callTemplateQuickReply:boolean = true;
  carouselTabActive:any = 0;
  carouselCardObj: any;
 
  carouselMediaContentTypeSelecton: any = '';
  carouselwhatsappContentText: any;
  collectAllSlides: any = [];
  editBtnDisabledCarousel: boolean = false;
  saveBtnDisabledCarousel: boolean = true;
  seeAllOptionsArray: any = [];
  showCardOptionList: any = [];
 
  constructor(private httpService: HttpService, private dataService: DataService, private shareService:SharedataService,
    private modalService:BsModalService, private loader:LoaderService,private translate:TranslateService, private ngzone: NgZone) { 
      AppConstants.OFFERS_ENABLE.MERGE_TAG = true;
      AppConstants.OFFERS_ENABLE.RECOMMENDATION_OFFERS = false;
      AppConstants.OFFERS_ENABLE.STATIC_OFFERS = false;
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

  ngOnInit(): void {
  }
  // @HostListener('document:click', ['$event.target'])
  //     clickout(event) {        
  //       if(event.className.includes('whatsAppInputVal') || event.className.includes('inputEditable') ){
  //         let id = event.id;
  //       // if(id !== undefined){
  //       //   id = id.split('_')[1];
  //       // }
  //         //this.orderRowId = id;
  //         this.enablePlusBtn = true;
  //       }else{
  //         this.enablePlusBtn = false;
  //       }
  //     }
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
            console.log(GlobalConstants.varArgs);
          }
          if(Object.keys(data.response.promotion).length > 0) {
            this.promoExecutedOrRunning = data.response.promotion.promoExecutedOrRunning;
            this.dataService.setLastSavedStep = data.response.promotion.lastSavedStep;
            this.dataService.setRunningPromotion = data.response.promotion.promoExecutedOrRunning;
            this.shareService.ispromoExecutedOrRunning.next(this.promoExecutedOrRunning);
          }
          
          if(dmEditObj !== undefined) {    
            //this.updateEditViewSMS(dmEditObj); 
            this.editModeWhatsAppDataMethod(dmEditObj);
            
           }
           else {
            this.setActiveTab('');
          }
      }
    });
    this.setActiveTab('');
    
  }
  editModeWhatsAppDataMethod(editObj){
    let saveTemplateText = JSON.parse(editObj.templateText);
    this.whatsAppTemplateObj = saveTemplateText;
    let whatsappInpEle = this.columnarTemplateElement.nativeElement;
    whatsappInpEle.value = editObj.templateParentKey;
    this.selectedWhatsAppTemplate = editObj.templateParentKey;
    this.editDataFillMethod(saveTemplateText);
    // this.publishRecommendationOffers.push(
    //   {
    //     promotionKey: this.promoKey,
    //     splitKey: this.currentSplitId,
    //     commChannelKey: this.commChannelKey,
    //     item: this.tempPublishArry
    //   }
    // );
    //this.shareService.recomendationOffersToSubmit.next(this.publishRecommendationOffers);
    this.updateWhatsAppPreviewSection(this.mediaContentTypeSelecton);
  }
  updateEditViewSMS(editObj){
    let smsInpEle = this.columnarTemplateElement.nativeElement;
     smsInpEle.value = editObj.templateParentKey;
     this.smsUnicodeEnabledCheck = this.currentObj.smsUnicodeEnabled;
     this.smsMultiSplitFlgCheck = this.currentObj.smsMultiSplitFlg;
     let smsEleParent = this.whatsAppInputContent.nativeElement;
      let smsEleChild = smsEleParent.getElementsByClassName('whatsAppInputVal')[0];
      smsEleChild.innerHTML = JSON.parse(editObj.templateText);
      let prevEle = this.previewHtmlElement.nativeElement;
      prevEle.innerHTML = JSON.parse(editObj.templateText);
      this.selectedWhatsAppTemplate = editObj.templateParentKey;
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
    this.updateWhatsAppPreviewSection(this.mediaContentTypeSelecton);
   }
  async loadSmsTemplates(){
    const resultObj = await this.httpService.post(AppConstants.API_END_POINTS.GET_SMS_FACEBOOK_TEMPLATES+this.commChannelKey).toPromise();
    if(resultObj.status == 'SUCCESS'){
      console.log(resultObj.response);
      this.selectedWhatsAppTemplate = '-1';
      this.whatsAppTemplates = JSON.parse(resultObj.response.templates);  
      this.smsUnicodeEnabledCheck = this.currentObj.smsUnicodeEnabled;
      this.smsMultiSplitFlgCheck = this.currentObj.smsMultiSplitFlg;
    }
   }
  setActiveTab(currentObj:any): void {
    if(this.currentSplitId !== undefined){
      const setAct = this.channelObj.findIndex(x => x.promoSplitId === this.currentSplitId);
      this.shareService.setActiveChannelTab.next(setAct);
    }
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
        this.updateWhatsAppPreviewSection(this.mediaContentTypeSelecton);
      });
      
    }
    //this.shareService.smsEditModeOffersSelected.next();
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
      this.updateWhatsAppPreviewSection(this.mediaContentTypeSelecton);
    } 
  }
  getCaretIndex(evt:any, inptClassName,index?) {
    // this.selectedPlaceHolderInput = inptClassName;
    // var sel, range;
    // if (window.getSelection) {
    //   sel = window.getSelection();
    //   if (sel.getRangeAt && sel.rangeCount) {
    //     range = sel.getRangeAt(0);
    //     //range.deleteContents();
    //     this.insertOfferAt = range;
    //     GlobalConstants.insertionPoint = this.insertOfferAt;
    //   }
    // }
    //  this.updateWhatsAppPreviewSection(this.mediaContentTypeSelecton);
    // //this.currentInputFocused = inptClassName;
    // //if(GlobalConstants.inAppEditMode){
    //   this.collectDraggedOffers(evt,false);
    //}
    let titleMsg = evt.target.value;
    if(evt.target.classList.length > 0){
      if(evt.target.classList.contains('inputEditable')){
        evt.target.setAttribute("title",titleMsg);
      }      
    }
    if(titleMsg !== undefined){
      if(inptClassName == 'whatsAppInputCarousel'){
        // for Carousel card msg
        this.carouselCardObj.card[index].variables.find(x => x.name == evt.target.getAttribute('name')).value = this.dataService.formatToneWidgetText(titleMsg.trim());
      }else{
        this.templateVariableObj.find(x => x.name == evt.target.getAttribute('name')).value = titleMsg.trim();
      }
      
    }    
    
    //this.updateWhatsAppPreviewSection(this.mediaContentTypeSelecton);
  }
  previewUpdateWhatsapp(){
    this.updateWhatsAppPreviewSection(this.mediaContentTypeSelecton);
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
  openPopupForSaveAsTemplate(){
    let resObj = this.validationCheck();
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
        this.whatsAppTemplates.splice(this.whatsAppTemplates.length,0,addSaveAsTemplate);
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
  saveAsTemplate(){      
    let smsEle = this.whatsAppInputContent.nativeElement;
    let whatsappContent = smsEle.getElementsByClassName('whatsAppInputVal')[0].innerHTML;
    this.whatsAppTemplateObj.structure.template = whatsappContent;
    let channelType = this.channelObj.find(x => x.promoSplitId === this.currentSplitId).channelType;
  let mainSavedObj = {
      "channelKey": this.commChannelKey,
      "promotionKey": this.promoKey,
      "template_name": this.templateNameEntered,
      "template_json":JSON.stringify(this.whatsAppTemplateObj),
      "channelType":channelType,    
  }
  return mainSavedObj;
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
      this.updateWhatsAppPreviewSection(this.mediaContentTypeSelecton);
    }
  }
updateWhatsAppPreviewSection(mediaType){
  let smsEleParent = this.whatsAppInputContent.nativeElement;
      let prevEle = this.previewHtmlElement.nativeElement;//.getElementsByClassName('smartphone')[0];
      let smsContent = smsEleParent.getElementsByClassName('whatsAppInputVal')[0];
      
      this.whatsappContentText = smsContent.innerHTML;
      this.previewSMSText = smsContent.innerHTML;
      let sampleTemp:any = "";
      let carouselCardsWithData:any = "";
      //this.previewSMSText = smsContent.textContent.replaceAll(/<[\/]{0,1}(div)[^><]*>/g,' ').replaceAll(/(?:&nbsp;|<br>)/g,' ').replaceAll(/\<p>/gi, '').replaceAll(/\<\/p>/gi, '');
      //this.whatsappContentText = smsContent.innerHTML.replaceAll(/<[\/]{0,1}(div)[^><]*>/g,' ').replaceAll(/(?:&nbsp;|<br>)/g,' ').replaceAll(/\<p>/gi, '').replaceAll(/\<\/p>/gi, '');

      // if(this.previewSMSText.match('tonewidget')) {
      //   this.previewSMSText = this.whatsappContentText.replace(/\<xmp style="margin:0;display:inline">/gi,'').replace(/\<\/xmp>/gi, '')
      //   .replace(/\&lt;/gi, '<').replace(/&gt;/gi, '>').replace('<span style="font-size: 0.8125rem;"><tonewidget></span>', '<tonewidget>')
      //   .replace(/\<span style="font-size: 0.8125rem;"><tonewidget>/gi, '<tonewidget>').replace(/\<\/tonewidget><\/span>/gi, '</tonewidget>');
      //   this.whatsappContentText = this.formatToneWidgetText(this.whatsappContentText);
      //   this.whatsappContentText = this.newLineContentToBr(this.whatsappContentText);
      // }else{
      //   this.whatsappContentText = this.newLineContentToBr(this.whatsappContentText);
      // }

      //this.whatsappContentText = this.newLineContentToBr(this.whatsappContentText);
      // if(smsContent !== undefined && smsContent.includes('tonewidget')){
      //   smsContent = this.formatToneWidgetText(smsContent);
      //   this.previewSMSText = this.newLineContentToBr(smsContent);
      // }else{
      //   this.previewSMSText = this.newLineContentToBr(smsContent);
      // }
      // if(this.mediaLinkSavedVal != ''){      
      if(mediaType == 'image'){
        let filterBtns = this.templateVariableObj.filter(x => x.type == 'button');
        let imgTextArea= `
        <div class="normalMsg-section">
        <i class="arrow-lft"></i>
        <div class="imgSection" style="height:240px;border:1px solid #eee;"><img src='`+this.mediaLinkSavedVal+`' alt='`+mediaType+`' width="100%"></div> 
        <div class="textSection align-center"> `+this.newLineContentToBr(this.previewSMSText)+` </div> 
        `+this.seeAlloptionsMethodNormalMsg(filterBtns,0)+`
        </div>
        </div>`;
        
        //setTimeout(() => {
          this.previewSMSText = imgTextArea;
        //}, 300);
      }else if(mediaType == "video"){
        let filterBtns = this.templateVariableObj.filter(x => x.type == 'button');
        let videoInWhatsApp= `<div class="normalMsg-section">
        <i class="arrow-lft"></i>
        <div class="imgSection" style="height:240px;border:1px solid #eee;">
          <video width="100%" autoplay controls><source src="`+this.mediaLinkSavedVal+`" type="video/mp4"></video>
        </div> 
        <div class="textSection align-center"> `+this.newLineContentToBr(this.previewSMSText)+` </div>         
        `+this.seeAlloptionsMethodNormalMsg(filterBtns,0)+`
        </div>`;
        //setTimeout(() => {
          this.previewSMSText = videoInWhatsApp;
        //}, 300);
        
      }else{
        let filterBtns = this.templateVariableObj.filter(x => x.type == 'button');
        let textWathsApp = `<div class="normalMsg-section">
        <i class="arrow-lft"></i>              
        <div class="textSection align-center"> `+this.newLineContentToBr(this.previewSMSText)+` </div> 
        `+this.seeAlloptionsMethodNormalMsg(filterBtns,0)+`
        </div>`;
        this.previewSMSText = textWathsApp;  
       } 

       if(this.carouselCardObj !== undefined){
        carouselCardsWithData = `
          <div class="col carouselPreeviweOutterWrapper">
          `+this.createCarouseTemplateForPreview(this.carouselCardObj.card,this.carouselCardObj.crouselType);+`
        </div>`
        
      }
      let allOptionLabel = this.translate.instant('whatsAppComponent.carouselMessagesLabels.allOptionsLbl')
      let previewWhatsAppHtml = `
      <div class="sliderPopupDiv-whatsAppCarousel"></div> 
          <div class="popupDivShowBtn">
            <div class="row col m-0 mt-3">
              <h4 class="col-2 cancelSeeAllOptionpopup pointer">&times;</h6>
              <h5 class="col text-center">`+allOptionLabel+`</h6>
            </div>
          <div class='col listofBtns'></div>
      </div>
      <div class="col whatsAppStyleMgs" id="outerWrapperWhatsApp">          
          <div class="col normalPreeviweOutterWrapper">
          `+this.previewSMSText+`
          `+carouselCardsWithData+`   
          </div>
          <div class="d-none'></div>
        </div>`;

        this.previewSMSText = previewWhatsAppHtml;      
              
}
mediaTypeCarouselMethos(carouselWhatsAppType,src){
  let mediaTypeElement:any;
  if(carouselWhatsAppType == 'image'){
    mediaTypeElement = `<img src="`+src+`" class="imageUrlCarousel-whatsApp imageResponsive_ratio1to1" alt="" >`;
  }else if(carouselWhatsAppType == 'video'){
    mediaTypeElement = `<video width="100%" class="imageUrlCarousel-whatsApp imageResponsive_ratio1to1" autoplay controls><source src="`+src+`" type="video"></video>`
  }
  return mediaTypeElement;
}
createCarouseTemplateForPreview(cards,carouselWhatsAppType?) {
let inserCards:any ="";
this.collectAllSlides = []; // reset when call again


cards.forEach((eachSlide:any,inx) => {
  inserCards = 
  `<div class="col carousel-template-cards_`+inx+` carouselPreviewCard">
 <div class="col imageResponsive_ratio1to1 mt-1 p-0">
         `+this.mediaTypeCarouselMethos(carouselWhatsAppType,eachSlide.variables[0].value)+`
 </div>
 <div class="textContent-carousel_`+inx+` text-left m-2">
     <p class="smallLabel msgCarousel-whatsApp">`+eachSlide.msg+`</p>
 </div>
 <div class="quickReply_Button">
  `+this.quickrRplyBtns(eachSlide.variables, inx)+`
 </div>
 <div class="CallToAcion_Button">
  `+this.seeAlloptionsMethod(eachSlide.variables,inx)+`
 </div>
 
 </div>`;
 this.collectAllSlides.push(inserCards);
});

return this.collectAllSlides.join();
}
quickrRplyBtns (eachBtn,tabInx){
  let filterQuickReply = eachBtn.filter(x => x.header == 'quick_reply');
  let collectBtns:any = [];
  let cardsMultple:any = {};
  filterQuickReply.forEach((ele:any,i) => {
    let temp:any = `
  <div class="quickReply-button_`+tabInx+` quickBtnStyle text-center p-2 linkColor">
      <i class="fa fa-reply mr-2"></i>
      <button type='button' class='buttonStyle xSmallLabel mt-2 widthX100 borderStyle linkColor' disabled title='`+ele.name+`'>`+ele.name+`</button>
  </div>`;
  
  collectBtns.push(temp);
  
  
  });  
  //this.showCardOptionList['cardQTR_'+tabInx] = collectBtns;
  //this.seeAllOptionsArray.splice(this.seeAllOptionsArray.length,0,collectBtns);
 return collectBtns.join('');
}
popupBtnCreateMethod (eachBtn){
  let collectBtns:any = [];
  let leng = eachBtn.length;
  let borderClass:any;
  eachBtn.forEach((ele:any,i) => {
    let icon = '';
    if(ele.header == "cta_url"){
      icon = `<i class="fa fa-external-link-alt mr-2"></i>`
    }else{
      icon = `<i class="fa fa-reply mr-2"></i>`
    }
    if(i == leng-1){
      borderClass = 'popupPreviewCarouselBtnBottm'
    }else{
      borderClass = 'popupPreviewCarouselBtn'
    }
    let temp:any = `
  <div class="quickReply-button text-left `+borderClass+` linkColor">
        `+icon+`
      <label type='button' class='buttonStyle xSmallLabel mt-2 widthX100 borderStyle linkColor' title='`+ele.name+`'>`+ele.name+`</label>
  </div>`;
  
  collectBtns.push(temp);
  });  
  //this.showCardOptionList['cardQTR_'+tabInx] = collectBtns;
  //this.seeAllOptionsArray.splice(this.seeAllOptionsArray.length,0,collectBtns);
 return collectBtns;
}
callToActionBtnd (eachBtn,tabInx){
  let filterCtaBnt = eachBtn.filter(x => x.header == 'cta_url');
  let cardsMultple = {};
  let collectBtns:any = [];
  let borderClass:any;
  let leng = filterCtaBnt.length;
  filterCtaBnt.forEach((ele:any,i) => {
    if(i == leng-1){
      borderClass = 'popupPreviewCarouselBtnBottm'
    }else{
      borderClass = 'quickBtnStyle'
    }
  let temp = `
    <div class="callToAction-button_`+tabInx+` `+borderClass+` text-center p-2 linkColor">
      <i class="far fa-external-link-alt"></i>
      <button type='button' class='buttonStyle xSmallLabel mt-2 widthX100 borderStyle linkColor' disabled title='`+ele.name+`'>`+ele.name+`</button>
  </div>`;
  collectBtns.push(temp);
  //this.seeAllOptionsArray.splice(this.seeAllOptionsArray.length,0,collectBtns);
  });
  //cardsMultple['card_'+tabInx] = collectBtns;
  //this.seeAllOptionsArray.splice(this.seeAllOptionsArray.length,0,collectBtns);
  //this.showCardOptionList['cardCTA_'+tabInx] = collectBtns;
  return collectBtns.join('');
 } 
 seeAlloptionsMethod(eachBtn,tabInx){
  let collectBtns:any = [];
  let filterBttnArry = this.carouselCardObj.card[tabInx].variables.filter(x => x.type == 'button');
  if(filterBttnArry.length > 2){
    let take3items:any = [];//this.seeAllOptionsArray.slice(0,1);
    let i = 2; // inserted index
    let nameBtn = 'See all options'    
    let createAllOptionBtn = `<div class="callToAction-button_`+tabInx+` popupShowSeeAllOptionDiv quickBtnStyle text-center p-2 linkColor pointer">
      <i class="fas fa-list-ul"></i>
      <button type='button' class='buttonStyle xSmallLabel mt-2 widthX100 borderStyle linkColor' title='`+nameBtn+`'>`+nameBtn+`</button>
      </div>`;    
  
  take3items.push(createAllOptionBtn);  
  collectBtns = take3items.join('');
  }else{
    collectBtns = this.callToActionBtnd(eachBtn,tabInx);
  }
  return collectBtns;
 }
 seeAlloptionsMethodNormalMsg(eachBtn,tabInx){  
  let collectBtns:any = [];
  if(this.carouselCardObj === undefined){   
  let filterBttnArry = this.callToActionBtnd(eachBtn,0);
  let filterQuickReply = this.quickrRplyBtns(eachBtn,0);
  let concatFilter = filterBttnArry.concat(filterQuickReply);
  let countLength = document.createElement('div');
  countLength.innerHTML = concatFilter;
  
  if(countLength.children.length > 2){
    let take3items:any = [];//this.seeAllOptionsArray.slice(0,1);
    let i = 2; // inserted index
    let nameBtn = 'See all options'    
    let createAllOptionBtn = `<div class="buttonNormalMsg popupShowSeeAllOptionDiv quickBtnStyle text-center p-2 linkColor pointer">
      <i class="fas fa-list-ul"></i>
      <button type='button' class='buttonStyle xSmallLabel mt-2 widthX100 borderStyle linkColor' title='`+nameBtn+`'>`+nameBtn+`</button>
      </div>`;    
  
  take3items.push(createAllOptionBtn);  
  collectBtns = take3items.join('');
  }else{ // if it is less than 2 and equal
    collectBtns = concatFilter;
  }
}
  return collectBtns;  

 }
 cancelPopupMethod(){
  this.previewHtmlElement.nativeElement.getElementsByClassName('sliderPopupDiv-whatsAppCarousel')[0].style.display = 'none';
  this.previewHtmlElement.nativeElement.getElementsByClassName('popupDivShowBtn')[0].style.display = 'none';
 }
 popupShowSeeAllOption(event){
  let inx = event.target.classList[0].split('_')[1];
  let filterBttnArry = this.carouselCardObj.card[inx].variables.filter(x => x.type == 'button');
  this.showCardOptionList = ""; // clear and insert.
  this.showCardOptionList = this.popupBtnCreateMethod(filterBttnArry);
  this.previewHtmlElement.nativeElement.getElementsByClassName('sliderPopupDiv-whatsAppCarousel')[0].style.display = 'block';
  this.previewHtmlElement.nativeElement.getElementsByClassName('popupDivShowBtn')[0].getElementsByClassName('listofBtns')[0].innerHTML = this.showCardOptionList.join('');
  this.previewHtmlElement.nativeElement.getElementsByClassName('popupDivShowBtn')[0].style.display = 'block';
  
 }
 popupShowSeeAllOptionNormalMsg(event){
  let inx = event.target.classList[0].split('_')[1];
  let filterBttnArry = this.templateVariableObj.filter(x => x.type == 'button');
  this.showCardOptionList = ""; // clear and insert.
  this.showCardOptionList = this.popupBtnCreateMethod(filterBttnArry);
  this.previewHtmlElement.nativeElement.getElementsByClassName('sliderPopupDiv-whatsAppCarousel')[0].style.display = 'block';
  this.previewHtmlElement.nativeElement.getElementsByClassName('popupDivShowBtn')[0].getElementsByClassName('listofBtns')[0].innerHTML = this.showCardOptionList.join('');
  this.previewHtmlElement.nativeElement.getElementsByClassName('popupDivShowBtn')[0].style.display = 'block';
  
 }
formatToneWidgetText(inputText:any) {
  return inputText.replaceAll('&lt;tonewidget&gt;', '<tonewidget>').
  replaceAll('&lt;/tonewidget&gt;', '</tonewidget>')//.replace(/<[\/]{0,1}(div)[^><]*>/g,' ').replace(/(?:&nbsp;)/g,' ').replace(/\<p>/gi, '').replace(/\<\/p>/gi, '')
}
  newLineContentToBr(templateContent){
    // if(templateContent != null)
    // if(templateContent.indexOf("\n") != -1)
    // {
    //   templateContent = templateContent.replaceAll("\n","<br>").replaceAll(/^(\ ?<br( \/)?>\ ?)+|(\ ?<br( \/)?>\ ?)+$/, '');
    // }else if(templateContent.includes('div')){
    //   templateContent = templateContent.replaceAll("<div>","").replaceAll("</div>","<br>").replaceAll(/^(\ ?<br( \/)?>\ ?)+|(\ ?<br( \/)?>\ ?)+$/, '');
    // }

    return templateContent;
 }
  validationCheck(){
    let valid = true;
    if(this.selectedWhatsAppTemplate === undefined || this.selectedWhatsAppTemplate == '-1'){
      Swal.fire({
        icon:'warning',
        text:this.translate.instant('whatsAppComponent.validationMsg.whatsAppTemplateNotSelectedMsglbl')
      })
      valid = false;
    }else 
    if(this.whatsappContentText === undefined || this.whatsappContentText == ""){
      Swal.fire({
        icon:'warning',
        allowOutsideClick: false,
        allowEscapeKey: false,
        text:this.translate.instant('whatsAppComponent.validationMsg.whatsAppContentCannotBeEmptyAlertMsgLbl')
      })
      valid = false;
    }
    let checkIfFieldsValueIsNull;
    if(this.templateVariableObj != undefined)
    {
      let filterQuickReplyObj = this.templateVariableObj.filter(x => x.type === 'body');
      if(this.carouselCardObj !== undefined){
        filterQuickReplyObj = filterQuickReplyObj.concat(this.carouselObjCheckEmpty(this.carouselCardObj));
      }else{
        filterQuickReplyObj = filterQuickReplyObj;
      }
      checkIfFieldsValueIsNull = filterQuickReplyObj.map(x => {return x.value});
      if(checkIfFieldsValueIsNull.includes(null) || checkIfFieldsValueIsNull.includes("") || checkIfFieldsValueIsNull.includes('""') || checkIfFieldsValueIsNull.includes("''")){
        Swal.fire({
          icon:'warning',
          allowOutsideClick: false,
          allowEscapeKey: false,
          text:this.translate.instant("whatsAppComponent.validationMsg.whatAppFieldsValueCannotBeEmptyLbl")
        })
        valid = false;
      }
    }
    if(!this.saveBtnDisabled){
      Swal.fire({
        icon: 'warning',
        allowOutsideClick: false,
        allowEscapeKey: false,
         text:this.translate.instant("whatsAppComponent.validationMsg.whatAppFieldsValueCannotBeEmptyLbl")           
        });
        valid = false;
    } 
    if(this.mediaContentTypeSelecton != '-1' && this.mediaLinkSavedVal == ""){
      Swal.fire({
        icon: 'warning',
        allowOutsideClick: false,
        allowEscapeKey: false,
         text:this.translate.instant("whatsAppComponent.validationMsg.enterMediaLinkPathLbl")           
        });
        valid = false;
    }
    return valid;
  }
  carouselObjCheckEmpty(carouselObj){
    let filterObj:any = [];
    if(carouselObj !== undefined){      
      this.carouselCardObj.card.map((each,i)=> {
      let xobj:any = each.variables.filter(x => x.type !== 'quick_reply');
      filterObj.push(xobj);
    });    
    }
    return filterObj;
   }
   // final save
   finalSaveMethod(){    
    let callSaveMethod = this.validationCheck();
    if(!callSaveMethod){
      return;
    }else{
      let whatsEle = this.whatsAppInputContent.nativeElement;
      let whatsappContent = whatsEle.getElementsByClassName('whatsAppInputVal')[0].innerHTML;
      this.whatsAppTemplateObj.structure.template = this.dataService.formatToneWidgetText(whatsappContent);
    let payloadJson = {
      channels: [{
        PromotionKey: this.promoKey,
        channelId: this.commChannelKey,
        failSafe: false,
        failsafeSelectedOffers: [],
        html: encodeURIComponent(JSON.stringify(this.whatsAppTemplateObj)),
        json: JSON.stringify(this.whatsAppTemplateObj),
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
        templateKey: this.selectedWhatsAppTemplate,
        thumbnailImage: "",
        title: "",
        uuid: "",
        // smsUnicodeEnabled:this.smsUnicodeEnabledCheck,
        // smsMultiSplitFlg :this.smsMultiSplitFlgCheck

        //hasDMOfferEnable:this.hasDmOffersEnable
      }]
    }
    this.finalDmPayloadData = payloadJson.channels[0];

    if(!this.isWhatsappEditModeEnable[this.currentSplitId]) {
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
  
  // open SMS attachment modal
  openTestWhatsAppModal(modalTemplate: TemplateRef<any>) {
    let whatsEle = this.whatsAppInputContent.nativeElement;
    let whatsappContent = whatsEle.getElementsByClassName('whatsAppInputVal')[0].innerHTML;
    this.whatsAppTemplateObj.structure.template = this.dataService.formatToneWidgetText(whatsappContent);
    let callSaveMethod = this.validationCheck();
    if(!callSaveMethod){
      return; // if invalid error
    }else{
      let payloadJson = {
        channels: [{
          commChannelKey: this.commChannelKey,
          currentSplitid: this.currentSplitId,
          customercode: "",
          isTestList: false,
          msgContent: encodeURIComponent(JSON.stringify(this.whatsAppTemplateObj)),
          promoKey: this.promoKey,
          senderId: this.senderDetails,
          senderName: this.senderDetails,
          testListId: 0,
          toAddr:"",
          // smsMultiSplit: this.smsMultiSplitFlgCheck,
          unicodeEnable: false,
          // selectedOffers: this.selectedOffersToSubmit,
          // selectedRecoWidgets:this.selectedRecoOffersToSubmit,
        }]
      }
      this.shareService.testWhatsappObj.next(payloadJson);     
      this.modalRef = this.modalService.show(modalTemplate,
        {
          class: 'modal-dialog-centered testSMSModel',
          backdrop: 'static',
          keyboard: false
        }
      );
    }
    
  }
  getSelectedSmsTemplateData(evt){
    let dbkeyTemp = evt.target.value;      
      let objTemp = this.whatsAppTemplates.find(x => x.dbKey == dbkeyTemp);
      let smsEleParent = this.whatsAppInputContent.nativeElement;
      let smsEleChild = smsEleParent.getElementsByClassName('whatsAppInputVal')[0];
      let prevEle = this.previewHtmlElement.nativeElement;//getElementsByClassName('smartphone')[0];
      this.selectedWhatsAppTemplate = dbkeyTemp;
      if(this.whatsAppTemplates !== undefined){
        if(dbkeyTemp === '-1'){
          smsEleChild.innerHTML = "";
          prevEle.innerHTML = "";
          this.totalCharacterCountVal = 0;
        }else{
          let sampleTemplate = JSON.parse(objTemp.templateText);
          this.whatsAppTemplateObj = sampleTemplate;
          this.editBtnDisabled = false;
          this.saveBtnDisabled = true;
          this.editDataFillMethod(sampleTemplate);
        }
        
      }          
   }
   supportMediaTypeMethod(supportedMediaTypes){
    let types = Object.keys(supportedMediaTypes);
    let mediaTypeFlag: any;
    types.forEach(ele => {
      if(supportedMediaTypes[ele]){
        mediaTypeFlag = ele;
      }
    });
    return mediaTypeFlag;
   }
   editDataFillMethod(sampleTemplate){
    let smsEleParent = this.whatsAppInputContent.nativeElement;    
    let smsEleChild = smsEleParent.getElementsByClassName('whatsAppInputVal')[0];    
    let prevEle = this.previewHtmlElement.nativeElement;//getElementsByClassName('smartphone')[0];
    let mediaTypeFilter = this.supportMediaTypeMethod(sampleTemplate.supportedMediaTypes) || "-1";
    this.templateIdBindFlag = sampleTemplate.params.WhatsAppTemplateId;
          smsEleChild.innerHTML = sampleTemplate.structure.template;// JSON.parse(objTemp.templateText);//+'&nbsp;';
          prevEle.innerHTML = sampleTemplate.structure.template;;
          //this.totalCharacterCountVal = sampTemp.structure.template.trim().length;
          this.templateVariableObj = sampleTemplate.structure.col;
          this.carouselCardObj = sampleTemplate.carousel;
          this.carouselMediaContentTypeSelecton = this.calToActionObj.crouselType;
          this.quickReplyObj = this.templateVariableObj.filter(x => x.header == 'quick_reply');
          this.calToActionObj = this.templateVariableObj.filter(x => x.header == 'cta_url');
          this.mediaLinkSavedVal = sampleTemplate.params.mediaData === undefined ? '' : sampleTemplate.params.mediaData;
          if(mediaTypeFilter == 'carousel'){
            this.mediaContentTypeSelecton = mediaTypeFilter;
            this.mediaLinkSavedVal = '-1'; // not exist.
          }else{            
            this.mediaContentTypeSelecton = mediaTypeFilter;
          }          
          this.supportedMediaTypeSelected = sampleTemplate.supportedMediaTypes;  
          this.updateWhatsAppPreviewSection(this.mediaContentTypeSelecton);   
          setTimeout(() => {
            this.addEventClickOnButtonMethod(this.previewHtmlElement.nativeElement);
            this.addEventClickOnButtonMethodNormalMsg(this.previewHtmlElement.nativeElement);
            this.retainingCarouselDataMethod(0);
            if(this.carouselCardObj !== undefined){
              if(this.carouselCardObj.crouselType == 'video'){
                this.carouselCardObj.card.map((x,inx) => {
                  this.updatePreviewMethod(this.carouselCardObj.card[inx].variables[0].value,inx,'urlCarousel',0);    
                });    
              }                 
            }                       
          }, 500);
          
          
   }
   retainingCarouselDataMethod(index){
        this.editBtnDisabledCarousel = false;
        this.saveBtnDisabledCarousel = true;
        if(this.whatsAppCarouselInputContent !== undefined){
          let carouselEle = this.whatsAppCarouselInputContent.nativeElement;
        setTimeout(() => {
          let msgEleChildCarousel = carouselEle.getElementsByClassName('msgInput_'+index)[0];
          let mediaUrlEleRef = carouselEle.getElementsByClassName('mediaUrlCarousel_'+index)[0];
          let buttonPrefixUrlEleRef = carouselEle.getElementsByClassName('buttonPrefixUrl_'+index)[0];
          let callToActionUrlEleRef = carouselEle.getElementsByClassName('callToActionUrl_'+index)[0];  
          this.quickReplyObjCarousel = this.carouselCardObj.card[index].variables.filter(x => x.header == 'quick_reply'); // quick reply Button
          this.calToActionObjCarousel = this.carouselCardObj.card[index].variables.filter(x => x.header == 'cta_url'); // Action to Url Button
          msgEleChildCarousel.innerHTML = this.carouselCardObj.card[index].msg;
          let indexVariablesUrl = this.carouselCardObj.card[index].variables.findIndex(x => x.type == 'url');
          if(mediaUrlEleRef !== undefined){
            mediaUrlEleRef.value = this.carouselCardObj.card[index].variables[indexVariablesUrl].value;
          }          
          let indexVariablesCta = this.carouselCardObj.card[index].variables.findIndex(x => x.header == 'cta_url');
          if(buttonPrefixUrlEleRef !== undefined){
            buttonPrefixUrlEleRef.value = this.carouselCardObj.card[index].variables[indexVariablesCta].buttonPrefix;
          }
          if(callToActionUrlEleRef !== undefined){
            callToActionUrlEleRef.value = this.carouselCardObj.card[index].variables[indexVariablesCta].value;
          }          
        },0);  
        }             
   }
   addEventClickOnButtonMethod(refElement){
    let cardsList = refElement.getElementsByClassName('carouselPreviewCard');
    let cancelpopup = refElement.getElementsByClassName('cancelSeeAllOptionpopup');
    if(cancelpopup !== undefined){
      cancelpopup[0].addEventListener('click', () => this.cancelPopupMethod());
    }
    if(cardsList !== undefined){
      [...cardsList].map(x => {
        let popExist:any = x.getElementsByClassName('CallToAcion_Button')[0].getElementsByClassName('popupShowSeeAllOptionDiv')[0];
        if(popExist !== undefined){
          popExist.addEventListener('click', (event) => this.popupShowSeeAllOption(event));
        }
        
      });
    }    
   }
   addEventClickOnButtonMethodNormalMsg(refElement){
    let cardsList = refElement.getElementsByClassName('normalMsg-section');
    let cancelpopup = refElement.getElementsByClassName('cancelSeeAllOptionpopup');
    if(cancelpopup !== undefined){
      cancelpopup[0].addEventListener('click', () => this.cancelPopupMethod());
    }
    if(cardsList !== undefined){
      [...cardsList].map(x => {
        let popExist:any = x.getElementsByClassName('popupShowSeeAllOptionDiv')[0];
        if(popExist !== undefined){
          popExist.addEventListener('click', (event) => this.popupShowSeeAllOptionNormalMsg(event));
        }
        
      });
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
  setSelectMediaContent(evt){
    let mediaContentType:any;
    if(evt.target === undefined){
      mediaContentType = evt;
    }else{
      mediaContentType = evt.target.value;
    }
    this.mediaContentTypeSelecton = mediaContentType;
    this.mediaLinkSavedVal = "";
    this.whatsAppTemplateObj.params.contentType = "";
    this.whatsAppTemplateObj.params.mediaData = ""; // on change make empty
    if(this.supportedMediaTypeSelected !== undefined ){
      Object.keys(this.supportedMediaTypeSelected).forEach((key,i) => {
        if(key == mediaContentType){
          this.supportedMediaTypeSelected[key] = true;
        }else{
          this.supportedMediaTypeSelected[key] = false;
        }
        
      });
    }else{
      let obj = {
        "document": mediaContentType == 'pdf' ? true : false,
        "image": mediaContentType == 'image' ? true : false,
        "video": mediaContentType == 'video' ? true : false,
        "text": mediaContentType == '-1' ? true : false,
      }
      this.supportedMediaTypeSelected = obj;
    }
    
    this.whatsAppTemplateObj.supportedMediaTypes = this.supportedMediaTypeSelected;
    this.updateWhatsAppPreviewSection(this.mediaContentTypeSelecton);
  }
  viewMediaTypeInPreviewMethod(evt){
    let inputVal = evt.target.value;
    this.whatsAppTemplateObj.params.contentType = this.mediaContentTypeSelecton;
    this.whatsAppTemplateObj.params.mediaData = inputVal;
    this.updateWhatsAppPreviewSection(this.mediaContentTypeSelecton);
  }
  editTemplateMethod(){
    let currtObj = this.whatsAppTemplateObj;
    let findSpanTag = this.whatsAppInputContent.nativeElement.getElementsByClassName('whatsAppInputVal')[0].querySelectorAll('samp');
    let spanArry:any = [...findSpanTag];
    let checkIfFieldsValueIsNull:any = [];
    if(this.templateVariableObj != undefined){
      let filterQuickReplyObj = this.templateVariableObj.filter(x => x.type === 'body');      
        checkIfFieldsValueIsNull = filterQuickReplyObj.map(x => {return x.value});
    }
    if(checkIfFieldsValueIsNull.length > 0){
    if(!checkIfFieldsValueIsNull.includes("")){
      Swal.fire({
        title: this.translate.instant("whatsAppComponent.validationMsg.dataLostValidationMsgLbl"),
        //icon:'warning',
        showCloseButton: false,
        showCancelButton: true,
        confirmButtonText: this.translate.instant('yes'),
        //confirmButtonColor: '#3366FF',
        cancelButtonText: this.translate.instant('cancel'),
        cancelButtonColor: '',
        allowOutsideClick: false,
        allowEscapeKey: false,
        customClass: {
          cancelButton: 'buttonCssStyle',
          confirmButton: 'buttonCssStyle',
        },
      }).then(async (result) => {
        if (result.value) {
          spanArry.forEach((element:any,i) => {
            let relpaceInt:any = document.createElement('input');
            let innerHtmlInput = element.innerHTML.replace(/&amp;/g, '&');
            relpaceInt.setAttribute('class','inputEditable textmuted');
            relpaceInt.setAttribute('placeholder',this.templateVariableObj[i].name);
            relpaceInt.setAttribute('title',innerHtmlInput);
            relpaceInt.setAttribute('name',this.templateVariableObj[i].name);
            relpaceInt.setAttribute('value',innerHtmlInput);
            //relpaceInt.addEventListener("onkeyup", this.getTitleTextMethod(element));
            // relpaceInt.onkeyup = function(event) { this.getTitleTextMethod(event); };
            relpaceInt.setAttribute("style","font-size:12px;font-weight:500;height:28px;border: 1px solid #ccc;border-radius:5px;color:#666;");
            element.replaceWith(relpaceInt);
          }); 
          this.editBtnDisabled = true;
          this.saveBtnDisabled = false;
        }else{
          this.editBtnDisabled = false;
          this.saveBtnDisabled = true;
        }
      });
    }else{
      spanArry.forEach((element,i) => {
        let relpaceInt = document.createElement('input');
        relpaceInt.setAttribute('class','inputEditable textmuted');
        relpaceInt.setAttribute('placeholder',this.templateVariableObj[i].name);
        relpaceInt.setAttribute('title',this.templateVariableObj[i].name);
        relpaceInt.setAttribute('name',this.templateVariableObj[i].name);
        relpaceInt.setAttribute("style","font-size:12px;font-weight:500;height:28px;border: 1px solid #ccc;border-radius:5px;color:#666;");
        element.replaceWith(relpaceInt);
      }); 
      this.editBtnDisabled = true;
      this.saveBtnDisabled = false;
    }
  }
       
    
  }
  editTemplateMethodCarousel(index){
    let currtObj = this.whatsAppTemplateObj;
    let findSpanTag = this.whatsAppCarouselInputContent.nativeElement.getElementsByClassName('whatsAppInputValCarousel')[0].querySelectorAll('samp');
    let spanArry:any = [...findSpanTag];
    let checkIfFieldsValueIsNull:any = [];
    let cards = this.carouselCardObj.card;
    let filterQuickReplyObj:any = [];
    if(cards != undefined){
      filterQuickReplyObj = cards[index].variables.filter(x => x.type === 'body');
        checkIfFieldsValueIsNull = filterQuickReplyObj.map(x => {return x.value});
      
    }
    if(checkIfFieldsValueIsNull.length > 0){
    
    if(!checkIfFieldsValueIsNull.includes("")){
      Swal.fire({
        title: this.translate.instant("whatsAppComponent.validationMsg.dataLostValidationMsgLbl"),
        //icon:'warning',
        showCloseButton: false,
        showCancelButton: true,
        confirmButtonText: this.translate.instant('yes'),
        //confirmButtonColor: '#3366FF',
        cancelButtonText: this.translate.instant('cancel'),
        cancelButtonColor: '',
        allowOutsideClick: false,
        allowEscapeKey: false,
        customClass: {
          cancelButton: 'buttonCssStyle',
          confirmButton: 'buttonCssStyle',
        },
      }).then(async (result) => {
        if (result.value) {
          spanArry.forEach((element:any,i) => {
            let relpaceInt:any = document.createElement('input');
            let nameAttr = element.getAttribute('id');
            let innerHtmlInput = element.innerHTML.replace(/&amp;/g, '&');
            relpaceInt.setAttribute('class','inputEditable textmuted');
            relpaceInt.setAttribute('placeholder',nameAttr);
            relpaceInt.setAttribute('title',innerHtmlInput);
            relpaceInt.setAttribute('name',nameAttr);
            relpaceInt.setAttribute('id',nameAttr);
            relpaceInt.setAttribute('value',innerHtmlInput);
            //relpaceInt.addEventListener("onkeyup", this.getTitleTextMethod(element));
            // relpaceInt.onkeyup = function(event) { this.getTitleTextMethod(event); };
            relpaceInt.setAttribute("style","font-size:12px;font-weight:500;height:28px;border: 1px solid #ccc;border-radius:5px;color:#666;");
            element.replaceWith(relpaceInt);
          }); 
          this.editBtnDisabledCarousel = true;
          this.saveBtnDisabledCarousel = false;
        }else{
          this.editBtnDisabledCarousel = false;
          this.saveBtnDisabledCarousel = true;
        }
      });
    }else{
      spanArry.forEach((element,i) => {
        let relpaceInt = document.createElement('input');
        relpaceInt.setAttribute('class','inputEditable textmuted');
        relpaceInt.setAttribute('placeholder',element.id);
        relpaceInt.setAttribute('title',element.id);
        relpaceInt.setAttribute('name',element.id);
        relpaceInt.setAttribute('id',element.id);
        relpaceInt.setAttribute("style","font-size:12px;font-weight:500;height:28px;border: 1px solid #ccc;border-radius:5px;color:#666;");
        element.replaceWith(relpaceInt);
      }); 
      this.editBtnDisabledCarousel = true;
      this.saveBtnDisabledCarousel = false;
    }
  }
       
    
  }
  switchTextTab(index){    
    this.carouselTabActive = index;
    this.retainingCarouselDataMethod(index);
    
  }
  eventOrValueInputMethod(evt){
    let res:any;
    if(evt.target !== undefined){
      res = evt.target.value;
    }else{
      res = evt;
    }
    return res;
  }
  updatePreviewMethod(evt,tabIndex,type,variableInx){
    let result = this.eventOrValueInputMethod(evt);
    if(this.carouselCardObj !== undefined){
      let previewElementCarousel = this.previewHtmlElement.nativeElement;
      let cardsElement = previewElementCarousel.getElementsByClassName('carouselPreviewCard');
      let currentCardArry = [...cardsElement]; 
      let msgText = currentCardArry[tabIndex].getElementsByClassName('msgCarousel-whatsApp')[0];
      if(type === 'urlCarousel'){   

        let namex:any;
        if(evt.target === undefined){
          namex = 'url';
        }else{
          namex = evt.target.getAttribute('name');
        }         
        variableInx = this.carouselCardObj.card[tabIndex].variables.findIndex(x => x.type == namex);
        let imgeSrc = currentCardArry[tabIndex].getElementsByClassName('imageUrlCarousel-whatsApp')[0];
        imgeSrc.setAttribute('src',result);
        this.carouselCardObj.card[tabIndex].variables[variableInx].value = result;
      }else if(type === 'msgCarousel'){
        msgText.innerHTML = result;
        this.carouselCardObj.card[tabIndex].msg = result;
      }
      //else if(type === 'cta_url'){
      //   this.carouselCardObj.card[tabIndex].variables[variableInx].value = result;
      // }
          
    }
  }

  filterMediaUrlMethod(obj){
    let filterX = obj.variables.filter(x => x.type == 'url');
    return filterX;
  }
  saveEdittedTemplateMethod(){
    let findSpanTag = this.whatsAppInputContent.nativeElement.getElementsByClassName('whatsAppInputVal')[0].querySelectorAll('input');
    let spanArry:any = [...findSpanTag];    
      for(let i=0; i < spanArry.length; i++){
        let relpaceInt = document.createElement('samp');
        let element = spanArry[i];      
        let filterQuickReplyObj = this.templateVariableObj.filter(x => x.type === 'body');
        let checkIfFieldsValueIsNull = filterQuickReplyObj.map(x => {return x.value});
        if(checkIfFieldsValueIsNull.includes(null) || checkIfFieldsValueIsNull.includes("") || checkIfFieldsValueIsNull.includes('""') || checkIfFieldsValueIsNull.includes("''")){
          Swal.fire({
            icon:'warning',
            allowOutsideClick: false,
            allowEscapeKey: false,
            text:this.translate.instant("whatsAppComponent.validationMsg.whatAppFieldsValueCannotBeEmptyLbl") 
          });
          return;
          break;
        }
    
      if(element.value == "" || element.value === undefined){
        Swal.fire({
        icon: 'warning',
        allowOutsideClick: false,
        allowEscapeKey: false,
         text: this.translate.instant("whatsAppComponent.validationMsg.whatAppFieldsValueCannotBeEmptyLbl")         
        });
        this.editBtnDisabled = true;
        this.saveBtnDisabled = false;
        return;
        break;
    }else{
      relpaceInt.setAttribute('class','editable');
      relpaceInt.setAttribute('title',element.value);
      relpaceInt.innerHTML = element.value;      
      element.replaceWith(relpaceInt);
      this.templateVariableObj[i].value = this.dataService.formatToneWidgetText(element.value);
      this.whatsAppTemplateObj.structure.col = this.templateVariableObj;
    }

  }  
      this.editBtnDisabled = false;
      this.saveBtnDisabled = true;
      this.updateWhatsAppPreviewSection(this.mediaContentTypeSelecton);
  }
  saveEdittedTemplateMethodCarousel(index){
    let findSpanTag = this.whatsAppCarouselInputContent.nativeElement.getElementsByClassName('msgInput_'+index)[0].querySelectorAll('input');
    let editorInputCarousel = this.whatsAppCarouselInputContent.nativeElement.getElementsByClassName('msgInput_'+index)[0];
    let spanArry:any = [...findSpanTag]; 
    let msgCarouselUpdate:any;   
      for(let i=0; i < spanArry.length; i++){
        let relpaceInt = document.createElement('samp');
        let element = spanArry[i];      
        let filterQuickReplyObj = this.carouselCardObj.card[index].variables.filter(x => x.type === 'body');
        let checkIfFieldsValueIsNull = filterQuickReplyObj.map(x => {return x.value});
        if(checkIfFieldsValueIsNull.includes(null) || checkIfFieldsValueIsNull.includes("") || checkIfFieldsValueIsNull.includes('""') || checkIfFieldsValueIsNull.includes("''")){
          Swal.fire({
            icon:'warning',
            allowOutsideClick: false,
            allowEscapeKey: false,
            text:this.translate.instant("whatsAppComponent.validationMsg.whatAppFieldsValueCannotBeEmptyLbl") 
          });
          return;
          break;
        }
    
      if(element.value == "" || element.value === undefined){
        Swal.fire({
        icon: 'warning',
        allowOutsideClick: false,
        allowEscapeKey: false,
         text: this.translate.instant("whatsAppComponent.validationMsg.whatAppFieldsValueCannotBeEmptyLbl")         
        });
        this.editBtnDisabledCarousel = true;
        this.saveBtnDisabledCarousel = false;
        return;
        break;
    }else{
      let nameAttr = element.getAttribute('name');
      relpaceInt.setAttribute('class','editable');
      relpaceInt.setAttribute('title',element.value);
      relpaceInt.setAttribute('name',nameAttr);
      relpaceInt.setAttribute('id',nameAttr);
      relpaceInt.innerHTML = element.value;      
      element.replaceWith(relpaceInt);
      msgCarouselUpdate = editorInputCarousel.innerHTML;
      // let temp = this.carouselCardObj.card[index].variables.find(x => x.name == element.name);
      // temp.value = element.value;
      this.whatsAppTemplateObj.structure.col = this.templateVariableObj;
    }

  }  
      this.editBtnDisabledCarousel = false;
      this.saveBtnDisabledCarousel = true;
      this.carouselCardObj.card[index].msg = this.dataService.formatToneWidgetText(msgCarouselUpdate);      
      this.updateWhatsAppPreviewSection(this.mediaContentTypeSelecton);
  }
  showloaderMethod(status){
    this.loader.HideLoader();
  }
}
