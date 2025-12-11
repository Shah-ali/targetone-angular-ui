import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  NgZone,
  ChangeDetectorRef,
} from "@angular/core";
import { HttpService } from "@app/core/services/http.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { DataService } from "@app/core/services/data.service";
import { GlobalConstants } from "../common/globalConstants";
import { SharedataService } from "@app/core/services/sharedata.service";
import { AppConstants } from "@app/app.constants";
import Swal from "sweetalert2";
import { Key } from "selenium-webdriver";
import { Clipboard } from "@angular/cdk/clipboard";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-offers-drawer",
  templateUrl: "./offers-drawer.component.html",
  styleUrls: ["./offers-drawer.component.scss"],
})
export class OffersDrawerComponent implements OnInit {
  promotionKey: any;
  currentSplitId: any;
  commChannelKey: any;
  offersDataJson: any;
  offerAttributesList: any;
  @Input("dataFromParent") modalRef?: BsModalRef;
  @ViewChild("checkedMainOffers") checkedMainOffers!: ElementRef;
  @ViewChild("attributesOffers") attributesOffers!: ElementRef;
  @ViewChild("attrbutesCoupons") attrbutesCoupons!: ElementRef;
  @ViewChild("checkedPropertyVal") currentPropertyVal!: ElementRef;
  @ViewChild("recoSectionElemts") recoSectionElemts!: ElementRef;
  @Output() onCloseOfferPopup = new EventEmitter<any>();
  @Output() offersAppendToInput = new EventEmitter<any>();
  @Input() mergeTagEnabled = false;
  @Output() showloader = new EventEmitter<any>();
  searchByoffers: any = "";
  filterOfferAttributesList: any;
  getParentIdNAttrs: any = {};
  noOfferFound: boolean = false;
  ObjectValues = Object.values;
  // @HostListener('document:click', ['$event'])
  // onClickEvent(event: MouseEvent) {
  //   var targetEle = event.target;
  //   var currentTarget = event.currentTarget;

  // }
  recoRuleAttributesList: any = [];
  recoRuleCouponAttributesList: any = [];
  recoAttributeSection: boolean = false;
  isAttributeListId: any;
  isAttributeListEnable: boolean = false;
  selectedAttributesArray: any = [];
  collectAllOffers: any = [];
  getcheckedAttrObj: any = {};
  attrSelectedCount: any = 0;
  waitTillOffersLoad: boolean = true; // if true means loadign div will be appear
  actualValueOffers: any = [];
  offerSelect: boolean = false;
  sendOfferSelected: any = [];
  publishOffers: any = [];
  noofOfferSelectArry: any = [];
  sliderBlockContent: boolean = false;
  selectedIndex: any;
  couponAttributesList: any;
  couponEnable: boolean = false;
  couponRecoEnable: any = 0;
  isOffersDraged: boolean = false;
  isAttributeChecked: boolean = false;
  isOfferSectionEnabled: boolean = false;
  getVarArgsObj: any;
  getPropertiesList: any;
  selectedPropertyType: any = "";
  isPropertyValueSelected: boolean = false;
  propertiesArrayByName: any = [];
  collectPropertArryByValue: any = [];
  submitFinalPropertiesArray: any = {};
  propertyIndex: any;
  tabActive: any = 0;
  offerAttr: any;
  editModeOffers: any;
  successContinue: boolean = false;
  offerAttributeCount: boolean = false;
  offerAttributeCountReco: boolean = false;
  channelType: any;
  isOfferRecoEnabled: boolean = false;
  isMergeTagEnable: boolean = false;
  isRecoOffersEnable: boolean = false;
  isOffersEnable: boolean = false;
  isTabMergeTagEnable: boolean = AppConstants.OFFERS_ENABLE.MERGE_TAG;
  isTabRecoOffersEnable: boolean = AppConstants.OFFERS_ENABLE.RECOMMENDATION_OFFERS;
  isTabOffersEnable: boolean = AppConstants.OFFERS_ENABLE.STATIC_OFFERS;
  recommendationObj: any = [];
  noofRecoOffers: any;
  getSelectedRecoOffers: any = {};
  selectedRecodbKey: any;
  collectRecoType: any = [];
  showRecoOffers: any = [];
  isDataNofound: boolean = false;
  publishRecommendationOffers: any = [];
  selectedoffersParentObj: any = [];
  editModeOffersReco: any;
  tempPublishArry: any = [];
  recoOffersObj: any = [];
  collectStaticOffersArry: any = {};
  tabActiveDMChannel: any;
  ruleTemplateKey: any;
  widgetCount: any = 0;
  widgetCountArry: any = {};
  dmTypeVal: any;
  isAttributeListEnableReco: boolean = false;
  isAttributeListIdReco: any;
  filterRecoAttributesList: any;
  selectedRecoIndex: any;
  isAttributeCheckedReco: boolean = false;
  selectedAttributesArrayReco: any = [];
  collectAllOffersReco: any = [];
  getcheckedAttrObjReco: any = {};
  noofRecoPreFilled: any = [1, 2, 3, 4, 5, 6, 7, 8];
  recoTabs: any = [];
  recoTabIndex: any;
  showHideAttrinutes: any;
  recoCount: number = 0;
  isRecoDropdownEnabled: any = {};
  editModeOffersRecoFreetext: any;
  attrOfferarryEdit: any = [];
  showhideLabel: string = "Show";
  searchInputreco: any = "";
  editModeOffersDmColumnar: any;
  isViewEditEnabled: boolean = true;
  isShowAttributeLinkEnabled: boolean = true;
  filteredSelectedOffsObj: any = [];
  mergeTagInjectionObj: any = null;
  showLoader: boolean = false;

