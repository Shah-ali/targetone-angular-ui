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
  selector: 'app-facebook-channel',
  templateUrl: './facebook-channel.component.html',
  styleUrls: ['./facebook-channel.component.scss']
})
export class FacebookChannelComponent implements OnInit {
  @ViewChild('colValInputContent') colValInputContent!: ElementRef;   
  facebookTemplates: any;
  currentSplitId: any;
  commChannelKey: any;
  promoKey: any;
  currentObj: any;
  channelName: any;
  channelObj: any;
  isSaveAsTemplateEnable:boolean = false;
  isFacebookEditModeEnable: any = {};
  channelsPayloadObj: any;
  finalFacebookPayloadData:any;
  senderId: any;
  dbKey: any;
  venderDetails: any;
  senderDetails: any;
  venderDesc: any;
  facebookTableData: any = [];
  facebookColDataForSave: any;
  selectedfacebookTemplateId: any;
  submitSavedObj: any = {};
  constructor(private httpService: HttpService, private dataService: DataService, private shareService:SharedataService,
    private modalService:BsModalService, private loader:LoaderService,private translate:TranslateService, private ngzone: NgZone) { 
      AppConstants.OFFERS_ENABLE.MERGE_TAG = false;
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
      setTimeout(() => {
        this.loadSmsTemplates();
        this.getVendorNameObj();
      },500);      
     }
  async loadSmsTemplates(){
    const resultObj = await this.httpService.post(AppConstants.API_END_POINTS.GET_SMS_FACEBOOK_TEMPLATES+this.commChannelKey).toPromise();
    if(resultObj.status == 'SUCCESS'){
      console.log(resultObj.response);
      this.facebookTemplates = JSON.parse(resultObj.response.templates);  
      let tempCol = JSON.parse(this.facebookTemplates[0].templateText);
      this.selectedfacebookTemplateId = this.facebookTemplates[0].dbKey;
      this.facebookColDataForSave = tempCol.structure.col;
      this.setActiveTab();
      this.eachColRepeatEdit(tempCol.structure.col);
    }
    
   }
   eachColRepeatEdit(objArry){
    this.facebookTableData = [];
    objArry.map((each:any,i) => {
      let obj =  {id:i,colname:each.header,colvalue:each.value,order:i,editable:each.editable};
      this.facebookTableData.push(obj); // noof rows for UI rendering
      setTimeout(() => {
        let colInpVal = this.colValInputContent.nativeElement.getElementsByClassName('colVal_'+i)[0];
        colInpVal.innerHTML = each.value;
      },700);        
    });
  }
   getSelectedfacebookTemplateData(evt){
    let dbkeyTemp = evt.target.value;      
      let objTemp = this.facebookTemplates.find(x => x.dbKey == dbkeyTemp);
      let tempObj = JSON.parse(objTemp.templateText);
      this.selectedfacebookTemplateId = objTemp.dbKey;
      if(this.facebookTemplates !== undefined){        
        this.eachColRepeatEdit(tempObj.structure.col);        
      }          
   }
   
   setActiveTab(): void {
    if(this.currentSplitId !== undefined){
      const setAct = this.channelObj.findIndex(x => x.promoSplitId === this.currentSplitId);
      this.shareService.setActiveChannelTab.next(setAct);
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
        //this.getoffersDataObj("");
      });
    }
  }
  ngOnInit(): void {
  }
  checkColumnValuesArePresent(){
    let saveTemp = {
      "saveTemp": true,
      "editable": true,
      "structure": {
          "encloserSepEnable": false,
          "type": null,
          "maxCol": 5,
          "minCol": 1,
          "includeHeaders": false,
          "col": this.facebookColDataForSave
      },
      "headerEditable": false,
      "includeHeaderEnable": true,
     // "templateName":this.selectedColumnarTemplate,
  }
  this.submitSavedObj = saveTemp;
    return true;
  }
    // final save
    finalSaveMethod(){   
      let callSaveMethod = this.checkColumnValuesArePresent();
      if(!callSaveMethod){
        return;
      }else{
      //let resObj = this.checkColumnValuesArePresent();
      //if(resObj){ 
        //let savedJSon = this.saveAsTemplate();
      let payloadJson = {
        channels: [{
          PromotionKey: this.promoKey,
          channelId: this.commChannelKey,
          failSafe: false,
          failsafeSelectedOffers: [],
          html: JSON.stringify(this.submitSavedObj),
          json: JSON.stringify(this.submitSavedObj),
          promoCommunicationKey: this.dbKey,
          promoSplitKey: this.currentSplitId,
          selectedOffers: null,
          selectedRecoWidgets:null,
          subjectObj: null,
          preHeader: "",
          senderConfigKey: this.senderId,
          senderId: this.senderDetails,
          senderName: this.senderDetails,
          subject: "",
          vendorDesc: this.venderDesc,
          vendorId: this.senderId,
          templateKey: this.selectedfacebookTemplateId,
          thumbnailImage: "",
          title: "",
          uuid: "",
          //hasDMOfferEnable:this.hasDmOffersEnable
        }]
      }
      this.finalFacebookPayloadData = payloadJson.channels[0];
  
      if(!this.isFacebookEditModeEnable[this.currentSplitId]) {
        if(Array.isArray(this.channelsPayloadObj) && this.channelsPayloadObj.length !== 0) {
          this.channelsPayloadObj.push(this.finalFacebookPayloadData);
        } else {
          this.shareService.channelsPayloadObj.next(payloadJson.channels);
        }
      }
  
      const url = AppConstants.API_END_POINTS.SAVE_ADMIN_PEOMO_TEMPLATE_USAGE;
      this.httpService.post(url, payloadJson).subscribe((data) => {
        this.dataService.SwalSuccessMsg(data.message);
      });
      //}
    }
  
    }
}
