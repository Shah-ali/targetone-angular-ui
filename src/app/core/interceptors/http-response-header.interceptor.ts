import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';


@Injectable()
export class HTTPResponseHeaderInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthenticationService
    ) { }

    intercept(request: HttpRequest<any>,next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap((event: HttpEvent<any>) => {
                //console.log(event);
                if (event instanceof HttpResponse) {
                    const token = event.headers.get('CSRFToken');
                    // console.log("token", token);
                    token && (this.authService.CSRFToken = token!);
                }
            }));
    }

}
