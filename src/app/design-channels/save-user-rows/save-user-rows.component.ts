import { HttpService } from '@app/core/services/http.service';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import { GlobalConstants } from '../common/globalConstants';
@Component({
  selector: 'app-save-user-rows',
  templateUrl: './save-user-rows.component.html',
  styleUrls: ['./save-user-rows.component.scss']
})

export class SaveUserRowsComponent implements OnInit {
  name: string = "";  
    @Output() nameEmitter = new EventEmitter < string > ();  
    
  @Output() onAdd = new EventEmitter<any>();
  savedRowName: string = "";
  constructor(private http: HttpService,private bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }
  getSaveRows(_evt){
    const sObj: any = GlobalConstants.saveRowsObj;
    sObj.name = this.savedRowName;
    this.PostData(this.savedRowName);
    if(Object.keys(sObj).length != 0){
      GlobalConstants.resolveFlag = true;
    }else{
      GlobalConstants.resolveFlag = false;
  
    }    
    this.onClose();
    this.onAdd.emit(sObj);
  }
  PostData(getName) {  
      this.nameEmitter.emit(getName);  
 }
  onClose() {
    this.bsModalRef.hide();
    let sObj = GlobalConstants.saveRowsObj
    this.onAdd.emit(sObj);
  }
}
