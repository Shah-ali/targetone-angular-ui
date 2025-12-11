import { Component, OnInit, TemplateRef } from '@angular/core';
import { Journey, Campaign, Tags } from '@app/core/models/journey';
import { HttpService } from '@app/core/services/http.service';
import { environment } from '@env/environment';
import { DataService } from '@app/core/services/data.service';
import { AppConstants } from '@app/app.constants';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';
import { DateTimeAdapter } from 'ng-pick-datetimex';
import Swal from 'sweetalert2';
import { SharedataService } from '@app/core/services/sharedata.service';
import moment from 'moment';

@Component({
  selector: 'app-final-setup',
  templateUrl: './final-setup.component.html',
  styleUrls: ['./final-setup.component.scss'],
})
export class FinalSetupComponent implements OnInit {
  private BASE_URL = environment.BASE_URL;
  promotionKey: number = 0;
  promotionKey1: number = 0;
  selectTagName: string = '';
  newTag?: Tags;
  tagList: Tags[] = [];
  campaigns: Campaign[] = [];
  runningPromotion: boolean = false;
  modalRef?: BsModalRef;
  timeZoneInGMT: any;
  reinitiations: any[] = [];

  journeyObj: Journey = {
    promotionKey: this.promotionKey,
    promotionDesc: '',
    tags: [],
    allSelectedTagKeys: '',
    promStartDate: new Date(),
    promStartDateStr: '',
    promEndDate: new Date(),
    promEndDateStr: '',
    campaignKey: '',
    selectedReEntryType: '',
    reentryRestrictDays: 0,
    lastSavedStep: 4,
    simulationMode: 0,
    listGenKey: 0,
  };
  langCode: any = AppConstants.DEFAULT_LANGUAGE;
  constructor(
    private httpService: HttpService,
    private dataService: DataService,
    private modalService: BsModalService,
    private translate: TranslateService,
    dateTimeAdapter: DateTimeAdapter<any>,
    private shareService: SharedataService
  ) {
    this.reinitiations = [
      { key: '000', name: this.translate.instant('designEditor.selectlbl') },
      { key: '100', name: this.translate.instant('finalize.inProgressJourneys') },
      { key: '010', name: this.translate.instant('finalize.goalAchievedJourneys') },
      { key: '001', name: this.translate.instant('finalize.goalNotAchievedJourneys') },
    ];
    this.shareService.setActiveLanguage.subscribe((res) => {
      if (res != '') {
        dateTimeAdapter.setLocale(res);
      }
    });
  }

  // Get all tag list data
  getFinalJourneyData() {
    return this.httpService.post(AppConstants.API_END_POINTS.GET_CREATE_TRIGGER_PROMOTION).toPromise();
  }

  selectTags(e: any): void {
    this.newTag = this.tagList.find((item) => {
      return item.tagName === e.target.value;
    });
    e.target.value = '';
    if (this.newTag !== undefined) {
      if (!this.journeyObj.tags.includes(this.newTag)) {
        this.journeyObj.tags.push(this.newTag);
      } else {
        //this.dataService.SwalValidationMsg(this.newTag.tagName + ' tag is already added.');
        this.dataService.SwalValidationMsg(this.translate.instant('finalize.validationMessages.sameTagAddedAgain'));
        return;
      }
    }
    this.updateTagsList();
  }

  removeTag(tagName: any): void {
    this.journeyObj.tags = this.journeyObj.tags.filter((item) => {
      return item.tagName !== tagName;
    });
    this.updateTagsList();
  }

  // update tags in the list
  updateTagsList(): void {
    this.journeyObj.allSelectedTagKeys = '';
    for (let item of this.journeyObj.tags) {
      if (this.journeyObj.allSelectedTagKeys.length >= 1) {
        this.journeyObj.allSelectedTagKeys = this.journeyObj.allSelectedTagKeys + ',' + item.dbKey;
      } else {
        this.journeyObj.allSelectedTagKeys = item.dbKey.toString();
      }
    }
  }

  // reset re-entry days
  updateReEntryDays(): void {
    if (this.journeyObj.selectedReEntryType === '000') {
      this.journeyObj.reentryRestrictDays = 0;
    }
  }

  saveJourney(): void {
    /* this.journeyObj.promStartDateStr = this.journeyObj.promStartDate.toLocaleString();
    this.journeyObj.promEndDateStr = this.journeyObj.promEndDate.toLocaleString(); */
    
    this.journeyObj.promStartDateStr  = moment(this.journeyObj.promStartDate).format('MM/DD/YYYY, hh:mm:ss A');
    this.journeyObj.promEndDateStr  = moment(this.journeyObj.promEndDate).format('MM/DD/YYYY, hh:mm:ss A');
    
    const body = this.journeyObj;
    this.httpService.post(AppConstants.API_END_POINTS.UPDATE_PROMOTION, body).subscribe((data) => {
      if(data.status == "SUCCESS") {
        this.dataService.SwalSuccessMsg(this.translate.instant('finalize.journeySaved'));
      } else {
        this.dataService.SwalSuccessMsg(data.message);
      }
    });
  }