  constructor(
    private http: HttpService,
    private bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private shareService: SharedataService,
    private dataService: DataService,
    private translate: TranslateService,
    private ngZone: NgZone,
    private clipboard: Clipboard,
    private cd: ChangeDetectorRef
  ) {
    this.dataService.$sharedPromoKey.subscribe((result) => {
      this.promotionKey = this.promotionKey = result;
    });
    this.shareService.showMergedTagCopyIcon.subscribe((res: any) => {
      if (res !== undefined) {
        this.mergeTagEnabled = res; // true or false.
      }
    });
    this.shareService.currentSelectedChannelObj.subscribe((res: any) => {
      this.channelType = res.channelType;
      this.currentSplitId = res.currentSplitId;
      this.commChannelKey = res.commChannelKey;
      this.dmTypeVal = res.currentObj.dmType;
    });
    if (AppConstants.CHANNEL_INFO.CHANNEL_TYPE.INAPP_NOTIFICATION === this.channelType) {
      this.shareService.inappEditModeOffersSelected.subscribe((res: any) => {
        this.editModeOffers = undefined;
        if (res.length > 0) {
          this.editModeOffers = res;
        }
      });
      if (AppConstants.OFFERS_ENABLE.MERGE_TAG) {
        this.isMergeTagEnable = true;
      }
    } else if (AppConstants.CHANNEL_INFO.CHANNEL_TYPE.PUSH_NOTIFICATION === this.channelType) {
      this.shareService.editModeOffersSelected.subscribe((res: any) => {
        this.editModeOffers = undefined;
        if (res.length > 0) {
          this.editModeOffers = res;
        }
      });
      if (AppConstants.OFFERS_ENABLE.MERGE_TAG) {
        this.isMergeTagEnable = true;
      }
    } else if (AppConstants.CHANNEL_INFO.CHANNEL_TYPE.WEB_PUSH === this.channelType) {
      this.shareService.webpushEditModeOffersSelected.subscribe((res: any) => {
        this.editModeOffers = undefined;
        if (res.length > 0) {
          this.editModeOffers = res;
        }
      });
      if (AppConstants.OFFERS_ENABLE.MERGE_TAG) {
        this.isMergeTagEnable = true;
      }
    } else if (AppConstants.CHANNEL_INFO.CHANNEL_TYPE.SMS_CHANNEL === this.channelType) {
      // SMS channel
      this.recoAttributeSection = true;
      this.shareService.smsEditModeOffersSelected.subscribe((res: any) => {
        this.editModeOffers = undefined;
        this.editModeOffersRecoFreetext = undefined;

        if (res.length > 0) {
          this.editModeOffers = res; // offers and Merge tags
          this.editModeOffersRecoFreetext = res; // recommendation
        }
      });
      if (AppConstants.OFFERS_ENABLE.MERGE_TAG) {
        this.isMergeTagEnable = true;
      }
    } else if (AppConstants.CHANNEL_INFO.CHANNEL_TYPE.DM_CHANNEL === this.channelType && this.dmTypeVal == "3") {
      // DM MultiOffer
      this.recoAttributeSection = false;
      this.isShowAttributeLinkEnabled = false;
      this.isViewEditEnabled = false;

      this.shareService.dmEditModeOffersSelected.subscribe((res: any) => {
        this.editModeOffersReco = undefined;
        if (Object.values(res).length > 0) {
          this.editModeOffersReco = res;
        }
      });
      if (AppConstants.OFFERS_ENABLE.STATIC_OFFERS) {
        this.isTabOffersEnable = false;
        this.tabActive = 1;
        this.switchOffersTab(this.tabActive);
      } else if (AppConstants.OFFERS_ENABLE.RECOMMENDATION_OFFERS) {
        this.isTabRecoOffersEnable = false;
        this.tabActive = 2;
        this.switchOffersTab(this.tabActive);
      }
    } else if (AppConstants.CHANNEL_INFO.CHANNEL_TYPE.DM_CHANNEL === this.channelType && this.dmTypeVal === "1") {
      // DM FreeText
      //this.recoAttributeSection = true;
      this.isShowAttributeLinkEnabled = true;
      this.isViewEditEnabled = true;
      this.shareService.dmFreeTextEditModeOffersSelected.subscribe((res: any) => {
        this.editModeOffersRecoFreetext = undefined;
        this.editModeOffers = undefined;

        if (res.length > 0) {
          this.editModeOffers = res; // offers and Merge tags
        }
        if (res.length > 0) {
          this.editModeOffersRecoFreetext = res;
        }
      });
      this.tabActive = 0;
      this.switchOffersTab(this.tabActive);
    } else if (AppConstants.CHANNEL_INFO.CHANNEL_TYPE.DM_CHANNEL === this.channelType && this.dmTypeVal === "2") {
      // DM Columnar
      //this.recoAttributeSection = true;
      this.isShowAttributeLinkEnabled = true;
      this.isViewEditEnabled = true;
      this.shareService.dmColumnarEditModeOffersSelected.subscribe((res: any) => {
        this.editModeOffersRecoFreetext = undefined;
        if (res.length > 0) {
          this.editModeOffers = res; // offers and Merge tags
          //this.editModeOffersReco = res; // recommendation
          this.editModeOffersRecoFreetext = res;
        }
      });
      this.tabActive = 0;
      this.switchOffersTab(this.tabActive);
    } else if (AppConstants.CHANNEL_INFO.CHANNEL_TYPE.WHATS_APP_CHANNEL === this.channelType) {
      // WhatsApp channel
      //setTimeout(() => {
      this.isTabMergeTagEnable = false; // hide single tab
      //}, 500);
    }
    if (this.mergeTagEnabled) {
      this.getoffersDataObj("");
    }
    this.getmergeTagsdataObj();
    this.getMergeTagInjection();
  }

  ngOnInit(): void {}

  getMergeTagInjection(): void {
    this.showLoader = true;
    let url = AppConstants.MERGE_TAG_INJECTION.GET_MERGE_TAGS + this.promotionKey + "&splitId=" + this.currentSplitId;
    this.http.post(url).subscribe((data) => {
      this.mergeTagInjectionObj = data.response;
      this.showLoader = false;
      this.cd.detectChanges();
    });
  }

