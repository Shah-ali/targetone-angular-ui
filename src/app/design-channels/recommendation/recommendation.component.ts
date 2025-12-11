import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpService } from '@app/core/services/http.service';
import { DataService } from '@app/core/services/data.service';
import { SharedataService } from '@app/core/services/sharedata.service';
import { GlobalConstants } from '../common/globalConstants';
import { TranslateService } from '@ngx-translate/core';
import { AppConstants } from '@app/app.constants';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.scss']
})
export class RecommendationComponent implements OnInit {
  @ViewChild('recoDiv', { static: false }) recoDiv!: ElementRef;
  @Output() onAdd = new EventEmitter<any>();

  editModeEnable:boolean = false;
  searchText: string = '';
  layout: string = 'layout2';
  previewArr: any[] = [1,2,3,4];
  recommendationNodes: any[] = [];
  personalizationListArray: any[] = [];
  discoverListArray: any[] = [];
  combinedArray: any[] = [];
  recoType: string = 'All';
  showLoader: boolean = false;
  myjson: string = '';
  selectedReco: any;
  tempListArray: any[] = [];
  noResultFound: boolean = false;
  layoutArray: any[] = [];
  promotionKey: number = 0;
  currentSplitId: any;
  noOfReco: number = 4;
  templateKey: any;
  commChannelKey: any;
  widgetAttributes: any[] = [];
  placementId: any;
  tempWidgetCount: any;
  channelObj: any;
  tempRecoSelected: any = {};
  isDoneClicked: boolean = false;
  offerDataJson: any[] = [];
  
  constructor(private bsModalRef: BsModalRef, 
    private ref: ChangeDetectorRef, 
    private httpService: HttpService,
    private dataService: DataService,
    private shareService: SharedataService,
    private translate: TranslateService) { 
    ref.detach();
      setInterval(() => { this.ref.detectChanges(); }, 100);
  }

  getRecommendationList(): void {
    this.httpService
      .post(AppConstants.API_END_POINTS.GET_RECOMMENDATION_OBJ).subscribe((data) => {
          this.showLoader = false;
          this.recommendationNodes = data.nodes;

          // todo Logic
          for(let x of this.recommendationNodes) {
            for(let y of x.nodes) {
              y.nodeType = x.name;
              for(let z of y.aliasValueMap.map) {
                if(z.name === 'pageType') {
                  y.pageType = z.valueData[0];
                }
                if(z.name === 'placement') {
                  y.placement = z.valueData[0];
                }
                if(z.name === 'backfillOffers') {
                  y.backfillOffers = z.valueData[0];
                }
                if(z.name === 'recoType') {
                  y.recoType = z.valueData[0];
                }
              }
            }
          }

          /* this.recommendationNodes.forEach((item) => {
            item.nodes.forEach((item2) => {
              this.combinedArray.push(item2);
            });
          });
          this.personalizationListArray = this.recommendationNodes[0].nodes;
          this.discoverListArray = this.recommendationNodes[0].nodes;
          this.combinedArray = this.personalizationListArray.concat(this.discoverListArray);
          this.tempListArray = this.combinedArray; */

          this.personalizationListArray = this.recommendationNodes[0].nodes;
          this.tempListArray = this.recommendationNodes[0].nodes;
          this.recoType = this.recommendationNodes[0].name;
          this.searchText = '';
          if(this.tempListArray.length === 0) {
            this.noResultFound = true;
          } else {
            this.noResultFound = false;
          }
      });
  }

  // reset recommendation
  resetcommendation(): void {
    this.recoType = 'All';
    this.searchText = '';
    this.tempListArray = this.combinedArray;
    this.noResultFound = false;
  }

  // reset edit section
  resetEditSection(n:number): void {
    this.noOfReco = n;
    this.previewArr.length = n;
  }

  selectRecommendation(recoItem:any): void {
    this.editModeEnable = true;
    this.selectedReco = recoItem;
    let url = '/templateApi/getRecoTemplates?commChannelKey=' + this.commChannelKey + '&recoType=' + this.selectedReco.recoType;
    this.httpService
      .post(url).subscribe((data) => {
          this.layoutArray = data.response;
          if(this.layoutArray.length !== 0) {
            this.templateKey = this.layoutArray[1].dbKey;
            this.widgetAttributes = JSON.parse(this.layoutArray[1].templateText);
            this.placementId = this.selectedReco.placement;
          }
          this.insertData();
    });
    this.resetEditSection(4);
  }

  editRecoSelection(): void {
    this.editModeEnable = false;
    this.resetcommendation();
  }

