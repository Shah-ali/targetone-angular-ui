import { Component, OnInit, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SharedataService } from '@app/core/services/sharedata.service';
import { HttpService } from '@app/core/services/http.service';
import { DataService } from '@app/core/services/data.service';
import { AppConstants } from '@app/app.constants';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-attach-email',
  templateUrl: './attach-email.component.html',
  styleUrls: ['./attach-email.component.scss']
})
export class AttachEmailComponent implements OnInit {
  @Input('dataFromParent') modalRef?: BsModalRef;
  fileSelected:any;
  filePath: string = '';
  showLoader: boolean = false;
  promotionKey: number = 0;
  channelKey:any;
  successMsg: string = '';
  fileDeleted: string = '';
  attachedFileName: string = '';
  currentSplitId: any;
  promoSplitKey: number = 0;

  constructor(private modalService: BsModalService, 
    private shareService: SharedataService,
    private httpService: HttpService,
    private dataService: DataService, private translate:TranslateService) {}

  closeAttachment(): void {
    if(this.modalRef !== undefined) {
      this.modalRef.hide();
    }
  }

  // update file name in the input
  changeFileName(e:any): void {
    let fileName = e.target.files[0].name;
    e.target.nextSibling.classList.add('selected');
    e.target.nextSibling.innerHTML = fileName;
    this.fileSelected = e.target.files[0];
    this.successMsg = '';
    this.fileDeleted = '';
    this.attachedFileName = '';
  }

  // Attach File
  attachFile(): void {
    if(this.fileSelected === undefined) {
      this.dataService.SwalValidationMsg(this.translate.instant('designEditor.attachmentComponent.pleaseSelectPDFfileToAttachlbl'));
      return;
    }

    let str = this.fileSelected.name.split('.').pop().toLowerCase(); //.pdf validation
    if(!(str === 'pdf' || str === 'docx' || str === 'txt')) {
      this.dataService.SwalValidationMsg(this.translate.instant('designEditor.attachmentComponent.pleaseChoosePdfDocxTxtFilelbl'));
      return;
    }

    this.showLoader = true;
    let formData : FormData = new FormData();
      formData.append('file', this.fileSelected);
      formData.append('promotionKeyVal', this.promotionKey.toString());
      formData.append('commChannelKey', this.channelKey);
       formData.append('promoSplitId', this.currentSplitId);

    this.httpService.post(AppConstants.API_END_POINTS.SAVE_UPLOAD_PDF, formData).subscribe((data) => {
      this.showLoader = false;
      this.successMsg = data.message;
    });
    this.showLoader = false;
  }

  // delete file
  deleteFile(): void {
    let body = {
      'promoKey': this.promotionKey,
      'commChannelKey': this.channelKey,
      'promoSplitId': this.currentSplitId
    }
    this.httpService.post(AppConstants.API_END_POINTS.DELETE_UPLOAD_PDF, body).subscribe((data) => {
      this.attachedFileName = '';
      this.fileDeleted = data.message;
    });
  }

  getSavedFiles(): void {
    let url = AppConstants.API_END_POINTS.GET_SAVED_USAGE_TEMPLATES + `?promoKey=${this.promotionKey}`;
    this.httpService.post(url).subscribe((data) => {
      this.showLoader = false;
      for(let obj  of data.response.attachment){
	      if(obj.promoSplitId == this.currentSplitId){
		     this.attachedFileName = obj.fileName;
	      }
      }
    });
  }

  ngOnInit(): void {
    this.showLoader = true;
    this.loadCurrentObj();
		this.shareService.channelObj.subscribe((res: any) => {
      if(Object.keys(res).length > 0){
        const currtObj = res.find(x => x.promoSplitId == this.currentSplitId);
        this.promotionKey = currtObj.promotionKey;
        this.channelKey = currtObj.commChannelKey;
      }      
		});
		if (this.promotionKey !== 0) {
			setTimeout(() => {
				this.getSavedFiles();
			}, 0);
		}
  this.showLoader = false;
  }
  loadCurrentObj(){
    this.shareService.currentSelectedChannelObj.subscribe((res:any) => {
      this.currentSplitId = res.currentSplitId;
    });
  }
}
