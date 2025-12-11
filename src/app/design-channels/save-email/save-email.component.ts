import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import { GlobalConstants } from '../common/globalConstants';
@Component({
  selector: 'app-save-email',
  templateUrl: './save-email.component.html',
  styleUrls: ['./save-email.component.scss']
})
export class SaveEmailComponent implements OnInit {
  [x: string]: any;
  @Output() saveMethod = new EventEmitter();
savedName: string = "";
  constructor(private bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }
  getsavemethod(){
    this.saveMethod.emit(this.savedName); 
    //console.log('onSave', jsonFile, htmlFile);
    if(this.savedName == ""){
      GlobalConstants.resolveFlag = false;      
    }else{
      GlobalConstants.resolveFlag = true;
    }
    this.onClose();
  }
  onClose() {
    this.bsModalRef.hide();
  }

}// End
