import { Component, OnInit,Output,EventEmitter, Input } from '@angular/core';
import { HttpService } from '@app/core/services/http.service';
import { LoaderService } from '@app/core/services/loader.service';
import { SharedataService } from '@app/core/services/sharedata.service';
import { GlobalConstants } from '../common/globalConstants';
import { AppConstants } from '@app/app.constants';
import BeefreeSDK from '@beefree.io/sdk';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-failsafe',
  templateUrl: './failsafe.component.html',
  styleUrls: ['./failsafe.component.scss']
})
export class FailsafeComponent implements OnInit {
  @Output() callBeeInstance = new EventEmitter<any>();
  @Output() callBeeInstanceWhenTabSwitch = new EventEmitter<any>();
  @Output() saveAsTemplate = new EventEmitter<any>();
  @Output() updatePreviewObj = new EventEmitter<any>();
  @Output() updateBeeEditorTempObj= new EventEmitter<any>();  
  @Input() currentchannelName;
  channelObj:any;
  isPreview:boolean=true;
  ispromoExecutedOrRunning:boolean=false;
  channelName:string="";
  commChannelKey: any;
  currentSplitId: any;
  promotionKey: any;
  vendorObj: any;
  isDefaultStorageBee: any;
  setActive:any = 0;
  isFailSafeEnable:boolean = false;
  subjectObj: any;
  payloadObj: any;
  isFailSafeTabActive: boolean = false; 
  currentObj: any;
  isTemplateEditMode: boolean = false;
  isTemplateLibraryMode:boolean =false;
  constructor(private shareService: SharedataService, private loader: LoaderService, private http: HttpService,private translate: TranslateService) { 
    this.shareService.templateLibrary.subscribe(res => {
      this.isTemplateLibraryMode = res;
    });
    this.getcurrentObj();
    if(!this.isTemplateLibraryMode){
      this.getSavedTemplatePromo();
    }    
    this.isPreview = GlobalConstants.isPreviewMode; 
    this.vendorObj = GlobalConstants.vendorObj;
      this.channelObj = GlobalConstants.channelObj;
      //let objindex = this.channelObj.findIndex(x => x.promoSplitId === this.currentSplitId);
      // if(Object.keys(this.channelObj).length > 0){
      //   this.channelName = this.channelObj[objindex].channelName;
      // }  
      
      //this.shareService.failSafeEnable.next(this.isFailSafeEnable);
      shareService.subjectObj.subscribe(res => {
                this.subjectObj = res;
       });
       shareService.failSafeObj.subscribe(res => {
                this.payloadObj = res;
              });
      this.shareService.isDefaultStorageBee.subscribe(res => {
        this.isDefaultStorageBee = res;
      });    
      shareService.ispromoExecutedOrRunning.subscribe(res => {
        this.ispromoExecutedOrRunning =res;
      });
      this.shareService.failSafeEnable.subscribe(res => {
        this.isFailSafeEnable = res;
      });
    //  this.shareService.isEditMode.subscribe(res => {
    //   this.isTemplateEditMode = res;
    //  });
   }

