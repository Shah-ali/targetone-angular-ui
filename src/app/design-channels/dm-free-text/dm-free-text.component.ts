import { Component, OnInit, Output,EventEmitter, ViewChild, ElementRef,HostListener, AfterViewInit,NgZone} from "@angular/core";
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
  selector: 'app-dm-free-text',
  templateUrl: './dm-free-text.component.html',
  styleUrls: ['./dm-free-text.component.scss']
})
export class DmFreeTextComponent implements OnInit {
  @ViewChild('attributeInputContent') attributeInputContent!: ElementRef;
  @ViewChild('dmContentElements') dmContentElements!: ElementRef;
  backropOffersEnable: boolean = false;
  offerDrawerSectionEnable: boolean = false;
  currentSplitId: any;
  modalRef?: BsModalRef;
  channelObj: any;
  promoKey: any;
  commChannelKey: any;
  channelName: any;
  currentObj: any;
  senderId: any;
  dbKey: any;
  senderDetails: any;
  venderDetails: any;
  venderDesc: any;
  selectedOffersToSubmit: any = [];
  selectedRecoOffersToSubmit: any = [];
  offersDataJson: any;
  recommedationsDataJson: any;
  collectData: any = [];
  showIngridData: any = {};
  recoofferArry: any = [];
  staticOfferArry: any = [];
  insertOfferAt: any;
  collectOffersFromInputSelected: any = [];
  selectedPlaceHolderInput: any;
  finalDmPayloadData: any;
  isDmFreetxtEditModeEnable: any = {};
  channelsPayloadObj: any;
  isIncludeHeaders: boolean = false;
  columnHerderVal:any;
  attributeInpVal: any;
  channelSavedArray: any;
  promotionSplitHelper: any;
  enablePlusBtn: boolean = false;
  tempPublishArry: any = [];
  selectedRecoOffersEdit: any;
  publishRecommendationOffers: any = [];
  constructor(private httpService: HttpService, private dataService: DataService, private shareService:SharedataService,
    private modalService:BsModalService, private loader:LoaderService,private translate:TranslateService, private ngzone: NgZone) { 
      AppConstants.OFFERS_ENABLE.MERGE_TAG = true;
      AppConstants.OFFERS_ENABLE.RECOMMENDATION_OFFERS = true;
      AppConstants.OFFERS_ENABLE.STATIC_OFFERS = true;
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
        this.getVendorNameObj();
        this.recommendationOfferDataMethod();
        this.getSavedData();
      },500);
     }
     @HostListener('document:click', ['$event.target'])
      clickout(event) {
        if(event.className.includes('attribute')){
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
          this.getoffersDataObj("");
        });
      }
    }
    
    setActiveTab(currentObj:any): void {
      if(this.currentSplitId !== undefined){
        const setAct = this.channelObj.findIndex(x => x.promoSplitId === this.currentSplitId);
        this.shareService.setActiveChannelTab.next(setAct);
      }
    }
    async getoffersDataObj(filterBy) {
       const promoKey = {
        promotionKey: this.promoKey, // mandatory
        maxRecordsDisplay: 50, // optional, default to 50
        startPos: 0,
        isCouponEnable: false,
        filterByKey: "offerCode",
        filterByValue: filterBy,
        splitKey:this.currentSplitId
      };
      const resultObj = await this.httpService.post(AppConstants.API_END_POINTS.GET_OFFERS_DATA,promoKey).toPromise();
      if(resultObj.status == 'SUCCESS'){
        this.offersDataJson = resultObj.response.offers;    
      }
      
    }
    async recommendationOfferDataMethod(){
      const resultObj = await this.httpService.post(AppConstants.API_END_POINTS.GET_RECOMMENDATION_OBJ).toPromise();
        if(resultObj){
          this.recommedationsDataJson = resultObj.nodes;
        }else{
    
        }
     }
     checkIncludeHeader(evt){
      if(evt.target.checked){
        this.isIncludeHeaders = true;
      }else{
        this.isIncludeHeaders = false;
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
        
      });
      
    }
    //this.shareService.dmEditModeOffersSelected.next(this.showIngridData);
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
      this.updateAttributeSection();
      //this.updateInappPreviewSection(this.inserEmojiAt.startContainer.id);
    } 
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
    this.updateAttributeSection();
    //this.currentInputFocused = inptClassName;
    //if(GlobalConstants.inAppEditMode){
      this.collectDraggedOffers(evt,false);
    //}
  }
  updateAttributeSection(){
    if(this.attributeInputContent !== undefined){
      let strText = this.attributeInputContent.nativeElement.getElementsByClassName('attribute')[0].innerHTML;
        if(strText !== undefined && strText.includes('tonewidget')){
          strText = this.dataService.formatToneWidgetText(strText);
          this.attributeInpVal = this.newLineContentToBr(strText);
        }else{
          this.attributeInpVal = this.newLineContentToBr(strText);
        }
    }
    
  }
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
  this.shareService.dmFreeTextEditModeOffersSelected.next(this.collectOffersFromInputSelected);
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
  ngOnInit(): void {
  }
  // final save
  finalSaveMethod(){    
    if(this.isIncludeHeaders){
      if(this.columnHerderVal === undefined){
        Swal.fire({
        icon: 'warning',
        text: this.translate.instant('dmFreeTextComponent.columnheadersCannotBeEmptyALertMsgLbl')           
      })
        return;
      }
    }
    let payloadJson = {
      channels: [{
        PromotionKey: this.promoKey,
        channelId: this.commChannelKey,
        failSafe: false,
        failsafeSelectedOffers: [],
        html: encodeURIComponent(JSON.stringify(this.attributeInpVal)),
        json: JSON.stringify(this.attributeInpVal),
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
        templateKey: null,
        thumbnailImage: "",
        title: "",
        uuid: "",
        //hasDMOfferEnable:this.hasDmOffersEnable
      }]
    }
    this.finalDmPayloadData = payloadJson.channels[0];

    if(!this.isDmFreetxtEditModeEnable[this.currentSplitId]) {
      if(Array.isArray(this.channelsPayloadObj) && this.channelsPayloadObj.length !== 0) {
        this.channelsPayloadObj.push(this.finalDmPayloadData);
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
          var dmEditObj = this.channelSavedArray.find(x => x.promoSplitKey === this.currentSplitId);
          
        }
        this.promotionSplitHelper = JSON.parse(data.response.promotionSplitHelper);
          if(Object.keys(this.promotionSplitHelper).length > 0) {
            GlobalConstants.varArgs = this.promotionSplitHelper.splitsGroups[0].channels[0].varArgs.root.item;
          }
          if(dmEditObj !== undefined) {
            //GlobalConstants.mobilePushEditMode = true;
            //this.channelObj = JSON.parse(dmEditObj.templateText);
            this.updateSavedData(dmEditObj);
           }
           // else {
          //   this.setActiveTab('');
          // }
      }
    });
    this.setActiveTab('');
  }
  updateSavedData(editObj){
    let currtElements = this.dmContentElements.nativeElement;
    let includeChk = currtElements.getElementsByClassName('includeheadersChk')[0];
    //let columnHeaderVal = currtElements.getElementsByClassName('columnHeaderText')[0];
    let attributeContentVal = currtElements.getElementsByClassName('attribute')[0];
    if(includeChk !== undefined){
      includeChk.checked = true;
      this.isIncludeHeaders = true;
    }
    this.columnHerderVal = editObj.subjectLine;
    if(attributeContentVal !== undefined){
      attributeContentVal.innerHTML = JSON.parse(editObj.templateText);
      this.attributeInpVal = JSON.parse(editObj.templateText);
      //this.collectDraggedOffers(attributeContentVal,true);


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

    console.log(editObj);
  }
  }
}
