import { Component, OnInit, Output,EventEmitter, ViewChild, ElementRef,HostListener, AfterViewInit, TemplateRef } from "@angular/core";
import { AppConstants } from "@app/app.constants";
import { GlobalConstants } from '../common/globalConstants';
import { HttpService } from "@app/core/services/http.service";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataService } from '@app/core/services/data.service';
import { LoaderService } from '@app/core/services/loader.service';
import { SharedataService } from '@app/core/services/sharedata.service';
import Swal from 'sweetalert2';
import { off } from "process";
import { TranslateService } from '@ngx-translate/core';

declare const colorPickerValidator: any;
declare const MediumEditor: any;

@Component({
  selector: "app-mobile-push",
  templateUrl: "./mobile-push.component.html",
  styleUrls: ["./mobile-push.component.scss"],
})
export class MobilePushComponent implements OnInit, AfterViewInit {
  bsModalRef: any = BsModalRef;
  modalRef?: BsModalRef;
  selectedMobileTab: string = "android";
  androidTitle: string = '';
  androidMessage: string = '';
  iosTitle: string = '';
  iosMessage: string = '';
  androidCollapsed: boolean = false;
  androidExpanded: boolean = true;
  iosCollapsed: boolean = false;
  iosExpanded: boolean = true;
  androidTitleEmoji: boolean = false;
  iosTitleEmoji: boolean = false;
  androidMsgEmoji: boolean = false;
  iosMsgEmoji: boolean = false;
  emojiObj: any;
  customEmojis: any = [];
  textActual: any;
  inserEmojiAt: any;
  mobilePushObj: any = {};
  currentSplitId: any;
  promoKey: any;
  commChannelKey: any;
  channelName: any;
  senderId: any;
  venderDetails: any;
  senderDetails: any;
  venderDesc: any;
  dbKey: any;
  androidTextCollapsed: boolean = false;
  iosTextCollapsed: boolean = false;
  keyValueArray: any[] = [{key: '', value: '', add: true}];
  keyValueObj: any = {};
  channelSavedArray: any;
  channelDataObj: any;
  finalMobilePushData: any;
  channelsPayloadObj: any;
  androidRichNotification: boolean = false;
  iosRichNotification: boolean = false;
  androidSelectedMedia: string = 'single';
  iosSelectedMedia: string = 'single';
  selectedPriority: string = 'default';
  imageUrl: string = '';
  iconUrl: string = '';
  mediaUrl: string = '';
  badgeCount: number = 0;
  androidOrientation: string = 'landscape';
  iosOrientation: string = 'landscape';
  androidSlideSelected: string = '';
  iosSlideSelected: string = '';
  
  isTemplateEditMode:boolean = false;
  channelObj: any;
  version: any;
  offerDrawerSectionEnable: boolean = false;
  backropOffersEnable:boolean = false;
  ngZone: any;
  selectedOffersToSubmit: any;
  selectedPlaceHolderInput: any;
  currentInputFocused: any;
  promotionSplitHelper: any;
  promoExecutedOrRunning: any;
  editor: any;
  addOffersBtnEnableMsg: boolean = false;
  addOffersBtnEnableTitle: boolean = false;
  collectOffersFromInputSelected: any = [];
  i18nObject:any = {};
  DEFAULT_LANGUAGE: string = '';
  slideCountLable:string = '';
  androidSliderItems: any[] = [{
    slide: 'Slide 1',
    img_url: '',
    caption: '',
    subcaption: '',
    link: ''
  },
  {
    slide: 'Slide 2',
    img_url: '',
    caption: '',
    subcaption: '',
    link: ''
  }];
  iosSliderItems: any[] = [{
    slide: 'Slide 1',
    img_url: '',
    caption: '',
    subcaption: '',
    link: ''
  },
  {
    slide: 'Slide 2',
    img_url: '',
    caption: '',
    subcaption: '',
    link: ''
  }];
  slide1label: string = '';
  slide2label: string = '';
  pushPayloadObj: any = {};
  constructor(private httpService: HttpService, private dataService: DataService, private shareService:SharedataService,
   private modalService:BsModalService, private loader:LoaderService, private translate:TranslateService) {
    AppConstants.OFFERS_ENABLE.MERGE_TAG = true;
    AppConstants.OFFERS_ENABLE.RECOMMENDATION_OFFERS = false;    
    this.slideCountLable = this.translate.instant('designEditor.mobilePushComponent.slideCountLbl');
    this.androidSlideSelected = this.slideCountLable+' 1';
    this.iosSlideSelected = this.slideCountLable+' 1';
    this.slide1label = this.slideCountLable+' 1';
    this.slide2label = this.slideCountLable+' 2';
    this.androidSliderItems[0].slide = this.slideCountLable+' 1';
    this.androidSliderItems[1].slide = this.slideCountLable+' 2';
    this.iosSliderItems[0].slide = this.slideCountLable+' 1';
    this.iosSliderItems[1].slide = this.slideCountLable+' 2';
    this.shareService.channelObj.subscribe(res => {
      this.channelObj = res;   
    });
    this.shareService.setActiveLanguage.subscribe((res) => {
      this.DEFAULT_LANGUAGE = res;
    });
    
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
    // this.shareService.finalOffersSelected.subscribe(res => {
      
    //   if(Object.keys(res).length > 0){
    //     Object.keys(res).map( key => {
    //       Object.values(res[key]).map((each:any) =>{
    //         const offertemp = "&nbsp;<span class='offerDynamic pointer' contenteditable='false' spellcheck='false' data-currentInputClassName='"+this.selectedPlaceHolderInput+"' data-dbkey='"+key+"' data-name='"+each.name+"'>"+each.value+"</span>&nbsp;";
    //         this.insertHtmlAtCaret(offertemp);
    //         this.updateMobilePreview(this.currentInputFocused);
    //       })
          
    //     });
        
    //   }
    // });
    this.shareService.offersToSubmit.subscribe(res => {
      if(res.length > 0 || res !== undefined){
        this.selectedOffersToSubmit = res;
      }
    });
  }

