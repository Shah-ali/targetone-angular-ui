import { Component, OnInit } from '@angular/core';
import { SharedataService } from '@app/core/services/sharedata.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-cache-control',
  templateUrl: './cache-control.component.html',
  styleUrls: ['./cache-control.component.scss']
})
export class CacheControlComponent implements OnInit {
  hrsCacheVal:any = "0";
  constructor(public bsModalRef: BsModalRef,private shareService:SharedataService) {
    this.shareService.getCacheControlHrsVal.subscribe((res) => {
      if(res !== ""){
        this.hrsCacheVal = res;
      }
    });
   }

  ngOnInit(): void {
  }
  onClose(): void {
    if(this.bsModalRef !== undefined) {
      this.bsModalRef.hide();
    }
  }
  getCacheControlHrs(){
    this.shareService.getCacheControlHrsVal.next(this.hrsCacheVal);
    this.onClose();
  }
}
