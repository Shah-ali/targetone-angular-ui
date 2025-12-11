import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConstants } from '@app/app.constants';
import { HttpService } from '@app/core/services/http.service';
import { LoaderService } from '@app/core/services/loader.service';
import { SharedataService } from '@app/core/services/sharedata.service';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CreateApiIntegrationComponent } from '../create-api-integration/create-api-integration.component';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-show-api-integration',
  templateUrl: './show-api-integration.component.html',
  styleUrls: ['./show-api-integration.component.scss']
})
export class ShowApiIntegrationComponent implements OnInit {
  apiTabActive: any = 0;
  pTags: any = [];
  tempPTags: any = [];
  modalRef?: BsModalRef;
  filteredObjList: any;
  sortByLatest:boolean = false;
  apiCreatedBy: string = "";
  apiCreatedDate: string = "";
  
  constructor(
    private httpService: HttpService,
    private modalService: BsModalService,
    private shareService: SharedataService,
    private router: Router,
    private loader: LoaderService,
    private ngZone: NgZone,
    private translate: TranslateService,
  ) {
    this.shareService.apiBasedIntegrationModule.next(true);
    this.showAPISavedListIntegration();
   }
  
  ngOnInit(): void {
  }
  sortByLatestMethod(method){
    if(method == 1){
      this.filteredObjList = this.filteredObjList.reverse();
      this.sortByLatest = true;
    }else{
      this.filteredObjList = this.filteredObjList.reverse();
      this.sortByLatest = false;
    }
  }
  switchTextTab(tabId){
    this.apiTabActive = tabId;
    if(tabId == 0){ // All
      let filterAll = this.tempPTags.filter(x => x);
      this.filteredObjList = filterAll;
    }else if(tabId == 1){ // Active
      let filterActive = this.tempPTags.filter(x => x.active == 1);
      this.filteredObjList = filterActive;
    }else if(tabId == 2){ // Inactive
      let filterInActive = this.tempPTags.filter(x => x.active == 0);
      this.filteredObjList = filterInActive;
    }
  }
  
  filterByStatusTabMethod(tabInx,status,resobj){
    let indxItem;
    this.filteredObjList = [];
    //if(this.apiTabActive != 0){
      indxItem = this.tempPTags.findIndex(x => x.apiKey == resobj.apiKey);
      this.tempPTags[indxItem].active = status;
    //}
    setTimeout(() => {
      this.filteredObjList = this.tempPTags;
      this.switchTextTab(this.apiTabActive);
    }, 300);
    
  }
  createApiBasedPersonalization(isPublished,apiKey){
    this.callPopupComponent(CreateApiIntegrationComponent,"createNewApiIntegration",isPublished,apiKey);
  }
    
   async callPopupComponent(modalTemplate,classCss,isEdit,apiKey) {
      let paramsObj = "?param1=1&param2=abc";
      let endpoint:any;
      if(isEdit){ // edit mode
        endpoint = AppConstants.API_END_POINTS.GET_API_BASED_EDIT_INTEGRATION+apiKey;
      }else{ // create mode

        endpoint = AppConstants.API_END_POINTS.GET_API_BASED_CREATE_INTEGERATION+apiKey;
      }
      
      //let endpoint = AppConstants.API_END_POINTS.GET_API_BASED_EDIT_INTEGRATION+"21";
      const result = await this.httpService.post(endpoint).toPromise();
      if (result.status == 'SUCCESS') {
        if(isEdit){
          let savedObj = result.response.responseData;
          let assignedPriviledgeObj = result.response.assignedPriviledge;
          if(assignedPriviledgeObj !== undefined){
            savedObj['assignedPriviledge'] = assignedPriviledgeObj;
          }          
          savedObj['isEditmode'] = isEdit;
          this.shareService.savedApiBasedIntegrationDataObj.next(savedObj);
        }else{
          let savedObj = {};
          let assignedPriviledgeObj = result.response.assignedPriviledge;
          if(assignedPriviledgeObj !== undefined){
            savedObj['assignedPriviledge'] = assignedPriviledgeObj;
          }   
          savedObj['isEditmode'] = isEdit;
          this.shareService.savedApiBasedIntegrationDataObj.next(savedObj);
        }    
        this.modalRef = this.modalService.show(modalTemplate, {
          class: 'modal-dialog-centered '+classCss,
          backdrop: 'static',
          keyboard: false,
        });
      }
     
   }
   async showAPISavedListIntegration() {
    let endpoint = AppConstants.API_END_POINTS.GET_API_SAVED_LIST_INTERGRATION;
    const result = await this.httpService.post(endpoint).toPromise();
    if (result.status == 'SUCCESS') {
      let resObj = result.response;
      this.tempPTags = resObj;
      this.filteredObjList = resObj;
      //  this.sortByLatestMethod(1);
      //console.log(result.response);      
    }
   
 }  
 async activeInActiveAPICallMethod(apiKey,activeVal,evt, apiName){
    let activeIncativeMgs;
    let newStatus;
    if(activeVal == "1"){
      activeIncativeMgs = this.translate.instant('apiPersonalization.InactiveConfirmationBeforeAppyingLbl', {value1: apiName}),
      newStatus = '0';
    }else{
      activeIncativeMgs = this.translate.instant('apiPersonalization.activeConfirmationBeforeAppyingLbl', {value1: apiName});
      newStatus = '1';
    }
    Swal.fire({
      title: activeIncativeMgs,
      // showCloseButton: true,
      icon:'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('yes'),
      //confirmButtonColor: '#3366FF',
      cancelButtonText: this.translate.instant('cancel'),
      cancelButtonColor: '',
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        cancelButton: 'buttonCssStyle',
        confirmButton: 'buttonCssStyle',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        let endpoint = AppConstants.API_END_POINTS.GET_ACTIVE_INACTIVE_APIS+activeVal+"/"+apiKey;
        this.httpService.post(endpoint).subscribe(res => {
          if (res.status == 'SUCCESS') {
            this.filterByStatusTabMethod(activeVal,newStatus,res.response);
          }
        });        
      }else{
        if(activeVal == '0'){
          evt.target.checked = false;
        }else{
          evt.target.checked = true;
        }       
      }
    });
  }
 
  // search template by name
  searchPTags(event: any): void {
    this.filteredObjList = this.tempPTags;
    // if (event.target.value === '') {
    //   /* this.getTemplateList().then((data:any) =>{
    //     this.templates = data.response;
    //   }).then(() => {
    //     if(this.promotionKey !== 0) {
    //       this.updateSelectedTemplate();
    //     }
    //   }); */
    // } else {
      let tempFilterArry:any = [];
      if(this.apiTabActive === 0){ // All
        let filterAll = this.tempPTags.filter(x => x);
        tempFilterArry = filterAll;
      }else if(this.apiTabActive === 1){ // Active
        let filterActive = this.tempPTags.filter(x => x.active == 1);
        tempFilterArry = filterActive;
      }else if(this.apiTabActive === 2){ // Inactive
        let filterInActive = this.tempPTags.filter(x => x.active == 0);
        tempFilterArry = filterInActive;
      }
      this.filteredObjList = tempFilterArry.filter((item) => {
        return item.apiName.toLowerCase().indexOf(event.target.value.toLowerCase().trim()) > -1;
      });
    }
  //}

  openCreateByPopover(popoverHook: NgbPopover, tag: any) {
    this.apiCreatedBy = tag.createdBy || "";
    this.apiCreatedDate = tag.createdDate || "";

    if (popoverHook.isOpen()) {
			popoverHook.close();
		} else {
			popoverHook.open();
		}
  }
}
