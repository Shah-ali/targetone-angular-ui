import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AppConstants } from '@app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class PersonalizedTagPerformanceService {

  private dataUrl = '/assets/pTagDash_JSON/data/personalized-dashboard.json';
  private compaignDataUrl = '/assets/pTagDash_JSON/data/compaigns.json'
  private performanceDashboardStatsUrl = '/assets/pTagDash_JSON/data/performamnce-dashboard.json';
  pTagDashboardAPI = AppConstants.PTAG_DASHBOARD.GET_PTAG_DASHBOARD_API;
  pTagPerformanceAPI = AppConstants.PTAG_DASHBOARD.GET_TAG_PERFORMANCE_DATA_API;
  pTagEnableDisableAPI = AppConstants.PTAG_DASHBOARD.GET_PTAG_ENABLE_DISABLE_API;
  constructor(private httpService: HttpService,private http:HttpClient) {}

  getTags(status: string): any {
    
    switch (status) {
      case AppConstants.TAB_LABELS.active:
        return this.httpService.get(this.pTagDashboardAPI+'type=active');
      case AppConstants.TAB_LABELS.inactive:
        //inactiveJson.response;
        return this.httpService.get(this.pTagDashboardAPI+'type=inactive');
      case AppConstants.TAB_LABELS.draft:
        //draftJson.response;
        return this.httpService.get(this.pTagDashboardAPI+'type=draft');
      case AppConstants.TAB_LABELS.favourite:
        //draftJson.response;
        return this.httpService.get(this.pTagDashboardAPI+'type=favourite');
      case AppConstants.TAB_LABELS.qaTest:
        //draftJson.response;
        return this.httpService.get(this.pTagDashboardAPI+'type=publishToQA');
      default:
        return throwError(`Invalid status: ${status}`);
    }
    //http://localhost:8080/targetone/pTagDashboard/loadAllPTags?type=active
  }
  
  getGrapghData(tagId,startDate,endDate,selectedCompaigns): Observable<any> {
    //const graphData = `${this.apiEndpoint}//targetone/pTagDashboard/loadPTagPerformance?startDate=2023-10-01&endDate=2023-12-31&tagId=11`;
    // console.log("tgid",tagId);
    // console.log("startDate",startDate);
    // console.log("endDate",endDate);
    
    if (selectedCompaigns && selectedCompaigns.length>0)
    return this.httpService.get(this.pTagPerformanceAPI+'startDate='+startDate+'&endDate='+endDate+'&tagId='+tagId+'&campaigns='+selectedCompaigns);
  else
    return this.httpService.get(this.pTagPerformanceAPI+'startDate='+startDate+'&endDate='+endDate+'&tagId='+tagId);
  }
  getAllTagPerformanceData (startDate,endDate,selectedCompaigns,daysDifference?){
    let url:any = "";
    if (selectedCompaigns && selectedCompaigns.length>0){
      if(daysDifference > AppConstants.CONSTANT_VALUES.CUSTOME_DATE_RANGE_LIMIT){ // beyond 90 days show extdata with single tag performance
        url = this.pTagPerformanceAPI+'startDate='+startDate+'&endDate='+endDate+'&campaigns='+selectedCompaigns+'&extData=true'
      }else{
        url = this.pTagPerformanceAPI+'startDate='+startDate+'&endDate='+endDate+'&campaigns='+selectedCompaigns
      }      
    }
    
  else{
    if(daysDifference > AppConstants.CONSTANT_VALUES.CUSTOME_DATE_RANGE_LIMIT){ // beyond 90 days show extdata with single tag performance
      url = this.pTagPerformanceAPI+'startDate='+startDate+'&endDate='+endDate+'&extData=true'
    }else{
      url = this.pTagPerformanceAPI+'startDate='+startDate+'&endDate='+endDate
    }
    
  } 
  return this.httpService.get(url);  
    
  //     sample local url (without : campaigns) :
  // http://localhost:8080/targetone/pTagDashboard/loadPTagPerformance?startDate=2023-10-01&endDate=2023-12-31
  // response : PFA (all_tags_performance.json)

  // sample local url (with : campaigns) :
  // http://localhost:8080/targetone/pTagDashboard/loadPTagPerformance?startDate=2023-10-01&endDate=2023-10-31&campaigns=campaign124,campaign123,campaign10
  }
  getAllCompaigns(): Observable<any> {
    return this.http.get(this.compaignDataUrl);
  }
  getOpenStats(tagId: number): Observable<any> {
    return this.http.get(this.performanceDashboardStatsUrl);
  }
  getActiveTags(): Observable<any> {
    const activeUrl = `${this.pTagDashboardAPI}type=active`;
    return this.httpService.get(activeUrl);
  }

  getDraftTags(): Observable<any> {
    const draftUrl = `${this.pTagDashboardAPI}type=draft`;
    return this.httpService.get(draftUrl);
  }

  getInactiveTags(): Observable<any> {
    const inactiveUrl = `${this.pTagDashboardAPI}type=inactive`;
    return this.httpService.get(inactiveUrl);
  }
  deleteTag(tagId: number): Observable<any> {
    const deleteUrl = '/personalizationTags/delete'; //`${this.pTagDashboardAPI}/tags/${tagId}`;
    let bodyParms = {
      "tagId":  tagId
  }
    return this.httpService.post(deleteUrl,bodyParms);
  }

  activateTag(tagId: number): Observable<any> {
    const activateUrl = `${this.pTagEnableDisableAPI}tagKey=${tagId}&stateControl=true`;
    return this.httpService.post(activateUrl, {});
  }

  deactivateTag(tagId: number): Observable<any> {
    const deactivateUrl = `${this.pTagEnableDisableAPI}tagKey=${tagId}&stateControl=false`;
    return this.httpService.post(deactivateUrl, {});
  }

  favTag(tagId: number, favourite: string): Observable<any> {
    let status = (favourite === "0") ? 1 : 0;
    const favUrl = AppConstants.API_PERSONSOALIZATION_TAGS_END_POINTS.PERSONALIZATION_FAV_TAGS+`?tagKey=${tagId}&status=${status}`;
    return this.httpService.post(favUrl, {});
  }
  
}


