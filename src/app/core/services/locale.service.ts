import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable()
export class LocaleService {
  locale: any;
  beeToken: any;

  constructor(private httpService: HttpService) {}

  loadInfo(): Promise<any> {
    /* return this.httpService
      .get('/securityconfig/getLocale')
      .toPromise()
      .then((response) => {
        this.locale = response.body.result;
      })
      .then((_) => Promise.resolve(true))
      .catch((error) => {
        console.error('Error loading locale', error);
        return Promise.resolve(false);
      }); */

    const api1 = this.httpService.get("/securityconfig/getLocale").toPromise();
    const api2 = this.httpService.post("/templateApi/getBeeFreeToken?uid=beefree-tenant").toPromise();

    return Promise.all([api1, api2])
      .then(([resp1, resp2]) => {
        this.locale = resp1.body.result;
        this.beeToken = resp2;
        //console.log("Bee Token loaded successfully", this.beeToken);
      })
      .then((_) => Promise.resolve(true))
      .catch((error) => {
        console.error("APP_INITIALIZER failed", error);
        return Promise.resolve(); // Prevent app from blocking
      });
  }
}
