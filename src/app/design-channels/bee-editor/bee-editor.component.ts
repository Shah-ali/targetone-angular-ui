import { Component, OnInit, ViewChild, Input, Output, EventEmitter, TemplateRef, NgZone, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import BeefreeSDK from '@beefree.io/sdk';
import { HttpService } from '@app/core/services/http.service';
import { GlobalConstants } from '../common/globalConstants';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { OpenModalComponent } from '../open-modal/open-modal.component';
import { SaveUserRowsComponent } from '../save-user-rows/save-user-rows.component';
import { SaveEmailComponent } from '../save-email/save-email.component';
import { SharedataService } from '@app/core/services/sharedata.service';
import { environment } from '@env/environment';
import { AppConstants } from '@app/app.constants';
import { failSafeinfo } from '../modalInterface';
import Swal from 'sweetalert2';
import { LoaderService } from '@app/core/services/loader.service';
import { MergeTagsComponent } from '../merge-tags/merge-tags.component';
import { OffersComponent } from '../offers/offers.component';
import emptyJson from '../../../assets/JSON/emptyEmail.json';
import customAddedFonts from '../../../assets/fonts/custom-fonts.json';
import { RecommendationComponent } from '../recommendation/recommendation.component';
import { TranslateService } from '@ngx-translate/core';
import { RecommendationOffersComponent } from '../recommendation-offers/recommendation-offers.component';
import { DataService } from '@app/core/services/data.service';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { forkJoin } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ProductOffersComponent } from '../product-offers/product-offers.component';
import { FullPreviewAddonsComponent } from '../full-preview-addons/full-preview-addons.component';
import { DisplayConditionComponent } from '../display-condition/display-condition.component';
import beeFreeModulesJSON from '@assets/JSON/beeFreeModulesJSON.json';
import { GlobalMergeTagsComponent } from '../global-merge-tags/global-merge-tags.component';
import { CopyClipboardComponent } from '@app/utils/copy-clipboard/copy-clipboard.component';
import { TextAddonsComponent } from '../text-addons/text-addons.component';
import { ImageAddonsComponent } from '../image-addons/image-addons.component';
import { RatingsComponent } from '../ratings/ratings.component';
import { JourneyCustomerDMEComponent } from '../dme-customer-journey/journey-customer-dme/journey-customer-dme.component';
import { JourneyNonCustomerDMEComponent } from '../dme-non-customer-journey/journey-non-customer-dme/journey-non-customer-dme.component';
import { ActiveContentComponent } from '../active-content/active-content.component';
import { LocaleService } from '@app/core/services/locale.service';
import { BadgingWidgetComponent } from '../badging-widget/badging-widget.component';

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
  selector: 'app-bee-editor',
  templateUrl: './bee-editor.component.html',
  styleUrls: ['./bee-editor.component.scss'],
})
export class BeeEditorComponent implements OnInit {
  @ViewChild('emailContainer') container: any;
  @ViewChild(CopyClipboardComponent) copyClipboard!: CopyClipboardComponent;
  @Input()
  isEdit: string = 'block';
  designForChannels = 'Edit design for';
  @Output() getSubjectVal = new EventEmitter<any>();
  @Output() callSubjectMethod = new EventEmitter<any>();
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
  beeTest:any;
  subjctObj: any;
  promotionObj: any;
  vendorObj: any;
  getThumbnailObj: any;
  channelObj: any;
  @Input() templateKey: any = GlobalConstants.templateKey;
  private BASE_URL = environment.BASE_URL;
  private CLOUD_FRONT_URL = environment.CLOUD_FRONT_URL;
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
  productAttributesArry: any = [];
  isPersonalizeTagMode: boolean = false;
  fullPreviewMode: boolean = false;
  customFontsObj: any;

