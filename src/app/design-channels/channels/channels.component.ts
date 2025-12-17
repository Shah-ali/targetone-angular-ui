import { Component, OnInit, Output, Input, EventEmitter,TemplateRef,NgZone} from '@angular/core';
import { AppConstants } from '@app/app.constants';
import { HttpService } from '@app/core/services/http.service';
import { SharedataService } from '@app/core/services/sharedata.service';
import Swal from 'sweetalert2';
import { environment } from '@env/environment';
import { GlobalConstants } from '../common/globalConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '@app/core/services/data.service';


@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})

export class ChannelsComponent implements OnInit {
 @Output() loadFreshTemplate = new EventEmitter<any>();  
 @Output() loadSavedTemplate = new EventEmitter<any>();  
 channelObj:any;
 designForChannels:string = '';
 promotionKey:any;
 commChannelKey:any;
 isChannelTabs:boolean = true;
 isPreview:boolean = false;
 isPayload:boolean = false;
  payloadSavingJson: any;
  currentSplitId:any;
 ispromoExecutedOrRunning:boolean = false;
 setActive:number = GlobalConstants.setActiveTab;
  private BASE_URL = environment.BASE_URL;
  vendorObj: any;
  vendorDataObj: any = [];
  editModeData: any;
  isTemplateEditMode: boolean = false;
  currentEmailObj:any;
  myParam: any;
  previousSplitId: any;
  isTemplateLibraryMode:boolean = false;
  CHANNEL_INFO_HTML = AppConstants.CHANNEL_INFO;
  tabsLocked = false;

  constructor(private http:HttpService, private shareService: SharedataService, private route: ActivatedRoute, private router: Router,private ngZone: NgZone, private translate: TranslateService, private dataService: DataService) {
   this.designForChannels = this.translate.instant('designEditor.beeEditorComponent.designforLbl');
   this.shareService.promoKeyObj.subscribe(res => {
    this.promotionKey = res;
    
   });
   //this.getPromoUsageTemplateObj();
   //this.getMapPromoChannelObj();
   //this.getpromoChannelObj();
   //this.getVendorNameObj();
   this.shareService.templateLibrary.subscribe(res => {
    this.isTemplateLibraryMode = res;
   });
   this.shareService.ispromoExecutedOrRunning.subscribe(res => {
    this.ispromoExecutedOrRunning=res; // get flag true or false status if Running or incomplted state
   });
   this.shareService.channelObj.subscribe(res => {
    this.channelObj = res;     
   });
  
   this.shareService.vendorObj.subscribe(res => {
    this.vendorObj = res;
   });
   this.shareService.setActiveChannelTab.subscribe(res => {
     this.setActive = res;
   })
   this.shareService.channelTabsLocked$.subscribe(locked => {
    this.tabsLocked = locked;
   });
  this.getPayLoadJson();
  if(Object.keys(this.channelObj).length > 0){      
    if(!this.isTemplateEditMode){
      this.getEmailObj(this.channelObj[GlobalConstants.setActiveTab],this.setActive);
    }      
  }   
  
  }

  ngOnInit(): void {
        
  }
  async getPromoUsageTemplateObj(){
    let url = AppConstants.API_END_POINTS.GET_SAVED_USAGE_TEMPLATES+`?promoKey=${GlobalConstants.promoKey}`;
    const data = await this.http.post(url).toPromise();
      if(data.status == "SUCCESS" ){
        if(data.response == ""){
          //this.isTemplateEditMode = false;
        }else{         
          if(Object.keys(data.response.adminCommTemplate).length > 0){
            this.isTemplateEditMode = true; 
            this.editModeData = JSON.parse(data.response.adminCommTemplate); 
            this.payloadSavingJson = this.editModeData;   
            console.log(this.editModeData);  
          }            
      }
  }else{
    this.dataService.SwalAlertMgs(data.status);
  }
}
  getPayLoadJson(){
    this.shareService.channelsPayloadObj.subscribe(res => {
      if(Object.keys(res).length > 0){
        this.payloadSavingJson = res;
        this.isPayload = true;
        this.isTemplateEditMode = true;        
        //this.shareService.activeSplitId.subscribe(id => {this.setActive = id});
        //this.multiChannelSavedData(this.payloadSavingJson);
      }     
    });    
  }
  
