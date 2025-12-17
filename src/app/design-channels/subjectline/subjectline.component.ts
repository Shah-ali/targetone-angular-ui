import { Component, OnInit,Output,Input,EventEmitter, ElementRef, ViewChild, TemplateRef} from '@angular/core';
import { SharedataService } from '@app/core/services/sharedata.service';
import { AppConstants } from '@app/app.constants';
import { HttpService } from '@app/core/services/http.service';
import { GlobalConstants } from '../common/globalConstants';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MergeTagsComponent } from '../merge-tags/merge-tags.component';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '@app/core/services/data.service';
declare var $: any;

@Component({
  selector: 'app-subjectline',
  templateUrl: './subjectline.component.html',
  styleUrls: ['./subjectline.component.scss']
})
export class SubjectlineComponent implements OnInit {
  @ViewChild('mTags', { static: false }) mTags!: ElementRef;
  vendorObj: any;
  preHeader:any ="";
  preHeaderFailSafe:any = ""
  senderId:any="";
  senderName:any ="";
  subject:any = "";
  vendorDesc:any="";
  vendorId:any="";
  isFirstOpen = true;
  dataObj:any;
  @Input() commChannelKey:any;
  public isEdit:boolean=false;
  vendorDataObj:any=[];
  promotionObj:any;
  subjectObj:any;
  @ViewChild('subjectInputElement', { static: false }) inputsubject : ElementRef | any;
  @ViewChild('preHeaderInputElement', { static: false }) inputPreHeader: ElementRef  | any;
  @ViewChild('preHeaderFailsafeInputElement', { static: false }) inputPreHeaderFailSafe: ElementRef  | any;
  senderConfigKey: any;
  Object = Object;
  senderIdsObj: any = {};
  selectedEmoji: any;
  showEmojiPicker: boolean = false;
  customEmojis: any = []; 
  sets:any = [
    'native',
    'google',
    'twitter',
    'facebook',
    'emojione',
    'apple',
    'messenger',
  ];
  set = 'google';
  selectedSenderId: any;
  currentSplitId: any;
  showEmojiPicker_subject: boolean = false;
  emojiObj: any;
  preHeaderActual: any;
  subjectActual: any;
  payLoadChannels: any;
  isFailSafeTabActive:any;
  isFailSafeEnable:any;
  failsafeTabId: any;
  isPreheaderInputEnable: boolean = false;
  isBeautyCopy: boolean = false;
  beautyCopyName: any;
  modalRef?: BsModalRef;
  isFromSubjectRedirect: any;
  selectedMergeTags: any = "";
  tempSubject: any = "";
  tempPreheader: any = "";
  varArgsMergeTags: any = [];
  mergeTagBtnEnable:boolean = true;
  mergeTagBtnEnablePreHead: boolean = true;
  sendSubjectObjtoOther:any = {"subject":"","preHeader":""};
  sendSubjectObjtoOtherFailsafe:any = {"subject":"","preHeader":""};
  cursorPositionSubject: number | undefined = 0;
  cursorPositionPreHeader: number | undefined = 0;
  inserEmojiAt: any;
  TemperaryRange: any;
  i18nObject: { search: any; notfound: any; pickyourEmojiTooltip: any; categories: { search: any; recent: any; custom: any; }; };
  isPreheaderInputEnableFailsafe: boolean = false;
  subjectLine:any;
  editPublish:any;
  viewPublish:any;
  constructor(private shareService: SharedataService, private http: HttpService, private el:ElementRef, private modalService: BsModalService,private translate: TranslateService,private dataService: DataService) { 
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
      //-------- On Load ---------
    this.shareService.promoKeyObj.subscribe(res => {
      this.promotionObj = res;      
     });
     this.shareService.failSafeTabActive.subscribe(res => {
      this.isFailSafeTabActive = res;
    });
    this.shareService.failSafeEnable.subscribe(res => {
      this.isFailSafeEnable = res;
    })
    this.shareService.failSafePreviousTab.subscribe(res => {
      this.failsafeTabId = res;
    });
    //if(this.failsafeTabId === 0 || this.failsafeTabId === 1){
      this.updateSubjectObj();
    //}
     this.getEmojiObj();
     this.shareService.currentSelectedChannelObj.subscribe((res:any) => {
      this.commChannelKey = res.commChannelKey;
      this.selectedSenderId = res.senderConfigKey;
      this.currentSplitId = res.currentSplitId;
      //this.payLoadChannels = res;
     });
    this.getVendorNameObj();    
    //  this.shareService.vendorObj.subscribe((res:any) => {
    //   this.vendorDataObj = res;
    //   this.senderIdsObj = this.vendorDataObj[0].senderIds;
    // });
    this.shareService.savedAdminComTemplateObj.subscribe((res:any) => {
      this.payLoadChannels = res;
    });
    if(GlobalConstants.isEditMode){
      if(this.payLoadChannels !== undefined){
        const newObj = this.payLoadChannels.find(x => x.promoSplitKey == this.currentSplitId);
        if(newObj !== undefined){
          if(newObj.preHeader != "" && newObj.preHeader != "undefined" && newObj.preHeader != null){
            this.isPreheaderInputEnable = true;
          }
          if(newObj.failSafePreHeader != "" && newObj.failSafePreHeader != "undefined" && newObj.failSafePreHeader != null){
            this.isPreheaderInputEnableFailsafe = true;
          }
          this.getSubjectdata();          
          this.shareService.subjectObj.next(this.subjectObj);
          setTimeout(() => {
            this.subjectNpreheaderObj();
          },500);
          // if(!this.isFailSafeTabActive){
          //   this.shareService.subjectNpreheaderInputValue.next(this.subjectObj);
          // }else{
          //   this.shareService.subjectNpreheaderInputValueFailsafe.next(this.subjectObj);
          // }          
        }   
      }               
    }
     
    //this.getSubjectObj();
    //this.getVendorNameObj(AppConstants.API_END_POINTS.GET_VENDOR_NAMES+`?promoKey=${this.promotionObj.promoKey}`);
  }

