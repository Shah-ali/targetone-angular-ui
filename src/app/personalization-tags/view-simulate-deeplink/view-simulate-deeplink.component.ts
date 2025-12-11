import { Clipboard } from '@angular/cdk/clipboard';
import { Component, NgZone, OnInit } from '@angular/core';
import { SharedataService } from '@app/core/services/sharedata.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-view-simulate-deeplink',
  templateUrl: './view-simulate-deeplink.component.html',
  styleUrls: ['./view-simulate-deeplink.component.scss'],
})
export class ViewSimulateDeeplinkComponent implements OnInit {
  overAllDeepLinkObj: any;

  constructor(
    public bsModalRef: BsModalRef,
    private shareService: SharedataService,
    private ngZone: NgZone,
    private clipboard: Clipboard
  ) {
    this.shareService.deepLinkObj.subscribe((res) => {
      if (res !== undefined) {
        this.overAllDeepLinkObj = res;
      }
    });
  }

  ngOnInit(): void {}

  copyToPaste(tooltip, refEl: any) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ refEl });
      this.clipboard.copy(refEl);
      //console.log(refEl);
      setTimeout(() => {
        tooltip.close();
      }, 1000);
    }
  }
  onClose(): void {
    if (this.bsModalRef !== undefined) {
      this.bsModalRef.hide();
      this.shareService.viewSimulateLogPopupClose.next(false);
    }
  }
}