  loadNewChannel(currentObj,indx){
    if(currentObj.promoExecutedOrRunning){
      this.shareService.showEditButton$.next(true);      
      this.shareService.showViewButton$.next(true);
      this.dataService.setViewPublish(undefined);
      this.dataService.setEditPublish(undefined);
    }
    this.currentObjOnTabClick(currentObj);
    if(this.setActive != indx){
      this.shareService.setActiveChannelTab.next(indx);
      // lock tabs AFTER user has clicked
      this.tabsLocked = true;
      this.setActive = indx;   
      GlobalConstants.setActiveTab = indx; //First Tab active by default     
      this.shareService.showMergedTagCopyIcon.next(false); 
      if(currentObj.channelType === AppConstants.CHANNEL_INFO.CHANNEL_TYPE.EMAIL && !currentObj.promoExecutedOrRunning) {
        if(this.payloadSavingJson !== undefined){
          const eachChannl = this.payloadSavingJson.find(x => x.promoSplitKey == this.currentSplitId);
          if(eachChannl === undefined){
            GlobalConstants.isEditMode = false;
          }
         }
        this.router.navigateByUrl('/',{skipLocationChange:true}).then(() =>{
          this.router.navigate(['/email-templates']);  
        });
      } else if(currentObj.channelType === AppConstants.CHANNEL_INFO.CHANNEL_TYPE.EMAIL && currentObj.promoExecutedOrRunning){
        this.router.navigateByUrl('/',{skipLocationChange:true}).then(() =>{
          this.router.navigate(['/trigger-analytics']);  
        });
      } else if(currentObj.channelType === AppConstants.CHANNEL_INFO.CHANNEL_TYPE.PUSH_NOTIFICATION){
        this.router.navigateByUrl('/',{skipLocationChange:true}).then(() =>{
          this.router.navigate(['/mobile-push']);  
        });              
      } else if(currentObj.channelType === AppConstants.CHANNEL_INFO.CHANNEL_TYPE.WEB_PUSH) {
        this.router.navigateByUrl('/',{skipLocationChange:true}).then(() =>{
          this.router.navigate(['/web-push']);
        });
      }else if(currentObj.channelType === AppConstants.CHANNEL_INFO.CHANNEL_TYPE.INAPP_NOTIFICATION){
        this.router.navigateByUrl('/',{skipLocationChange:true}).then(() =>{
          this.router.navigate(['/inapp-channel']);  
        });              
      }else if(currentObj.channelType === AppConstants.CHANNEL_INFO.CHANNEL_TYPE.DM_CHANNEL && currentObj.dmType == '3'){
        //------------- DM Multi offer -------------
        this.router.navigateByUrl('/',{skipLocationChange:true}).then(() =>{
          this.router.navigate(['/dm-channel']);  
        });              
      }else if(currentObj.channelType === AppConstants.CHANNEL_INFO.CHANNEL_TYPE.DM_CHANNEL && currentObj.dmType == '1'){
        //------------- DM Free Text -------------
        this.router.navigateByUrl('/',{skipLocationChange:true}).then(() =>{
          this.router.navigate(['/dm-free-text']);  
        });              
      } else if(currentObj.channelType === AppConstants.CHANNEL_INFO.CHANNEL_TYPE.DM_CHANNEL && currentObj.dmType == '2'){
        //------------- DM Columnar channel -------------
        this.router.navigateByUrl('/',{skipLocationChange:true}).then(() =>{
          this.router.navigate(['/dm-columnar']);  
        });              
      }
       else if(currentObj.channelType === AppConstants.CHANNEL_INFO.CHANNEL_TYPE.SMS_CHANNEL){
        //-------------SMS channel-------------
        this.router.navigateByUrl('/',{skipLocationChange:true}).then(() =>{
          this.router.navigate(['/sms-channel']);  
        });              
      }else if(currentObj.channelType === AppConstants.CHANNEL_INFO.CHANNEL_TYPE.FACEBOOK_CHANNEL){
        //------------ Facebook channel -----------
        this.router.navigateByUrl('/',{skipLocationChange:true}).then(() =>{
          this.router.navigate(['/facebook-channel']);  
        });   
      }else if(currentObj.channelType === AppConstants.CHANNEL_INFO.CHANNEL_TYPE.API_CHANNEL){
        //------------ API channel -----------
        this.router.navigateByUrl('/',{skipLocationChange:true}).then(() =>{
          this.router.navigate(['/api-channel']);  
        });   
      }else if(currentObj.channelType === AppConstants.CHANNEL_INFO.CHANNEL_TYPE.WHATS_APP_CHANNEL){
        //------------ WhatsApp channel -----------
        this.router.navigateByUrl('/',{skipLocationChange:true}).then(() =>{
          this.router.navigate(['/whats-app-channel']);  
        });   
      }
      
    }
  }
  
