import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import Swal from 'sweetalert2';
import { HttpService } from './http.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private isSetSessionStorage = false;
  private userDetails = new BehaviorSubject<User>({} as User);
  public $userDetails = this.userDetails.asObservable();

  private sharedPromoKey = new BehaviorSubject<any>({});
  public $sharedPromoKey = this.sharedPromoKey.asObservable();

  private sharedTenantKey = new BehaviorSubject<any>({});
  public $sharedTenantKey = this.sharedTenantKey.asObservable();

  private lastSavedStep = new BehaviorSubject<any>({});
  public $lastSavedStep = this.lastSavedStep.asObservable();

  private runningPromotion = new BehaviorSubject<any>({});
  public $runningPromotion = this.runningPromotion.asObservable();
  public pTagKeySelected = new BehaviorSubject<any>([]);
  private _selectedTagId: number | null = null;
   private selectedTag: any = null;
  PtagListDasboardEnabled = new BehaviorSubject<any>(undefined);
  PtagGraphDasboardEnabled = new BehaviorSubject<any>(undefined);
  PtagSummarisedDasboardEnabled = new BehaviorSubject<any>(undefined);
  prodRecoSelectedModelObj = new BehaviorSubject<any>(undefined);
  ptagActveDataObj = new BehaviorSubject<object>({});
  pTagTabStatusFlag = new BehaviorSubject<any>(undefined);
  activeContentTagKey:any;
  activeContentPtagName: any = null;
  SimulationState: any = '';
  constructor(private httpService: HttpService, private translate: TranslateService) {}

  set userDetailsData(user: User) {
    this.userDetails.next(user);
  }

  set setSharedPromoKey(promoKey: any) {
    this.sharedPromoKey.next(promoKey);
  }

  set setSharedTenantKey(tKey: any) {
    this.sharedTenantKey.next(tKey);
  }
  set setSharedActiveContentTagKey(tKey: any) {
    //this.activeContentTagKey.next(tKey);
    this.activeContentTagKey = tKey;
  }
  set setSharedActiveContentName(pTagName: any) {
    this.activeContentPtagName = pTagName;
  }
  setSessionStorage(key: string, data: any) {
    this.isSetSessionStorage && sessionStorage.setItem(key, JSON.stringify(data));
  }
  ptagTabStatusCheckMethod(isStatus: number){
    this.pTagTabStatusFlag.next(isStatus);
  }
  getSessionStorage(key: string) {
    return sessionStorage.getItem(key);
  }

  SwalSuccessMsg(msg: string) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: msg,
      showConfirmButton: false,
      timer: 2500,
    });
  }

  SwalValidationMsg(msg: string) {
    // for validating user inputs
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: msg,
      showConfirmButton: true,
      confirmButtonText: this.translate.instant('designEditor.okBtn'),
      //cancelButtonText: this.translate.instant('designEditor.cancelBtn'),
      timer: 5000,
    });
  }
  SwalAlertMgs(msg: string) {
    Swal.fire({
      title: msg,
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: true,
      confirmButtonText: this.translate.instant('designEditor.okBtn'),
    });
  }
  SwalAlertSuccesOrFailMgs(msg: string,icon) {
    Swal.fire({
      position: 'center',
      icon: icon,
      title: msg,
      width: "auto",
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: true,
      confirmButtonText: this.translate.instant('designEditor.okBtn'),
    });
  }
  
  SwalDialogMsgWithHttp(msg: string, httpUrl: string) {
    // for Dialog user inputs
    Swal.fire({
      title: this.translate.instant('dataServicesTs.areYouSureAlertMsgLbl'),
      text: this.translate.instant('dataServicesTs.youwontAbleRevertThisAlertMsgLbl'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.translate.instant('dataServicesTs.yesDeleteItAlertMsgLbl'),
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpService.post('/triggerPromo/editPromo').subscribe((data) => {
          Swal.fire(
            this.translate.instant('dataServicesTs.deletedAlertMsgLbl'),
            this.translate.instant('dataServicesTs.yourImaginaryfileHasBeenDeletedAlertMsgLbl'),
            'success'
          );
        });

        /* $timeout(function(){
          swal("Deleted!", "Your imaginary file has been deleted.", "success");
        },2000); */
      }
    });
  }

  SwalDialogConfirmAndRedirect(msg: string, url: string) {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: msg,
      showConfirmButton: true,
      confirmButtonText: this.translate.instant('designEditor.okBtn'),
      // cancelButtonText: this.translate.instant('designEditor.cancelBtn'),
      timer: 3000,
    }).then((result) => {
      if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
        window.open(url, '_parent');
      }
    });
  }

  
  setPtagDashboard(pageName: boolean){
    this.PtagListDasboardEnabled.next(pageName);
  }
  setPtagGraphPerformanceDashboard(pageName: boolean){
    this.PtagGraphDasboardEnabled.next(pageName);
  }
  setPtagSummarisedPerformanceDashboard(pageName: boolean){
    this.PtagSummarisedDasboardEnabled.next(pageName);
  }
  set setLastSavedStep(lastSavedStep: any) {
    this.lastSavedStep.next(lastSavedStep);
  }

  set setRunningPromotion(runningPromotion: any) {
    this.runningPromotion.next(runningPromotion);
  }

  getActivePtagDataObj(dtActive: object){
    this.ptagActveDataObj.next(dtActive);
  }

   setSelectedTagId(tagId: number): void {
    this._selectedTagId = tagId;
  }

  getSelectedTagId(): number | null {
    return this._selectedTagId;
  }

  setTag(tag: any): void {
    this.selectedTag = tag;
  }

  getTag(): any {
    return this.selectedTag;
  }

  
  setSimulationState(SimulationState:any):void{
    this.SimulationState = SimulationState;
  }
  
  getSimulationState():any{
    return this.SimulationState;
  }

  private dataActiveContent = new BehaviorSubject<any>({});
  data$ = this.dataActiveContent.asObservable();

  callInsertData(message: string, tab: string, fromState): void {
    this.dataActiveContent.next({message, tab, fromState});
  }
  formatToneWidgetText(inputText:any) {
    return inputText.replaceAll('&lt;tonewidget&gt;', '<tonewidget>').
    replaceAll('&lt;/tonewidget&gt;', '</tonewidget>').replaceAll(/<[\/]{0,1}(div)[^><]*>/g,' ').replaceAll(/\<p>/gi, '')
    .replaceAll(/(?:&nbsp;)/g,' ').replaceAll(/\<\/p>/gi, '')
    .replace(/<tonewidget>([\s\S]*?)<\/tonewidget>/g, (match: string, innerContent: string): string => {
      const transformed = innerContent
        .replace(/[\r\n]+/g, ' ')     // remove newlines
        .replace(/\s{2,}/g, ' ')      // collapse multiple spaces into one
        .trim()                      // remove leading/trailing spaces inside 
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/&amp;/g, '&');
      return `<tonewidget>${transformed}</tonewidget>`;
    });
  }
  checkNullUndefinedEmpty(value: any) {
    return (value === null || value === undefined || value === 'undefined' || value === 'null')? "": value;
  }
}