  selectLayout(layout:string, templateKey:number): void {
    this.layout = layout;
    this.templateKey = templateKey;
    if(layout === 'layout1' || layout === 'layout3') {
      this.resetEditSection(2);
    } else {
      this.resetEditSection(4);
    }

    this.insertData();
  }

  changeNumberOfCards(num: number): void {
    if(num > 8) {
      this.dataService.SwalValidationMsg('Value should be less than or equal to 8');
      this.resetEditSection(2);
      return;
    }
    this.previewArr.length = num;
    this.insertData();
  }

  // filter recommendation based on type
  // this function is not in use currently
  selectRecoType(recoType:any): void {
    const list = this.recommendationNodes.find(item => item.name === recoType);
    if(list != undefined) {
      this.tempListArray = list.nodes;
      this.noResultFound = false;
    } else {
      this.tempListArray = [];
      this.noResultFound = true;
    }

    /* if(recoType === 'Personalization-Recommend-Template') {
      this.tempListArray = this.personalizationListArray;
    } else if (recoType === 'Personalization-Discover-Template') {
      this.tempListArray = this.discoverListArray;
    } else {
      this.tempListArray = this.combinedArray;
    } 
    if(this.tempListArray.length === 0) {
      this.noResultFound = true;
    } else {
      this.noResultFound = false;
    } */
  }

  // search recommendation by name
  // this function is not in use currently
  searchRecommendation(searchText:string): void {
    if(searchText === '') {
      if(this.recoType === 'Personalization-Recommend-Template') {
        this.tempListArray = this.personalizationListArray;
      } else if(this.recoType === 'Personalization-Discover-Template') {
        this.tempListArray = this.discoverListArray;
      } else {
        this.tempListArray = this.combinedArray;
      }
    } else {
      this.tempListArray = this.tempListArray.filter((item)=> {
        return item.name.toLowerCase().indexOf(searchText.toLowerCase().trim()) > -1;
      });
    }
    if(this.tempListArray.length === 0) {
      this.noResultFound = true;
    } else {
      this.noResultFound = false;
    }
  }

  insertData(): void {
    let type: string;
    if(this.selectedReco.recoType === '1') {
      type = 'RO';
    } else if(this.selectedReco.recoType === '2') {
      type = 'RP';
    } else {
      type = 'SO';
    }

    this.tempRecoSelected = {
      promotionKey: this.promotionKey,
      splitKey: this.currentSplitId,
	    commChannelKey: this.commChannelKey,
      item: [
        {
          key: this.selectedReco.key,
          type: type,
          count: this.previewArr.length,
          offerTemplateKey: this.templateKey,
          widgetId: this.tempWidgetCount
        }]
    };
    if (this.isDoneClicked) {
      this.httpService
        .post("/rule/addRecoRuleForChannel", this.tempRecoSelected).subscribe((data) => {
          console.log('success');
        });
    }
  }

  insertRecommendation(): void {
	this.isDoneClicked = true;
    this.insertData();
    this.myjson = this.recoDiv.nativeElement.innerHTML;
    const valHtml = {
      type: "html",
      value: {
        html: this.myjson,
      },
    };
    
    GlobalConstants.rrWidgetCount =  GlobalConstants.rrWidgetCount+1;

    this.onClose();
    this.onAdd.emit(valHtml);
  }

  onClose(): void {
    if(this.bsModalRef !== undefined) {
      this.bsModalRef.hide();
    }
  }

  ngOnInit(): void {
    this.showLoader = true;
    setTimeout(() => {
      this.getDataOffers();
    }, 0);
    this.getRecommendationList();
    this.dataService.$sharedPromoKey.subscribe((result) => {
      this.promotionKey = this.promotionKey = result;
    });
    this.shareService.currentSelectedChannelObj.subscribe((res: any) => {
      this.currentSplitId = res.currentSplitId;
      this.commChannelKey=res.commChannelKey;
    });
    
    this.tempWidgetCount = GlobalConstants.rrWidgetCount;
  }

  getDataOffers() {
    this.showLoader = true;
    const promoKey = {
      promotionKey: this.promotionKey,
      maxRecordsDisplay: 8, //default to 8
      startPos: 0,
      isCouponEnable: false,
      splitKey: this.currentSplitId,
    };
    this.httpService.post(AppConstants.API_END_POINTS.GET_OFFERS_DATA, promoKey).subscribe((data) => {
      this.showLoader = false;
        if (data.response.offers === undefined) {
          this.offerDataJson = [];
        } else {
          this.offerDataJson = data.response.offers;
        }
      });
    }

  /* onImgError(event) { 
    event.target.src = this.BASE_URL_ANGULAR+'/assets/images/previewImg.png';
  } */

}
