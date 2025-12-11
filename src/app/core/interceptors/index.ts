import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptor } from '@app/core/interceptors/loader.interceptor';
import { HTTPRequestHeaderInterceptor } from './http-request-header.interceptor';
import { ErrorInterceptor } from '@app/core/interceptors/error-interceptor';
import { CSRFInterceptor } from './csrf-interceptor';
import { HTTPResponseHeaderInterceptor } from './http-response-header.interceptor';
import { HTTPInfoInterceptor } from './http-info-interceptor';

export const HttpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: HTTPRequestHeaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CSRFInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HTTPResponseHeaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HTTPInfoInterceptor, multi: true }
];
