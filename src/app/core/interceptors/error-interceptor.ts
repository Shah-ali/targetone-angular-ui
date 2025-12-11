import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    ERROR_CODE = [401, 500]

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    let errMsg = "";
                    if (this.ERROR_CODE.includes(error.status)) {
                        errMsg = error.error.error;
                    }
                    else if (error.error instanceof HttpErrorResponse) {
                        // errMsg = `Error Code: ${error.status},  Message: ${error.message}`;
                        errMsg = error.message;
                    }
                    else {
                        errMsg = navigator.onLine ? `Error: ${error.message}` : "No Internet Connection";
                    }
                    Swal.fire({
                        imageUrl: "./assets/images/error-cross-icon.png",
                        text: errMsg
                    })
                    return throwError(error);
                })
            )
    }
}
