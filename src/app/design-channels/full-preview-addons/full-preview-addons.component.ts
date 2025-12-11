
import { Component, OnInit,Input, ViewChild,ElementRef, Output, EventEmitter, NgZone} from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { HttpService } from '@app/core/services/http.service';
import { DataService } from '@app/core/services/data.service';
import { AppConstants } from '@app/app.constants';
import { SharedataService } from '@app/core/services/sharedata.service';
import { BsModalRef,BsModalService } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-full-preview-addons',
  templateUrl: './full-preview-addons.component.html',
  styleUrls: ['./full-preview-addons.component.scss']
})
export class FullPreviewAddonsComponent implements OnInit {
  @ViewChild('htmlSectionApperdAreaForDesign') htmlSectionAppendedElement!: ElementRef;
  @ViewChild('ngxSliderElements') ngxsliderElements!: ElementRef;
  @Output() callBeeInstanceFullPreview = new EventEmitter<any>();
  toogleBtnEnbaled:boolean = false;  
  sliderValue:any;
  maxCountLayout: any;
  sliderOptions:Options = {
     
    }

  bodyElementsArry: any = [];
  tempateBlocksArryJson: any = [];
  templateBlockName:string = '';
  promotionKey: any;
  currentSplitId: any;
  commChannelKey: any;
  tempKey: any;
  fullPreviewJSONObj: any;
  sliderValueArray: any = [];
  beeTemplatePayloadJSON: any;
  isMobileDeviceEnabled: boolean = false;
  completeBlockElemts: any;
  payloadSavingJson:any = {};
  fullPreviewModelPopupEnable:boolean = true;
  rightControls: any;
  beeTemplateKey: any;
  realTimeImageProductsHTML: any = [];
  reduceBlockProductsHtml: any;
  onloadCount: any = 0
  multipleDynamicCount: any = {};
  constructor(
    private shareService: SharedataService,
    private httpService: HttpService,
    public bsModalRef: BsModalRef,
    private dataService: DataService,
    private ngZone: NgZone,
    private translate:TranslateService
  ) {
    this.dataService.$sharedPromoKey.subscribe((result) => {
      this.promotionKey = result;
    });
    this.shareService.currentSelectedChannelObj.subscribe((res: any) => {
      this.currentSplitId = res.currentSplitId;
      this.commChannelKey=res.commChannelKey;
      this.tempKey = res.templateKey;
    });
    this.shareService.beeTemplateSelectedKey.subscribe((res:any) => {
      if( res !== undefined){
        this.beeTemplateKey=res;
      }
    });
    this.shareService.fullPreviewSavedObjFromBee.subscribe((res:any) => {
      if( res !== undefined){
        this.beeTemplatePayloadJSON = res;
      }      
    });
    this.getTemplateFullPreviewMethod();
    // setTimeout(() => {
    //   this.loadTemplateBlocksMethod(this.fullPreviewJSONObj.templateBlocks);
    //   console.log(this.fullPreviewJSONObj.templateBlocks);
    // }, 2000);    
   }

  ngOnInit(): void {
   
  }
  
