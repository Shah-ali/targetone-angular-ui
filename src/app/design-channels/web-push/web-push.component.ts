import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from '../common/globalConstants';
import { SharedataService } from '@app/core/services/sharedata.service';
import { AppConstants } from "@app/app.constants";
import { HttpService } from "@app/core/services/http.service";
import { DataService } from '@app/core/services/data.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LoaderService } from '@app/core/services/loader.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-web-push',
  templateUrl: './web-push.component.html',
  styleUrls: ['./web-push.component.scss']
})
export class WebPushComponent implements OnInit {
  modalRef?: BsModalRef;
  promoExecutedOrRunning: any;
  currentSplitId: any;
  promoKey: any;
  commChannelKey: any;
  customEmojis: any = [];
  emojiObj: any;
  inserEmojiAt: any;
  webTitleEmoji: boolean = false;
  webMsgEmoji: boolean = false;
  webTextCollapsed: boolean = false;
  webPushRichNotification: boolean = false;
  webPushButtonSection: boolean = false;
  webPushCollapsed: boolean = false;
  webPushExpanded: boolean = true;
  imageUrl: string = '';
  iconUrl: string = '';
  ngZone: any;
  webPushTitle: string = '';
  webPushMessage: string = '';
  callToAction: string = '';
  buttonOne: string = '';
  btnLinkOne: string = '';
  buttonTwo: string = '';
  btnLinkTwo: string = '';
  showSecondButton: boolean = false;
  autoHide: boolean = false;
  webPushObj: any;
  senderId: any;
  dbKey: any;
  version: any;
  senderDetails: any;
  venderDesc: any;
  venderDetails: any;
  finalWebPushData: any;
  channelsPayloadObj: any;
  channelSavedArray: any;
  channelDataObj: any;
  channelObj: any;
  browserList: any[] = ['Chrome windows 10', 'Chrome windows', 'Chrome mac', 'Firefox windows', 'Firefox mac', 'Chrome android'];
  browserSelected: string = this.browserList[0];
  backropOffersEnable: boolean = false;
  offerDrawerSectionEnable: boolean = false;
  currentInputFocused: any;
  selectedPlaceHolderInput: any;
  selectedOffersToSubmit: any;
  collectOffersFromInputSelected: any = [];
  promotionSplitHelper: any;
  titleGoeshere:any = "";
  messageGoesHere:any = "";
  i18nObject:any = {};
  constructor(private shareService:SharedataService, private httpService: HttpService, private dataService: DataService,private loader:LoaderService, private translate:TranslateService) {
    this.titleGoeshere = this.translate.instant('designEditor.mobilePushComponent.titlePlaceholder');
    this.messageGoesHere = this.translate.instant('designEditor.mobilePushComponent.messagePlaceholder');

    AppConstants.OFFERS_ENABLE.MERGE_TAG = true;
    AppConstants.OFFERS_ENABLE.RECOMMENDATION_OFFERS = false;
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
    this.shareService.channelObj.subscribe(res => {
      this.channelObj = res;   
    });
    this.shareService.offersToSubmit.subscribe(res => {
      if(res.length > 0 || res !== undefined){
        this.selectedOffersToSubmit = res;
      }
    });
    //this.titleGoeshere = this.translate.instant('designEditor.mobilePushComponent.titlePlaceholder');
    //this.messageGoesHere= this.translate.instant('designEditor.mobilePushComponent.messagePlaceholder');
  
  }
  

  showButtonSection(): void {
    const btn = document.getElementById('wp_buttons') as HTMLInputElement;
    if(!btn.checked) {
      this.buttonOne = '';
      this.buttonTwo = '';
      this.btnLinkOne = '';
      this.btnLinkTwo = '';
    }
    this.webPushButtonSection = !this.webPushButtonSection;
  }

