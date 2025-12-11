import { ChangeDetectorRef, Component } from "@angular/core";
import { LoaderService } from "@app/core/services/loader.service";
@Component({
  selector: "app-loader",
  templateUrl: "./loader.component.html",
	styleUrls: ["./loader.component.scss"],
  // template: `
  // <div *ngIf="show" class="loaderMask">
  //   <div class="spinner-border text-dark" role="status">
  //       <span class="visually-hidden d-none">Loading...</span>
  //     </div>
  // </div>    
  // `,
  // styles: [
  //   ".loaderMask{position: absolute; height: 100%; width: 100%; z-index: 1; background-color: rgb(238, 238, 238);display: flex; align-items: center; justify-content: center; font-size: 24px;opacity:50%}"
  // ]
})
export class LoaderComponent {
  show: boolean = false;
  constructor(private _loaderService: LoaderService, private cd:ChangeDetectorRef) {}

  ngOnInit() {
    this._loaderService.loadState.subscribe(res => {
      this.show = res;
      this.cd.detectChanges();
    });
  }
}