  onClose(): void {
    this.onCloseOfferPopup.emit(true);
  }
  switchOffersTab(tabactiveId) {
    this.tabActive = tabactiveId;
    if (tabactiveId === 0) {
      // merge Tags
      this.isOfferSectionEnabled = false;
      this.isOfferRecoEnabled = false;
      this.isMergeTagEnable = true;
      this.getEditModeMergeTagOffers();
    } else if (tabactiveId === 1) {
      // Offers selection
      this.isOfferSectionEnabled = true;
      this.isOfferRecoEnabled = false;
      this.isMergeTagEnable = false;
      this.sliderBlockContent = false;
      this.isAttributeListEnable = false;
      setTimeout(() => {
        this.getEditModeOffers();
      }, 1000);
    } else if (tabactiveId === 2) {
      // Recommendations
      this.isOfferSectionEnabled = false;
      this.isOfferRecoEnabled = true;
      this.isMergeTagEnable = false;
      this.recommendationOfferDataMethod();
    }
  }
  closeAttrPanel(dbkey) {
    if (this.getcheckedAttrObj[dbkey] !== undefined) {
      if (this.getcheckedAttrObj[dbkey].length > 0 && !this.offerAttributeCount) {
        this.selectedAttributesArray = [];
        this.collectAllOffers = [];
        this.isAttributeListEnable = false;
        this.sliderBlockContent = false;
      } else {
        this.isAttributeListEnable = false;
        this.sliderBlockContent = false;
      }
    } else {
      this.isAttributeListEnable = false;
      this.sliderBlockContent = false;
    }
  }
  closeRecoAttrPanel(key) {
    if (this.getcheckedAttrObjReco[key] !== undefined) {
      if (this.getcheckedAttrObjReco[key].length > 0 && !this.offerAttributeCountReco) {
        this.selectedAttributesArrayReco = [];
        this.collectAllOffersReco = [];
        this.isAttributeListEnableReco = false;
        this.sliderBlockContent = false;
      } else {
        this.isAttributeListEnableReco = false;
        this.sliderBlockContent = false;
      }
    } else {
      this.isAttributeListEnableReco = false;
      this.sliderBlockContent = false;
    }
  }
  getPropertiesValuesChecked(isChecked, item, inx) {
    this.propertyIndex = inx;
    if (isChecked !== true) {
      isChecked = isChecked.target.checked;
    }
    if (isChecked) {
      this.isPropertyValueSelected = true;
      this.createArryForMergeTags(item);
      //this.publishOffers.push(this.submitFinalPropertiesArray);
      //console.log(this.submitFinalPropertiesArray);
    } else {
      this.isPropertyValueSelected = false;
      const index = this.submitFinalPropertiesArray[this.selectedPropertyType].findIndex((x) => x === item.value);
      this.submitFinalPropertiesArray[this.selectedPropertyType].splice(index, 1);
      delete this.collectPropertArryByValue[item.name];
      delete this.propertiesArrayByName[item.name];
    }
  }
  createArryForMergeTags(item) {
    this.propertiesArrayByName.push(item.name);
    const objSaved = { name: item.name, value: item.value };
    this.collectPropertArryByValue.push(objSaved);
    // const objJson = {}; objJson[this.selectedPropertyType] = this.collectPropertArryByValue;
    this.submitFinalPropertiesArray[this.selectedPropertyType] = this.collectPropertArryByValue;
  }
  getmergeTagsdataObj() {
    if (GlobalConstants.varArgs.length > 0) {
      this.getVarArgsObj = GlobalConstants.varArgs;
      this.getVarArgsObj = this.getVarArgsObj.filter((x) => x.id !== "staticOffer"); // Excluded StaticOffers.
      this.selectedPropertyType = this.getVarArgsObj[0].id;
      this.getPropertiesList = this.getVarArgsObj[0].userdata;
      this.propertiesArrayByName = [];
      this.collectPropertArryByValue = [];
      setTimeout(() => {
        this.getEditModeMergeTagOffers();
        this.ngZone.run(() => {
          this.showloader.emit(false);
        });
      }, 1000);
    }
  }
  getPropertiesOfMergeTag(evt) {
    //console.log(evt.target.value);
    this.selectedPropertyType = evt.target.value;
    const userDataArray = this.getVarArgsObj.find((x) => x.id == evt.target.value).userdata;
    this.getPropertiesList = userDataArray;
    this.propertiesArrayByName = [];
    this.collectPropertArryByValue = [];
    this.submitFinalPropertiesArray = {};
    setTimeout(() => {
      this.getEditModeMergeTagOffers();
    }, 1000);
  }
  searchByUserInput(evt) {
    this.getoffersDataObj(evt.target.value);
  }
  async getoffersDataObj(filterBy) {
    this.waitTillOffersLoad = true;
    const promoKey = {
      promotionKey: this.promotionKey, // mandatory
      maxRecordsDisplay: 50, // optional, default to 50
      startPos: 0,
      isCouponEnable: false,
      filterByKey: "offerCode",
      filterByValue: filterBy,
      splitKey: this.currentSplitId,
    };
    const resultObj = await this.http.post(AppConstants.API_END_POINTS.GET_OFFERS_DATA, promoKey).toPromise();
    if (resultObj.status == "SUCCESS") {
      this.waitTillOffersLoad = false;
      // this.showloader.emit(false);
      this.offersDataJson = resultObj.response.offers;
      if (this.offersDataJson === undefined) {
        this.noOfferFound = true;
      } else {
        this.noOfferFound = false;
      }
      //if(filterBy !== ""){
      setTimeout(() => {
        this.getEditModeOffers();
        this.getEditModeRecommendations();
      }, 1000);
      //}
      this.filterOfferAttributesList = resultObj.response.offerParameters;
    }
  }
  getEditModeMergeTagOffers() {
    if (this.editModeOffers !== undefined) {
      if (this.selectedPropertyType === "Customer") {
        var filterMergeTags = this.editModeOffers.filter((x) => x.id === "Customer");
      } else {
        var filterMergeTags = this.editModeOffers.filter((x) => x.id === "Promotion");
      }

      if (filterMergeTags.length > 0) {
        Object.values(filterMergeTags).map((item: any) => {
          if (item.id === "Customer" || item.id === "Promotion") {
            const eleChecked = this.currentPropertyVal;
            if (eleChecked !== undefined) {
              Object.values(this.currentPropertyVal.nativeElement.children).map((propertyObj: any, inx) => {
                let pName = propertyObj.getAttribute("name");
                if (pName == item.value) {
                  //propertyObj.getElementsByTagName("input")[0].click();
                  propertyObj.getElementsByTagName("input")[0].checked = true;
                  propertyObj.getElementsByTagName("div")[0].style.pointerEvents = "none";
                }
              });
            }
          }
        });
      }
    }
  }
  getEditModeAttributesSelected(dbKey) {
    if (this.editModeOffers !== undefined) {
      const filterOffers = this.editModeOffers.filter((x) => x.id == dbKey);

      if (Object.values(filterOffers).length > 0) {
        Object.values(filterOffers).map((item: any) => {
          if (item.value.includes("coupon")) {
            var eleCheckedOffers = this.attrbutesCoupons;
          } else {
            var eleCheckedOffers = this.attributesOffers;
          }
          if (eleCheckedOffers !== undefined) {
            const gridTemp = eleCheckedOffers.nativeElement.children;
            Object.values(gridTemp).map((propertyObj: any, inx) => {
              let SOfferId = propertyObj.getAttribute("name");
              if (SOfferId === item.value) {
                propertyObj.getElementsByTagName("input")[0].checked = true;
                propertyObj.style.pointerEvents = "none";
              }
            });
          }
        });
      }
    }
  }
  getEditModeOffers() {
    if (this.editModeOffers !== undefined) {
      const filterOffers = this.editModeOffers.filter((x) => x.id !== "Customer");
      const groupByDbkey = filterOffers.reduce((group, product) => {
        const { id } = product;
        group[id] = group[id] ?? [];
        group[id].push(product);
        return group;
      }, {});

      if (Object.keys(groupByDbkey).length > 0) {
        Object.keys(groupByDbkey).map((item: any) => {
          const eleChecked = this.checkedMainOffers;
          //const eleCheckedOffers = this.attributesOffers;
          //const eleCheckedCoupons = this.attrbutesCoupons;
          if (eleChecked !== undefined) {
            const gridTemp = this.checkedMainOffers.nativeElement.children[0];
            Object.values(gridTemp.children).map((propertyObj: any, inx) => {
              //let basEle = propertyObj.getAttribute("name","footer")[0];
              let togglebtn = propertyObj.getElementsByClassName("toggleButton")[0];
              if (togglebtn !== undefined) {
                let SOfferId = togglebtn.getAttribute("data-toggleBtn");
                if (SOfferId === item) {
                  togglebtn.getElementsByTagName("input")[0].checked = true;
                  togglebtn.style.pointerEvents = "none";
                  const attrCount: any = document.getElementById("attrCount_" + item) as HTMLDivElement;
                  attrCount.innerHTML = groupByDbkey[item].length;
                }
              }
            });
          }
        });
      }
    }
  }
  getEditModeFreeTextRecoOffers() {
    //let  attrOfferarryEdit:any = [];
    if (this.editModeOffersRecoFreetext !== undefined) {
      this.filteredSelectedOffsObj = [
        ...new Map(this.editModeOffersRecoFreetext.map((item) => [item["id"], item])).values(),
      ].filter((x: any) => x.value.includes("reco"));
      //this.filteredSelectedOffsObj.filter(x => x.value.includes('reco'));
      this.editModeOffersRecoFreetext.forEach((element, i) => {
        const recoEle = this.recoSectionElemts.nativeElement.children[1];
        const recoChild = recoEle.getElementsByClassName("recoCard")[0].children;
        Object.values(recoChild).map((recoChildEle: any, inx) => {
          let togglebtn = recoChildEle.getElementsByClassName("toggleButton")[0];
          let ctrId = recoChildEle.getElementsByClassName("toggleButton")[0].getAttribute("name");
          let inputNoofReco = recoChildEle.getElementsByClassName("noofReco_" + element.id)[0];
          let showAttrLable = recoChildEle.getElementsByClassName("show_" + element.id)[0];
          if (ctrId == element.id) {
            togglebtn.getElementsByTagName("input")[0].checked = true;
            togglebtn.style.pointerEvents = "none";
            inputNoofReco.value = element.offerSelected;
            //inputNoofReco.style.pointerEvents = "none";

            if (element.value !== undefined) {
              var recoTabid = element.value.split(".")[2];
            }
            this.attrOfferarryEdit.push(element.value);
            this.selectedRecodbKey = element.id;
            const obj = {
              dbKey: element.id,
              name: element.name,
              offerSelected: element.offerSelected,
              type: "RO",
              recotabid: recoTabid,
              attributes: [],
            };
            //this.collectRecoType.push(obj);
            this.getSelectedRecoOffers[this.selectedRecodbKey] = [obj];
            this.widgetCountArry[this.selectedRecodbKey] = this.widgetCount;
            this.isRecoDropdownEnabled[this.selectedRecodbKey] = true;
            this.widgetCount = element.widgetId;
            this.isAttributeListIdReco = element.id;
            this.showHideAttrinutes = 1;
            this.sliderBlockContent = false;
            this.isAttributeListEnableReco = false;

            this.isRecoDropdownEnabled[element.id] = true;
          }
        });
      });
      if (this.filteredSelectedOffsObj.length > 0) {
        this.filteredSelectedOffsObj.map((each: any, i) => {
          this.tempPublishArry.push({
            key: each.id,
            offerTemplateKey: 0,
            widgetId: i + 1,
            count: each.offerSelected,
            couponFlg: 0,
            ruleTemplateKe: "-1",
            type: "RO",
          });

          this.publishRecommendationOffers.push({
            promotionKey: this.promotionKey,
            splitKey: this.currentSplitId,
            commChannelKey: this.commChannelKey,
            item: this.tempPublishArry,
          });
          this.widgetCount = i + 1;
        });
      }

      if (this.attrOfferarryEdit.length > 0) {
        if (Object.keys(this.getSelectedRecoOffers).length > 0) {
          Object.keys(this.getSelectedRecoOffers).map((key: any) => {
            if (this.widgetCount === undefined) {
              this.widgetCount = 0;
            }
            this.widgetCountArry[key] = this.widgetCount + 1;
            this.widgetCount = this.widgetCountArry[key];
            let filterArrts = this.attrOfferarryEdit.filter((x) => x.includes("reco"));
            this.getSelectedRecoOffers[key][0].attributes = filterArrts;
            this.getcheckedAttrObjReco["reco_" + this.widgetCountArry[key] + "_" + key] = filterArrts;
          });
        }
      }
    }
  }
  getEditModeRecommendations() {
    if (this.editModeOffersReco !== undefined) {
      if (this.tabActive == 1) {
        if (this.editModeOffersReco["staticoffer"] !== undefined) {
          this.editModeOffersReco["staticoffer"].forEach((element) => {
            const gridTemp = this.checkedMainOffers.nativeElement.children[0];
            Object.values(gridTemp.children).map((propertyObj: any, inx) => {
              //let basEle = propertyObj.getAttribute("name","footer")[0];
              let togglebtn = propertyObj.getElementsByClassName("toggleButton")[0];
              let SOfferId = togglebtn.getAttribute("data-toggleBtn");
              if (parseInt(SOfferId) === element.dbKey) {
                togglebtn.getElementsByTagName("input")[0].checked = true;
                togglebtn.style.pointerEvents = "none";

                this.publishOffers.push({
                  offerKey: element.dbKey,
                  couponFlg: element.couponFlag,
                });
                let obj = { key: element.dbKey, type: "SO" };
                this.recoOffersObj.push(obj);
                this.collectStaticOffersArry["SO"] = this.recoOffersObj;
              }
            });
          });
        }
      }
      //------- Reco edit
      if (this.tabActive == 2) {
        if (this.editModeOffersReco["recooffer"] !== undefined) {
          this.editModeOffersReco["recooffer"].forEach((element) => {
            const recoEle = this.recoSectionElemts.nativeElement.children[1];
            const recoChild = recoEle.getElementsByClassName("recoCard")[0].children;
            Object.values(recoChild).map((recoChildEle: any, inx) => {
              let togglebtn = recoChildEle.getElementsByClassName("toggleButton")[0];
              let ctrId = recoChildEle.getElementsByClassName("toggleButton")[0].getAttribute("name");
              let inputNoofReco = recoChildEle.getElementsByClassName("noofReco_" + ctrId)[0];
              if (parseInt(ctrId) === element.dbKey) {
                togglebtn.getElementsByTagName("input")[0].checked = true;
                togglebtn.style.pointerEvents = "none";
                inputNoofReco.value = element.count;
                this.widgetCount = element.widgetId;

                this.tempPublishArry.push({
                  key: element.dbKey,
                  offerTemplateKey: 0,
                  widgetId: this.widgetCount,
                  count: element.count,
                  couponFlg: element.couponFlag,
                  ruleTemplateKey: element.templateKey,
                  type: "RO",
                });

                this.publishRecommendationOffers.push({
                  promotionKey: this.promotionKey,
                  splitKey: this.currentSplitId,
                  commChannelKey: this.commChannelKey,
                  item: this.tempPublishArry,
                });
              }
            });
          });
        }
      }
    }
  }

