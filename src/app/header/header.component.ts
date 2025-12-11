import { Component, OnInit, Input, HostListener, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpService } from '../core/services/http.service';
import { AppConstants } from '@app/app.constants';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { DataService } from '@app/core/services/data.service';
import Swal from 'sweetalert2';
import { SharedataService } from '@app/core/services/sharedata.service';
import { environment } from '@env/environment';
import { GlobalConstants } from '@app/design-channels/common/globalConstants';

import { TranslateService } from '@ngx-translate/core';
export interface Breadcrumb {
  label: string;
  route: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() journeyNameInput: string = '';
  prevJourneyName: string = '';
  promotionKey: number = 0;
  currentUrl: string = '';
  breadcrumbs: Breadcrumb[] = [];
  isShowBreadcrumbs: boolean = false;
  isSetPage: boolean = true;
  isDesign: boolean = false;
  isReview: boolean = false;
  isFinalize: boolean = false;
  isWorkbench: boolean = false;
  isPromoNameEdit: boolean = false;
  isPromoNameLabel: boolean = true;
  lastSavedStep: number = 0;
  runningPromotion: boolean = false;
  isTemplateLibraryMode: boolean = false;
  isPersonalizeTagMode: boolean = false;
  isRuleBuilderActivity: boolean = false;
  isPersonalizedEditor: boolean = false;
  tagDefinition: boolean = false;
  tagSimulation: boolean = false;
  tagFinalize: boolean = false;
  isPersonalizedSimulate: boolean = false;
  isPersonalizedFinal: boolean = false;
  isSavedPersonalizedTags: boolean = false;
  tagKey: any;
  pTagName: any;
  isPublishedPersonalization: any = false;

