import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpBackend } from '@angular/common/http';
import { AppConstants } from '@app/app.constants';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import { SharedataService } from './sharedata.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private BASE_URL = environment.BASE_URL;
  private STATIC_JSON_URL = environment.STATIC_JSON_URL;
  private httpBee: HttpClient;
  companyKey: any = '1';
  constructor(private http: HttpClient, private httpBackend: HttpBackend, private shareService: SharedataService) {
    this.httpBee = new HttpClient(httpBackend);
    // this.shareService.tenentKeyAsCompanyKey.subscribe(key => {
    //   this.companyKey = key;
    // });
  }

  private formatErrors(error: any) {
    return throwError(error.error);
  }

  getBee(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${path}`, { params, observe: 'response' }).pipe(catchError(this.formatErrors));
  }

  getFragmentSimulate(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${path}`, { params, observe: 'response' }).pipe(catchError(this.formatErrors));
  }

  getHtmlSimulate(path: string,params:HttpParams = new HttpParams()): Observable<any>{
    // will not accept responseType: 'text' -> would not compile
    return this.http.get(`${path}`, {params,observe: 'response',responseType: 'text'})
    .pipe(catchError(this.formatErrors))
  }
  
  get1(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${this.STATIC_JSON_URL}${path}`, { params, observe: 'response' }).pipe(catchError(this.formatErrors));
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http
      .get(`${this.BASE_URL}${path}`, { params, observe: 'response', headers: { 'TENANT-IDENTIFIER': '1' } })
      .pipe(catchError(this.formatErrors));
  }

  post(path: string, body: object = {}): Observable<any> {
    return this.http.post(`${this.BASE_URL}${path}`, body).pipe(catchError(this.formatErrors));
  }
  BeePost(path: string, body: object = {}, withCredentials?: boolean): Observable<any> {
    return this.httpBee.post(`${path}`, body, { withCredentials: false }).pipe(catchError(this.formatErrors));
  }

  getTextResponse(path: string,params:HttpParams = new HttpParams()): Observable<any>{
    // will not accept responseType: 'text' -> would not compile
    return this.http.get(`${this.BASE_URL}${path}`, {params,observe: 'response',responseType: 'text'})
    .pipe(catchError(this.formatErrors))
  }
  getFullPath(path: string,params:HttpParams = new HttpParams()): Observable<any>{
    // will not accept responseType: 'text' -> would not compile
    return this.http.get(`${path}`, {params,observe: 'response'})
    .pipe(catchError(this.formatErrors))
  }
  /* getFile(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    // return this.http.get(`${this.BASE_URL}${path}`, { params, responseType: 'blob' })
    return this.http.get(`${this.BASE_URL}${path}`, { params, responseType: 'arraybuffer' })
      .pipe(catchError(this.formatErrors));
  }

  put(path: string, body: object = {}): Observable<any> {
    return this.http.put(`${this.BASE_URL}${path}`, JSON.stringify(body), { observe: 'response' })
      .pipe(catchError(this.formatErrors));
  }*/

  delete(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.delete(`${this.BASE_URL}${path}`, { params }).pipe(catchError(this.formatErrors));
  }
}