  showRichNotification(): void {
    const richToggle = document.getElementById('wp_richNotification') as HTMLInputElement;
    if(!richToggle.checked) {
      this.imageUrl = '';
    }
    this.webPushRichNotification = !this.webPushRichNotification;
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

  getCaretIndex(evt:any, param:string, inptClassName:string) {
    var sel, range;
    if (window.getSelection) {
      sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        this.inserEmojiAt = range;
        GlobalConstants.insertionPoint = this.inserEmojiAt;
      }
    }
    this.updateWebPush(param);
    this.currentInputFocused = param;
    this.collectDraggedOffers(evt);
  }

  addEmojiItem(event:any, param:string) {
    const textNative = `${event.emoji.native}`;
    if(this.inserEmojiAt !== undefined) {
      if(this.inserEmojiAt.startContainer.id === 'web_' + param + '_' + this.currentSplitId ||
      this.inserEmojiAt.startContainer.parentElement.id === 'web_' + param + '_' + this.currentSplitId ||
      this.inserEmojiAt.startContainer.parentElement.offsetParent.id === 'web_' + param + '_' + this.currentSplitId) {
        this.inserEmojiAt.insertNode(document.createTextNode(textNative));
        this.updateWebPush(param);
      }
    }
    if(param === 'title') {
      this.webTitleEmoji = !this.webTitleEmoji;
    } else {
      this.webMsgEmoji = !this.webMsgEmoji;
    }
  }

  updateWebPush(param: string): void {
    if(param === 'title') {
      const ele = document.getElementById('web_title_' + this.currentSplitId) as HTMLDivElement;
      this.webPushTitle = ele.innerHTML;
    } else {
      const ele = document.getElementById('web_message_' + this.currentSplitId) as HTMLDivElement;
      this.webPushMessage = ele.innerHTML;
    }
  }

  // save web push
  saveWebPush(): void {
    if(this.webPushTitle === '') {
      this.dataService.SwalValidationMsg(this.translate.instant('webPushComponent.pleaseEnterTitleAlertMsgLbl'));
      return;
    }

    if(this.webPushButtonSection) {
      if(this.buttonOne === '' || this.btnLinkOne === '') {
        this.dataService.SwalValidationMsg(this.translate.instant('webPushComponent.pleaseEnterButton1TitleNLinkAlertMsgLbl'));
        return;
      }
    }

    if(this.webPushButtonSection && this.showSecondButton) {
      if(this.buttonTwo === '' || this.btnLinkTwo === '') {
        this.dataService.SwalValidationMsg(this.translate.instant('webPushComponent.pleaseEnterButton2TitleNLinkAlertMsgLbl'));
        return;
      }
    }

    if(this.webPushRichNotification && this.imageUrl === '') {
      this.dataService.SwalValidationMsg(this.translate.instant('webPushComponent.pleaseEnterImageUrlAlertMsgLbl'));
      return;
    }

    this.webPushObj = {
      title: this.dataService.formatToneWidgetText(this.webPushTitle),
      body: this.dataService.formatToneWidgetText(this.webPushMessage),
      icon: this.iconUrl,
      callToAction: this.callToAction,
      buttons: this.webPushButtonSection,
      bttn1_title: this.buttonOne,
      bttn1_link: this.btnLinkOne,
      bttn2_title: this.buttonTwo,
      bttn2_link: this.btnLinkTwo,
      rich_media: this.webPushRichNotification,
      image_url: this.imageUrl,
      autoHideNotification: this.autoHide,
    };

    let body = JSON.stringify(this.webPushObj);
    let encodedWebPush = encodeURIComponent(body);

    let payloadJson = {
      channels: [{
        PromotionKey: this.promoKey,
        channelId: this.commChannelKey,
        failSafe: false,
        failsafeSelectedOffers: [],
        html: encodedWebPush,
        json: body,
        promoCommunicationKey: this.dbKey,
        promoSplitKey: this.currentSplitId,
        selectedOffers: this.selectedOffersToSubmit,
        selectedRecoWidgets: [],
        subjectObj: null,
        preHeader: "",
        senderConfigKey: this.senderId,
        senderId: this.senderDetails,
        senderName: this.senderDetails,
        subject: "",
        vendorDesc: this.venderDesc,
        vendorId: this.senderId,
        templateKey: null,
        thumbnailImage: "",
        title: "",
        uuid: ""
      }]
    }

    this.finalWebPushData = payloadJson.channels[0];

    this.shareService.channelsPayloadObj.subscribe((data) => {
      this.channelsPayloadObj = data;
    });

    if(!GlobalConstants.webPushEditMode) {
      if(Array.isArray(this.channelsPayloadObj) && this.channelsPayloadObj.length !== 0) {
        this.channelsPayloadObj.push(this.finalWebPushData);
      } else {
        this.shareService.channelsPayloadObj.next(payloadJson.channels);
      }
    }

    const url = AppConstants.API_END_POINTS.SAVE_ADMIN_PEOMO_TEMPLATE_USAGE;
    this.httpService.post(url, payloadJson).subscribe((data) => {
      this.dataService.SwalSuccessMsg(data.message);
    });
  }

