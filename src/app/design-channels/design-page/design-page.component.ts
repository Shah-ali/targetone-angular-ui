import { Component, OnInit } from '@angular/core';
import { HttpService } from '@app/core/services/http.service';
import { HttpParams } from '@angular/common/http';
import { Router} from '@angular/router';
import { AppConstants } from '@app/app.constants';
import { SharedataService } from '@app/core/services/sharedata.service';
import { LoaderService } from '@app/core/services/loader.service';
import { GlobalConstants } from '../common/globalConstants';
import { DataService } from '@app/core/services/data.service';
@Component({
  selector: 'app-design-page',
  templateUrl: './design-page.component.html',
  styleUrls: ['./design-page.component.scss']
})
export class DesignPageComponent implements OnInit {
  channelObj: any;
  promoKey: any;
  promoCommKey: any;
  promotionObj: any;
  channelType: any;
  CHANNEL_INFO_HTML = AppConstants.CHANNEL_INFO;
  promoExecutedOrRunning: boolean = false;
  dmType: any;

  constructor(
    private http: HttpService, 
    private router: Router,
    private shareService:SharedataService, 
    private loader: LoaderService, 
    private dataService: DataService
  ) { 
    this.getPromotionKey();
    this.getpromoChannelObj();
  }

  getPromotionKey(): void {   
    const url = window.location.href;
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      this.promoKey = httpParams.get("promotionKey");
      GlobalConstants.promoKey = this.promoKey;      
      this.promoCommKey = httpParams.get("promoCommunicationKeys");
      GlobalConstants.promoCommKey = this.promoCommKey;
      this.promotionObj={ "promoKey":this.promoKey,"promoCommKey":this.promoCommKey }
      this.shareService.promoKeyObj.next(this.promotionObj);      
    }else{
      if(GlobalConstants.isSavedEmails && GlobalConstants.promoKey !== undefined){
        this.promoKey=GlobalConstants.promoKey;
        this.promoCommKey = GlobalConstants.promoCommKey;

      }
    }
  }
  async getpromoChannelObj() {
    let url = AppConstants.API_END_POINTS.GET_MAP_PROMO_CHANNELS+`?promoKey=${GlobalConstants.promoKey}`;
    const resultObj = await this.http.post(url).toPromise();
    this.channelObj = resultObj;
    this.channelType = resultObj[0].channelType;
    this.dmType = resultObj[0].dmType;
    this.promoExecutedOrRunning = resultObj[0].promoExecutedOrRunning;
    this.dataService.setRunningPromotion = resultObj[0].promoExecutedOrRunning;
    GlobalConstants.channelObj = this.channelObj;
    this.shareService.channelObj.next(this.channelObj);
    console.log(this.channelObj);
  }

  ngOnInit(): void {}
}
