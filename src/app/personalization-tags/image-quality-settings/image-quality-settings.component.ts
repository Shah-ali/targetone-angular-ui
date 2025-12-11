import { Component, OnInit } from '@angular/core';
import { DataService } from '@app/core/services/data.service';
import { SharedataService } from '@app/core/services/sharedata.service';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-image-quality-settings',
  templateUrl: './image-quality-settings.component.html',
  styleUrls: ['./image-quality-settings.component.scss']
})
export class ImageQualitySettingsComponent implements OnInit {
  imageTypeObj:any = {};
  imageTypeSelectedValue: any = 'JPG'; // default value
  imageQualitySelectedValue: any = '80'; // default value
  imageSettingsObj: any = {'imageType':'JPG','imageQuality':'80'}; 
  readyonlydepthEnable: boolean = false;
  imageQualityMinimumValue:any = '80';
  imageQualityMaximumValue:any = '100';
  constructor(public bsModalRef: BsModalRef,private shareService:SharedataService, private dataService: DataService,private translate: TranslateService,) { 
    this.shareService.getImageQualitySettingsObj.subscribe((res) => {
      if(res !== undefined){
        this.imageSettingsObj = res;        
        this.selectImageTypeMethod(res,false);
        // setTimeout(() => {          
        //   this.imageSettingsObj = res;
        // }, 500);
      }
    })
    this.imageTypeObj = [
      {
        imageTypeOptions:[
          {id:0,label:'JPG',minVal:'80',maxVal:'100',value:'JPG'},
          {id:1,label:'PNG',minVal:'100',maxVal:'100',value:'PNG'}
        ],
      }
      
    ];
  }
  imageQualityValUpdateMethod(evt){
    if(evt.target.value < 80 || evt.target.value > 100){
      this.imageSettingsObj.imageQuality = '80';
      this.dataService.SwalAlertSuccesOrFailMgs(this.translate.instant('designEditor.displayConditions.imageMinimumMaximumValueLbl'),'warning');
      return;
    }else{
      this.imageSettingsObj.imageQuality = evt.target.value;
    }    
  }

  ngOnInit(): void {

  }
  saveImageQaulityObjMethod(){
    let obj = {
      'imageType':this.imageSettingsObj.imageType,
      'imageQuality':this.imageSettingsObj.imageQuality
    }
    this.shareService.getImageQualitySettingsObj.next(obj);
    this.onClose();
  }
  onClose() {
    if(this.bsModalRef !== undefined) {
      this.bsModalRef.hide();
    }
  }
  selectImageTypeMethod(evt,isReset){
    let type:any;
    let imageObj:any;
    if(evt.target !== undefined){
      type = evt.target.value; // accessing from event
      imageObj = type;
    }else{
      type = evt; // giving direct value
      imageObj = type.imageType;
      if(imageObj == 'PNG'){
        this.readyonlydepthEnable = true;
      }
    }
    if(imageObj === 'PNG'){
      this.imageSettingsObj.imageQuality = '100';
      this.readyonlydepthEnable = true;
    }else{       
      if(isReset){
        this.imageSettingsObj.imageQuality = '80';
      }
      this.readyonlydepthEnable = false;
    }
    this.imageTypeSelectedValue = type; // set the value
  }
  blockEntering(evt){
    evt.preventDefault();
  }
}
