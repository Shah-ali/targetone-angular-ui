// drawer.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GraphService {

  private openGraphSubject = new BehaviorSubject<any[]>([]);
  openGraphData$ = this.openGraphSubject.asObservable();

  private openGraphMutliSeriesSubject = new BehaviorSubject<any[]>([]);
  openGraphMultiSeriesData$ = this.openGraphMutliSeriesSubject.asObservable();

  private trendGraphSubject = new BehaviorSubject<any[]>([]);
  trendGrahData$ = this.trendGraphSubject.asObservable();

  private topLocationSubject = new BehaviorSubject<any[]>([]);
  topLocationData$ = this.topLocationSubject.asObservable();

  private allTagPerformanceSubject = new BehaviorSubject<any[]>([]);
  allTagPerformaanceData$ = this.allTagPerformanceSubject.asObservable();


  setOpenGraphData(data: string[]) {
    this.openGraphSubject.next(data);
  }
  setTrendGraphData(data: string[]) {
    this.trendGraphSubject.next(data);
  }
  setTopLocationGraphData(data: string[]) {
    this.topLocationSubject.next(data);
  }
  setOpenGraphMultiSeriesData(data: string[]) {
    this.openGraphMutliSeriesSubject.next(data);
  }
  setAllTagPerformanceData(data: any) {
    this.allTagPerformanceSubject.next(data);
  }
}
