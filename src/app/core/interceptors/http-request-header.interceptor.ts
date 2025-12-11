import { Injectable } from "@angular/core";
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpHeaders
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AppConstants } from "@app/app.constants";

@Injectable()
export class HTTPRequestHeaderInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let headers = request.headers
            .set('Content-Type', AppConstants.HTTP_DATA.HEADERS.APP_JSON_CONTENT_TYPE)
        // .set('Access-Control-Allow-Origin', environment.CORS_URL)
        let updatedRequest;
        if (request.url.includes(AppConstants.API_END_POINTS.SAVE_UPLOAD_PDF)) {
            headers = request.headers;
        }
        updatedRequest = request.clone({ headers, withCredentials: true });
        return next.handle(updatedRequest);
    }
}