  // userDetailsSection:boolean = false;
  // userDetailsObj: any;
  private BASE_URL = environment.BASE_URL;
  apiBasedIntegrationPage: boolean = false;
  journeyNameFromBeeEditor: string = '';
  listViewPerformance: boolean = false;
  graphViewPerformance: boolean = false;
  summarisedViewPerformance: boolean = false;
  viewSummarizedEnabledBackArrowshow: any;
  activeEdit = 0;
  fusionAPIJsModuleEnabled: boolean = false;
  isSavedAsQA: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private httpService: HttpService,
    private dataService: DataService,
    private shareService: SharedataService,
    private translate: TranslateService
  ) {
    this.shareService.isPublishEnabledForPersonalization.subscribe((res) => {
      if (res !== undefined) {
        this.isPublishedPersonalization = res;
      }
    });
    this.shareService.onSavedTypePersonalization.subscribe((res) => {
      if(res == 'QA'){
        this.isSavedAsQA = true; 
      }
    });
    //this.getUserDetailsObjJson()
  }

  /* @HostListener('document:click', ['$event'])
  clickout(event) {
    if(event.target.classList.contains("userDetailspopup")) {
        return;
    }
    this.userDetailsSection = false;
  } */

  ngOnInit(): void {
    this.dataService.$sharedPromoKey.subscribe((result) => {
      this.promotionKey = result;
    });
    this.dataService.$lastSavedStep.subscribe((result) => {
      this.lastSavedStep = result;
    });

    this.dataService.$runningPromotion.subscribe((result) => {
      this.runningPromotion = result;
    });

    this.shareService.templateLibrary.subscribe((result) => {
      this.isTemplateLibraryMode = result;
    });

    this.shareService.personalizeTagService.subscribe((result) => {
      this.isPersonalizeTagMode = result;
    });

    this.shareService.ruleBuilder.subscribe((result) => {
      this.isRuleBuilderActivity = result;
    });

    this.shareService.apiBasedIntegrationModule.subscribe((res) => {
      if (res !== undefined) {
        this.apiBasedIntegrationPage = res;
      }
    });
    this.shareService.fusionAPIJsModule.subscribe((res) => {
      if (res !== undefined) {
        this.fusionAPIJsModuleEnabled = res;
      }
    });
    this.shareService.journeyNameFromBeeEditorPtag.subscribe((res) => {
      if (res !== '') {
        this.journeyNameFromBeeEditor = res;
        //this.isPersonalizeTagMode = true;
        //this.isPersonalizedEditor = true;
        this.isPromoNameLabel = true;
        this.isPublishedPersonalization = false;
        this.isShowBreadcrumbs = true;
        this.isSetPage = false;
        this.isTemplateLibraryMode = false;
        this.journeyNameInput = this.journeyNameFromBeeEditor;
        this.getTagKey(true);
      }
    });
    this.dataService.PtagListDasboardEnabled.subscribe((res) => {
      if (res !== undefined) {
        this.listViewPerformance = res;
      }
    });
    this.dataService.PtagGraphDasboardEnabled.subscribe((res) => {
      if (res !== undefined) {
        this.graphViewPerformance = res;
      }
    });
    this.dataService.PtagSummarisedDasboardEnabled.subscribe((res) => {
      if (res !== undefined) {
        this.summarisedViewPerformance = res;
      }
    });
    this.shareService.viewSummarizedEnabled.subscribe((res) => {
      if (res !== undefined) {
        this.viewSummarizedEnabledBackArrowshow = res;
      }
    });
    this.subscribeRouterEvents();
    setTimeout(() => {
      this.getTagKey(false);
    }, 1500);

    this.shareService.activeEditShareObj.subscribe(res => {
      if(res !== undefined){
        this.activeEdit = res.activeEdit;
        console.log(111);
      }      
    });
  }

  ngOnChanges(changes: any) {
    this.prevJourneyName = changes.journeyNameInput.currentValue;
  }

  subscribeRouterEvents() {
    this.router.events.subscribe((event) => {
      //this.isShowBreadcrumbs = true;
      if (event instanceof NavigationEnd) {
        this.showActionButtons(event);
      }
    });
  }
  /* toggleUserDetails(){
    if(this.userDetailsSection){
      this.userDetailsSection = false;
    }else{
      this.userDetailsSection = true;
    }

  }
  getUserDetailsObjJson(){
    this.httpService.get(AppConstants.API_END_POINTS.GET_USER_DETAILS_OBJ).subscribe(res => {
      if(res.body.status === "SUCCESS"){
        this.userDetailsObj = res.body.response;
      }
      console.log(res);
    });
  } */
  showActionButtons(event: any) {
    /* if (event.url.includes(AppConstants.APP_URLS.WORKBENCH)) {
      this.isConfigureChannel = false;
      this.isShowBreadcrumbs = false;
      this.isFinalize = false;
      this.isWorkbench = true;
      return;
    } */

    if (event.url != undefined) {
      if (
        event.url.includes(AppConstants.APP_URLS.EMAIL_TEMPLATE) ||
        event.url.includes(AppConstants.APP_URLS.BEE_EDITOR) ||
        event.url.includes(AppConstants.APP_URLS.TRIGGER_ANALYTICS) ||
        event.url.includes(AppConstants.APP_URLS.DESIGN_PAGE)
      ) {
        if (event.url.includes(AppConstants.APP_URLS.TRIGGER_ANALYTICS)) {
          this.isReview = true;
        } else {
          this.isDesign = true;
        }
        this.isFinalize = false;
        this.isShowBreadcrumbs = true;
        this.isSetPage = false;
        return;
      }

      if (event.url.includes(AppConstants.APP_URLS.FINALSETUP)) {
        this.isFinalize = true;
        this.isDesign = false;
        this.isShowBreadcrumbs = true;
        this.isSetPage = false;
        return;
      }

      if (this.isPersonalizeTagMode) {
        this.isSetPage = false;
        if (event.url.includes(AppConstants.APP_URLS.SAVED_PERSONALIZED_TAGS)) {
          this.isSetPage = true;
          this.isSavedPersonalizedTags = true;
          this.isPersonalizedEditor = false;
          this.isShowBreadcrumbs = false;
          this.isPersonalizedSimulate = false;
          this.tagFinalize = false;
          return;
        }

        if (event.url.includes(AppConstants.APP_URLS.PERSONALIZED_TAGS)) {
          this.isPersonalizedEditor = true;
          this.isShowBreadcrumbs = true;
          this.isPersonalizedSimulate = false;
          this.tagFinalize = false;
          return;
        }
        // if (event.url.includes(AppConstants.APP_URLS.TAG_LIST_PERFORMANCE_DASHBOARD)) {
        //   this.isPersonalizedEditor = false;
        //   this.isShowBreadcrumbs = true;
        //   this.isPersonalizedSimulate = false;
        //   this.tagFinalize = false;
        //   this.listViewPerformance = true;
        //   return;
        // }
        // if (event.url.includes(AppConstants.APP_URLS.TAG_GRAPH_PERFORMANCE_DASHBOARD)) {
        //   this.isPersonalizedEditor = false;
        //   this.isShowBreadcrumbs = true;
        //   this.isPersonalizedSimulate = false;
        //   this.tagFinalize = false;
        //   this.graphViewPerformance = true;
        //   return;
        // }
        // if (event.url.includes(AppConstants.APP_URLS.TAG_SUMMARISED_PERFORMANCE_DASHBOARD)) {
        //   this.isPersonalizedEditor = false;
        //   this.isShowBreadcrumbs = true;
        //   this.isPersonalizedSimulate = false;
        //   this.tagFinalize = false;
        //   this.summarisedViewPerformance = true;
        //   return;
        // }

        if (event.url.includes(AppConstants.APP_URLS.SIMULATE_TAG_PARAMTERS)) {
          this.isPersonalizedEditor = false;
          this.isPersonalizedSimulate = true;
          this.isShowBreadcrumbs = true;
          this.tagFinalize = false;
          return;
        }

        if (event.url.includes(AppConstants.APP_URLS.SAVE_AND_PUBLISH_TAGS)) {
          this.isPersonalizedEditor = false;
          this.isPersonalizedSimulate = false;
          this.isShowBreadcrumbs = true;
          this.isPersonalizedFinal = true;
          return;
        }
      }
    }
  }

  editPromotionName() {
    this.isPromoNameLabel = false;
    this.isPromoNameEdit = true;
  }

  editPersonalizedName() {
    this.isPromoNameLabel = false;
    this.isPromoNameEdit = true;
  }

  savePersonalizedName() {
    let prevJourneyName = this.dataService.activeContentPtagName; //localStorage.getItem('tagNamePersonalization');
    if (this.pTagName != prevJourneyName) {
      let endpoint =
        AppConstants.API_PERSONSOALIZATION_TAGS_END_POINTS.PERSONALIZATION_NAME_RENAME +
        '?tagKey=' +
        this.tagKey +
        '&tagName=' +
        this.pTagName;
      this.httpService.post(endpoint).subscribe((data) => {
        if (data.status == 'SUCCESS') {
          //localStorage.setItem('tagNamePersonalization', this.pTagName);
          //localStorage.setItem('tagKeyPersonalization', data.response.tagKey);
          this.dataService.setSharedActiveContentName = this.pTagName;
          this.dataService.SwalSuccessMsg(data.message);
        } else {
          Swal.fire({
            title: data.message,
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonText: this.translate.instant('designEditor.okBtn'),
          });
        }
      });
    }

    this.isPromoNameLabel = true;
    this.isPromoNameEdit = false;
  }

  savePromotionName() {
    const promoKey = {
      promotionKey: this.promotionKey,
      promotionName: this.journeyNameInput,
    };

    if (this.journeyNameInput != this.prevJourneyName) {
      this.httpService.post(AppConstants.API_END_POINTS.UPDATE_PROMOTION, promoKey).subscribe((data) => {
        if (data.status == 'SUCCESS') {
          this.dataService.SwalSuccessMsg(data.message);
          /* Swal.fire({
              position: 'center',
              icon: 'success',
              title: data.message,
              showConfirmButton: false,
              timer: 1500
            }) */
        }
      });
    }

    this.isPromoNameLabel = true;
    this.isPromoNameEdit = false;
  }

  workbenchPage() {
    this.authService.goToWorkbenchPage();
  }

  designPage() {
    this.authService.goToDesignPage();
  }

  reviewPage() {
    this.authService.goToReviewPage();
  }

  finalizePage() {
    this.authService.goToFinalizePage();
  }

  globalHelpOLH() {
    if(this.fusionAPIJsModuleEnabled){
      this.authService.globalHelpOLH('fusionJsHelpContent');
    }if(this.graphViewPerformance){
      this.authService.globalHelpOLH('AC-performance');
    }else if(this.summarisedViewPerformance){
      this.authService.globalHelpOLH('AC-performance-summary');
    }else{
      this.authService.globalHelpOLH();
    }    
  }

  visualHelpOLH() {
    this.authService.getVisualHelp();
  }

  getTagKey(isCreateMode) {
    this.tagKey = this.dataService.activeContentTagKey; //localStorage.getItem('tagKeyPersonalization');
    if (isCreateMode) {
      this.pTagName = this.dataService.activeContentPtagName; //localStorage.getItem('tagNamePersonalization');
      //this.pTagName = JSON.parse(this.pTagName);
    } else {
      this.pTagName = this.dataService.activeContentPtagName; //localStorage.getItem('tagNamePersonalization');
    }
  }

  reloadToMethod(loadPageNameDynamic) {
    window.parent.location.href =
      this.BASE_URL + '/personalizationTags/' + loadPageNameDynamic + '?tagKey=' + this.tagKey;
    //window.parent.location.href = this.BASE_URL + '/personalizationTags/ptagWizRedirectTo?tagKey=' + this.tagKey;
  }

  goToPersonalizationTagsPage() {
    let flagPtagSaveOrNot = this.checkIfPtagHasSavedMethod(this.dataService.activeContentPtagName);
    if (flagPtagSaveOrNot) {
      // if name not defined then alert it.
      Swal.fire({
        title: this.translate.instant('header.personalisationTags.savePtagValidationbeforeExitLbl'),
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: this.translate.instant('designEditor.okBtn'),
      });
      return;
    } else {
      // if name Saved then redirect to main page
      window.open(`${this.BASE_URL}/personalizationTags/loadPersonalizationTags`, '_parent');
    }
  }
  checkIfPtagHasSavedMethod(name) {
    this.tagKey = this.dataService.activeContentTagKey; //localStorage.getItem('tagKeyPersonalization');
    let flag = false;
    if (this.isPersonalizedEditor) {
      if (name === null && this.tagKey != '-1' && !this.isPublishedPersonalization) {
        flag = true;
      } else {
        flag = false;
      }
    } else {
      flag = false;
    }
    return flag;
  }

  /* ssoLogout(){
        //if(isSSO){
          // var iframe = document.getElementById("t1_logout_iframe");
      
          // if (iframe) {
      
          //    var iframeContent:any = (iframe.textContent);
      
          //    try{
          //      iframeContent.logout();
          //    }catch(e){
          //   //alert('T1 to c360 function:' + e);
          //    }
          // }
      
          // }
      window.parent.location.href = this.BASE_URL;//+'/login/logout';
  } */
}
