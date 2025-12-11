import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AppConstants } from '@app/app.constants';
//import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class HTTPInfoInterceptor implements HttpInterceptor {
    STATUS_CODES = [200, 201];
    isTemplateRedirectedMsg = "";
    constructor(
        //private translate: TranslateService
    ) {
        /* this.translate.get("validationMessages").subscribe((res) => {
            this.isTemplateRedirectedMsg = res.isTemplateRedirected;
        }); */
    }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        const updatedRequest = request.clone();

        return next.handle(updatedRequest).pipe(
            tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse && this.STATUS_CODES.includes(event.status) && event.body) {
                    const body = event.body;
                    if (body.status == AppConstants.HTTP_MESSAGE_TYPE.OK && body.isTemplateRedirected) {
                        Swal.fire({
                            imageUrl: "./assets/images/warning-icon.png",
                            text: this.isTemplateRedirectedMsg
                        })
                    }
                    else if (body.status == AppConstants.HTTP_MESSAGE_TYPE.RUNNING) {
                        Swal.fire({
                            imageUrl: "./assets/images/warning-icon.png",
                            text: body.message
                        })
                    }
                }
            }));
    }
}
