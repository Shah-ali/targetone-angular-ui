import { Component, ElementRef, HostListener, OnInit, ViewChild ,TemplateRef} from '@angular/core';
import { HttpService } from '@app/core/services/http.service';
import { environment } from '@env/environment';
import { PersonalizedTagPerformanceService } from '@app/core/services/personalized-tag-performance.service';
import { NgbModalConfig, NgbModal, NgbPopover, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
//import { DrawerComponent } from '../../shared/components/drawer/drawer.component';
//import { TAB_LABELS, ACTION_LABELS, COLUMN_LABELS} '../app/app.constants'
//import { DrawerService } from '../../services/drawer.service';
import { SharedataService } from '@app/core/services/sharedata.service';
import { LoaderService } from '@app/core/services/loader.service';
import { Clipboard } from '@angular/cdk/clipboard';
import Swal from 'sweetalert2';
import { DataService } from '@app/core/services/data.service';
import { Router } from '@angular/router';
import { AppConstants } from '@app/app.constants';



@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent implements OnInit {
  @ViewChild('p')
  popover!: NgbPopover;
  @ViewChild('tableContainer') tableContainer!: ElementRef;
  @ViewChild('pTagTemplate') pTagTemplate!: ElementRef;
  modalRef: BsModalRef | undefined;
  searchTag: string = '';
  selectedIdx: number = 0;
  activeTab: number = 1; // Set the default active tab
  currentPage = 1;
  itemsPerPage =25;
  totalItems = 15;  
  tagsData: any[] = [];
  sortColumn: string | null = null;
  sortDirection: string | null = null;
  tagsDataOriginal:any[]=[];
  selectedTag: any={};
  selectedCompaigns: any[] = []; // Replace with your actual data
  associatedCompaigns: any[] = []; // Replace with your actual data
  displayCampaignSize: number = 5; // Set your desired display size
  currentDisplayIndex: number = 0; // Track the current display index
  isFilterByCampaignOpen = false;
  isOffcanvasOpen = false;
  filterApplied =false;
  activeTabColumns: { key: string, label: string, isVisible: boolean }[] = [];
  deleteIcon: string= '';
  editIcon: string= '';
  tabs: any[] = [];
 // Use the constants in your component

private BASE_URL = environment.BASE_URL
  tagName: any;
  showCopyPopupEnabled: boolean = false;
  showViewTagPopupEnabled: boolean = false;
  showEditPopupEnabled: boolean = false;
  warningEditMessageLbl:any = "";
  warningCopyMessageLbl:any = "";
  currentTagFocusObj: any;
  tempPTags: any;
  viewPtags: any;
  tagKey: any;
  activeEditAlreadyPresent: any;
  disableForEditOnly: any;
  disabledEditTagFlag: boolean = false;
  //isDeactiveTagEnabled: boolean = false;
  constructor(
    private personalizedTagPerformanceService: PersonalizedTagPerformanceService,
    private modalService: BsModalService,
    private translate: TranslateService,
    //private languageService: LanguageService,
    private modalServiceDrawer: BsModalService,
    //private drawerService: DrawerService,
    private httpService: HttpService,
    private router: Router,
    private dataService: DataService,
    private shareService: SharedataService,
    private clipboard: Clipboard,
    
    ) {
      this.tabs = [
        { 
          id: 1, 
          label: this.translate.instant('apiPersonalization.activeLbl'), 
          value: AppConstants.TAB_LABELS.active, 
          filterByCampaign: true, 
          listTask: true, 
          grid: true, 
          actions: [this.translate.instant('pTagListView.deactivateTagLbl'), this.translate.instant('pTagListView.viewPerformanceLbl')], 
          columns: [
            { key: 'favorites', label: AppConstants.COLUMN_LABELS.favorites, isVisible: true },
            { key: 'tagName', label: AppConstants.COLUMN_LABELS.tagName, isVisible: true },
            { key: 'activationDate', label: AppConstants.COLUMN_LABELS.activationDate, isVisible: true },
            { key: 'associatedCampaigns', label: AppConstants.COLUMN_LABELS.associatedCampaigns, isVisible: true },
            { key: 'creationDate', label: AppConstants.COLUMN_LABELS.creationDate, isVisible: false },
            { key: 'deactivationDate', label: AppConstants.COLUMN_LABELS.deActivationDate, isVisible: false },
            { key: 'actions', label: AppConstants.COLUMN_LABELS.actions, isVisible: true }
          ]
        },
        { 
          id: 5, 
          label: this.translate.instant('apiPersonalization.qaTabLbl'), 
          value: AppConstants.TAB_LABELS.qaTest, 
          listTask: true, 
          grid: true, 
          actions: [this.translate.instant('pTagListView.deleteBtn')],
          columns: [
            { key: 'tagName', label: AppConstants.COLUMN_LABELS.tagName, isVisible: true },
            { key: 'activationDate', label: AppConstants.COLUMN_LABELS.activationDate, isVisible: false },
            { key: 'associatedCampaigns', label: AppConstants.COLUMN_LABELS.associatedCampaigns, isVisible: false },
            { key: 'creationDate', label: AppConstants.COLUMN_LABELS.creationDate, isVisible: true },
            { key: 'deactivationDate', label: AppConstants.COLUMN_LABELS.deActivationDate, isVisible: false },
            { key: 'actions', label: AppConstants.COLUMN_LABELS.actions, isVisible: true }
          ]
        },
        { 
          id: 2, 
          label: this.translate.instant('personalizationTagsComponent.draftLbl'), 
          value: AppConstants.TAB_LABELS.draft, 
          listTask: true, 
          grid: true, 
          actions: [this.translate.instant('personalizationTagsComponent.editTagLbl'), this.translate.instant('pTagListView.deleteBtn')],
          columns: [
            { key: 'tagName', label: AppConstants.COLUMN_LABELS.tagName, isVisible: true },
            { key: 'activationDate', label: AppConstants.COLUMN_LABELS.activationDate, isVisible: false },
            { key: 'associatedCampaigns', label: AppConstants.COLUMN_LABELS.associatedCampaigns, isVisible: false },
            { key: 'creationDate', label: AppConstants.COLUMN_LABELS.creationDate, isVisible: true },
            { key: 'deactivationDate', label: AppConstants.COLUMN_LABELS.deActivationDate, isVisible: false },
            { key: 'actions', label: AppConstants.COLUMN_LABELS.actions, isVisible: true }
          ]
        },
        { 
          id: 3, 
          label: this.translate.instant('apiPersonalization.inactiveLbl'), 
          value: AppConstants.TAB_LABELS.inactive, 
          filterByCampaign: true, 
          listTask: true, 
          grid: true, 
          actions: [this.translate.instant('pTagListView.activateTagLbl'), this.translate.instant('pTagListView.viewPerformanceLbl')],
          columns: [
            { key: 'tagName', label: AppConstants.COLUMN_LABELS.tagName, isVisible: true },
            { key: 'activationDate', label: AppConstants.COLUMN_LABELS.activationDate, isVisible: false },
            { key: 'associatedCampaigns', label: AppConstants.COLUMN_LABELS.associatedCampaigns, isVisible: true },
            { key: 'creationDate', label: AppConstants.COLUMN_LABELS.creationDate, isVisible: false },
            { key: 'deactivationDate', label: AppConstants.COLUMN_LABELS.deActivationDate, isVisible: true },
            { key: 'actions', label: AppConstants.COLUMN_LABELS.actions, isVisible: true }
          ]
        },
        { 
          id: 4, 
          label: this.translate.instant('apiPersonalization.favoriteLbl'),
          value: AppConstants.TAB_LABELS.favourite,  
          filterByCampaign: true, 
          listTask: true, 
          grid: true, 
          actions: [this.translate.instant('pTagListView.viewPerformanceLbl')],
          columns: [
            { key: 'tagName', label: AppConstants.COLUMN_LABELS.tagName, isVisible: true },
            { key: 'activationDate', label: AppConstants.COLUMN_LABELS.activationDate, isVisible: true },
            { key: 'associatedCampaigns', label: AppConstants.COLUMN_LABELS.associatedCampaigns, isVisible: true },
            { key: 'creationDate', label: AppConstants.COLUMN_LABELS.creationDate, isVisible: true },
            { key: 'deactivationDate', label: AppConstants.COLUMN_LABELS.deActivationDate, isVisible: true },
            { key: 'status', label: AppConstants.COLUMN_LABELS.status, isVisible: true },
            { key: 'actions', label: AppConstants.COLUMN_LABELS.actions, isVisible: true }
          ]
        }
      ];
      this.dataService.pTagTabStatusFlag.subscribe(res => {
        if(res !== undefined){
          this.activeTab = res;
        }
      });
    }

  ngOnInit() {
    this.translate.setDefaultLang('en'); // Default language
    //const userLang = this.languageService.getLanguage();
    //this.translate.use(userLang);
    this.activeTabColumns = this.getActiveTabColumns().filter(column => column.isVisible);
    this.fetchData();
    this.dataService.setPtagDashboard(true);
    this.dataService.setPtagGraphPerformanceDashboard(false);
    this.dataService.setPtagSummarisedPerformanceDashboard(false);
    //console.log(this.tagsData);
    this.translate.get('pTagListView.deleteBtn').subscribe((translation: string) => {
        this.deleteIcon = translation; // Assign translated value to action
    });
    this.translate.get('personalizationTagsComponent.editTagLbl').subscribe((translation: string) => {
      this.editIcon = translation; // Assign translated value to action
  });
  //this.disableForEditOnly = this.translate.instant('personalizationTagsComponent.editTagLbl');
  }
  switchListGridViewMethod(type){
    if(type == 'list'){
      this.router.navigate(['/list-view']);
    }else{
      this.router.navigate(['/saved-personalized-tags']);
    }
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event): void {
    //this.synchronizeScroll();
  }

  synchronizeScroll(): void {
    const scrollTop = window.scrollY;
    this.tableContainer.nativeElement.scrollTop = scrollTop;
  }
  fetchData(){
    var activeTabName= this.tabs.filter((tab)=>tab.id==this.activeTab)[0].value;
    this.personalizedTagPerformanceService.getTags(activeTabName).subscribe((result) => {
      this.tagsData = result?.body.response;
      this.tagsDataOriginal =  result?.body.response;
      this.getFilteredTags();
      this.sortData('tagName');
     
    });
  }
  tabChange(event :any ){
    this.dataService.ptagTabStatusCheckMethod(this.activeTab);
    this.fetchData();
  }
  getColumnHeader(key: string): string {
    const headerMappings: { [key: string]: string } = {
      'favorites': 'Favorite',
      'tagName': 'Tag name',
      'activationDate': 'Activation date',
      'associatedCampaigns': 'Associated campaigns',
      'actions': 'Actions',
      'deactivationDate': 'Deactivation Date',
      'creationDate': 'Creation Date'
    };

    return headerMappings[key] || key;
  }
  createPersonalizationTagMethod() {
    let tagkeyVal = '-1';
    //localStorage.setItem('tagKeyPersonalization', tagkeyVal);
    //localStorage.setItem('tagNamePersonalization', this.tagName);
    // this.dataService.setSharedActiveContentName(this.tagName);
    // Create mode doesn't have tagKey
    window.open(`${this.BASE_URL}/personalizationTags/definePersonalization`, '_parent');
  }
  editTagPersonalizationMethod(tagkeyVal, tagName,resObj) {
    // localStorage.setItem('tagKeyPersonalization', JSON.stringify(tagkeyVal));
    // localStorage.setItem('tagNamePersonalization', tagName);
    this.dataService.setSharedActiveContentName = tagName;
    window.open(`${this.BASE_URL}/personalizationTags/definePersonalization?tagKey=` + tagkeyVal, '_parent');
  }
  getActiveTabColumns(): { key: string, label: string, isVisible: boolean }[] {
    const activeTabInfo = this.tabs.find(tab => tab.id === this.activeTab);
    return activeTabInfo ? activeTabInfo.columns : [];
  }
  getActiveTabActions(currtTag): string[] {
    let activeTabInfo:any = this.tabs.find(tab => tab.id === this.activeTab);
    
    if(currtTag.status === 'draft'){
      activeTabInfo.actions = [this.translate.instant('personalizationTagsComponent.viewTagsLbl'), this.translate.instant('pTagListView.deleteBtn')];
      this.onCheckOptionEditDisabled(currtTag);
    }else if(currtTag.status === 'active'){
      activeTabInfo.actions = [this.translate.instant('personalizationTagsComponent.viewTagsLbl'),this.translate.instant('personalizationTagsComponent.editTagLbl'),this.translate.instant('personalizationTagsComponent.copyTagLbl'),this.translate.instant('pTagListView.deactivateTagLbl'), this.translate.instant('pTagListView.viewPerformanceLbl')]
      this.onCheckOptionEditDisabled(currtTag);

    }else if(currtTag.status === 'publishToQA'){
      activeTabInfo.actions = [this.translate.instant('personalizationTagsComponent.viewTagsLbl'),this.translate.instant('personalizationTagsComponent.copyTagLbl')]
      this.onCheckOptionEditDisabled(currtTag);

    }else if(currtTag.status === 'inactive'){
      activeTabInfo.actions = [this.translate.instant('personalizationTagsComponent.viewTagsLbl'),this.translate.instant('pTagListView.activateTagLbl'), this.translate.instant('pTagListView.viewPerformanceLbl')];

    }
    return activeTabInfo ? activeTabInfo.actions : [];
  }

  // Pagination handling
  onPageChange(page: number) {
    this.currentPage = page;
  }
  openPopover(tag: any) {
    this.selectedTag = tag;
    this.associatedCompaigns = this.selectedTag?.associatedCampaigns || [];
    this.currentDisplayIndex = 0;
    if (this.popover) {
      this.popover.open();
    }
  }

  closePopover() {
    this.selectedTag = null;
    if (this.popover) {
      this.popover.close();
    }
  }

  navigate(direction: 'prev' | 'next') {
    if (direction === 'prev' && this.currentDisplayIndex > 0) {
      this.currentDisplayIndex -= 1;
    } else if (direction === 'next' && this.currentDisplayIndex + this.displayCampaignSize < this.associatedCompaigns.length) {
      this.currentDisplayIndex += 1;
    }
  }

  showPrevButton(): boolean {
    return this.currentDisplayIndex > 0;
  }

  showNextButton(): boolean {
    return this.currentDisplayIndex + this.displayCampaignSize < this.associatedCompaigns.length;
  }

  displayedCampaigns(): any[] {
    return this.associatedCompaigns.slice(this.currentDisplayIndex, this.currentDisplayIndex + this.displayCampaignSize);
  }

 
  isColumnVisible(columnKey: string): boolean {
    const activeTabColumns = this.getActiveTabColumns();
    if (!activeTabColumns || activeTabColumns.length === 0) {
      return false;
    }
  
    const column = activeTabColumns.find(c => c.key === columnKey);
    return column ? column.isVisible : false;
  }
  viewSummarizedPerformance(){
    this.router.navigate(['/summarized-view']);
  }
  handleActionClick(action: string,tagid:any,favourite: string,pTagTemplate: TemplateRef<any>): void {
    // Do something with the clicked action
     //console.log(`Action clicked: ${action}`);
    // console.log(`Tag Id: ${tagid}`);
    this.tagKey = tagid;
   let filterTag = this.tagsData.filter(x => x.tagId == tagid)[0];
   //let tagName = "";
   if(filterTag !== undefined){
    this.tagName = filterTag.tagName;
   }
    if (action == AppConstants.ACTION_LABELS.viewPerformance){
      const newDataItem = [];
      newDataItem["tagKey"] = tagid;
      newDataItem["tagName"] = null;
      this.dataService.pTagKeySelected.next(newDataItem);
      this.dataService.getActivePtagDataObj(filterTag);
      this.router.navigate(['/graph-view']);
    }
   
    if (action == this.translate.instant('pTagListView.activateTagLbl')){
      let confirmMsg = this.translate.instant('personalizationTagsComponent.pTagActivateConfirmMsg');
      confirmMsg = confirmMsg.replace('<xyz>',this.tagName);
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
          this.personalizedTagPerformanceService.activateTag(tagid).subscribe(res => {
            if(res.status == 'SUCCESS'){
              //this.isDeactiveTagEnabled = true;
              let pTagIndx = this.tagsData.findIndex(x => x.tagId == res.response.tagKey);
              let tagName = this.tagsData.find(x => x.tagId == res.response.tagKey).tagName;
              if(pTagIndx !== undefined){
                this.tagsData.splice(pTagIndx,1);
              }          
              this.dataService.SwalSuccessMsg(tagName+" "+this.translate.instant('personalizationTagsComponent.personalizationTagEnabledSuccessfullyLbl'));
            }
          });
        }
      }); 
    }else 
    if (action == this.translate.instant('pTagListView.deactivateTagLbl')){
      let confirmMsg = this.translate.instant('personalizationTagsComponent.pTagDeactivateConfirmMsg');
      confirmMsg = confirmMsg.replace('<xyz>',this.tagName);
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
          this.personalizedTagPerformanceService.deactivateTag(tagid).subscribe(res => {
            if(res.status == 'SUCCESS'){
              //this.isDeactiveTagEnabled = true;
              let pTagIndx = this.tagsData.findIndex(x => x.tagId == res.response.tagKey);
              let tagName = this.tagsData.find(x => x.tagId == res.response.tagKey).tagName;
              if(pTagIndx !== undefined){
                this.tagsData.splice(pTagIndx,1);
              }    
              this.dataService.SwalSuccessMsg(tagName+" "+this.translate.instant('personalizationTagsComponent.personalizationTagDisabledSuccessfullyLbl'));
            }
          });
        }
      }); 
    }else
    if (action == this.translate.instant('pTagListView.deleteBtn')){
      Swal.fire({
        titleText: this.translate.instant('pTagListView.validationMessages.deleteTagConfirmation'),
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
              this.fetchData();
              this.dataService.SwalSuccessMsg(res.message);
            }
          });
        }
      })

      
    }else if (action == this.translate.instant('personalizationTagsComponent.editTagLbl')){
      //let pTagIndx = this.tagsData.findIndex(x => x.tagId == res.response.tagKey);
      //this.editTagPersonalizationMethod(tagid,this.tagName);
      let filterTag = this.tagsData.filter(x => x.tagId == tagid)[0];
      if(filterTag.activeEdit != 1){
        this.onActionMethod(this.pTagTemplate,action,filterTag);
      }else{
        this.editTagPersonalizationMethod(tagid,this.tagName,filterTag);
      }
    } else if (action == 'viewActiveContent'){
      this.editTagPersonalizationMethod(tagid,this.tagName,filterTag);
    } else if (action == this.translate.instant('personalizationTagsComponent.viewTagsLbl')){
      this. openPTagsModal(pTagTemplate, this.tagKey );
    }
    
    else
    if(action == this.translate.instant('personalizationTagsComponent.copyTagLbl')){
      let filterTag = this.tagsData.filter(x => x.tagId == tagid)[0];
      this.onActionMethod(this.pTagTemplate,action,filterTag);
    }

    // You can perform any other logic or call a function based on the clicked action
  }
  ngbPopoverShowHide(popoverHook: NgbPopover,tagId){
    this.getActiveEditNameMethod(tagId);
    if (popoverHook.isOpen()) {
			popoverHook.close();
		} else {
			popoverHook.open();
		}
  }
  onCheckOptionEditDisabled(itemObj){
    let isActiveEdit = itemObj.activeEdit;  
    if(isActiveEdit == 1)  {
      this.activeEditAlreadyPresent = itemObj.tagId;
      this.disabledEditTagFlag = true;
      this.disableForEditOnly = this.translate.instant('personalizationTagsComponent.editTagLbl');
    }
  }
  onActionMethod(popupModal,name,itemObj){
    //this.tagKey = this.dataService.activeContentTagKey;
    let filterTag = this.tagsData.filter(x => x.tagId == this.tagKey)[0];
    let isActiveEdit = itemObj.activeEdit;   
    if(name == this.translate.instant('personalizationTagsComponent.editTagLbl')){
        this.showCopyPopupEnabled = false;
        this.showViewTagPopupEnabled = false;
        this.showEditPopupEnabled = true;
        this.getActiveEditNameMethod(itemObj.tagId); 
        this.warningEditMessageLbl = "";
        this.warningEditMessageLbl = this.translate.instant('personalizationTagsComponent.showEditPopupMessageLbl');
        this.warningEditMessageLbl = this.warningEditMessageLbl.replace('{Name}',"'"+this.currentTagFocusObj.tagName+"'").replace("{activeName}","'"+this.currentTagFocusObj.activeEditName+"'");
        this.openActiveEditandCopyPopupMethod(popupModal);
    }else if(name == this.translate.instant('personalizationTagsComponent.copyTagLbl')){
      this.showEditPopupEnabled = false;      
      this.showViewTagPopupEnabled = false;
      this.showCopyPopupEnabled = true;
      this.getActiveCopyNameMethod(itemObj.tagId); 
      this.warningCopyMessageLbl = "";
      this.warningCopyMessageLbl = this.translate.instant('personalizationTagsComponent.showCopyPopupMessageLbl');
      this.warningCopyMessageLbl = this.warningCopyMessageLbl.replace('{Name}',"'"+this.currentTagFocusObj.tagName+"'").replace("{activeName}","'"+this.currentTagFocusObj.copyName+"'");
      this.openActiveEditandCopyPopupMethod(popupModal);
    }
  }
  getActiveEditNameMethod(tagId){
    this.currentTagFocusObj = {};
    let currtTag = this.tagsData.find(x => x.tagId == tagId);
    if(currtTag !== undefined){
      this.currentTagFocusObj = currtTag;
      this.currentTagFocusObj['activeEditName'] = currtTag.tagName+"_edit";
    }
  }
  getActiveCopyNameMethod(tagId){
    this.currentTagFocusObj = {};
    let currtTag = this.tagsData.find(x => x.tagId == tagId);
    if(currtTag !== undefined){
      this.currentTagFocusObj = currtTag;
      this.currentTagFocusObj['copyName'] = currtTag.tagName+"_copy";
    }
  }
  openPTagsModal(pTagTemplate: TemplateRef<any>, tagKey: Number) {
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
openActiveEditandCopyPopupMethod(pTagTemplate: TemplateRef<any>){
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
  applySearch(): void {
   this.getFilteredTags();
    
  }
  getFilteredTags(): void {
    this.tagsData=[...this.tagsDataOriginal];
    this.sortData('tagName');
    this.currentPage=1;
    if(this.searchTag!=='')
    {
      this.tagsData= this.tagsData.filter(tag => tag.tagName.toLowerCase().includes(this.searchTag.toLowerCase()))
      // this.translate.instant('apiPersonalization.searchLbl')
    }
  }
  openOffcanvas() {
    // Set the boolean flag to true to show the offcanvas
    this.isOffcanvasOpen = true;
  }

  closeOffcanvas() {
    // Set the boolean flag to false to hide the offcanvas
    this.isOffcanvasOpen = false;
  }
  sortData(column: string) {
    if (this.sortColumn === column) {
      // Toggle sorting direction if the same column is clicked
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set default sorting direction for a new column
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    // Perform sorting
    this.tagsData.sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      if (aValue === bValue) {
        return 0;
      }

      return this.sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
  }

  favTagPersonalization(tagKey, favourite) {
    let tagName = this.tagsData.find(x => x.tagId == tagKey).tagName;
    this.personalizedTagPerformanceService.favTag(tagKey, favourite).subscribe(res => {
      if(res.status == 'SUCCESS'){
        this.dataService.SwalSuccessMsg(tagName+" "+res.message);
        this.fetchData();
      }
    });
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

}
