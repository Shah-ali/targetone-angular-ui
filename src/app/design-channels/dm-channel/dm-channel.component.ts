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
import { AppPage } from "../../../../e2e/src/app.po";
@Component({
  selector: 'app-dm-channel',
  templateUrl: './dm-channel.component.html',
  styleUrls: ['./dm-channel.component.scss']
})
export class DmChannelComponent implements OnInit {
  @ViewChild('includeOffersSection') includeOffersSection!: ElementRef;
  @ViewChild('offersTableDataSection') offersTableDataSection!: ElementRef;
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
  finalDmPayloadData: any;
  isDmEditModeEnable: any = {};
  channelSavedArray: any;
  editChannelDataObj: any;
  promotionSplitHelper: any;
  channelsPayloadObj: any;
  hasDmOffersEnable: any = 0;
  backropOffersEnable: boolean = false;
  offerDrawerSectionEnable: boolean = false;
  ngZone:any = NgZone;
  selectedPlaceHolderInput: any;
  collectData: any = [];
  showIngridData: any = {};
  recoofferArry: any = [];
  staticOfferArry: any = [];
  isIncludeOfferEnabled: boolean = false;
  tabActiveReco:any = 0;
  selectedRecoOffersToSubmit: any = [];
  offerTableDatafromReco: any;
  ObjectKeys = Object.keys;
  couponEnableOffer: boolean = false;
  couponEnableReco: any = 0;
  offersDataJson: any;
  recommedationsDataJson: any;
  savedOffersReccoObj:any = [];
  tempPublishArry: any = [];
  publishOffersArry: any = [];
  isInfoSectionAreaEnabled: boolean = false;
  constructor(private httpService: HttpService, private dataService: DataService, private shareService:SharedataService,
    private modalService:BsModalService, private loader:LoaderService,private translate:TranslateService, private ngzone: NgZone) { 
      AppConstants.OFFERS_ENABLE.MERGE_TAG = false;
      AppConstants.OFFERS_ENABLE.RECOMMENDATION_OFFERS = false;
      AppConstants.OFFERS_ENABLE.STATIC_OFFERS = true;
      this.shareService.currentSelectedChannelObj.subscribe((res:any) => {
        if(Object.keys(res).length > 0){
          this.currentSplitId = res.currentSplitId;
          this.promoKey = res.promotionKey;
          this.commChannelKey=res.commChannelKey;
          this.channelName = res.channelName;
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
      this.shareService.recomendationOffersToSubmit.subscribe((res:any) => {
        if(Object.keys(res).length > 0){
          if(this.selectedRecoOffersToSubmit.length > 0){
            this.selectedRecoOffersToSubmit.push(...res); // insert items add newly.
          }else{
            this.selectedRecoOffersToSubmit = res;
          }
        }
      });
      this.shareService.offerWithRecoParentToshowInTableObj.subscribe(res => {
        if(Object.keys(res).length > 0){
          this.offerTableDatafromReco = res;
          // this.showIngridData['staticoffer'] = res;
          // this.shareService.dmEditModeOffersSelected.next(this.showIngridData);
        }
      });
      

      setTimeout(() => {
        this.getVendorNameObj();
        this.recommendationOfferDataMethod();   
        this.setActiveTab('');      
      },500);
      
      
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
        this.loadEditModeData();
      }else{
  
      }
   }
  includeOffersMethod(evt){
    if(evt.target.checked){
      this.hasDmOffersEnable = 1;
      this.isIncludeOfferEnabled = true;   
    }else{
      if(this.selectedOffersToSubmit === undefined || this.selectedRecoOffersToSubmit === undefined){
            this.showIngridData['recooffer'] = [];
            this.showIngridData['staticoffer'] = [];
            this.recoofferArry = [];
            this.staticOfferArry = [];
      }else if(this.selectedOffersToSubmit.length >= 0 || this.selectedRecoOffersToSubmit.length >= 0){
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
            this.hasDmOffersEnable = 0;
            this.isIncludeOfferEnabled = false;
            this.selectedOffersToSubmit = [];
            this.selectedRecoOffersToSubmit = [];
            this.showIngridData['recooffer'] = [];
            this.showIngridData['staticoffer'] = [];
            this.recoofferArry = [];
            this.staticOfferArry = [];
          } else {
            // dont do anything
            evt.target.checked = true;
          }
        });
      }
      
    }
    //console.log(evt);
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
  ngOnInit(): void {
  }
  // final save
  finalSaveMethod(){
    let payloadJson = {
      channels: [{
        PromotionKey: this.promoKey,
        channelId: this.commChannelKey,
        failSafe: false,
        failsafeSelectedOffers: [],
        html: "",
        json: "",
        promoCommunicationKey: this.dbKey,
        promoSplitKey: this.currentSplitId,
        selectedOffers: this.selectedOffersToSubmit,
        selectedRecoWidgets: this.selectedRecoOffersToSubmit,
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
        uuid: "",
        hasDMOfferEnable:this.hasDmOffersEnable
      }]
    }
    this.finalDmPayloadData = payloadJson.channels[0];

    if(!this.isDmEditModeEnable[this.currentSplitId]) {
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
  loadEditModeData() {
    let url = AppConstants.API_END_POINTS.GET_SAVED_USAGE_TEMPLATES+`?promoKey=${GlobalConstants.promoKey}`;
    this.httpService.post(url).subscribe((data) => {
      if(data.status === 'SUCCESS') {
        if(data.response.adminCommTemplate.length > 0) {
          this.channelSavedArray = JSON.parse(data.response.adminCommTemplate);
          this.shareService.channelsPayloadObj.next(this.channelSavedArray);
          const inDmObj = this.channelSavedArray.find(x => x.promoSplitKey === this.currentSplitId);
          if(inDmObj !== undefined) {
            this.isDmEditModeEnable[this.currentSplitId] = true;
            this.editChannelDataObj = inDmObj;//JSON.parse(inDmObj.templateText);
          } else {
            this.setActiveTab('');
          }
          
        }
        if(data.response.mapPromoRuleDO.length > 0){
          let currObj = data.response.mapPromoRuleDO;
          currObj = data.response.mapPromoRuleDO.filter(x => x.splitKey === this.currentSplitId);
          currObj.forEach(obj => {
            if(obj !== undefined){
              this.tempPublishArry.push({  
                name:obj.ruleName, 
                key: obj.ruleKey,
                offerTemplateKey:obj.offerTemplateKey,
                widgetId:obj.widgetId,
                count: obj.recoCount,
                couponFlg: this.couponEnableReco,  
                recoType:obj.recoType,
                ruleTemplateKey:obj.ruleTemplateKey,
                type: "RO"
              });
            }          
          });          
          this.savedOffersReccoObj.push({    
            promotionKey: this.promoKey,
            splitKey: this.currentSplitId,
            commChannelKey: this.commChannelKey,
            item: this.tempPublishArry
          });
          this.shareService.recomendationOffersToSubmit.next(this.savedOffersReccoObj);
        }
        this.promotionSplitHelper = JSON.parse(data.response.promotionSplitHelper);
          if(Object.keys(this.promotionSplitHelper).length > 0) {
            GlobalConstants.varArgs = this.promotionSplitHelper.splitsGroups[0].channels[0].varArgs.root.item;
          }
          if(this.promotionSplitHelper.splitsGroups.length > 0){
           //const editObjJson =  this.promotionSplitHelper.splitsGroups.find(x => x.splitId === this.currentSplitId).channels;
            this.editDataShowOnLoad(this.promotionSplitHelper.splitsGroups);
          }          
      }
    });
  }
  editDataShowOnLoad(editobj){
    if(editobj !== undefined){
      const currEditObj = editobj.find(x => x.splitId === this.currentSplitId).channels[0];
      // include offers checked
      if(currEditObj.hasDmOfferEnable === 1){
        this.includeOffersSection.nativeElement.getElementsByClassName('includeOfferChk')[0].checked = true;
        this.hasDmOffersEnable = 1;
        this.isIncludeOfferEnabled = true;
      }
      //---- table data for reco and offers
     const offerSelectedObj =  currEditObj.selectedOffers.filter(x => x.ruleKey === 0);
     const recoFilteredObj =  [...new Map(currEditObj.selectedOffers.map(item =>
      [item['ruleKey'], item])).values()];
      let recoSelectedObj:any = recoFilteredObj.filter((y:any) => y.ruleKey !== 0);
      // const offerKey =  currEditObj.selectedOffers.find(x => x.ruleKey === 0).offerKey;
    if(currEditObj.selectedOffers.length > 0){ 
    setTimeout(() => {  
      if(offerSelectedObj.length > 0){
        offerSelectedObj.forEach(element => {
          if(element.offerKey > 0){
            const staticOffer:any ={};  
                  this.publishOffersArry.push({
                    offerKey: element.offerKey,
                    couponFlg: element.noTemplateCouponEnabled,        
                  });          
                  if(this.offersDataJson !== undefined){                
                    const offer_dt = this.offersDataJson.find(x => x.dbKey === element.offerKey);
                    if(offer_dt !== undefined){
                      staticOffer['offerTitle']= offer_dt.offerTitle;
                      staticOffer['offerDesc'] = offer_dt.offerDesc;
                      staticOffer['offerStDate'] = offer_dt.offerStDate;
                      staticOffer['offerEndDate'] = offer_dt.offerEndDate;
                      staticOffer['dbKey'] =  offer_dt.dbKey;
                      staticOffer['couponFlag'] = element.noTemplateCouponEnabled;
                    }
                    this.staticOfferArry.push(staticOffer);         
                    this.showIngridData['staticoffer']= this.staticOfferArry;
                    this.tabActiveReco = 0; // offer tab active.
                  }  
                }
                if(element.noTemplateCouponEnabled){
                  setTimeout(() => {
                    let chkEle = this.offersTableDataSection.nativeElement;
                    chkEle = chkEle.getElementsByClassName('offerCouponFlag_'+element.offerKey)[0];
                    chkEle.checked = true;
                  }, 1000);
                 }
         });
      }    
      
         if(this.savedOffersReccoObj !== undefined){
          if(this.savedOffersReccoObj[0].item.length > 0){
            this.savedOffersReccoObj[0].item.forEach((element,i) => {
                   //let couponVal = currEditObj.selectedOffers.filter(x => x.ruleKey === element.key)[0].noTemplateCouponEnabled;
                   if(recoSelectedObj !== undefined){
                    var couponFlg = 0;
                    if(recoSelectedObj[i].noTemplateCouponEnabled){
                      couponFlg = 1;
                    }else{
                      couponFlg = 0;
                    }
                   }else{
                    couponFlg = element.couponFlg;
                   }
                    const objx = 
                    {"dbKey":element.key,
                    "name":element.name,
                    'offerTemplateKey':'',
                    "type":'RO',
                    "count":element.count,
                    'recoType':'',
                    'couponFlag':couponFlg,
                    'ruleTemplateKey':element.ruleTemplateKey,
                    'widgetId':element.widgetId
                    }
                    
                    this.recoofferArry.push(objx);
                    this.showIngridData['recooffer']= this.recoofferArry;
            });
          }          
        }
         this.selectedOffersToSubmit = this.publishOffersArry;
        }, 1000);
      }

              
    }
    this.shareService.dmEditModeOffersSelected.next(this.showIngridData);
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
            this.collectData = [];
            this.collectData.push(each);
            const recoOffer = this.collectData.find(x => x.type === 'RO');
            //const staticOffer = this.collectData.find(x => x.type !== 'RO');
            if(recoOffer !== undefined){
              this.recoofferArry.push(recoOffer);
              this.showIngridData['recooffer']= this.recoofferArry;
            }else{
              this.tabActiveReco = 0; // offer tab active.
            }
            this.tabActiveReco = 1;
          }else{           
            const staticOffer:any ={};
              if(this.offerTableDatafromReco.length > 0){                
                const offer_dt = this.offerTableDatafromReco.find(x => x.dbKey === each.key);
                if(offer_dt !== undefined){
                staticOffer['offerTitle']= offer_dt.offerTitle;
                staticOffer['offerDesc'] = offer_dt.offerDesc;
                staticOffer['offerStDate'] = offer_dt.offerStDate;
                staticOffer['offerEndDate'] = offer_dt.offerEndDate;
                staticOffer['dbKey'] =  offer_dt.dbKey;
                this.staticOfferArry.push(staticOffer);         
                this.showIngridData['staticoffer']= this.staticOfferArry;
                this.tabActiveReco = 0; // offer tab active.
                }
              }            
              
          }
          
        })
        
      });
      
    }
    this.shareService.dmEditModeOffersSelected.next(this.showIngridData);
  }  
  switchRecoTab(id){
    this.tabActiveReco = id;
    if(this.tabActiveReco === 0){
      AppConstants.OFFERS_ENABLE.MERGE_TAG = false;      
      AppConstants.OFFERS_ENABLE.RECOMMENDATION_OFFERS = false;
      AppConstants.OFFERS_ENABLE.STATIC_OFFERS = true;      
    }else{
      AppConstants.OFFERS_ENABLE.MERGE_TAG = false;
      AppConstants.OFFERS_ENABLE.STATIC_OFFERS = false;
      AppConstants.OFFERS_ENABLE.RECOMMENDATION_OFFERS = true;
      if(Object.keys(this.showIngridData).length > 0){
        if(this.showIngridData['recooffer'].length > 0){
          this.showIngridData['recooffer'].forEach(element => {
             if(element.couponFlag){
                setTimeout(() => {
                  let chkEle = this.offersTableDataSection.nativeElement;
                  chkEle = chkEle.getElementsByClassName('recoCouponFlag_'+element.dbKey)[0];
                  chkEle.checked = true;
                }, 1000);
                }  
          });
        }
      }      
    }
  } 

  openOfferSliderPopup(){
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
  getCouponFlagReco(evt,key){
    if(evt.target.checked){
      this.couponEnableReco = 1;   
      if(Object.keys(this.selectedRecoOffersToSubmit).length > 0){
        const couponProp = this.selectedRecoOffersToSubmit[0].item.find(x => x.key === key);
        couponProp.couponFlg = this.couponEnableReco;
      }   
    }else{
      this.couponEnableReco = 0;
      if(Object.keys(this.selectedRecoOffersToSubmit).length > 0){
        const couponProp = this.selectedRecoOffersToSubmit[0].item.find(x => x.key === key);
        couponProp.couponFlg = this.couponEnableReco;
      }
    }
    
  }
  getCouponFlagOffers(evt,key){
    if(evt.target.checked){
      this.couponEnableOffer = true;    
      if(this.selectedOffersToSubmit.length > 0){
        const couponProp = this.selectedOffersToSubmit.find(x => x.offerKey === key);  
        couponProp.couponFlg = this.couponEnableOffer;
      }  
    }else{
      this.couponEnableOffer = false;
      if(this.selectedOffersToSubmit.length > 0){
        const couponProp = this.selectedOffersToSubmit.find(x => x.offerKey === key);  
        couponProp.couponFlg = this.couponEnableOffer;
      }
    }    
  }
  deleteOfferFromGrid(key){
    const index = this.selectedOffersToSubmit.findIndex(x => x.offerKey === key);
    this.selectedOffersToSubmit.splice(index,1);
    this.showIngridData['staticoffer'].splice(index,1);
  }
  deleteRecoOffersFromGrid(key){
    const index = this.selectedRecoOffersToSubmit[0].item.findIndex(x => x.key === key);
    this.selectedRecoOffersToSubmit[0].item.splice(index,1);
    this.showIngridData['recooffer'].splice(index,1);
  }

}
