import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './data.service';
import { environment } from '@env/environment';
import { Location } from '@angular/common';
import { KeyStringFormat } from '../models/dataset';
import { HttpService } from './http.service';
import { SharedataService } from './sharedata.service';
import { IntroJSService } from '@app/core/services/introjs.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private userCSRFToken: string = '';
  promotionKey: number = 0;
  private BASE_URL = environment.BASE_URL;
  isTemplateLibraryMode: boolean = false;
  isPersonalizeTagMode: boolean = false;
  setActiveLanguage: String = '';

  constructor(
    private router: Router,
    private dataService: DataService,
    private _location: Location,
    private httpService: HttpService,
    private shareService: SharedataService,
    private introService: IntroJSService
  ) {
    this.shareService.templateLibrary.subscribe((result) => {
      this.isTemplateLibraryMode = result;
    });
    this.shareService.setActiveLanguage.subscribe((data) => {
      this.setActiveLanguage = data;
    });
    this.shareService.personalizeTagService.subscribe((result) => {
      this.isPersonalizeTagMode = result;
    });
  }

  isClientConnected(): boolean {
    return this.CSRFToken ? true : false;
  }

  set CSRFToken(token: string) {
    token && (this.userCSRFToken = token);
  }

  get CSRFToken() {
    return this.userCSRFToken;
  }

  globalHelpOLH(isSection?: string) {
    let currentView = isSection ? isSection : this.getCurrentView();
    let properties: KeyStringFormat = {};
    let cshid;

    this.httpService.get1('olh_properties.json').subscribe((res) => {
      properties = res.body.cshids;
      cshid = properties[currentView];
      //let helpUrl = `${environment.HELP_URL}/${this.setActiveLanguage}${environment.HELP_CONTENT}`;
      let helpUrl = `${environment.HELP_URL}/${this.setActiveLanguage}${environment.HELP_CONTENT}`;
      cshid && (helpUrl = `${helpUrl}#cshid=${cshid}_${this.setActiveLanguage}`);
      // window.open(helpUrl, "_blank");
      window.open(helpUrl, "_blank", "width=1024,height=600");
    });
  }

  getVisualHelp(isSection?: string) {
    let currentView = isSection ? isSection : this.getCurrentView();
    if(currentView == 'saved-personalized-tags') {
      this.introService.pTagCardHelp();
    } else if(currentView == 'personalizedTag-editor') {
      this.introService.pTagEditor();
    }
    
  }

  getCurrentView(): string {
    let currentView: string;
    let url = this.router.url.split('/')[1];
    if (this.isTemplateLibraryMode) {
      url = 'template-library';
    }
    currentView = url;
    if (currentView.includes('?')) {
      currentView = currentView.split('?')[0];
    }
    return currentView;
  }

  goToWorkbenchPage() {
    window.open(`${this.BASE_URL}/triggerPromo/promoWizRedirectTo?url=updateTriggerForm`, '_parent');
  }

  goToDesignPage() {
    window.open(`${this.BASE_URL}/promotion/promoWizRedirectTo?url=promoUpdateChannelSelection`, '_parent');
  }

  goToReviewPage() {
    window.open(`${this.BASE_URL}/triggerPromo/promoWizRedirectTo?url=triggerAnalytics`, '_parent');
  }

  goToFinalizePage() {
    window.open(`${this.BASE_URL}/triggerPromo/promoWizRedirectTo?url=triggerReview`, '_parent');
  }
}
