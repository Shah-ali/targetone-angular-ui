import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class LoaderService {
  public loadCount: number = 0;
  loadState: BehaviorSubject<any> = new BehaviorSubject(false);

  ShowLoader() {
    this.loadCount+=1;
    this.loadState.next(true);
  }

  HideLoader() {
    this.loadCount = (this.loadCount ? --this.loadCount : 0);    
    if (!this.loadCount) this.loadState.next(false);
  }
}
