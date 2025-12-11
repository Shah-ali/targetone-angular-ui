import { Component, HostListener } from '@angular/core';
import { HttpService } from './core/services/http.service';
import { HttpParams } from '@angular/common/http';
import { DataService } from './core/services/data.service';
import { Subject } from 'rxjs';
import { LoaderService } from './core/services/loader.service';
import { AppConstants } from './app.constants';
import { TranslateService } from '@ngx-translate/core';
import { SharedataService } from './core/services/sharedata.service';
// import * as CodeMirror from 'codemirror/mode/javascript/javascript';
// import * as CodeMarKdown from 'codemirror/mode/markdown/markdown';
import { LocaleService } from './core/services/locale.service';
import { environment } from '@env/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  languages: any[] = AppConstants.LANGUAGES;
  DEFAULT_LANGUAGE: string = '';
  title = 'cmp-tone-ui';
  journeyName: string = '';
  promotionKey: number = 0;
  username: string = '';
  tenant_key: any;
  grapeJsEnabled: boolean = false;
  pTag_tagKey: any;

  constructor(
    private translate: TranslateService,
    private httpService: HttpService,
    private dataService: DataService,
    private loader: LoaderService,
    private shareService: SharedataService,
    private localeService: LocaleService
  ) {
    //Set Default language
    const langs = this.languages.reduce((acm, obj) => acm.concat(obj.key), []);
    this.translate.addLangs(langs);
    //console.log('infoService 111', infoService.info);
    this.DEFAULT_LANGUAGE = localeService.locale;
    this.translate.setDefaultLang(this.DEFAULT_LANGUAGE);
    this.shareService.setActiveLanguage.next(this.DEFAULT_LANGUAGE);
    this.translate.use(this.DEFAULT_LANGUAGE);
    //console.log("DEFAULT_LANGUAGE = "+ this.DEFAULT_LANGUAGE);
  }

  ngOnInit() {
    this.getPromotionKey();
    this.getTenantKey();
    this.getGrapesJSEnable();
    if (this.promotionKey != 0) {
      this.getSavedData();
    }
    this.getAdminDateFormatMethod();
    //this.getLocale();
  }

  /* getLocale(): void {
    this.httpService.get('/securityconfig/getLocale').subscribe((data) => {
      //document.cookie['Locale'] = data.response;
      this.DEFAULT_LANGUAGE = data.body.result;
      this.translate.setDefaultLang(this.DEFAULT_LANGUAGE);
      this.shareService.setActiveLanguage.next(this.DEFAULT_LANGUAGE);
    });
  } */

  /* getCookieValue(cookieName:any){
    let lngCode;
    if(cookieName.length > 0){
      cookieName.forEach(element => {
        if(element.includes('Locale')){
          lngCode = element.split('=')[1];
        }
      });
    }    
    return lngCode;
  } */
  getPromotionKey(): void {
    const url = window.location.href;
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      this.promotionKey = Number(httpParams.get('promotionKey'));
      this.dataService.setSharedPromoKey = Number(httpParams.get('promotionKey'));
    }
    //console.log(this.promotionKey);
  }

  getTenantKey(): void {
    const url = window.location.href;
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      this.tenant_key = Number(httpParams.get('tenant_key'));
      this.pTag_tagKey = Number(httpParams.get('tagKey'));
      if (this.tenant_key > 0) {
        this.dataService.setSharedTenantKey = Number(httpParams.get('tenant_key'));
      }
      this.dataService.setSharedActiveContentTagKey = this.pTag_tagKey;
    }
  }

  getGrapesJSEnable(): void {
    const url = window.location.href;
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      this.grapeJsEnabled = httpParams.get('grapeJsEnabled') === 'true';
      this.shareService.grapesJsEnabled.next(this.grapeJsEnabled);
    }
  }

  getSavedData(): void {
    const promoKey = {
      promotionKey: this.promotionKey,
    };
    this.httpService.post('/triggerPromo/editPromo', promoKey).subscribe((data) => {
      this.journeyName = data.response.promotionName;
    });
  }
  getAdminDateFormatMethod() {
    this.httpService.post(AppConstants.ADMIN_DATE_FORMAT).subscribe((res) => {
      if (res !== undefined) {
        this.shareService.adminDefaultDateFormat.next(res);
      }
    });
  }

  handlePageClick(el) {
    const classNames = ['menuItemDesc', 'detailsMenuItem', 'actionDetailsCtr', 'dataSetDetailsCtr'];
    if (classNames.some((className) => el.target.classList.contains(className))) {
      document.getElementById('actionDetailsCtr')?.classList.remove('hide');
    } else {
      document.getElementById('actionDetailsCtr')?.classList.add('hide');
    }
    window.parent.postMessage('hideLeftMenu', environment.BASE_URL);
  }

  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent) {
    if (event.data === 'cmp_logout_iframe') {
      // Clear sessionStorage
      sessionStorage.clear();
    }
  }
}