  getBackOffers(evt,selectedKey){
    this.backropOffersEnable = true;
    this.offerDrawerSectionEnable = true;
  
    //this.openOfferSliderPopup(evt,this.currentInputFocused);
  }

  editOffersArea(selectId, evt){
    this.offerDrawerSectionEnable = true;
  }

  removeSelectedOffers(evt,removeId){
    evt.target.remove();
  }

  switchMobileTabs(tab: any): void {
    this.selectedMobileTab = tab;
    setTimeout(()=> {
      if(tab === 'android') {
        this.loadMediumEditor();
        this.updateMediumEditorData();
        let toneAndTitle:any, toneAndMsg:any;
        toneAndTitle = this.androidTitle;
        toneAndMsg = this.androidMessage;

        const ele1 = document.getElementById('android_title_' + this.currentSplitId) as HTMLDivElement;
        const ele2 = document.getElementById('android_message_' + this.currentSplitId) as HTMLDivElement;
        ele1.innerHTML = toneAndTitle;
        ele2.innerHTML = toneAndMsg;
      } else {
        let toneiosTitle:any, toneiosMsg:any;
        toneiosTitle = this.iosTitle;
        toneiosMsg = this.iosMessage;

        const ele1 = document.getElementById('ios_title_' + this.currentSplitId) as HTMLDivElement;
        const ele2 = document.getElementById('ios_message_' + this.currentSplitId) as HTMLDivElement;
        ele1.innerHTML = toneiosTitle;
        ele2.innerHTML = toneiosMsg;
      }
    }, 0);
  }

