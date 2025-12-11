import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DataService } from '@app/core/services/data.service';
import { HttpService } from '@app/core/services/http.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GlobalConstants } from '../common/globalConstants';
import { SharedataService } from '@app/core/services/sharedata.service';
import { AppConstants } from '@app/app.constants';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {
  @ViewChild("myDiv", { static: false }) myDiv!: ElementRef;
  @ViewChild('offerCardSectionArea') offerCardSectionArea!: ElementRef;
  promotionKey: number = 0;
  offerDataJson: any[] = [];
  selectedPlacement: any[] = [];
  tempPlacemet: any;
  objCh: any[] = [];
  myjson: string = "";
  codeSorted: boolean = false;
  dateSorted: boolean = false;
  isCouponEnable: boolean = GlobalConstants.isCouponEnable;
  currentSplitId: any;
  tempOfferArray: any[] = [];
  showLoader: boolean = false;
  selectedOffers: any[] = [];
  prevSelectedOffers: any[] = [];
  offerArray: any[] = [];
  editModeEnable: boolean = false;
  layoutArray: any[] = [];
  layout: string = 'layout2';
  previewArr: any[] = [1,2,3,4];
  noOfSelectedOffers: number = 0;
  commChannelKey: any;
  templateKey: any;
  searchText: string = '';
  selectedParameter: string = 'offerCode';
  noDataFound: boolean = false;
  startPosition: number = 0;
  totalCount: any;

  @Output() onAdd = new EventEmitter<any>();
  savedOffersEditMode: any;
  offerSelectedArray:any= [];
  constructor(
    private ref: ChangeDetectorRef,
    private httpService: HttpService,
    private bsModalRef: BsModalRef,
    private dataService: DataService,
    private shareService: SharedataService,
    private translate: TranslateService
  ) {
    ref.detach();
    setInterval(() => {
      this.ref.detectChanges();
    }, 100);
    
  }
  collectOfferDataArry(){
    this.shareService.offersBlockEditMode.subscribe(res => {
      if(res !== undefined){
        this.savedOffersEditMode = res;  
        let divEle = document.createElement('div');
        divEle.innerHTML = res;
        let objList:any = divEle.getElementsByClassName('productPreview');
        let selectOffers = [...objList];
        let obj:any = [];
        if(selectOffers.length > 0 ){
          selectOffers.forEach((each,i) => {
            let ele = each.getElementsByClassName('t1_p_offers')[0].getAttribute('id');
            let splitOffId = ele.split('_');
            let takeId = splitOffId[splitOffId.length - 1];
            obj.push(takeId);
          });
        }
        this.offerSelectedArray = obj;
        //this.editModeEnable = true;
      } 
    });
  }
  getDataOffers() {
    this.showLoader = true;
    this.searchText = '';
    const promoKey = {
      promotionKey: this.promotionKey,
      maxRecordsDisplay: 50, //default to 50
      startPos: 0,
      isCouponEnable: this.isCouponEnable,
      splitKey: this.currentSplitId,
    };
    this.httpService
      .post(AppConstants.API_END_POINTS.GET_OFFERS_DATA, promoKey)
      .subscribe((data) => {
        this.showLoader = false;
        this.totalCount = data.response.total_count;
        if (data.response.offers === undefined) {
          this.offerDataJson = [];
          this.noDataFound = true;
        } else {
          this.noDataFound = false;
          this.offerDataJson = data.response.offers;
          if(data.response.prevSelectedOfferIds.length !== 0) {
            this.selectedOffers = Array.from(data.response.prevSelectedOfferIds.split(','), Number);
            for (let obj of this.selectedOffers) {
              for (let item of this.offerDataJson) {
                if (obj === item.dbKey) {
                  this.prevSelectedOffers.push(item);
                }
              }
            }
          }
        }
        this.collectOfferDataArry();
        setTimeout(() => {
          this.showSelectedOfferCheckboxMethod(this.offerSelectedArray,this.offerDataJson);
        }, 300);        
      });
    }
    showSelectedOfferCheckboxMethod(seledtedObj,filterofferDataJson){
      let findEle = this.offerCardSectionArea.nativeElement;
      let findCheckInputArray = findEle.getElementsByClassName('offerDetails');
      let eachEleArry = [...findCheckInputArray];
      this.objCh = [];
      seledtedObj.forEach(eachOffer => {
        if(eachEleArry.length > 0){
          eachEleArry.forEach((item,i) => {
            let findInput = item.getElementsByClassName('inputChecked_'+eachOffer)[0];
            if(findInput !== undefined){
              let objOffer = filterofferDataJson.find((x) => x.dbKey == eachOffer);
              this.objCh.push(objOffer);
              findInput.checked = true;
            }            
           });
        }
      });
      
    }
  selectOffer(_evt, _cid) {
    if(_evt.target.checked && this.objCh.length >= 8) {
      _evt.currentTarget.checked = false;
      this.dataService.SwalValidationMsg(this.translate.instant('offerComponent.maximumNumberOfOfferSelectionShouldNotExceed8AlertMsgLbl'));
      return;
    }
    if (_evt.target.checked) {
      let obj = this.offerDataJson.find((x) => x.dbKey == _cid);
      this.objCh.push(obj);
    } else {
      let ind = this.objCh.findIndex((x) => x.dbKey == _cid);
      this.objCh.splice(ind, 1);
    }
  }

  selectAllOffers(e: any): void {
    // select all offers
    if (e.target.checked) {
      this.objCh = [...this.offerDataJson];
    } else {
      this.objCh = [];
    }
  }

  userSelectedOffers(): void {
    if (this.objCh.length === 0) {
      this.dataService.SwalValidationMsg(this.translate.instant('offerComponent.pleaseSelectOffersAlertMsgLbl'));
      return;
    }
    this.editModeEnable = true;
    this.noOfSelectedOffers = this.objCh.length;
    let url = '/templateApi/getRecoTemplates?commChannelKey=' + this.commChannelKey + '&recoType=1';
    this.httpService
      .post(url).subscribe((data) => {
          this.layoutArray = data.response;
      });
  }

  selectOfferLayout(layout:string, templateKey:number): void {
    this.layout = layout;
    this.templateKey = templateKey;
  }

  editOfferSelection(): void {
    this.editModeEnable = false;
    if(this.offerSelectedArray.length > 0){
      setTimeout(() => {
        this.showSelectedOfferCheckboxMethod(this.offerSelectedArray,this.offerDataJson);
      }, 300); 
    }
    //this.objCh = [];
  }

  insertOfferInTemplate(_evt) {
    if (this.objCh.length === 0) {
      if (this.isCouponEnable) {
        this.dataService.SwalValidationMsg(this.translate.instant('offerComponent.pleaseSelectCouponsAlertMsgLbl'));
      } else {
        this.dataService.SwalValidationMsg(this.translate.instant('offerComponent.pleaseSelectOffersAlertMsgLbl'));
      }
      return;
    }

    this.offerArray = this.prevSelectedOffers.concat(this.objCh);
    this.offerArray = Array.from(new Set(this.offerArray));

    this.tempOfferArray = this.offerArray.map((obj) => {
      return {
        key: obj.dbKey,
        type: "SO",
        count: 0,
      };
    });

    let offerObj = {
      promotionKey: this.promotionKey,
      splitKey: this.currentSplitId,
      item: this.tempOfferArray,
      offerTemplateKey: 0,
    };
    this.showLoader = true;
    this.httpService
      .post("/promoOffer/addOffersForChannel", offerObj)
      .subscribe((data) => {
        this.showLoader = false;
        let responseObj = data.response;
        let tempResponseArray = this.objCh;
        this.objCh = [];
        for (let obj of tempResponseArray) {
          if (responseObj[obj.dbKey]) {
            obj.couponCode = responseObj[obj.dbKey];
            this.objCh.push(obj);
          }
        }
        setTimeout(() => {
        this.insertData();
        }, 500);
      });
  }

  insertData(): void {
    this.myjson = this.myDiv.nativeElement.innerHTML;
    const valHtml = {
      type: "html",
      value: {
        html: this.myjson,
      },
    };
    this.onClose();
    this.onAdd.emit(valHtml);
    this.showLoader = false;
  }

  sortOffers(param: string): void {
    if (param === "date") {
      this.codeSorted = false;
      this.dateSorted = true;
      this.offerDataJson.sort(function (a, b) {
        return a.offerEndDate - b.offerEndDate;
      });
    } else {
      this.dateSorted = false;
      this.codeSorted = true;
      this.offerDataJson.sort(function (a, b) {
        if (a.offerCode < b.offerCode) {
          return -1;
        }
        if (a.offerCode > b.offerCode) {
          return 1;
        }
        return 0;
      });
    }
  }

  // search offer
  searchOfferByText(event:any): void {
    if(event.target.value === '') {
      this.getDataOffers();
    } else {
      const searchObj = {
        promotionKey: this.promotionKey,
        maxRecordsDisplay: 50,
        startPos: 0,
        splitKey: this.currentSplitId,
        isCouponEnable: this.isCouponEnable,
        filterByKey: this.selectedParameter,
        filterByValue: this.searchText, 
        rCount: 50
      };
      this.httpService.post(AppConstants.API_END_POINTS.GET_OFFERS_DATA, searchObj)
      .subscribe((data) => {
        if (data.response.offers === undefined) {
          this.offerDataJson = [];
          this.noDataFound = true;
        } else {
          this.offerDataJson = data.response.offers;
          this.noDataFound = false;
          if(this.offerSelectedArray.length > 0){
            setTimeout(() => {
              this.showSelectedOfferCheckboxMethod(this.offerSelectedArray,this.offerDataJson);
            }, 300); 
          }
        }
      });
    }
  }

  // onscroll functionality
  loadMoreOffers(event:any): void {
    if(this.offerDataJson.length === this.totalCount) {
      return;
    }
    const element = event.target;
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      this.startPosition = this.startPosition + 50;
      this.showLoader = true;
      const searchObj = {
        promotionKey: this.promotionKey,
        maxRecordsDisplay: 50,
        startPos: this.startPosition,
        splitKey: this.currentSplitId,
        isCouponEnable: this.isCouponEnable,
        rCount: 50
      };
      this.httpService.post(AppConstants.API_END_POINTS.GET_OFFERS_DATA, searchObj)
      .subscribe((data) => {
        this.showLoader = false;
        if (data.response.offers !== undefined) {
          this.offerDataJson = this.offerDataJson.concat(data.response.offers);
        }
      });
    }
  }

  onClose(): void {
    if (this.bsModalRef !== undefined) {
      this.bsModalRef.hide();
    }
  }

  ngOnInit(): void {
    this.dataService.$sharedPromoKey.subscribe((result) => {
      this.promotionKey = this.promotionKey = result;
    });
    this.shareService.currentSelectedChannelObj.subscribe((res: any) => {
      this.currentSplitId = res.currentSplitId;
      this.commChannelKey=res.commChannelKey;
    });
    
  }
  ngAfterViewInit() {
    this.getDataOffers();
  }
}
