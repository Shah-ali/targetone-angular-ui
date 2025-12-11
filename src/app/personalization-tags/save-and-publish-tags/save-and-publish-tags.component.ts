import { Component, OnInit } from '@angular/core';
import { AppConstants } from '@app/app.constants';
import { HttpService } from '@app/core/services/http.service';
import { SharedataService } from '@app/core/services/sharedata.service';
import BeefreeSDK from '@beefree.io/sdk';
import { Clipboard } from '@angular/cdk/clipboard';
import { DataService } from '@app/core/services/data.service';
@Component({
  selector: 'app-save-and-publish-tags',
  templateUrl: './save-and-publish-tags.component.html',
  styleUrls: ['./save-and-publish-tags.component.scss'],
})
export class SaveAndPublishTagsComponent implements OnInit {
  templateObj: any;
  beeTest = new BeefreeSDK();
  tagkey: any;
  loadTagScript: any;
  isPersonalizeTagMode: boolean = true;
  generatedTagObj: any;
  urlMapArry: any;
  ptagName: any = "";

  constructor(private shareService: SharedataService, private httpService: HttpService,private clipboard: Clipboard,private dataService: DataService) {
    this.shareService.personalizeTagService.next(this.isPersonalizeTagMode);
    this.shareService.setNavigationCodeForPersonalizedTag.next('4');
    this.tagkey = this.dataService.activeContentTagKey;//localStorage.getItem('tagKeyPersonalization');
    this.loadGeneratedTagScripts();
  }

  ngOnInit(): void {}
  reloadBeeEditor(tempObj) {
    this.templateObj = tempObj;
    this.beeTest.load(this.templateObj);
    //this.getBeeConfigSettings(this.templateObj);
    //this.removeLoader();
  }
  saveEmail() {
    //this.shareService.isTemperarySave.next(false);
    //GlobalConstants.actionsPreviewEnable = false;
    this.beeTest.save();
  }
  async getGeneratedTagMethod() {
    let payload = {
      tagKey: this.tagkey,
    };
    // let payload = {tagKey:tagkey}
    let endpoint = AppConstants.API_END_POINTS.GET_FINALIZED_TAGS_API;
    const result = await this.httpService.post(endpoint, payload).toPromise();
    if (result.status == 'SUCCESS') {
      let saveobj = JSON.parse(result.response);
      this.loadTagScript = saveobj;
      console.log(saveobj);
    }
  }
  async loadGeneratedTagScripts(){
    let endpoint = AppConstants.API_END_POINTS.GET_GENERATED_TAG_FINAL_PAGE+"?tagKey="+this.tagkey;
    const result = await this.httpService.post(endpoint).toPromise();
    if (result.status == 'SUCCESS') {
      this.generatedTagObj = result.response;
      this.ptagName = this.generatedTagObj.PTagName;
      this.shareService.pTagNameVal.next(this.generatedTagObj.PTagName);
      this.urlMapArry = this.generatedTagObj.tags;
      //console.log(result.response);
    }
  }
  updatePtagName(ptagName){
    this.shareService.pTagNameVal.next(ptagName);
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
}
