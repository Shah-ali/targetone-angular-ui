import { Component, OnInit, Input } from '@angular/core';
import { AppConstants } from '@app/app.constants';
import { Template } from '@app/core/models/template';
import { DataService } from '@app/core/services/data.service';
import { HttpService, } from '@app/core/services/http.service';
import { SharedataService } from '@app/core/services/sharedata.service';
import { environment } from '@env/environment';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

import moment from 'moment';

@Component({
  selector: 'app-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.scss']
})
export class JourneyComponent implements OnInit {

  @Input() journeyName: string = '';
  @Input() promotionKey: number = 0;
  templates: Template[] = [];
  selectedTemplate?: Template;
  private BASE_URL = environment.BASE_URL;
  sortingParameter: string = '';
  savedTemplatedKey: any;
  isTemplateChange : boolean = false;
  startTime: Date = new Date();
  endTime: Date = new Date();
  uiBlockedFor: number = 0;
  langCode:any = AppConstants.DEFAULT_LANGUAGE;
  adminDateFormat:any;"";
  constructor(private httpService: HttpService, private dataService: DataService, private translate: TranslateService, private shareService: SharedataService) {
    this.shareService.setActiveLanguage.subscribe((res) => {
      if(res != ""){
        this.langCode = res;
      }
    });
    

   }
   
 

  // get Template list from API
  getTemplateList() {
    return this.httpService.post(AppConstants.API_END_POINTS.GET_JOURNEY_TEMPLATES).toPromise();
  }

  // search template by name
  searchTemplate(event:any): void {
    if(event.target.value === '') {
      this.getTemplateList().then((data:any) =>{
        this.templates = data.response;
      }).then(() => {
        if(this.promotionKey !== 0) {
          this.updateSelectedTemplate();
        }
      });
    } else {
      this.templates = this.templates.filter((item) => {
        return item.name.toLowerCase().indexOf(event.target.value.toLowerCase().trim()) > -1;
      })
    }
  }

  // select template
  setSeletedTemplate(template:Template): void {
	this.isTemplateChange = true;
    if(this.selectedTemplate === template) {
      this.selectedTemplate = undefined;	  
    } else {
      this.selectedTemplate = template;
    }
  }

  // sort template
  templateSortBy(param: string): void {
    let order = 'asc';
    if(param === 'createdDate') {
      order = 'desc';
    }
    this.httpService.post(AppConstants.API_END_POINTS.GET_JOURNEY_TEMPLATES+'?sortBy=' + param + '&sortOrder=' + order).subscribe(data => {
      this.templates = data.response;
      
      if(this.promotionKey !== 0) {
        this.updateSelectedTemplate();
      }
    });
  }

  // get Promotion ID in response
  createJourney(): void {
    if(this.journeyName === '') {
      this.dataService.SwalValidationMsg(this.translate.instant("journeySetUp.validationMessages.journeyNameEmpty"));
      return;
    }
    if(this.selectedTemplate) {
      this.createPromotion({
        'promotionName': this.journeyName,
        'preBuiltTemplateKey': this.selectedTemplate.dbKey,
        'promotionKey': this.promotionKey,
		'isTemplateChange':this.isTemplateChange
      });
    } else {
      if(this.promotionKey !== 0) {
        this.createPromotion({
          'promotionName': this.journeyName,
          'preBuiltTemplateKey': 0,
          'promotionKey': this.promotionKey,
		  'isTemplateChange':this.isTemplateChange
        });
      } else {
        this.createPromotion({'promotionName': this.journeyName});
      }
    }
  }

  createPromotion(obj:any): void {
    const body = obj;
    if(this.promotionKey !== 0) {
      this.httpService.post(AppConstants.API_END_POINTS.UPDATE_PROMOTION, body).subscribe((data) => {
        window.open(`${this.BASE_URL}/triggerPromo/promoWizRedirectToEditPage?promotionKey=${this.promotionKey}&url=updateTriggerForm`, '_parent');
      });
    } else {
      this.httpService.post(AppConstants.API_END_POINTS.CREATE_PROMOTION, body).subscribe((data) => {
        if(data.status == 'FAIL'){
          Swal.fire({
          icon: 'warning',
          text: this.translate.instant(data.message),
          showConfirmButton:true,
          confirmButtonText:this.translate.instant('designEditor.okBtn')
          });        
        }
        else if(data.response.promotionID !== undefined) {
          this.promotionKey = data.response.promotionID;
          // redirection to workbench page
          window.open(`${this.BASE_URL}/triggerPromo/promoWizRedirectToEditPage?promotionKey=${this.promotionKey}&url=updateTriggerForm`, '_parent');
        }
      });
    }
    
  }

  getSavedData(): void {
    const promoKey = {
      'promotionKey': this.promotionKey
    }
    this.httpService.post(AppConstants.API_END_POINTS.EDIT_PROMOTION, promoKey).subscribe((data) => {
      this.journeyName = data.response.promotionName;
      this.savedTemplatedKey = data.response.preBuiltTemplateKey;
      this.updateSelectedTemplate();
    });
  }

  updateSelectedTemplate(): void {
    this.templates.forEach((item)=> {
      if(item.dbKey === this.savedTemplatedKey) {
        this.selectedTemplate = item;
      }
    });
  }

  ngOnInit(): void {
    this.startTime = new Date();
    this.dataService.$sharedPromoKey.subscribe(result => {
      this.promotionKey = result;
      this.promotionKey = this.promotionKey;
    });
    
    this.getTemplateList().then((data:any) =>{
      this.templates = data.response; 
      this.shareService.adminDefaultDateFormat.subscribe((res) => {
        if(res != ""){
          if(res.message == 'SUCCESS'){
            this.adminDateFormat = res.response;              
          }       
        }
      });    
      setTimeout(() => {       
        this.templates.map( x => {
          let localiziedCreateDate:any;
          //if(this.langCode == 'ja' || this.langCode == 'ja'){
            localiziedCreateDate = moment(new Date(x.createdDateUi),'').locale(this.langCode).format("DD-MMM-YYYY");
            x.createdDateUi = localiziedCreateDate;
          //}
          
        });
      }, 500);
      
    }).then(() => {
      if(this.promotionKey !== 0) {
        this.getSavedData();
      }
    });

    this.endTime = new Date();
    this.uiBlockedFor = this.endTime.valueOf() - this.startTime.valueOf();

    console.log(this.uiBlockedFor+" milliseconds");
  }

}
