import { Component, OnInit, ViewChild, Input, Output, EventEmitter, TemplateRef, NgZone, HostListener, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import BeefreeSDK from '@beefree.io/sdk';
import { HttpService } from '@app/core/services/http.service';
import { GlobalConstants } from '@app/design-channels/common/globalConstants';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SharedataService } from '@app/core/services/sharedata.service';
import { environment } from '@env/environment';
import { AppConstants } from '@app/app.constants';
import Swal from 'sweetalert2';
import { LoaderService } from '@app/core/services/loader.service';
import { MergeTagsComponent } from '@app/design-channels/merge-tags/merge-tags.component';
import emptyJson from '../../../assets/JSON/emptyEmail.json';
import customAddedFonts from '../../../assets/fonts/custom-fonts.json';

import { TranslateService } from '@ngx-translate/core';
import { DisplayConditionComponent } from '@app/design-channels/display-condition/display-condition.component';
import { OpenModalComponent } from '@app/design-channels/open-modal/open-modal.component';
import { SaveUserRowsComponent } from '@app/design-channels/save-user-rows/save-user-rows.component';
import { forkJoin } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { TagResponseParamtersComponent } from '@app/personalization-tags/tag-response-paramters/tag-response-paramters.component';
import { CacheControlComponent } from '@app/personalization-tags/cache-control/cache-control.component';
import { DMECustomerComponent } from '../dme-customer-noncustomer/dme-customer/dme-customer.component';
import { RecommendationOffersComponent } from '@app/design-channels/recommendation-offers/recommendation-offers.component';
import beeFreeModulesJSON from '@assets/JSON/beeFreeModulesJSON.json';
import { ApiPersonalizationComponent } from '@app/personalization-tags/api-personalization/api-personalization.component';
import { SimulateTagParamtersComponent } from '@app/personalization-tags/simulate-tag-paramters/simulate-tag-paramters.component';
import { ProductOffersComponent } from '@app/design-channels/product-offers/product-offers.component';
import { RatingsComponent } from '@app/design-channels/ratings/ratings.component';
import { DMENonCustomerComponent } from '../dme-customer-noncustomer/dme-non-customer/dme-non-customer.component';
import { DMEOffersComponent } from '@app/design-channels/dme-offers/dme-offers.component';
import { DataService } from '@app/core/services/data.service';
import { GlobalMergeTagsComponent } from '@app/design-channels/global-merge-tags/global-merge-tags.component';
import { CopyClipboardComponent } from '@app/utils/copy-clipboard/copy-clipboard.component';
import { TextAddonsComponent } from '@app/design-channels/text-addons/text-addons.component';
import { ImageAddonsComponent } from '@app/design-channels/image-addons/image-addons.component';
import { MapAddonsComponent } from '@app/design-channels/map-addons/map-addons.component';
import { ImageQualitySettingsComponent } from '../image-quality-settings/image-quality-settings.component';
import { v4 as uuidv4 } from 'uuid';
import { RandomNameService } from '@app/core/services/random-name.service';
import { StackedBarComponent } from '@app/design-channels/stacked-bar/stacked-bar.component';
import { EnsembleAIComponent } from '@app/design-channels/ensemble-ai/ensemble-ai.component';
import { ActiveContentComponent } from '@app/design-channels/active-content/active-content.component';
import { LocaleService } from '@app/core/services/locale.service';
import { BadgingWidgetComponent } from '@app/design-channels/badging-widget/badging-widget.component';

interface CustomFieldValue {
  id: string;
  maxWidth: {
    enable: boolean;
    width: number;
  },
  viewPort: {
      enable: boolean;
      value: string;
  };
  condition: {
      enable: boolean;
      value: string;
  };
}


@Component({
  selector: 'app-bee-editor-global',
  templateUrl: './bee-editor-global.component.html',
  styleUrls: ['./bee-editor-global.component.scss']
})
export class BeeEditorGlobalComponent implements OnInit {
  @ViewChild('simulateViewContent') simulateViewContentElement!: SimulateTagParamtersComponent;
  @ViewChild('emailContainer') container: any;
  @ViewChild(CopyClipboardComponent) copyClipboard!: CopyClipboardComponent;
  @Output() parentEditorFunction: EventEmitter<any> = new EventEmitter();
  @Input()
  isEdit: string = 'block';
  designForChannels = 'Edit design for';
  @Output() getSubjectVal = new EventEmitter<any>();
  @Output() callSubjectMethod = new EventEmitter<any>();
  @ViewChild('tagParametersPopupEvents') tagParametersEventCall!:TagResponseParamtersComponent;
  @ViewChild('pTagTemplate') pTagTemplate!: ElementRef;
  bsModalRef: any = BsModalRef;
  //emptyUrl = "https://beefree.io/wp-json/v1/catalog/templates/4851";//"http://localhost:3000/saveMessage?uuid=1";
  errorMessage: any;
  templateObj: any;
  widthValue = false;
  modalRef?: BsModalRef;
  _urlPath: any = '';
  customClass = 'customClass';
  count: number = 0;
  capturedImage: any;
  isTemplateEditMode: boolean = false;
  beeTest: any;
  subjctObj: any;
  promotionObj: any;
  vendorObj: any;
  getThumbnailObj: any;
  channelObj: any;
  @Input() templateKey: any = GlobalConstants.templateKey;
  private BASE_URL = environment.BASE_URL;
  private FONT_URL = environment.FONT_URL;
  isTestEmail: boolean = false; // use for Test Email
  currentSplitId: any;
  commChannelKey: any;
  promoKey: any;
  vendorDataObj: any = [];
  modelConfigClass = {};
  promoCommunicationKey: any;
  isSaveAsTemplate: any = false;
  isDefaultStorageBEE: any;
  isFailSafeEnabled: boolean = false;
  companyKey: any;
  failsafeInfo: any;
  failsafeSubjectObj: any = { preHeader: '', subject: '' };
  failsafeSubjctObj: any;
  finalPayload: any;
  isFailSafeTabActive: boolean = false;
  payloadWithoutFailsafe: any;
  payloadWithFailsafe: any;
  isFailSafeCurrentTab: any;
  isFailSafePreviousTab: any;
  isTemperarySave: any;
  templateId: any;
  offerTempObj: any[] = [];
  recoTempObj: any[] = [];
  offerFailsafeTempObj: any[] = [];
  editModeSavedObj: any;
  isSubjectAreaEnable: boolean = true;
  isTemplateLibraryMode: boolean = false;
  isPersonalizeTagMode: boolean = false;
  isEmptyJsonToloadInBeeEditor: boolean = false;
  varArgsMergeTags: any = [];
  maxRRWidgetCount: any;
  domParser = new DOMParser();
  showActionListpopup: boolean = false;
  isViewMode: boolean = false;
  beeHtml: any;
  beeJson: any;
  isPreviewOnClientEnable: boolean = false;
  isSpamTestEnable: boolean = false;
  previewOnClientTemplate: any;
  spamTestTemplate: any;
  senderId: any;
  vendorId: any;
  isSpamTestEnableFailsafe: boolean = false;
  isPreviewOnClientEnableFailSafe: boolean = false;
  testEmailTemplate: any;
  DEFAULT_LANGUAGE: string = '';
  langEditorConfig: any = { en: 'en-US', ja: 'ja-JP', fr: 'fr-FR' };
  contextFlagToShowPersonalization: boolean = true;
  tempAddOnList: any = [];
  isAddOnModuleEnable: boolean = true;
  modulesGroupsCMP: any = [];
  isMergeTagDmeEnabled: boolean = true;
  isMergeTagBttnDisabled: boolean = false;
  displayConditionsFinal: any;
  isFullPreviewEnabled: boolean = false;
  fullPreviewPayload:any;
  fullPreviewBtnDisabled: boolean = false;

  mergeTagModal:boolean = false;
  isTagParameterEnabled:boolean= false;
  isCacheControlEnabled:boolean = true;
  tagParamsPersonalized: any;
  cacheControlHrsVal: any = 0; // default is 0
  tagkey: any;
  failsafeTemplateText: any = "";
  failsafeJsonObj: any = "";
  isPersonalizationPublish: boolean = false;
  personalizedTemplateTextHtml: any = "";
  personalizedTemplateJsonObj: any = "";
  editModeJsonObj: any;
  isPublishedPersonalization:boolean = false; //= localStorage.getItem('isViewPersonalizationEnable');
  callSimulateAfterSave: boolean = false;
  tagParamsArryObj: any = [];
  @Input() ngCloak:boolean = false;
  productAttributesArry: any = [];
  disableSimulateTillOpen: boolean = false;
  isPtagNameSaved: boolean = false;
  licenseType: any;
  activeEditObj:any =  {};
  warningActiveContentBeforePublishMsg: string = '';
//  templateElementRef = this.pTagTemplate.nativeElement;
  basePTagUrl: any = environment.BASE_PTAGS_URL;
  CLOUD_FRONT_URL: any = environment.CLOUD_FRONT_URL;
  additionalScriptURL: any;
  ptagSimulateUrlBasePath: any = '';
  inlineJSScriptURL: any;
  tenentPriviledgeEditDisabled: boolean = false;
  customFontsObj: any;
  imageQualitySettingsObj: any = {'imageType':'JPG','imageQuality':'80'};
  ensembleAiEnabled: boolean = false;
  savedType: string = '';
  editAfterPublish: boolean = false;

