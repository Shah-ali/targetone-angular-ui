// drawer.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DrawerService {
  private drawerOpenSubject = new BehaviorSubject<boolean>(false);
  drawerOpen$ = this.drawerOpenSubject.asObservable();
  private dropdownDataSubject = new BehaviorSubject<any[]>([]);
  dropdownData$ = this.dropdownDataSubject.asObservable();
  private dropdownSelectedDataSubject = new BehaviorSubject<any[]>([]);
  dropdownSelectedData$ = this.dropdownDataSubject.asObservable();
  openDrawer() {
    this.drawerOpenSubject.next(true);
  }

  closeDrawer() {
    this.drawerOpenSubject.next(false);
  }
  setDropdownData(data: string[]) {
    this.dropdownDataSubject.next(data);
  }
  setDropdownSelectedData(data: string[]) {
    this.dropdownSelectedDataSubject.next(data);
  }
}