  getSavedData() {
    let url = AppConstants.API_END_POINTS.GET_SAVED_USAGE_TEMPLATES+`?promoKey=${GlobalConstants.promoKey}`;
    this.httpService.post(url).subscribe((data) => {
      if(data.status === 'SUCCESS') {
        if(data.response.adminCommTemplate !== "") {
          this.channelSavedArray = JSON.parse(data.response.adminCommTemplate);
          this.shareService.channelsPayloadObj.next(this.channelSavedArray);
          const webPushObj = this.channelSavedArray.find(x => x.promoSplitKey === this.currentSplitId);
          if(webPushObj !== undefined) {
            GlobalConstants.webPushEditMode = true;
            this.channelDataObj = JSON.parse(webPushObj.templateText);
            this.updateSavedData();
          } else {
            this.setActiveTab();
          }
        }
        this.promotionSplitHelper = JSON.parse(data.response.promotionSplitHelper);
        if(Object.keys(this.promotionSplitHelper).length > 0) {
          GlobalConstants.varArgs = this.promotionSplitHelper.splitsGroups[0].channels[0].varArgs.root.item;
        }
      }
    });
  }

  setActiveTab(): void {
    if(this.currentSplitId !== undefined){
      const setAct = this.channelObj.findIndex(x => x.promoSplitId === this.currentSplitId);
      this.shareService.setActiveChannelTab.next(setAct);
    }
  }

  updateSavedData(): void {
    const webTitle = document.getElementById('web_title_' + this.currentSplitId) as HTMLDivElement;
    const webMessage = document.getElementById('web_message_' + this.currentSplitId) as HTMLDivElement;
    webTitle.innerHTML = this.channelDataObj['title'];
    webMessage.innerHTML = this.channelDataObj['body'];
    this.webPushTitle = this.channelDataObj['title'];
    this.webPushMessage = this.channelDataObj['body'];
    this.iconUrl = this.channelDataObj['icon'];
    this.callToAction = this.channelDataObj['callToAction'];
    this.webPushButtonSection = this.channelDataObj['buttons'];
    this.buttonOne = this.channelDataObj['bttn1_title'];
    this.btnLinkOne = this.channelDataObj['bttn1_link'];
    this.buttonTwo = this.channelDataObj['bttn2_title'];
    this.btnLinkTwo = this.channelDataObj['bttn2_link'];
    if(this.buttonTwo !== '') {
      this.showSecondButton = true;
    }
    this.webPushRichNotification = this.channelDataObj['rich_media'];
    this.imageUrl = this.channelDataObj['image_url'];
    this.autoHide = this.channelDataObj['autoHideNotification'];
    this.setActiveTab();
  }