  checkedAttrs(sId, item, isChecked) {
    if (isChecked !== true) {
      isChecked = isChecked.target.checked;
    }
    if (isChecked) {
      this.isAttributeChecked = true;
      this.selectedAttributesArray.push(sId); //{"key":[sId],"value":item[sId]}
      this.collectAllOffers.push(item[sId]);
      this.getcheckedAttrObj[item.dbKey] = this.selectedAttributesArray; //this.selectedAttributesArray;
      // this.publishOffers.push(this.getcheckedAttrObj);
    } else {
      this.isAttributeChecked = false;
      const index = this.getcheckedAttrObj[item.dbKey].findIndex((x) => x[sId] === item[sId]);
      this.getcheckedAttrObj[item.dbKey].splice(index, 1);
      delete this.collectAllOffers[item[sId]];
    }
  }
  checkedRecoAttrs(sId, item, isChecked) {
    if (isChecked !== true) {
      isChecked = isChecked.target.checked;
    }
    if (isChecked) {
      this.isAttributeCheckedReco = true;
      let widgetId = this.widgetCountArry[item.key];
      const recoid = "Offer.reco" + widgetId + "." + this.recoTabIndex + "." + sId;
      this.selectedAttributesArrayReco.push(recoid); // Offer.reco{widgetId}.1.offerCode
      this.collectAllOffersReco.push(item.key);
      this.getcheckedAttrObjReco["reco_" + widgetId + "_" + item.key] = this.selectedAttributesArrayReco; //this.selectedAttributesArray;
      // this.publishOffers.push(this.getcheckedAttrObj);
    } else {
      this.isAttributeChecked = false;
      const index = this.getcheckedAttrObjReco["reco" + this.recoTabIndex].findIndex((x) => x[sId] === item[sId]);
      this.getcheckedAttrObjReco["reco" + this.recoTabIndex].splice(index, 1);
      delete this.collectAllOffersReco[item.key];
    }
  }
  getSelectedAttrObj(obj) {
    this.isAttributeListEnable = false;
    this.sliderBlockContent = false;
    const attrCount = document.getElementById("attrCount_" + obj.dbKey) as HTMLDivElement;
    attrCount.innerHTML = this.getcheckedAttrObj[obj.dbKey].length;
    if (this.getcheckedAttrObj[obj.dbKey].length > 0) {
      this.offerAttributeCount = true;
    } else {
      const attrCount = document.getElementById("attrCount_" + obj.dbKey) as HTMLDivElement;
      attrCount.innerHTML = "0";
    }
    //this.currentOfferSelect.nativeElement.checked = !this.currentOfferSelect.nativeElement.checked;
    //this.noofOfferSelectArry.push(obj.dbKey);
  }
  onSelectOfferMethod(evt, dbKey, indx) {
    if (evt.target.checked) {
      this.offerSelect = !this.offerSelect;
      this.selectedIndex = indx;
      this.noofOfferSelectArry.push(dbKey);
      if (AppConstants.CHANNEL_INFO.CHANNEL_TYPE.DM_CHANNEL === this.channelType && this.dmTypeVal === "3") {
        this.offerAttributeCount = true;
        this.getcheckedAttrObj[dbKey] = [];
      }
    } else {
      this.offerSelect = !this.offerSelect;
      const indx = this.noofOfferSelectArry.findIndex((x) => x == dbKey);
      this.noofOfferSelectArry.splice(indx, 1);
    }
  }
  searchAttrByInputVal(evt) {
    const strInp = evt.target.value;
    this.searchInputreco = strInp;
    if (strInp === "") {
      strInp == "offer";
    }

    const offerAttrsList = this.filterOfferAttributesList.filter((key, value) => key.includes(strInp));
    const filterOnlyOffers = offerAttrsList.filter((x) => x.indexOf("coupon") === -1);
    if (offerAttrsList !== undefined) {
      this.offerAttributesList = filterOnlyOffers;
    }
  }
  searchAttrByInputValReco(evt, objkey) {
    const strInp = evt.target.value;
    if (strInp === "") {
      strInp == "offer";
    }

    const offerAttrsList = this.filterOfferAttributesList.filter((key, value) => key.includes(strInp));
    const filterOnlyOffers = offerAttrsList.filter((x) => x.indexOf("coupon") === -1);

    if (offerAttrsList !== undefined) {
      this.recoRuleAttributesList = offerAttrsList;
    }
    setTimeout(() => {
      this.loadSavedAttributes(objkey, 1);
    }, 500);
    // if(couponAttrsList !== undefined){
    //   this.recoRuleCouponAttributesList = couponAttrsList;
    // }
  }
  getOffersAttributes(obj, index) {
    this.sliderBlockContent = true;
    this.selectedIndex = index;
    this.isAttributeListId = obj.dbKey;
    this.isAttributeListEnable = true;

    if (this.getcheckedAttrObj[obj.dbKey] !== undefined) {
      // this.getcheckedAttrObj[obj.dbKey].forEach(({key,value}) => {
      //   let ele = document.getElementById("check_"+key);
      // });
    } else {
      this.selectedAttributesArray = [];
      this.collectAllOffers = [];
      // const attrCount = document.getElementById('attrCount_'+selectedId) as HTMLDivElement;
      // attrCount.innerHTML = "0";
    }

    const offerAttrsList = this.filterOfferAttributesList.filter((key, value) => key.includes("offer"));
    const couponAttrsList = this.filterOfferAttributesList.filter((key, value) => key.includes("coupon"));
    //Object.keys(obj).filter((key,value) => key.includes("coupon"));
    //console.log(couponAttrsList);
    if (offerAttrsList !== undefined) {
      this.offerAttributesList = offerAttrsList;
    }
    if (couponAttrsList !== undefined) {
      this.couponAttributesList = couponAttrsList;
    }
    if (this.editModeOffers !== undefined) {
      setTimeout(() => {
        this.getEditModeAttributesSelected(obj.dbKey);
      }, 1000);
    }
  }
  getFinalMergeTags() {
    const concatArry: any = { ...this.submitFinalPropertiesArray, ...this.getParentIdNAttrs };
    this.offersAppendToInput.emit(concatArry);
    //this.shareService.finalOffersSelected.next(concatArry);
    //this.shareService.offersToSubmit.next(this.publishOffers);
    this.onClose();
  }