  constructor(
    private http: HttpService,
    private modalService: BsModalService,
    private shareService: SharedataService,
    private router: Router,
    private loader: LoaderService,
    private ngZone: NgZone,
    private translate: TranslateService,
    private dataService: DataService,
    private authService: AuthenticationService,
    private localeService: LocaleService
  ) {

    try {
      this.beeTest = new BeefreeSDK(this.localeService.beeToken);
    } catch (error) {
      console.error('Beefree initialization failed:', error);
    }

    this.customFontsObj = customAddedFonts.map(font => {
      return {
        ...font,
        url: font.url.replace('{baseUrl}', this.FONT_URL)
      };
    });
    
    this.shareService.setActiveLanguage.subscribe((res) => {
      this.DEFAULT_LANGUAGE = res;
    });

    this.shareService.templateLibrary.subscribe((res) => {
      this.isTemplateLibraryMode = res;
      if (this.isTemplateLibraryMode) {
        this.isSubjectAreaEnable = this.isTemplateLibraryMode;
      }
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
    this.temparySaveChannelData();
    // loads empty json into bee editor.
    this.shareService.isEmptyJsonToload.subscribe((res) => {
      this.isEmptyJsonToloadInBeeEditor = res;
    });
    this._urlPath = GlobalConstants.urlPath;
    if (this.isTemplateLibraryMode && this.isEmptyJsonToloadInBeeEditor) {
      this._urlPath = undefined;
    }
    this.isTemplateEditMode = GlobalConstants.isEditMode;
    this.getBeeEditorLoadObj(this._urlPath);
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
  ngOnInit(): void {
    /* if (!this.isTemplateLibraryMode) {
      this.dataSetApiCallForContextFlag();
    } */
  }
  callPreviewOnClientMethodFromSaveBtn(template, type) {
    this.loader.ShowLoader();
    GlobalConstants.actionsPreviewEnable = true;
    if (this.isFailSafeTabActive) {
      this.shareService.subjectObj.subscribe((res) => {
        this.failsafeSubjctObj = res;
        this.senderId = res.senderId;
        this.vendorId = res.senderConfigKey;
        this.shareService.subjectNpreheaderInputValueFailsafe.subscribe((res: any) => {
          if (Object.keys(res).length > 0) {
            this.failsafeSubjctObj.subject = res.subject;
            this.failsafeSubjctObj.preHeader = res.preHeader;
          }
        });
        if (GlobalConstants.actionsPreviewEnable) {
          if (this.failsafeSubjctObj.subject === '' && this.isFailSafeTabActive) {
            Swal.fire({
              title: this.translate.instant(
                'designEditor.beeEditorComponent.validationMsg.emailFailsafeSubjectShouldNotBeEmptyAlertMsg'
              ),
              allowEscapeKey: false,
              allowOutsideClick: false,
              showConfirmButton: true,
              confirmButtonText: this.translate.instant('designEditor.okBtn'),
            });
            this.removeLoader();
            return;
          } else if (this.isFailSafeTabActive) {
            this.istypeOfAction(type, template);
            this.beeTest.send();
          }
        }
      });
    } else {
      this.shareService.subjectObj.subscribe((res) => {
        this.subjctObj = res;
        this.senderId = res.senderId;
        this.vendorId = res.senderConfigKey;
        this.shareService.subjectNpreheaderInputValue.subscribe((res: any) => {
          if (Object.keys(res).length > 0) {
            this.subjctObj.subject = res.subject;
            this.subjctObj.preHeader = res.preHeader;
          }
        });
        if (GlobalConstants.actionsPreviewEnable) {
          if (this.subjctObj.subject === '' && !this.isFailSafeTabActive) {
            Swal.fire({
              title: this.translate.instant('designEditor.beeEditorComponent.validationMsg.emailSubjectShouldNotBeEmptyMsglbl'),
              allowEscapeKey: false,
              allowOutsideClick: false,
              showConfirmButton: true,
              confirmButtonText: this.translate.instant('designEditor.okBtn'),
            });
            this.removeLoader();
            return;
          } else if (!this.isFailSafeTabActive) {
            this.istypeOfAction(type, template);
            this.beeTest.send();
          }
        }
      });
    }
  }
  istypeOfAction(type, template) {
    if (type === 1) {
      // preview on Client 1
      if (this.isFailSafeTabActive) {
        this.isPreviewOnClientEnableFailSafe = true;
        this.isSpamTestEnableFailsafe = false;
      } else {
        this.isPreviewOnClientEnable = true;
        this.isSpamTestEnable = false;
      }
      this.previewOnClientTemplate = template;
    } else {
      // Spam test 2
      if (this.isFailSafeTabActive) {
        this.isPreviewOnClientEnableFailSafe = false;
        this.isSpamTestEnableFailsafe = true;
      } else {
        this.isPreviewOnClientEnable = false;
        this.isSpamTestEnable = true;
      }
      this.spamTestTemplate = template;
    }
  }
  async previewOnClient(modalTemplate: TemplateRef<any>, beeEditorHtml, UrlPath, childUrlPath) {
    this.isViewMode = false;
    if (this.isFailSafeTabActive) {
      var activeSubject = encodeURIComponent(this.failsafeSubjctObj.subject);
    } else {
      var activeSubject = encodeURIComponent(this.subjctObj.subject);
    }
    var jsonString = {
      promoKey: this.promoKey,
      commChannelKey: this.commChannelKey,
      viewMode: this.isViewMode,
      emailContent: encodeURIComponent(beeEditorHtml),
      //"emailContent" : encodeURIComponent(iframeContent), old approach
      senderId: this.senderId,
      subject: activeSubject,
      splitKey: this.currentSplitId,
    };
    var emailPrevMsg = this.translate.instant(
      'designEditor.beeEditorComponent.validationMsg.youHaveExhaustedAllYourPreviewsForThisMonthAlertMgs'
    );
    const previewList = await this.http.post(UrlPath, jsonString).toPromise();
    if (previewList.status == 'SUCCESS') {
      if (previewList.response === 'Present') {
        this.loader.ShowLoader();
        const previewClientLists = await this.http.post(childUrlPath, jsonString).toPromise();
        if (previewClientLists.status === 'SUCCESS') {
          this.openPrviewPopup(previewClientLists.response, modalTemplate);
        }
      } else {
        if (emailPrevMsg == previewList.response) {
          Swal.fire({
            title: emailPrevMsg,
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonText: this.translate.instant('designEditor.okBtn'),
          });
          return;
        }
        this.previewPopupByConfirmation(previewList.response, modalTemplate, jsonString, childUrlPath);
      }
      // console.log(previewList);
    } else if (previewList.status == 'FAIL') {
      this.removeLoader();
      this.dataService.SwalAlertMgs(previewList.message);
    }
  }

  async previewPopupByConfirmation(response, modalTemplate, jsonString, childUrlPath) {
    Swal.fire({
      title: response,
      width: '60%',
      icon: 'warning',
      showCloseButton: false,
      showCancelButton: true,
      confirmButtonText: this.translate.instant('designEditor.okBtn'),
      //confirmButtonColor: '#3366FF',
      cancelButtonText: this.translate.instant('designEditor.cancelBtn'),
      cancelButtonColor: '',
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        cancelButton: 'buttonCssStyle',
        confirmButton: 'buttonCssStyle',
      },
    }).then(async (result) => {
      if (result.value) {
        this.loader.ShowLoader();
        const previewLists = await this.http.post(childUrlPath, jsonString).toPromise();
        if (previewLists.status === 'SUCCESS') {
          this.openPrviewPopup(previewLists.response, modalTemplate);
        }
      } else {
        this.removeLoader();
      }
    });
  }
  openPrviewPopup(listJson, modalTemplate) {
    this.removeLoader();
    var jsonList = JSON.parse(listJson);
    this.ngZone.run(() => {
      if (this.isPreviewOnClientEnable || this.isPreviewOnClientEnableFailSafe) {
        this.shareService.previewClientJsonObj.next(jsonList);
        this.shareService.spamTestJsonObj.next([]);
      } else if (this.isSpamTestEnable || this.isSpamTestEnableFailsafe) {
        this.shareService.spamTestJsonObj.next(jsonList);
        this.shareService.previewClientJsonObj.next([]);
      }
      this.modalRef = this.modalService.show(modalTemplate, {
        class: 'modal-dialog-centered previewOnClient',
        backdrop: 'static',
        keyboard: false,
      });
    });
  }
  toggleActionPopup() {
    if (this.showActionListpopup) {
      this.showActionListpopup = false;
    } else {
      this.showActionListpopup = true;
    }
  }
  temparySaveChannelData() {
    this.shareService.isTemperarySave.subscribe((res) => {
      this.isTemperarySave = res;
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
  getBeeEditorLoadObj(url) {
    this.loader.ShowLoader();
    if (this.isTemplateEditMode) {
      // Load saved Template
      this.shareService.savedTemplateObj.subscribe((data: any) => {
        this.editModeSavedObj = data;
        const json = data.find((x) => x.promoSplitKey == this.currentSplitId);
        this.isFailSafeEnabled = json.failSafe;
        if (!this.isFailSafeEnabled || this.isFailSafeEnabled) {
          let subjtObj = this.updateEditModeSubjectObj(json);
          subjtObj.preHeader = json.preHeader;
          subjtObj.subject = json.subjectLine;
          //this.shareService.updateSubjectPreheader.next(subjtObj);
          this.subjctObj = subjtObj;
          this.fullPreviewMode = false;
          const payload = this.createSaveJsonForEmailChannel(json.actualTemplateText, json.failSafetemplateText);
          this.payloadWithoutFailsafe = payload;
        }
        if (this.isFailSafeEnabled) {
          let subjtObj = this.updateEditModeSubjectObj(json);
          this.failsafeSubjectObj.preHeader = json.failSafePreHeader;
          this.failsafeSubjectObj.subject = json.failSafeSubjectLine;
          this.failsafeSubjctObj = subjtObj;
          //this.shareService.failSafSubjectObj.next(subjtObj);
          const payload = this.createSaveJsonForfailSafeEmailChannel(json.failSafeActualTemplateText, json.failSafetemplateText);
          this.payloadWithFailsafe = payload;
        }
        this.templateObj = JSON.parse(json.actualTemplateText);
        this.templateKey = json.templateUuid; // templateUUID
        this.templateId = json.templateParentKey; // templateKey
        this.shareService.beeTemplateSelectedKey.next(json.templateParentKey);
        //this.shareService.isEditmode = true;
        let subjectObj = {
          channelKey: json.commChannelKey,
          senderConfigKey: json.senderKey,
          senderId: json.senderId,
          senderName: json.senderName,
          subject: json.subjectLine,
          preHeader: json.preHeader,
          vendorDesc: json.senderName,
        };
        this.shareService.subjectObj.next(subjectObj);

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
      });
    } else {
      // Load Pre-build template
      this.getTemplateData(url);
    }
  }

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
  getTemplateData(url: string) {
    if (url !== undefined && url !== '') {
      // if It is Pre-build templates
      if (this.isDefaultStorageBEE !== undefined) {
        if (this.isDefaultStorageBEE) {
          this.http.BeePost(url).subscribe((data: any) => {
            this.templateObj = data.json_data;
            this.templateId = 10101010; // Dummy Value for Default Bee Template
            this.getBeeConfigSettings(this.templateObj);
            this.loader.HideLoader();
          });
        } else {
          //--- if it is S3 templates
          this.http.post(url).subscribe((data: any) => {
            this.templateId = data.templateKey;
            this.templateObj = data.json_data;
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
  getDataRes(data) {
    if (this._urlPath) {
      this.templateObj = data.json_data;
      if (data.subjectObj != undefined || data.subjectObj != '') {
        //this.shareService.isEditmode = true;
        this.shareService.subjectObj.next(data.subjectObj);
      }
    } else {
      this.templateObj = data.json_data; //JSON.parse(data[0].json);
    }
  }

  getBeeConfigSettings(templateObj: any) {

    /* Merge Tags */
    if (!this.isTemplateLibraryMode) {
      if (GlobalConstants.promotionSplitHelper.splitsGroups.length > 0) {
        this.varArgsMergeTags = GlobalConstants.promotionSplitHelper.splitsGroups[0].channels[0].varArgs.root.item;
      }
    }
    if (this.varArgsMergeTags.length > 0) {
      var customer_data = this.varArgsMergeTags[0].userdata;
      var re: any = [];
      customer_data.filter(function (el) {
        let vr: any = {};
        vr['name'] = el.value;
        vr['value'] = '{' + el.value + '}';
        re.push(vr);
      });
    }
    const mergeTags = re;
    /* Merge Tags end */

    let customCssTemplateLibrary = '';
    if (this.isTemplateLibraryMode) { // if it is templates library
      customCssTemplateLibrary = `${this.CLOUD_FRONT_URL}/resources/css/template-library-bee.css`;
      
      this.tempAddOnList = beeFreeModulesJSON.hideModulesInTemplateLib;

      this.isAddOnModuleEnable = false;
      this.modulesGroupsCMP = [];
    } else {
      if(!this.isPersonalizeTagMode) {
        this.tempAddOnList = beeFreeModulesJSON.hideModulesInDesignPage;
      }
      customCssTemplateLibrary = `${this.CLOUD_FRONT_URL}/resources/css/design-page-bee.css`;
      this.modulesGroupsCMP = [{
        label: this.translate.instant('designEditor.beeEditorComponent.contentBlocksLbl'),
        collapsable: true,
        collapsedOnLoad: false,
        modulesNames: beeFreeModulesJSON.designPageModules,
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
        customFonts: this.customFontsObj
      },
      sidebarPosition: 'left',
      mergeTags,
      defaultModulesOrder: ['Product', 'Offers', 'Recommendation', 'Offers Coupons'],
      customCss: customCssTemplateLibrary,
      modulesGroups: this.modulesGroupsCMP,
      addOns: this.tempAddOnList,
      advancedPermissions: {
        rows: {
          displayConditions: {
            show: true,
            locked: false
          },
        },
        content: {
          image: {
            properties: {
              inputText: {
                show: false,
                locked: false
              },
            }
          }
        },
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

            GlobalConstants.isOpenDisplayCondition = true;
            GlobalConstants.isOpenGlobalTags = false;
            GlobalConstants.isOpenGlobalMTags = false;
            GlobalConstants.isOpenTextImageAddon = false;
            this.isFullPreviewEnabled = false;
            this.shareService.enablePreviewAfterCall.next(false);
            this.beeTest.send();
            this.ngZone.run(() => {
              this.displayConditionsFinal = this.showModal2Component(resolve,reject,args, DisplayConditionComponent);
            });
            //resolve(this.displayConditionsFinal);
          },
        },
        mergeTags: {
          label: this.translate.instant('designEditor.beeEditorComponent.searchsTagslbl'),
          handler: (resolve, reject, args) => {
            args.modal = {
              icon: 'search',
              title: this.translate.instant('designEditor.beeEditorComponent.searchMergeTagslbl'),
            };

            this.showModalComponent(resolve, reject, args, MergeTagsComponent);
          },
        },
        addOn: {
          handler: async (resolve, reject, args) => {
            const { contentDialogId, value } = args;
            GlobalConstants.selectedRowId = args.value.id || "";
            GlobalConstants.isRowEditModeEnable = !!args.value.id;
            if (contentDialogId == 'promoOfferList') {
              GlobalConstants.isCouponEnable = false;
              GlobalConstants.isAddOnProductList = true;
              this.shareService.offersBlockEditMode.next(args.value.html);
              this.showModalComponent(resolve, reject, args, OffersComponent);              
            } else if (contentDialogId == 'offers_coupons') {
              GlobalConstants.isCouponEnable = true;
              GlobalConstants.isAddOnProductList = true;
              this.shareService.offersBlockEditMode.next(args.value.html);
              this.showModalComponent(resolve, reject, args, OffersComponent);              
            } else if (contentDialogId == 'ProductRecommendation') {
              GlobalConstants.isAddOnProductList = true;
              if (GlobalConstants.rrWidgetCount > this.maxRRWidgetCount || this.maxRRWidgetCount == undefined) {
                this.maxRRWidgetCount = GlobalConstants.rrWidgetCount;
              }

              if (args.value?.html) {
                const htmlDoc = this.domParser.parseFromString(args.value.html, 'text/html');
                const idObj = htmlDoc.querySelector('.cmp-widget')?.id;

                if (idObj) {
                  const id = idObj.substring(1);
                  GlobalConstants.rrWidgetCount = parseInt(id, 10);
                } else {
                  GlobalConstants.rrWidgetCount = this.maxRRWidgetCount;
                }
              } else {
                GlobalConstants.rrWidgetCount = this.maxRRWidgetCount;
              }
              this.showModalComponent(resolve, reject, args, RecommendationComponent);
            } else if (contentDialogId == 'reco-rule') {
              GlobalConstants.isCouponEnable = false;
              GlobalConstants.isAddOnProductList = true;
              this.shareService.addOnContentDialogId.next(contentDialogId);
              this.showModalComponent(resolve, reject, args, RecommendationOffersComponent);
              this.shareService.isRecomendationOfferEditMode.next(args.value.metadata);
            } else if (contentDialogId == 'rule-offer') {
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
                this.shareService.savedAddOnsJSON.next(args.value.metadata);
                this.showModalComponent(resolve, reject, args, ProductOffersComponent);
              }
            } else if(contentDialogId == 'DME_Rule'){
              GlobalConstants.isCouponEnable = false;
                  GlobalConstants.isAddOnProductList = true;
                  this.shareService.addOnContentDialogId.next(contentDialogId);
                  this.shareService.dmeOffersEditMode.next(args.value.metadata);
                  //this.showModalComponent(resolve,reject,args,DMEOffersComponent); 
                  this.showModalComponent(resolve,reject,args,JourneyCustomerDMEComponent); //DMECustomerComponent //DMEOffersComponent
                  this.shareService.isJourneyDMECustomerEditMode.next(args.value.metadata);                  
            }else if(contentDialogId == 'non-customer-dme'){ // Non Customer DME block
              GlobalConstants.isCouponEnable = false;
              GlobalConstants.isAddOnProductList = true;
              //this.shareService.addOnContentDialogId.next(contentDialogId);              
              this.showModalComponent(resolve,reject,args,JourneyNonCustomerDMEComponent);
              this.shareService.isJourneyDMENonCustomerEditMode.next(args.value.metadata);
            } else if (contentDialogId == 'ratingPlugin') {
              this.shareService.addOnContentDialogId.next(contentDialogId);
              this.showModalComponent(resolve, reject, args, RatingsComponent);
            }else if (contentDialogId == 'textAddons') {
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
            }else if (contentDialogId == 'active-content-addon') {
                this.shareService.addOnContentDialogId.next(contentDialogId);
                this.shareService.savedAddOnsJSON.next(args.value);
                this.showModalComponent(resolve, reject, args, ActiveContentComponent);
            } 
            
            else if (contentDialogId == 'acbadge') {
                this.shareService.addOnContentDialogId.next(contentDialogId);
                this.shareService.savedAddOnsJSON.next(args.value);
                this.showModalComponent(resolve, reject, args, BadgingWidgetComponent);
            } else {
              GlobalConstants.isAddOnProductList = true;
              this.showModalComponent(resolve, reject, args, OpenModalComponent);
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
          },
        ],
      },
      onLoad: () => {
        this.fullPreviewBtnDisabled = true;
        this.removeLoader();
      },
      onSave: (jsonFile, htmlFile) => {
        GlobalConstants.actionsPreviewEnable = false;
        this.shareService.failSafeEnable.subscribe((res) => {
          this.isFailSafeEnabled = res;
        });
        if (this.isTestEmail) {
          if (this.testEmailTemplate !== undefined) {
            this.ngZone.run(() => {
              this.showTestPopupAfterBeeCall(this.testEmailTemplate);
            });
          }
        }
        const endpoint = AppConstants.API_END_POINTS.SAVE_ADMIN_PEOMO_TEMPLATE_USAGE; //"http://localhost:3000/saveMessage";//"https://plugin-demos.getbee.io/saveMessage";//https://bee-multiparser.getbee.io/api/v3/parser/email?p=true&mtp=true&b=false";//"http://localhost:3000/saveMessage";
        // if(!this.isTestEmail) {
        //   this.loader.ShowLoader();
        // }
        // get subject data commonly

        if (this.isTemperarySave && !this.isTestEmail) {
          //validation
          if (this.isFailSafePreviousTab == 0 && this.isFailSafeEnabled) {
            // -------- saves the previous data and loads the current data-------
            this.subjectDetailsMethod();
            this.fullPreviewMode = false;
            const payload = this.createSaveJsonForEmailChannel(jsonFile, htmlFile);
            this.payloadWithoutFailsafe = payload;
            console.log(payload);
            if (this.payloadWithFailsafe !== undefined) {
              const tempPayload = JSON.parse(this.payloadWithFailsafe.channels[0].failSafeInfo.json);
              let subjtObj = this.updateSubjectObj(this.payloadWithoutFailsafe.channels[0].subjectObj);
              subjtObj.preHeader = this.payloadWithFailsafe.channels[0].failSafeInfo.failsafeSubObj.preHeader;
              subjtObj.subject = this.payloadWithFailsafe.channels[0].failSafeInfo.failsafeSubObj.subject;
              this.shareService.subjectNpreheaderInputValueFailsafe.subscribe((res: any) => {
                if (Object.keys(res).length > 0) {
                  subjtObj.preHeader = res.preHeader;
                  subjtObj.subject = res.subject;
                }
              });
              this.shareService.updateSubjectPreheader.next(subjtObj);
              this.subjctObj = subjtObj;
              this.reloadBeeEditor(tempPayload);
            } else {
              if (this.isTemplateEditMode && this.isFailSafeEnabled) {
                if (this.isFailSafeCurrentTab == 1) {
                  //--- edit mode data for current channel----
                  const currentSavedObj = this.editModeSavedObj.find((x) => x.promoSplitKey == this.currentSplitId);
                  this.loadcurrentSavedObj(currentSavedObj);
                }
              } else {
                const subjtObj = { preHeader: '', subject: '' };
                this.shareService.updateSubjectPreheader.next(subjtObj);
                this.removeLoader();
              }
            }
            //  if(this.payloadWithoutFailsafe === undefined){
            //   this.shareService.updateSubjectPreheader.next(subjtObj);
            // }
            // this.removeLoader();
          }

          if (this.isFailSafePreviousTab == 1 && this.isFailSafeEnabled) {
            // Failsafe channel Save
            this.failsafeDetailsMethod();
            const payload = this.createSaveJsonForfailSafeEmailChannel(jsonFile, htmlFile);
            this.payloadWithFailsafe = payload;
            console.log(payload);
            if (this.payloadWithoutFailsafe !== undefined) {
              const tempPayload = JSON.parse(this.payloadWithoutFailsafe.channels[0].json);
              let subjtObj = this.updateSubjectObj(this.payloadWithoutFailsafe.channels[0].subjectObj);
              subjtObj.preHeader = this.payloadWithFailsafe.channels[0].subjectObj.preHeader;
              subjtObj.subject = this.payloadWithFailsafe.channels[0].subjectObj.subject;
              this.shareService.subjectNpreheaderInputValue.subscribe((res: any) => {
                if (Object.keys(res).length > 0) {
                  subjtObj.preHeader = res.preHeader;
                  subjtObj.subject = res.subject;
                }
              });
              this.shareService.updateSubjectPreheader.next(subjtObj);
              //this.subjctObj = subjtObj;
              this.reloadBeeEditor(tempPayload);
            } else {
              if (this.isTemplateEditMode && this.isFailSafeEnabled) {
                if (this.isFailSafeCurrentTab == 0) {
                  //--- edit mode data for current channel----
                  const currentSavedObj = this.editModeSavedObj.find((x) => x.promoSplitKey == this.currentSplitId);
                  this.loadcurrentSavedObj(currentSavedObj);
                }
              } else {
                const subjtObj = { preHeader: '', subject: '' };
                this.shareService.updateSubjectPreheader.next(subjtObj);
                this.removeLoader();
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
            this.subjectDetailsMethod();
            this.fullPreviewMode = false;
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
              payload.channels[0]['failSafeInfo'] = this.failsafeInfo;
              if (!this.isTestEmail) {
                this.finalSaveMethod(endpoint, payload);
              }
            }
          } else if (this.isFailSafeCurrentTab == 1 && this.isFailSafeEnabled) {
            this.failsafeDetailsMethod();
            const payload = this.createSaveJsonForfailSafeEmailChannel(jsonFile, htmlFile);
            if (!this.isTestEmail) {
              this.finalSaveMethod(endpoint, payload);
            }
          } else {
            if (!this.isFailSafeEnabled) {
              this.subjectDetailsMethod();
              this.fullPreviewMode = false;
              const payload = this.createSaveJsonForEmailChannel(jsonFile, htmlFile);
              if (!this.isTestEmail) {
                this.finalSaveMethod(endpoint, payload);
              }
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
              this.shareService.isEditMode.next(this.isTemplateEditMode);
              this.shareService.failSafeTabActive.next(this.isFailSafeTabActive);
              this.shareService.testEmailObj.next(payload);
              console.log(payload);
            } else {
              if (this.isFailSafeTabActive) {
                this.failsafeDetailsMethod();
                const payload = this.createSaveJsonForfailSafeEmailChannel(jsonFile, htmlFile);
                this.shareService.testEmailObj.next(payload);
              } else {
                this.subjectDetailsMethod();
                this.fullPreviewMode = false;
                const payload = this.createSaveJsonForEmailChannel(jsonFile, htmlFile);
                this.shareService.testEmailObj.next(payload);
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
          this.templateKey = this.translate.instant('defaultLbl');
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
            this.existingOrNewTemplateSavemethod(jsonFile, endpoint, this.isSaveAsTemplate, !this.isTemplateLibraryMode);
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
                this.saveTemplateinS3(saveAsEnpoint, jsonFile);
              } else {
                // save as new
                this.existingOrNewTemplateSavemethod(jsonFile, endpoint, !this.isSaveAsTemplate, !this.isTemplateLibraryMode);
              }
            });
          }
        } else {
          this.existingOrNewTemplateSavemethod(jsonFile, endpoint, this.isSaveAsTemplate, this.isTemplateLibraryMode);
        }
      },
      onSend: (htmlFile,jsonFile) => {
        if (this.isFailSafeTabActive) {
          if (this.isPreviewOnClientEnableFailSafe) {
            this.isFullPreviewEnabled  = false;
            this.previewOnClient(
              this.previewOnClientTemplate,
              htmlFile,
              AppConstants.API_END_POINTS.GET_CURRENT_USAGE_OBJ,
              AppConstants.API_END_POINTS.GET_LITMUS_PREVIEW
            );
          }
          if (this.isSpamTestEnableFailsafe) {
            this.isFullPreviewEnabled  = false;
            this.previewOnClient(
              this.spamTestTemplate,
              htmlFile,
              AppConstants.API_END_POINTS.GET_CURRENT_USAGE_SPAM_TEST_OBJ,
              AppConstants.API_END_POINTS.GET_LITMUS_SPAM_TEST
            );
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
        }else if(GlobalConstants.isOpenGlobalMTags) {
          this.isFullPreviewEnabled  = false;
          this.openGlobalMTagPopup();
        } else {
          if (this.isPreviewOnClientEnable) {
            this.isFullPreviewEnabled  = false;
            this.previewOnClient(
              this.previewOnClientTemplate,
              htmlFile,
              AppConstants.API_END_POINTS.GET_CURRENT_USAGE_OBJ,
              AppConstants.API_END_POINTS.GET_LITMUS_PREVIEW
            );
          } else if(GlobalConstants.isOpenDisplayCondition) {
            this.findRowDynamicContentByHTMLAttributes(
              htmlFile
            );
            GlobalConstants.isOpenDisplayCondition = false;
          }
          if (this.isSpamTestEnable) {
            this.isFullPreviewEnabled  = false;
            this.previewOnClient(
              this.spamTestTemplate,
              htmlFile,
              AppConstants.API_END_POINTS.GET_CURRENT_USAGE_SPAM_TEST_OBJ,
              AppConstants.API_END_POINTS.GET_LITMUS_SPAM_TEST
            );
          }
        }
        if(this.isFullPreviewEnabled){       
          this.getBeeHtmlContent(htmlFile,jsonFile);
        }
        //console.log('onSend', htmlFile)
      },
      onError: (errorMessage) => {
        console.log('onError ', errorMessage);
        this.removeLoader();
      },

      onChange: (jsonFile, response) => {},

      onSaveRow: (rowJSON, html, pageJSON) => {
        // Do something with the returned values...
        if (!rowJSON) return;
        if (!pageJSON) return;
        const row = JSON.parse(rowJSON);
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
        //this.getPostSaveRows("http://localhost:3000/savedRowsData", request.row);https://plugin-demos.getbee.io/feedRows',request.row
        //this.getPostSaveRows("http://localhost:3000/saveRows",request.page);
        /* this.http.BeePost('https://plugin-demos.getbee.io/saveRow', request).subscribe((res) => {
          console.log(res);
        }); */
        this.http.post('/personalizationTags/saveRow', request.row).subscribe((res) => {
          if(res.status == 'SUCCESS')
          this.dataService.SwalSuccessMsg(this.translate.instant('designEditor.beeEditorComponent.saveRowlblSuccess'));
        });
        //saveRows = request.row;
      },
    };

    this.beeTest.start(GlobalConstants.beeConfig, templateObj);
  }
  existingOrNewTemplateSavemethod(jsonFile, endpoint, isSaveTempalate, manageTemplateMode) {
    // Update Existing Templates Where isSaveAsTemplate = true and manageTemplate = true
    Swal.fire({
      title: this.translate.instant('designEditor.beeEditorComponent.templateNamelbl'),
      input: 'text',
      inputValue: this.templateKey,
      //focusCancel:true,
      // customClass:{
      //   input:"swal-readonly"
      // },
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: this.translate.instant('designEditor.saveBtn'),
      cancelButtonText:this.translate.instant('cancel'),
      customClass: {
        cancelButton: 'buttonCssStyle',
        confirmButton: 'buttonCssStyle',
      },
      //buttonsStyling: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.value) {
        const saveAsEnpoint =
          endpoint + result.value + '&saveTemplate=' + isSaveTempalate + '&manageTemplate=' + manageTemplateMode;
        this.saveTemplateinS3(saveAsEnpoint, jsonFile);
      } else {
        this.templateKey = GlobalConstants.templateKey;
        this.removeLoader();
      }
    });
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
  reloadBeeEditor(tempObj) {
    this.templateObj = tempObj;
    this.beeTest.load(this.templateObj);
    //this.getBeeConfigSettings(this.templateObj);
    //this.removeLoader();
  }
 
  subjectDetailsMethod() {
    this.shareService.subjectObj.subscribe((obj) => {
      this.subjctObj = obj;
      this.subjctObj.subject = this.subjctObj.subject;
      this.subjctObj.preHeader = this.dataService.checkNullUndefinedEmpty(this.subjctObj.preHeader);
    });
    if (!this.isFailSafeTabActive || this.isFailSafePreviousTab == 0) {
      this.shareService.subjectNpreheaderInputValue.subscribe((res: any) => {
        this.subjctObj.subject = res.subject;
        this.subjctObj.preHeader = this.dataService.checkNullUndefinedEmpty(res.preHeader);
      });
    }
    if (!this.isFailSafeTabActive && this.isTestEmail && !this.isTemplateEditMode) {
      if (this.payloadWithoutFailsafe !== undefined && this.subjctObj !== undefined) {
        this.payloadWithoutFailsafe.channels[0].subjectObj.subject = this.subjctObj.subject;
        this.payloadWithoutFailsafe.channels[0].subjectObj.preHeader = this.subjctObj.preHeader;
      }
    }
    this.shareService.subjectObj.next(this.subjctObj);
  }
  failsafeDetailsMethod() {
    this.shareService.failSafSubjectObj.subscribe((obj) => {
      this.failsafeSubjctObj = obj;
      this.failsafeSubjectObj.subject = obj.subject;
      this.failsafeSubjectObj.preHeader = this.dataService.checkNullUndefinedEmpty(obj.preHeader);
    });
    if (this.isFailSafeTabActive || this.isFailSafePreviousTab == 1) {
      this.shareService.subjectNpreheaderInputValueFailsafe.subscribe((res: any) => {
        this.failsafeSubjectObj.subject = res.subject;
        this.failsafeSubjectObj.preHeader = this.dataService.checkNullUndefinedEmpty(res.preHeader);
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
  createSaveJsonForfailSafeEmailChannel(jsonFile, htmlFile) {
    // returns saved Failsafe object
    let data = {
      html: htmlFile,
      json: jsonFile,
      failsafeSubObj: this.failsafeSubjectObj,
    };
    if (this.payloadWithoutFailsafe !== undefined) {
      this.finalPayload = this.payloadWithoutFailsafe;
      //this.subjctObj = this.payloadWithoutFailsafe.channels[0].subjectObj;
      this.finalPayload.channels[0].failSafeInfo = data;
      this.failsafeInfo = data;
      this.payloadWithFailsafe = this.finalPayload;
      if (this.isTestEmail) {
        this.shareService.testEmailObj.next(this.finalPayload);
      }
      return this.finalPayload;
    }
    //return this.finalPayload;
  }

  addRatingStylingInHtmlString(htmlString) {
    if (!htmlString || htmlString === 'null' || htmlString === 'undefined') {
      return;
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const ratingElement = doc.querySelector('#rating-parent-section');
    const styleElement = document.createElement('style');

    const cssRules = `.rating-parent-section{background:#000}[data-star]{text-align:left;font-style:normal;display:inline-block;position:relative;unicode-bidi:bidi-override;line-height:0;vertical-align:middle}[data-star]::before{display:inline-block;content:'★★★★★';color:#eee;line-height:1.4}[data-star]::after{white-space:nowrap;position:absolute;top:0;left:0;content:'★★★★★';width:0;color:inherit;overflow:hidden;line-height:1.5}[data-star^="0.1"]::after{width:2%}[data-star^="0.2"]::after{width:4%}[data-star^="0.3"]::after{width:6%}[data-star^="0.4"]::after{width:8%}[data-star^="0.5"]::after{width:10%}[data-star^="0.6"]::after{width:12%}[data-star^="0.7"]::after{width:14%}[data-star^="0.8"]::after{width:16%}[data-star^="0.9"]::after{width:18%}[data-star^="1"]::after{width:20%}[data-star^="1.1"]::after{width:22%}[data-star^="1.2"]::after{width:24%}[data-star^="1.3"]::after{width:26%}[data-star^="1.4"]::after{width:28%}[data-star^="1.5"]::after{width:30%}[data-star^="1.6"]::after{width:32%}[data-star^="1.7"]::after{width:34%}[data-star^="1.8"]::after{width:36%}[data-star^="1.9"]::after{width:38%}[data-star^="2"]::after{width:40%}[data-star^="2.1"]::after{width:42%}[data-star^="2.2"]::after{width:44%}[data-star^="2.3"]::after{width:46%}[data-star^="2.4"]::after{width:48%}[data-star^="2.5"]::after{width:50%}[data-star^="2.6"]::after{width:52%}[data-star^="2.7"]::after{width:54%}[data-star^="2.8"]::after{width:56%}[data-star^="2.9"]::after{width:58%}[data-star^="3"]::after{width:59%}[data-star^="3.1"]::after{width:61%}[data-star^="3.2"]::after{width:63%}[data-star^="3.3"]::after{width:65%}[data-star^="3.4"]::after{width:66%}[data-star^="3.5"]::after{width:67%}[data-star^="3.6"]::after{width:68%}[data-star^="3.7"]::after{width:69%}[data-star^="3.8"]::after{width:70%}[data-star^="3.9"]::after{width:71%}[data-star^="4"]::after{width:77%}[data-star^="4.1"]::after{width:82%}[data-star^="4.2"]::after{width:83%}[data-star^="4.3"]::after{width:84%}[data-star^="4.4"]::after{width:85%}[data-star^="4.5"]::after{width:87%}[data-star^="4.6"]::after{width:88%}[data-star^="4.7"]::after{width:89%}[data-star^="4.8"]::after{width:90%}[data-star^="4.9"]::after{width:97%}[data-star^="5"]::after{width:100%}`;
    
    styleElement.textContent = cssRules;

    const headElement = doc.head || doc.getElementsByTagName('head')[0];

    if (ratingElement && headElement) {
      // Append the style element to the head
      headElement.appendChild(styleElement);

      // Serialize the content of the head element separately
      const headContent = new XMLSerializer().serializeToString(headElement);

      // Replace the head content in the original HTML
      htmlString = htmlString.replace(/<head>[\s\S]*?<\/head>/i, `<head>${headContent}</head>`);
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
    if (!htmlString || htmlString === 'null' || htmlString === 'undefined') {
      return;
    }
    let updatedHtmlString = htmlString;
    
    const customFieldValue = this.findImageCustomFieldValues(JSON.parse(jsonData));
    GlobalConstants.globalImageData = customFieldValue;

    // Add ng-if="true" attribute to each found <img> tag
    if(customFieldValue.length > 0) {
      customFieldValue.forEach((item) => {
        const regex = new RegExp(`(<div[^>]*>)([^<]*<a[^>]*>)?([^<]*<img[^>]*title="${item.id}"[^>]*>)([^<]*</a>)?([^<]*</div>)`, 'g');
        updatedHtmlString = updatedHtmlString.replace(regex, (match, p1, p2, p3, p4, p5) => {
          let divMatch = p1;
          const aMatch = p2 || '';
          let imgMatch = p3;
          const closingAMatch = p4 || '';
          const closingDivMatch = p5;

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
          }
          // Replace the img part in the match with the updated style if needed
          if (style) {
            imgMatch = imgMatch.replace(/>/, ` ${style}>`);
            divMatch = divMatch.replace(/style="([^"]*)"/, 'style="$1; width:100%;padding-top:100%;position:relative;display:flex;"');
          }

          // Return the updated match with the updated div, a (if exists), and img parts
          return `${divMatch}${aMatch}${imgMatch}${closingAMatch}${closingDivMatch}`;
        });
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

  createSaveJsonForEmailChannel(jsonFile, htmlFile) {
    // returns saved Email object
    // if(this.subjctObj.subject == "" || this.subjctObj.subject === undefined){
    //   this.loader.HideLoader();
    //   Swal.fire("Subject cannot be empty.");
    //   return;
    // }

    htmlFile = this.addRatingStylingInHtmlString(htmlFile);
    htmlFile = this.addImageCondInFinalHtml(htmlFile, jsonFile);
    if(this.fullPreviewMode) {
      htmlFile = encodeURIComponent(htmlFile)
    }
    if (!this.isTemplateEditMode) {
      if (this.payloadWithoutFailsafe !== undefined) {
        this.subjctObj = this.payloadWithoutFailsafe.channels[0].subjectObj;
      }
    }

    const payload = {
      channels: [
        {
          title: '',
          channelId: this.commChannelKey,
          json: jsonFile,
          html: htmlFile,
          uuid: this.templateKey,
          promoSplitKey: this.currentSplitId,
          thumbnailImage: this.getThumbnailObj,
          subjectObj: this.subjctObj,
          PromotionKey: this.promoKey,
          promoCommunicationKey: this.promoCommunicationKey,
          failSafe: this.isFailSafeEnabled,
          templateKey: this.templateId,
          selectedOffers: this.offerTempObj,
          failsafeSelectedOffers: this.offerFailsafeTempObj,
          selectedRecoWidgets: this.recoTempObj,
        },
      ],
    };
    if (!this.isTestEmail) {
      //GlobalConstants.finalizeChannelsObj.push(payload.channels[0]); // every new channel push
      GlobalConstants.isPreviewMode = false;
      GlobalConstants.promoKey = this.promotionObj.promoKey;
      GlobalConstants.promoCommKey = this.promotionObj.promoCommKey;
      GlobalConstants.isSavedEmails = true;
    } else if (this.isTestEmail) {
      this.shareService.testEmailObj.next(payload);
    }
    GlobalConstants.payLoadSavedObjAllChannels = payload; // set channel obj
    this.payloadWithoutFailsafe = payload;
    return payload;
  }
  showModalComponent(_res, _rej, _args: any, componentName: any) {
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
        GlobalConstants.isRowEditModeEnable = false;
        //on hide modal
        _rej();
        console.log(e);
      });
    }
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

  async saveTemplateinS3(endpoint, payload) {
    const result = await this.http.post(endpoint, payload).toPromise();
    if (result.status == 'SUCCESS') {
      Swal.fire({
        title: result.message,
        icon: 'success',
        showConfirmButton: true,
        confirmButtonText: this.translate.instant('designEditor.okBtn'),
      }).then(() => {
        //this.removeLoader();
      });
      if (this.isTemplateLibraryMode) {
        this.reloadSavedTemplatesInS3(); // re-direct to email template page.
      } else {
        this.removeLoader();
      }
    } else {
      Swal.fire({
        title: result.message,
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: this.translate.instant('designEditor.okBtn'),
      }).then(() => {
        this.removeLoader();
      });
    }
  }
  async finalSaveMethod(endpoint, payload) {
    //this.loader.ShowLoader();
    if (Object.keys(payload.channels).length > 0) {
      if (payload.channels[0].subjectObj.subject === undefined || payload.channels[0].subjectObj.subject === '') {
        Swal.fire({
          title: this.translate.instant('designEditor.beeEditorComponent.validationMsg.emailSubjectShouldNotBeEmptyMsglbl'),
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
    if (this.isFailSafeEnabled) {
      if (
        payload.channels[0].failSafeInfo.failsafeSubObj.subject === '' ||
        payload.channels[0].failSafeInfo.failsafeSubObj.subject === undefined
      ) {
        Swal.fire({
          title: this.translate.instant(
            'designEditor.beeEditorComponent.validationMsg.emailFailsafeSubjectShouldNotBeEmptyAlertMsg'
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
    if (this.isFailSafeEnabled) {
      payload.channels[0].failSafeInfo.failsafeSubObj.subject = encodeURIComponent(
        payload.channels[0].failSafeInfo.failsafeSubObj.subject
      );
      let preHeaderValueFailSafe = this.dataService.checkNullUndefinedEmpty(payload.channels[0].failSafeInfo.failsafeSubObj.preHeader);
      payload.channels[0].failSafeInfo.failsafeSubObj.preHeader = encodeURIComponent(preHeaderValueFailSafe);

      // Failsafe Selected offers from htmlFile
      let htmlDocTemp = this.domParser.parseFromString(payload.channels[0].failSafeInfo.html, 'text/html');
      htmlDocTemp.querySelectorAll('.t1_p_offers').forEach((item) => {
        //this.offerFailsafeTempObj.push((<HTMLInputElement>item).value);
        let offerObj = JSON.parse((<HTMLInputElement>item).value);
        let newObj = {
          offerKey: offerObj.dbKey,
          couponFlg: offerObj.couponPermitted,
        };
        this.offerFailsafeTempObj.push(newObj);
      });

      if (this.offerFailsafeTempObj.length == 0) {
        this.offerFailsafeTempObj = [];
      }

      payload.channels[0].failsafeSelectedOffers = this.offerFailsafeTempObj;
      // Failsafe Selected offers from htmlFile end here
    }
    if (this.isFailSafeEnabled || !this.isFailSafeEnabled) {
      payload.channels[0].subjectObj.subject = encodeURIComponent(payload.channels[0].subjectObj.subject);
      let preHeaderValue = this.dataService.checkNullUndefinedEmpty(payload.channels[0].subjectObj.preHeader);
      payload.channels[0].subjectObj.preHeader = encodeURIComponent(preHeaderValue);

      // Selected offers from htmlFile
      let htmlDocTemp = this.domParser.parseFromString(payload.channels[0].html, 'text/html');
      htmlDocTemp.querySelectorAll('.t1_p_offers').forEach((item) => {
        //this.offerTempObj.push((<HTMLInputElement>item).value);
        let offerObj = JSON.parse((<HTMLInputElement>item).value);
        let newObj = {
          offerKey: offerObj.dbKey,
          couponFlg: offerObj.couponPermitted,
        };
        this.offerTempObj.push(newObj);
      });

      if (this.offerTempObj.length == 0) {
        this.offerTempObj = [];
      }

      payload.channels[0].selectedOffers = this.offerTempObj;
      // Selected offers from htmlFile end here

      // Selected reco from htmlFile
      htmlDocTemp.querySelectorAll('.t1_p_recommendation').forEach((item) => {
        let recoObj = JSON.parse((<HTMLInputElement>item).value);
        this.recoTempObj.push(recoObj);
      });

      if (this.recoTempObj.length == 0) {
        this.recoTempObj = [];
      }

      payload.channels[0].selectedRecoWidgets = this.recoTempObj;
      payload.channels[0].html = encodeURIComponent(payload.channels[0].html);
      // Selected reco from htmlFile end here
    }

    const result = await this.http.post(endpoint, payload).toPromise();
    if (result.status == 'SUCCESS') {
      // call Angular inside any external js
      GlobalConstants.isPreviewMode = true;
      GlobalConstants.isEditMode = true;
      this.shareService.failSafeTabActive.next(false);
      Swal.fire({
        title: result.message,
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: this.translate.instant('designEditor.okBtn'),
      });
      this.ngZoneCallMethod();
    } else {
      this.removeLoader();
      Swal.fire({
        title: result.message,
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: this.translate.instant('designEditor.okBtn'),
      });
    }
  }
  removeLoader() {
    this.ngZone.run(() => {
      this.loader.loadCount = 0;
      this.loader.HideLoader();
    });
  }
  reloadSavedTemplatesInS3() {
    this.ngZone.run(() => {
      this.router.navigate(['/email-templates']);
    });
  }
  ngZoneCallMethod() {
    //------- manually navigate to respective component ---------------
    this.ngZone.run(() => {
      this.shareService.activeSplitId.next(this.currentSplitId);
      this.router.navigate(['/email-templates']);
    });
  }
  callBeeToGetHtml(){
    this.loader.ShowLoader();
    this.beeTest.send();    
  }
  saveEmail() {
    this.isTestEmail = false;
    this.shareService.isTemperarySave.next(false);
    GlobalConstants.actionsPreviewEnable = false;
    this.beeTest.save();
  }
  onTabSwitchCall() {
    this.loader.ShowLoader();
    this.isTestEmail = false;
    this.shareService.isTemperarySave.next(true);
    this.beeTest.save();
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
  previewDeskTop() {
    //this.beeTest
  }
  previewMobile() {
    //this.beeTest
  }
  preBuidFlag(isPreBuildTemp) {
    //this.templateType = isPreBuildTemp;
  }

  // open test email modal
  openTestEmailModal(modalTemplate: TemplateRef<any>) {
    this.testEmailTemplate = modalTemplate;
    // validations for Test Email
    this.isTestEmail = true;
    this.shareService.subjectObj.subscribe((obj) => {
      this.subjctObj = obj;
      // if(this.isTestEmail){
      //   this.subjctObj.subject = encodeURIComponent(this.subjctObj.subject);
      //   this.subjctObj.preHeader = encodeURIComponent(this.subjctObj.preHeader);
      // }
    });
    if (this.isFailSafeTabActive) {
      this.shareService.subjectNpreheaderInputValueFailsafe.subscribe((res: any) => {
        if (Object.keys(res).length > 0) {
          this.failsafeSubjectObj.subject = res.subject;
          this.failsafeSubjectObj.preHeader = res.preHeader;
        }
      });
    } else {
      this.shareService.subjectNpreheaderInputValue.subscribe((res: any) => {
        if (Object.keys(res).length > 0) {
          this.subjctObj.subject = res.subject;
          this.subjctObj.preHeader = res.preHeader;
        }
      });
    }
    if (this.isFailSafeTabActive) {
      // if(this.failsafeSubjctObj.senderConfigKey === undefined || this.subjctObj.senderConfigKey == '') {
      //   Swal.fire(this.translate.instant('designEditor.beeEditorComponent.validationMsg.senderNameCannotBeEmptylbl'));
      //   return;
      // } else
      if (this.failsafeSubjectObj.subject === undefined || this.failsafeSubjectObj.subject == '') {
        Swal.fire({
          title: this.translate.instant(
            'designEditor.beeEditorComponent.validationMsg.emailFailsafeSubjectShouldNotBeEmptyAlertMsg'
          ),
          allowEscapeKey: false,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: this.translate.instant('designEditor.okBtn'),
        });
        return;
      }
    } else {
      if (this.subjctObj.senderConfigKey === undefined || this.subjctObj.senderConfigKey == '') {
        Swal.fire({
          title: this.translate.instant('designEditor.beeEditorComponent.validationMsg.senderNameCannotBeEmptylbl'),
          allowEscapeKey: false,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: this.translate.instant('designEditor.okBtn'),
        });
        return;
      } else if (this.subjctObj.subject === undefined || this.subjctObj.subject == '') {
        Swal.fire({
          title: this.translate.instant('designEditor.beeEditorComponent.validationMsg.emailSubjectShouldNotBeEmptyMsglbl'),
          allowEscapeKey: false,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: this.translate.instant('designEditor.okBtn'),
        });
        return;
      }
    }
    this.beeTest.save();
    this.loader.ShowLoader();
  }
  showTestPopupAfterBeeCall(modalTemplate) {
    this.modalRef = this.modalService.show(modalTemplate, {
      class: 'modal-dialog-centered testEmailModal',
      backdrop: 'static',
      keyboard: false,
    });
    this.removeLoader();
  }
  // open email attachment modal
  openAttachmentModal(modalTemplate: TemplateRef<any>) {
    this.modalRef = this.modalService.show(modalTemplate, {
      class: 'modal-dialog-centered attachmentModal',
      backdrop: 'static',
      keyboard: false,
    });
  }
  /* dataSetApiCallForContextFlag() {
    let url = AppConstants.API_END_POINTS.GET_All_PLACEMENTS_PAGE_TYPE + this.promoKey;
    this.http.post(url).subscribe((data) => {
      if (data.status === 'SUCCESS') {
        this.contextFlagToShowPersonalization = data.response.contextFlg;      
      }
    });
  } */

  openFullPreviewMethod(){    
    //this.isMergeTagDmeEnabled = false;
    this.isSpamTestEnable = false;
    this.isPreviewOnClientEnable = false;
    GlobalConstants.isOpenGlobalTags = false;
    GlobalConstants.isOpenTextImageAddon = false;
    this.isSpamTestEnableFailsafe = false;
    this.isFullPreviewEnabled = true;  
    this.callBeeToGetHtml();     
  }
  getBeeHtmlContent(htmlFile,jsonFile){
    this.fullPreviewMode = true;
    this.fullPreviewPayload = this.createSaveJsonForEmailChannel(jsonFile,htmlFile);
    let url = AppConstants.API_END_POINTS.GET_TEMPLATE_FULL_PREVIEW;
    this.http.post(url,this.fullPreviewPayload).subscribe((data) => {
      if (data.status === 'SUCCESS') {
        this.removeLoader();
        // this.loader.HideLoader();
        //this.ngZone.run(() => {
          this.shareService.fullPreviewSavedObjFromBee.next(data.response);
        //});        
        this.modalRef = this.modalService.show(FullPreviewAddonsComponent, {
          class: 'modal-dialog-centered fullPreviewContent',
          backdrop: 'static',
          keyboard: false
        });
        
        console.log(data.response);
      }else{
        this.removeLoader();
      }
    });
     
      this.removeLoader();
    console.log(this.fullPreviewPayload);
  };
  openGlobalMergeTag() {
    this.isMergeTagDmeEnabled = false;
    this.loader.ShowLoader();
    GlobalConstants.isOpenGlobalTags = true;
    GlobalConstants.isOpenTextImageAddon = false;
    this.beeTest.send();
    this.removeLoader();
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
        "queryparams":"queryParams",
        "freeStyle": "freeStyle"

      };
  
      const updatedHTML = dynamicContent.outerHTML.replace(
        /placementid|maxcount|recoattributes|rowstyle|layoutstyle|modelname|modeldisplayname|rowname|parametervalues|apiname|freeStyle|queryparams/g,
        attribute => attributeMappings[attribute]
      );
      this.shareService.selectedRowOuterHTML.next(updatedHTML);
      this.shareService.enablePreviewAfterCall.next(true);
    }
  }

  findMergeTagByHTMLAttributes(modalTemplate: TemplateRef<any>, beeEditorHtml) {
    GlobalConstants.selectedDmeModels = [];
    GlobalConstants.productMergeTags = [];
    let dmeTagService = false;
    let productRecoTagService = false;
    let productContextTagService = false;

    let htmlDocTemp = this.domParser.parseFromString(beeEditorHtml, 'text/html');

    const dmeSavedAttributes = [...new Set(Array.from(htmlDocTemp.querySelectorAll('[type="DME"]')).map(item2 => item2.getAttribute('modelName')))];
    const productRecoSavedAttributes = [...new Set(Array.from(htmlDocTemp.querySelectorAll('[type="productReco"]')).map(item2 => item2.getAttribute('placementId')))];
    const productContextSavedAttributes = [...new Set(Array.from(htmlDocTemp.querySelectorAll('[type="contextProduct"]')))];

    dmeTagService = dmeSavedAttributes.length !== 0;
    productRecoTagService = productRecoSavedAttributes.length !== 0;
    productContextTagService = productContextSavedAttributes.length !== 0;

    if (dmeTagService || productRecoTagService || productContextTagService) {
      let requests: any;
      let dme_requests: any = [];
      let productReco_requests: any = [];
      let product_requests: any = [];

      if(dmeTagService) {
        let url = AppConstants.API_END_POINTS.GET_DME_MODEL_ATTRIBUTES;
        dme_requests = dmeSavedAttributes.map((modelName) => this.http.post(url + '?modelName=' + modelName));
      }

      if(productRecoTagService || productContextTagService) {
        let url: any;
        url = AppConstants.API_END_POINTS.GET_All_PLACEMENTS_PAGE_TYPE+this.promoKey;
        productReco_requests = productRecoSavedAttributes.map((t) => this.http.post(url));
        product_requests = productContextSavedAttributes.map((t) => this.http.post(url));
      }

      requests = [...dme_requests, ...productReco_requests, ...product_requests];
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

  openGlobalMTagPopup() {
    this.loader.HideLoader();
    this.isMergeTagBttnDisabled = false;
    this.modalRef = this.modalService.show(GlobalMergeTagsComponent, {
      class: 'globalMergeTagStyle modal-dialog-centered',
      backdrop: true,
      keyboard: false
    });
  }

  openClipboard() {
    this.copyClipboard.toggleClipboardPopup();
  }
}