  constructor(
    private http: HttpService,
    private modalService: BsModalService,
    private shareService: SharedataService,
    private router: Router,
    private loader: LoaderService,
    private ngZone: NgZone,
    private translate: TranslateService,
    private dataService: DataService,
    private randomNameService: RandomNameService,
    private localeService: LocaleService
  ) {
    // this.shareService.isPublishEnabledForPersonalization.subscribe((res) => {
    //   if(res !== undefined){
    //     this.isPublishedPersonalization = res; 
    //   }
    // });
    try {
      this.beeTest = new BeefreeSDK(this.localeService.beeToken);
    } catch (error) {
      console.error('Beefree initialization failed:', error);
    }
    
    GlobalConstants.beeTest = this.beeTest;
    this.customFontsObj = customAddedFonts.map(font => {
      return {
        ...font,
        url: font.url.replace('{baseUrl}', this.FONT_URL)
      };
    });
   
    this.shareService.setActiveLanguage.subscribe((res) => {
      this.DEFAULT_LANGUAGE = res;
    });
    this.shareService.promoKeyObj.subscribe((res) => {
      this.promotionObj = res;
      this.loadChannelObj();
    });
    this.shareService.isDefaultStorageBee.subscribe((res) => {
      this.isDefaultStorageBEE = res; // boolean value
    });
    this.shareService.failSafeTabActive.subscribe((res) => {
      this.isFailSafeTabActive = res;
    });
    this.shareService.failSafeEnable.subscribe((res) => {
      this.isFailSafeEnabled = res;
    });
    this.shareService.failSafeCurrentTab.subscribe((res) => {
      this.isFailSafeCurrentTab = res;
    });
    this.shareService.failSafePreviousTab.subscribe((res) => {
      this.isFailSafePreviousTab = res;
    });

    this.shareService.personalizeTagService.subscribe((res) => {
      this.isPersonalizeTagMode = res;
    });
    this.shareService.tagParametersObjArry.subscribe((res) => {
      if(res !== undefined){
        this.tagParamsArryObj = res;
      }      
    });
    this.temparySaveChannelData();
    // loads empty json into bee editor.
    this.shareService.isEmptyJsonToload.subscribe((res) => {
      this.isEmptyJsonToloadInBeeEditor = res;
    });
    // this.shareService.getPersonalizationParameterTagObj.subscribe((res:any) =>{
    //   if(res !== undefined){
    //     this.tagParamsPersonalized = res;
    //   }
    // });
    this.shareService.getCacheControlHrsVal.subscribe((res:any) => {
      if(res !== undefined && res !== ""){
        this.cacheControlHrsVal = res;
      }else{
        this.cacheControlHrsVal = 0;
      }
    });
    this.shareService.getImageQualitySettingsObj.subscribe((res:any) => {
      if(res !== undefined && res !== ""){
        this.imageQualitySettingsObj = res;
      }
    });

    this.dataService.$sharedTenantKey.subscribe((result) => {
      if(result !== undefined) {
        this.companyKey = result;
      }
    });
    
    this.shareService.tagParameterDefinedStatus.subscribe((res:any) => {   
      if(res !== undefined){
        this.isTagParameterEnabled = res;
      }  
    });
    //this._urlPath = GlobalConstants.urlPath;
    // if (this.isTemplateLibraryMode && this.isEmptyJsonToloadInBeeEditor) {
    //   this._urlPath = undefined;
    // }
    //this.isTemplateEditMode = GlobalConstants.isEditMode;
    this.getTagKeyMethod();
    //this.tagkey = GlobalConstants.personalizationGlobalTagKey;    
    this.editPersonalizationTag();
  }
  temparySaveChannelData() {
    this.shareService.isTemperarySave.subscribe((res) => {
      this.isTemperarySave = res;
    });
  }
  async discardDrafMethod(obj){
      let endpoint = AppConstants.API_END_POINTS.GET_DISCARD_PTAG_API;
      let payload = {"tagKey":this.activeEditObj.tagId};
      Swal.fire({
        title: this.translate.instant('beeEditorGlobalComponent.discardDraftConfirmationLbl'),
        icon:'warning',
        showCloseButton: false,
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
        if (result.value) {
          const result = await this.http.post(endpoint,payload).toPromise();
          if (result.status == 'SUCCESS') {      
            this.dataService.SwalSuccessMsg(result.message);
            //window.open(`${this.BASE_URL}/personalizationTags/definePersonalization?tagKey=` + this.activeEditObj.tagId, '_parent');            
            // setTimeout(() => {
            //   this.ngZone.run(() => {
            //     //this.editPersonalizationTag();
            //     this.getBeeEditorLoadObj(this._urlPath); 
            //   });  
            // }, 1000);      
            this.editPersonalizationTag();
            //setTimeout(() => {
              this.ngZone.run(() => {
              this.reloadBeeEditor(this.editModeJsonObj.templateJson);
            //}, 1000);
              });
             
          }
        } else {

        }
      });
      
  }
  loadChannelObj() {
    //this.shareService.channelObj.subscribe(res => {
    this.channelObj = GlobalConstants.channelObj;
    this.loadThumbnailObj();
    //});
  }
  loadThumbnailObj() {
    this.shareService.thumnailImages.subscribe((imgObj) => {
      this.getThumbnailObj = JSON.stringify(imgObj);
      this.loadCurrentChannelObj();
    });
  }
  loadCurrentChannelObj() {
    this.shareService.currentSelectedChannelObj.subscribe((res: any) => {
      this.currentSplitId = res.currentSplitId;
      this.promoKey = res.promotionKey;
      this.commChannelKey = res.commChannelKey;
      this.promoCommunicationKey = res.currentPromoCommKey;
      this.companyKey = res.companyKey;
    });
  }
  ensembleFlagCheckMethod(payload){
    let ensembleFlag:any = payload || '';
    let flag = ensembleFlag.includes("type='eapi'");
    return flag;
  }
  getBeeEditorLoadObj(url) {
    this.ngCloak = true;
    this.loader.ShowLoader();
    if (this.isTemplateEditMode) {
      // Load saved Template
      //this.shareService.savedTemplateObj.subscribe((data: any) => {
        //this.editModeSavedObj = data;
        //const json = data.find((x) => x.promoSplitKey == this.currentSplitId);
        let json = this.editModeJsonObj;
        this.isFailSafeEnabled = json.failSafe;
        if (!this.isFailSafeEnabled || this.isFailSafeEnabled) {
          // let subjtObj = this.updateEditModeSubjectObj(json);
          // subjtObj.preHeader = json.preHeader;
          // subjtObj.subject = json.subjectLine;
          // //this.shareService.updateSubjectPreheader.next(subjtObj);
          // this.subjctObj = subjtObj;
          const payload = this.createSaveJsonForEmailChannel(json.templateJson, json.templateText);
          this.payloadWithoutFailsafe = payload;
          this.ensembleAiEnabled = this.ensembleFlagCheckMethod(json.templateText);
          GlobalConstants.ensembleAiEnabled = this.ensembleAiEnabled;
        }
        if (this.isFailSafeEnabled) {
          // let subjtObj = this.updateEditModeSubjectObj(json);
          // this.failsafeSubjectObj.preHeader = json.failSafePreHeader;
          // this.failsafeSubjectObj.subject = json.failSafeSubjectLine;
          // this.failsafeSubjctObj = subjtObj;
          //this.shareService.failSafSubjectObj.next(subjtObj);
          const payload = this.createSaveJsonForfailSafeEmailChannel(json.failSafeTemplateJson, json.failSafeTemplateText);
          this.payloadWithFailsafe = payload;
          this.ensembleAiEnabled = this.ensembleFlagCheckMethod(json.failSafeTemplateText);
          GlobalConstants.ensembleAiEnabled = this.ensembleAiEnabled;
        }
        this.templateObj = JSON.parse(json.templateJson);
        //this.templateKey = json.templateUuid; // templateUUID
        //this.templateId = json.templateParentKey; // templateKey
        //this.shareService.beeTemplateSelectedKey.next(json.templateParentKey);
        //this.shareService.isEditmode = true;
        // let subjectObj = {
        //   channelKey: json.commChannelKey,
        //   senderConfigKey: json.senderKey,
        //   senderId: json.senderId,
        //   senderName: json.senderName,
        //   subject: json.subjectLine,
        //   preHeader: json.preHeader,
        //   vendorDesc: json.senderName,
        // };
        // this.shareService.subjectObj.next(subjectObj);

        /* To get saved RR widget Id - start */
        let htmlDocTemp = this.domParser.parseFromString(json.templateText, 'text/html');

        htmlDocTemp.querySelectorAll('.cmp-widget').forEach((item) => {
          let w = item.id;
          var wf = w.substring(1);
          if (parseInt(wf) >= GlobalConstants.rrWidgetCount) {
            GlobalConstants.rrWidgetCount = parseInt(wf) + 1;
          }
        });
        /* To get saved RR widget Id - end */
          this.getBeeConfigSettings(this.templateObj);
        this.loader.HideLoader();
      //});
    } else {
      // Load Pre-build template
      this.getTemplateData(url);
    }
  }
  getTemplateData(url: string) {
    if (url !== undefined && url !== '') {
      // if It is Pre-build templates
      if (this.isDefaultStorageBEE !== undefined) {
        if (this.isDefaultStorageBEE) {
          this.http.BeePost(url).subscribe((data: any) => {
            this.templateObj = data.body.json_data;
            this.templateId = 10101010; // Dummy Value for Default Bee Template
            this.getBeeConfigSettings(this.templateObj);           
            this.loader.HideLoader();
          });
        } else {
          //--- if it is S3 templates
          this.http.get(url).subscribe((data: any) => {
            this.templateId = data.body.templateKey;
            this.templateObj = data.body.json_data;
            this.getBeeConfigSettings(this.templateObj);
            this.loader.HideLoader();
          });
        }
      }
    } else {
      this.getBeeConfigSettings(emptyJson.json);    
      //this.loader.HideLoader();
    }
  }
  updateEditModeSubjectObj(jsonObj) {
    let subjectObj = {
      senderConfigKey: jsonObj.senderKey,
      senderId: jsonObj.senderId,
      senderName: jsonObj.senderName,
      subject: '',
      preHeader: '',
      vendorDesc: jsonObj.vendorDesc,
      vendorId: jsonObj.senderKey,
    };
    return subjectObj;
  }
  
  async getTagKeyMethod(){
    try {
      //let tagKeyStored:any = this.dataService.activeContentTagKey; //localStorage.getItem("tagKeyPersonalization");
      this.tagkey = this.dataService.activeContentTagKey;      
      await this.loadLicencingTypeMethod();
    } catch (error) {
      console.error("An error occurred in getTagKeyMethod:", error);
    }
  }
  createSaveJsonForfailSafeEmailChannel(jsonFile, htmlFile) {
    this.getTagKeyMethod();
    this.failsafeTemplateText = htmlFile;
    this.failsafeJsonObj = jsonFile;   
    this.shareService.onPublishEnableForPersonalization.subscribe(res => {
      if(res !== undefined){
        this.isPersonalizationPublish = res;
      }
    });
    this.shareService.onSavedTypePersonalization.subscribe(res => {
      if(res !== undefined){
        this.savedType = res;
      }
    });
    const payload = //{
      //channels: [
        {
          "tagKey" : this.tagkey,
          "templateText" :this.personalizedTemplateTextHtml,
          "templateJson" : this.personalizedTemplateJsonObj,
          "failSafe" : this.isFailSafeEnabled,
          "failSafeTemplateText" :this.failsafeTemplateText,
          "failSafeTemplateJson" : this.failsafeJsonObj,
          "cacheControl" :this.cacheControlHrsVal,
          "imageSettings":this.imageQualitySettingsObj,
          "currentStep":2,
          "status" : "1",
          "publish" : this.isPersonalizationPublish,
          "editorType": GlobalConstants.editorType,
          "savedType" : this.savedType,
        }       
        
      //],
   // };    
    this.payloadWithoutFailsafe = payload;
    return payload; 
  }

  addStyleAndScriptInFinalHtml(htmlString) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');
      const styleElement = document.createElement('style');
      const ratingElement = doc.querySelector('#rating-parent-section');
      const headElement = doc.head || doc.getElementsByTagName('head')[0];

      const cssRules = `.rating-parent-section{background:#000}[data-star]{text-align:left;font-style:normal;display:inline-block;position:relative;unicode-bidi:bidi-override;line-height:0;vertical-align:middle}[data-star]::before{display:inline-block;content:'★★★★★';color:#eee;line-height:1.4}[data-star]::after{white-space:nowrap;position:absolute;top:0;left:0;content:'★★★★★';width:0;color:inherit;overflow:hidden;line-height:1.5}[data-star^="0.1"]::after{width:2%}[data-star^="0.2"]::after{width:4%}[data-star^="0.3"]::after{width:6%}[data-star^="0.4"]::after{width:8%}[data-star^="0.5"]::after{width:10%}[data-star^="0.6"]::after{width:12%}[data-star^="0.7"]::after{width:14%}[data-star^="0.8"]::after{width:16%}[data-star^="0.9"]::after{width:18%}[data-star^="1"]::after{width:20%}[data-star^="1.1"]::after{width:22%}[data-star^="1.2"]::after{width:24%}[data-star^="1.3"]::after{width:26%}[data-star^="1.4"]::after{width:28%}[data-star^="1.5"]::after{width:30%}[data-star^="1.6"]::after{width:32%}[data-star^="1.7"]::after{width:34%}[data-star^="1.8"]::after{width:36%}[data-star^="1.9"]::after{width:38%}[data-star^="2"]::after{width:40%}[data-star^="2.1"]::after{width:42%}[data-star^="2.2"]::after{width:44%}[data-star^="2.3"]::after{width:46%}[data-star^="2.4"]::after{width:48%}[data-star^="2.5"]::after{width:50%}[data-star^="2.6"]::after{width:52%}[data-star^="2.7"]::after{width:54%}[data-star^="2.8"]::after{width:56%}[data-star^="2.9"]::after{width:58%}[data-star^="3"]::after{width:59%}[data-star^="3.1"]::after{width:61%}[data-star^="3.2"]::after{width:63%}[data-star^="3.3"]::after{width:65%}[data-star^="3.4"]::after{width:66%}[data-star^="3.5"]::after{width:67%}[data-star^="3.6"]::after{width:68%}[data-star^="3.7"]::after{width:69%}[data-star^="3.8"]::after{width:70%}[data-star^="3.9"]::after{width:71%}[data-star^="4"]::after{width:77%}[data-star^="4.1"]::after{width:82%}[data-star^="4.2"]::after{width:83%}[data-star^="4.3"]::after{width:84%}[data-star^="4.4"]::after{width:85%}[data-star^="4.5"]::after{width:87%}[data-star^="4.6"]::after{width:88%}[data-star^="4.7"]::after{width:89%}[data-star^="4.8"]::after{width:90%}[data-star^="4.9"]::after{width:97%}[data-star^="5"]::after{width:100%}`;
  
      styleElement.textContent = cssRules;

      if (headElement) {
        // Append the style element to the head
        if (ratingElement) {
          headElement.appendChild(styleElement);
        }
        const headContent = new XMLSerializer().serializeToString(headElement);
        // Replace the head content in the original HTML
        htmlString = htmlString.replace(/<head>[\s\S]*?<\/head>/i, `<head>${headContent}</head>`);
        /* htmlString = htmlString.replace("<style>", 
          `<script type="text/javascript" src="${this.CLOUD_FRONT_URL}/resources/js/masterJS-BEE.js"></script>
          <script type="text/javascript" src="${this.CLOUD_FRONT_URL}/resources/js/michealsLogic/michealsDeallogic.js"></script>
          <style>`
        ); */
        const scriptTag = `<script type="text/javascript" id="masterJS" src="${this.CLOUD_FRONT_URL}/resources/js/masterJS-BEE.js"></script>`;
        const additionalScript = this.additionalScriptURL ? `<script type="text/javascript" id="additionalSrc" src="${this.additionalScriptURL}"></script>` : '';
        const inlineJSURL = this.inlineJSScriptURL ? `<script type="text/javascript" id="inlinejsSrc" src="${this.inlineJSScriptURL}"></script>` : '';
        const newScript = `${scriptTag} ${additionalScript} ${inlineJSURL}`;

        // Remove specific <script> tags with id 'masterJS' and 'additionalSrc'
        htmlString = htmlString.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, (match) => {
          // Check if the script tag contains the id 'masterJS' or 'additionalSrc'
          if (match.includes('id="masterJS"') || match.includes('id="additionalSrc"') || match.includes('id="inlinejsSrc"')) {
              return ''; // Remove the script tag
          }
          return match; // Keep the other script tags
        });