  ngOnInit(): void {
  }
  async getSavedTemplatePromo(){  
        let url = AppConstants.API_END_POINTS.GET_SAVED_USAGE_TEMPLATES+`?promoKey=${GlobalConstants.promoKey}`;
        const data = await this.http.post(url).toPromise();
       // this.http.post(url).subscribe(data => {
          if(data.status == "SUCCESS" ){
            if(data.response.adminCommTemplate !== ""){
              this.payloadObj = JSON.parse(data.response.adminCommTemplate);
              this.currentObj = this.payloadObj.find(x => x.promoSplitKey == this.currentSplitId);
              if(this.currentObj !== undefined){
                this.isTemplateEditMode = true;
                this.isFailSafeEnable = this.currentObj.failSafe;
                this.shareService.failSafeEnable.next(this.currentObj.failSafe);
                this.shareService.isTemperarySave.next(true);
                this.shareService.failSafeCurrentTab.next(0);
              }
              //this.isTemplateEditMode = true; 
            }
          }
        }
      setFailSafeDetails(index,isfailsafeActive,previousTabId){
        this.loader.ShowLoader();
        if(!this.isPreview){
          // if(this.subjectObj !== undefined){
          //    if(this.subjectObj.subject == ""){
          //     Swal.fire('Subject cannot be Empty');
          //     return;
          //   }
          // }          
          // if(this.currentObj === undefined){
          //   this.onsave();
          // }
          this.shareService.failSafeCurrentTab.next(index);
          this.shareService.failSafePreviousTab.next(previousTabId);
          this.shareService.isTemperarySave.next(true);
          this.setActive = index;
          this.isFailSafeTabActive = isfailsafeActive;
          this.shareService.failSafeTabActive.next(isfailsafeActive);
          //if(this.currentObj.failSafe && GlobalConstants.isEditMode){
            if(this.isFailSafeTabActive){
              // normal channel data
              if(this.isTemplateEditMode && (this.currentObj !== undefined && this.currentObj.failSafe)){
                if(this.currentObj.subjectLine !== this.subjectObj.subject){
                  this.onTabSwitch();
                }else{                  
                  const subjObj = this.updateSubjectObj(this.currentObj);
                  // this.shareService.subjectObj.next(subjObj);
                  subjObj.preHeader = this.currentObj.failSafePreHeader;
                  subjObj.subject = this.currentObj.failSafeSubjectLine;
                  this.shareService.subjectNpreheaderInputValueFailsafe.next(subjObj);
                  this.shareService.updateSubjectPreheader.next(subjObj);
                  const tempObj = JSON.parse(this.currentObj.failSafeActualTemplateText);
                  this.updateBeeEditorTempObj.emit(tempObj);
                  this.onTabSwitch();
                }                
              }else{
                this.onTabSwitch();
              }             
            }else{
              // failsafe channel data
              if(this.isTemplateEditMode && (this.currentObj !== undefined && this.currentObj.failSafe)){
                if(this.currentObj.subjectLine !== this.subjectObj.subject || this.currentObj.preHeader !== this.subjectObj.preHeader){
                  this.onTabSwitch();
                }else{
                  const failsafeTabInputDataNew = this.updateSubjectObjFailsafe(this.currentObj);
                  this.shareService.failSafSubjectObj.next(failsafeTabInputDataNew);
                  const subjObj = this.updateSubjectObj(this.currentObj);
                  this.shareService.subjectNpreheaderInputValue.next(subjObj);
                  this.shareService.updateSubjectPreheader.next(subjObj);
                  const tempObj = JSON.parse(this.currentObj.actualTemplateText);
                  this.updateBeeEditorTempObj.emit(tempObj);
                  this.onTabSwitch();
                }                
              }else{
                // const subjObj = this.updateSubjectObj(this.currentObj);
                // this.shareService.updateSubjectPreheader.next(subjObj);
                this.onTabSwitch();
              }           
            }
         // }
          
        }
        else{
          // normal channel
          this.shareService.failSafeCurrentTab.next(index);
          this.shareService.failSafePreviousTab.next(previousTabId);
          this.shareService.isTemperarySave.next(true);
          this.setActive = index;
          this.isFailSafeTabActive = isfailsafeActive;
          this.shareService.failSafeTabActive.next(isfailsafeActive);
          if(this.currentObj !== undefined){
            this.updatePreviewObj.emit(this.payloadObj);
          }
        }
      }
      updateSubjectObj(jsonObj){    
        let subjectObj = {
          "senderConfigKey":jsonObj.senderKey,
          "senderId":jsonObj.senderId,"senderName":jsonObj.senderName,
          "subject":jsonObj.subjectLine,"preHeader":jsonObj.preHeader,"vendorDesc":jsonObj.vendorDesc,"vendorId":jsonObj.senderKey
        }    
        return subjectObj;
      }
      updateSubjectObjFailsafe(jsonObj){    
        let subjectObjFailsafe = {
          "senderConfigKey":jsonObj.senderKey,
          "senderId":jsonObj.senderId,"senderName":jsonObj.senderName,
          "subject":jsonObj.failSafeSubjectLine,"preHeader":jsonObj.failSafePreHeader,"vendorDesc":jsonObj.vendorDesc,"vendorId":jsonObj.senderKey
        }    
        return subjectObjFailsafe;

      }
  getcurrentObj(){
    this.shareService.currentSelectedChannelObj.subscribe((resObj:any) => {
      this.commChannelKey = resObj.commChannelKey;
      this.promotionKey = resObj.promotionKey;
      this.currentSplitId = resObj.currentSplitId;
      this.channelName = resObj.channelName;
      //this.payloadObj = resObj.payloadChannels;
    });
  }
  getPreviousObjs(){
    GlobalConstants.vendorObj = this.vendorObj;
    GlobalConstants.channelObj = this.channelObj;
  }
  onsave(){
    this.loader.ShowLoader();
    const beeInstance = new BeefreeSDK();
    GlobalConstants.actionsPreviewEnable = false;
    //this.shareService.subjectObj.next(this.subjectObj);
    this.callBeeInstance.emit(beeInstance);
  }
  onTabSwitch(){    
    //this.loader.HideLoader();
    const beeInstance = new BeefreeSDK(); 
    this.callBeeInstanceWhenTabSwitch.emit(beeInstance);    
  }
  onsaveMyTemplate(isSaveAsTemplate){
    this.loader.ShowLoader();
    this.saveAsTemplate.emit(isSaveAsTemplate);
  }
  enableFailSafe(event){
    if(event.target.checked){
      this.isFailSafeEnable = true;
      //this.setActive = 1;
      this.shareService.failSafeEnable.next(true);
    }else{      
      if(this.currentObj !== undefined){
        this.confirmAlert();
      }else{
        this.isFailSafeEnable = false;
       // this.setActive = 0;
        this.shareService.failSafeEnable.next(false);
        // const subjObj = this.updateSubjectObj(this.currentObj);
        // this.shareService.updateSubjectPreheader.next(subjObj);
        // const tempObj = JSON.parse(this.currentObj.actualTemplateText);
        // this.updateBeeEditorTempObj.emit(tempObj);
      }
    }
  }
  confirmAlert(){
    Swal.fire({
      title: this.translate.instant('designEditor.failsafePage.confirmationMgs.savedDatawillbeLostMgslbl'),
      //text: 'Your saved data will be lost!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('designEditor.yesBtn'),
      cancelButtonText: this.translate.instant('designEditor.cancelBtn'),
      allowOutsideClick:false,
      allowEscapeKey:false,
    }).then((result) => {
      if (result.value) {
        this.isFailSafeEnable = false;
        this.setActive = 0;
        this.shareService.failSafeTabActive.next(false);
        this.shareService.failSafeCurrentTab.next(0);
        const subjObj = this.updateSubjectObj(this.currentObj);
        this.shareService.updateSubjectPreheader.next(subjObj);
        const tempObj = JSON.parse(this.currentObj.actualTemplateText);
        this.updateBeeEditorTempObj.emit(tempObj);
        this.shareService.failSafeEnable.next(false);
      }else{
        this.isFailSafeEnable = true;
      }
    })
  }
}