  switchExpandAndCollapse(tab: any, param: any): void {
    if (tab === "android") {
      if (param === "collapsed") {
        this.androidCollapsed = true;
        this.androidExpanded = false;
      } else {
        this.androidCollapsed = false;
        this.androidExpanded = true;
      }
    } else {
      if (param === "collapsed") {
        this.iosCollapsed = true;
        this.iosExpanded = false;
      } else {
        this.iosCollapsed = false;
        this.iosExpanded = true;
      }
    }
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
    if(this.inserEmojiAt !== undefined) {
      if(this.inserEmojiAt.startContainer.id === 'android_' + param + '_' + this.currentSplitId ||
      this.inserEmojiAt.startContainer.id === 'ios_' + param + '_' + this.currentSplitId ||
      this.inserEmojiAt.startContainer.parentElement.id === 'android_' + param + '_' + this.currentSplitId ||
      this.inserEmojiAt.startContainer.parentElement.id === 'ios_' + param + '_' + this.currentSplitId ||
      this.inserEmojiAt.startContainer.parentElement.offsetParent.id === 'android_' + param + '_' + this.currentSplitId ||
      this.inserEmojiAt.startContainer.parentElement.offsetParent.id === 'ios_' + param + '_' + this.currentSplitId) {
        this.inserEmojiAt.insertNode(document.createTextNode(textNative));
        this.updateMobilePreview(param);
      }
    }
    if(this.selectedMobileTab === 'android') {
      if(param === 'title') {
        this.androidTitleEmoji = !this.androidTitleEmoji;
      } else {
        this.androidMsgEmoji = !this.androidMsgEmoji;
      }
    } else {
      if(param === 'title') {
        this.iosTitleEmoji = !this.iosTitleEmoji;
      } else {
        this.iosMsgEmoji = !this.iosMsgEmoji;
      }
    }
  }
  checkElement(evt){
    if(evt.target.className === ""){
      if(evt.target.parentElement.className.indexOf("mobileTitleStyle") !== -1){
        this.collectDraggedOffers(evt);
        this.addOffersBtnEnableTitle = true;
      }else{
        if(evt.target.firstElementChild !== null){
          if(evt.target.firstElementChild.getAttribute("data-currentinputclassname") === "mobileTitleStyle"){
            this.collectDraggedOffers(evt);
            this.addOffersBtnEnableTitle = true;
          }else{
            this.addOffersBtnEnableTitle = false;
          }
        }else{
          this.addOffersBtnEnableTitle = false;
        }
      } 
      if(evt.target.parentElement.className.indexOf("mobileMsgStyle") !== -1){
        this.collectDraggedOffers(evt);
        this.addOffersBtnEnableMsg = true;
      }else{
        if(evt.target.firstElementChild !== null){
          if(evt.target.firstElementChild.getAttribute("data-currentinputclassname") === "mobileMsgStyle"){
            this.collectDraggedOffers(evt);
            this.addOffersBtnEnableMsg = true;
          }else{
            this.addOffersBtnEnableMsg = false;
          }
        }else{
          this.addOffersBtnEnableMsg = false;
        }
      } 
    }else{
      if(evt.target.className.indexOf("mobileTitleStyle") !== -1){
        this.collectDraggedOffers(evt);
        this.addOffersBtnEnableTitle = true;
      }else{
        this.addOffersBtnEnableTitle = false;
      } 
      if(evt.target.className.indexOf("mobileMsgStyle") !== -1){
        this.collectDraggedOffers(evt);
        this.addOffersBtnEnableMsg = true;
      }else{
        this.addOffersBtnEnableMsg = false;
      } 
    }
    
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
        this.shareService.editModeOffersSelected.next(this.collectOffersFromInputSelected);
        console.log(this.collectOffersFromInputSelected);  
      }
    });
  }else{
    this.shareService.editModeOffersSelected.next(this.collectOffersFromInputSelected);
  }
  }
  getCaretIndex(text:any, param:string,inptClassName) {
    this.selectedPlaceHolderInput = inptClassName;
    var sel, range;
    if (window.getSelection) {
      sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        //range.deleteContents();
        this.inserEmojiAt = range;
        GlobalConstants.insertionPoint = this.inserEmojiAt;
      }
    }
    this.updateMobilePreview(param);
    this.currentInputFocused = param;
    // if(text.target.className == "offerDynamic pointer") {
    //   this.getBackOffers(text.targte,this.currentInputFocused);
    //   //this.openOfferSliderPopup(text.targte,this.currentInputFocused);
    // }
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

  updateMobilePreview(param:string): void {
    if(this.selectedMobileTab === 'android') {
      if(param === 'title') {
        const ele = document.getElementById('android_title_' + this.currentSplitId) as HTMLDivElement;
        this.androidTitle = ele.innerHTML.replace(/<[\/]{0,1}(div)[^><]*>/g,' ').replace(/(?:&nbsp;|<br>)/g,' ').replace(/\<p>/gi, '').replace(/\<\/p>/gi, '');
        if(this.androidTitle.match('tonewidget')) {
          this.androidTitle = this.androidTitle.replace(/\<xmp style="margin:0;display:inline">/gi,'').replace(/\<\/xmp>/gi, '')
          .replace(/\&lt;/gi, '<').replace(/&gt;/gi, '>').replace('<span style="font-size: 0.8125rem;"><tonewidget></span>', '<tonewidget>')
          .replace(/\<span style="font-size: 0.8125rem;"><tonewidget>/gi, '<tonewidget>').replace(/\<\/tonewidget><\/span>/gi, '</tonewidget>');
        }
      } else {
        const ele = document.getElementById('android_message_' + this.currentSplitId) as HTMLDivElement;
        this.androidMessage = ele.innerHTML.replace(/<[\/]{0,1}(div)[^><]*>/g,' ').replace(/(?:&nbsp;|<br>)/g,' ').replace(/\<p>/gi, '').replace(/\<\/p>/gi, '');
        if(this.androidMessage.match('tonewidget')) {
          this.androidMessage = this.androidMessage.replace(/\<xmp style="margin:0;display:inline">/gi,'').replace(/\<\/xmp>/gi, '')
          .replace(/\&lt;/gi, '<').replace(/&gt;/gi, '>').replace('<span style="font-size: 0.8125rem;"><tonewidget></span>', '<tonewidget>')
          .replace(/\<span style="font-size: 0.8125rem;"><tonewidget>/gi, '<tonewidget>').replace(/\<\/tonewidget><\/span>/gi, '</tonewidget>');
        }
      }
    } else {
      if(param === 'title') {
        const ele = document.getElementById('ios_title_' + this.currentSplitId) as HTMLDivElement;
        this.iosTitle = ele.innerHTML.replace(/<[\/]{0,1}(div)[^><]*>/g,' ').replace(/(?:&nbsp;|<br>)/g,' ').replace(/\<p>/gi, '').replace(/\<\/p>/gi, '');
        if(this.iosTitle.match('tonewidget')) {
          this.iosTitle = this.iosTitle.replace(/\<xmp style="margin:0;display:inline">/gi,'').replace(/\<\/xmp>/gi, '')
          .replace(/\&lt;/gi, '<').replace(/&gt;/gi, '>');
        }
      } else {
        const ele = document.getElementById('ios_message_' + this.currentSplitId) as HTMLDivElement;
        this.iosMessage = ele.innerHTML.replace(/<[\/]{0,1}(div)[^><]*>/g,' ').replace(/(?:&nbsp;|<br>)/g,' ').replace(/\<p>/gi, '').replace(/\<\/p>/gi, '');
        if(this.iosMessage.match('tonewidget')) {
          this.iosMessage = this.iosMessage.replace(/\<xmp style="margin:0;display:inline">/gi,'').replace(/\<\/xmp>/gi, '')
          .replace(/\&lt;/gi, '<').replace(/&gt;/gi, '>');
        }
      }
    }
  }

  // Rich Notification functionality
  showRichNotification(): void {
    const toggle = document.getElementById(this.selectedMobileTab + 'RichToggle') as HTMLInputElement;
    if(GlobalConstants.mobilePushEditMode && this.channelDataObj !== undefined) {
      if(this.selectedMobileTab === 'android') {
        if(this.androidRichNotification && (this.imageUrl !== '' || this.iconUrl !== '')) {
          Swal.fire({
            title: this.translate.instant('designEditor.mobilePushComponent.singleMediaValidation'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('yes'),
            cancelButtonText: this.translate.instant('cancel')
          }).then((result) => {
            if (result.value) {
              this.resetRichNotification();
            } else {
              toggle.checked = true;
            }
          });
        } else if(this.androidRichNotification && (this.androidSliderItems[0].img_url !== '' || this.androidSliderItems[1].img_url !== '')) {
          Swal.fire({
            title: this.translate.instant('designEditor.mobilePushComponent.carouselValidation'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('yes'),
            cancelButtonText: this.translate.instant('cancel')
          }).then((result) => {
            if (result.value) {
              this.resetRichNotification();
            } else {
              toggle.checked = true;
            }
          });
        } else {
          this.androidRichNotification = !this.androidRichNotification;
        }
      } else {
        if(this.iosRichNotification && (this.mediaUrl !== '' || this.badgeCount !== 0)) {
          Swal.fire({
            title: this.translate.instant('designEditor.mobilePushComponent.singleMediaValidation'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('yes'),
            cancelButtonText: this.translate.instant('cancel')
          }).then((result) => {
            if (result.value) {
              this.resetRichNotification();
            } else {
              toggle.checked = true;
            }
          });
        } else if(this.iosRichNotification && (this.iosSliderItems[0].img_url !== '' || this.iosSliderItems[1].img_url !== '')) {
          Swal.fire({
            title: this.translate.instant('designEditor.mobilePushComponent.carouselValidation'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('yes'),
            cancelButtonText: this.translate.instant('cancel')
          }).then((result) => {
            if (result.value) {
              this.resetRichNotification();
            } else {
              toggle.checked = true;
            }
          });
        } else {
          this.iosRichNotification = !this.iosRichNotification;
        }
      }
    } else {
      if(toggle.checked) {
        if(this.selectedMobileTab === 'android') {
          this.androidRichNotification = true;
        } else {
          this.iosRichNotification = true;
        }
      } else {
        this.resetRichNotification();
      }
    }
  }

  // Select Rich Notification Media
  selectMedia(media:string, event:any): void {
    event.target.checked = false;
    if(this.selectedMobileTab === 'android') {
      if(media === 'single') {
        if(this.androidSliderItems[0].img_url !== '' || this.androidSliderItems[1].img_url !== '') {
          Swal.fire({
            title: this.translate.instant('designEditor.mobilePushComponent.carouselValidation'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('yes'),
            cancelButtonText: this.translate.instant('cancel')
          }).then((result) => {
            if (result.value) {
              this.resetCarousel();
              this.androidSelectedMedia = media;
            }
          });
        } else {
          this.androidSelectedMedia = media;
        }
      } else {
        if(this.imageUrl !== '' || this.iconUrl !== '') {
          Swal.fire({
            title: this.translate.instant('designEditor.mobilePushComponent.singleMediaValidation'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('yes'),
            cancelButtonText: this.translate.instant('cancel')
          }).then((result) => {
            if (result.value) {
              this.resetSingleMedia();
              this.androidSelectedMedia = media;
            }
          });
        } else {
          this.androidSelectedMedia = media;
        }
      }
    } else {
      if(media === 'single') {
        if(this.iosSliderItems[0].img_url !== '' || this.iosSliderItems[1].img_url !== '') {
          Swal.fire({
            title: this.translate.instant('designEditor.mobilePushComponent.carouselValidation'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('yes'),
            cancelButtonText: this.translate.instant('cancel')
          }).then((result) => {
            if (result.value) {
              this.resetCarousel();
              this.iosSelectedMedia = media;
            }
          });
        } else {
          this.iosSelectedMedia = media;
        }
      } else {
        if(this.mediaUrl !== '' || this.badgeCount !== 0) {
          Swal.fire({
            title: this.translate.instant('designEditor.mobilePushComponent.singleMediaValidation'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('yes'),
            cancelButtonText: this.translate.instant('cancel')
          }).then((result) => {
            if (result.value) {
              this.resetSingleMedia();
              this.iosSelectedMedia = media;
            }
          });
        } else {
          this.iosSelectedMedia = media;
        }
      }
    }
  }

  selectPriority(param:string): void {
    this.selectedPriority = param;
  }

  // Image Carousel Functionality
  switchLandPort(param:string): void {
    if(this.selectedMobileTab === 'android') {
      this.androidOrientation = param;
    } else {
      this.iosOrientation = param;
    }
  }

  selectSlide(slide:string): void {
    if(this.selectedMobileTab === 'android') {
      this.androidSlideSelected = slide;
    } else {
      this.iosSlideSelected = slide;
    }
  }

  addSlides(): void {
    if (this.selectedMobileTab === "android") {
      let length = this.androidSliderItems.length;
      if (length < AppConstants.MOBILE_PUSH_RANGE.MAX) {
        let num;
        let s3 = this.androidSliderItems.find((item) => item.slide === this.slideCountLable+' 3');
        let s4 = this.androidSliderItems.find((item) => item.slide === this.slideCountLable+' 4');
        if ((length === 3 && s3 === undefined) || (length === 4 && s4 === undefined) || 
        (length === 3 && s4 === undefined || (length === 4 && s3 === undefined))) {
          s3 === undefined ? (num = 3) : (num = 4);
        } else {
          num = length + 1;
        }

        let slideObj = {
          slide: this.slideCountLable+' ' + num,
          img_url: "",
          caption: "",
          subcaption: "",
          link: "",
        };
        this.androidSliderItems.splice(num - 1, 0, slideObj);
        this.androidSlideSelected = this.slideCountLable+' ' + num;
      }
    } else {
      let length = this.iosSliderItems.length;
      if (length < AppConstants.MOBILE_PUSH_RANGE.MAX) {
        let num;
        let s3 = this.iosSliderItems.find((item) => item.slide === this.slideCountLable+' 3');
        let s4 = this.iosSliderItems.find((item) => item.slide === this.slideCountLable+' 4');
        if ((length === 3 && s3 === undefined) || (length === 4 && s4 === undefined) || 
        (length === 3 && s4 === undefined || (length === 4 && s3 === undefined))) {
          s3 === undefined ? (num = 3) : (num = 4);
        } else {
          num = length + 1;
        }

        let slideObj = {
          slide: this.slideCountLable+' ' + num,
          img_url: "",
          caption: "",
          subcaption: "",
          link: "",
        };
        this.iosSliderItems.splice(num - 1, 0, slideObj);
        this.iosSlideSelected = this.slideCountLable+' ' + num;
      }
    }
  }

  removeSlides(): void {
    if(this.selectedMobileTab === 'android') {
      let index = this.androidSliderItems.findIndex((item) => item.slide === this.androidSlideSelected);
      this.androidSliderItems.splice(index, 1);
      this.androidSlideSelected = this.slideCountLable+' 1';
    } else {
      let index = this.iosSliderItems.findIndex((item) => item.slide === this.iosSlideSelected);
      this.iosSliderItems.splice(index, 1);
      this.iosSlideSelected = this.slideCountLable+' 1';
    }
  }

  // Image Slider next and prev
  moveSlide(param:string): void {
    if(this.selectedMobileTab === 'android') {
      let index = this.androidSliderItems.findIndex((item) => item.slide === this.androidSlideSelected);
      if(param === 'next') {
        let nextIndex = index + 1;
        if(nextIndex === this.androidSliderItems.length) {
          nextIndex = 0;
        }
        this.androidSlideSelected = this.androidSliderItems[nextIndex].slide;
      } else {
        let nextIndex = index - 1;
        if(nextIndex === -1) {
          nextIndex = this.androidSliderItems.length - 1;
        }
        this.androidSlideSelected = this.androidSliderItems[nextIndex].slide;
      }
    } else {
      let index = this.iosSliderItems.findIndex((item) => item.slide === this.iosSlideSelected);
      if(param === 'next') {
        let nextIndex = index + 1;
        if(nextIndex === this.iosSliderItems.length) {
          nextIndex = 0;
        }
        this.iosSlideSelected = this.iosSliderItems[nextIndex].slide;
      } else {
        let nextIndex = index - 1;
        if(nextIndex === -1) {
          nextIndex = this.iosSliderItems.length - 1;
        }
        this.iosSlideSelected = this.iosSliderItems[nextIndex].slide;
      }
    }
  }

  // reset Single Media
  resetSingleMedia() {
    if(this.selectedMobileTab === 'android') {
      this.imageUrl = '';
      this.iconUrl = '';
      this.selectedPriority = 'default';
    } else {
      this.mediaUrl = '';
      this.badgeCount = 0;
    }
  }

  // reset carousel
  resetCarousel(): void {
    let tempArr = [{
      slide: this.slideCountLable+' 1',
      img_url: '',
      caption: '',
      subcaption: '',
      link: ''
    },
    {
      slide: this.slideCountLable+' 2',
      img_url: '',
      caption: '',
      subcaption: '',
      link: ''
    }];
    if(this.selectedMobileTab === 'android') {
      this.androidSliderItems = tempArr;
      this.androidOrientation = 'landscape';
      this.androidSlideSelected = this.slideCountLable+' 1';
    } else {
      this.iosSliderItems = tempArr;
      this.iosOrientation = 'landscape';
      this.iosSlideSelected = this.slideCountLable+' 1';
    }
  }

  // reset Rich Notification
  resetRichNotification(): void {
    if(this.selectedMobileTab === 'android') {
      this.androidRichNotification = false;
      this.androidSelectedMedia = 'single';
    } else {
      this.iosRichNotification = false;
      this.iosSelectedMedia = 'single';
    }
    this.resetSingleMedia();
    this.resetCarousel();
  }

  // Key Value Pair
  addNewKeyValue(item:any): void {
    if(this.keyValueArray.length >= AppConstants.MOBILE_PUSH_RANGE.MIN && this.keyValueArray.length < AppConstants.MOBILE_PUSH_RANGE.MAX) {
      item.add = false;
      if(this.keyValueArray.length === 4) {
        this.keyValueArray.push({key: '', value: '', add: false});
      } else {
        this.keyValueArray.push({key: '', value: '', add: true});
      }
    }
  }

  removeKeyValue(item:any): void {
    if(item.key !== '' || item.value !== '') {
      Swal.fire({
        title: this.translate.instant('designEditor.mobilePushComponent.dataValidation'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: this.translate.instant('yes'),
        cancelButtonText: this.translate.instant('cancel')
      }).then((result) => {
        if (result.value) {
          if(this.keyValueArray.length <= AppConstants.MOBILE_PUSH_RANGE.MAX) {
            let index = this.keyValueArray.indexOf(item);
            this.keyValueArray.splice(index, 1);
            this.keyValueArray[this.keyValueArray.length - 1].add = true;
          }
        }
      });
    } else {
      if(this.keyValueArray.length <= AppConstants.MOBILE_PUSH_RANGE.MAX) {
        let index = this.keyValueArray.indexOf(item);
        this.keyValueArray.splice(index, 1);
        this.keyValueArray[this.keyValueArray.length - 1].add = true;
      }
    }
  }
  generateMobileOushSaveJsonMethod() {
    let isValid:boolean = true;
    if(this.androidTitle === '' || this.androidTitle.trim() === '') {
      this.dataService.SwalValidationMsg(this.translate.instant('designEditor.mobilePushComponent.androidTitleValidation'));
      isValid = false;
      return;
    }
    if(this.iosTitle === '') {
      this.dataService.SwalValidationMsg(this.translate.instant('designEditor.mobilePushComponent.iosTitleValidation'));
      isValid = false;
      return;
    }
    if(this.androidMessage === '' || this.androidMessage.trim() === '') {
      this.dataService.SwalValidationMsg(this.translate.instant('designEditor.mobilePushComponent.androidMsgValidation'));
      isValid = false;
      return;
    }
    if(this.iosMessage === '') {
      this.dataService.SwalValidationMsg(this.translate.instant('designEditor.mobilePushComponent.iosMsgValidation'));
      isValid = false;
      return;
    }

    if(this.androidRichNotification && this.androidSelectedMedia === 'single' && this.imageUrl === '') {
      this.dataService.SwalValidationMsg(this.translate.instant('designEditor.mobilePushComponent.singleMediaAndroid'));
      isValid = false;
      return;
    }

    if(this.iosRichNotification && this.iosSelectedMedia === 'single' && this.mediaUrl === '') {
      this.dataService.SwalValidationMsg(this.translate.instant('designEditor.mobilePushComponent.singleMediaIos'));
      isValid = false;
      return;
    }

    let androidDataEmpty: boolean = false;
    if(this.androidRichNotification && this.androidSelectedMedia === 'carousel') {
      this.androidSliderItems.forEach(item => {
        if(item.img_url === '' || item.caption === '' || item.subcaption === '') {
          androidDataEmpty = true;
        }
      })
    }
    if(androidDataEmpty) {
      this.dataService.SwalValidationMsg(this.translate.instant('designEditor.mobilePushComponent.sliderAndroidValidation'));
      isValid = false;
      return;
    }

    let iosDataEmpty: boolean = false;
    if(this.iosRichNotification && this.iosSelectedMedia === 'carousel') {
      this.iosSliderItems.forEach(item => {
        if(item.img_url === '' || item.caption === '' || item.subcaption === '') {
          iosDataEmpty = true;
        }
      })
    }
    if(iosDataEmpty) {
      this.dataService.SwalValidationMsg(this.translate.instant('designEditor.mobilePushComponent.sliderIosValidation'));
      isValid = false;
      return;
    }

    this.mobilePushObj = {
      isHtmlFormatter: false,
      html_title: null,
      html_body: null,
      title: null,
      body: null,
      rich_media: false,
      android: {
        isHtmlFormatter: false,
        title: this.dataService.formatToneWidgetText(this.androidTitle),
        body: this.dataService.formatToneWidgetText(this.androidMessage),
        html_title: null,
        html_body: null,
        rich_media: this.androidRichNotification,
        image_url: this.imageUrl,
        icon_url: this.iconUrl,
        priority: this.selectedPriority,
      },
      ios: {
        title: this.dataService.formatToneWidgetText(this.iosTitle),
        body: this.dataService.formatToneWidgetText(this.iosMessage),
        rich_media: this.iosRichNotification,
        media_url: this.mediaUrl,
        badge: this.badgeCount,
      },
      version: this.version,
    };

    if(this.keyValueArray.length !== 0) {
      this.keyValueArray.forEach((item) => {
        if(item.key !== '') {
          this.keyValueObj[item.key] = item.value;
        }
      });
    }

    if(Object.keys(this.keyValueObj).length !== 0) {
      this.mobilePushObj['custom'] = this.keyValueObj;
    }

    if(this.androidSelectedMedia === 'carousel') {
      let tempArr: any[] = [];
      for (let item of this.androidSliderItems) {
        let obj = {
          img_url: item.img_url,
          caption: item.caption,
          subcaption: item.subcaption,
          link: item.link
        }
        tempArr.push(obj);
      }
      let androidWidget = {
        type: this.androidSelectedMedia,
        content: {
          orientation: this.androidOrientation,
          items: tempArr,
        }
      }
      this.mobilePushObj['android']['widget'] = androidWidget;
    }

    if(this.iosSelectedMedia === 'carousel') {
      let tempArr: any[] = [];
      for (let item of this.iosSliderItems) {
        let obj = {
          img_url: item.img_url,
          caption: item.caption,
          subcaption: item.subcaption,
          link: item.link
        }
        tempArr.push(obj);
      }
      let iosWidget = {
        type: this.iosSelectedMedia,
        content: {
          orientation: this.iosOrientation,
          items: tempArr,
        }
      }
      this.mobilePushObj['ios']['widget'] = iosWidget;
      //this.mobilePushObj['ios']['img-url'] = tempArr[0].img_url;
    }
    return isValid;

  }
  // Save push notification
  saveMobilePush(): void {
    if(!this.generateMobileOushSaveJsonMethod()) {
      return;
    }     
    let body = JSON.stringify(this.mobilePushObj);
    let encodedMobilePush = encodeURIComponent(body);

    let payloadJson = {
      channels: [{
        PromotionKey: this.promoKey,
        channelId: this.commChannelKey,
        failSafe: false,
        failsafeSelectedOffers: [],
        html: encodedMobilePush,
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

    this.finalMobilePushData = payloadJson.channels[0];

    this.shareService.channelsPayloadObj.subscribe((data) => {
      this.channelsPayloadObj = data;
    });

    if(!GlobalConstants.mobilePushEditMode) {
      if(Array.isArray(this.channelsPayloadObj) && this.channelsPayloadObj.length !== 0) {
        this.channelsPayloadObj.push(this.finalMobilePushData);
      } else {
        this.shareService.channelsPayloadObj.next(payloadJson.channels);
      }
    }

    const url = AppConstants.API_END_POINTS.SAVE_ADMIN_PEOMO_TEMPLATE_USAGE;
    this.httpService.post(url, payloadJson).subscribe((data) => {
      this.dataService.SwalSuccessMsg(data.message);
    });

  }

  getVendorNameObj() {
    if(typeof(GlobalConstants.promoKey) !== 'undefined'){
      let url = AppConstants.API_END_POINTS.GET_VENDOR_NAMES+`?promoKey=${GlobalConstants.promoKey}`;
      this.httpService.post(url).subscribe((resultObj) => {
        this.venderDetails = JSON.parse(resultObj.response);
        this.senderDetails = this.venderDetails[this.commChannelKey]['senderIds'][this.senderId];
        this.venderDesc = this.venderDetails[this.commChannelKey]['vendorDesc'];
      });
    }
  }

  getSavedData() {
    let url = AppConstants.API_END_POINTS.GET_SAVED_USAGE_TEMPLATES+`?promoKey=${GlobalConstants.promoKey}`;
    this.httpService.post(url).subscribe((data) => {
      if(data.status === 'SUCCESS') {
        if(data.response.adminCommTemplate !== "") {
          this.channelSavedArray = JSON.parse(data.response.adminCommTemplate);
          this.shareService.channelsPayloadObj.next(this.channelSavedArray);
          const pushObj = this.channelSavedArray.find(x => x.promoSplitKey === this.currentSplitId);
          if(pushObj !== undefined) {
            GlobalConstants.mobilePushEditMode = true;
            this.channelDataObj = JSON.parse(pushObj.templateText);
            this.updateSavedData(this.channelDataObj);
          } else {
            this.setActiveTab('');
          }
          
        }
        this.promotionSplitHelper = JSON.parse(data.response.promotionSplitHelper);
          if(Object.keys(this.promotionSplitHelper).length > 0) {
            GlobalConstants.varArgs = this.promotionSplitHelper.splitsGroups[0].channels[0].varArgs.root.item;
          }
      }
    });
  }
  
  setActiveTab(currentObj:any): void {
    if(this.currentSplitId !== undefined){
      const setAct = this.channelObj.findIndex(x => x.promoSplitId === this.currentSplitId);
      this.shareService.setActiveChannelTab.next(setAct);
    }
  }

  formatToneWidgetText(inputText:any) {

    return inputText.replace(/\<tonewidget>/gi, '<xmp style="margin:0;display:inline"><tonewidget>').
    replace(/\<\/tonewidget>/gi, '</tonewidget></xmp>');

    // let toneWidgetText: any;
    // let startPos = inputText.indexOf('<tonewidget>');
    // if(startPos > 0) {
    //   inputText = inputText.substring(0, startPos) + '<xmp style="margin:0;display:inline">' + inputText.substr(startPos);
    // } else {
    //   inputText = '<xmp style="margin:0;display:inline">' + inputText;
    // }

    // let endPos = inputText.indexOf('</tonewidget>');
    // endPos = endPos + 13;
    // inputText = inputText.substring(0, endPos) + '</xmp>' + inputText.substr(endPos);
    // toneWidgetText = inputText;
    // return toneWidgetText;
  }
  
  updateSavedData(channelData:any) {
    let toneAndTitle:any, toneAndMsg:any;
    if(channelData !== undefined){
    this.androidTitle = channelData['android']['title'];
    this.androidMessage = channelData['android']['body'];
    this.iosTitle = channelData['ios']['title'];
    this.iosMessage = channelData['ios']['body'];
    toneAndTitle = this.androidTitle;
    toneAndMsg = this.androidMessage;


    const androidTitle = document.getElementById('android_title_' + this.currentSplitId) as HTMLDivElement;
    const androidMessage = document.getElementById('android_message_' + this.currentSplitId) as HTMLDivElement;
    androidTitle.innerHTML = toneAndTitle;
    androidMessage.innerHTML = toneAndMsg;

    // Single Media
    this.androidRichNotification = channelData['android']['rich_media'];
    this.imageUrl = channelData['android']['image_url'];
    this.iconUrl = channelData['android']['icon_url'];
    this.selectedPriority = channelData['android']['priority'];
    if(this.imageUrl !== '' || this.iconUrl !== '') {
      this.androidSelectedMedia = 'single';
    }

    this.iosRichNotification = channelData['ios']['rich_media'];
    this.mediaUrl = channelData['ios']['media_url'];
    this.badgeCount = channelData['ios']['badge'];
    if(this.mediaUrl !== '' || this.badgeCount !== 0) {
      this.iosSelectedMedia = 'single';
    }

    // Image Carousel
    if(channelData['android']['widget'] !== undefined) {
      let tempArr = channelData['android']['widget']['content']['items'];
      tempArr.forEach((val, i) => {
         val.slide = this.slideCountLable+' ' + (i+1);
      })
      this.androidSelectedMedia = channelData['android']['widget']['type'];
      this.androidOrientation = channelData['android']['widget']['content']['orientation'];
      this.androidSliderItems = tempArr;
    }

    if(channelData['ios']['widget'] !== undefined) {
      let tempArr = channelData['ios']['widget']['content']['items'];
      tempArr.forEach((val, i) => {
         val.slide = this.slideCountLable+' ' + (i+1);
      })
      this.iosSelectedMedia = channelData['ios']['widget']['type'];
      this.iosOrientation = channelData['ios']['widget']['content']['orientation'];
      this.iosSliderItems = tempArr;
    }

    // Key Value Pair
    if(channelData['custom'] !== undefined) {
      if(Object.keys(channelData['custom']).length > 0) {
        this.keyValueArray = [];
        for(const [key, value] of Object.entries(channelData['custom'])) {
          this.keyValueArray.push({key: key, value: value, add: false});
        }
        this.keyValueArray[this.keyValueArray.length - 1].add = true;
      }
    }
  }
  this.setActiveTab(this.channelObj);
  }
// open push attachment modal
  openTestPushModal(modalTemplate: TemplateRef<any>) {
    if(!this.generateMobileOushSaveJsonMethod()) {
      return;
    } 

   let pushObj = JSON.stringify(this.mobilePushObj);
   let encodePushObj = encodeURIComponent(pushObj);

    let payloadJson = {
      channels: [{
        commChannelKey: this.commChannelKey,
        currentSplitid: this.currentSplitId,
        customercode: "",
        isTestList: false,
        msgContent: encodePushObj,
        promoKey: this.promoKey,
        senderId: this.senderDetails,
        senderName: this.senderDetails,
        testListId: 0,
        toAndroid :"",
        toIOS: "",       
        selectedOffers: this.selectedOffersToSubmit,
        selectedRecoWidgets:[],
      }]
    }
    this.pushPayloadObj = payloadJson.channels[0];
    //this.shareService.testSMSObj.next(payloadJson);  

    // if(this.selectedSMSTemplate == undefined || this.selectedSMSTemplate == -1) {
    //   Swal.fire(this.translate.instant('designEditor.testSMSComponent.validationMsg.smsTemplateNotSelectedMsglbl'));
    //   return;
    // }
    this.modalRef = this.modalService.show(modalTemplate,
      {
        class: 'modal-dialog-centered testPushModel',
        backdrop: 'static',
        keyboard: false
      }
    );
  }

  ngOnInit(): void {   
    this.getSavedData(); 
    this.getEmojiObj();
    this.shareService.currentSelectedChannelObj.subscribe((res:any) => {
      this.currentSplitId = res.currentSplitId;
      this.promoKey = res.promotionKey;
      this.commChannelKey=res.commChannelKey;
      this.channelName = res.channelName;
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

  // toggleOfferSliderPopup(){
  //     if(this.showActionListpopup){
  //       this.showActionListpopup = false;
  //     }else{
  //       this.showActionListpopup = true;
  //     }    
  // }

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
          this.updateMobilePreview(this.currentInputFocused);
        })
        
      });
      
    }
  }  

  openOfferSliderPopup(evt,isInput,currtInpt){
    let idEle = currtInpt;
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

  removeLoader(){
    this.ngZone.run(() => {
      this.loader.loadCount = 0;
      this.loader.HideLoader();         
    });
  }

  // Medium editor Implementation
  loadMediumEditor(): void {
    let elements = document.querySelectorAll('.editable');
    this.editor = new MediumEditor(elements, {
      toolbar: {
        allowMultiParagraphSelection: true,
        buttons: ['bold','italic','underline', 'colorPicker', 'removeFormat'],
        diffLeft: 0,
        diffTop: -10,
        firstButtonClass: 'medium-editor-button-first',
        lastButtonClass: 'medium-editor-button-last',
        relativeContainer: null,
        standardizeSelectionStart: false,
        static: false,
        /* options which only apply when static is true */
        align: 'center',
        sticky: false,
        updateOnEmptySelection: false
      },
      extensions: {
        colorPicker: colorPickerValidator.pickerExtension,
      },
      placeholder: false,
    });
  }

  updateMediumEditorData(): void {
    const element = document.querySelectorAll('.medium-editor-action');
    element.forEach((item) => {
      item?.addEventListener('click', () => {
        if(this.selectedMobileTab === 'android') {
          let elementId = this.inserEmojiAt.startContainer.parentElement.offsetParent.id ||
          this.inserEmojiAt.startContainer.parentElement.id || this.inserEmojiAt.startContainer.id;
          let eleDiv = elementId.split('_');
          this.updateMobilePreview(eleDiv[1]);
        }
      });
    });
  }

  ngAfterViewInit(): void {
    this.loadMediumEditor();
    this.updateMediumEditorData();
  }

}