  copyToPasteOffers(tooltip, refEl: any, varArrayType, list) {
    let tempRecoSelected = {
      promotionKey: this.promotionKey,
      splitKey: this.currentSplitId,
      item: this.sendOfferSelected,
    };

    const checkAttrPresent = this.getcheckedAttrObj[refEl.dbKey];

    this.sendOfferSelected.push({
      key: refEl.dbKey,
      type: "SO",
      count: 0,
      offerTemplateKey: 0,
    });

    this.http.post(AppConstants.API_END_POINTS.GET_OFFERS_ACTUAL_VALUES, tempRecoSelected).subscribe((res) => {
      if (res.status == "SUCCESS") {
        let x1, x2;
        if (list.indexOf("coupon") !== -1) {
          x1 = res.response[refEl.dbKey][1].find((x) => x.name == list).value;
          //x2 = res.response[refEl.dbKey][1].find(x => x.name == list).name;
          //let zx = {"name":x2,"value":x1};
        } else {
          x1 = res.response[refEl.dbKey][0].find((x) => x.name == list).value; // like offerCode
          //x2 = res.response[refEl.dbKey][0].find(x => x.name == list).name;
          //let zx = {"name":x2,"value":x1};
          //console.log(zx);
        }

        let y = { value: x1 };
        this.copyToPaste(tooltip, y, false);
      }
    });
  }

