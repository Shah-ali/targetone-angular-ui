import { Component, OnInit,Output,EventEmitter, Input } from '@angular/core';
import { HttpService } from '@app/core/services/http.service';
import { LoaderService } from '@app/core/services/loader.service';
import { SharedataService } from '@app/core/services/sharedata.service';
import { GlobalConstants } from '@app/design-channels/common/globalConstants';
import { AppConstants } from '@app/app.constants';
import BeefreeSDK from '@beefree.io/sdk';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@env/environment';
import { HttpParams } from '@angular/common/http';
import emptyJson from '../../../assets/JSON/emptyEmail.json';
import { DataService } from '@app/core/services/data.service';
@Component({
  selector: 'app-tag-failsafe',
  templateUrl: './tag-failsafe.component.html',
  styleUrls: ['./tag-failsafe.component.scss']
})
export class TagFailsafeComponent implements OnInit {
  @Output() callBeeInstancePersonalized = new EventEmitter<any>();
  @Output() callBeeInstanceWhenTabSwitch = new EventEmitter<any>();
  @Output() saveAsTemplate = new EventEmitter<any>();
  @Output() updatePreviewObj = new EventEmitter<any>();
  @Output() updateBeeEditorTempObj= new EventEmitter<any>();  
  @Input() currentchannelName;
  channelObj:any;
  isPreview:boolean=true;
  ispromoExecutedOrRunning:boolean=false;
  channelName:string="";//this.translate.instant('personalizationTagsComponent.tabNameUndefinedLbl');
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
  navigateToPage: any;
  beeInstance = new BeefreeSDK();
  private BASE_URL = environment.BASE_URL;
  isPersonalizedPublishEnable: boolean = false;
  tagKey: any;
  tagParamsArryObj: any = [];
  pTagNameSaveNpublish: any;
  @Input() isPublishedPersonalization: boolean = false; //= localStorage.getItem('isViewPersonalizationEnable');
  isSavedAsQA: boolean = false;
  @Input() ngCloak: boolean = false;
  isAssignedPriviledgeObj: any;
  tenentPriviledgeEditDisabled: any;
  constructor(private shareService: SharedataService, private loader: LoaderService, private http: HttpService, private translate: TranslateService, private dataService:DataService) { 
    // this.shareService.templateLibrary.subscribe(res => {
    //   this.isTemplateLibraryMode = res;
    // });
    this.shareService.assignedPriviledgeEnableForTenents.subscribe((res) => {
      if(res !== undefined){
        this.isAssignedPriviledgeObj = res; 
        if(!this.isAssignedPriviledgeObj.ptagedit){
          this.tenentPriviledgeEditDisabled = !this.isAssignedPriviledgeObj.ptagedit; // when edit is false, disabled true
        // }else if((this.isAssignedPriviledgeObj.ptagview &&  !this.isAssignedPriviledgeObj.ptagedit)|| (!this.isAssignedPriviledgeObj.ptagview && !this.isAssignedPriviledgeObj.ptagedit)){
        //   this.tenentPriviledgeEditDisabled = true; // when view is true/ false, disabled true
        // }
        }else{
          this.tenentPriviledgeEditDisabled = !this.isAssignedPriviledgeObj.ptagedit; // when edit is true, disabled false
        }
      }
    });
    this.shareService.isPublishEnabledForPersonalization.subscribe((res) => {
      if(res !== undefined){
        this.isPublishedPersonalization = res; 
      }
    });
    this.shareService.setNavigationCodeForPersonalizedTag.subscribe((res:any) => {
      if(res !== undefined){
        this.navigateToPage = res;
      }
    });
    this.shareService.tagParametersObjArry.subscribe((res:any) => {
      if(res !== undefined || res !== ""){
        this.tagParamsArryObj = res; 
      }
    });

    this.shareService.onSavedTypePersonalization.subscribe((res) => {
      if(res == 'QA'){
        this.isSavedAsQA = true; 
      }
    });

    //this.getcurrentObj();
    // if(!this.isTemplateLibraryMode){
    //   this.getSavedTemplatePromo();
    // }    
    // this.isPreview = GlobalConstants.isPreviewMode; 
    // this.vendorObj = GlobalConstants.vendorObj;
    //   this.channelObj = GlobalConstants.channelObj;
      //let objindex = this.channelObj.findIndex(x => x.promoSplitId === this.currentSplitId);
      // if(Object.keys(this.channelObj).length > 0){
      //   this.channelName = this.channelObj[objindex].channelName;
      // }  
      
      //this.shareService.failSafeEnable.next(this.isFailSafeEnable);
      // shareService.subjectObj.subscribe(res => {
      //           this.subjectObj = res;
      //  });
      //  shareService.failSafeObj.subscribe(res => {
      //           this.payloadObj = res;
      //         });
      // this.shareService.isDefaultStorageBee.subscribe(res => {
      //   this.isDefaultStorageBee = res;
      // });    
      // shareService.ispromoExecutedOrRunning.subscribe(res => {
      //   this.ispromoExecutedOrRunning =res;
      // });
      // this.shareService.failSafeEnable.subscribe(res => {
      //   this.isFailSafeEnable = res;
      // });
    //  this.shareService.isEditMode.subscribe(res => {
    //   this.isTemplateEditMode = res;
    //  });
    this.getTagKey();
   }
   getTagKey() {
    let tagKeyStored:any = this.dataService.activeContentTagKey;//localStorage.getItem("tagKeyPersonalization");
    this.tagKey = JSON.parse(tagKeyStored);
    this.getSavedTemplatePromo();
    //let sessStore = sessionStorage.getItem("tagKeyPersonalization");
    //console.log(this.tagKey+" / "+sessStore);
  }
  ngOnInit(): void {
  }
  redirectToSimulatePersonalized(isSaveAndNext){
    // Validation for tag parametes
    if(Object.keys(this.tagParamsArryObj).length === 0){
      Swal.fire({
        title: 'Please define tag paramete values to simulate further.',
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: this.translate.instant('designEditor.okBtn'),
      });
      return;
    }
    this.isPersonalizedPublishEnable = isSaveAndNext;
    this.shareService.onPublishEnableForPersonalization.next(isSaveAndNext);
    this.onsave(this.isPersonalizedPublishEnable, '');
    //window.parent.location.href = this.BASE_URL+'/personalizationTags/simulatePersonalization';
  }
  reloadToMethod(loadPageNameDynamic){
    window.open(`${this.BASE_URL}/personalizationTags/`+loadPageNameDynamic+`?tagKey=`+this.tagKey, '_parent');
  }
  reloadToDefinePersonlizedMethod(){
    window.open(`${this.BASE_URL}/personalizationTags/definePersonalization?tagKey=`+this.tagKey, '_parent');
  }
  reloadToSimulateTagMethod(){
    window.open(`${this.BASE_URL}/personalizationTags/loadSimulateTag?tagKey=`+this.tagKey, '_parent');
  }
  finalizePageLanding(){
    window.open(`${this.BASE_URL}/personalizationTags/loadGeneratedTags?tagKey=`+this.tagKey, '_parent');
  }
  getSavedTemplatePromo(){
    /* let endpoint = AppConstants.API_END_POINTS.GET_EDIT_PERSONALIZATION_TAG+"?tagKey="+this.tagKey;
    this.http.post(endpoint).subscribe((res) => {
      if(res !== undefined){
        if(res.status == "SUCCESS"){
          this.currentObj = JSON.parse(res.response.jsonString);
          if(this.currentObj){
            this.isTemplateEditMode = true;
            this.isFailSafeEnable = this.currentObj.failSafe;
            this.shareService.failSafeEnable.next(this.currentObj.failSafe);
            this.shareService.isTemperarySave.next(true);
            this.shareService.failSafeCurrentTab.next(0);
          }
          //this.getBeeEditorLoadObj(this._urlPath);
        }
      }
      
    }); */

    this.shareService.savedPersonalizationDataObj.subscribe(res => {
      this.currentObj = res;
      if(this.currentObj){
        this.isTemplateEditMode = true;
        this.isFailSafeEnable = this.currentObj.failSafe;
        this.shareService.failSafeEnable.next(this.currentObj.failSafe);
        this.shareService.isTemperarySave.next(true);
        this.shareService.failSafeCurrentTab.next(0);
      }
    });
    
    }
      setFailSafeDetails(index,isfailsafeActive,previousTabId){
        this.loader.ShowLoader();
        //if(!this.isPreview){
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
          //this.shareService.isTemperarySave.next(true);
          this.setActive = index;
          this.isFailSafeTabActive = isfailsafeActive;
          this.shareService.failSafeTabActive.next(isfailsafeActive);
          //if(this.currentObj.failSafe && GlobalConstants.isEditMode){
            if(this.isFailSafeTabActive){
              
              // normal channel data
              if(this.isTemplateEditMode){
                if(this.currentObj.failSafeTemplateJson === undefined){
                  const tempObj = JSON.parse(this.currentObj.templateJson);
                  this.updateBeeEditorTempObj.emit(tempObj);
                  this.onTabSwitch();
                }else{
                  const tempObj = JSON.parse(this.currentObj.failSafeTemplateJson);
                  this.updateBeeEditorTempObj.emit(tempObj);
                  this.onTabSwitch();
                }
                
                // if(this.currentObj.subjectLine !== this.subjectObj.subject){
                //   this.onTabSwitch();
                // }else{                  
                //   // const subjObj = this.updateSubjectObj(this.currentObj);
                //   // // this.shareService.subjectObj.next(subjObj);
                //   // subjObj.preHeader = this.currentObj.failSafePreHeader;
                //   // subjObj.subject = this.currentObj.failSafeSubjectLine;
                //   // this.shareService.subjectNpreheaderInputValueFailsafe.next(subjObj);
                //   // this.shareService.updateSubjectPreheader.next(subjObj);
                //   const tempObj = JSON.parse(this.currentObj.failSafeActualTemplateText);
                //   this.updateBeeEditorTempObj.emit(tempObj);
                //   this.onTabSwitch();
                // // }                
              }else{
                this.onTabSwitch();
              }             
            }
            else{
              // failsafe channel data
              if(this.isTemplateEditMode && (this.currentObj !== undefined && this.currentObj.failSafe)){
                // if(this.currentObj.subjectLine !== this.subjectObj.subject || this.currentObj.preHeader !== this.subjectObj.preHeader){
                //   this.onTabSwitch();
                // }else{
                  // const failsafeTabInputDataNew = this.updateSubjectObjFailsafe(this.currentObj);
                  // this.shareService.failSafSubjectObj.next(failsafeTabInputDataNew);
                  // const subjObj = this.updateSubjectObj(this.currentObj);
                  // this.shareService.subjectNpreheaderInputValue.next(subjObj);
                  // this.shareService.updateSubjectPreheader.next(subjObj);
                  const tempObj = JSON.parse(this.currentObj.templateJson);
                  this.updateBeeEditorTempObj.emit(tempObj);
                  this.onTabSwitch();
                //}                
              }else{
                // const subjObj = this.updateSubjectObj(this.currentObj);
                // this.shareService.updateSubjectPreheader.next(subjObj);
                this.onTabSwitch();
              }           
            }
         // }
          
        //}
        // else{
        //   // normal channel
        //   this.shareService.failSafeCurrentTab.next(index);
        //   this.shareService.failSafePreviousTab.next(previousTabId);
        //   //this.shareService.isTemperarySave.next(true);
        //   this.setActive = index;
        //   this.isFailSafeTabActive = isfailsafeActive;
        //   this.shareService.failSafeTabActive.next(isfailsafeActive);
        //   this.updateBeeEditorTempObj.emit(emptyJson);
        //   // if(this.currentObj !== undefined){
        //    //this.updatePreviewObj.emit(this.payloadObj);
        //   // }
        // }
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
  getPreviousPage(){
    // GlobalConstants.vendorObj = this.vendorObj;
    // GlobalConstants.channelObj = this.channelObj;
    window.open(`${this.BASE_URL}/personalizationTags/loadPersonalizationTags`, '_parent');
  }
  onsave(isPublish, savedType){
    this.loader.ShowLoader();    
    this.isPersonalizedPublishEnable = isPublish;
    //GlobalConstants.actionsPreviewEnable = false;
    //this.shareService.subjectObj.next(this.subjectObj);
    this.shareService.onPublishEnableForPersonalization.next(isPublish);
    this.shareService.onSavedTypePersonalization.next(savedType);
    this.callBeeInstancePersonalized.emit([this.beeInstance, savedType]);
  }
  onTabSwitch(){    
    //this.loader.HideLoader();
   // const beeInstance = new Bee();
    // if(this.isFailSafeTabActive && this.isFailSafeEnable){
    //   this.updateBeeEditorTempObj.emit(emptyJson);
    // }else{
      this.callBeeInstanceWhenTabSwitch.emit(this.beeInstance);
    //}
       
  }
  onsaveMyTemplate(isSaveAsTemplate){
    this.loader.ShowLoader();
    this.saveAsTemplate.emit(isSaveAsTemplate);
  }
  saveAndPublishPersonalization(isPublish){
    this.shareService.pTagNameVal.subscribe(res => {
      if(res !== undefined || res !== ""){
        this.pTagNameSaveNpublish = res;
      }
    });
    
    let endpoint = "/personalizationTags/saveNpublishPTag?tagKey="+this.tagKey+"&tagName="+this.pTagNameSaveNpublish+"&publish="+isPublish;
    this.http.post(endpoint).subscribe(res => {
      if (res.status == 'SUCCESS') {
        var urlRedirect = res.response.redirect;
        if(isPublish){
          if(Object.keys(this.tagParamsArryObj).length === 0){
            Swal.fire({
              title: 'Saved and published successfully.',
              allowEscapeKey: false,
              allowOutsideClick: false,
              showConfirmButton: true,
              confirmButtonText: this.translate.instant('designEditor.okBtn'),
            });
          }
          setTimeout(() => {
          window.open(`${this.BASE_URL}`+urlRedirect, '_parent');
        }, 500);

         
        }
      }
    });
    
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