        // Now add the new script tags
        htmlString = htmlString.replace("</head>", newScript+"</head>");
        // Only add the ng-app and ng-controller if they are not already present in the <body> tag
        if (!/ng-app="pTagApp"/i.test(htmlString) && !/ng-controller="pTagController"/i.test(htmlString)) {
          htmlString = htmlString.replace(/<body(.*?)>/i, '<body$1 ng-app="pTagApp" ng-controller="pTagController">');
        }
      }
      // Now, htmlString contains the updated HTML content
      return htmlString;
  }

  editRowInFinalHtml(jsonFile) {
    if(jsonFile == null) {
      return;
    }
    let newjsonFile = JSON.parse(jsonFile);    
    let selectedRowId = GlobalConstants.selectedRowId;
    const rows = newjsonFile.page.rows;

    rows.forEach(row => {
      const metadata = row.metadata;
      const displayCondition = row.container.displayCondition;
      if (metadata && displayCondition) {
        if (displayCondition.before.includes(`id='${selectedRowId}'`)) {
            const selectedValue = JSON.parse(GlobalConstants.globalEditableRowData || "{}");
            const selectedDisplayCondition = GlobalConstants.globalEditableRowDisplayCond;
            metadata.selectedValue = JSON.stringify(selectedValue);
            /* const { apiName, layout, maxCount, freeStyle, input_params } = selectedValue;
            displayCondition.before = displayCondition.before
                .replace(/apiName='.*?'/, `apiName='${apiName}'`)
                .replace(/layout='.*?'/, `layout='${layout}'`)
                .replace(/maxCount='.*?'/, `maxCount='${maxCount}'`)
                .replace(/freeStyle='.*?'/, `freeStyle='${freeStyle}'`)
                .replace(/parameterValues='.*?'/, `parameterValues='${input_params}'`); */
            const rowStyleMatch = displayCondition.before.match(/rowStyle='([^']*)'/);
            const layoutMatch = selectedDisplayCondition.before.match(/layout='([^']*)'/);
            if (rowStyleMatch) {
                const rowStyleValue = rowStyleMatch[1]; // The captured value of rowStyle
                selectedDisplayCondition.before = selectedDisplayCondition.before.replace(/rowStyle='.*?'/, `rowStyle='${rowStyleValue}'`);
            }
            const layoutStyleMatch = displayCondition.before.match(/layoutStyle='([^']*)'/);
            if (layoutStyleMatch) {
                const layoutStyleValue = layoutStyleMatch[1]; // The captured value of layoutStyle
                selectedDisplayCondition.before = selectedDisplayCondition.before.replace(/layoutStyle='.*?'/, `layoutStyle='${layoutStyleValue}'`);
            }
            if(layoutMatch[1] == 'layout0') {
              selectedDisplayCondition.before = selectedDisplayCondition.before
              .replace(/rowStyle='.*?'/, '')
              .replace(/layoutStyle='.*?'/, '');
            }
            displayCondition.before = selectedDisplayCondition.before;
            displayCondition.description = selectedDisplayCondition.description;
            displayCondition.type = selectedDisplayCondition.type;
        }
      }
    });

    this.templateObj = newjsonFile;
    return JSON.stringify(newjsonFile);
  }

  addImageCondInFinalHtml(htmlString, jsonData) {
    if(htmlString == null) {
      return;
    }
    let updatedHtmlString = htmlString;
    const customFieldImageValue = this.findImageCustomFieldValues(JSON.parse(jsonData));
    GlobalConstants.globalImageData = customFieldImageValue;

    const customFieldTextValue = this.findTextCustomFieldValues(JSON.parse(jsonData));
    GlobalConstants.globalAdvTextData = customFieldTextValue;

    // Add ng-if="true" attribute to each found <img> tag
    if(customFieldImageValue.length > 0) {
      customFieldImageValue.forEach((item) => {
       /*  let images = doc.querySelectorAll('img[title="'+item.id+'"]');
        images.forEach(img => {
          if(item.condition.enable) {
            img.setAttribute('data-ng-if', item.condition.value);
          } 
        });
      });
      updatedHtmlString = new XMLSerializer().serializeToString(doc);  */

      const regex = new RegExp(`(<div[^>]*>)([^<]*<a[^>]*>)?([^<]*<img[^>]*title="${item.id}"[^>]*>)([^<]*</a>)?([^<]*</div>)`, 'g');
        updatedHtmlString = updatedHtmlString.replace(regex, (match, p1, p2, p3, p4, p5) => {
          let divMatch = p1;
          const aMatch = p2 || '';
          let imgMatch = p3;
          const closingAMatch = p4 || '';
          const closingDivMatch = p5;

          //divMatch = divMatch.replace(/max-width:\s*\d+px/, `max-width:${item.maxWidth.width}`);
          divMatch = divMatch.replace(/(max-width:\s*)\d+/, `max-width:${item.maxWidth.width}`);
          imgMatch = imgMatch.replace(/width="\d+"/, `width="${item.maxWidth.width}"`);

          if(item.condition.value != "") {
            const ngIf = `data-ng-if="${item.condition.value}"`;
            // Check if data-ng-if already exists in the div tag
            if (divMatch.includes('data-ng-if')) {
              // Update the existing data-ng-if attribute
              divMatch = divMatch.replace(/data-ng-if="[^"]*"/, ngIf);
            } else {
              // Add the ngIf to the div tag
              divMatch = divMatch.replace(/>/, ` ${ngIf}>`);
            }
          }
        
          let style = '';
          if (item.viewPort.value) {
            // Replace any existing style attribute with the new one
            style = `style="${item.viewPort.value}"`;
            // Remove any existing style attribute from the img match
            imgMatch = imgMatch.replace(/style="[^"]*"/, '');

            // Replace the img part in the match with the updated style if needed
            if (style) {
              imgMatch = imgMatch.replace(/>/, ` ${style}>`);
              divMatch = divMatch.replace(/style="([^"]*)"/, 'style="$1; width:100%;padding-top:100%;position:relative;display:flex;"');
            }         
          } 
        
          // Return the updated match with the updated div, a (if exists), and img parts
          return `${divMatch}${aMatch}${imgMatch}${closingAMatch}${closingDivMatch}`;
        });
      });
    }

    if(customFieldTextValue.length > 0) {
      customFieldTextValue.forEach((textItem) => {
        const regex = new RegExp(`(<td[^>]*>)(<div[^>]*><section[^>]*><div[^>]*id="parentTextDiv"[^>]*title="${textItem.id}"[^>]*>.*?</div></section></div></td>)`,'g');
        if(textItem.condition) {
          if(!textItem.selectedSpaceOption) { //selectedSpaceOption always be true eaither condition is true or false
            updatedHtmlString = updatedHtmlString.replace(regex, (match, tdStart, tdContent) => {
              // Remove any existing ng-if attribute
              tdStart = tdStart.replace(/\s*data-ng-if="[^"]*"/, '');
              // Add the new `ng-if="1==1"` attribute
              if(textItem.condition) {
                tdStart = tdStart.replace('<td', `<td data-ng-if="${textItem.condition}"`);
              }
              return `${tdStart}${tdContent}`;
            });
          }
        }
      });
    }
    return updatedHtmlString;
  }

  findImageCustomFieldValues(data: any): CustomFieldValue[] {
    const result: CustomFieldValue[] = [];
    function searchForImageContent(obj: any) {
        if (obj && typeof obj === 'object') {
            for (const key in obj) {
                const value = obj[key];
                if (value && typeof value === 'object') {
                    if (value.contentType === 'image' && value.descriptor?.image?.customFields?.customField_value) {
                        const customFieldValue = value.descriptor.image.customFields.customField_value;
                        try {
                            const parsedValue: CustomFieldValue = JSON.parse(customFieldValue);
                            result.push(parsedValue);
                        } catch (e) {
                            console.error("Error parsing JSON:", e);
                        }
                    }
                    searchForImageContent(value);
                }
            }
        }
    }

    searchForImageContent(data);
    return result;
  }

  findTextCustomFieldValues(data: any) {
    const CustomFieldValue:any = [];
    function searchForTextContent(obj: any) {
        if (obj && typeof obj === 'object') {
            for (const key in obj) {
                const value = obj[key];
                if (value && typeof value === 'object') {
                    if (value.contentType === 'paragraph' && value.descriptor?.paragraph?.customFields?.metadata) {
                        const customTextFieldValue = value.descriptor.paragraph.customFields.metadata;
                        try {
                            //const parsedValue: CustomFieldValue = JSON.parse(customFieldValue);
                            CustomFieldValue.push(customTextFieldValue);
                        } catch (e) {
                            console.error("Error parsing JSON:", e);
                        }
                    }
                    searchForTextContent(value);
                }
            }
        }
    }

    searchForTextContent(data);
    return CustomFieldValue;
  }

  createSaveJsonForEmailChannel(jsonFile, htmlFile) {
    this.getTagKeyMethod();

    if(!this.isPublishedPersonalization){
      htmlFile = this.addStyleAndScriptInFinalHtml(htmlFile);   
      htmlFile = this.addImageCondInFinalHtml(htmlFile, jsonFile);
    }
    this.personalizedTemplateTextHtml = htmlFile;
    this.personalizedTemplateJsonObj = jsonFile;
    this.shareService.onPublishEnableForPersonalization.subscribe(res => {
      if(res !== undefined){
        this.isPersonalizationPublish = res;
      }
    });
    this.shareService.onSavedTypePersonalization.subscribe(res => {
      if(res !== undefined){
        this.savedType = res;
      }
    });
    const payload = //{
     // channels: [
        {
          "tagKey" : parseInt(this.tagkey),
          "templateText" :this.personalizedTemplateTextHtml,
          "templateJson" : this.personalizedTemplateJsonObj,
          "failSafe" : this.isFailSafeEnabled,
          "failSafeTemplateText" :this.failsafeTemplateText,
          "failSafeTemplateJson" : this.failsafeJsonObj,
          "cacheControl" :this.cacheControlHrsVal,
          "imageSettings":this.imageQualitySettingsObj,
          "currentStep":"1",
          "status" : "1",
          "publish" : this.isPersonalizationPublish,
          "editorType": GlobalConstants.editorType,
	        "savedType" : this.savedType,
        }       
        
      //],
   // };    
    this.payloadWithoutFailsafe = payload;
    return payload;
  }

  showModalComponent(_res, _rej, _args: any, componentName: any) {
    this.ngZone.run(() => {
      
      this.modelConfigClass = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        class: ' modal-dialog-centered ' + _args.contentDialogId,
      };
      this.bsModalRef = this.modalService.show(componentName, Object.assign({}, this.modelConfigClass));
      GlobalConstants.saveRowsObj = _args.metadata;
      GlobalConstants.isFromSubjectRedirect = false;
      this.bsModalRef.content.onAdd.subscribe((e) => {
        GlobalConstants.isRowEditModeEnable = false;
        // on show modal
        _res(e);
        this.removeLoader();
        //console.log(e);
      });

      if(this.bsModalRef.content.onEdit) {
        this.bsModalRef.content.onEdit.subscribe((e) => {
          GlobalConstants.isRowEditModeEnable = true;
          GlobalConstants.globalEditableRowData = e.value.metadata.selectedValue;
          GlobalConstants.globalEditableRowDisplayCond = e.value["display-condition"];
          this.ngZone.run(() => {
            this.beeTest.saveAsTemplate();
          });
          _rej();
          this.removeLoader();
        });
      }

      if (!GlobalConstants.resolveFlag) {
        this.bsModalRef.onHidden.subscribe((e) => {
          //on hide modal
          _rej();
          //console.log(e);
        });
      }
    });
  }
  public showModal2Component(_res, _rej, _args: any, componentName: any) {
    this.ngZone.run(() => {
      this.modelConfigClass = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        class: ' modal-dialog-centered ' + _args.modal.class,
      };
      this.bsModalRef = this.modalService.show(componentName, this.modelConfigClass);
      this.bsModalRef.content.onSaveCond.subscribe((e) => {
        GlobalConstants.isRowEditModeEnable = false;
        // on show modal
        _res(e);
        //console.log(e);
      });

      if (!GlobalConstants.resolveFlag) {
        this.bsModalRef.onHidden.subscribe((e) => {
          //on hide modal
          _rej();
          //console.log(e);
        });
      }
    });
  }
  removeLoader() {
    this.ngZone.run(() => {
      this.loader.loadCount = 0;
      this.loader.HideLoader();
    });
  }
  getCustomerTagEnableCustDMEMethod(contentDialogId,resolve,reject,args){
    let tagKey = this.dataService.activeContentTagKey;
    this.http.post(AppConstants.API_PERSONSOALIZATION_TAGS_END_POINTS.GET_VERIFY_CUSTOMER_TAG_ENABLE_API+tagKey).subscribe((res) => {
      if(res){        
        this.shareService.addOnContentDialogId.next(contentDialogId);
        this.showModalComponent(resolve,reject,args,DMECustomerComponent); //DMECustomerComponent //DMEOffersComponent
        GlobalConstants.selectedRowId = args.value.id || "";
        GlobalConstants.isRowEditModeEnable = !!args.value.id;
        this.shareService.isDMECustomerEditMode.next(args.value.metadata);
      }else if(!res){
        Swal.fire({
          title: this.translate.instant('customerNonCustomerDMEComponents.pleaseSelectTheCustomerMergeTagsToContinueErrorLbl'),
          allowEscapeKey: false,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: this.translate.instant('designEditor.okBtn'),
        }).then(() => {
          reject();
        });
      }
      
    });
  }
  getCustomerTagEnableRecoRuleMethod(contentDialogId,resolve,reject,args){
    let tagKey = this.dataService.activeContentTagKey;
    this.http.post(AppConstants.API_PERSONSOALIZATION_TAGS_END_POINTS.GET_VERIFY_CUSTOMER_TAG_ENABLE_API+tagKey).subscribe((res) => {
      if(res){
        this.shareService.addOnContentDialogId.next(contentDialogId);
        this.showModalComponent(resolve, reject, args, RecommendationOffersComponent);
        this.shareService.isRecomendationOfferEditMode.next(args.value.metadata);
      }else if(!res){
        Swal.fire({
          title: this.translate.instant('customerNonCustomerDMEComponents.pleaseSelectTheCustomerMergeTagsToContinueErrorLbl'),
          allowEscapeKey: false,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: this.translate.instant('designEditor.okBtn'),
        }).then(() => {
          reject();
        });
      }
      
    });
  }
  getBeeConfigSettings(templateObj: any) {

    /* Merge Tags */
    // if (!this.isTemplateLibraryMode) {
    //   if (GlobalConstants.promotionSplitHelper.splitsGroups.length > 0) {
    //     this.varArgsMergeTags = GlobalConstants.promotionSplitHelper.splitsGroups[0].channels[0].varArgs.root.item;
    //   }
    // // }
    // if (this.varArgsMergeTags.length > 0) {
    //   var customer_data = this.varArgsMergeTags[0].userdata;
    //   var re: any = [];
    //   customer_data.filter(function (el) {
    //     let vr: any = {};
    //     vr['name'] = el.value;
    //     vr['value'] = '{' + el.value + '}';
    //     re.push(vr);
    //   });
    // }
    //const mergeTags = re;
    /* Merge Tags end */
    let hideModulesBasedOnLicenceType;
    if(this.licenseType === 'PTAG Only Pack'){
      hideModulesBasedOnLicenceType = beeFreeModulesJSON.hideModulesIn_PATG_ONLY_PACK;
    }else{
      hideModulesBasedOnLicenceType = beeFreeModulesJSON.hideModulesInPersonalization;
    }

    let customCssTemplateLibrary = '';
    customCssTemplateLibrary = `${this.CLOUD_FRONT_URL}/resources/css/design-page-bee.css`;
    if(this.isPersonalizeTagMode) {
      this.tempAddOnList = hideModulesBasedOnLicenceType;

      this.isAddOnModuleEnable = false;
      this.modulesGroupsCMP = [{
        label: this.translate.instant('designEditor.beeEditorComponent.contentBlocksLbl'),
        collapsable: true,
        collapsedOnLoad: false,
        modulesNames: beeFreeModulesJSON.personalizationTagsModules,
      },{
        label: this.translate.instant('designEditor.beeEditorComponent.customPlugins'),
        collapsable: true,
        collapsedOnLoad: true,
        modulesNames: beeFreeModulesJSON.pluginModules,
      },{
        label: this.translate.instant('designEditor.beeEditorComponent.contentAndStylingLbl'),
        collapsable: true,
        collapsedOnLoad: false,
        modulesNames: beeFreeModulesJSON.commonModulesNames,
      }]

    }

    GlobalConstants.beeConfig = {
      uid: 'test1-clientside', //needed for identify resources of the that user and billing stuff
      container: 'beefree-sdk-container', //Identifies the id of div element that contains BEE Plugin
      customHeaders: [
        {
          name: AppConstants.CUSTOM_HEADER_NAME,
          value: this.companyKey,
        },
      ],
      language: this.langEditorConfig[this.DEFAULT_LANGUAGE],
      //language: 'es-ES',
      editorFonts: {
        showDefaultFonts: true,
        customFonts: this.customFontsObj,
      },
      //loadingSpinnerDisableOnDialog: true,
      sidebarPosition: 'left',
      //mergeTags,
      defaultModulesOrder: ['DME','Recommendation'],
      customCss: customCssTemplateLibrary,
      modulesGroups: this.modulesGroupsCMP,
      trackChanges: true,
      addOns: this.tempAddOnList,
      advancedPermissions: {
        rows: {
          displayConditions: {
            show: true,
            locked: false
          },
        },
        content: {
          addon: {
            imageAddons: {
              properties: {
                imageWidth: {
                  locked: true,
                  show: true
                },
                inputText: {
                  locked: false,
                  show: false,
                }
              }
            }
          }
        },
        settings: {
          contentAreaAlign: {
            show: false
          }
        },
        /* content: {
          html: {
            behaviors: {
              canSelect: true,
              canAdd: false,
              canViewSidebar: true,
              canClone: true,
              canMove: true,
              canDelete: true,
              canResetMobile: false,
            },
            properties: {
              htmlEditor: {
                show: true,
                locked: false
              },
              hideOnMobile: {
                show: true,
                locked: false
              },
            }
          },
          addon: {
            'ratingPlugin': {
              behaviors: {
                canAdd: false
              },
            },
          }
        } */
      },
      contentDialog: {
        rowDisplayConditions: {
          label: this.translate.instant('beeEditorGlobalComponent.rowConfiguration'),
          handler: async (resolve, reject, args) => {
            args.modal = {
              icon: 'edit',
              title: this.translate.instant('beeEditorGlobalComponent.displayConditionBuilderLbl'),
              class: 'displayConditionsStyle',
            };

            GlobalConstants.savedDynamicContent = args.before;
            if (args.type === 'productReco') {
              GlobalConstants.selectedrowModelName = args.type;
            } else if (args.description !== undefined) {
              GlobalConstants.selectedrowModelName = args.description;
            } else {
              GlobalConstants.selectedrowModelName = "";
            }

            if (args.type != undefined) {
              GlobalConstants.selectedrowModelData = this.extractTypeAttribute(args.before);
            }

            GlobalConstants.isOpenDisplayCondition = true;
            GlobalConstants.isOpenGlobalTags = false;
            GlobalConstants.isOpenGlobalMTags = false;
            GlobalConstants.isOpenTextImageAddon = false;
            this.shareService.enablePreviewAfterCall.next(false);
            this.beeTest.send();
            this.ngZone.run(() => {
              this.displayConditionsFinal = this.showModal2Component(resolve,reject,args, DisplayConditionComponent);
            });
            //resolve(this.displayConditionsFinal);
          },
        },
        /* mergeTags: {
          label: this.translate.instant('designEditor.beeEditorComponent.searchsTagslbl'),
          handler: (resolve, reject, args) => {
            args.modal = {
              icon: 'search',
              title: this.translate.instant('designEditor.beeEditorComponent.searchMergeTagslbl'),
            };

            this.showModalComponent(resolve, reject, args, MergeTagsComponent);
          },
        }, */
        addOn: {
          handler: async (resolve, reject, args) => {
            const { contentDialogId, value } = args;
            GlobalConstants.selectedRowId = args.value.id || "";
            GlobalConstants.isRowEditModeEnable = !!args.value.id;
            if (contentDialogId == 'DME_Rule') { // Customer DME Block
              GlobalConstants.isCouponEnable = false;
              GlobalConstants.isAddOnProductList = true;    
              this.getCustomerTagEnableCustDMEMethod(contentDialogId,resolve, reject, args);          
              
            } else if(contentDialogId == 'non-customer-dme'){ // Non Customer DME block
              GlobalConstants.isCouponEnable = false;
              GlobalConstants.isAddOnProductList = true;
              //this.shareService.addOnContentDialogId.next(contentDialogId);              
              this.showModalComponent(resolve,reject,args,DMENonCustomerComponent);
              this.shareService.isDMENonCustomerEditMode.next(args.value.metadata);
            } else if (contentDialogId == 'reco-rule') { // Product Recommendation block
              GlobalConstants.isCouponEnable = false;
              GlobalConstants.isAddOnProductList = true;
              this.getCustomerTagEnableRecoRuleMethod(contentDialogId,resolve, reject, args);
            } else if (contentDialogId == 'api-personalization') { // API
              this.shareService.addOnContentDialogId.next(contentDialogId);              
              this.showModalComponent(resolve, reject, args, ApiPersonalizationComponent);
              this.shareService.isApiConsumeEditMode.next(args.value.metadata);
            } else if (contentDialogId == 'rule-offer') { // Product Context
              if (!this.contextFlagToShowPersonalization) {
                Swal.fire({
                  title: this.translate.instant('recommendationComponent.contextFlagWhenFalseGiveAlertLbl'),
                  allowEscapeKey: false,
                  allowOutsideClick: false,
                  showConfirmButton: true,
                  confirmButtonText: this.translate.instant('designEditor.okBtn'),
                }).then(() => {
                  reject();
                });
              } else {
                GlobalConstants.isCouponEnable = false;
                GlobalConstants.isAddOnProductList = true;
                this.shareService.addOnContentDialogId.next(contentDialogId);
                this.showModalComponent(resolve, reject, args, ProductOffersComponent);
                this.shareService.savedAddOnsJSON.next(args.value.metadata);
              }
            } else if (contentDialogId == 'ratingPlugin') {
              this.shareService.addOnContentDialogId.next(contentDialogId);
              this.showModalComponent(resolve, reject, args, RatingsComponent);
            } else if (contentDialogId == 'textAddons') {
              GlobalConstants.isOpenGlobalTags = false;
              GlobalConstants.isOpenTextImageAddon = true;
              this.beeTest.send();
              setTimeout(() => {
                this.shareService.addOnContentDialogId.next(contentDialogId);
                this.shareService.savedAddOnsJSON.next(args.value);
                this.showModalComponent(resolve, reject, args, TextAddonsComponent);
              }, 1000);
              
            } else if (contentDialogId == 'imageAddons') {
              GlobalConstants.isOpenGlobalTags = false;
              GlobalConstants.isOpenTextImageAddon = true;
              this.beeTest.send();
              setTimeout(() => {
                this.shareService.addOnContentDialogId.next(contentDialogId);
                this.shareService.savedAddOnsJSON.next(args.value);
                this.showModalComponent(resolve, reject, args, ImageAddonsComponent);
              }, 1000);
            }
            else if (contentDialogId == 'mapAddons') {
              this.shareService.addOnContentDialogId.next(contentDialogId);
              this.shareService.savedAddOnsJSON.next(args.value);
              this.showModalComponent(resolve, reject, args, MapAddonsComponent);
            }
            else if (contentDialogId == 'stackedBar') {
              this.shareService.addOnContentDialogId.next(contentDialogId);
              this.shareService.savedAddOnsJSON.next(args.value);
              this.showModalComponent(resolve, reject, args, StackedBarComponent);
            }else if (contentDialogId == 'ensemble_AI') {
              this.shareService.addOnContentDialogId.next(contentDialogId);
              this.shareService.savedAddOnsJSON.next(args.value);
              this.showModalComponent(resolve, reject, args, EnsembleAIComponent);
        }
        else if (contentDialogId == 'active-content-addon') {
              this.shareService.addOnContentDialogId.next(contentDialogId);
             this.shareService.savedAddOnsJSON.next(args.value);
               this.showModalComponent(resolve, reject, args, ActiveContentComponent);
             }
               else if (contentDialogId == 'acbadge') {
              this.shareService.addOnContentDialogId.next(contentDialogId);
             this.shareService.savedAddOnsJSON.next(args.value);
               this.showModalComponent(resolve, reject, args, BadgingWidgetComponent);
             }
          },
        },
        saveRow: {
          handler: (resolve, reject, args) => {
            if (Object.keys(args).length === 0) {
              reject();
            } else {
              args.modal = {
                icon: 'bars',
                title: this.translate.instant('designEditor.beeEditorComponent.saveRowlbl'),
                ...args,
              };
              args.metadata = {
                name: '',
                guid: args.uuid,
                idParent: undefined,
                category: undefined,
                tags: {},
                dateModified: undefined,
                dateCreated: new Date(),
                merge: false,
              };
              this.showModalComponent(resolve, reject, args, SaveUserRowsComponent);
            }
          },
        },

        /* onDeleteRow: {
          handler: async (resolve, reject, args) => {}
        },
        onEditRow: {
          handler: async (resolve, reject, args) => {
            const row_id = args?.row?.metadata?.guid 
            const result = await openFakeDialogToEditRow(row_id)
            if (result === 'success') resolve(true) 
            reject(result) 
          }
        }, */

        /* externalContentURLs: {
          label: this.translate.instant('designEditor.beeEditorComponent.findMoreRowslbl'),
          handler: (resolve, reject, args) => {
            return this.onSearchSavedRows(args)
            this.savedRows(resolve,reject, args);
          },
        },
        specialLinks: {
          label: 'Custom text for links',
          handler: function(resolve, reject) {
            resolve();
          },
        }, */
        // end Contentdialog
      },
      
      rowsConfiguration: {
        emptyRows: true,
        defaultRows: true,
        externalContentURLs: [
          {
            name: this.translate.instant('designEditor.beeEditorComponent.mySaveRowlbl'),
            value: `${this.BASE_URL}`+'/personalizationTags/getSavedRows',
            /* handle: "category-handle",
            behaviors: {
              canEdit: true,
            } */
          },
        ],
      },
      onLoad: () => {
       // this.fullPreviewBtnDisabled = true;
       this.disableSimulateTillOpen = false;
       let loadC = GlobalConstants.beeConfig;
        //console.log(loadC);
        this.removeLoader();
      },
      onSave: (jsonFile, htmlFile) => {
        //GlobalConstants.actionsPreviewEnable = false;
        // this.shareService.failSafeEnable.subscribe((res) => {
        //   this.isFailSafeEnabled = res;
        // });
        // if (this.isTestEmail) {
        //   if (this.testEmailTemplate !== undefined) {
        //     this.ngZone.run(() => {
        //       this.showTestPopupAfterBeeCall(this.testEmailTemplate);
        //     });
        //   }
        // }

        const endpoint = AppConstants.API_END_POINTS.GET_SAVE_PERSONALIZATION_TAG; //"http://localhost:3000/saveMessage";//"https://plugin-demos.getbee.io/saveMessage";//https://bee-multiparser.getbee.io/api/v3/parser/email?p=true&mtp=true&b=false";//"http://localhost:3000/saveMessage";
        // if(!this.isTestEmail) {
        //   this.loader.ShowLoader();
        // }
        GlobalConstants.ensembleAiEnabled = this.ensembleFlagCheckMethod(htmlFile);
        // get subject data commonly
        if (this.isTemperarySave) {
          //validation
          if (this.isFailSafePreviousTab == 0 && this.isFailSafeEnabled) {
            // -------- saves the previous data and loads the current data-------
            const payload = this.createSaveJsonForEmailChannel(jsonFile, htmlFile);
            this.payloadWithoutFailsafe = payload;
            console.log(payload);
            if (this.payloadWithFailsafe !== undefined) {
              const tempPayload = JSON.parse(this.payloadWithFailsafe.failSafeTemplateJson);
              // let subjtObj = this.updateSubjectObj(this.payloadWithoutFailsafe.channels[0].subjectObj);
              // subjtObj.preHeader = this.payloadWithFailsafe.channels[0].failSafeInfo.failsafeSubObj.preHeader;
              // subjtObj.subject = this.payloadWithFailsafe.channels[0].failSafeInfo.failsafeSubObj.subject;
              // this.shareService.subjectNpreheaderInputValueFailsafe.subscribe((res: any) => {
              //   if (Object.keys(res).length > 0) {
              //     subjtObj.preHeader = res.preHeader;
              //     subjtObj.subject = res.subject;
              //   }
              // });
              //this.shareService.updateSubjectPreheader.next(subjtObj);
              //this.subjctObj = subjtObj;
              this.reloadBeeEditor(tempPayload);
            } else {
              if (this.isFailSafeTabActive && this.isFailSafeEnabled) {
                if (this.isFailSafeCurrentTab == 1) {
                  this.reloadBeeEditor(emptyJson);
                }
              }
            }
            //  if(this.payloadWithoutFailsafe === undefined){
            //   this.shareService.updateSubjectPreheader.next(subjtObj);
            // }
            // this.removeLoader();
          }

          if (this.isFailSafePreviousTab == 1 && this.isFailSafeEnabled) {
            // Failsafe channel Save
           // this.failsafeDetailsMethod();
            const payload = this.createSaveJsonForfailSafeEmailChannel(jsonFile, htmlFile);
            this.payloadWithFailsafe = payload;
            console.log(payload);
            if (this.payloadWithoutFailsafe !== undefined) {
              const tempPayload = JSON.parse(this.payloadWithoutFailsafe.templateJson);
              //let subjtObj = this.updateSubjectObj(this.payloadWithoutFailsafe.channels[0].subjectObj);
              // subjtObj.preHeader = this.payloadWithFailsafe.channels[0].subjectObj.preHeader;
              // subjtObj.subject = this.payloadWithFailsafe.channels[0].subjectObj.subject;
              // this.shareService.subjectNpreheaderInputValue.subscribe((res: any) => {
              //   if (Object.keys(res).length > 0) {
              //     subjtObj.preHeader = res.preHeader;
              //     subjtObj.subject = res.subject;
              //   }
              // });
              //this.shareService.updateSubjectPreheader.next(subjtObj);
              //this.subjctObj = subjtObj;
              this.reloadBeeEditor(tempPayload);
            } else {
              if (this.isTemplateEditMode && this.isFailSafeEnabled) {
                if (this.isFailSafeCurrentTab == 0) {
                  this.reloadBeeEditor(emptyJson);
                }             
              }
            }
          }
        } else if (!this.isTemperarySave && !this.isTestEmail) {
          if (this.isFailSafeCurrentTab === '') {
            if (this.isFailSafeTabActive) {
              this.isFailSafeCurrentTab = 1;
            } else {
              this.isFailSafeCurrentTab = 0;
            }
          }
          // if(this.isTemplateEditMode){
          if (this.isFailSafeCurrentTab == 0 && this.isFailSafeEnabled) {
            let payload: any = this.createSaveJsonForEmailChannel(jsonFile, htmlFile);
            if (!this.isTemplateEditMode || this.isTemplateEditMode) {
              if (this.payloadWithFailsafe === undefined && !this.isFailSafeTabActive) {
                Swal.fire({
                  title: this.translate.instant(
                    'designEditor.beeEditorComponent.validationMsg.failsafeConditionIsEnabledPleaseSpecifyTheDetailsForFailsafeConditionMsglbl'
                  ),
                  allowEscapeKey: false,
                  allowOutsideClick: false,
                  showConfirmButton: true,
                  confirmButtonText: this.translate.instant('designEditor.okBtn'),
                }).then(() => {
                  this.removeLoader();
                });
                return;
              }
            }
            if (this.payloadWithFailsafe !== undefined) {
              //payload.channels[0]['failSafeInfo'] = this.failsafeInfo;
              //if (!this.isTestEmail) {
                this.finalSaveMethod(endpoint, payload);
             // }
            }
          } else if (this.isFailSafeCurrentTab == 1 && this.isFailSafeEnabled) {
            //this.failsafeDetailsMethod();
            const payload = this.createSaveJsonForfailSafeEmailChannel(jsonFile, htmlFile);
            //if (!this.isTestEmail) {
              this.finalSaveMethod(endpoint, payload);
           // }
          } else {
            if (!this.isFailSafeEnabled) {
              const payload = this.createSaveJsonForEmailChannel(jsonFile, htmlFile);
              //if (!this.isTestEmail) {
                this.finalSaveMethod(endpoint, payload);
              //}
            }
          }
          // }
        } else if (this.isTemperarySave && this.isTestEmail) {
          if ((!this.isFailSafeEnabled && this.isTestEmail) || (this.isFailSafeEnabled && this.isTestEmail)) {
            if (this.payloadWithFailsafe !== undefined) {
              const payload = this.payloadWithFailsafe;
              //  if(this.isFailSafeTabActive){
              //   payload.channels[0].failSafeInfo.html = htmlFile;
              //   payload.channels[0].failSafeInfo.json = jsonFile;
              //  }else{
              //    payload.channel[0].html = htmlFile;
              //    payload.channel[0].json = jsonFile;
              //  }
             // this.shareService.isEditMode.next(this.isTemplateEditMode);
              this.shareService.failSafeTabActive.next(this.isFailSafeTabActive);
             // this.shareService.testEmailObj.next(payload);
              //console.log(payload);
            } else {
              if (this.isFailSafeTabActive) {
                //this.failsafeDetailsMethod();
                const payload = this.createSaveJsonForfailSafeEmailChannel(jsonFile, htmlFile);
                //this.shareService.testEmailObj.next(payload);
              } else {
                const payload = this.createSaveJsonForEmailChannel(jsonFile, htmlFile);
                //this.shareService.testEmailObj.next(payload);
              }
              this.shareService.failSafeTabActive.next(this.isFailSafeTabActive);
            }
          }
        }
      },
      onSaveAsTemplate: (jsonFile) => {

        if(GlobalConstants.isRowEditModeEnable) {
          this.editRowInFinalHtml(jsonFile);
          this.beeTest.load(this.templateObj);
          return;
        }
        
        this.count++;
        const endpoint = AppConstants.API_END_POINTS_OTHERS.SAVE_MY_TEMPLATE_CONTENT;
        //const endpoint = AppConstants.API_END_POINTS_OTHERS.SAVE_MY_TEMPLATE_CONTENT+this.templateKey+this.count;
        if (this.isEmptyJsonToloadInBeeEditor) {
          this.templateKey = 'Default';
        } else {
          if (this.isTemplateLibraryMode) {
            this.templateKey = this.templateKey; // manage Templates
          } else {
            this.templateKey = this.templateKey + '.v' + Math.floor(Math.random() * 10000); // Design page
          }
        }
        if (!this.isTemplateLibraryMode) {
          // Save as Templates with new entry in S3 Where isSaveAsTemplate = false and manageTemplate = false
          this.isSaveAsTemplate = false;
        }
        if (this.isTemplateLibraryMode) {
          if (this.isEmptyJsonToloadInBeeEditor) {
           // this.existingOrNewTemplateSavemethod(jsonFile, endpoint, this.isSaveAsTemplate, !this.isTemplateLibraryMode);
          } else {
            Swal.fire({
              title: this.translate.instant('designEditor.beeEditorComponent.saveTemplatelbl'),
              showCloseButton: true,
              showCancelButton: true,
              confirmButtonText: this.translate.instant('designEditor.beeEditorComponent.updateExistinglbl'),
              //confirmButtonColor: '#3366FF',
              cancelButtonText: this.translate.instant('designEditor.beeEditorComponent.saveAsNewlbl'),
              cancelButtonColor: '',
              allowOutsideClick: false,
              allowEscapeKey: false,
              customClass: {
                cancelButton: 'buttonCssStyle',
                confirmButton: 'buttonCssStyle',
              },
            }).then((result) => {
              if (result.value) {
                // Update Existing Templates Where isSaveAsTemplate = true and manageTemplate = true
                //this.existingOrNewTemplateSavemethod(jsonFile,endpoint,this.isSaveAsTemplate,this.isTemplateLibraryMode);
                const saveAsEnpoint =
                  endpoint +
                  this.templateKey +
                  '&saveTemplate=' +
                  this.isSaveAsTemplate +
                  '&manageTemplate=' +
                  this.isTemplateLibraryMode;
                //this.saveTemplateinS3(saveAsEnpoint, jsonFile);
              } else {
                // save as new
               // this.existingOrNewTemplateSavemethod(jsonFile, endpoint, !this.isSaveAsTemplate, !this.isTemplateLibraryMode);
              }
            });
          }
        } else {
         // this.existingOrNewTemplateSavemethod(jsonFile, endpoint, this.isSaveAsTemplate, this.isTemplateLibraryMode);
        }
      },
      onSend: (htmlFile) => {
        if (this.isFailSafeTabActive) {
          if (this.isPreviewOnClientEnableFailSafe) {
            this.isFullPreviewEnabled  = false;
          }
          if (this.isSpamTestEnableFailsafe) {
            this.isFullPreviewEnabled  = false;
          }
        } else if(GlobalConstants.isOpenGlobalTags) {
          this.isFullPreviewEnabled  = false;
          this.findMergeTagByHTMLAttributes(
            this.spamTestTemplate,
            htmlFile,
          );
        } else if(GlobalConstants.isOpenTextImageAddon) {
          this.isFullPreviewEnabled  = false;
          this.findMergeTagByHTMLAttributes(
            this.spamTestTemplate,
            htmlFile,
          );
        } else if(GlobalConstants.isOpenGlobalMTags) {
          this.isFullPreviewEnabled  = false;
          this.openGlobalMTagPopup();
        } else if(GlobalConstants.isOpenDisplayCondition) {
          this.findRowDynamicContentByHTMLAttributes(
            htmlFile
          );
          GlobalConstants.isOpenDisplayCondition = false;
        } else {
          if (this.isPreviewOnClientEnable) {
            this.isFullPreviewEnabled  = false;
          }
          if (this.isSpamTestEnable) {
            this.isFullPreviewEnabled  = false;
          }
        }
        if(this.isFullPreviewEnabled){          
         // this.getBeeHtmlContent(htmlFile);
        }
        //console.log('onSend', htmlFile)
      },
      onError: (errorMessage) => {
        console.log('onError ', errorMessage);
        this.removeLoader();
      },

      onChange: (jsonFile, response) => {
        const idMap: Record<string, number[]> = {};

        if ('1403' === response.code) {
          let jsonData = JSON.parse(jsonFile);
          if (jsonData.page && jsonData.page.rows && jsonData.page.rows.length > 0) {
            /* jsonData.page.rows.forEach((row: any) => {  
              if(row.metadata) {
                let metaDataId = row.metadata.id;
                console.log(metaDataId);
              } 
            }); */

            jsonData.page.rows.forEach((item, index) => {
              const id = item?.metadata?.id;
              if (id) {
                if (!idMap[id]) {
                  idMap[id] = [];
                }
                idMap[id].push(index);
              }
            });
            
            for (const id in idMap) {
              const indices = idMap[id];
              if (indices.length > 1) {
                const lastIndex = indices[indices.length - 1];
                const newId = uuidv4();          
                // Update metadata.id
                jsonData.page.rows[lastIndex].metadata.id = newId;
          
                // Also replace in container.displayCondition.before (if exists)
                const before = jsonData.page.rows[lastIndex]?.container?.displayCondition?.before;
                if (before) {
                  let updatedBefore = before.replace(id, newId);
                  //const rowNameValue = this.randomNameService.generateRandomName("rowName-");
                  //updatedBefore = updatedBefore.replace(/rowName='rowName-\d+'/g, `rowName='${rowNameValue}'`);
                  jsonData.page.rows[lastIndex].container.displayCondition.before = updatedBefore;
                }
              }
            }
          }    
          jsonFile = JSON.stringify(jsonData, null, 2);
          GlobalConstants.beeTest.load(jsonFile);
        }
      },

      onSaveRow: (rowJSON, html, pageJSON) => {
        // Do something with the returned values...
        if (!rowJSON) return;
        if (!pageJSON) return;
        let row = JSON.parse(rowJSON);
        const newId = uuidv4();
        if(row.container.displayCondition) {
          row.container.displayCondition.before = row.container.displayCondition.before.replace(/(<dynamic-content\s+[^>]*id=')([^']+)(')/, `$1${newId}$3`);
        }

        const page = JSON.parse(JSON.stringify(pageJSON));
        const meta = GlobalConstants.saveRowsObj;
        const request = {
          row: {
            ...row,
            meta,
          },
          html,
          page,
          ...meta,
        };
        //console.log('dbpu request', request.row);
        if(request.name !== ''){
          this.http.post('/personalizationTags/saveRow', request.row).subscribe((res) => {
            if(res.status == 'SUCCESS')
            this.dataService.SwalSuccessMsg(this.translate.instant('designEditor.beeEditorComponent.saveRowlblSuccess'));
          });
        }        
      },
    };

    
    this.beeTest.start(GlobalConstants.beeConfig, templateObj);
  }

  ngOnInit(): void {    
    //this.openPTagsMergeTag();
  }
  async loadLicencingTypeMethod() {
    let endpoint = AppConstants.API_END_POINTS.GET_LICENCE_TYPE_API;
    const result = await this.http.post(endpoint).toPromise();
    if (result.status == 'SUCCESS') {      
      this.licenseType = result.response.licenseType;
    }
  }

  async getAdditionalScriptURL() {
    let endpoint = AppConstants.API_END_POINTS.GET_SCRIPT_URL_API;
    const result = await this.http.post(endpoint).toPromise();
    this.additionalScriptURL = result.response;
  }

  async getInlineJSURL() {
    this.inlineJSScriptURL = "";
    if(this.tagkey !== undefined && this.tagkey !== null){
      let endpoint = AppConstants.INLINEJS.GET_INLINEJS_SCRIPT_URL_API+"?tagKey="+this.tagkey;
      const result = await this.http.post(endpoint).toPromise();
      this.inlineJSScriptURL = result.response.jsFilePath;
    }
  }

  editPersonalizationTag(){
    if(this.tagkey !== undefined && this.tagkey !== null){
    let endpoint = AppConstants.API_END_POINTS.GET_EDIT_PERSONALIZATION_TAG+"?tagKey="+this.tagkey;
    this.http.post(endpoint).subscribe((res) => {
      if(res !== undefined){
        if(res.status == "SUCCESS"){
          let assignedPriviledgeFlags = res.response.assignedPriviledge;
          this.editModeJsonObj = JSON.parse(res.response.jsonString);
          this.ptagSimulateUrlBasePath = res.response.simulateUrlBasePath;
          let localExistingRowLabels = res.response.existingRowLabels;
          if (!localExistingRowLabels) {
            localExistingRowLabels = {}; // Initialize if null
          }
          GlobalConstants.existingRowLabels = localExistingRowLabels;
          this.shareService.savedPersonalizationDataObj.next(this.editModeJsonObj);
          if(Object.keys(this.editModeJsonObj).length > 0){
            this.editAfterPublish = this.editModeJsonObj.editAfterPublish;
            this.dataService.setSharedActiveContentName = this.editModeJsonObj.name;
            this.shareService.activeContentPtagNameObj.next(this.editModeJsonObj);
            if(assignedPriviledgeFlags !== undefined){
              this.checkAssignedPriviledgeMethod(assignedPriviledgeFlags);
            }
            this.isTagParameterEnabled = true;
            if(this.editModeJsonObj.name !== "" && this.editModeJsonObj.name !== 'Personalization_Untitle'){
             
              this.isPtagNameSaved = true;
            }
            if(!this.editModeJsonObj.failSafe && this.editModeJsonObj.templateText !== undefined ){
              this.isTemplateEditMode = true;             
            }
            if(this.editModeJsonObj.failSafe && this.editModeJsonObj.failSafeTemplateText !== undefined){
              this.isTemplateEditMode = true;
            }
            if(this.editModeJsonObj.status === 3 || this.editModeJsonObj.status === 4 ){ // publish-3, and publishNdisabled-4
              this.isPublishedPersonalization = true;
              this.shareService.isPublishEnabledForPersonalization.next(true);
            }else{
              this.isPublishedPersonalization = false;
              this.shareService.isPublishEnabledForPersonalization.next(false);
            }
            this.shareService.onSavedTypePersonalization.next(this.editModeJsonObj.savedType);
            this.shareService.getCacheControlHrsVal.next(this.editModeJsonObj.cacheControl);
            this.shareService.getImageQualitySettingsObj.next(this.editModeJsonObj.imageSettings);
            this.getBeeEditorLoadObj(this._urlPath); 
            /* setTimeout(() => {
              this.openSimulatePopup();
            }, 600); */    
            if(this.editModeJsonObj.tagParams !== undefined){
              this.shareService.tagParametersObjArry.next(JSON.parse(this.editModeJsonObj.tagParams));
            }
            if(this.editModeJsonObj.activeEdit == 1){
              let obj ={};
              obj["activeEdit"] = this.editModeJsonObj.activeEdit;
              obj["parentActiveContentName"] = this.editModeJsonObj.parentActiveContentName;
              obj["tagId"] = this.editModeJsonObj.tagKey;
              obj["currentActiveContentName"] = this.editModeJsonObj.name;
              let lbl= this.translate.instant('beeEditorGlobalComponent.overrideActiveContentTagNameLbl')+" '"+this.editModeJsonObj.name+"'";
              this.warningActiveContentBeforePublishMsg = lbl;
              this.activeEditObj = obj;
              this.shareService.activeEditShareObj.next(obj);
            }else{
              this.activeEditObj = {};
            }
          }         
        } else if(res.status == "AccessDenied") {
          this.dataService.SwalDialogConfirmAndRedirect(res.message, `${this.BASE_URL}/personalizationTags/loadPersonalizationTags`);
        } else{
          this.isTemplateEditMode = false;
          let assignedPriviledgeFlags = res.response.assignedPriviledge;
          if(assignedPriviledgeFlags !== undefined){
            this.checkAssignedPriviledgeMethod(assignedPriviledgeFlags);
          }
          this.getBeeEditorLoadObj(this._urlPath);
        }
      }
      
    });
  }else{
     // load initial page when tagkey is undefined or null.
    window.open(`${this.BASE_URL}/personalizationTags/loadPersonalizationTags`, '_parent');
  }
  }
  checkAssignedPriviledgeMethod(assignedPriviledgeFlags){
    if(assignedPriviledgeFlags.ptagedit){
      this.tenentPriviledgeEditDisabled = !assignedPriviledgeFlags.ptagedit; // when edit is false, disabled true
    // }else if((this.isAssignedPriviledgeObj.ptagview &&  !this.isAssignedPriviledgeObj.ptagedit)|| (!this.isAssignedPriviledgeObj.ptagview && !this.isAssignedPriviledgeObj.ptagedit)){
    //   this.tenentPriviledgeEditDisabled = true; // when view is true/ false, disabled true
    // }
    }else{
      this.tenentPriviledgeEditDisabled = !assignedPriviledgeFlags.ptagedit; // when edit is true, disabled false
    }
    this.shareService.assignedPriviledgeEnableForTenents.next(assignedPriviledgeFlags);
  }

  saveEmail(beeInstance, savedType) {
    if(this.editModeJsonObj !== undefined && this.editModeJsonObj !== null){
      if(savedType == 'QA') {
        this.warningActiveContentBeforePublishMsg = this.translate.instant('beeEditorGlobalComponent.overrideACasQATagNameLbl')+" '"+this.editModeJsonObj.name+"'";
      } else {
        this.warningActiveContentBeforePublishMsg = this.translate.instant('beeEditorGlobalComponent.overrideActiveContentTagNameLbl')+" '"+this.editModeJsonObj.name+"'";
      }
    }
    this.isTestEmail = false;
    this.shareService.isTemperarySave.next(false);
    this.callSimulateAfterSave = false;
    //GlobalConstants.actionsPreviewEnable = false;
    if(this.activeEditObj.activeEdit == 1 && this.isPersonalizationPublish){
      this.callActiveEditConfirmbeforePublishMethod();
    }else{
      this.getAdditionalScriptURL()
      .then(() => this.getInlineJSURL())
      .then(() => {
        this.beeTest.save();
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
    } 
  }
  
  callActiveEditConfirmbeforePublishMethod(){
    this.openActiveEditandCopyPopupMethod(this.pTagTemplate);
  }
  openActiveEditandCopyPopupMethod(pTagTemplate){
    this.modalRef = this.modalService.show(pTagTemplate, {
      class: 'modal-dialog-centered pTagModel',
      backdrop: 'static',
      keyboard: false,
    });
  }
  closePTagModel(): void {
    if (this.modalRef !== undefined) {
      this.modalRef.hide();
    }
    this.removeLoader();
  }
  confirmActiveEditPublishMethod(){
    this.closePTagModel();
    this.getAdditionalScriptURL()
    .then(() => this.getInlineJSURL())
    .then(() => {
      this.beeTest.save();
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
  }
  onTabSwitchCall() {
    this.loader.ShowLoader();
    this.isTestEmail = false;
    this.shareService.isTemperarySave.next(true);
    this.getAdditionalScriptURL()
    .then(() => this.getInlineJSURL())
    .then(() => {
      this.beeTest.save();
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
  }
  saveMyTemplate(saveAsTemp) {
    this.loader.ShowLoader();
    this.isSaveAsTemplate = saveAsTemp;
    if (this.isEmptyJsonToloadInBeeEditor) {
      this.isSaveAsTemplate = false;
    }
    this.beeTest.saveAsTemplate();
    this.loader.HideLoader();
  }
  async finalSaveMethod(endpoint, payload) {
    payload["existingRowLabels"] = GlobalConstants.existingRowLabels;
    this.confirmBeforeSaveNpublish(endpoint,payload,this.tagParamsArryObj,this.isPersonalizationPublish);
    this.removeLoader();
  }
 confirmBeforeSaveNpublish(endpoint,payload,tagParamObj,isPublish) {
    // for Dialog user inputs
    if(isPublish){
      if(!this.isTemplateEditMode){
        if(this.isPtagNameSaved){
          this.callEditPublisMethod(endpoint,payload,tagParamObj);
        }else{
          this.callPublishMethod(endpoint,payload,tagParamObj);
        }        
      }else{
        if(this.isPtagNameSaved){
          this.callEditPublisMethod(endpoint,payload,tagParamObj);
        }else{
          this.callPublishMethod(endpoint,payload,tagParamObj);
        }  
      }
      
    }else{
      if(this.callSimulateAfterSave){ // simulate 
        this.callSimulateMethod(endpoint,payload,tagParamObj);
      }else{
        if(!this.isTemplateEditMode){
          if(this.isPtagNameSaved){
            this.callEditSaveMethod(endpoint,payload,tagParamObj);
          }else{
            this.callSaveMethod(endpoint,payload,tagParamObj);
          }          
        }else{
          if(this.isPtagNameSaved){
            this.callEditSaveMethod(endpoint,payload,tagParamObj);
          }else{
            this.callSaveMethod(endpoint,payload,tagParamObj);
          }
        }                  
      }
    }
    
  }
  async callSaveMethod(endpoint,payload,tagParamObj){  
    let journeyNameIsEdited = this.dataService.activeContentPtagName;
    if(journeyNameIsEdited === 'Personalization_Untitle' || journeyNameIsEdited == null){
      Swal.fire({
        // title: this.translate.instant('dataServicesTs.areYouSureAlertMsgLbl'),      
        titleText: this.translate.instant('beeEditorGlobalComponent.confirmMessageForNameSavingLbl'),
        html: `<input type="text" id="tagName" class="swal2-input" maxlength="200" placeholder="`+this.translate.instant('beeEditorGlobalComponent.enterNameTagLbl')+`">`,
        icon:'warning',
        showCancelButton: true,
        confirmButtonColor: '#026FE9',
        cancelButtonColor: '#FFF',
        confirmButtonText: this.translate.instant('yes'),
        cancelButtonText:this.translate.instant('cancel'),
        allowEscapeKey: false,
        allowOutsideClick: false,
        customClass: {
          cancelButton: 'buttonCssStyle',
          confirmButton: 'buttonCssStyle',
        },
        
      focusConfirm: true,
      preConfirm: () => {
      let  tagName:any = Swal.getPopup();
      //var regexp = "^([a-zA-Z])[a-zA-Z0-9-_]*$";
      
      tagName = tagName.querySelector('#tagName').value;
      
      //var regexPattern = "^([a-zA-Z\u3040-\u30FF\u4E00-\u9FAF])[a-zA-Z0-9_\-\u3040-\u30FF\u4E00-\u9FAF]*$";
      //const regex: RegExp = new RegExp(regexPattern);
      //const isMatch: boolean = regex.test(tagName);
  
      if (tagName == "") {
        this.isPtagNameSaved = false;
        Swal.showValidationMessage(this.translate.instant('beeEditorGlobalComponent.enterNameTagLblValidation'));
      }/* else if (!isMatch){
        this.isPtagNameSaved = false;
        Swal.showValidationMessage(this.translate.instant('beeEditorGlobalComponent.alphaNumericNameValidationLbl'));
      } */
      return { tagName:tagName }
      }
      }).then(async (result:any) => {
      if (result.isConfirmed){
      this.commonSaveCallMethod(endpoint,payload,tagParamObj,result?.value.tagName);
        }
      });
    }else{
      this.commonSaveCallMethod(endpoint,payload,tagParamObj,journeyNameIsEdited);
    }
    

  }
  async commonSaveCallMethod(endpoint,payload,tagParamObj,resultTagName){
    this.isPersonalizationPublish = false;
    payload.name = resultTagName; 

    const res = await this.http.post(endpoint, payload).toPromise();
    if (res.status == 'SUCCESS') {
      //localStorage.setItem("tagKeyPersonalization",JSON.stringify(res.response.tagKey));
      //localStorage.setItem("tagNamePersonalization",JSON.stringify(payload.name));
      this.dataService.setSharedActiveContentName = payload.name;
      this.dataService.setSharedActiveContentTagKey = res.response.tagKey;
      this.ngZone.run(() => {
        this.shareService.journeyNameFromBeeEditorPtag.next(payload.name);
      });  
      this.tagkey = res.response.tagKey;
      this.isPtagNameSaved = true;
      Swal.fire({
        title: res.message,
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: this.translate.instant('designEditor.okBtn'),
      });
    }else{
      Swal.fire({
        title: res.message,
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: this.translate.instant('designEditor.okBtn'),
      });
    }
  }
  async callEditSaveMethod(endpoint,payload,tagParamObj){            
    this.isPersonalizationPublish = false;
    const result = await this.http.post(endpoint, payload).toPromise();
    if (result.status == 'SUCCESS') {
      //localStorage.setItem("tagKeyPersonalization",JSON.stringify(result.response.tagKey));
      this.loader.ShowLoader();
      setTimeout(() => {
        this.tagkey = result.response.tagKey;
        Swal.fire({
          title: result.message,
          allowEscapeKey: false,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: this.translate.instant('designEditor.okBtn'),
        });
        this.removeLoader();
      }, 1000);    
        
    }else{
      this.loader.ShowLoader();
      setTimeout(() => {
        Swal.fire({           
          title: result.message,
          allowEscapeKey: false,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: this.translate.instant('designEditor.okBtn'),
        });
        this.removeLoader();
      }, 1000);           
      
    }
  }
  async callSimulateMethod(endpoint,payload,tagParamObj){    
    this.isPersonalizationPublish = false;
    let endpointSimulateEnable = endpoint+'?simulate=true';
    const result = await this.http.post(endpointSimulateEnable, payload).toPromise();
    if (result.status == 'SUCCESS') {
      //localStorage.setItem("tagKeyPersonalization",JSON.stringify(result.response.tagKey));
      this.tagkey = result.response.tagKey;
      this.dataService.setSharedActiveContentTagKey = result.response.tagKey;
      this.ptagSimulateUrlBasePath = result.response.simulateUrlBasePath;
      this.openSimulatePopup();
    }else{
      Swal.fire({
        title: result.message,
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: this.translate.instant('designEditor.okBtn'),
      });
    } 
  }
  async pTagValidateMethod(urlPath){ // from Gopal, on simulate for the first call the response is failing due this call dummy Api.
    //let endpoint = this.basePTagUrl+urlPath;

    let endpoint = this.ptagSimulateUrlBasePath+urlPath; // New basePath taken from SimulateUrlBasePath resonpse
    // this.http.getFullPath(endpoint).subscribe((res:any) => { }); Not working.
    /* fetch(endpoint,{
      method: 'GET', // or 'POST' depending on your API
      credentials: 'include' // This ensures cookies are sent with the request
    }).then((res) => { });  */ // retuns Nothing, only call to Backend.
    try {
      const jsonData = await this.http.getFragmentSimulate(endpoint).toPromise();
    } catch (error) {
      console.error("Error fetching pTagValidateMethod data:", error);
    }
  }
  callPublishMethod(endpoint,payload,tagParamObj){
    let journeyNameIsEdited = this.dataService.activeContentPtagName;
    if(journeyNameIsEdited === 'Personalization_Untitle' || journeyNameIsEdited == null){
      Swal.fire({
        // title: this.translate.instant('dataServicesTs.areYouSureAlertMsgLbl'),      
        titleText: this.translate.instant('beeEditorGlobalComponent.confirmMessageForNameAnfPublishLbl'),
        html: `<input type="text" id="tagName" class="swal2-input" maxlength="200" placeholder="`+this.translate.instant('beeEditorGlobalComponent.enterNameTagLbl')+`">`,
        icon:'warning',
        showCancelButton: true,
        confirmButtonColor: '#026FE9',
        cancelButtonColor: '#FFF',
        confirmButtonText: this.translate.instant('yes'),
        cancelButtonText:this.translate.instant('cancel'),
        allowEscapeKey: false,
        allowOutsideClick: false,
        customClass: {
          cancelButton: 'buttonCssStyle',
          confirmButton: 'buttonCssStyle',
        },
        
    focusConfirm: true,
    preConfirm: () => {
      let  tagName:any = Swal.getPopup();
      tagName = tagName.querySelector('#tagName').value;
      var regexp = "^([a-zA-Z])[a-zA-Z0-9-_]*$";
      if (!tagName) {
        this.isPtagNameSaved = false;
        Swal.showValidationMessage(this.translate.instant('beeEditorGlobalComponent.enterNameTagLblValidation'));
      }else if (tagName.search(regexp) === -1){
        this.isPtagNameSaved = false;
        Swal.showValidationMessage(this.translate.instant('beeEditorGlobalComponent.alphaNumericNameValidationLbl'));
      }
      return { tagName:tagName }
    }
  }).then((result) => {
    if (result.isConfirmed){
      this.commonPublishCallMethod(endpoint,payload,tagParamObj,result.value?.tagName);
    }   
  })
    }else{
      this.commonPublishCallMethod(endpoint,payload,tagParamObj,journeyNameIsEdited);
    }

    

  }
commonPublishCallMethod(endpoint,payload,tagParamObj,resultTagName){
  //if(this.isPersonalizationPublish){
    //let endpoint = "/personalizationTags/saveNpublishPTag?tagKey="+this.tagkey+"&publish="+isPublish;
    payload.name = resultTagName;
    this.http.post(endpoint,payload).subscribe(res => {
      if (res.status == 'SUCCESS') {
        // localStorage.setItem("tagKeyPersonalization",JSON.stringify(res.response.tagKey));
        this.tagkey = res.response.tagKey;
        this.isPtagNameSaved = true;
        this.ngZone.run(() => {
          Swal.fire({
            title: res.message,
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonText: this.translate.instant('designEditor.okBtn'),
          });
          
          window.open(`${this.BASE_URL}`+res.response.redirect, '_parent');   
        });
      }else{
      Swal.fire({
        title: res.message,
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: this.translate.instant('designEditor.okBtn'),
      });
      }
    });
    
  // }
}
  
  callEditPublisMethod(endpoint,payload,tagParamObj){
   this.http.post(endpoint,payload).subscribe(res => {
    if (res.status == 'SUCCESS') {
      //localStorage.setItem("tagKeyPersonalization",JSON.stringify(res.response.tagKey));
      this.tagkey = res.response.tagKey; 
      this.ngZone.run(() => {
        Swal.fire({
          title: res.message,
          allowEscapeKey: false,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: this.translate.instant('designEditor.okBtn'),
        });
        
        window.open(`${this.BASE_URL}`+res.response.redirect, '_parent');   
      });
    }else{
    Swal.fire({
      title: res.message,
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: true,
      confirmButtonText: this.translate.instant('designEditor.okBtn'),
    });
    }
  });
  }
   validateTagParams(tagParamsArry){
    // Validation for tag parametes
    //if(Object.keys(tagParamsArry).length === 0){
      Swal.fire({
        title: this.translate.instant('beeEditorGlobalComponent.tagParametersAreMandatoryBeforeSaveValidationLbl'),
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: this.translate.instant('designEditor.okBtn'),
      });
      return;
    //}
   }

  loadcurrentSavedObj(currentSavedObj) {
    if (currentSavedObj.failSafeActualTemplateText === null) {
      var tempPayloadFailsafe = JSON.parse(currentSavedObj.actualTemplateText);
    } else {
      var tempPayloadFailsafe = JSON.parse(currentSavedObj.failSafeActualTemplateText);
    }
    if (!this.isFailSafeTabActive) {
      let subjtObj = this.updateEditModeSubjectObj(currentSavedObj);
      subjtObj.preHeader = currentSavedObj.preHeader;
      subjtObj.subject = currentSavedObj.subjectLine;
      this.shareService.updateSubjectPreheader.next(subjtObj);
      this.subjctObj = subjtObj;
      this.reloadBeeEditor(tempPayloadFailsafe);
    } else {
      let subjtObj = this.updateEditModeSubjectObj(currentSavedObj);
      subjtObj.preHeader = currentSavedObj.failSafePreHeader;
      subjtObj.subject = currentSavedObj.failSafeSubjectLine;
      this.shareService.updateSubjectPreheader.next(subjtObj);
      this.failsafeSubjctObj = subjtObj;
      this.shareService.failSafSubjectObj.next(subjtObj);
      this.reloadBeeEditor(tempPayloadFailsafe);
    }
  }
  async openGlobalMergeTag() {
    this.isMergeTagDmeEnabled = false;
    GlobalConstants.isOpenGlobalTags = true;
    GlobalConstants.isOpenTextImageAddon = false;
    this.loader.ShowLoader();

    await Promise.all([
      this.openPTagsMergeTag(),
      //this.openAPIPTagsMergeTag()
    ]);
    this.isMergeTagDmeEnabled = true;
    this.loader.HideLoader();
  }

  async openPTagsMergeTag() {
    const tagkey = this.dataService.activeContentTagKey;//localStorage.getItem("tagKeyPersonalization");
    const endpoint = AppConstants.API_PERSONSOALIZATION_TAGS_END_POINTS.GET_PMERGETAG + tagkey + "&wa=true&pta=true";
    try {
      const response = await this.http.post(endpoint).toPromise();
      if (response.status === "SUCCESS") {
        const mergeTags = response.response.root.item;
        GlobalConstants.selectedPTags = mergeTags;
        this.beeTest.send();
      }
    } catch (error) {
      console.error(this.translate.instant('beeEditorGlobalComponent.errorMessgeFetchingPtagsLbl'), error);
    }
  }

  async openGlobalMTag() {
    this.isMergeTagDmeEnabled = false;
    this.isMergeTagBttnDisabled = true;
    GlobalConstants.isOpenGlobalMTags = true;
    GlobalConstants.isOpenGlobalTags = false;
    GlobalConstants.isOpenTextImageAddon = false;
    this.loader.ShowLoader();

    await Promise.all([
      this.openPTagsMTag(),
      //this.openAPIPTagsMergeTag()
    ]);
    this.isMergeTagDmeEnabled = true;
    this.loader.HideLoader();
  }

  async openPTagsMTag() {
    const tagkey = this.dataService.activeContentTagKey;//localStorage.getItem("tagKeyPersonalization");
    const endpoint = AppConstants.API_PERSONSOALIZATION_TAGS_END_POINTS.GET_PMERGETAG + tagkey + "&wa=true&pta=true";
    try {
      const response = await this.http.post(endpoint).toPromise();
      if (response.status === "SUCCESS") {
        const mergeTags = response.response.root.item;
        GlobalConstants.selectedPTags = mergeTags;
        this.beeTest.send();
      }
    } catch (error) {
      console.error(this.translate.instant('beeEditorGlobalComponent.errorMessgeFetchingPtagsLbl'), error);
    }
  }

  /* async openAPIPTagsMergeTag() {
    const endpoint = "/apiPersonalization/getApiMergeTag?apiKey=1&wa=false&api=true";
    try {
      const response = await this.http.post(endpoint).toPromise();
      if (response.status === "SUCCESS") {
        const mergeTags = response.response.root.item;
        GlobalConstants.selectedApiPTags = mergeTags;
      }
    } catch (error) {
      console.error("Error while fetching API personalization tags:", error);
    }
  } */

  updateSubjectObj(jsonObj) {
    let subjectObj = {
      senderConfigKey: jsonObj.senderConfigKey,
      senderId: jsonObj.senderId,
      senderName: jsonObj.senderName,
      subject: '',
      preHeader: '',
      vendorDesc: jsonObj.vendorDesc,
      vendorId: jsonObj.senderConfigKey,
    };
    return subjectObj;
  }
  openSimulatePopup(){
    this.pTagValidateMethod('/p/validate');
    this.pTagValidateMethod('/ph/validate');
     this.callPopupComponent(SimulateTagParamtersComponent,"simulatePopupCss m-0");
  }
  saveBeforeSimulateMethod(isCreate){
    if(isCreate){
      this.isTestEmail = false;
      this.shareService.isTemperarySave.next(false);
      this.callSimulateAfterSave = true;
      this.isPersonalizationPublish = false;
      this.shareService.onPublishEnableForPersonalization.next(false);
      this.disableSimulateTillOpen = true;
      if(!this.isPublishedPersonalization){
        this.getAdditionalScriptURL()
        .then(() => this.getInlineJSURL())
        .then(() => {
          this.beeTest.save();
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
      }else{
        this.openSimulatePopup();
      }
    }else{
      this.shareService.isTemperarySave.next(false);
      this.callSimulateAfterSave = false;
    }
  }
  openImageQualitySettingPopup(){
    this.callPopupComponent(ImageQualitySettingsComponent,'imageQaulitySettingsPopupCss')
  }
  openClipboard() {
    this.copyClipboard.toggleClipboardPopup();
  }
  openCacheControlPopup(){
   // this.isCacheControlEnabled = false;
    this.callPopupComponent(CacheControlComponent,"cachePopupCss");
  }  
  openTagParameterPopup(){
    this.callPopupComponent(TagResponseParamtersComponent,"tagParameterCss");
  }
  callPopupComponent(modalTemplate,classCss) {
    this.modalRef = this.modalService.show(modalTemplate, {
      class: 'modal-dialog-centered '+classCss,
      backdrop: 'static',
      keyboard: false,
    });
    this.disableSimulateTillOpen = false;
    this.removeLoader();
  }
  reloadBeeEditor(tempObj) {
    this.templateObj = tempObj;
    this.beeTest.load(this.templateObj);
    //this.getBeeConfigSettings(this.templateObj);
    //this.removeLoader();
  }
  
  failsafeDetailsMethod() {
    this.shareService.failSafSubjectObj.subscribe((obj) => {
      this.failsafeSubjctObj = obj;
      this.failsafeSubjectObj.subject = obj.subject;
      this.failsafeSubjectObj.preHeader = obj.preHeader;
    });
    if (this.isFailSafeTabActive || this.isFailSafePreviousTab == 1) {
      this.shareService.subjectNpreheaderInputValueFailsafe.subscribe((res: any) => {
        this.failsafeSubjectObj.subject = res.subject;
        this.failsafeSubjectObj.preHeader = res.preHeader;
      });
    }
    if (this.isFailSafeTabActive && this.isTestEmail && !this.isTemplateEditMode) {
      if (this.payloadWithFailsafe !== undefined && this.failsafeSubjctObj !== undefined) {
        this.payloadWithoutFailsafe.channels[0].failSafeInfo.failsafeSubObj.subject = this.failsafeSubjctObj.subject;
        this.payloadWithoutFailsafe.channels[0].failSafeInfo.failsafeSubObj.preHeader = this.failsafeSubjctObj.preHeader;
      }
    }

    this.shareService.failSafSubjectObj.next(this.failsafeSubjectObj);
  }

  findRowDynamicContentByHTMLAttributes(beeEditorHtml) {
    // Parse the HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(beeEditorHtml, 'text/html');
    const rowId = GlobalConstants.selectedRowId;
    const dynamicContent = doc.querySelector(`dynamic-content[id="${rowId}"]`);
    if (dynamicContent) {
      let outerHTML = dynamicContent.outerHTML;

      const attributeMappings = {
        "placementid": "placementId",
        "maxcount": "maxCount",
        "recoattributes": "recoAttributes",
        "rowstyle": "rowStyle",
        "layoutstyle":"layoutStyle",
        "modelname": "modelName",
        "modeldisplayname": "modelDisplayName",
        "rowname": "rowName",
        "parametervalues":"parameterValues",
        "apiname":"apiName",
        "apitype":"apiType",
        "queryparams":"queryParams",
        "freestyle":"freeStyle"

      };
  
      const updatedHTML = dynamicContent.outerHTML.replace(
        /placementid|maxcount|recoattributes|rowstyle|layoutstyle|modelname|modeldisplayname|rowname|parametervalues|apiname|apitype|queryparams|freestyle/g,
        attribute => attributeMappings[attribute]
      );
      this.shareService.selectedRowOuterHTML.next(updatedHTML);
      this.shareService.enablePreviewAfterCall.next(true);
    }
  }
 
  findMergeTagByHTMLAttributes(modalTemplate: TemplateRef<any>, beeEditorHtml) {
    GlobalConstants.selectedDmeModels = [];
    GlobalConstants.selectedApiModels = [];
    GlobalConstants.productMergeTags = [];
    let dmeTagService = false;
    let apiTagService = false;
    let productRecoTagService = false;
    let productContextTagService = false;
    
    let htmlDocTemp = this.domParser.parseFromString(beeEditorHtml, 'text/html');
    let freeStyleRowMapping = {};

    /* let apiSavedAttributes: any = Array.from(htmlDocTemp.querySelectorAll('[type="api"]')).map((item2) => item2.getAttribute('apiName'));
    apiSavedAttributes = Array.from(new Set(apiSavedAttributes));

    let dmeSavedAttributes: any = Array.from(htmlDocTemp.querySelectorAll('[type="DME"]')).map((item2) => item2.getAttribute('modelName'));
    dmeSavedAttributes = Array.from(new Set(dmeSavedAttributes)); */

    const apiSavedAttributes = [...new Set(Array.from(htmlDocTemp.querySelectorAll('[type="api"]')).map(item2 =>{
      let apiname = item2.getAttribute('apiName');
      if(apiname){
        freeStyleRowMapping[apiname] = {
          freeStyle : item2.getAttribute('freeStyle') || false,
          maxCount : item2.getAttribute('maxCount')
         };
      }
      return apiname

    } ))];
    const dmeSavedAttributes = [...new Set(Array.from(htmlDocTemp.querySelectorAll('[type="DME"]')).map(item2 =>{
      let modelName =  item2.getAttribute('modelName');
      if(modelName){
        freeStyleRowMapping[modelName] = {
          freeStyle : item2.getAttribute('freeStyle') || false,
          maxCount : item2.getAttribute('maxCount')
        }
      }
      return modelName;
      }
      ))];
    const productRecoSavedAttributes = [...new Set(Array.from(htmlDocTemp.querySelectorAll('[type="productReco"]')).map(item2 => item2.getAttribute('placementId')))];
    const productContextSavedAttributes = [...new Set(Array.from(htmlDocTemp.querySelectorAll('[type="contextProduct"]')))];

    dmeTagService = dmeSavedAttributes.length !== 0;
    apiTagService = apiSavedAttributes.length !== 0;
    productRecoTagService = productRecoSavedAttributes.length !== 0;
    productContextTagService = productContextSavedAttributes.length !== 0;

    if (dmeTagService || apiTagService || productRecoTagService || productContextTagService) {
      let requests: any;
      let dme_requests: any = [];
      let api_requests: any = [];
      let productReco_requests: any = [];
      let product_requests: any = [];
      
      if(dmeTagService) {
       
        dme_requests = dmeSavedAttributes.map((modelName) =>{
          let url = AppConstants.API_END_POINTS.GET_DME_MODEL_ATTRIBUTES;
          if(modelName ){
            let freeStyleQueryParam = freeStyleRowMapping[modelName]['freeStyle'] || false;
            let  maxCountQueryParam = freeStyleRowMapping[modelName]['maxCount'] || 1;  
             //  url = url+`?${freeStyleQueryParam}&${maxCountQueryParam}`;
             url = url+'?freeStyle='+ freeStyleQueryParam + '&maxCount=' + maxCountQueryParam + '&modelName='+modelName;
          }  
          else{
            url = url+ '?modelName='+modelName;
          }
          return this.http.post(url)
        }
        );
      }
      
      if(apiTagService) {
       

        api_requests = apiSavedAttributes.map((apiName) =>{
          let url = AppConstants.API_END_POINTS.GET_API_OUTPUT_FIELDS;

          if( apiName ){
            let freeStyleQueryParam = freeStyleRowMapping[apiName]['freeStyle'] || false;
            let  maxCountQueryParam = freeStyleRowMapping[apiName]['maxCount'] || 1; 
            url = url+'freeStyle='+ freeStyleQueryParam + '&maxCount=' + maxCountQueryParam + '&apiName='+apiName; 
          //  url = url+`?${freeStyleQueryParam}&${maxCountQueryParam}`;
          }
          else{
            url = url+ 'apiName='+apiName;
          }
          return this.http.post(url);
        });
      }

      if(productRecoTagService || productContextTagService) {
        let url: any;
        if(this.isPersonalizeTagMode) {
          url = AppConstants.API_PERSONSOALIZATION_TAGS_END_POINTS.GET_All_PERSONALIZATION_PLACEMENTS+this.tagkey;
        } else {
          url = AppConstants.API_END_POINTS.GET_All_PLACEMENTS_PAGE_TYPE+this.promoKey;
        }
        productReco_requests = productRecoSavedAttributes.map((t) => this.http.post(url));
        product_requests = productContextSavedAttributes.map((t) => this.http.post(url));
      }
      
      requests = [...dme_requests, ...api_requests, ...productReco_requests, ...product_requests];
      forkJoin(requests).subscribe((responses) => {
        (responses as any[]).forEach((res: any) => {          
          if(res.type == "DME") {
            let modelName: any;
            let resultJSON = JSON.parse(res.response);
            const parentDmeMerge = {  
              id: resultJSON[0].modelName,
              text: resultJSON[0].modelName,
              type: resultJSON[0].type,
              userdata: resultJSON,
            };

            if(!GlobalConstants.selectedDmeModels.some(obj => obj.id === parentDmeMerge.id)) {
              GlobalConstants.selectedDmeModels.push(parentDmeMerge);
            }
          } else if(res.type == "API") {
            let resultJSON = JSON.parse(res.response);
            if(resultJSON.length > 0){
              const parentApiMerge = {
                id: resultJSON[0].apiName,
                text: resultJSON[0].apiName,
                type: resultJSON[0].type,
                userdata: resultJSON,
              };
              if(!GlobalConstants.selectedApiModels.some(obj => obj.text === parentApiMerge.text)) {
                GlobalConstants.selectedApiModels.push(parentApiMerge);
              }
            }      

          } else if(res.type == "ProductReco") {
            this.productAttributesArry = JSON.parse(res.response.productAttributes);
            let productAttrTemp = this.productAttributesArry;
            let proArray: any[] = [];
            for (let key in productAttrTemp) {
              let p: any = {};
              p["name"] = productAttrTemp[key];
              p["value"] = key;
              proArray.push(p);
            }
            const parentRecoMerge = {
              id: "Product",
              text: "Product",
              userdata: proArray,
            };

            if(!GlobalConstants.productMergeTags.some(obj => obj.id === parentRecoMerge.id)) {
              GlobalConstants.productMergeTags.push(parentRecoMerge);
            }
          }
          
          //console.log(GlobalConstants.selectedDmeModels);
          this.isMergeTagDmeEnabled = true;
          this.loader.HideLoader();
        });

        if(GlobalConstants.isOpenGlobalTags) {
          this.modalRef = this.modalService.show(MergeTagsComponent, {
            class: 'modal-dialog-centered',
            backdrop: true,
            keyboard: false
          }); 
        }
        
      }, (error) => {
        this.isMergeTagDmeEnabled = true;
        this.removeLoader();
      });
    } else {
      this.isMergeTagDmeEnabled = true;
      this.loader.HideLoader();

      if(GlobalConstants.isOpenGlobalTags) {
        this.modalRef = this.modalService.show(MergeTagsComponent, {
          class: 'modal-dialog-centered',
          backdrop: true,
          keyboard: false
        }); 
      }
      
    }
  }

  openGlobalMTagPopup() {
    this.loader.HideLoader();
    this.isMergeTagBttnDisabled = false;
    this.modalRef = this.modalService.show(GlobalMergeTagsComponent, {
      class: 'globalMergeTagStyle modal-dialog-centered',
      backdrop: true,
      keyboard: false
    });
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

  toggleActionPopup() {
    if (this.showActionListpopup) {
      this.showActionListpopup = false;
    } else {
      this.showActionListpopup = true;
    }
  }

  extractTypeAttribute(inputString) {
      // Create a temporary DOM element to parse the input string
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = inputString.trim();
     
      // Extract the dynamic-content element
      const dynamicContentElement = tempDiv.querySelector('dynamic-content');
      

      // Check if the element exists and has a 'type' attribute
      if (dynamicContentElement) {
        let attributesObj = {
          'freeStyle': dynamicContentElement.getAttribute('freeStyle') || false,
          'maxCount': dynamicContentElement.getAttribute('maxCount') || 1,
          'type' : dynamicContentElement.getAttribute('type') || null,
          'whichBlockDragged': dynamicContentElement.getAttribute('data-isDmeBlock') || undefined
        };

        if (attributesObj.type === 'dme') {
          attributesObj['modelHashName'] = dynamicContentElement.getAttribute('modelName') || null;
        }
          return attributesObj;
      } else {
          return {}; // Or any other value indicating the attribute was not found
      }
  }

  callParentEditorFunction() {
    this.parentEditorFunction.emit();
  }
  
}