  ngOnInit(): void {
    this.varArgsMergeTags = GlobalConstants.varArgs;
  }
  ngAfterViewInit() {
    this.inputsubject.nativeElement.innerHTML =  this.dataService.getSubjectLine() || '';
    this.viewPublish = this.dataService.getViewPublish();
  }
  specialCharactersToHMTL(str){
    if(str !== undefined){
      str = str.replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll("<br>","");
    }
    return str;
  }

  subjectNpreheaderObj(){    
    if(this.isFailSafeTabActive){
      this.sendSubjectObjtoOtherFailsafe.subject = this.specialCharactersToHMTL(this.inputsubject?.nativeElement.innerHTML);
      this.sendSubjectObjtoOtherFailsafe.preHeader = this.specialCharactersToHMTL(this.inputPreHeaderFailSafe?.nativeElement.innerHTML);
      this.shareService.subjectNpreheaderInputValueFailsafe.next(this.sendSubjectObjtoOtherFailsafe);
    }else{
      this.sendSubjectObjtoOther.subject = this.specialCharactersToHMTL(this.inputsubject?.nativeElement.innerHTML);
      this.sendSubjectObjtoOther.preHeader = this.specialCharactersToHMTL(this.inputPreHeader?.nativeElement.innerHTML);
      this.shareService.subjectNpreheaderInputValue.next(this.sendSubjectObjtoOther);
    }
  }
  updateSubjectObj(){    
    this.shareService.updateSubjectPreheader.subscribe((res:any) => {
      if(Object.keys(res).length > 0){
        this.subject = res.subject;
        this.preHeader = res.preHeader;
        if(GlobalConstants.isEditMode){
          if(this.isFailSafeTabActive){            
            this.shareService.subjectNpreheaderInputValueFailsafe.subscribe((resFailsafeInner:any) => {
              if(this.Object.keys(resFailsafeInner).length > 0){
                this.inputsubject.nativeElement.innerHTML = resFailsafeInner.subject;
                setTimeout(() => {
                  if(this.inputPreHeaderFailSafe !== undefined){
                    this.inputPreHeaderFailSafe.nativeElement.innerHTML = this.dataService.checkNullUndefinedEmpty(resFailsafeInner.preHeader);
                  }  
                }, 0);
                              
              }else{
                this.inputsubject.nativeElement.innerHTML = res.subject;
                if(this.inputPreHeader !== undefined){
                  this.inputPreHeader.nativeElement.innerHTML = this.dataService.checkNullUndefinedEmpty(res.preHeader);
                }
              }                           
              this.getSubjectObj();
            });
          }else{
            this.shareService.subjectNpreheaderInputValue.subscribe((resInner:any) => {
              if(this.Object.keys(resInner).length > 0){
                this.inputsubject.nativeElement.innerHTML = resInner.subject;
                this.preHeader = this.dataService.checkNullUndefinedEmpty(resInner.preHeader);
                if(this.inputPreHeader !== undefined){
                  this.inputPreHeader.nativeElement.innerHTML = this.dataService.checkNullUndefinedEmpty(resInner.preHeader);
                }                
              }else{
                this.inputsubject.nativeElement.innerHTML = res.subject;
                this.preHeader = this.dataService.checkNullUndefinedEmpty(res.preHeader);
                if(this.inputPreHeader !== undefined){
                  this.inputPreHeader.nativeElement.innerHTML = this.dataService.checkNullUndefinedEmpty(res.preHeader);
                }
              }
              this.getSubjectObj();
            });
          }
                    
        }else{
          this.inputsubject.nativeElement.innerHTML = res.subject;
          if(this.inputPreHeader !== undefined){
           this.inputPreHeader.nativeElement.innerHTML = this.dataService.checkNullUndefinedEmpty(res.preHeader);
          }
        }
        
       setTimeout(() => {          
          this.inputsubject?.nativeElement.focus();
        },0);        
      }      
    });
  }
  async getEmojiObj(){    
    const url = AppConstants.API_END_POINTS.GET_EMOJI_OBJ;
    const emObj = await this.http.post(url).toPromise();
    if(Object.keys(emObj).length > 0){
      if(emObj.status = "SUCCESS"){
        this.emojiObj = JSON.parse(emObj.response.Emojis);
        this.getCustomeObj();        
      }
    }
  }
  getCustomeObj(){
    this.emojiObj.forEach((item) => {
      var obj = {};
      obj["name"] = item.emoji;
	  	obj["shortNames"] = item.aliases;
      obj["text"] = item.emoji;
      obj["label"]=item.emoji;
	  	obj["keywords"] = item.tags; 
      this.customEmojis.push(obj);     
    });
//    this.emojiObj = this.emojiObj.reverse();
  }
  pickEmoji(evt){
    this.selectedEmoji = evt.emoji;
  }  
  addEmojiPreHeader(event) {
    //const { preHeader } = this;
    if(typeof(this.preHeader) === 'undefined'){
      this.preHeader = "";
    }
    if(typeof(this.preHeaderActual) === 'undefined'){
      this.preHeaderActual = "";
    }
    if(typeof(event.emoji.native) === 'undefined' || typeof(this.preHeaderActual) === 'undefined'){
      const textNative = `${event.emoji.native}`;
      const text = `${this.subject}${event.emoji.shortNames[0]}`;
      this.inserEmojiAt.insertNode(document.createTextNode(textNative));
      this.showEmojiPicker = !this.showEmojiPicker;
    }else{
      const textNative = `${event.emoji.native}`;
      const text = `${this.subject}${event.emoji.shortNames[0]}`;
      this.preHeaderActual=text;
      this.inserEmojiAt.insertNode(document.createTextNode(textNative));
      this.showEmojiPicker = !this.showEmojiPicker;
    }    
    this.subjectNpreheaderObj();
    this.getSubjectObj();
  }
  addEmojiSubject(event) {
    if(typeof(this.subject) === 'undefined'){
      this.subject = "";    
    }
    if(typeof(this.subjectActual) === 'undefined'){
        this.subjectActual = "";
    }
    if(typeof(event.emoji.native) === 'undefined' ){
      const textNative = `${event.emoji.native}`;
      const text = `${this.subject}${event.emoji.shortNames[0]}`;
      this.subjectActual=text;
      this.inserEmojiAt.insertNode(document.createTextNode(textNative));
      this.showEmojiPicker_subject = !this.showEmojiPicker_subject;
    }else{
      const textNative = `${event.emoji.native}`;
      const text = `${this.subjectActual}${event.emoji.shortNames[0]}`;
      this.subjectActual=text;
      let messageEl : HTMLElement = this.inputsubject?.nativeElement;      
      this.inserEmojiAt.insertNode(document.createTextNode(textNative));
      this.showEmojiPicker_subject = !this.showEmojiPicker_subject;
    }    
    this.subjectNpreheaderObj();
    this.getSubjectObj();
   }

getCaretIndex(text) {
    var sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            //range.deleteContents();
            this.inserEmojiAt = range;
            //range.insertNode( document.createTextNode(text) );
        }
     }
}
    
  async getVendorNameObj(){
    if(typeof(GlobalConstants.promoKey) !== 'undefined'){
    let url = AppConstants.API_END_POINTS.GET_VENDOR_NAMES+`?promoKey=${GlobalConstants.promoKey}`;
    const resultObj = await this.http.post(url).toPromise();
      if(resultObj.status == "SUCCESS" ){
        this.vendorObj = JSON.parse(resultObj.response);        
        this.vendorDataObj.push(this.vendorObj[this.commChannelKey]);
        GlobalConstants.vendorObj = this.vendorDataObj;
        console.log(this.vendorObj);
        if(Object.keys(this.vendorDataObj).length > 0){
          this.vendorDesc = this.vendorDataObj[0].vendorDesc;
          this.senderIdsObj = this.vendorDataObj[0].senderIds; 
          this.senderName = this.senderIdsObj[this.selectedSenderId];
          this.senderId = this.senderIdsObj[this.selectedSenderId];
          if(!GlobalConstants.isEditMode){
            this.beautyCopyName = this.senderName;
          }       
          this.senderConfigKey=this.selectedSenderId;        
          this.getSubjectObj(); 
        } 
      }
    }
  }
  setSenderid(evt){
    if(evt.target.value != '0'){
     // this.senderName = this.vendorDataObj[0].senderID;
      this.senderName = evt.target.selectedOptions[0].label;
      this.senderConfigKey=evt.target.selectedOptions[0].value;
      //this.senderName = evt.target.value;
    }    
  }
  
  getSubjectdata(){ // getting data on Edit
    this.shareService.subjectObj.subscribe((e) => {
      
      if(e != undefined){
        this.vendorId=e.senderConfigKey;
        this.senderId=e.senderId
        this.vendorDesc=e.vendorDesc;
        this.senderName = e.senderName;
        this.senderConfigKey=e.senderConfigKey;
        if(e.subject != "" && e.subject != " " && e.subject != "undefined" && e.subject != null) {
          this.tempSubject = e.subject.replaceAll("<tonewidget>","&lt;tonewidget&gt;").replaceAll("</tonewidget>","&lt;/tonewidget&gt;");
        }else{
          this.subject = this.inputsubject?.nativeElement.innerHTML;
        }

        if(e.preHeader != "" && e.preHeader != " " && e.preHeader != "undefined" && e.preHeader != null) {
          this.tempPreheader = e.preHeader;
        }else{
          this.preHeader = this.inputPreHeader?.nativeElement.innerHTML;
        }
        
        this.preHeader = this.dataService.checkNullUndefinedEmpty(e.preHeader);
        this.beautyCopyName = e.senderName
        //e.subject= e.subject;
        //e.preHeader = e.preHeader; 
        this.subjectObj = e;
      }      
      
    });
  }

  getSubjectObj(){ // sent data to save
    //let sanitizeHTML = this.sanitizer.bypassSecurityTrustHtml(this.inputsubject?.nativeElement.innerHTML);
    this.dataObj =  {
    "senderId":this.senderId,
    "senderName":this.beautyCopyName,
    "vendorDesc":this.vendorDesc,
    "senderConfigKey":this.senderConfigKey,
    "subject":this.inputsubject?.nativeElement.innerHTML? this.inputsubject?.nativeElement.innerHTML: '',
    "preHeader":'',
    "vendorId":this.senderConfigKey
      
    }
    // this.isFirstOpen = false;
    if(this.isFailSafeTabActive){
      this.dataObj.preHeader = this.inputPreHeaderFailSafe?.nativeElement.innerHTML? this.inputPreHeaderFailSafe?.nativeElement.innerHTML: '';
      this.shareService.failSafSubjectObj.next(this.dataObj);
    }else{
      this.dataObj.preHeader = this.inputPreHeader?.nativeElement.innerHTML? this.inputPreHeader?.nativeElement.innerHTML: '';
      this.shareService.subjectObj.next(this.dataObj);
    }
  }
  addPreHeader(){
    this.isPreheaderInputEnable = true;
    this.preHeader = "";
    setTimeout(() => { 
      if(this.inputPreHeader !== undefined){
        this.inputPreHeader.nativeElement.innerHTML = "";
      }
    },0);    
  }
  addPreHeaderfailSafe(){
    this.isPreheaderInputEnableFailsafe = true;    
    this.preHeaderFailSafe = "";
    setTimeout(() => {
      if(this.inputPreHeaderFailSafe !== undefined){
        this.inputPreHeaderFailSafe.nativeElement.innerHTML = "";
      }
    }, 0);
    
  }
  deletePreHeader(){         
    if(this.dataObj !== undefined){      
      this.dataObj.preHeader = "";
      let obj = {
        subject: this.dataObj.subject,
        preHeader: this.dataObj.preHeader
      };      
      if(this.isFailSafeTabActive){
        if(this.inputPreHeaderFailSafe !== undefined){
          this.inputPreHeaderFailSafe.nativeElement.innerHTML = "";
        }
        this.preHeaderFailSafe = "";
        this.isPreheaderInputEnableFailsafe = false;
        this.shareService.subjectNpreheaderInputValueFailsafe.next(obj);
        this.shareService.failSafSubjectObj.next(this.dataObj);
      }else{
        if(this.inputPreHeader !== undefined){
          this.inputPreHeader.nativeElement.innerHTML = "";
        }
        this.preHeader = "";
        this.isPreheaderInputEnable = false;
        this.shareService.subjectNpreheaderInputValue.next(obj);
        this.shareService.subjectObj.next(this.dataObj);
      }
    }
    
  }
  
  editBeautyCopy(){
    this.isBeautyCopy = true;
  }
  saveBeautyCopy(){
    this.isBeautyCopy = false;
    this.getSubjectObj();
    if(this.beautyCopyName === ""){
      this.beautyCopyName = this.senderId;
    }
  }
  collapseAccord(){
    this.isFirstOpen = false;
  }
  expandAccord(){
    this.isFirstOpen = true;
  }

  addTagsSubject(modalTemplate: TemplateRef<any>) {
    GlobalConstants.isFromSubjectRedirect = true;
    GlobalConstants.isOpenGlobalTags = false;
    this.modalRef = this.modalService.show(MergeTagsComponent,{
        class: 'modal-dialog-centered',
        backdrop: true,
        keyboard: false
    });

    this.modalRef.content.addTagOnInput.subscribe(result => {
      this.selectedMergeTags = result;
      
      this.mTags.nativeElement.childNodes[0].setAttribute("data-merge-tag", this.selectedMergeTags.value)
      this.mTags.nativeElement.childNodes[0].innerText = this.selectedMergeTags.cvalue;
      let finalSelectedMergeTags = this.mTags.nativeElement.innerHTML;
      setTimeout(() => {          
        this.insertHtmlAtCaret(finalSelectedMergeTags);
        this.subjectNpreheaderObj();
      },0);
      
    });
  }
  
  
  insertHtmlAtCaret(html) {
    if(this.inserEmojiAt === undefined){
      // alert when undefined 
    } else {
      let el = document.createElement("div");
      el.innerHTML = html;
      let frag = document.createDocumentFragment(), node, lastNode;
      while ( (node = el.firstChild) ) {
          lastNode = frag.appendChild(node);
      }
      let firstNode = frag.firstChild;
      this.inserEmojiAt.insertNode(frag); 
      if (lastNode) {
        this.inserEmojiAt = this.inserEmojiAt.cloneRange();
        this.inserEmojiAt.setStartAfter(lastNode);
        //sel.removeAllRanges();
        //sel.addRange(range);
      }
      this.getSubjectObj();
    } 
    
  }

  onEnter($event) {
    $event.preventDefault();
  }

  
  
  onClose(): void {
    if(this.modalRef !== undefined) {
      this.modalRef.hide();
    }
  }

  ngAfterViewChecked(){
    let customer_data = this.varArgsMergeTags[0].userdata;
    let re: any = [];
    customer_data.filter(function (el) {
      re.push(el.value);
    });
    $(".subjectDiv, .preHeaderDiv").atwho({
      at: "@",
      startWithSpace: true,
      data:re,
      insertTpl: '<em data-merge-tag="{${name}}">${name}</em>'
    });

    //$(".subjectDiv span, .preHeaderDiv span").attr("contenteditable", "false");
    
  }
  checkElement(evt){
    if(evt.target.className.indexOf("subjectDiv") !== -1){
      this.mergeTagBtnEnable = false;
    }else{
      this.mergeTagBtnEnable = true;
    }    
    if(evt.target.className.indexOf("preHeaderDiv") !== -1){
      this.mergeTagBtnEnablePreHead = false;
    }else{
      this.mergeTagBtnEnablePreHead = true;
    }    
  }

  onPaste(e) {
    // Stop data actually being pasted into div
    e.preventDefault();
  
    // Get pasted data via clipboard API
    const clipboardData = e.clipboardData;
    const pastedText = clipboardData.getData('text');
  
    // Insert the value on cursor position
    window.document.execCommand('insertText', false, pastedText);
  }
}
