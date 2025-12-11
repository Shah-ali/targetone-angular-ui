import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '@app/app.constants';

import { AuthenticationService } from '@app/core/services/authentication.service';

@Injectable()
export class CSRFInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService, private tokenExtractor: HttpXsrfTokenExtractor) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //const xsrfToken = document.cookie;

    /* In JAVA file
        Cookie cookie = new Cookie("XSRF-TOKEN", csrf);
        cookie.setPath("/");
        cookie.setHttpOnly(false); */

    let requestMethod: string = request.method;
    //console.log(requestMethod);

    const token = this.tokenExtractor.getToken() as string;
    this.authService.CSRFToken = token;

    if (request.url.includes('i18n') || request.url.includes('JSON') || request.url.includes('.svg')) {
      request = request.clone({
        setHeaders: {
          CSRFToken: this.authService.CSRFToken,
        },
      });
    } else {
      let domain = new URL(request.url);
      let domainName = domain.hostname;

      if (token && domainName != AppConstants.API_END_POINTS_OTHERS.BEEFREE_DOMAIN_NAME) {
        request = request.clone({
          setHeaders: {
            CSRFToken: this.authService.CSRFToken,
          },
        });
      }
    }

    return next.handle(request);
  }
}
