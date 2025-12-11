import { Component, OnInit } from '@angular/core';
import { SharedataService } from '@app/core/services/sharedata.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-view-tag-personalized',
  templateUrl: './view-tag-personalized.component.html',
  styleUrls: ['./view-tag-personalized.component.scss']
})
export class ViewTagPersonalizedComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef,private shareService:SharedataService) { }
  onClose(): void {
    if(this.bsModalRef !== undefined) {
      this.bsModalRef.hide();
    }
  }
  ngOnInit(): void {
  }

}