  getEmailObj(currentObj,indx){ // Create mode
    this.currentObjOnTabClick(currentObj);
      if(currentObj.channelType === AppConstants.CHANNEL_INFO.CHANNEL_TYPE.EMAIL) {
        this.multiChannelSavedData(currentObj);
      } else {
        // if (currentObj.channelType === AppConstants.CHANNEL_INFO.CHANNEL_TYPE.PUSH_NOTIFICATION) {
        //   this.setActiveTab();
        // } else if(currentObj.channelType === AppConstants.CHANNEL_INFO.CHANNEL_TYPE.WEB_PUSH) {
        //   this.setActiveTab();
        // }
        this.setActiveTab();
      }
      this.previousSplitId = this.currentSplitId;
  }
  
  currentObjOnTabClick(currentObj){
    let obj = {
      "currentSplitId": currentObj.promoSplitId,
      "promotionKey": currentObj.promotionKey,
      "commChannelKey":currentObj.commChannelKey,
      "senderConfigKey":currentObj.senderId,
      "currentPromoCommKey":currentObj.dbKey,
      "channelName":currentObj.channelName,
      "payloadChannels":this.payloadSavingJson,
      "companyKey":currentObj.companyKey,
      "channelType":currentObj.channelType,
      'currentObj':currentObj
    }
    this.commChannelKey = currentObj.commChannelKey;
    this.currentSplitId = currentObj.promoSplitId;    
    this.shareService.currentSelectedChannelObj.next(obj);    
    this.currentEmailObj = currentObj; 
  }
  
  // Mobile Push Notification
  setActiveTab(): void {
    if(this.currentSplitId !== undefined){
      const setAct = this.channelObj.findIndex(x => x.promoSplitId === this.currentSplitId);
      this.setActive = setAct;
      GlobalConstants.setActiveTab = setAct;  
    }    
  }

    multiChannelSavedData(currtObj){ 
      const setAct = this.channelObj.findIndex(x => x.promoSplitId == this.currentSplitId);     
      if(typeof(this.payloadSavingJson) != 'undefined'){
        if(typeof(this.payloadSavingJson.channels) != 'undefined'){
          var payloadJson = this.payloadSavingJson.channels;
        }else{
          var payloadJson = this.payloadSavingJson;
        }       
      }else{
        this.setActive = setAct;
        this.refreshChannel(currtObj);
      }
      if(this.isTemplateEditMode && Object.keys(payloadJson).length > 0){
        const objSaved = payloadJson.find(x => x.promoSplitKey == this.currentEmailObj.promoSplitId);
        if(objSaved === undefined){
          this.refreshChannel(objSaved);
        }else{
          this.loadSavedTemplate.emit(payloadJson);
        }        
      }
    }
    refreshChannel(objSaved){
      //if(typeof(objSaved) == 'undefined'){
        this.ngZone.run(() => {
          this.loadFreshTemplate.emit(false);
         });        
      //}
    }
    
   // Final save
   async finalizeChannels(){    
    let url = AppConstants.API_END_POINTS.GET_SAVED_USAGE_TEMPLATES+`?promoKey=${GlobalConstants.promoKey}`;
    const data = await this.http.post(url).toPromise();
      if(data.status == "SUCCESS" ){
        if(data.response == ""){
          //this.isTemplateEditMode = false;
        }else{         
          if(Object.keys(data.response.adminCommTemplate).length > 0){
            //this.isTemplateEditMode = true; 
            this.editModeData = JSON.parse(data.response.adminCommTemplate); 
            this.payloadSavingJson = this.editModeData;   
            //console.log(this.editModeData);  
            this.redirectToFinalizePage();
          }            
      }
      }else{
        this.dataService.SwalAlertMgs(data.status);
      }
   
  }
  async redirectToFinalizePage(){
    const endpoint = `/triggerPromo/saveFinalize?promoKey=${this.promotionKey.promoKey}`
      //const payload = this.payloadSavingJson;
     // const payloadnew = GlobalConstants.payLoadSavedObjAllChannels;
      //const finalSaveObj = GlobalConstants.finalizeChannelsObj;
      if(Object.keys(this.payloadSavingJson).length > 0){
        const savedChannelObj = this.payloadSavingJson.length;
        if(savedChannelObj === this.channelObj.length){     
        const resultObj = await this.http.post(endpoint).toPromise();
        if(resultObj.status == "SUCCESS"){
          window.open(`${this.BASE_URL}/triggerPromo/triggerFinalize?promotionKey=${this.promotionKey.promoKey}`, '_parent');
          console.log(resultObj.response);
        }else{
          this.dataService.SwalAlertMgs(resultObj.response);
        }
      }else{
        this.dataService.SwalAlertMgs(this.translate.instant('designEditor.channels.pleaseSaveAllTheChannelsbeforefinalizingAlertMsgLbl'))
      }      
      }
  }
}
