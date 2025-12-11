import { Component, OnInit, Output,EventEmitter, ViewChild, ElementRef,HostListener, AfterViewInit, TemplateRef} from "@angular/core";
import { AppConstants } from "@app/app.constants";
import { GlobalConstants } from '../common/globalConstants';
import { HttpService } from "@app/core/services/http.service";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataService } from '@app/core/services/data.service';
import { LoaderService } from '@app/core/services/loader.service';
import { SharedataService } from '@app/core/services/sharedata.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { state } from "@angular/animations";

@Component({
  selector: 'app-inapp-channel',
  templateUrl: './inapp-channel.component.html',
  styleUrls: ['./inapp-channel.component.scss']
})

export class InappChannelComponent implements OnInit {
  @ViewChild('previewHtmlElement') previewHtmlElement!: ElementRef;
  @ViewChild('titleInputContent') titleInputContent!: ElementRef;
  @ViewChild('subtitleInputContent') subtitleInputContent!: ElementRef;
  @ViewChild('messageInputContent') messageInputContent!: ElementRef;
  @ViewChild('formatterTools') formatterTools!: ElementRef;
  @ViewChild('animationSection') animationSection!: ElementRef;
  @ViewChild('backgoundSection') backgoundSection!: ElementRef;
  @ViewChild('imageSection') imageSection!: ElementRef;
  @ViewChild('button1AreaSection') button1AreaSection!: ElementRef;  
  @ViewChild('button2AreaSection') button2AreaSection!: ElementRef;
  @ViewChild('imageOutterPanel') imageOutterPanel! : ElementRef;
  @ViewChild('buttonOutterPanel') buttonOutterPanel! : ElementRef;
  backropOffersEnable: boolean = false;
  offerDrawerSectionEnable: boolean = false;
  modalRef?: BsModalRef;
  channel_Type_InApp:any = AppConstants.CHANNEL_INFO.CHANNEL_TYPE.INAPP_NOTIFICATION
  emojiObj: any;
  customEmojis: any = [];
  currentSplitId: any;
  promoKey: any;
  commChannelKey: any;
  channelName: any;
  channelObj: any;
  templatesLayoutObj: any = {};
  Objects = Object;
  selectedPlaceHolderInput: any;
  inserEmojiAt: any;
  emojisToggle:boolean = false;
  inappTemplatesObj: any= {};
  selectedInappTemp: any = "";
  spectrumObj:any;
  editor: any;
  color:string = "#fff";
  bckGrdColorSelected:string = "";
  textColorSelected: any;
  buttonColorBg: any;
  buttonFontColor: any;
  buttonText: any;
  bckgrdBtn1ColorSelected: any;
  bckgrdBtn2ColorSelected: any;
  selectedInappLayoutId: any;
  entranceTypeDisabled:boolean = true;
  timerDisabled: boolean = true;
  timerValue: string = "";
  imageSelected: any;
  imageInputDisabled: boolean = false;
  deeplinkImageInputDisabled: boolean = true;
  deeplinkButton1InputDisabled: boolean = true;
  deeplinkButton2InputDisabled: boolean = true;
  textTabActive: any;
  objToSaveTemplateData: any;
  animatedType: any = 0;
  isAnimationEnabled: boolean = false;
  backGrndImageEnabled: boolean = false;
  buttonTabActive: any = 1;
  button1ActiveEnable: boolean = true;
  button2ActiveEnable: boolean = true;
  buttonText2: any;
  finalInappPayloadData: any;
  titleTextContent: any;
  subtitleTextContent: any;
  messageTextContent: any;
  bckGrdImageSelected: any;
  venderDetails: any;
  senderDetails: any;
  venderDesc: any;
  senderId: any;
  channelSavedArray: any;
  promotionSplitHelper: any;
  currentObj: any;
  dbKey: any;
  editChannelDataObj: any;
  templateTabActive: any;
  deeplinkImagePath: any;
  deeplinkBtn1SelectedPath: any;
  deeplinkBtn2SelectedPath: any;
  channelsPayloadObj: any;
  currentInputFocused: any;
  selectedOffersToSubmit: any;
  collectOffersFromInputSelected: any;
  isTemplateSectionEnabled:boolean = true;
  isbackgroundSectionEnabled:boolean = true;
  isTextSectionEnabled:boolean = true;
  isImageSectionEnabled:boolean = true;
  isButtonSectionEnabled:boolean = true;
  isSelectedFormat: any = {'fontstyle':false,'fontsize':false,'color':false,
  'bold':false,'italic':false,'underline':false,'left':false,'center':false,'right':false,'justify':false
  };
  formatterStyleJsonObj: any =  {'fontstyle':'','fontsize':'','color':'',
  'bold':'','italic':'','underline':'','left':'','center':'','right':'','justify':''
  };
  ngZone:any;
  collectStylingData: any = {};
  isInappEditModeEnable:any = {};
  emptyObj:any = {};
  templateKey: any;
  enablePlusBtn: boolean = false;
  i18nObject:any = {};
  button2TabEnabled: boolean = true; // enabled on load disabled on layout 4 and 5.
  constructor(
    private httpService: HttpService, private dataService: DataService, private shareService:SharedataService,
   private modalService:BsModalService, private loader:LoaderService,private translate:TranslateService
  ) { 
    AppConstants.OFFERS_ENABLE.MERGE_TAG = true;
    AppConstants.OFFERS_ENABLE.STATIC_OFFERS = true;
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
    this.getEmojiObj();
    this.shareService.currentSelectedChannelObj.subscribe((res:any) => {
      if(Object.keys(res).length > 0){
        this.currentSplitId = res.currentSplitId;
        this.promoKey = res.promotionKey;
        this.commChannelKey=res.commChannelKey;
        this.channelName = res.channelName;
      }      
    });
    
    this.setActiveTab("");
    this.getInappTemplatesObj();
    
  }
  @HostListener('document:click', ['$event.target'])
  clickout(event) {
    if(event.className.includes('title') || event.className.includes('subtitle') || event.className.includes('message')){
      this.enablePlusBtn = true;
    }else{
      this.enablePlusBtn = false;
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
      });
    }
  }
  setActiveTab(currentObj:any): void {
    if(this.currentSplitId !== undefined){
      const setAct = this.channelObj.findIndex(x => x.promoSplitId === this.currentSplitId);
      this.shareService.setActiveChannelTab.next(setAct);
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
  async getInappTemplatesObj(){
    //this.templatesObj = [];
    //console.log(this.promoKey +":"+ GlobalConstants.promoKey);
    const resultObj = await this.httpService.post(AppConstants.API_END_POINTS.GET_INAPP_TEMPLATES_OBJ+GlobalConstants.promoKey).toPromise();
    if(Object.keys(resultObj).length > 0){
      if(resultObj.status === 'SUCCESS'){
        this.templatesLayoutObj=JSON.parse(resultObj.response.inAppLayout);
        this.inappTemplatesObj = JSON.parse(resultObj.response.inAppTemplates)
        //console.log(resultObj.response);
      }
    }
    this.getVendorNameObj();
    this.switchTemplateTab(0,1);
    this.setbackgroundColorRImg('color');
    //this.switchTextTab(0);
    //this.switchButtonTab(1);
    this.loadEditModeData();
  }
  
  getCaretIndex(evt:any, inptClassName) {
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
    this.updateInappPreviewSection(inptClassName);
    this.currentInputFocused = inptClassName;
    //if(GlobalConstants.inAppEditMode){
      this.collectDraggedOffers(evt);
    //}
  }
  
  switchTemplateTab(inx,layoutId){
    //this.templateTabActive = layoutId;  
    this.selectedInappLayoutId = layoutId;
    //this.loadInappTemplate(layoutId);  
    this.templateOnChange(this.inappTemplatesObj[layoutId][0].dbKey,layoutId);
  }
  loadInappTemplate(inappId){
    this.selectedInappTemp =this.inappTemplatesObj[inappId][0].templateText;
    this.selectedInappLayoutId = inappId;//this.inappTemplatesObj[inappId][0].dbkey;
    this.previewHtmlElement.nativeElement.innerHTML = "";
    const element = document.createRange().createContextualFragment(this.selectedInappTemp);
    this.previewHtmlElement.nativeElement.appendChild(element);
    this.showHideInappSections(['imageOutterPanel','buttonOutterPanel']);
  }
  onChangeTemplateLayout(evt,layoutId){
    this.selectedInappTemp = "";
    this.templateOnChange(evt,layoutId);
    
  }
  templateOnChange(evt,layoutId){
    this.showHideInappSections(['imageOutterPanel','buttonOutterPanel']);
    if(layoutId !== undefined && this.editChannelDataObj !== undefined){
      if(this.editChannelDataObj.templateLayoutId !== this.selectedInappLayoutId){
        this.confirmBeforeOnChnageTemplate(evt,layoutId);
      }
      else if(this.editChannelDataObj.templateLayoutId === layoutId && this.isInappEditModeEnable[this.currentSplitId]){
        // dont do anything
        
      }else{
        this.clearAndLoadDataMethod();
        this.editChannelDataObj = this.emptyObj;
        this.loadZTemp(evt,layoutId);        
      }
    }else if(this.selectedInappLayoutId !== layoutId ){
      this.confirmBeforeOnChnageTemplate(evt,layoutId);
    }else if(this.selectedInappLayoutId === layoutId ){
        this.clearAndLoadDataMethod();
        this.editChannelDataObj = this.emptyObj;
        this.loadZTemp(evt,layoutId);        
    }
  }
  confirmBeforeOnChnageTemplate(evt,layoutId){
    Swal.fire({
      title: this.translate.instant('dmMultiOfferComponent.dataLostPreviousSelectionAlertMsgLbl'),//this.translate.instant('designEditor.mobilePushComponent.carouselValidation'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('yes'),
      cancelButtonText: this.translate.instant('cancel'),
      allowOutsideClick:false,
      allowEscapeKey:false,
    }).then((result) => {
      if (result.value) {
        this.clearAndLoadDataMethod();
        this.editChannelDataObj = this.emptyObj;
        this.loadZTemp(evt,layoutId);
      } else {
        // dont do anything
        this.templateTabActive = this.editChannelDataObj.templateLayoutId;
      }
    });
  }
  clearAndLoadDataMethod(){
    this.reloadWithEmptyDataMethod();
    this.collectDataForAllFields();
    this.updateEditSavedData(this.emptyObj,false);
  }
  loadZTemp(evt, layoutId){
      this.selectedInappLayoutId = layoutId;
      if(evt.target === undefined){
        var tempId = evt;
      }else{
        var tempId = evt.target.value;
      }      
      this.templateKey = tempId;
      if(this.editChannelDataObj !== undefined){
        this.editChannelDataObj.templateKey = this.templateKey;
      }      
      const tempHtml = this.inappTemplatesObj[layoutId].find(x => x.dbKey == tempId).templateText;
      this.previewHtmlElement.nativeElement.innerHTML = "";
      const tempElements = document.createRange().createContextualFragment(tempHtml);
      this.previewHtmlElement.nativeElement.appendChild(tempElements);
      this.selectedInappTemp = tempElements;
      this.templateTabActive = layoutId;
     // this.showHideInappSections(['imageOutterPanel','buttonOutterPanel']);
  }
  updateInappPreviewSection(inpId){    
    if(this.previewHtmlElement !== undefined){
      //const childElements = this.previewHtmlElement.nativeElement.children;
      const templateSections = this.previewHtmlElement.nativeElement.lastChild;
      
      if(inpId === "title"){
        const strText = this.titleInputContent.nativeElement.getElementsByClassName('title')[0].innerHTML;
        var titleArea = templateSections.getElementsByClassName("titleAreaStyle")[0];
        //strText.replace(/<[\/]{0,1}(div)[^><]*>/g,' ').replace(/(?:&nbsp;|<br>)/g,' ').replace(/\<p>/gi, '').replace(/\<\/p>/gi, '');
          if(strText !== ""){
            titleArea.innerHTML = this.OfferTagsReplaceToActualVal(strText);
            this.titleTextContent = strText;
            this.editChannelDataObj.title = strText;
          }          
       
      }else if(inpId === "subtitle"){
        const strText = this.subtitleInputContent.nativeElement.getElementsByClassName('subtitle')[0].innerHTML
        const header = templateSections.getElementsByClassName("templateHead-inapp")[0].getElementsByClassName('fontsizeforWebsubTitle')[0] 
        var subTitleArea = header;
          if(strText !== ""){
            subTitleArea.innerHTML = this.OfferTagsReplaceToActualVal(strText);
            this.subtitleTextContent = strText;
            this.editChannelDataObj.subTitle = strText;
          }
        
      }else if(inpId === "message"){
        const strText = this.messageInputContent.nativeElement.getElementsByClassName('message')[0].innerHTML
        var messageArea = templateSections.getElementsByClassName('descriptionContent-inapp')[0].getElementsByClassName('description-inApp')[0];
          if(strText !== ""){
            messageArea.innerHTML =this.OfferTagsReplaceToActualVal(strText);
            this.messageTextContent = strText;
            this.editChannelDataObj.message = strText;
          }       
      }
      
      
      // var imageAres = templateSections.getElementsByClassName('templatebodyContent-inapp')[0].getElementsByTagName('img')[0];
      
      // var button1 = templateSections.lastChild.firstChild;
      // var button2 = templateSections.lastChild.lastChild;
    }
    
    //console.log(this.previewHtmlElement);
  }
  
  enableAnimationMethod(evt){
    if(evt.target.checked){
      this.entranceTypeDisabled = false;
      this.isAnimationEnabled = true;

    }else{
      this.entranceTypeDisabled = true;
      this.timerValue = "";
      this.timerDisabled = true;
      this.isAnimationEnabled = false;
    }
    this.editChannelDataObj.isAnimationEnable = this.isAnimationEnabled;
  }
  setTimerVal(evt){
    this.timerValue = evt.target.value;
    const prevwElemts = this.previewHtmlElement.nativeElement.lastChild;
    const timerElemt = prevwElemts.getElementsByClassName('templateHead-inapp')[0].children['_targetOne_timer'];
    if(timerElemt !== undefined){
      timerElemt.innerHTML = this.timerValue;
    }
    this.editChannelDataObj.timer = this.timerValue;
  }
  setTimerMethod(evt){
    if(evt.target.checked){
      this.timerDisabled = false;
      this.timerValue = '2';
    }else{
      this.timerDisabled = true;
    }
    this.editChannelDataObj.timer = this.timerValue;
  }
  setFontColor(color){
    const prevId = this.previewHtmlElement.nativeElement;
    this.bckGrdColorSelected = color;
    const templateSections = prevId.lastChild;
    templateSections.style.backgroundImage = 'none';
    templateSections.style.backgroundColor  = this.bckGrdColorSelected;
    if(this.bckGrdColorSelected === "#000000"){
      templateSections.style.color = "FFF";
    }
   }
   setBackgrdImg(evt){
    const prevId = this.previewHtmlElement.nativeElement;
    this.bckGrdImageSelected = evt.target.value;
    const templateSections = prevId.children[prevId.children.length - 1];
    templateSections.style.backgroundColor = 'unset';
    templateSections.style.backgroundImage = 'url('+this.bckGrdImageSelected+')';
    this.editChannelDataObj.backgrdImagePath = this.bckGrdImageSelected;
   }
  
   setTextColor(color){
    const prevId = this.previewHtmlElement.nativeElement;
    this.textColorSelected = color;
    const templateSections = prevId.lastChild;
    this.isSelectedFormat['color'] = true;
    if(this.textTabActive === 0){
      var textColorArea = templateSections.getElementsByClassName("titleAreaStyle")[0];
    }else if(this.textTabActive === 1){
      const header = templateSections.getElementsByClassName("templateHead-inapp")[0].getElementsByTagName('div'); 
      var textColorArea = header[header.length - 1]
    }else if(this.textTabActive === 2){
      var textColorArea = templateSections.getElementsByClassName('descriptionContent-inapp')[0].getElementsByClassName('description-inApp')[0];
    }
    
    textColorArea.style.color  = this.textColorSelected;
   }
   setButtonText(textObj){
    const prevId = this.previewHtmlElement.nativeElement;
    this.buttonText = textObj.target.value;
    const templateSections = prevId.lastChild;
    var button1 = templateSections.lastChild.getElementsByTagName('a').tempBtn_1;
      // var button2 = templateSections.lastChild.lastChild;
    button1.innerHTML  = this.buttonText;
    this.editChannelDataObj.inAppBtnText[0] = this.buttonText;
   }
   setButton2Text(textObj){
    const prevId = this.previewHtmlElement.nativeElement;
    this.buttonText2 = textObj.target.value;
    const templateSections = prevId.lastChild;
    var button2 = templateSections.lastChild.getElementsByTagName('a').tempBtn_2;
      // var button2 = templateSections.lastChild.lastChild;      
    button2.innerHTML  = this.buttonText2;
    this.editChannelDataObj.inAppBtnText[1] = this.buttonText2;
   }
   setButton1BgColor(color){
    const prevId = this.previewHtmlElement.nativeElement;
    this.bckgrdBtn1ColorSelected = color;
    const templateSections = prevId.lastChild;
    var button1 = templateSections.lastChild.getElementsByTagName('a').tempBtn_1;
      // var button2 = templateSections.lastChild.lastChild;
    button1.style.backgroundColor  = color;
    this.editChannelDataObj.bgBtn1Color = this.bckgrdBtn1ColorSelected;
   }
   setButton2BgColor(color){
    const prevId = this.previewHtmlElement.nativeElement;
    this.bckgrdBtn2ColorSelected = color;
    const templateSections = prevId.lastChild;
    var button1 = templateSections.lastChild.getElementsByTagName('a').tempBtn_2;
      // var button2 = templateSections.lastChild.lastChild;
    button1.style.backgroundColor  = color;
    this.editChannelDataObj.bgBtn2Color = this.bckgrdBtn2ColorSelected;
   }
   
   setButton1TextColor(color){
    const prevId = this.previewHtmlElement.nativeElement;
    this.buttonFontColor = color;
    const templateSections = prevId.lastChild;
    var button1 = templateSections.lastChild.getElementsByTagName('a').tempBtn_1;
      // var button2 = templateSections.lastChild.lastChild;
    button1.style.color  = this.buttonFontColor;
    this.editChannelDataObj.fontBtn1Color = this.buttonFontColor;
   }
   setButton2TextColor(color){
    const prevId = this.previewHtmlElement.nativeElement;
    this.buttonFontColor = color;
    const templateSections = prevId.lastChild;
    var button1 = templateSections.lastChild.getElementsByTagName('a').tempBtn_2;
      // var button2 = templateSections.lastChild.lastChild;
    button1.style.color  = this.buttonFontColor;
    this.editChannelDataObj.fontBtn2Color = this.buttonFontColor;
   }
   insertImageMethod(evt){
    const imgSrc = evt.target.value;
    const prevId = this.previewHtmlElement.nativeElement;
    this.imageSelected = imgSrc;
    const templateSections = prevId.lastChild;
    var imageAres = templateSections.getElementsByClassName('templatebodyContent-inapp')[0].getElementsByTagName('img')[0];
    imageAres.src = imgSrc;
    this.editChannelDataObj.inAppImage = this.imageSelected;
    this.editChannelDataObj.imgUrl = this.imageSelected;
   }
   imageSectionEnableMethod(evt){
    if(evt.target.checked){
      this.imageInputDisabled = false; // enable image input
      this.editChannelDataObj.imgUrlActive = true;
    }else{
      this.imageSelected = "";
      this.imageInputDisabled = true; // disable image input
      this.deeplinkImageInputDisabled = true;
      this.deeplinkImagePath = "";
      this.editChannelDataObj.imgUrlActive = false;
      const templateSections = this.previewHtmlElement.nativeElement.lastChild;
      var imageHref = templateSections.getElementsByClassName('templatebodyContent-inapp')[0].children[0];  
      if(imageHref.getElementsByTagName('a')[0] !== undefined){
        imageHref.getElementsByTagName('a')[0].setAttribute('href',this.deeplinkImagePath);
      }
      if(this.imageSection.nativeElement.getElementsByClassName('imgDeeplinkCk')[0].checked){
        this.imageSection.nativeElement.getElementsByClassName('imgDeeplinkCk')[0].checked = false;
      }      
    }
   }
   deepLinkImageEnableMethod(evt){
    if(evt.target.checked){
      this.deeplinkImageInputDisabled = false;
      this.editChannelDataObj.imageDeepLinkActive = true;      
    }else{
      this.deeplinkImageInputDisabled = true;
      this.deeplinkImagePath = "";
      const templateSections = this.previewHtmlElement.nativeElement.lastChild;
      var imageHref = templateSections.getElementsByClassName('templatebodyContent-inapp')[0].children[0];    
      if(imageHref.getElementsByTagName('a')[0] !== undefined) {
        imageHref.getElementsByTagName('a')[0].setAttribute('href',this.deeplinkImagePath);
      }  
      this.editChannelDataObj.imageDeepLinkActive = false;
      //this.imageSection.nativeElement.getElementsByClassName('imgDeeplinkCk')[0].checked = false;      
    }
   }
   //---------- buttons ---------
   button1Enablemethod(evt){
    if(evt.target.checked){
      this.button1ActiveEnable = true;      
      this.editChannelDataObj.buttonTextActive2 = this.button2ActiveEnable;
      const templateSections = this.previewHtmlElement.nativeElement?.lastChild?.lastChild;
      if(templateSections !== undefined){
        let buttnEle = [...templateSections.getElementsByTagName('a')].find(x => x.id === 'tempBtn_1');
        if (buttnEle !== undefined) {  
          if(buttnEle.style.display === 'none'){
            buttnEle.style.display = "inline-block";
            buttnEle.style.backgroundColor = "";
          }else{
            buttnEle.style.display = "inline-block";
          }  
          }        
      }
      this.editChannelDataObj.buttonTextActive1 = true;
      this.deeplinkButton1InputDisabled = false;
      if(!this.editChannelDataObj.buttonTextActive2){
        this.button2ActiveEnable = this.editChannelDataObj.buttonTextActive2;
      }      
    }else{
      this.button1ActiveEnable = false;
      this.deeplinkBtn1SelectedPath = "";
      const templateSections = this.previewHtmlElement.nativeElement?.lastChild?.lastChild;
      if(templateSections !== undefined){
        let buttnEle = [...templateSections.getElementsByTagName('a')].find(x => x.id === 'tempBtn_1');
        if (buttnEle !== undefined) {
          buttnEle.setAttribute('href',this.deeplinkBtn1SelectedPath);
          buttnEle.innerHTML = this.translate.instant('webPushComponent.button1lbl');
          buttnEle.style.display = 'none';
          buttnEle.style.backgroundColor = "";
        }
      }      
      this.button1AreaSection.nativeElement.getElementsByClassName('deeplinkBtn1Ck')[0].checked = false;
      this.button1AreaSection.nativeElement.getElementsByClassName('btn1NameInput')[0].value = "";
      this.bckgrdBtn1ColorSelected = "none";
      this.deeplinkButton1InputDisabled = true;
      if(this.editChannelDataObj !== undefined){
        this.editChannelDataObj.buttonTextActive1 = false;
        this.editChannelDataObj.bgBtn1Color = "";
        this.editChannelDataObj.btnActionUrl[0] = "";
        this.editChannelDataObj.buttonDeepLinkActive1 = false;
        this.editChannelDataObj.inAppBtnText[0] = "";        
      }                       
    }
  }
  button2Enablemethod(evt){
    if(evt.target.checked){
      this.button2ActiveEnable = true;
      const templateSections = this.previewHtmlElement.nativeElement?.lastChild?.lastChild;
      if(templateSections !== undefined){ 
        let buttnEle = [...templateSections.getElementsByTagName('a')].find(x => x.id === 'tempBtn_2');
        if (buttnEle !== undefined) {  
          if(buttnEle.style.display === 'none'){
            buttnEle.style.display = "inline-block";
            buttnEle.style.backgroundColor = "";
          }else{
            buttnEle.style.display = "inline-block";
          }
          
        } 
      }
      this.editChannelDataObj.buttonTextActive2 = true;
      this.deeplinkButton2InputDisabled = false;
      if(!this.editChannelDataObj.buttonTextActive2){
        this.button2ActiveEnable = false;
      }
    }else{
      this.button2ActiveEnable = false;
      this.deeplinkBtn2SelectedPath = "";
      const templateSections = this.previewHtmlElement.nativeElement?.lastChild?.lastChild;
      if(templateSections !== undefined){
        let buttnEle = [...templateSections.getElementsByTagName('a')].find(x => x.id === 'tempBtn_2');
        if (buttnEle !== undefined) {
          buttnEle.setAttribute('href',this.deeplinkBtn2SelectedPath);
          buttnEle.innerHTML = this.translate.instant('webPushComponent.button2lbl');
          buttnEle.style.display = 'none';
          buttnEle.style.backgroundColor = "";
        }        
      }      
      this.button2AreaSection.nativeElement.getElementsByClassName('deeplinkBtn2Ck')[0].checked = false;
      this.button2AreaSection.nativeElement.getElementsByClassName('btn2NameInput')[0].value = "";
      this.deeplinkButton2InputDisabled = true;
      this.bckgrdBtn2ColorSelected = "none";
      if(this.editChannelDataObj !== undefined){
        this.editChannelDataObj.buttonTextActive2 = false;
        this.editChannelDataObj.bgBtn2Color = "";
        this.editChannelDataObj.btnActionUrl[1] = "";
        this.editChannelDataObj.buttonDeepLinkActive2 = this.button2ActiveEnable;
        this.editChannelDataObj.inAppBtnText[1] = "";
        
      }
    }
  }
   deeplinkEnableForButton1(evt){
    if(evt.target.checked){
      this.deeplinkButton1InputDisabled = false;
      this.editChannelDataObj.buttonDeepLinkActive1 = true;
    }else{
      this.deeplinkButton1InputDisabled = true;
      this.deeplinkBtn1SelectedPath = "";
      const templateSections = this.previewHtmlElement.nativeElement.lastChild.lastChild;
      templateSections.getElementsByTagName('a')[0].setAttribute('href',this.deeplinkBtn1SelectedPath);
      this.button1AreaSection.nativeElement.getElementsByClassName('deeplinkBtn1Ck')[0].checked = false;
      this.editChannelDataObj.buttonDeepLinkActive1 = false;
    }
   }
   deeplinkEnableForButton2(evt){
    if(evt.target.checked){
      this.deeplinkButton2InputDisabled = false;
      this.editChannelDataObj.buttonDeepLinkActive2 = true;
    }else{
      this.deeplinkButton2InputDisabled = true;
      this.deeplinkBtn2SelectedPath = "";
      const templateSections = this.previewHtmlElement.nativeElement.lastChild.lastChild;
      templateSections.getElementsByTagName('a')[1].setAttribute('href',this.deeplinkBtn2SelectedPath);
      this.button2AreaSection.nativeElement.getElementsByClassName('deeplinkBtn2Ck')[0].checked = false;
      this.editChannelDataObj.buttonDeepLinkActive2 = false;
    }
   }
   getdeepLinkImagePathUrl(evt){
    const deepLinkpath = evt.target.value;
    this.deeplinkImagePath = deepLinkpath; 
    const templateSections = this.previewHtmlElement.nativeElement.lastChild;
    var imageHref = templateSections.getElementsByClassName('templatebodyContent-inapp')[0].children[0];
    if(imageHref.getElementsByTagName('a')[0] === undefined){
     imageHref.innerHTML = "<a href='"+this.deeplinkImagePath+"' class='imageHref'>"+imageHref.innerHTML+"</a>";
    }else{
      imageHref.getElementsByTagName('a')[0].setAttribute('href',this.deeplinkImagePath);
    }
    this.editChannelDataObj.imgActionUrl = this.deeplinkImagePath;
    
   }
   
   getdeeplinkBtn1UrlPath(evt){
    this.deeplinkBtn1SelectedPath = evt.target.value;
    const templateSections = this.previewHtmlElement.nativeElement.lastChild.lastChild;
    templateSections.getElementsByTagName('a')[0].setAttribute('href',this.deeplinkBtn1SelectedPath);
    this.editChannelDataObj.btnActionUrl[0] = this.deeplinkBtn1SelectedPath;
   }
   getdeeplinkBtn2UrlPath(evt){
    this.deeplinkBtn2SelectedPath = evt.target.value;
    const templateSections = this.previewHtmlElement.nativeElement.lastChild.lastChild;
    templateSections.getElementsByTagName('a')[1].setAttribute('href',this.deeplinkBtn2SelectedPath);
    this.editChannelDataObj.btnActionUrl[1] = this.deeplinkBtn2SelectedPath;
   }
   
   switchTextTab(tabId){
    this.textTabActive = tabId;
    setTimeout(() => {
      const formatterControls = this.formatterTools.nativeElement;  
      let titleWithTone:any, mgsWithTone:any, subtitleWithTone:any;    
      if(tabId === 0){ //----------- Title Tab --------------
        const fontsize = formatterControls.getElementsByClassName('isFontSize')[0];
        fontsize.children[0].value = 34;
        if(this.titleTextContent !== undefined && this.titleTextContent.includes('tonewidget')){
          titleWithTone = this.formatToneWidgetText(this.titleTextContent);
          //titleWithTone = this.titleTextContent;
        }else{
          titleWithTone = this.titleTextContent;
        }
        if(titleWithTone !== undefined){
          this.titleInputContent.nativeElement.getElementsByClassName('title')[0].innerHTML = titleWithTone;
        } 
        this.clearFormatDataOnSwitch(0);
      }else if(tabId === 1){ //----------- SubTitle Tab ----------
        const fontsize = formatterControls.getElementsByClassName('isFontSize')[0];
        fontsize.children[0].value = 26;
        if(this.subtitleTextContent !== undefined &&this.subtitleTextContent.includes('tonewidget')){
          subtitleWithTone = this.formatToneWidgetText(this.subtitleTextContent);
        }else{
          subtitleWithTone = this.subtitleTextContent;
        }
        if(subtitleWithTone !== undefined){
          this.subtitleInputContent.nativeElement.getElementsByClassName('subtitle')[0].innerHTML = subtitleWithTone;
        }
        this.clearFormatDataOnSwitch(1);
      }else if(tabId === 2){ //--------------- Message Tab -----------
        const fontsize = formatterControls.getElementsByClassName('isFontSize')[0];
        fontsize.children[0].value = 24;
        if(this.messageTextContent !== undefined && this.messageTextContent.includes('tonewidget')){
          mgsWithTone = this.formatToneWidgetText(this.messageTextContent);
        }else{
          mgsWithTone = this.messageTextContent;
        }
        if(mgsWithTone !== undefined){
          this.messageInputContent.nativeElement.getElementsByClassName('message')[0].innerHTML = mgsWithTone;
        }    
        this.clearFormatDataOnSwitch(2);    
      } 
    },100);
    
   }
   newLineContentToBr(templateContent){
      if(templateContent != null)
      if(templateContent.indexOf("\n") != -1)
      {
        templateContent = templateContent.replaceAll("\n","<br>").replaceAll(/^(\ ?<br( \/)?>\ ?)+|(\ ?<br( \/)?>\ ?)+$/, '');
      }else if(templateContent.includes('div')){
        templateContent = templateContent.replaceAll("<div>","<br>").replaceAll("</div>","").replaceAll(/^(\ ?<br( \/)?>\ ?)+|(\ ?<br( \/)?>\ ?)+$/, '');
      }

      return templateContent;
   }
   formatToneWidgetText(inputText:any) {
     return inputText.replaceAll('<tonewidget>', '&lt;tonewidget&gt;').
     replaceAll('</tonewidget>', '&lt;/tonewidget&gt;')//.replace(/<[\/]{0,1}(div)[^><]*>/g,' ').replace(/(?:&nbsp;)/g,' ').replace(/\<p>/gi, '').replace(/\<\/p>/gi, '')
   }
   toneWidgetReplaceToactualVal(inpVal){
    //inpVal.replace(/<[\/]{0,1}(div)[^><]*>/g,' ').replace(/(?:&nbsp;|<br>)/g,' ').replace(/\<p>/gi, '').replace(/\<\/p>/gi, '');
        return inpVal.replace(/\<xmp style="margin:0;display:inline">/gi,'').replace(/\<\/xmp>/gi, '').replace('<span style="white-space: pre;">','').replace('<font face="monospace">','')
          .replace(/\&lt;/gi, '<').replace(/&gt;/gi, '>').replace('<span style="font-size: 0.8125rem;"><tonewidget></span>', '<tonewidget>').replace('</span>',"").replace('</font>','')
          .replace(/\<span style="font-size: 0.8125rem;"><tonewidget>/gi, '<tonewidget>').replace(/\<\/tonewidget><\/span>/gi, '</tonewidget>');
        
       //return inpVal.replaceAll('&lt;tonewidget&gt;',"<tonewidget>").replaceAll('&lt;/tonewidget&gt;',"</tonewidget>");
   }
   OfferTagsReplaceToActualVal(inpVal){
    return inpVal.replaceAll('offerDynamic','');
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
      this.updateInappPreviewSection(this.inserEmojiAt.startContainer.id);
    } 
  }
  addEmojiItem(event:any, param:string) {
    const textNative = `${event.emoji.native}`;
    if(this.inserEmojiAt !== undefined) {
      this.inserEmojiAt.insertNode(document.createTextNode(textNative));
      this.emojisToggle = !this.emojisToggle;
      this.updateInappPreviewSection(param);
    }
    
    // if(this.inserEmojiAt !== undefined) {
    //   if(this.inserEmojiAt.startContainer.id === 'android_' + param + '_' + this.currentSplitId ||
    //   this.inserEmojiAt.startContainer.id === 'ios_' + param + '_' + this.currentSplitId ||
    //   this.inserEmojiAt.startContainer.parentElement.id === 'android_' + param + '_' + this.currentSplitId ||
    //   this.inserEmojiAt.startContainer.parentElement.id === 'ios_' + param + '_' + this.currentSplitId ||
    //   this.inserEmojiAt.startContainer.parentElement.offsetParent.id === 'android_' + param + '_' + this.currentSplitId ||
    //   this.inserEmojiAt.startContainer.parentElement.offsetParent.id === 'ios_' + param + '_' + this.currentSplitId) {
    //     this.inserEmojiAt.insertNode(document.createTextNode(textNative));
    //     this.updateMobilePreview(param);
    //   }
    // }
    // if(this.selectedMobileTab === 'android') {
    //   if(param === 'title') {
    //     this.androidTitleEmoji = !this.androidTitleEmoji;
    //   } else {
    //     this.androidMsgEmoji = !this.androidMsgEmoji;
    //   }
    // } else {
    //   if(param === 'title') {
    //     this.iosTitleEmoji = !this.iosTitleEmoji;
    //   } else {
    //     this.iosMsgEmoji = !this.iosMsgEmoji;
    //   }
    // }
  }
  switchButtonTab(btnId,editObj?){
    this.buttonTabActive = btnId;
    // const prevElemts = this.previewHtmlElement.nativeElement.lastChild.children;
    // const btnElemts = this.previewHtmlElement.nativeElement.lastChild.children['templateFooter-inapp'].children;
    if(editObj === undefined){
      if(this.isInappEditModeEnable[this.currentSplitId]){
        if(this.editChannelDataObj.templateLayoutId === this.selectedInappLayoutId){
          editObj = this.editChannelDataObj; 
        }else{
          editObj = this.emptyObj;
        }      
      }else {
        editObj = this.emptyObj;
      }
      
    }
    if(btnId === 1){
      if(this.isInappEditModeEnable[this.currentSplitId]){
        if(Object.keys(editObj).length > 0){
          setTimeout(() => {
            if(editObj.templateLayoutId === this.selectedInappLayoutId){
              this.loadBtnDataOnSwitch(editObj,1,true);
            }
         }, 100);          
        }
      }else{ // create mode
        setTimeout(() => {
          this.loadBtnDataOnSwitch(editObj,1,true);
        },100); 
      }
    }else{
      if(this.isInappEditModeEnable[this.currentSplitId]){
        if(Object.keys(editObj).length > 0){
          setTimeout(() => {
            if(editObj.templateLayoutId === this.selectedInappLayoutId){
              this.loadBtnDataOnSwitch(editObj,2,true);
            }
         }, 100); 
        }
      }else{ // create mode
        setTimeout(() => {
          this.loadBtnDataOnSwitch(editObj,2,true);
        },100);        
      }
      
    }
  }
  setAnimatedType(evt){
    this.animatedType = evt.target.value;
    this.editChannelDataObj.animType = this.animatedType;
  }
  setbackgroundColorRImg(type){
    if(type === 'color'){
      // ----------- color -----------
      this.backGrndImageEnabled = false;      
    }else{
      // ------------ image -----------
      this.backGrndImageEnabled = true;

    }
    this.editChannelDataObj.backRndImg = this.backGrndImageEnabled;
  }
  
  clearFormatDataOnSwitch(tabId){
    this.isSelectedFormat = {'fontstyle':false,'fontsize':false,'color':false,
    'bold':false,'italic':false,'underline':false,'left':false,'center':false,'right':false,'justify':false
    };
    this.formatterStyleJsonObj =  {'fontstyle':'','fontsize':'','color':'',
    'bold':'','italic':'','underline':'','left':'','center':'','right':'','justify':''
    };
    if(Object.keys(this.collectStylingData).length > 0){
      if(tabId === 0){
        const editedTitleFormats = this.collectStylingData['title'];
        if(editedTitleFormats !== undefined){
          this.retainEditData(editedTitleFormats);
        }        
      }else if(tabId === 1){
        const editedTitleFormats = this.collectStylingData['subtitle'];
        if(editedTitleFormats !== undefined){
          this.retainEditData(editedTitleFormats);
        }   
      }else if(tabId === 2){
        const editedTitleFormats = this.collectStylingData['message'];
        if(editedTitleFormats !== undefined){
          this.retainEditData(editedTitleFormats);
        }   
      }
    }
  }
  retainEditData(obj){
    Object.keys(obj).forEach(key => {
      let valSel = obj[key];
      const ele = this.formatterTools.nativeElement;
      if(key === 'fontstyle' && obj[key] !== ""){
        ele.getElementsByClassName('fontfamilyElemt')[0].value = valSel;
        this.isSelectedFormat[key] = true;
      }else if(key === 'fontsize' && obj[key] !== ""){
        ele.getElementsByClassName('fontsizeElemt')[0].value = valSel;
        this.isSelectedFormat[key] = true;
      }else if(obj[key] !== ""){
        this.isSelectedFormat[key] = true;
      }      
    });
  }
  selectFormatterStyle(evt,format){
    if(evt.target.className.includes('active')){
      const selVal = evt.target.value;    
      this.isSelectedFormat[format] = false;    
      this.setStylingData(evt,selVal,format);
    }else{
      const selVal = evt.target.value;    
      this.isSelectedFormat[format] = true;    
      this.setStylingData(evt,selVal,format);
      
    }
    
  }
  setStylingData(evt,setval,forstyle){
    if(this.textTabActive === 0){      
      const sourceElemt = this.titleInputContent.nativeElement.getElementsByClassName('title')[0];
      this.textFormatterObj('fontsizeforWebtitle',setval,forstyle,sourceElemt);
    }else if(this.textTabActive === 1){
      const sourceElemt = this.subtitleInputContent.nativeElement.getElementsByClassName('subtitle')[0];
      this.textFormatterObj('fontsizeforWebsubTitle',setval,forstyle,sourceElemt);
    }else if(this.textTabActive === 2){
      const sourceElemt = this.messageInputContent.nativeElement.getElementsByClassName('message')[0];
      this.textFormatterObj('fontsizeforWebmessage',setval,forstyle,sourceElemt);
    }
  }
  textFormatterObj(target,setval,forstyle,source){
    const prevwElemt = this.previewHtmlElement.nativeElement.lastChild;
    if(forstyle === 'fontstyle'){
      prevwElemt.getElementsByClassName(target)[0].style.fontFamily = setval;
      //source.style.fontFamily = setval;
      this.formatterStyleJsonObj.fontstyle = setval;      
    }else if(forstyle === 'fontsize'){
      prevwElemt.getElementsByClassName(target)[0].style.fontSize = setval+'px';
      //source.style.fontSize = setval+'px';
      this.formatterStyleJsonObj.fontsize = setval;
    }else if(forstyle === 'color'){
      //prevwElemt.getElementsByClassName(target)[0].style.color = setval;
      //source.style.color = this.textColorSelected;
      this.formatterStyleJsonObj.color = this.textColorSelected;
    }else if(forstyle === 'bold'){
      if(!this.isSelectedFormat[forstyle]){
        prevwElemt.getElementsByClassName(target)[0].style.fontWeight = 'normal';
        //source.style.fontWeight = forstyle;
        this.formatterStyleJsonObj.bold = '';
      }else{
        prevwElemt.getElementsByClassName(target)[0].style.fontWeight = forstyle;
        //source.style.fontWeight = forstyle;
        this.formatterStyleJsonObj.bold = true;
      }      
    }else if(forstyle === 'italic'){
      if(!this.isSelectedFormat[forstyle]){
        prevwElemt.getElementsByClassName(target)[0].style.fontStyle = "normal";
        //source.style.fontStyle = forstyle;
        this.formatterStyleJsonObj.italic = '';
      }else{
        prevwElemt.getElementsByClassName(target)[0].style.fontStyle = forstyle;
        //source.style.fontStyle = forstyle;
        this.formatterStyleJsonObj.italic = true;
      }
    }else if(forstyle === 'underline'){
      if(!this.isSelectedFormat[forstyle]){
        prevwElemt.getElementsByClassName(target)[0].style.textDecoration = "none";
        //source.style.textDecoration = forstyle;
        this.formatterStyleJsonObj.underline = '';
      }else{
        prevwElemt.getElementsByClassName(target)[0].style.textDecoration = forstyle;
        //source.style.textDecoration = forstyle;
        this.formatterStyleJsonObj.underline = true;
      }
      
    }else if(forstyle === 'left' || forstyle === 'center' || forstyle === 'right' || forstyle === 'justify'){
      this.isSelectedFormat['left']=false;
      this.isSelectedFormat['center']=false;
      this.isSelectedFormat['right']=false;
      this.isSelectedFormat['justify']=false;
      this.isSelectedFormat[forstyle]=true;
      if(!this.isSelectedFormat[forstyle]){
        prevwElemt.getElementsByClassName(target)[0].style.textAlign   = 'center'; // unset
        //source.style.textAlign   = forstyle;
        this.formatterStyleJsonObj[forstyle] = '';
      }else{
        prevwElemt.getElementsByClassName(target)[0].style.textAlign   = forstyle;
        //source.style.textAlign   = forstyle;
        this.formatterStyleJsonObj[forstyle] = true;
      }      
    }
    this.collectStylingData[source.id] = this.formatterStyleJsonObj;
  }
 
  
  collectDataForAllFields(){
    this.objToSaveTemplateData = {
    "templateLayoutId":this.selectedInappLayoutId,
    "animType":this.animatedType,
    "isAnimationEnable":this.isAnimationEnabled,
    "timer":this.timerValue,
    "title":this.titleTextContent,
    "subTitle":this.subtitleTextContent,
    "message":this.messageTextContent,
    "backRndImg":this.backGrndImageEnabled,
    "backgrdImagePath":this.bckGrdImageSelected,
    "bgColor":this.bckGrdColorSelected,
    "bgBtn1Color":this.bckgrdBtn1ColorSelected,
    "bgBtn2Color":this.bckgrdBtn2ColorSelected,
    "bgImgdeepLinkEnable":false,
    "bgImgdeeplinkInpText":"",
    "imgUrl":this.imageSelected,
    "imgActionUrl":this.deeplinkImagePath,
    "splitId":this.currentSplitId,
    "commchkey":this.commChannelKey,
    "templateKey":this.templateKey,
    "inAppBtnText":[this.buttonText,this.buttonText2],
    "btnActionUrl":[this.deeplinkBtn1SelectedPath,this.deeplinkBtn2SelectedPath],
    "imgUrlActive":this.imageInputDisabled,
    "imageDeepLinkActive":!this.deeplinkImageInputDisabled,
    "buttonTextActive1":this.button1ActiveEnable,
    "buttonTextActive2":this.button2ActiveEnable,
    "buttonDeepLinkActive1":!this.deeplinkButton1InputDisabled,
    "buttonDeepLinkActive2":!this.deeplinkButton2InputDisabled,
    "stylingDataContentArry":JSON.stringify(this.collectStylingData),
    "layoutHtmlDiv":this.previewHtmlElement.nativeElement.innerHTML
    }
    this.editChannelDataObj = this.objToSaveTemplateData;
  } 
  updateModificationInSaving(){
    let elePreview = this.previewHtmlElement.nativeElement;
    let findButtonWithNone = [...elePreview.getElementsByTagName('a')].find(x => x.style.display == 'none');
    // if(findButtonWithNone !== undefined){ // if need to remove button with none display in the template. if there is any backend issue due to this.need to verify
    //   findButtonWithNone.remove();
    // }
    this.editChannelDataObj.layoutHtmlDiv = this.previewHtmlElement.nativeElement.innerHTML;
    this.editChannelDataObj.stylingDataContentArry = JSON.stringify(this.collectStylingData);
    }
  checkValidationMethod(){
    let isValid:boolean = true;
    if(this.backGrndImageEnabled && (this.bckGrdImageSelected === undefined || this.bckGrdImageSelected === "")){ 
      this.dataService.SwalAlertSuccesOrFailMgs(this.translate.instant('inappChannelComponent.pleaseEnterUrlToContinueLbl'),'warning');
      isValid = false;
    }else  if(this.editChannelDataObj.title === undefined || this.editChannelDataObj.title === ""){
      this.dataService.SwalAlertSuccesOrFailMgs(this.translate.instant('inappChannelComponent.pleaseEnterTheTitleLbl'),'warning');
      isValid = false;
    }else if(this.editChannelDataObj.subTitle === undefined || this.editChannelDataObj.subTitle === ""){
      this.dataService.SwalAlertSuccesOrFailMgs(this.translate.instant('inappChannelComponent.pleaseEnterTheSubTitleLbl'),'warning');
      isValid = false;
    }else if(this.editChannelDataObj.message === undefined || this.editChannelDataObj.message === ""){ 
      this.dataService.SwalAlertSuccesOrFailMgs(this.translate.instant('inappChannelComponent.pleaseEnterTheMessageLbl'),'warning');
      isValid = false;
    }else if(this.editChannelDataObj.imgUrlActive && this.selectedInappLayoutId < 3  && (this.editChannelDataObj.imgUrl === undefined || this.editChannelDataObj.imgUrl === "")){ 
          this.dataService.SwalAlertSuccesOrFailMgs(this.translate.instant('inappChannelComponent.pleaseEnterTheImageUrlLbl'),'warning');
          isValid = false;
    }else if(this.editChannelDataObj.imageDeepLinkActive && (this.editChannelDataObj.imgActionUrl === undefined || this.editChannelDataObj.imgActionUrl === "")){ 
      this.dataService.SwalAlertSuccesOrFailMgs(this.translate.instant('inappChannelComponent.pleaseEnterTheImageDeeplinkUrlLbl'),'warning');
      isValid = false;
    }else if(this.editChannelDataObj.buttonTextActive1 && (this.editChannelDataObj.inAppBtnText[0] === undefined || this.editChannelDataObj.inAppBtnText[0] === "")){ 
      this.dataService.SwalAlertSuccesOrFailMgs(this.translate.instant('inappChannelComponent.pleaseEnterTheButtonTex1tLbl'),'warning');
      isValid = false;
    }else if(this.button2TabEnabled  && (this.editChannelDataObj.buttonTextActive2 && (this.editChannelDataObj.inAppBtnText[1] === undefined || this.editChannelDataObj.inAppBtnText[1] === ""))){ 
      this.dataService.SwalAlertSuccesOrFailMgs(this.translate.instant('inappChannelComponent.pleaseEnterTheButton2TextLbl'),'warning');
      isValid = false;
    }else if((this.editChannelDataObj.btnActionUrl[0] === undefined || this.editChannelDataObj.btnActionUrl[0] === "") && this.editChannelDataObj.buttonDeepLinkActive1){ 
      this.dataService.SwalAlertSuccesOrFailMgs(this.translate.instant('inappChannelComponent.pleaseEnterTheButton1DeeplinkUrlLbl'),'warning');
      isValid = false;
    }else if(this.button2TabEnabled && ((this.editChannelDataObj.btnActionUrl[1] === undefined || this.editChannelDataObj.btnActionUrl[1] === "") && this.editChannelDataObj.buttonDeepLinkActive2)){ 
      this.dataService.SwalAlertSuccesOrFailMgs(this.translate.instant('inappChannelComponent.pleaseEnterTheButton2DeeplinkUrlLbl'),'warning');
      isValid = false;
    }
    return isValid;
  }
  // final save
  finalSaveMethod(){    
    if(!this.isInappEditModeEnable[this.currentSplitId] || this.isInappEditModeEnable[this.currentSplitId] === undefined || this.editChannelDataObj.templateLayoutId !== this.selectedInappLayoutId){
      this.collectDataForAllFields();
    } else {
      this.updateModificationInSaving();
    }
    let isValid = this.checkValidationMethod();
    if(!isValid){
      return;
    } 
     this.editChannelDataObj.message = this.dataService.formatToneWidgetText(this.editChannelDataObj.message);
    this.editChannelDataObj.title = this.dataService.formatToneWidgetText(this.editChannelDataObj.title);
    this.editChannelDataObj.subTitle = this.dataService.formatToneWidgetText(this.editChannelDataObj.subTitle);
    let payloadJson = {
      channels: [{
        PromotionKey: this.promoKey,
        channelId: this.commChannelKey,
        failSafe: false,
        failsafeSelectedOffers: [],
        html: encodeURIComponent(JSON.stringify(this.editChannelDataObj)),
        json: JSON.stringify(this.editChannelDataObj),
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
    this.finalInappPayloadData = payloadJson.channels[0];
    if(!this.isInappEditModeEnable[this.currentSplitId]) {
      if(Array.isArray(this.channelsPayloadObj) && this.channelsPayloadObj.length !== 0) {
        this.channelsPayloadObj.push(this.finalInappPayloadData);
      } else {
        this.shareService.channelsPayloadObj.next(payloadJson.channels);
      }
    }

    const url = AppConstants.API_END_POINTS.SAVE_ADMIN_PEOMO_TEMPLATE_USAGE;
    this.httpService.post(url, payloadJson).subscribe((data) => {
      this.dataService.SwalSuccessMsg(data.message);
    });

  }
  loadEditModeData() {
    let url = AppConstants.API_END_POINTS.GET_SAVED_USAGE_TEMPLATES+`?promoKey=${GlobalConstants.promoKey}`;
    this.httpService.post(url).subscribe((data) => {
      if(data.status === 'SUCCESS') {
        if(data.response.adminCommTemplate !== "") {
          this.channelSavedArray = JSON.parse(data.response.adminCommTemplate);
          this.shareService.channelsPayloadObj.next(this.channelSavedArray);
          const inAppObj = this.channelSavedArray.find(x => x.promoSplitKey === this.currentSplitId);
          if(inAppObj !== undefined) {
            this.isInappEditModeEnable[this.currentSplitId] = true;
            this.editChannelDataObj = JSON.parse(inAppObj.templateText);
            //this.collectDataForAllFields();
            this.objToSaveTemplateData = this.editChannelDataObj;            
            this.updateEditSavedData(this.editChannelDataObj,true);
            this.showHideInappSections(['imageOutterPanel','buttonOutterPanel']);
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
  reloadWithEmptyDataMethod(){
      this.emptyObj = {      
      "animType": 0,
      "backRndImg": false,
      "bgBtn1Color": "",
      "bgBtn2Color": "",
      "bgColor": "",
      "bgImgdeepLinkEnable": false,
      "bgImgdeeplinkInpText": "",
      "btnActionUrl": ['', ''],
      "buttonDeepLinkActive1": false,
      "buttonDeepLinkActive2": false,
      "buttonTextActive1": true,
      "buttonTextActive2": true,
      "commchkey": this.commChannelKey,
      "imageDeepLinkActive": false,
      "imgActionUrl": "",
      "imgUrl": "",
      "imgUrlActive": true,
      "inAppBtnText":['', ''],
      "isAnimationEnable": false,
      "layoutHtmlDiv": "",
      "message": "",
      //"splitId": 11,
      "stylingDataContentArry": "",
      "subTitle": "",
      "templateKey": this.templateKey,
      "templateLayoutId": this.selectedInappLayoutId,
      "timer": "",
      "title": "",
  }
}
  animationSectionMethod(editObj,iSstate){
      const animationElements = this.animationSection.nativeElement;
      if(iSstate){
        animationElements.getElementsByClassName('animationEnabled')[0].click();
      }else{
        animationElements.getElementsByClassName('animationEnabled')[0].checked = iSstate;        
        this.entranceTypeDisabled = !iSstate;
      }      
      if(iSstate){
        animationElements.getElementsByClassName('timerCheckbox')[0].checked = iSstate;
        animationElements.getElementsByClassName('timerCheckbox')[0].click();
      }else{
        animationElements.getElementsByClassName('timerCheckbox')[0].checked = iSstate;
      }
      animationElements.getElementsByClassName('selectEntranceType')[0].value = editObj.animType;
      this.timerDisabled = !iSstate;      
      animationElements.getElementsByClassName('timerValueInput')[0].value = editObj.timer;
      this.editChannelDataObj.isAnimationEnable = editObj.isAnimationEnable;
      this.isAnimationEnabled = editObj.isAnimationEnable;
      this.editChannelDataObj.timer = editObj.timer
      this.timerValue = editObj.timer;
      this.editChannelDataObj.animType = editObj.animType;
      this.animatedType = editObj.animType;
  }
  imageSectionDataMethod(editObj,isState){
    // this.objToSaveTemplateData.imgUrlActive = editObj.imgUrlActive;
    // this.objToSaveTemplateData.imgActionUrl = editObj.imgActionUrl;
    // this.objToSaveTemplateData.imageDeepLinkActive = editObj.imageDeepLinkActive;
    this.deeplinkImagePath = editObj.imgActionUrl;
    //this.imageInputDisabled = !editObj.imgUrlActive;
      const imageAreaElements = this.imageSection.nativeElement;
      if(isState){
        if(!imageAreaElements.getElementsByClassName('enableImageCk')[0].checked){
          imageAreaElements.getElementsByClassName('enableImageCk')[0].click();
        }
      }else{
        imageAreaElements.getElementsByClassName('enableImageCk')[0].checked = isState;
      }
      this.imageSelected = editObj.imgUrl;
      this.editChannelDataObj.imgUrl = editObj.imgUrl;
      this.imageInputDisabled = !isState;      
      if(editObj.imageDeepLinkActive){
        //imageAreaElements.getElementsByClassName('imgDeeplinkCk')[0].checked = isState;
        imageAreaElements.getElementsByClassName('imgDeeplinkCk')[0].click();
        this.deeplinkImageInputDisabled = !editObj.imageDeepLinkActive;
        this.deeplinkImagePath = editObj.imgActionUrl;
        this.editChannelDataObj.imageDeepLinkActive = editObj.imageDeepLinkActive;
        this.editChannelDataObj.imgActionUrl = editObj.imgActionUrl;
      }else{
        imageAreaElements.getElementsByClassName('imgDeeplinkCk')[0].checked = !state;
      }
  }
  updateEditSavedData(editObj,isEditLoad){
    const previewElemts = this.previewHtmlElement.nativeElement;
    //--- Template layout--------
    //------ need to change selected template
    if(isEditLoad){
      this.loadEditTemplateLayout(editObj.layoutHtmlDiv,editObj.templateLayoutId);
      this.selectedInappLayoutId = editObj.templateLayoutId;
    }    
    this.objToSaveTemplateData.templateLayoutId = editObj.templateLayoutId;
    //-------- Animation area -----------
    if(editObj.isAnimationEnable){
      this.animationSectionMethod(editObj,true);
    }else if(!editObj.isAnimationEnable){
      this.animationSectionMethod(editObj,false);
    }
    //------ backround Area --------------
    const backgroundElemnts = this.backgoundSection.nativeElement;
    if(editObj.backRndImg){
      //----- Image --------
      backgroundElemnts.getElementsByClassName('bgImage')[0].checked = true;
      backgroundElemnts.getElementsByClassName('bgImage')[0].click();
      setTimeout(() => {
        backgroundElemnts.getElementsByClassName('bgImageInput')[0].value = editObj.backgrdImagePath; 
        this.bckGrdImageSelected = editObj.backgrdImagePath;
        this.editChannelDataObj.backRndImg = editObj.backRndImg;   
        this.editChannelDataObj.backgrdImagePath = editObj.backgrdImagePath; 
      }, 100);          
    }else{
      //------- Color -------
      backgroundElemnts.getElementsByClassName('bgColor')[0].checked = true;
      backgroundElemnts.getElementsByClassName('bgColor')[0].click();
      this.bckgrdBtn1ColorSelected = editObj.bgColor;
      this.objToSaveTemplateData.backRndImg = editObj.backRndImg;
      this.objToSaveTemplateData.bgColor = editObj.bgColor;
      this.bckGrdColorSelected = editObj.bgColor;
      //backgroundElemnts.getElementsByClassName('backGrdColrbox')[0].style.backgroundColor = editObj.bgColor;
    }
    //------ Text Area ------
    this.switchTextTab(0);
    if(editObj.stylingDataContentArry !== ""){
      this.collectStylingData = JSON.parse(editObj.stylingDataContentArry);
    }else if(editObj.stylingDataContentArry === ""){
      this.collectStylingData = {};
    }
    this.titleTextContent = editObj.title;
    this.subtitleTextContent = editObj.subTitle;
    this.messageTextContent = editObj.message;
    if(this.titleInputContent !== undefined){
      this.titleInputContent.nativeElement.getElementsByClassName('title')[0].innerHTML = editObj.title;
    }   
    this.objToSaveTemplateData.title = editObj.title;
    this.objToSaveTemplateData.subTitle = editObj.subTitle;
    this.objToSaveTemplateData.message = editObj.message;
    this.objToSaveTemplateData.stylingDataContentArry = JSON.stringify(this.collectStylingData);
    //this.subtitleInputContent.nativeElement.getElementsByClassName('subtitle')[0].innerHTML = editObj.subTitle;
    //this.messageInputContent.nativeElement.getElementsByClassName('message')[0].innerHTML = editObj.message;
    //------formatter selected -----------
    //this.clearFormatDataOnSwitch(0);
    //------- Image Area ----------
    if(editObj.imgUrlActive && this.selectedInappLayoutId < 3){
      this.imageSectionDataMethod(editObj,true);
    }else if(!editObj.imgUrlActive && this.selectedInappLayoutId < 3){
      this.imageSectionDataMethod(editObj,true);
    }
    //--------------- Button area ------------
    this.switchButtonTab(1,editObj);
    this.objToSaveTemplateData.inAppBtnText = editObj.inAppBtnText;
    this.objToSaveTemplateData.btnActionUrl = editObj.btnActionUrl;
    this.objToSaveTemplateData.bgBtn1Color = editObj.bgBtn1Color;
    this.objToSaveTemplateData.bgBtn2Color = editObj.bgBtn2Color;
    //--------button 1 -------  
    if(editObj.buttonTextActive1){
      this.loadBtnDataOnSwitch(editObj,1,true);
      //--------button 2 -------
      if(this.selectedInappLayoutId > 2){
        this.deeplinkBtn2SelectedPath = editObj.btnActionUrl[1];  
        this.bckgrdBtn2ColorSelected = editObj.bgBtn2Color;
        this.deeplinkButton2InputDisabled = editObj.buttonDeepLinkActive2;
        this.objToSaveTemplateData.buttonTextActive2 = editObj.buttonTextActive2;
        this.button2ActiveEnable = !editObj.buttonTextActive2;
        this.objToSaveTemplateData.inAppBtnText[1] = editObj.inAppBtnText[1]; 
        this.buttonText2 = editObj.inAppBtnText[1];
        this.objToSaveTemplateData.buttonDeepLinkActive2 = editObj.buttonDeepLinkActive2;
        this.objToSaveTemplateData.btnActionUrl[1] = editObj.btnActionUrl[1];
        this.objToSaveTemplateData.bgBtn2Color = editObj.bgBtn2Color;
      }      
    }else if(!editObj.buttonTextActive1){
      this.loadBtnDataOnSwitch(editObj,1,true);
      //--------button 2 -------
      if(this.selectedInappLayoutId > 2){
        this.deeplinkBtn2SelectedPath = editObj.btnActionUrl[1];  
        this.bckgrdBtn2ColorSelected = editObj.bgBtn2Color;
        this.deeplinkButton2InputDisabled = editObj.buttonDeepLinkActive2;
        this.objToSaveTemplateData.buttonTextActive2 = editObj.buttonTextActive2;
        this.button2ActiveEnable = !editObj.buttonTextActive2;
        this.objToSaveTemplateData.inAppBtnText[1] = editObj.inAppBtnText[1]; 
        this.buttonText2 = editObj.inAppBtnText[1];
        this.objToSaveTemplateData.buttonDeepLinkActive2 = editObj.buttonDeepLinkActive2;
        this.objToSaveTemplateData.btnActionUrl[1] = editObj.btnActionUrl[1];
        this.objToSaveTemplateData.bgBtn2Color = editObj.bgBtn2Color;
      } 
    }
    // if(editObj.buttonTextActive2){
    //   this.loadBtnDataOnSwitch(editObj,2);
    // }

  }
  loadBtnDataOnSwitch(editObj,id,isState){
    if(editObj !== undefined){
    if(id === 1){
      if(this.button1AreaSection !== undefined){      
      
      const button1Elements = this.button1AreaSection.nativeElement;
      if(isState){
        if(!button1Elements.getElementsByClassName('btn1SectionEnabled')[0].checked){
          if(this.editChannelDataObj.buttonTextActive1){
            button1Elements.getElementsByClassName('btn1SectionEnabled')[0].click();
            this.button1ActiveEnable = true;
          }          
        }   
        if(!this.editChannelDataObj.buttonTextActive1){
          button1Elements.getElementsByClassName('btn1SectionEnabled')[0].checked = this.editChannelDataObj.buttonTextActive1;
        }     
      }else{
        button1Elements.getElementsByClassName('btn1SectionEnabled')[0].checked = isState;
      }
      button1Elements.getElementsByClassName('btn1NameInput')[0].value = editObj.inAppBtnText[0] || "";
      this.bckgrdBtn1ColorSelected = editObj.bgBtn1Color;
      this.button1ActiveEnable = editObj.buttonTextActive1;
      this.buttonText = editObj.inAppBtnText[0] || "";     
      //if(editObj.buttonDeepLinkActive1){
        button1Elements.getElementsByClassName('deeplinkBtn1Ck')[0].checked = editObj.buttonDeepLinkActive1;
        //button1Elements.getElementsByClassName('deeplinkBtn1Ck')[0].click();
        this.deeplinkBtn1SelectedPath = editObj.btnActionUrl[0] || "";
        this.deeplinkButton1InputDisabled = !editObj.buttonDeepLinkActive1;
        
      //}
    }
    }else{
      if(this.button2AreaSection !== undefined){
      const button2Elements = this.button2AreaSection.nativeElement;
      if(isState){
        if(!button2Elements.getElementsByClassName('btn2SectionEnabled')[0].checked){
          if(this.editChannelDataObj.buttonTextActive2){
            button2Elements.getElementsByClassName('btn2SectionEnabled')[0].click();
            this.button2ActiveEnable = true;
          }          
        }        
        if(!this.editChannelDataObj.buttonTextActive2){
          button2Elements.getElementsByClassName('btn2SectionEnabled')[0].checked = this.editChannelDataObj.buttonTextActive2;
        }
      }else{
        button2Elements.getElementsByClassName('btn2SectionEnabled')[0].checked = isState;
      }
      button2Elements.getElementsByClassName('btn2NameInput')[0].value = editObj.inAppBtnText[1] || "";
      //if(editObj.buttonDeepLinkActive2){
        button2Elements.getElementsByClassName('deeplinkBtn2Ck')[0].checked = editObj.buttonDeepLinkActive2;
        //button2Elements.getElementsByClassName('deeplinkBtn2Ck')[0].click();
      //}
      this.deeplinkBtn2SelectedPath = editObj.btnActionUrl[1] || "";  
      this.bckgrdBtn2ColorSelected = editObj.bgBtn2Color;
      this.deeplinkButton2InputDisabled = !editObj.buttonDeepLinkActive2;      
      this.buttonText2 = editObj.inAppBtnText[1] || "";    
      this.button2ActiveEnable = editObj.buttonTextActive2;      
    }
    }
  }
  }
  loadEditTemplateLayout(tempHtml,layoutId){
    this.previewHtmlElement.nativeElement.innerHTML = "";
    const tempElements = document.createRange().createContextualFragment(tempHtml);
    this.previewHtmlElement.nativeElement.appendChild(tempElements);
    this.selectedInappTemp = tempElements;
    this.templateTabActive = layoutId;
  }
  //------- Offers Slider ------------
  onCloseOfferDrawer(){
    this.backropOffersEnable = false;
    this.offerDrawerSectionEnable = false;
    //this.removeLoader();
  }
  showHideInappSections(sectionArry){
    sectionArry.forEach(item => {
      if(item === 'imageOutterPanel'){      
        if(this.selectedInappLayoutId > 2){
          this.imageOutterPanel.nativeElement.style.pointerEvents = 'none';
          this.imageOutterPanel.nativeElement.style.color = '#b3b3b3';
          this.isImageSectionEnabled = false;
        }else{
          this.imageOutterPanel.nativeElement.style.pointerEvents = 'all';
          this.imageOutterPanel.nativeElement.style.color = '#212529';
          this.isImageSectionEnabled = true;
        }
      }else if(item === 'buttonOutterPanel'){
        if(this.selectedInappLayoutId > 3){
          this.button2TabEnabled = false;
          this.buttonOutterPanel.nativeElement.getElementsByClassName('btnTab2')[0].style.pointerEvents = 'none';
          this.buttonOutterPanel.nativeElement.getElementsByClassName('btnTab2')[0].style.color = '#b3b3b3';
        }else{
          this.button2TabEnabled = true;
          this.buttonOutterPanel.nativeElement.getElementsByClassName('btnTab2')[0].style.pointerEvents = 'all';
          this.buttonOutterPanel.nativeElement.getElementsByClassName('btnTab2')[0].style.color = '#212529';
        }
      }
    });
    
    
  }
  removeLoader(){
    this.ngZone.run(() => {
      this.loader.loadCount = 0;
      this.loader.HideLoader();         
    });
  }
  finalOffersSelected(res){
    if(Object.keys(res).length > 0){
      Object.keys(res).map( key => {
        Object.values(res[key]).map((each:any) =>{
          const offertemp = "&nbsp;<span class='offerDynamic pointer' contenteditable='false' spellcheck='false' data-currentInputClassName='"+this.selectedPlaceHolderInput+"' data-dbkey='"+key+"' data-name='"+each.name+"'>"+each.value+"</span>&nbsp;";
          this.insertHtmlAtCaret(offertemp);
          this.updateInappPreviewSection(this.currentInputFocused);
        })
        
      });
      
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
        this.shareService.inappEditModeOffersSelected.next(this.collectOffersFromInputSelected);
        console.log(this.collectOffersFromInputSelected);  
      }
    });
  }else{
    this.shareService.inappEditModeOffersSelected.next(this.collectOffersFromInputSelected);
  }
  }
  ngOnInit(): void {
  }
  openTestInappModal(modalTemplate: TemplateRef<any>){
    if(!this.isInappEditModeEnable[this.currentSplitId] || this.isInappEditModeEnable[this.currentSplitId] === undefined || this.editChannelDataObj.templateLayoutId !== this.selectedInappLayoutId){
      this.collectDataForAllFields();
    } else {
      this.updateModificationInSaving();
    }
    let isValid = this.checkValidationMethod();
    if(!isValid){
      return;
    }
    this.editChannelDataObj.message = this.dataService.formatToneWidgetText(this.editChannelDataObj.message);
    this.editChannelDataObj.title = this.dataService.formatToneWidgetText(this.editChannelDataObj.title);
    this.editChannelDataObj.subTitle = this.dataService.formatToneWidgetText(this.editChannelDataObj.subTitle);
    this.editChannelDataObj.layoutHtmlDiv = this.dataService.formatToneWidgetText(this.previewHtmlElement.nativeElement.innerHTML); 
    let inappJsonObj = JSON.stringify(this.editChannelDataObj);
    let encodeInappJsonObj = encodeURIComponent(inappJsonObj);

    let payloadJson = {
      channels: [{
        commChannelKey: this.commChannelKey,
        currentSplitid: this.currentSplitId,
        customercode: "",
        isTestList: false,
        msgContent: encodeInappJsonObj,
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
    
    this.finalInappPayloadData = payloadJson.channels[0];
    if(!this.isInappEditModeEnable[this.currentSplitId]) {
      if(Array.isArray(this.channelsPayloadObj) && this.channelsPayloadObj.length !== 0) {
        this.channelsPayloadObj.push(this.finalInappPayloadData);
      } else {
        this.shareService.channelsPayloadObj.next(payloadJson.channels);
      }
    }

    
    this.modalRef = this.modalService.show(modalTemplate,
      {
        class: 'modal-dialog-centered testPushModel',
        backdrop: 'static',
        keyboard: false
      }
    );
  }
}
