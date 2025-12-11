import { Component, HostListener, NgZone, OnInit, TemplateRef } from '@angular/core';
import { AppConstants } from '@app/app.constants';
import { HttpService } from '@app/core/services/http.service';
import { Router, RouterLink } from '@angular/router';
import { environment } from '@env/environment';
import { SharedataService } from '@app/core/services/sharedata.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LoaderService } from '@app/core/services/loader.service';
import { Clipboard } from '@angular/cdk/clipboard';
import Swal from 'sweetalert2';
import { DataService } from '@app/core/services/data.service';
import { TranslateService } from '@ngx-translate/core';
import { PersonalizedTagPerformanceService } from '@app/core/services/personalized-tag-performance.service';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '@app/core/services/authentication.service';

@Component({
  selector: 'app-saved-personalized-tags',
  templateUrl: './saved-personalized-tags.component.html',
  styleUrls: ['./saved-personalized-tags.component.scss'],
})
export class SavedPersonalizedTagsComponent implements OnInit {
  private BASE_URL = environment.BASE_URL;
  modalRef?: BsModalRef;
  isPersonalizeTagMode: boolean = true;
  pTags: any = [];
  tempPTags: any = [];
  showLoader: boolean = false;
  publishedMode: boolean = true;
  draftMode: boolean = false;
  tagKey: any;
  tagJSON: any = [];
  viewPtags: any;
  tabActive: number = 1;
  currentPage: number = 1;
  activeTabName: string = "Active";
  activateTagLabel: string = '';
  deactivateTagLabel: string = '';
  pTagCreatedBy: string = "";
  pTagCreatedDate: string = "";
  pTagActivationDate: string= "";
  actionBtnObj:any =[];
  showViewTagPopupEnabled: boolean = false;
  showCopyPopupEnabled: boolean = false;
  showEditPopupEnabled: boolean = false;
  activeEditAlreadyPresent: any;
  disableForEditOnly: any;
  currentTagFocusObj: any;
  warningEditMessageLbl:any = "";
  warningCopyMessageLbl:any = "";
  showActionListpopup: boolean = false;
  isGrapesJsFeatureEnabled: boolean = false;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private modalService: BsModalService,
    private shareService: SharedataService,
    private ngZone: NgZone,
    private loader: LoaderService,
    private clipboard: Clipboard,
    private dataService: DataService,
    private translate:TranslateService,
    private personalizedTagPerformanceService: PersonalizedTagPerformanceService,
    private authService: AuthenticationService

  ) {
    this.shareService.grapesJsEnabled.subscribe((res) => {
      if (res !== undefined) {
        this.isGrapesJsFeatureEnabled = res;
      }
    });
    this.dataService.pTagTabStatusFlag.subscribe(res => {
      if(res !== undefined){
        this.tabActive = res;
        if(this.tabActive === 1){ // Active
          this.activeTabName = 'Active';
        }else if(this.tabActive === 2){  // Draft
          this.activeTabName = 'Draft';
        }else if(this.tabActive === 3){ // InActive
          this.activeTabName = 'Inactive';
        }else if(this.tabActive === 4){ // Favourite
          this.activeTabName = 'Favorite';
        }else if(this.tabActive === 5){ // Favourite
          this.activeTabName = 'QA';
        }
      }
    });
    this.shareService.activepTagTab.next('1');
    this.shareService.personalizeTagService.next(this.isPersonalizeTagMode);
    this.fetchAllPersonalizationTags();
  }
  onCheckOptionEditDisabled(itemObj){
    let isActiveEdit = itemObj.activeEdit;  
    if(isActiveEdit == 1)  {
      this.activeEditAlreadyPresent = itemObj.tagId;
      this.disableForEditOnly = this.translate.instant('personalizationTagsComponent.editTagLbl');
    }
  }
  onActionMethod(popupModal,name,itemObj){
    this.tagKey = itemObj.tagId;
    let isActiveEdit = itemObj.activeEdit;   
    if(name == this.translate.instant('personalizationTagsComponent.editTagLbl')){
        this.showCopyPopupEnabled = false;
        this.showViewTagPopupEnabled = false;
        this.showEditPopupEnabled = true;
        this.getActiveEditNameMethod(itemObj.tagId); 
        this.warningEditMessageLbl = "";
        this.warningEditMessageLbl = this.translate.instant('personalizationTagsComponent.showEditPopupMessageLbl');
        this.warningEditMessageLbl = this.warningEditMessageLbl.replaceAll('{Name}',this.currentTagFocusObj.tagName).replaceAll('{activeName}',this.currentTagFocusObj.activeEditName);
        this.openActiveEditandCopyPopupMethod(popupModal);
    }else if(name == this.translate.instant('personalizationTagsComponent.copyTagLbl')){
      this.showEditPopupEnabled = false;      
      this.showViewTagPopupEnabled = false;
      this.showCopyPopupEnabled = true;
      this.getActiveCopyNameMethod(itemObj.tagId); 
      this.warningCopyMessageLbl = "";
      this.warningCopyMessageLbl = this.translate.instant('personalizationTagsComponent.showCopyPopupMessageLbl');
      this.warningCopyMessageLbl = this.warningCopyMessageLbl.replace('{Name}',this.currentTagFocusObj.tagName).replace("{activeName}",this.currentTagFocusObj.copyName);
      this.openActiveEditandCopyPopupMethod(popupModal);
    }
  }
  openPTagsModal(pTagTemplate: TemplateRef<any>, tagKey: Number,isEditPopup) {
    this.showEditPopupEnabled = false;    
    this.showCopyPopupEnabled = false;  
    this.showViewTagPopupEnabled = true;
      
    this.loadGeneratedTagScripts(tagKey);
    this.modalRef = this.modalService.show(pTagTemplate, {
      class: 'modal-dialog-centered pTagModel',
      backdrop: 'static',
      keyboard: false,
    });
  }
