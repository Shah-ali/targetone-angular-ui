import { Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { SharedataService } from '@app/core/services/sharedata.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Clipboard } from '@angular/cdk/clipboard';
@Component({
  selector: 'app-view-simulate-log-console',
  templateUrl: './view-simulate-log-console.component.html',
  styleUrls: ['./view-simulate-log-console.component.scss']
})
export class ViewSimulateLogConsoleComponent implements OnInit {
  @ViewChild('simulateLogConsoleContent') simulateLogConsoleContent!: ElementRef;
  @Output() closePopup = new EventEmitter<any>();
   overAllLogObj:any;
  simulateLogConsoleHmtl: any;
  constructor(public bsModalRef: BsModalRef,private shareService:SharedataService,private ngZone: NgZone,private clipboard: Clipboard) { 
    this.shareService.logConsoleErrorObj.subscribe(res => {
      if(res !== undefined){        
        if(Array.isArray(res)){
          this.overAllLogObj = res; // for Array response
        }else{
          this.overAllLogObj = [res]; // For Object response
        }
      }
    });
  }
  
  ngOnInit(): void {
    setTimeout(() => {
      this.simulateLogConsoleHmtl = this.simulateLogConsoleContent.nativeElement.innerText;
    }, 1000);    
  }
  isArrayObjEnabled(item){
    let isArrayObj = false;
    if(Array.isArray(item.value)){
      isArrayObj = true;
    }
    return isArrayObj;
  }
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
    if(this.bsModalRef !== undefined) {
      this.bsModalRef.hide();    
      this.shareService.viewSimulateLogPopupClose.next(false);  
    }
    
  }
  
  
}
