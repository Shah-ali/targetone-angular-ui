import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpService } from '@app/core/services/http.service';
import { DataService } from '@app/core/services/data.service';
import { environment } from '@env/environment';
import { Journey } from '@app/core/models/journey';
import { AppConstants } from '@app/app.constants';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-activate-journey',
  templateUrl: './activate-journey.component.html',
  styleUrls: ['./activate-journey.component.scss']
})
export class ActivateJourneyComponent implements OnInit {
  @Input('dataFromParent') modalRef?: BsModalRef;
  @Input() journeyObj?: Journey;
  private BASE_URL = environment.BASE_URL;
  lockSimulation: boolean = false;

  constructor(private httpService: HttpService, private dataService: DataService,private translate: TranslateService) { }

  closeModal(): void {
    if(this.modalRef !== undefined) {
      this.modalRef.hide();
    }
  }

  enableLockSimulation(): void {
    this.lockSimulation = !this.lockSimulation;
  }

  activateLockSimulation(): void {
    let promo:any;
    const body = this.journeyObj;
    if(this.journeyObj !== undefined) {
      promo = {
        'promotionKey': this.journeyObj.promotionKey
      }
    }

    this.httpService.post(AppConstants.API_END_POINTS.UPDATE_PROMOTION, body).subscribe((data) => {
      this.httpService.post(AppConstants.API_END_POINTS.SCHEDULE_TRIGGER_PROMOTION+'?simulate=false&lockSimulation='+this.lockSimulation, promo).subscribe((data) => {
        if(data.status === 'SUCCESS') {
          if(this.modalRef !== undefined) {
            this.modalRef.hide();
          }
          this.dataService.SwalSuccessMsg(this.translate.instant('journeySetUp.journeyHasBeenPublishedLbl'));
          window.open(`${this.BASE_URL}/campaign/campaignSummary`, '_parent');
        }
      });
    });
  }

  ngOnInit(): void {
  }

}