openActiveEditandCopyPopupMethod(pTagTemplate){
  this.modalRef = this.modalService.show(pTagTemplate, {
    class: 'modal-dialog-centered pTagModel',
    backdrop: 'static',
    keyboard: false,
  });
}
async confirmEditMethod(){
  let endpoint = AppConstants.API_END_POINTS.GET_EDIT_ACTIVE_PTAG_API;
  let payload =  {"tagKey":this.tagKey}
    const result = await this.httpService.post(endpoint,payload).toPromise();
    if (result.status == 'SUCCESS') {
      let resObj = result.response;
      this.editTagPersonalizationMethod(resObj.tagKey,resObj.tagName,resObj);
    }else{
      this.dataService.SwalAlertMgs(result.message);
    }
}
async confirmCopyMethod(){
  let endpoint = AppConstants.API_END_POINTS.GET_CLONE_COPY_PTAG_API;
  let payload =  {"tagKey":this.tagKey}
    const result = await this.httpService.post(endpoint,payload).toPromise();
    if (result.status == 'SUCCESS') {
      let resObj = result.response;
      this.editTagPersonalizationMethod(resObj.tagKey,resObj.tagName,resObj);
      this.dataService.SwalSuccessMsg(result.message);
    }else{
      this.dataService.SwalAlertMgs(result.message);
    }
}
  closePTagModel(): void {
    if (this.modalRef !== undefined) {
      this.modalRef.hide();
    }
  }

  ngOnInit(): void {
    //localStorage.removeItem('tagKeyPersonalization');
    //localStorage.removeItem('tagNamePersonalization');

    //this.getData();
  }

  /* getData(){
    const url ='https://rickandmortyapi.com/api/character/?status=alive&gender=female'
    fetch(url).then(res => res.json())
    .then(jsonData => {
      console.log(jsonData);
    });
  } */

  callPopupComponent(modalTemplate, classCss) {
    this.modalRef = this.modalService.show(modalTemplate, {
      class: 'modal-dialog-centered ' + classCss,
      backdrop: 'static',
      keyboard: false,
    });
    this.removeLoader();
  }
  removeLoader() {
    this.ngZone.run(() => {
      this.loader.loadCount = 0;
      this.loader.HideLoader();
    });
  }
  createPersonalizationTagMethod(isviewEnabled) {
    // let endpoint = AppConstants.API_END_POINTS.GET_CREATE_PERSONALIZATION_TAG;
    // this.httpService.post(endpoint).subscribe((res) => {
    //   let tagkeyVal = res.response.tagKey;

    // });
    
    //let tagkeyVal = '-1';
    //localStorage.setItem('tagKeyPersonalization', tagkeyVal);

    //GlobalConstants.isViewPersonalizationEnable = isviewEnabled;
    //this.shareService.isPublishEnabledForPersonalization.next(isviewEnabled);
   // localStorage.setItem('isViewPersonalizationEnable', isviewEnabled);
    // Create mode doesn't have tagKey
    sessionStorage.setItem('selectedEditor', 'email');
    window.open(`${this.BASE_URL}/personalizationTags/definePersonalization`, '_parent');
  }
  onPageChange(page: number) {
    this.currentPage = page;
  }
  viewSummarizedPerformance(){
    this.router.navigate(['/summarized-view']);
    this.shareService.viewSummarizedEnabled.next(true);
  }

  toggleActionPopup() {
    if (this.showActionListpopup) {
      this.showActionListpopup = false;
    } else {
      this.showActionListpopup = true;
    }
  }
  
  loadGraphViewMethod(tagKey, tagName){
    const newDataItem = [];
    newDataItem["tagKey"] = tagKey;
    newDataItem["tagName"] = tagName;
    this.dataService.pTagKeySelected.next(newDataItem);
    
    this.dataService.setPtagDashboard(false);
    this.dataService.setPtagGraphPerformanceDashboard(true);
    this.dataService.setPtagSummarisedPerformanceDashboard(false);
    this.router.navigate(['/graph-view']);
  }
  fetchAllPersonalizationTags() {
    this.personalizedTagPerformanceService.getTags(this.activeTabName).subscribe((res) => {
      if (res?.body.status == 'SUCCESS') {
        let tagsObjAll = res?.body.response;
        this.actionBtnObj = [      
          {id:"edit", "icon":"fa-pencil","name":this.translate.instant('personalizationTagsComponent.editTagLbl'),"disabled":false},
          {id:"copy", "icon":"fa-copy","name":this.translate.instant('personalizationTagsComponent.copyTagLbl'),"disabled":false}
        ];
        this.pTags = tagsObjAll;
        this.tempPTags = this.pTags;
      } else {
        this.pTags = [];
      }
     
    });

    /* this.pTags = [
      { tagKey: '1', previewImgUrl: '', tagName: 'aaa personal tag 1', tags: ['<tag1>', 'tag2', 'tag3'], active: 1 },
      { tagKey: '2', previewImgUrl: '', tagName: 'bbb personal tag 2', tags: ['<tag1>', 'tag2', 'tag3'], active: 1 },
      { tagKey: '3', previewImgUrl: '', tagName: 'ccc personal tag 3', tags: ['<tag1>', 'tag2', 'tag3'], active: 1 },
      { tagKey: '4', previewImgUrl: '', tagName: 'my personal tag 4', tags: ['<tag1>', 'tag2', 'tag3'], active: 1 },
      { tagKey: '5', previewImgUrl: '', tagName: 'my personal tag 5', tags: ['<tag1>', 'tag2', 'tag3'], active: 1 },
      { tagKey: '6', previewImgUrl: '', tagName: 'my personal tag 6', tags: ['<tag1>', 'tag2', 'tag3'], active: 1 },
      { tagKey: '7', previewImgUrl: '', tagName: 'my personal tag 7', tags: ['<tag1>', 'tag2', 'tag3'], active: 1 },
      { tagKey: '8', previewImgUrl: '', tagName: 'my personal tag 8', tags: ['<tag1>', 'tag2', 'tag3'], active: 1 },
      { tagKey: '9', previewImgUrl: '', tagName: 'my personal tag 9', tags: ['<tag1>', 'tag2', 'tag3'], active: 1 },
      { tagKey: '10', previewImgUrl: '', tagName: 'my personal tag 10', tags: ['<tag1>', 'tag2', 'tag3'], active: 1 },
    ];
    this.tempPTags = this.pTags; */
  }
  async loadGeneratedTagScripts(tagKey) {
    let endpoint = AppConstants.API_END_POINTS.GET_GENERATED_TAG_FINAL_PAGE + '?tagKey=' + tagKey;
    const result = await this.httpService.post(endpoint).toPromise();
    if (result.status == 'SUCCESS') {
      this.viewPtags = "";
      this.viewPtags = result.response.tags;
      //console.log(result.response);
    }else{
      this.viewPtags = null; 
    }
  }
  switchTextTab(type){
    this.tabActive = type;
    this.shareService.activepTagTab.next(type);
    this.dataService.ptagTabStatusCheckMethod(this.tabActive);
    if(type === 1){ // Active
      this.activeTabName = 'Active';
    }else if(type === 2){  // Draft
      this.activeTabName = 'Draft';
    }else if(type === 3){ // InActive
      this.activeTabName = 'Inactive';
    }else if(type === 4){ // Favourite
      this.activeTabName = 'Favorite';
    }else if(type === 5){
      this.activeTabName = 'QA';
    }
    this.fetchAllPersonalizationTags();
  }
  switchListGridViewMethod(type){
    if(type == 'list'){
      this.router.navigate(['/list-view']);
    }else{
      this.router.navigate(['/saved-personalized-tags']);
    }
  }
  editTagPersonalizationMethod(tagkeyVal, tagName, resObj) {
    //localStorage.setItem('tagKeyPersonalization', JSON.stringify(tagkeyVal));
    //localStorage.setItem('tagNamePersonalization', tagName);
    //GlobalConstants.isViewPersonalizationEnable = isviewEnabled;
   // this.shareService.isPublishEnabledForPersonalization.next(isviewEnabled);
     //this.isEditEnabledPtag = isviewEnabled;
   // localStorage.setItem('isViewPersonalizationEnable', isviewEnabled);
   if(resObj.editorType == 2) {
    sessionStorage.setItem('selectedEditor', 'whatsapp');
   } else {
    sessionStorage.setItem('selectedEditor', 'email');
   }
   
   this.dataService.setSharedActiveContentName = tagName;
    window.open(`${this.BASE_URL}/personalizationTags/definePersonalization?tagKey=` + tagkeyVal, '_parent');
  }

  // search template by name
  searchPTags(event: any): void {
    this.tempPTags = this.pTags;
    if (event.target.value === '') {
      /* this.getTemplateList().then((data:any) =>{
        this.templates = data.response;
      }).then(() => {
        if(this.promotionKey !== 0) {
          this.updateSelectedTemplate();
        }
      }); */
    } else {
      this.tempPTags = this.pTags.filter((item) => {
        return item.tagName.toLowerCase().indexOf(event.target.value.toLowerCase().trim()) > -1;
      });
    }
  }

  copyToPaste(tooltip, refEl: any) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ refEl });
      this.clipboard.copy(refEl);
      setTimeout(() => {
        tooltip.close();
      }, 1000);
    }
  }

  // async onGetParameters(tagKey: Number) {
  //   let endpoint = AppConstants.API_END_POINTS.GET_TAG_PARAMETERS_API + '?tagKey=' + tagKey;
  //   const result = await this.httpService.post(endpoint).toPromise();
  //   if (result.status == 'SUCCESS') {
  //     this.tagJSON = JSON.parse(result.response.tagParams).params;
  //   }
  // }

  activatePTag(el, tagKey, tagName) {
    let stateControl: boolean;
    let cid = el.target.getAttribute('cid');
    let msg: string = '';
    let confirmMsg = '';
    if (cid == 'active') {
      stateControl = false;
      confirmMsg = this.translate.instant('personalizationTagsComponent.pTagDeactivateConfirmMsg');
    } else {
      stateControl = true;
      confirmMsg = this.translate.instant('personalizationTagsComponent.pTagActivateConfirmMsg');
    }
    confirmMsg = confirmMsg.replace('<xyz>',tagName);
    let endpoint = AppConstants.PTAG_DASHBOARD.GET_PTAG_ENABLE_DISABLE_API +'tagKey=' +tagKey +'&stateControl=' +stateControl;
    Swal.fire({
      titleText: confirmMsg,
      imageUrl: "./assets/images/warning-icon.png",
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: this.translate.instant('yes'),
      cancelButtonText: this.translate.instant('cancel'),
      cancelButtonColor: '',
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        cancelButton: 'buttonCssStyle',
        confirmButton: 'buttonCssStyle',
      },
    }).then((result) => {
      if (result.value) {
        this.httpService.post(endpoint).subscribe((data) => {
          if (data.status == 'SUCCESS') {
            if (cid == 'active') {
              el.target.classList.remove('fa-toggle-on');
              el.target.classList.add('fa-toggle-off');
              el.target.setAttribute('cid', 'active');
              el.target.setAttribute('title', AppConstants.ACTION_LABELS.activate);
              msg = this.translate.instant('personalizationTagsComponent.personalizationTagDisabledSuccessfullyLbl');
            } else {
              el.target.classList.add('fa-toggle-on');
              el.target.classList.remove('fa-toggle-off');
              el.target.setAttribute('cid', 'inactive');
              el.target.setAttribute('title', AppConstants.ACTION_LABELS.deactivateTag);
              msg = this.translate.instant('personalizationTagsComponent.personalizationTagEnabledSuccessfullyLbl');
            }
    
            this.dataService.SwalSuccessMsg(tagName+"&nbsp"+msg);
            this.fetchAllPersonalizationTags();
          }
        });
      }
    })
  }

  favTagPersonalization(tagKey, favourite, tagName) {
    let status = (favourite === "0") ? 1 : 0;
    let endpoint =
    AppConstants.API_PERSONSOALIZATION_TAGS_END_POINTS.PERSONALIZATION_FAV_TAGS +'?tagKey=' +tagKey +'&status='+status;
    this.httpService.post(endpoint).subscribe((res) => {
      this.dataService.SwalSuccessMsg(tagName+" "+res.message);
      this.fetchAllPersonalizationTags();
    });
  }

  deletePTag(tagid) {
    Swal.fire({
      titleText: this.translate.instant('personalizationTagsComponent.deletePtagComfirmationMsgLbl'),
      imageUrl: "./assets/images/warning-icon.png",
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: this.translate.instant('yes'),
      cancelButtonText: this.translate.instant('cancel'),
      cancelButtonColor: '',
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        cancelButton: 'buttonCssStyle',
        confirmButton: 'buttonCssStyle',
      },
    }).then((result) => {
      if (result.value) {
        this.personalizedTagPerformanceService.deleteTag(tagid).subscribe(res => {
          if(res.status == 'SUCCESS'){
            this.dataService.SwalSuccessMsg(res.message);
            this.fetchAllPersonalizationTags();
          }
        });
      }
    })
  }

  openCreateByPopover(popoverHook: NgbPopover, tag: any) {
    this.pTagCreatedBy = tag.createdBy || "";
    this.pTagCreatedDate = tag.creationDate || "";
    //this.pTagActivationDate = tag.activationDate || "";

    if (popoverHook.isOpen()) {
			popoverHook.close();
		} else {
			popoverHook.open();
		}
  }
  ngbPopoverShowHide(popoverHook: NgbPopover,tagId){
    this.getActiveEditNameMethod(tagId);
    if (popoverHook.isOpen()) {
			popoverHook.close();
		} else {
			popoverHook.open();
		}
  }
  getActiveEditNameMethod(tagId){
    this.currentTagFocusObj = {};
    let currtTag = this.tempPTags.find(x => x.tagId == tagId);
    if(currtTag !== undefined){
      this.currentTagFocusObj = currtTag;
      this.currentTagFocusObj['activeEditName'] = currtTag.tagName+"_edit";
    }
  }
  getActiveCopyNameMethod(tagId){
    this.currentTagFocusObj = {};
    let currtTag = this.tempPTags.find(x => x.tagId == tagId);
    if(currtTag !== undefined){
      this.currentTagFocusObj = currtTag;
      this.currentTagFocusObj['copyName'] = currtTag.tagName+"_copy";
    }
  }

  helpOLH(section:string) {
    this.authService.globalHelpOLH(section);
  }

  @HostListener('document:click', ['$event'])
    clickout(event) {
      const targetClassList = event.target.classList;
      const parentClassList = event.target.parentElement ? event.target.parentElement.classList : null;
  
      if (targetClassList.contains('actionMenuBtn') || (parentClassList && parentClassList.contains('actionMenuBtn'))) {
          return;
      }
      
      this.showActionListpopup = false;
    }

  activeContentForWhatsApp() {
    sessionStorage.setItem('selectedEditor', 'whatsapp');
    window.open(`${this.BASE_URL}/personalizationTags/definePersonalization`, '_parent');

  }
}