  copyToPasteReco(tooltip, refEl: any, varArrayType, list) {
    let widgetId = this.widgetCountArry[refEl.key];
    const recoid = "Offer.reco" + widgetId + "." + this.recoTabIndex + "." + list;
    let y = { value: recoid };
    this.copyToPaste(tooltip, y, false);
  }

  getFinalOffers() {
    this.selectedoffersParentObj = [];
    if (this.noofOfferSelectArry.length > 0) {
      let tempRecoSelected = {
        promotionKey: this.promotionKey,
        splitKey: this.currentSplitId,
        //commChannelKey: this.commChannelKey,
        item: this.sendOfferSelected,
      };
      this.noofOfferSelectArry.forEach((dbkey) => {
        const checkAttrPresent = this.getcheckedAttrObj[dbkey];
        if (checkAttrPresent !== undefined) {
          this.sendOfferSelected.push({
            key: dbkey,
            type: "SO",
            count: 0,
            offerTemplateKey: 0,
          });
          this.successContinue = true;
        } else {
          const offrTitle = this.offersDataJson.find((x) => x.dbKey === dbkey).offerTitle;
          let errorMsg = Swal.fire({
            icon: "warning",
            text: this.translate.instant(
              "designEditor.offerDrawerComponent.validationMsg.pleaseSelectOneAttributeTocontinuelblMsg"
            ),
          });
          this.successContinue = false;
        }

        // ---- get offer details to show in recommendation table
        const selOffrs = this.offersDataJson.find((x) => x.dbKey === dbkey);
        this.selectedoffersParentObj.push(selOffrs);
      });
      if (this.successContinue) {
        this.offerAttr = { ...this.submitFinalPropertiesArray, ...this.getcheckedAttrObj };
        this.http.post(AppConstants.API_END_POINTS.GET_OFFERS_ACTUAL_VALUES, tempRecoSelected).subscribe((res) => {
          if (res.status == "SUCCESS") {
            if (Object.keys(this.getcheckedAttrObj).length > 0) {
              Object.entries(this.getcheckedAttrObj).forEach(([dbKey, value]: any) => {
                this.actualValueOffers = [];
                value.forEach((val, index) => {
                  if (val !== null || val !== "") {
                    if (val.indexOf("coupon") !== -1) {
                      if (res.response[dbKey] !== undefined) {
                        let x1 = res.response[dbKey][1].find((x) => x.name == val).value;
                        let x2 = res.response[dbKey][1].find((x) => x.name == val).name;
                        let zx = { name: x2, value: x1 };
                        this.actualValueOffers.push(zx);
                        this.getParentIdNAttrs[dbKey] = this.actualValueOffers;
                      }
                    } else {
                      if (res.response[dbKey] !== undefined) {
                        let x1 = res.response[dbKey][0].find((x) => x.name == val).value; // like offerCode
                        let x2 = res.response[dbKey][0].find((x) => x.name == val).name;
                        let zx = { name: x2, value: x1 };
                        this.actualValueOffers.push(zx);
                        this.getParentIdNAttrs[dbKey] = this.actualValueOffers;
                        this.couponEnable = false;
                      }
                    }
                  }
                });
              });
              this.noofOfferSelectArry.forEach((dbkey) => {
                const checkCoupon = this.getcheckedAttrObj[dbkey].find((x) => x.indexOf("coupon") !== -1);
                if (checkCoupon !== undefined) {
                  this.couponEnable = true;
                } else {
                  this.couponEnable = false;
                }
                this.publishOffers.push({
                  offerKey: dbkey,
                  couponFlg: this.couponEnable,
                });
              });

              if (this.channelType === "DMType" && this.dmTypeVal == "3") {
                this.noofOfferSelectArry.forEach((key) => {
                  let obj = { key: key, type: "SO" };
                  this.recoOffersObj.push(obj);
                  this.collectStaticOffersArry["SO"] = this.recoOffersObj;
                });
                let concatArry = { ...this.collectStaticOffersArry };
                this.shareService.offersToSubmit.next(this.publishOffers);
                this.shareService.offerWithRecoParentToshowInTableObj.next(this.selectedoffersParentObj);
                this.offersAppendToInput.emit(concatArry);
              } else {
                var concatArry: any = { ...this.submitFinalPropertiesArray, ...this.getParentIdNAttrs };
                this.shareService.offersToSubmit.next(this.publishOffers);
                this.offersAppendToInput.emit(concatArry);
              }

              this.onClose();
            } else {
              //Swal.fire('')
              this.onClose();
            }
          } else {
            // if fails condition
          }
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        text: this.translate.instant(
          "designEditor.offerDrawerComponent.validationMsg.pleaseSelectAnyOneOfferToContinuelblMsg"
        ),
      });
    }
  }
  recoDataCollectionMethod() {
    this.publishRecommendationOffers = [];

    this.collectRecoType.forEach((obj) => {
      if (this.recoAttributeSection) {
        const checkCoupon = this.getcheckedAttrObjReco[
          "reco_" + this.widgetCountArry[obj.dbKey] + "_" + obj.dbKey
        ].find((x) => x.indexOf("coupon") !== -1);
        if (checkCoupon !== undefined) {
          this.couponRecoEnable = 1;
        } else {
          this.couponRecoEnable = 0;
        }
      }
      this.tempPublishArry.push({
        key: obj.dbKey,
        offerTemplateKey: 0,
        widgetId: this.recoCount + 1,
        count: this.getSelectedRecoOffers[obj.dbKey][0].offerSelected,
        couponFlg: this.couponRecoEnable,
        ruleTemplateKey: this.ruleTemplateKey,
        type: "RO",
      });
      this.getSelectedRecoOffers[obj.dbKey][0].count = this.getSelectedRecoOffers[obj.dbKey][0].offerSelected;
      this.getSelectedRecoOffers[obj.dbKey][0].couponFlag = this.couponRecoEnable;
      this.getSelectedRecoOffers[obj.dbKey][0].templateKey = this.ruleTemplateKey;
      this.getSelectedRecoOffers[obj.dbKey][0].widgetId = this.recoCount + 1;
      this.getSelectedRecoOffers[obj.dbKey][0].recotabid = this.recoTabIndex;
      this.getSelectedRecoOffers[obj.dbKey][0].attributes =
        this.getcheckedAttrObjReco["reco_" + this.widgetCountArry[obj.dbKey] + "_" + obj.dbKey];
    });
    this.publishRecommendationOffers.push({
      promotionKey: this.promotionKey,
      splitKey: this.currentSplitId,
      commChannelKey: this.commChannelKey,
      item: this.tempPublishArry,
    });
    let concatArry = { ...this.getSelectedRecoOffers }; //getcheckedAttrObjReco
    this.shareService.recomendationOffersToSubmit.next(this.publishRecommendationOffers);
    this.offersAppendToInput.emit(concatArry);
  }
  async recommendationOfferDataMethod() {
    this.waitTillOffersLoad = true;
    this.sliderBlockContent = false;
    this.recoAttributeSection = false;
    this.showhideLabel = "Show";
    this.getSelectedRecoOffers = {};
    this.isRecoDropdownEnabled = {};
    const resultObj = await this.http.post(AppConstants.API_END_POINTS.GET_RECOMMENDATION_OBJ).toPromise();
    if (resultObj) {
      this.waitTillOffersLoad = false;
      this.recommendationObj = resultObj.nodes;
      this.filterRecoAttributesList = resultObj.offerParameters;
      this.loadRecoOffersMethod("-1");
      setTimeout(() => {
        if (AppConstants.CHANNEL_INFO.CHANNEL_TYPE.DM_CHANNEL === this.channelType && this.dmTypeVal === "1") {
          // DM Free text
          this.getEditModeFreeTextRecoOffers();
        } else if (AppConstants.CHANNEL_INFO.CHANNEL_TYPE.DM_CHANNEL === this.channelType && this.dmTypeVal === "2") {
          // DM columnar
          this.getEditModeFreeTextRecoOffers();
        } else if (AppConstants.CHANNEL_INFO.CHANNEL_TYPE.DM_CHANNEL === this.channelType && this.dmTypeVal === "3") {
          // multi offer
          this.getEditModeRecommendations();
        } else {
          this.getEditModeFreeTextRecoOffers();
        }
      }, 1000);
    } else {
    }
  }

  loadRecoOffersMethod(evt) {
    this.isDataNofound = false;
    var allObj, key;
    if (evt.target === undefined) {
      key = evt;
    } else {
      key = evt.target.value;
    }
    if (key === "-1") {
      allObj = this.recommendationObj;
      this.ruleTemplateKey = key;
    } else {
      allObj = this.recommendationObj; //.find(x => x.key == key);
      this.ruleTemplateKey = key;
    }
    if (Object.keys(allObj).length > 0) {
      this.showRecoOffers = [];
      allObj.forEach((each) => {
        if (each.key == key) {
          if (each.nodes.length > 0) {
            each.nodes.map((item) => {
              this.showRecoOffers.push(item);
            });
          }
        } else if (key === "-1") {
          each.nodes.map((item) => {
            this.showRecoOffers.push(item);
          });
        }
      });
      this.loadAttributesData();
    } else {
      this.showRecoOffers = [];
      this.isDataNofound = true;
    }
  }
  loadAttributesData() {
    const offerAttrsList = this.filterRecoAttributesList.filter((key, value) => key.includes("offer"));
    const couponAttrsList = this.filterRecoAttributesList.filter((key, value) => key.includes("coupon"));
    //Object.keys(obj).filter((key,value) => key.includes("coupon"));
    //console.log(couponAttrsList);
    if (offerAttrsList !== undefined) {
      this.recoRuleAttributesList = offerAttrsList;
    }
    if (couponAttrsList !== undefined) {
      this.recoRuleCouponAttributesList = couponAttrsList;
    }
  }
  selectRecoOffersMethod(evt, eachObj) {
    if (evt.target.checked) {
      this.selectedRecodbKey = eachObj.key;
      const obj = { dbKey: eachObj.key, name: eachObj.name, count: "", type: "RO", recotabid: "", attributes: [] };
      //this.collectRecoType = [];
      this.collectRecoType.push(obj);
      this.selectedAttributesArrayReco = [];
      this.getSelectedRecoOffers[this.selectedRecodbKey] = [obj];
      this.widgetCountArry[this.selectedRecodbKey] = this.widgetCount + 1;
      this.isRecoDropdownEnabled[this.selectedRecodbKey] = true;
      this.widgetCount = this.widgetCountArry[this.selectedRecodbKey];
    } else {
      let inx = this.collectRecoType.splice(
        this.collectRecoType.findIndex((x) => x.dbKey === eachObj.key),
        1
      );
      this.collectRecoType.splice(inx, 1);
      delete this.getSelectedRecoOffers[inx];
      this.widgetCountArry[this.selectedRecodbKey] = this.widgetCount - 1;
      this.isRecoDropdownEnabled[this.selectedRecodbKey] = undefined;
      this.widgetCount = this.widgetCountArry[this.selectedRecodbKey];
    }
  }

  getNoofRecoMethod(evt, obj, pInx) {
    this.noofRecoOffers = evt.target.value;
    this.getSelectedRecoOffers[obj.key][0].offerSelected = this.noofRecoOffers;
    this.recoTabs = [];
    for (let i = 0; i < this.noofRecoOffers; i++) {
      this.recoTabs.push(i);
    }
    this.isAttributeListIdReco = obj.key;
    //this.showHideRecoTabs(this.noofRecoOffers,pInx);
    //this.getRecoRuleAttributes(obj,1,pInx);
  }
  getRecommendationSelectedOffer() {
    //
    if (Object.keys(this.getcheckedAttrObj).length > 0) {
      this.getFinalOffers();
    } else {
      // const concatArry:any = {...this.getParentIdNAttrs,...this.getSelectedRecoOffers};
      this.recoDataCollectionMethod();
      this.onClose();
    }

    //this.shareService.finalOffersSelected.next(concatArry);
    //this.shareService.offersToSubmit.next(this.publishOffers);
    //this.onClose();
  }
  getRecoRuleAttributes(objkey, index, pInx) {
    this.isAttributeListEnableReco = true;
    this.sliderBlockContent = true;
    this.selectedRecoIndex = pInx;
    this.recoTabs = [];
    this.searchInputreco = "";
    //if(index == 1){
    for (let i = 0; i < this.getSelectedRecoOffers[objkey][0].offerSelected; i++) {
      this.recoTabs.push(i);
    }
    //}
    this.recoTabIndex = index;
    this.recoRuleAttributesList = [];
    this.recoRuleCouponAttributesList = [];
    setTimeout(() => {
      this.loadAttributesData();
      setTimeout(() => {
        this.loadSavedAttributes(objkey, index);
      }, 500);
    }, 500);

    //let checkElem= this.attributesOffers.nativeElement;
    // checkElem.getElementsByClassName('checkBoxStyle').(each => {
    //   each.checked = true;
    // })
  }
  loadSavedAttributes(objkey, inx) {
    // if(objkey.key === undefined){
    //   objkey = objkey;
    // }else{
    //   objkey = objkey.key;
    // }
    if (this.getcheckedAttrObjReco["reco_" + this.widgetCountArry[objkey] + "_" + objkey] !== undefined) {
      let checkElem = this.attributesOffers.nativeElement;
      let checkCouponElem = this.attrbutesCoupons.nativeElement;
      let recoOffArry = this.getcheckedAttrObjReco["reco_" + this.widgetCountArry[objkey] + "_" + objkey]; //.filter(x => x.split('.')[2] === inx);
      recoOffArry.forEach((each) => {
        let couponExists = each.includes("coupon");
        let ids = each.split(".");
        if (ids[2] == inx) {
          if (couponExists) {
            checkCouponElem.getElementsByClassName("check_" + ids[ids.length - 1])[0].checked = true;
          } else {
            checkElem.getElementsByClassName("check_" + ids[ids.length - 1])[0].checked = true;
          }
        }
      });
    }
  }
  //  loadSavedAttributesEditMode(objkey,inx){
  //   if(this.getSelectedRecoOffers[this.selectedRecodbKey][0].attributes.length > 0){
  //     let checkElem= this.attributesOffers.nativeElement;
  //     let recoOffArry = this.getSelectedRecoOffers[this.selectedRecodbKey][0].attributes;//.filter(x => x.split('.')[2] === inx);
  //     recoOffArry.forEach(each => {
  //       let ids = each.split('.');
  //       if(ids[2] == inx){
  //         checkElem.getElementsByClassName('check_'+ids[ids.length - 1])[0].checked = true;
  //       }

  //     });
  //   }
  //  }
  showHideRecoTabs(evt, key, pinx) {
    //this.showHideAttrinutes = id;
    let showhideVal = evt.target.innerText;
    if (showhideVal === "Show") {
      this.sliderBlockContent = true;
      this.recoAttributeSection = true;
      this.isAttributeListEnableReco = true;
      this.recoTabIndex = 1;
      this.isAttributeListIdReco = key;
      //this.selectedRecoIndex = pinx;
      this.showHideAttrinutes = 0;
      this.showhideLabel = "Hide";
      this.getRecoRuleAttributes(key, 1, pinx);
    } else {
      this.isAttributeListIdReco = key;
      this.showHideAttrinutes = 1;
      this.showhideLabel = "Show";
      this.sliderBlockContent = false;
      this.recoAttributeSection = false;
      this.isAttributeListEnableReco = false;
      //this.showHideAttrinutes = 1;
      //this.closeRecoAttrPanel(key);
    }
  }
  copyToPaste(tooltip, refEl: any, varArrayType) {
    this.ngZone.run(() => {
      if (tooltip.isOpen()) {
        tooltip.close();
      } else {
        let encodePipeStr = refEl;
        tooltip.open({ encodePipeStr });
        if (varArrayType === true) {
          this.clipboard.copy("{" + refEl.value + "[0]}");
        } else {
          this.clipboard.copy("{" + refEl.value + "}");
        }

        setTimeout(() => {
          tooltip.close();
        }, 1000);
      }
    });
  }
}