  getTemplateFullPreviewMethod(){ //"promoKey="+this.promotionKey+"splitKey="+this.currentSplitId+"&tempKey="+this.beeTemplateKey;
    // let url = AppConstants.API_END_POINTS.GET_TEMPLATE_FULL_PREVIEW;
    // this.httpService
    //   .post(url,this.beeTemplatePayloadJSON).subscribe((data) => {
    //     if(data.status === 'SUCCESS'){
    //       this.fullPreviewJSONObj = data.response;  
    //       setTimeout(() => {
    //         this.loadTemplateBlocksMethod(this.fullPreviewJSONObj.templateBlocks);
    //       }, 500);
                  
    //       console.log(data.response);
    //     }
    //   });

    //setTimeout(() => {
              this.loadTemplateBlocksMethod(this.beeTemplatePayloadJSON.templateBlocks);
           // }, 500);
    
  }
  loadTemplateBlocksMethod(templateBlockObj){
    if(templateBlockObj.length > 0){
      //let insertHtmlBlockforJSON = this.htmlSectionAppendedElement.nativeElement;
      //let filterWithDynamicContent = templateBlockObj.filter(x => x.displayType != 'text' && x.maxCount > 1);
      templateBlockObj.forEach((items:any,i) => {
        let obj = {
          name:items.name,
          maxCount:items.maxCount,
          maxVal:items.maxCount,
          supportCondition:items.supportCondition, 
          type:items.type,
          html:"",
          displayType:items.displayType,
          index:i

        }
        this.sliderValueArray.push(items.maxCount);
        this.sliderValue = items.maxCount;
        if(items.displayType === "dynamic-content" && items.maxCount > 1){
          var htmlCombine = [items.layoutHeader,items.oneObjectHtml,items.layoutFooter].join('');
          obj['html'] = htmlCombine;
          // var htmlELEmtRepeatedDivs:any=[];
          // for(let x=0; x < items.maxCount; x++){
          //   htmlELEmtRepeatedDivs.push(htmlCombine);
          // }
          // var outerWrapHTML = "<div class='col p-0 rowSection_"+i+"' style='margin:0 6%;text-align:center;'>"+htmlELEmtRepeatedDivs.join('')+"</div>";
          var outerWrapHTML = "<div class='col p-0 rowSection_"+i+"' style='margin:0 6%;text-align:center;'>"+htmlCombine+"</div>";
          this.completeBlockElemts = outerWrapHTML;
          //obj['html'] = outerWrapHTML;
        }else{
          let htmlBody = items.body;
          let outerWrapHTML = htmlBody;
          obj['html'] = outerWrapHTML;
          this.completeBlockElemts = outerWrapHTML;
        }
        
        // let sliderConfig = {
        //   floor: 1,
        //   showSelectionBar: true,
        //   ceil:  this.sliderValue
        // };
        // this.sliderOptions = sliderConfig;
        //obj['maxCount'] = this.sliderValueArray;
        //this.bodyElementsArry.push(obj['html']);
        this.bodyElementsArry.push(this.completeBlockElemts);
        this.bodyElementsArry = this.bodyElementsArry.filter(x => x);
        this.tempateBlocksArryJson.push(obj);
       // let filterWithDynamicContent = this.tempateBlocksArryJson.filter(x => x.displayType != 'text' && x.maxCount > 1);
       // this.tempateBlocksArryJson = this.tempateBlocksArryJson.filter(x => x);
             
        
        
      });
      //console.log(this.tempateBlocksArryJson);
      this.ngZone.run(() => {
        this.tempateBlocksArryJson = this.tempateBlocksArryJson.filter(x => x);
        let htmlContentForIframe = this.bodyElementsArry.join('');
        setTimeout(() => {
          this.loadHtmlInIframe(htmlContentForIframe);
        }, 500);        

       });
      
      //insertHtmlBlockforJSON.innerHTML = this.bodyElementsArry.join('');
    }
  }
  loadHtmlInIframe(loadIframeContent){
    //this.ngZone.run(() => {
    let ele: any = document.querySelector('#thumbnailContent');
    //let htmlEle = "<div style='overflow:hidden'>"+this.loadThumbnailContent+"</div>";
    
    if(ele !== null){
      ele.contentDocument.head.innerHTML = "";
      ele.contentDocument.head.innerHTML = "<style type='text/css'>@media (max-width: 605px) { .layout-style { width: 100% !important }}<style>";
      ele.contentDocument.body.innerHTML = loadIframeContent;
      const iframeDoc = ele.contentDocument || ele.contentWindow?.document;

      const rowContent = iframeDoc.querySelector('.row-content') as HTMLElement;
      const layoutStyle = iframeDoc.querySelector('.layout-style') as HTMLElement;

      if (rowContent) {
        let templateWidth1 = layoutStyle.style.width;
        let templateWidth2 = rowContent.getAttribute('width');

        let templateMaxWidth1 = layoutStyle.style.maxWidth;
        let templateMaxWidth2 = rowContent.style.maxWidth;
        let layoutMargin = layoutStyle.style.margin;
        let rowMargin = rowContent.style.margin;

        if (templateWidth1) {
          layoutStyle.style.width = templateWidth1 + 'px';
        } else {
          if (templateWidth2) {
            layoutStyle.style.width = templateWidth2 + 'px';
          }
        }

        if (templateMaxWidth1) {
          layoutStyle.style.maxWidth = templateMaxWidth1 + 'px';
        } else {
          if (templateMaxWidth2) {
            layoutStyle.style.maxWidth = templateMaxWidth2 + 'px';
          }
        }
        if (layoutMargin) {
          layoutStyle.style.margin = layoutMargin;
        } else {
          if (rowMargin) {
            layoutStyle.style.margin = rowMargin;
          }
        }
      }
      
    }    
  //});
  }
  onChangeSLiderVal(evt,inx,maxcount){
    if(evt.currentTarget == undefined) {
     this.sliderValue = parseInt(evt);
    } else {
    this.sliderValue = parseInt(evt.currentTarget.getElementsByClassName('ngx-slider-model-value')[0].innerText);
    }
    
    if(this.multipleDynamicCount[inx] !== undefined){
      this.onloadCount++;
    }else{
      this.onloadCount = 0;
    }
    this.multipleDynamicCount[inx] = this.onloadCount++;
    this.repeatHtmlTemplateBlocks(maxcount,inx);
    
   }
   repeatHtmlTemplateBlocks(maxcount,inx){
    let ele: any = document.querySelector('#thumbnailContent');
    if(ele !== null){
      var repeatedELemt =  ele.contentDocument.body.getElementsByClassName('rowSection_'+inx)[0];
      let layoutSelected:any;
      if(repeatedELemt.getElementsByClassName('layoutPR1').length > 0){
        layoutSelected = 'layoutPR1';
      }else if(repeatedELemt.getElementsByClassName('layoutPR2').length > 0){
        layoutSelected = 'layoutPR2';
      }else if(repeatedELemt.getElementsByClassName('layoutPR3').length > 0){
        layoutSelected = 'layoutPR3';
      }else if(repeatedELemt.getElementsByClassName('layoutPR4').length > 0){
        layoutSelected = 'layoutPR4';
      }
      if(repeatedELemt.getElementsByClassName(layoutSelected).length > 0){
        let childDivs =repeatedELemt.getElementsByClassName(layoutSelected)[0];
        if(childDivs.children !== undefined){
          if(this.multipleDynamicCount[inx] === 0){
            this.getrealTimeHtmlFromHtmlCollection(childDivs.children,inx);
          }          
          let innerProducts = childDivs.children;
          let getBackRealTimeProduct:any = localStorage.getItem('onloadRealTimeProducts_'+inx);
          this.realTimeImageProductsHTML = JSON.parse(getBackRealTimeProduct);
          this.reduceBlockProductsHtml = this.realTimeImageProductsHTML;
          let maxProductCount = this.realTimeImageProductsHTML.length;
          this.reduceBlockProductsHtml.splice(maxcount-1,maxProductCount-maxcount);
          childDivs.innerHTML = this.reduceBlockProductsHtml.join('');
        }
      }
      
    }    
    // let onloadHtml = this.tempateBlocksArryJson[inx].html;
    // var htmlArry:any = [];
    // for(let j=0; j < maxcount; j++){
    //   let newHtmlToAdd = onloadHtml;      
    //   htmlArry.push(newHtmlToAdd);
    // }
    // let joinedHtmlArry = htmlArry.join('');
    // ele.contentDocument.body.getElementsByClassName('rowSection_'+inx)[0].innerHTML = "";
    // ele.contentDocument.body.getElementsByClassName('rowSection_'+inx)[0].innerHTML = joinedHtmlArry; 
    this.scrollToTopView(inx); 
   }
   getrealTimeHtmlFromHtmlCollection(childDivs,index){
    let arrayHtml = [...childDivs];
    let pushHtmlData:any = [];let newArry:any;
    arrayHtml.forEach((each,i)=> {
      pushHtmlData.push(each.outerHTML);      
    });
    newArry = JSON.stringify(pushHtmlData);
    localStorage.setItem("onloadRealTimeProducts_"+index,newArry);
    //console.log(newArry);
   }
  closefullPreview(){
    if(this.bsModalRef !== undefined) {
      this.bsModalRef.hide();
    }
  }
  hideTemplateBlockSecton(evt,inx){
    let ele: any = document.querySelector('#thumbnailContent');
    if(evt.target.checked){      
      ele.contentDocument.body.getElementsByClassName('rowSection_'+inx)[0].style.display = 'block';
    }else{
      ele.contentDocument.body.getElementsByClassName('rowSection_'+inx)[0].style.display = 'none';
    }
  }
  swicthDeviceMethod(device){
    if(device === 'desktop'){
      this.isMobileDeviceEnabled = false;
    }else{
      this.isMobileDeviceEnabled = true;
    }
  }
  scrollToTopView(inx){
    let ele: any = document.querySelector('#thumbnailContent');
    if(ele !== null){
      //var repeatedELemt = ele.contentDocument.body.getElementsByClassName('rowSection_'+inx)[0];
      ele.contentDocument.body.getElementsByClassName('rowSection_'+inx)[0].scrollIntoView(0);
      ele.contentDocument.body.getElementsByClassName('rowSection_'+inx)[0].style.border = '1px solid #000';
      setTimeout(() => {
        ele.contentDocument.body.getElementsByClassName('rowSection_'+inx)[0].style.border = 'none';
      }, 3000);

    }    

  }

}