  simulateJourney(): void {
    this.journeyObj.promStartDateStr = moment(this.journeyObj.promStartDate).format('MM/DD/YYYY, hh:mm:ss A');;
    this.journeyObj.promEndDateStr = moment(this.journeyObj.promEndDate).format('MM/DD/YYYY, hh:mm:ss A');
    const body = this.journeyObj;
    const promoKey = {
      promotionKey: this.journeyObj.promotionKey,
    };

    this.httpService.post(AppConstants.API_END_POINTS.UPDATE_PROMOTION, body).subscribe((data) => {
      this.httpService
        .post(AppConstants.API_END_POINTS.SCHEDULE_TRIGGER_PROMOTION + '?simulate=true&lockSimulation=false', promoKey)
        .subscribe((data) => {
          if (data.status === 'SUCCESS') {
            this.dataService.SwalSuccessMsg(this.translate.instant('journeySetUp.journeySimulationDoneLbl'));

            window.open(`${this.BASE_URL}/campaign/campaignSummary`, '_parent');
          }
        });
    });
  }

  activateJourney(modalTemplate: TemplateRef<any>): void {
    if (this.journeyObj.simulationMode && this.journeyObj.listGenKey > 0) {
      this.modalRef = this.modalService.show(modalTemplate, {
        class: 'modal-dialog-centered publishModal',
        backdrop: 'static',
        keyboard: false,
      });
    } else {
      this.journeyObj.promStartDateStr = moment(this.journeyObj.promStartDate).format('MM/DD/YYYY, hh:mm:ss A');
      this.journeyObj.promEndDateStr = moment(this.journeyObj.promEndDate).format('MM/DD/YYYY, hh:mm:ss A');
      const body = this.journeyObj;
      const promo = {
        promotionKey: this.journeyObj.promotionKey,
      };

      this.httpService.post(AppConstants.API_END_POINTS.UPDATE_PROMOTION, body).subscribe((data) => {
        this.httpService
          .post(AppConstants.API_END_POINTS.SCHEDULE_TRIGGER_PROMOTION + '?simulate=false&lockSimulation=false', promo)
          .subscribe((data) => {
            if (data.status === 'SUCCESS') {
              this.dataService.SwalSuccessMsg(this.translate.instant('journeySetUp.journeyHasBeenPublishedLbl'));
              window.open(`${this.BASE_URL}/campaign/campaignSummary`, '_parent');
            } else if (data.status === 'FAIL') {
              let errorMsg = JSON.parse(data.message).find((x) => x.globalError).globalError;
              if (errorMsg !== undefined) {
                Swal.fire({
                  icon: 'warning',
                  text: errorMsg,
                });
                return;
              }
            }
          });
      });
    }
  }

  getSavedData(): void {
    const promoKey = {
      promotionKey: this.journeyObj.promotionKey,
    };
    this.httpService.post(AppConstants.API_END_POINTS.EDIT_PROMOTION, promoKey).subscribe((data) => {
      this.journeyObj.promotionDesc = data.response.promotionDesc;
      this.journeyObj.campaignKey = data.response.campaignKey.toString();
      this.journeyObj.promStartDate = new Date(data.response.promStartDateStr);
      this.journeyObj.promEndDate = new Date(data.response.promEndDateStr);
      this.journeyObj.reentryRestrictDays = data.response.reentryRestrictDays;
      this.journeyObj.selectedReEntryType = data.response.selectedReEntryType;
      this.journeyObj.simulationMode = data.response.simulationMode;
      this.journeyObj.listGenKey = data.response.listGenKey;
      this.dataService.setRunningPromotion = data.response.promoExecutedOrRunning;

      let tagArray = data.response.allSelectedTagKeys.split(',');
      for (let obj of this.tagList) {
        if (tagArray.includes(obj.dbKey.toString())) {
          this.journeyObj.tags.push(obj);
          if (this.journeyObj.allSelectedTagKeys.length >= 1) {
            this.journeyObj.allSelectedTagKeys = this.journeyObj.allSelectedTagKeys + ',' + obj.dbKey;
          } else {
            this.journeyObj.allSelectedTagKeys = obj.dbKey.toString();
          }
        }
      }
    });
  }

  ngOnInit(): void {
    this.dataService.$sharedPromoKey.subscribe((result) => {
      this.promotionKey = result;
      this.journeyObj.promotionKey = this.promotionKey;
    });
    this.dataService.$runningPromotion.subscribe((result) => {
      this.runningPromotion = result;
    });
    this.getFinalJourneyData()
      .then((data: any) => {
        this.campaigns = data.response.campaignList;
        this.journeyObj.campaignKey = this.campaigns[0].dbKey.toString();
        this.tagList = data.response.tagList;
      })
      .then(() => {
        this.getSavedData();
      });
    this.getTimeZOneInGMTMethod();
  }
  getTimeZOneInGMTMethod() {
    this.httpService.post('/triggerPromo/getTimezoneInGMT').subscribe((data) => {
      if (data !== undefined) {
        this.timeZoneInGMT = data.response;
        console.log(this.timeZoneInGMT);
      }
    });
  }
}
