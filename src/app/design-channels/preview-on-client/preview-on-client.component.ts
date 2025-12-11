import { Component, OnInit,Input, Output, TemplateRef } from '@angular/core';
import { BsModalRef,BsModalService } from 'ngx-bootstrap/modal';
import { HttpService } from '@app/core/services/http.service';
import { AppConstants } from '@app/app.constants';
import { SharedataService } from '@app/core/services/sharedata.service';
import { environment } from '@env/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-preview-on-client',
  templateUrl: './preview-on-client.component.html',
  styleUrls: ['./preview-on-client.component.scss']
})
export class PreviewOnClientComponent implements OnInit {
  @Input('dataFromParent') modalRef?: BsModalRef;
  previewClientDataObj:any = [];
  previewClientContent:boolean = true;
  isSpamDescEnable:boolean = false;
  BASE_URL = environment.BASE_URL;
  spamDescObj:any;
  imageObject:Array<object> = [];
  previewSilderImages: boolean = false;
  selectedClientName:string ="";
  device:number = 0;
  previewObjs:any = [];
  testLitmusDetailKey: any;
  constructor(private http: HttpService, private shareService:SharedataService, public bsModalRef: BsModalRef,private modalService:BsModalService, private translate:TranslateService) {
    this.shareService.previewClientJsonObj.subscribe((res:any) => { 
      if(res.testApplications !== undefined){ 
        if(res.testApplications.length > 0){
          var jsonList = res.testApplications;
          var filterJsonDeskTop = res.testApplications.filter(x => x.applicationName.indexOf("IPHONE") == -1 && x.applicationName.indexOf("IPAD") == -1 && x.applicationName.indexOf("ANDROID") == -1 );
          var downloadLinkPath = res.testLitmusDetailKey;
          this.testLitmusDetailKey = downloadLinkPath;
          this.previewClientContent = true;
          this.previewObjs = jsonList;
          this.previewClientDataObj = filterJsonDeskTop;
        } 
      }       
    });
    
      this.shareService.spamTestJsonObj.subscribe((res:any) => {
        if(res.testApplications !== undefined){
          if(res.testApplications.length > 0){
          var jsonList = res.testApplications;
          var downloadLinkPath = res.testLitmusDetailKey;
          this.testLitmusDetailKey = downloadLinkPath;
            this.previewClientContent = false;
            this.previewObjs = jsonList;
            this.previewClientDataObj = jsonList;
          }
      }
    });

      this.previewClientDataObj.forEach( (item) => {
        var obj = {
          image:"http://"+item.fullPageImage,
          thumbImage:"http://"+item.fullPageImage,
          alt: this.translate.instant('designEditor.previewOnClientComponent.altOfImagelbl'),
        }
        this.imageObject.push(obj);
      });

   }
    

  ngOnInit(): void {
  }
  // downloadLinkmenthod(){
  //   window.open('')
  // }
  showPreviewSlider(curtObj){
    this.selectedClientName = curtObj.applicationName;
    this.previewSilderImages = true;
  }
  getSpamDescription(obj){
    this.isSpamDescEnable = true;
    this.spamDescObj = obj.spamHeaders;
    console.log(this.spamDescObj);

  }
  switchPreviewDevice(device){
    this.previewClientContent = true;
    this.previewSilderImages = false;
    if(device === 0){
      // desktop 
      this.device = 0;
      const objDesk = this.previewObjs.filter(x =>  x.applicationName.indexOf("ANDROID") == -1 && x.applicationName.indexOf("IPHONE") == -1 && x.applicationName.indexOf("IPAD") == -1)
      this.previewClientDataObj = objDesk;
	  //'/litmus/downloadReport?litmusTestType=2&testLitmusDetailKey='+window.indexToolsSpamTest.testLitmusDetailKey
    }else{
      // Mobile
      this.device = 1;
      const objMob = this.previewObjs.filter(x =>  x.applicationName.indexOf("ANDROID") != -1 || x.applicationName.indexOf("IPHONE") != -1 || x.applicationName.indexOf("IPAD") != -1)
      this.previewClientDataObj = objMob;
    }
  }
  downloadCallMenthod(type){
    window.open(`${this.BASE_URL}/litmus/downloadReport?litmusTestType=`+type+"&testLitmusDetailKey="+this.testLitmusDetailKey, '_parent');
  }
  onClose(): void {
    if(this.modalRef !== undefined) {
      this.modalRef.hide();
    }
  }
}