  getVendorNameObj(): void {
    if(typeof(GlobalConstants.promoKey) !== 'undefined'){
      let url = AppConstants.API_END_POINTS.GET_VENDOR_NAMES+`?promoKey=${GlobalConstants.promoKey}`;
      this.httpService.post(url).subscribe((resultObj) => {
        this.venderDetails = JSON.parse(resultObj.response);
        this.senderDetails = this.venderDetails[this.commChannelKey]['senderIds'][this.senderId];
        this.venderDesc = this.venderDetails[this.commChannelKey]['vendorDesc'];
      });
    }
  }
  onCloseOfferDrawer(){
    this.backropOffersEnable = false;
    this.offerDrawerSectionEnable = false;
    //this.removeLoader();
  }
  finalOffersSelected(res){
    if(Object.keys(res).length > 0){
      Object.keys(res).map( key => {
        Object.values(res[key]).map((each:any) =>{
          const offertemp = "&nbsp;<span class='offerDynamic pointer' contenteditable='false' spellcheck='false' data-currentInputClassName='"+this.selectedPlaceHolderInput+"' data-dbkey='"+key+"' data-name='"+each.name+"'>"+each.value+"</span>&nbsp;";
          this.insertHtmlAtCaret(offertemp);
          this.updateWebPush(this.currentInputFocused);
        })
        
      });
      
    }
  }  
  insertHtmlAtCaret(html) {
    if(GlobalConstants.insertionPoint !== undefined){
      this.inserEmojiAt = GlobalConstants.insertionPoint;
    }
    if(this.inserEmojiAt === undefined){
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
        this.inserEmojiAt.insertNode(frag); 
        if (lastNode) {
          this.inserEmojiAt = this.inserEmojiAt.cloneRange();
          this.inserEmojiAt.setStartAfter(lastNode);
          //sel.removeAllRanges();
          //sel.addRange(range);
        }
      //}      
    } 
  }
  openOfferSliderPopup(evt,isInput,currtInpt){
    let idEle = currtInpt;
    this.selectedPlaceHolderInput = idEle;
    if(this.offerDrawerSectionEnable){
      this.backropOffersEnable = false;
      this.offerDrawerSectionEnable = false;
    }else{
      this.backropOffersEnable = true;
      this.offerDrawerSectionEnable = true;
    }   
    this.loader.HideLoader();
  }

  removeLoader(){
    this.ngZone.run(() => {
      this.loader.loadCount = 0;
      this.loader.HideLoader();         
    });
  }
  collectDraggedOffers(evt){
    this.collectOffersFromInputSelected = [];
    const eachSpan = evt.target.getElementsByTagName('span');
    if(eachSpan.length > 0){
    Object.values(eachSpan).map((obj:any) => {
      let dbkeyAttr = obj.getAttribute('data-dbkey');
      let nameAttr = obj.getAttribute('data-name');
      if(dbkeyAttr !== undefined && nameAttr !== undefined){
        const savedAttrsObj = {"id":dbkeyAttr,"value":nameAttr};
        this.collectOffersFromInputSelected.push(savedAttrsObj);
        this.shareService.webpushEditModeOffersSelected.next(this.collectOffersFromInputSelected);
        console.log(this.collectOffersFromInputSelected);  
      }
    });
  }else{
    this.shareService.webpushEditModeOffersSelected.next(this.collectOffersFromInputSelected);
  }
  }
  ngOnInit(): void {
    this.getSavedData();
    this.getEmojiObj();
    this.shareService.currentSelectedChannelObj.subscribe((res:any) => {
      this.currentSplitId = res.currentSplitId;
      this.promoKey = res.promotionKey;
      this.commChannelKey = res.commChannelKey;
    });
    GlobalConstants.channelObj.forEach(element => {
      if(element.promoSplitId === this.currentSplitId) {
        this.senderId = element.senderId;
        this.dbKey = element.dbKey;
        this.version = element.adaptorVersion;
        this.promoExecutedOrRunning = element.promoExecutedOrRunning;
      }
    });
    this.getVendorNameObj();
  }

}
