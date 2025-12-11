import { Component, OnInit, ViewChild, ElementRef, NgZone, HostListener, Output, Input } from '@angular/core';
import { AppConstants } from '@app/app.constants';
import { HttpService } from '@app/core/services/http.service';
import { SharedataService } from '@app/core/services/sharedata.service';
import { TranslateService } from '@ngx-translate/core';
import BeefreeSDK from '@beefree.io/sdk';
import { Clipboard } from '@angular/cdk/clipboard';
import Swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from '@env/environment';
import { ViewSimulateLogConsoleComponent } from '../view-simulate-log-console/view-simulate-log-console.component';
import lodash from 'lodash';
import { ViewSimulateDeeplinkComponent } from '../view-simulate-deeplink/view-simulate-deeplink.component';
import { DataService } from '@app/core/services/data.service';
import { GlobalConstants } from '@app/design-channels/common/globalConstants';
import { UrlSanitizerService } from '@app/core/services/url-sanitizer.service';
@Component({
  selector: 'app-simulate-tag-paramters',
  templateUrl: './simulate-tag-paramters.component.html',
  styleUrls: ['./simulate-tag-paramters.component.scss'],
})
export class SimulateTagParamtersComponent implements OnInit {
  @ViewChild('simulateImageWidthHeight') simulateImageWidthHeight: ElementRef | undefined;
  @ViewChild('fragmentIframeElement') fragmentIframeElement!: ElementRef;
  @ViewChild('deepIframeElement') deepIframeElement!: ElementRef;
  @ViewChild('htmlTagIframeContent') htmlTagIframeContent!: ElementRef;
  simulatePageEnabled: boolean = true;
  templateObj: any;
  beeTest = new BeefreeSDK();
  reteriveTagParams: any;
  tagSimulateURL: any;
  fragmentTagSimulateURL: any;
  deepTagSimulateData: any;
  deepTagPublishedData: any;
  strURLVal: any = [];
  isMobileDeviceEnabled: boolean = false;
  isPersonalizeTagMode: boolean = true;
  tagkey: any;
  saveTagRetriveObj: any;
  customSettings: boolean = false;
  simulateImgPath: any = '';
  concactStrArry: any;
  showUrlPath: any;
  tabActive: any = 0;
  fragmentsContentIframe: boolean = false;
  deviceWidthNHeight: any = { w: 600, h: 800 };
  showLoader: boolean = false;
  fragmentHtmlContentToIframe: any = '';
  baseUrl: any = environment.BASE_URL;
  CLOUD_FRONT_URL: any = environment.CLOUD_FRONT_URL;
  basePTagUrl: any = environment.BASE_PTAGS_URL;
  defaultLang: any = AppConstants.DEFAULT_LANGUAGE;
  popFragmentPreviewEnabled: boolean = false;
  fragmentPreviewHtml: any = '';
  iframeContentLoaded: any;
  deeplinkContentLoaded: any;
  previewActive: number = 0;
  logConsoleEnable: boolean = false;
  previewControlEnabled: boolean = true;
  simulateConsoleLogDetails: any = '';
  modalRef: BsModalRef<unknown> | undefined;
  isConsoleLogPresent: boolean = false;
  viewSimulatePopupEnable: boolean = false;
  rowDetailsObj: any = [];
  requestObj: any;
  requestparamsObj: any;
  requestIdObj: any;
  responseObj: any;
  serverObj: any;
  overAllLogObj!: { request: any; requestParams: any; requestId: any; response: any; rowDetails: any; server: any };
  fragmentIframeEvent: any;
  htmlTagViewContent: boolean = false;
  landingTagViewContent: boolean = false;
  landingPageEnabled: boolean = false;
  getTagHashId: unknown;
  htmlFullTagUrlAPI: any;
  htmlFullTagUrlAPIForLanding: any;
  fullTagImageContent: boolean = false;
  deepLinkContent: boolean = false;
  isHtmlTagContentPresent: any;
  fragmentTagCode: any;
  pTagObjDetails: any = {};
  fragmentDeepLinkDownload: any;
  ptagSimulateUrlBasePath: any;
  fragmentHtmlContentForDownload: any;
  htmlTagUrlForSimulate: any;
  ensembleAiEnabled:boolean = GlobalConstants.ensembleAiEnabled;
  isPublishedPersonalization: any = false;
  isSavedAsQA: boolean = false;
  isMobileView: boolean = false;
  
  constructor(
    private shareService: SharedataService,
    private HttpService: HttpService,
    private translate: TranslateService,
    public bsModalRef: BsModalRef,
    private ngZone: NgZone,
    private clipboard: Clipboard,
    private modalService: BsModalService,
    private dataService: DataService,
    private urlSanitizer: UrlSanitizerService
  ) {
    this.shareService.personalizeTagService.next(this.isPersonalizeTagMode);
    this.shareService.setNavigationCodeForPersonalizedTag.next('3');
    this.shareService.viewSimulateLogPopupClose.subscribe((res) => {
      if (res !== undefined) {
        this.viewSimulatePopupEnable = res;
      }
    });

    this.shareService.activeContentPtagNameObj.subscribe((res) => {
      if(res !== undefined){
        this.pTagObjDetails = res;
      }
    });

    this.shareService.isPublishEnabledForPersonalization.subscribe((res) => {
      if (res !== undefined) {
        this.isPublishedPersonalization = res;
      }
    });

    this.shareService.onSavedTypePersonalization.subscribe((res) => {
      if(res == 'QA'){
        this.isSavedAsQA = true; 
      }
    });
    
    // let simulateUrl = localStorage.getItem('simulate-urlPath');
    // console.log(simulateUrl);
    this.getTagKeyMethod();
    // this.shareService.getTagParamsToSimulate.subscribe((res:any) => {
    //   if(res !== undefined){
    //     let obj:any = [];
    //     this.reteriveTagParams = this.saveTagRetriveObj;
    //     this.reteriveTagParams.forEach((item:any,i) => {
    //      // obj[item.key] = item.value;
    //      let str = item.key+"=&";
    //      obj.push(str);

    //     });
    //     this.strURLVal = obj;
    //     this.tagSimulateURL = "https://imageserver.rcdp-us.algonomy.com/JHJKLJKLHJKJK/r1234.png?"+this.strURLVal.join('');
    //   }
    // })
    
  }
  @HostListener('window:message', ['$event'])
  CopyPreviewFunction($event: MessageEvent) {
    if ($event.data !== undefined) {
      let dataSplit = $event.data.split(',');
      //let iframeObj = dataSplit[3]; // iframe event object
      if (dataSplit !== undefined) {
        if (dataSplit[0] === 'copy') {
          this.callCopyMethod(dataSplit);
        } else if (dataSplit[0] === 'preview') {
          this.callPreviewMethod(dataSplit);
        } else if (dataSplit[0] === 'cancelPopupPreview') {
          this.cancelPopupFragment(dataSplit);
        }
      }
    }
    return;
  }
  saveAsHtmlFragments() { // DOWNMLOAD FRAGMENT WITH HTML STYLE.
    //you can enter your own file name and extension
    //let tempSavedHtml; // = document.createElement("div");
    //let parentHtml = this.fragmentIframeEvent.contentDocument.getElementsByTagName('html');
    //tempSavedHtml = [...parentHtml][0];
    //let iframeContent = sampContent.documentElement;
    //let listOfStyles = tempSavedHtml.getElementsByTagName('style')[0].remove();
    let arryObj = ['addFragmentDetails', 'previewFragmentDiv'];
    let filteredHtml;
    // arryObj.forEach((ele,i) => {
    //   filteredHtml =  this.clearAllOtherPopupHtml(tempSavedHtml,ele);
    // });

    //let filterRemoveSimulaterFlag = filteredHtml.outerHTML.replaceAll('&amp;simulation=true','');
    let filterRemoveSimulaterFlag = this.fragmentHtmlContentForDownload//tempSavedHtml.outerHTML
      .replaceAll('%7B', '{')
      .replaceAll('%7D', '}')
      .replaceAll('&amp;simulation=true', '')
      .replaceAll('&simulation=true', '')
      .replaceAll('|', '%7C')
      .replaceAll('&amp;', '&')
      .replaceAll('addFragmentDetails', 'hide')
      .replaceAll('previewFragmentDiv', 'hide');

    let paramsValueReplacesWithBracesHtml = this.removeEnteredParamValFromHtmlMethod(filterRemoveSimulaterFlag);
    
    this.writeContents(paramsValueReplacesWithBracesHtml, 'fragmentFile' + '.html', 'text/html');
  }
  saveAsHtmlTag() {
    //you can enter your own file name and extension
    let tempSavedHtml = document.createElement('div');
    let parentHtml = this.htmlTagIframeContent.nativeElement.contentDocument.getElementsByTagName('html')[0];
    tempSavedHtml.innerHTML = parentHtml.outerHTML;
    //let iframeContent = sampContent.documentElement;
    let listOfStyles = tempSavedHtml.getElementsByTagName('style')[0].remove();
    // let arryObj = ["addFragmentDetails","previewFragmentDiv"];
    // let filteredHtml;
    // arryObj.forEach((ele,i) => {
    //   filteredHtml =  this.clearAllOtherPopupHtml(tempSavedHtml,ele);
    // });
    //let filterRemoveSimulaterFlag = filteredHtml.outerHTML.replaceAll('&amp;simulation=true','');
    //let filterRemoveSimulaterFlag = filteredHtml.outerHTML.replaceAll('%7B','{').replaceAll('%7D','}').replaceAll('&amp;simulation=true','').replaceAll('|','%7C').replaceAll('&amp;','&');
    //let paramsValueReplacesWithBracesHtml = this.removeEnteredParamValFromHtmlMethod(filterRemoveSimulaterFlag);
    this.writeContents(parentHtml.outerHTML, 'fragmentFile' + '.html', 'text/html');
  }
  filterStylingAndHtmlTagOnDownLoadMethod() { // DOWNLOAD FRAGMENT IMAGE BUTTON
    //you can enter your own file name and extension
    //let tempSavedHtml; // = document.createElement("div");
    //let parentHtml = this.fragmentIframeEvent.contentDocument.getElementsByTagName('html');
    //tempSavedHtml = [...parentHtml][0];
    //let iframeContent = sampContent.documentElement;
    //let listOfStyles = tempSavedHtml.getElementsByTagName('style')[0].remove();
    let arryObj = ['addFragmentDetails', 'previewFragmentDiv'];
    let filteredHtml;
    // arryObj.forEach((ele,i) => {
    //   filteredHtml =  this.clearAllOtherPopupHtml(tempSavedHtml,ele);
    // });

    //let filterRemoveSimulaterFlag = filteredHtml.outerHTML.replaceAll('&amp;simulation=true','');
    let filterRemoveSimulaterFlag = this.fragmentHtmlContentForDownload//tempSavedHtml.outerHTML
      .replaceAll('%7B', '{')
      .replaceAll('%7D', '}')
      .replaceAll('&amp;simulation=true', '')
      .replaceAll('&simulation=true', '')
      .replaceAll('|', '%7C')
      .replaceAll('&amp;', '&')
      .replaceAll('addFragmentDetails', 'hide')
      .replaceAll('previewFragmentDiv', 'hide');

    let paramsValueReplacesWithBracesHtml = this.removeEnteredParamValFromHtmlMethod(filterRemoveSimulaterFlag);    
    this.writeRawContents(paramsValueReplacesWithBracesHtml, 'fragmentFile' + '.html', 'text/html');
  }
  async filterDeeplinkFragmentMapAreaMethod(){ // DOWNLOAD FRAGMENT IMAGE MAP
    let params;
    params = this.concactStrArry;
    this.showLoader = true;
    let enCodeParams = params.join('');
    if (enCodeParams !== undefined) {
      enCodeParams = enCodeParams.replaceAll('|', '%7C');
    }
    let endpoint =
      this.ptagSimulateUrlBasePath + AppConstants.API_END_POINTS.GET_FRAGMENT_DEEP_LINK_TAG_URL_API + this.tagkey + '?' + enCodeParams;
      let mapAreaResponse = await this.HttpService.getFullPath(endpoint).toPromise();
          if (mapAreaResponse.body !== null) {
            this.showLoader = false;
            this.fragmentDeepLinkDownload = mapAreaResponse.body; // Image map area Array object
            this.writeContentsForMapArea(this.fragmentDeepLinkDownload, 'fragmentFile' + '.html', 'text/html'); 
          }else{
            this.showLoader = false;
            console.log('Result: '+mapAreaResponse.body);
          }
  }

  writeContentsForMapArea(content, fileName, contentType){    
    let combineAllMapArea:any = Object.keys(content).map((x:any) => {
      return content[x].published;
    });
    let combineHtmlStr = document.createElement('div');
    combineHtmlStr.innerHTML = combineAllMapArea.join("");
    let createNewHtml: any = combineHtmlStr.innerHTML;
    let filterHtml = createNewHtml.replaceAll('&amp;', '&');
    var a = document.createElement('a');
    var file = new Blob([filterHtml], { type: contentType });
    var url = URL.createObjectURL(file);
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  }
  writeRawContents(content, fileName, contentType) {
    let HtmlInDiv = document.createElement('div');
    HtmlInDiv.innerHTML = content;
    let divArry: any = HtmlInDiv.getElementsByClassName('fragment-type');
    let removeHtmlELement: any = HtmlInDiv.getElementsByClassName('fragmentDetailsDivForUi');
    if (removeHtmlELement !== undefined) {
      [...removeHtmlELement].forEach((element) => {
        element.remove();
      });
    }
    let layoutDivArray = [...divArry];
    let imgArry: any = [];
    let contentHtmlStr = '';
    let innerConcatStr = '';
    let anchorInnerHtml:any = "";
    let acnchorTagContentHtml = document.createElement('div');
    layoutDivArray.forEach((element, i) => {
      //let addParentDivClass = document.createElement('div');
      //let acnchorTagContentHtml = document.createElement('div');
      //let imgTagContentHtml = document.createElement('div');
      // addParentDivClass.classList.add('pcard');

      let arryAcnchor = element.getElementsByTagName('a');      
      if(arryAcnchor.length > 0){
        if (arryAcnchor !== undefined) {
          [...arryAcnchor].forEach((elementAnchor) => {
            //anchorInnerHtml += elementAnchor.outerHTML;
            imgArry.splice(imgArry.length,0,elementAnchor.outerHTML);
          });
          //let collectAchorTagArray = [...arryAcnchor];
          
        }
        //acnchorTagContentHtml.innerHTML = anchorInnerHtml;
        
      }
      
      //imgTagContentHtml.innerHTML = element.getElementsByTagName('a');
      //let collectAchorTags = element.getElementsByTagName('a');
      let removeAchorTags = element.getElementsByTagName('a');
      if(element.innerHTML.includes('</a>')){
        if (removeAchorTags.length > 0) { // remove anchor tag for image outside layout not inside Anchor tag
          [...removeAchorTags].map((x) => x.remove());
        }
      }
      
      let collectImgs = element.getElementsByTagName('img');      
      if(collectImgs.length > 0){
        [...collectImgs].forEach((elementImgHtml) => {
          //anchorInnerHtml += elementAnchor.outerHTML;
          imgArry.splice(imgArry.length,0,elementImgHtml.outerHTML);
        });
      }
        
      let combineBoth: any = [];
      //let acnchorTag = acnchorTagContentHtml.getElementsByTagName('a');
      //combineBoth = imgArry.concat.apply(imgArry, acnchorTag);
      combineBoth = imgArry;

      // if(acnchorTagContentHtml.innerHTML.includes('</a>')){
      // let acnchorTag = acnchorTagContentHtml.getElementsByTagName('a');
      //   combineBoth = imgArry.concat.apply(imgArry, acnchorTag);//collectImgs.concat(collectAchorTags);
      // }else{
      //   combineBoth = imgArry;
      // }
      
      //= collectImgs.concat(collectAchorTags);//collectImgs.concat.apply(collectImgs, collectAchorTags);
      
      innerConcatStr = '';
      if (combineBoth !== undefined) {
        combineBoth.forEach((elemImgs) => {
          innerConcatStr += elemImgs;
        });
      }
      //innerConcatStr = innerConcatStr;
      //addParentDivClass.innerHTML = innerConcatStr;
      element.removeAttribute('style');
      let styleAttr = element.getElementsByTagName('style');
      if (styleAttr !== undefined) {
        [...styleAttr].map((x) => x.remove());
      }
      //element.innerHTML = addParentDivClass.outerHTML;
      //contentHtmlStr = "";
      //contentHtmlStr += innerConcatStr;
      //contentHtmlStr = innerConcatStr;
    });
    //let combineHtmlStr = document.createElement('div');
   // combineHtmlStr.innerHTML = contentHtmlStr;
    let createNewHtml: any = innerConcatStr;
    let filterHtml = createNewHtml.replaceAll('&amp;', '&');
    var a = document.createElement('a');
    var file = new Blob([filterHtml], { type: contentType });
    var url = URL.createObjectURL(file);
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  }
  writeContents(content, fileName, contentType) {

    let HtmlInDiv = document.createElement('div');
    HtmlInDiv.innerHTML = content;
    let divArry: any = HtmlInDiv.getElementsByClassName('fragment-type');
    if (divArry !== undefined) {
      [...divArry].map(element => {
        let relativeClassRemove = element.className.replaceAll(" relative","");
        element.className = relativeClassRemove;
      });
    }
    // remove all style and popup html
    HtmlInDiv.removeAttribute('style');
    let styleAttr: any = HtmlInDiv.getElementsByTagName('style');
    if (styleAttr !== undefined) {
      [...styleAttr].map((x) => x.remove());
    }
    // remove script tag if any present in html content download
    HtmlInDiv.removeAttribute('script');
    let scriptAttr: any = HtmlInDiv.getElementsByTagName('script');
    if (scriptAttr !== undefined) {
      [...scriptAttr].map((x) => x.remove());
    }
    let removeHtmlELement: any = HtmlInDiv.getElementsByClassName('fragmentDetailsDivForUi');
    if (removeHtmlELement !== undefined) {
      [...removeHtmlELement].forEach((element) => {
        element.remove();
      });
    }

    const keepStyle = `
    *{box-sizing:border-box} a[x-apple-data-detectors]{color:inherit!important;text-decoration:inherit!important} .desktop_hide,.desktop_hide table{mso-hide:all;display:none;max-height:0;overflow:hidden}.image_block img+div{display:none} @media (max-width:520px){.mobile_hide{display:none}.row-content{width:100%!important}.stack .column{width:100%;display:block}.mobile_hide{min-height:0;max-height:0;max-width:0;overflow:hidden;font-size:0}.desktop_hide,.desktop_hide table{display:table!important;max-height:none!important}}.fragment-type {text-align: center}`;
    const newStyle = document.createElement('style');
    newStyle.innerHTML = keepStyle.trim();

    if(divArry[0].style.width) {
      let nonResponsiveStyle = `.fragment-type {width: $(divArry[0].style.width) !important;margin: 0 auto}`;
      newStyle.innerHTML = keepStyle.trim()+nonResponsiveStyle.trim();
    }

    let outterHtmlContent: any = HtmlInDiv.outerHTML;
    let filterHtml = outterHtmlContent.replaceAll('&amp;', '&');
    let currentDate = new Date();
    const metaTagInsertAtHeadTag = `
    <meta name="name" content="${this.pTagObjDetails.name}" /> 
    <meta name="id" content="${this.pTagObjDetails.tagKey}" />
    <meta name="tag" content="${this.fragmentTagCode}" />
    <meta name="creation-date" content="${this.pTagObjDetails.creationDate}" />`;

    const filterWithHtmlTag = `
        <html>
            <head>
                ${metaTagInsertAtHeadTag}
                <style>${newStyle.innerHTML}</style>
            </head>
            <body>
                ${filterHtml}
            </body>
        </html>
    `;
    var a = document.createElement('a');
    var file = new Blob([filterWithHtmlTag], { type: contentType });
    var url = URL.createObjectURL(file);
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  }
  switchPreviewTab(type) {
    this.ngZone.run(() => {
      if (type === 0) {
        // preview tab
        this.previewActive = 0;
        this.previewControlEnabled = true;
      } else {
        // console log tab
        this.previewActive = 1;
        this.previewControlEnabled = false;
        this.simulateLogMethod();
      }
    });
  }
  callOnHoverFragmentDiv(iframeObj) {
    //let findEle = this.fragmentIframeElement.nativeElement;
    // if (findEle.classList.contains('fragmentIframeSection')) {
    //let findIframe = findEle.firstChild;
    if (iframeObj.classList.contains('fragmentIframeSection')) {
      let findFragmentEle = iframeObj.contentDocument.body.getElementsByClassName('fragment-type');
      let posTop:any = [];
      if (findFragmentEle.length > 0 && findFragmentEle !== undefined) {
        [...findFragmentEle].forEach((eachFragment, i) => {
          if (eachFragment.classList.contains('fragment-type')) {
            eachFragment.classList.add('parentfragmentDiv_' + i);
            eachFragment.classList.add('relative');
            var mySpan = document.createElement('span');
            mySpan.classList.add('addFragmentDetails');
            mySpan.classList.add('fragment_' + i);
            mySpan.classList.add('fragmentDetailsDivForUi');
            if(eachFragment.offsetLeft > 0){ // THIS IS THE CHANGE FOR SETTING THE FRAGMENT DETAILS POSITION TO LEFT CONRNER, CLICK VIEW
              mySpan.setAttribute("style","left:-"+eachFragment.offsetLeft+"px");
            }            
            if (eachFragment.getElementsByTagName('span')[0] !== undefined) {
              // findFragmentEle.getElementsByTagName("span")[0].remove();
              //findFragmentEle.getElementsByTagName("span")[0].classList.add('hide');
            } else {
              //setTimeout(() => {
              let lblFragmentdts = this.translate.instant('simulatePtagComponent.fragmentDetailsLbl');
              let copiedLbl = this.translate.instant('productRecoAdvanceComponent.copiedTextFromMergeTagLbl');
              let copyLbl = this.translate.instant('copy');
              let closeLbl = this.translate.instant('close');
              let fragmentDetailsHtml =
                `<b class="verticalLine">` +
                lblFragmentdts +
                `</b>
                  <img class="iconFragment" src="` +
                this.baseUrl +
                `/resources/imgs/content_copy.png" onclick="window.parent.postMessage('copy,` +
                i +
                `,t1','*');">
                   <img class="iconFragment previewImgTag_` +
                i +
                `" src="` +
                this.baseUrl +
                `/resources/imgs/eyeIcon.png" onclick="window.parent.postMessage('preview,` +
                i +
                `,p1','*');">
                    <i class='tip copied_tip_` +
                i +
                ` copyDivStyle' style="display:none">` +
                copiedLbl +
                `</i>
                    `;
              mySpan.innerHTML = fragmentDetailsHtml;
              // mySpan.style.color = "red";
              var previewStructureHtml = document.createElement('span');
              let previewpopupDiv =
                `         
                  <i class="arrow-up"></i>           
                  <div class="htmlFragmentTag_` +
                i +
                `" style='text-wrap:wrap;font-family: monospace;white-space-collapse: preserve;
                  margin: 1em 0px;height: 190px;overflow-x: hidden;overflow-y: auto;'></div>                    
                  <button type="button" class="btn copyBtnCss" onclick="window.parent.postMessage('copy,` +
                i +
                `,t1','*')">
                  <img src="` +
                this.baseUrl +
                `/resources/imgs/copyIconBlue.png" width="12" height="12" class=""> ` +
                copyLbl +
                `</button>                    
                  <button type="button" class="btn closeCss" onclick="window.parent.postMessage('cancelPopupPreview,` +
                i +
                `','*')">` +
                closeLbl +
                `</button>
                  
                  `;
              previewStructureHtml.classList.add('previewFragmentDiv');
              previewStructureHtml.classList.add('previewFtag_' + i);
              previewStructureHtml.classList.add('fragmentDetailsDivForUi');
              if(eachFragment.offsetLeft > 0){ // THIS IS THE CHANGE FOR SETTING THE FRAGMENT DETAILS POSITION TO LEFT CONRNER, POPUP VIEW
                previewStructureHtml.setAttribute("style","left:-"+eachFragment.offsetLeft+"px");
              }
              previewStructureHtml.style.display = 'none';
              previewStructureHtml.innerHTML = previewpopupDiv;
              eachFragment.appendChild(mySpan);
              eachFragment.appendChild(previewStructureHtml);
              //}, 0  );
            }
          } else {
            //findFragmentEle.getElementsByTagName("span")[0].classList.add('hide');
          }
        });
      }
    }
  }
  callPreviewMethod(copyArry) {
    this.cancelAllPopupBeforeOpen();
    let tempSavedHtml = document.createElement('div');
    let parentHtml = this.fragmentIframeEvent.contentDocument.getElementsByClassName(
      'parentFragmentDiv_' + copyArry[1]
    )[0];
    tempSavedHtml.innerHTML = parentHtml.outerHTML;
    //parentHtml.getElementsByClassName('fragment_'+copyArry[1])[0];
    let fragmentHtmlFiltered: any = tempSavedHtml.getElementsByClassName('fragment_' + copyArry[1])[0].remove();
    fragmentHtmlFiltered = tempSavedHtml.innerHTML;

    let previewHtmlFiltered: any = tempSavedHtml.getElementsByClassName('previewFtag_' + copyArry[1])[0].remove();
    previewHtmlFiltered = tempSavedHtml.innerHTML;
    //setTimeout(() => {
    // let hoverDiv = parentHtml.getElementsByClassName('fragment_'+copyArry[1])[0];
    let hoverDiv = parentHtml;
    //previewHtmlFiltered = previewHtmlFiltered.replaceAll('&amp;simulation=true','');
    previewHtmlFiltered = previewHtmlFiltered
      .replaceAll('%7B', '{')
      .replaceAll('%7D', '}')
      .replaceAll('&amp;simulation=true', '')
      .replaceAll('|', '%7C')
      .replaceAll('&amp;', '&');
    let paramsValueReplacesWithBracesHtml = this.removeEnteredParamValFromHtmlMethod(previewHtmlFiltered);
    this.showPreviewFragmentDiv(paramsValueReplacesWithBracesHtml, hoverDiv, copyArry[1]);
    //console.log('call Preview');
  }
  removeEnteredParamValFromHtmlMethod(html) {
    let finalHtml;
    //if(this.strURLVal.length > 0){
    this.strURLVal.forEach((item, i) => {
      let filterStr = item.replaceAll('&', '');
      let splitStr = filterStr.split('=');
      if (splitStr[1] != '') {
        let replStrWithBraces = '{' + splitStr[0] + '}';
        let encodeValStr = encodeURIComponent(splitStr[1]);
        let originalStr = splitStr[0] + '=' + encodeValStr;
        let newStr = splitStr[0] + '=' + replStrWithBraces;
        finalHtml = html.replaceAll(originalStr, newStr);
        html = finalHtml;
      }
    });
    if (finalHtml === undefined) {
      finalHtml = html;
    }
    return finalHtml;
    //}
  }
  showPreviewFragmentDiv(html, target, id) {
    this.fragmentPreviewHtml = html;
    //this.popFragmentPreviewEnabled = true;

    let floatingDiv = target;
    let previewDiv = floatingDiv.getElementsByClassName('previewFtag_' + id)[0];
    let innerSpan = previewDiv.getElementsByClassName('htmlFragmentTag_' + id)[0];
    // let prevImgTag = floatingDiv.getElementsByClassName('previewImgTag_'+id)[0];

    innerSpan.innerText = '';
    innerSpan.innerText = html;
    previewDiv.style.display = 'block';
  }
  cancelPopupFragment(copyArry) {
    let parentHtml = this.fragmentIframeEvent.contentDocument.getElementsByClassName(
      'parentFragmentDiv_' + copyArry[1]
    )[0];
    //let hoverDiv = parentHtml.getElementsByClassName('fragment_'+copyArry[1])[0];
    let previewDiv = parentHtml.getElementsByClassName('previewFtag_' + copyArry[1])[0];
    previewDiv.style.display = 'none';
  }
  clearAllOtherPopupHtml(parentHtmlEle, selectedElementsSection) {
    let listOfremovingElements = parentHtmlEle.getElementsByClassName(selectedElementsSection);
    [...listOfremovingElements].forEach((element, i) => {
      //element.remove();
      element.style.display = 'none';
    });
    return parentHtmlEle;
  }
  cancelAllPopupBeforeOpen() {
    let parentEle = this.fragmentIframeEvent.contentDocument.getElementsByClassName('previewFragmentDiv');
    [...parentEle].forEach((element, i) => {
      element.style.display = 'none';
    });
  }
  callCopyMethod(copyArry) {
    let tempSavedHtml = document.createElement('div');
    let parentHtml = this.fragmentIframeEvent.contentDocument.getElementsByClassName(
      'parentFragmentDiv_' + copyArry[1]
    )[0];
    tempSavedHtml.innerHTML = parentHtml.outerHTML;
    //parentHtml.getElementsByClassName('fragment_'+copyArry[1])[0];
    let fragmentHtmlFiltered: any = tempSavedHtml.getElementsByClassName('fragment_' + copyArry[1])[0].remove();
    fragmentHtmlFiltered = tempSavedHtml.innerHTML;

    let previewHtmlFiltered: any = tempSavedHtml.getElementsByClassName('previewFtag_' + copyArry[1])[0].remove();
    previewHtmlFiltered = tempSavedHtml.innerHTML;
    //setTimeout(() => {
    let hoverDiv = parentHtml.getElementsByClassName('fragment_' + copyArry[1])[0];
    //previewHtmlFiltered = previewHtmlFiltered.replaceAll('&amp;simulation=true','');
    previewHtmlFiltered = previewHtmlFiltered
      .replaceAll('%7B', '{')
      .replaceAll('%7D', '}')
      .replaceAll('&amp;simulation=true', '')
      .replaceAll('|', '%7C')
      .replaceAll('&amp;', '&');
    let paramsValueReplacesWithBracesHtml = this.removeEnteredParamValFromHtmlMethod(previewHtmlFiltered);
    this.copyFormIframe(paramsValueReplacesWithBracesHtml, hoverDiv, copyArry[1]);
    //}, 500);
    //console.log('call Copy');
  }
  copyFormIframe(html, target, id) {
    let floatingDiv = target;
    let copyDiv = floatingDiv.getElementsByClassName('copied_tip_' + id)[0];
    copyDiv.style.display = 'block';
    setTimeout(function () {
      copyDiv.style.display = 'none';
      //copied_tip_
    }, 800);
    document.execCommand('copy');

    this.clipboard.copy(html);
    //this.clipboardHtmlContent.copyFromContent(html);
  }

  ngOnInit(): void {}
  async simulateLogMethod() {
    //let endpoint = AppConstants.API_END_POINTS.GET_SIMULATE_LOG_API+this.tagkey+'&fragment='+this.fragmentsContentIframe;
    let endpoint =
    this.ptagSimulateUrlBasePath+AppConstants.API_END_POINTS.GET_SIMULATE_LOG_API +
      '?tagKey=' +
      this.tagkey +
      '&fragment=' +
      this.fragmentsContentIframe;
    //let endpoint = 'https://api-dev.algonomy.com/ptag/p/simulateLog/121/false';
    let localUrl = this.HttpService.getHtmlSimulate(endpoint);
    localUrl.subscribe(async (res) => {
      if (res.body !== null) {
        let logsRes = await this.HttpService.getFullPath(res.body).toPromise();
        if (logsRes.body !== null) {
          this.ngZone.run(() => {
            let resObj = logsRes.body;
            this.simulateConsoleLogDetails = JSON.stringify(resObj);
            this.collectViewSimulateLogDataMethod(resObj);
            this.isConsoleLogPresent = true;
          });
        } else {
          this.simulateConsoleLogDetails = this.translate.instant('simulatePtagComponent.logConsoleFoundLbl');
          this.isConsoleLogPresent = false;
        }
      }
    });
  }
  collectViewSimulateLogDataMethod(logObj) {
    if (logObj !== null) {
      // this.requestObj = logObj.request;
      // this.requestparamsObj = logObj.request.requestParameters;
      // this.requestIdObj = logObj.requestId;
      // this.responseObj = logObj.response;
      // this.rowDetailsObj = logObj.rowDetails;
      // this.serverObj = logObj.server;
      // this.overAllLogObj = {
      //   request: this.requestObj,
      //   requestParams: this.requestparamsObj,
      //   requestId: this.requestIdObj,
      //   response: this.responseObj,
      //   rowDetails: this.rowDetailsObj,
      //   server: this.serverObj,
      // };
      this.shareService.logConsoleErrorObj.next(logObj);
    }
  }
  openViewSimulatePopupModal() {
    this.viewSimulatePopupEnable = true;
    this.modalRef = this.modalService.show(ViewSimulateLogConsoleComponent, {
      class: 'modal-dialog-centered viewSimulatePopup',
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true,
    });
  }
  getWidtheightPixel(evt, dimension) {
    // if(this.fragmentsContentIframe){
    //   // do nothing for now.
    // }else{
    let pxlVal = evt.target.value;
    //let imageSimulateArea = this.simulateImageWidthHeight?.nativeElement;
    // if(dimension == 'W'){ // Width in Pixel
    //   //imageSimulateArea.width = pxlVal;
    //   this.deviceWidthNHeight['w'] = pxlVal;
    // }else{ // Height in Pixel
    //   //imageSimulateArea.height = pxlVal;
    //   this.deviceWidthNHeight['w'] = pxlVal;
    // }
    if (pxlVal.length > 5) {
      pxlVal = pxlVal.slice(0, 4);
      this.deviceWidthNHeight[dimension] = pxlVal;
      evt.target.value = pxlVal;
      return;
    }
    this.deviceWidthNHeight[dimension] = pxlVal;
    let widthNHeightArry = ['width=' + this.deviceWidthNHeight.w + '&', 'height=' + this.deviceWidthNHeight.h + '&'];
    if (this.fragmentsContentIframe) {
      if (this.deviceWidthNHeight.w.trim() != '' && this.deviceWidthNHeight.h.trim() != '') {
        widthNHeightArry = ['width=' + this.deviceWidthNHeight.w + '&', 'height=' + this.deviceWidthNHeight.h + '&'];
      } else if (this.deviceWidthNHeight.h.trim() != '') {
        widthNHeightArry = ['height=' + this.deviceWidthNHeight.h + '&'];
      } else if (this.deviceWidthNHeight.w.trim() != '') {
        widthNHeightArry = ['width=' + this.deviceWidthNHeight.w + '&'];
      } else {
        widthNHeightArry = [];
      }
    }
    this.concactStrArry = widthNHeightArry.concat(this.strURLVal);
    if (this.showUrlPath !== undefined) {
      if (this.fragmentsContentIframe) {
        this.fragmentTagSimulateURL = this.showUrlPath + '?' + this.concactStrArry.join('');
        this.fragmentTagSimulateURL = this.fragmentTagSimulateURL.replace('/p/f/', '/ph/ftag/').replace('.png','.html').replaceAll('%7C','|');
        this.fragmentTagSimulateURL = this.urlSanitizer.sanitize(this.fragmentTagSimulateURL);
      } else if (this.htmlTagViewContent) {
        let filterUrlTag = this.htmlFullTagUrlAPI ? this.htmlFullTagUrlAPI.split('?'): '';
        let newUrl = filterUrlTag[0] + '?' + this.strURLVal.join('');
        this.htmlFullTagUrlAPI = newUrl;
        this.htmlFullTagUrlAPI = this.htmlFullTagUrlAPI.replaceAll('%7C','|');
        this.htmlFullTagUrlAPI = this.urlSanitizer.sanitize(this.htmlFullTagUrlAPI);
      } else if (this.fullTagImageContent) {
        this.tagSimulateURL = this.showUrlPath + '?' + this.concactStrArry.join('');
        this.tagSimulateURL = this.tagSimulateURL.replaceAll('%7C','|');
        this.tagSimulateURL = this.urlSanitizer.sanitize(this.tagSimulateURL);
      }
    }
    // }
  }
  getTagKeyMethod() {
    this.tagkey = localStorage.getItem('tagKeyPersonalization');
    this.tagkey = this.dataService.activeContentTagKey; //localStorage.getItem("tagKeyPersonalization");
    this.onEditGetParameters();
  }
  async getSimulateUrlPathMethod(params) {
    this.showLoader = true;

    let endpoint = AppConstants.API_END_POINTS.GET_SIMULATE_URL_API + this.tagkey;
    const result = await this.HttpService.post(endpoint).toPromise();
    if (result.status == 'SUCCESS') {
      this.ngZone.run(() => {
        this.showLoader = false;
        this.showUrlPath = result.response.finalUrl;
        let imageSimulateArea = this.simulateImageWidthHeight?.nativeElement;

        // if(this.strURLVal.length > 0){
        //   this.strURLVal.forEach((ele,i) => {
        //     if(i != 0){
        //       this.strURLVal[i] = "&"+ele;
        //     }
        //   });
        // }
        let enCodeParams = params.join('');
        if (enCodeParams !== undefined) {
          enCodeParams = enCodeParams.replaceAll('|', '%7C');
        }
        //this.simulateImgPath = result.response.simulateUrl+"?"+params.join('');
        this.simulateImgPath = result.response.simulateUrl + '?' + enCodeParams;
        this.simulateImgPath = this.urlSanitizer.sanitize(this.simulateImgPath);
        imageSimulateArea.src = this.simulateImgPath;

        this.tagSimulateURL = this.showUrlPath + '?' + params.join('');
        this.tagSimulateURL = this.urlSanitizer.sanitize(this.tagSimulateURL);
        this.logConsoleEnable = true;
      });
    }
  }
  async getTagUrlPathMethod(params) {
    let endpoint = AppConstants.API_END_POINTS.GET_SIMULATE_URL_API + this.tagkey;
    const result = await this.HttpService.post(endpoint).toPromise();
    if (result.status == 'SUCCESS') {
      this.ngZone.run(() => {
        this.showLoader = false;
        this.showUrlPath = result.response.finalUrl;
        this.ptagSimulateUrlBasePath = result.response.simulateUrlBasePath;
        this.getTagHashId = this.getTagHashIdMethod(this.showUrlPath);
        if (this.fragmentsContentIframe) {
          this.switchDeviceToSeePixelVal(3);
        } else {
          this.switchDeviceToSeePixelVal(1);
        }
        if(this.ensembleAiEnabled){
          this.switchTextTab(1);
        }else{
          this.switchTextTab(0);
        }
        this.tagSimulateURL = this.showUrlPath + '?' + params.join('');
      });
    }
  }
  getTagHashIdMethod(path) {
    let tagHash = lodash.first(lodash.findLast(path.split('/')).split('.'));
    return tagHash;
  }
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
  loadHtmlInIframe(loadIframeContent) {
    //this.ngZone.run(() => {
    let ele: any = document.querySelector('#thumbnailContent');
    //let htmlEle = "<div style='overflow:hidden'>"+this.loadThumbnailContent+"</div>";

    if (ele !== null) {
      ele.contentDocument.head.innerHTML = '';
      ele.contentDocument.head.innerHTML = "<style type='text/css'>table{width: 100% !important;}<style>";
      ele.contentDocument.body.innerHTML = loadIframeContent;
    }
    //});
  }
  clearParamsValueMethod(tagName){
    this.collectParameterTags(tagName,'');
  }
  collectParameterTags(tagName, evt) {    
    let inpStr;
    if(evt.target === undefined){
      inpStr = evt;
    }else{
      inpStr = evt.target.value;
    };
    let indxOfVal = this.saveTagRetriveObj.params.findIndex((x) => x.name === tagName);
    let endInx = this.saveTagRetriveObj.params.length - 1;
    if (indxOfVal == 0) {
      this.strURLVal[indxOfVal] = tagName + '=' + inpStr;
    } else {
      this.strURLVal[indxOfVal] = '&' + tagName + '=' + inpStr;
    }
    this.reteriveTagParams[indxOfVal].fieldValue = inpStr;

    this.updateURLWithWidthNHeightMethod();
  }

  updateURLWithWidthNHeightMethod(){
    let params;
    if (this.customSettings) {
      let widthNHeightArry = ['width=' + this.deviceWidthNHeight.w + '&', 'height=' + this.deviceWidthNHeight.h + '&'];
      if (this.fragmentsContentIframe) {
        if (this.deviceWidthNHeight.w.trim() != '' && this.deviceWidthNHeight.h.trim() != '') {
          widthNHeightArry = ['width=' + this.deviceWidthNHeight.w + '&', 'height=' + this.deviceWidthNHeight.h + '&'];
        } else if (this.deviceWidthNHeight.h.trim() != '') {
          widthNHeightArry = ['height=' + this.deviceWidthNHeight.h + '&'];
        } else if (this.deviceWidthNHeight.w.trim() != '') {
          widthNHeightArry = ['width=' + this.deviceWidthNHeight.w + '&'];
        } else {
          widthNHeightArry = [];
        }
        this.concactStrArry = widthNHeightArry.concat(this.strURLVal);
        params = this.concactStrArry;
        this.fragmentTagSimulateURL = this.showUrlPath + '?' + this.concactStrArry;
      } else {
        this.concactStrArry = widthNHeightArry.concat(this.strURLVal);
        params = this.concactStrArry;
      }
    } else if (this.isMobileDeviceEnabled) {
      let widthNHeightArry = ['width=300&', 'height=400&'];
      this.concactStrArry = widthNHeightArry.concat(this.strURLVal);
      params = this.concactStrArry;
    } else {
      // desktop as default
      let widthNHeightArry = ['width=600&', 'height=800&'];
      this.concactStrArry = widthNHeightArry.concat(this.strURLVal);
      params = this.concactStrArry;
    }

    this.ngZone.run(() => {
    if (this.showUrlPath !== undefined) {
      if (this.fragmentsContentIframe) {        
        this.fragmentTagSimulateURL = this.showUrlPath + '?' + params.join('');
        this.fragmentTagSimulateURL = this.fragmentTagSimulateURL.replace('/p/f/', '/ph/ftag/').replace('.png','.html').replaceAll('%7C','|');
        this.fragmentTagSimulateURL = this.urlSanitizer.sanitize(this.fragmentTagSimulateURL);
      } else if (this.htmlTagViewContent) {
        let filterUrlTag = this.htmlFullTagUrlAPI ? this.htmlFullTagUrlAPI.split('?'): '';
        let newUrl = filterUrlTag[0] + '?' + this.strURLVal.join('');
        this.htmlFullTagUrlAPI = newUrl;
        this.htmlFullTagUrlAPI = this.htmlFullTagUrlAPI.replaceAll('%7C','|');
        this.htmlFullTagUrlAPI = this.urlSanitizer.sanitize(this.htmlFullTagUrlAPI);
      } else if (this.fullTagImageContent) {
        this.tagSimulateURL = this.showUrlPath + '?' + params.join('');
        this.tagSimulateURL = this.tagSimulateURL.replaceAll('%7C','|');
        this.tagSimulateURL = this.urlSanitizer.sanitize(this.tagSimulateURL);
      }
    }
  });
  }


  // downloadStreamImage(endpoint,callback): void {
  //   const url: any = endpoint;
  //   this.HttpService.post(url)
  //     .subscribe((response: Blob) => {
  //       callback(this.convertToDataUrl(response));
  //     });
  // }
  // getBlobToDataUrl(url, callback) {
  //   var xhr = new XMLHttpRequest();
  //   xhr.onload = async () => {
  //     callback(await this.convertToDataUrl(xhr.response));
  //   };

  //   xhr.open('GET', url);
  //   xhr.responseType = 'blob';
  //   xhr.send();
  // }
  // convertToDataUrl(blob) {
  //   return new Promise((r) => {
  //     var reader = new FileReader();
  //     reader.onloadend = function () {
  //       r(reader.result);
  //     };
  //     reader.readAsDataURL(blob);
  //   });
  // }
  async simulateCallMethod() {
    // This call is for Full image ( Image Tag)
    let params;
    // if(this.customSettings || this.isMobileDeviceEnabled || ){
    //   params = this.concactStrArry;
    // }else{
    //   params = this.strURLVal;
    // }
    // passing width and height for all tabs
    params = this.concactStrArry;
    let payload = {
      tagKey: this.tagkey,
      parameters: params,
    };
    this.ngZone.run(() => {
      //this.showLoader = true;
      this.getSimulateUrlPathMethod(params);
    });
  }
  async onEditGetParameters() {
    let payload = {
      tagKey: this.tagkey,
    };
    // let payload = {tagKey:tagkey}
    let endpoint = AppConstants.API_END_POINTS.GET_TAG_PARAMETERS_API + '?tagKey=' + this.tagkey;
    const result = await this.HttpService.post(endpoint).toPromise();
    if (result.status == 'SUCCESS') {
      if (result.response.tagParams) {
        this.saveTagRetriveObj = JSON.parse(result.response.tagParams);
        if (this.saveTagRetriveObj.params.length > 0) {
          this.ngZone.run(() => {
            this.tagParamsCreateUi(this.saveTagRetriveObj.params);
          });
          //console.log(this.saveTagRetriveObj.params);
        }
      } else {
        this.tagParamsCreateUi(0);
      }
      setTimeout(() => {
        this.updateURLWithWidthNHeightMethod();            
      }, 300); 
      //this.getSimulateUrlPathMethod();
    }
  }

  tagParamsCreateUi(saveObj) {
    let obj: any = [];
    this.reteriveTagParams = saveObj;
    if(this.reteriveTagParams.length > 0) {
      this.reteriveTagParams.forEach((item: any, i) => {
        // obj[item.key] = item.value;
        let st = this.reteriveTagParams.length;
        let ed = this.reteriveTagParams.length - 1;
        let str;
        if(item.fieldValue !== undefined){
          if (i == 0) {
            str = item.name + '=' + item.fieldValue;
            obj.push(str);
          } else {
            str = '&' + item.name + '=' + item.fieldValue;
            obj.push(str);
          }
        }else{
          if (i == 0) {
            str = item.name + '=';
            obj.push(str);
          } else {
            str = '&' + item.name + '=';
            obj.push(str);
          }
        }
      });
    }
    this.strURLVal = obj;
    if (this.showUrlPath !== undefined) {
      this.tagSimulateURL = this.showUrlPath + '?' + this.strURLVal.join('');
    }
    this.getTagUrlPathMethod(this.strURLVal).then(() => this.getLandingPageTagUrl());
  }
  resetDeviceWidthHeightMethod() {
    if (this.tabActive == 0) {
      // full tag imag
      this.simulateImgPath = '';
      if (this.simulateImageWidthHeight !== undefined) {
        let imageFulltagArea = this.simulateImageWidthHeight?.nativeElement;
        imageFulltagArea.src = '';
      }
    } else if (this.tabActive == 1) {
      // fragment image
      this.iframeContentLoaded = undefined;
      if (this.fragmentIframeEvent !== undefined) {
        let ele = this.fragmentIframeEvent;
        if(ele.contentDocument !== null){
          ele.contentDocument.head.innerHTML = '';
          ele.contentDocument.body.innerHTML = '';
        }       
      }
    }
  }
  switchDeviceToSeePixelVal(device) {
    let widthNHeightArry: any = [];
    this.ngZone.run(() => {
      if (device == 1) {
        this.deviceWidthNHeight = { w: 600, h: 800 };
        this.isMobileDeviceEnabled = false;
        this.customSettings = false;
        widthNHeightArry = ['width=600&', 'height=800&'];
        this.concactStrArry = widthNHeightArry.concat(this.strURLVal);
        if (this.showUrlPath !== undefined) {
          this.tagSimulateURL = this.showUrlPath + '?' + this.strURLVal.join('');

          // reset preview area
          this.resetDeviceWidthHeightMethod();
        }
      } else if (device == 2) {
        this.deviceWidthNHeight = { w: 300, h: 400 };
        this.isMobileDeviceEnabled = true;
        this.customSettings = false;
        //widthNHeightArry = [];
        widthNHeightArry = ['width=300&', 'height=400&'];
        this.concactStrArry = widthNHeightArry.concat(this.strURLVal);
        if (this.showUrlPath !== undefined) {
          this.tagSimulateURL = this.showUrlPath + '?' + this.strURLVal.join('');
          // reset preview area
          this.resetDeviceWidthHeightMethod();
      }
      } else {
        this.deviceWidthNHeight = { w: 600, h: 800 };
        this.isMobileDeviceEnabled = false;
        this.customSettings = true;
        widthNHeightArry = ['width=' + this.deviceWidthNHeight.w + '&', 'height=' + this.deviceWidthNHeight.h + '&'];
        //widthNHeightArry.splice(0,0,"width=800&","height=600&");
        //this.concactStrArry = widthNHeightArry.concat(this.strURLVal);

        if (this.fragmentsContentIframe) {
        this.deviceWidthNHeight = { w: '', h: '' };
          widthNHeightArry = ['width=' + this.deviceWidthNHeight.w + '&', 'height=' + this.deviceWidthNHeight.h + '&'];
        this.concactStrArry = this.strURLVal;
      } else {
        this.concactStrArry = widthNHeightArry.concat(this.strURLVal);
      }

      if (this.showUrlPath !== undefined) {
          this.tagSimulateURL = this.showUrlPath + '?' + this.strURLVal.join('');
          // reset preview area

        this.resetDeviceWidthHeightMethod();
        }
      }
    });

    this.updateURLWithWidthNHeightMethod();
  }

  switchTextTab(tabId) {
    this.tabActive = tabId;
    this.landingTagViewContent = false;
    this.ngZone.run(() => {
      if (tabId === 0) {
        // Full image
        this.tabActive = 0;
        this.htmlTagViewContent = false;
        this.fragmentsContentIframe = false;
        this.fullTagImageContent = true;
        this.deepLinkContent = false;
        this.iframeContentLoaded = undefined;
      } else if (tabId === 1) {
        // fragment element
        this.tabActive = 1;
        this.htmlTagViewContent = false;
        this.fragmentsContentIframe = true;
        this.fullTagImageContent = false;
        this.deepLinkContent = false;
        //full tag img src will cleared on fragment tab change.
        this.simulateImgPath = '';
        this.clearContentDataBeforeLandingtoPageMethod();
        this.getFullHtmlTagUrl(true, tabId);
      } else if (tabId === 2 || tabId === 4) {
        // HTML Tag
        this.fragmentsContentIframe = false;
        this.htmlTagViewContent = true;
        this.fullTagImageContent = false;
        this.deepLinkContent = false;
        this.clearContentDataBeforeLandingtoPageMethod();
        setTimeout(() => {
          if(tabId === 2){
            this.landingTagViewContent = false;
            this.isMobileView = false;
            this.getFullHtmlTagUrl(false, tabId);
          } else {
            this.landingTagViewContent = true;
            this.getFullHtmlTagUrl(false, tabId);
          }
        }, 300);        
      } else if (tabId === 3) {
        // Deep Link Tag
        this.fragmentsContentIframe = false;
        this.htmlTagViewContent = false;
        this.fullTagImageContent = false;
        this.deepLinkContent = true;
        this.clearContentDataBeforeLandingtoPageMethod();
        setTimeout(() => {
          this.getFullHtmlTagUrl(false, tabId);
        }, 300);
        this.deeplinkContentLoaded = undefined;
      }
      this.logConsoleEnable = false;
      if (this.fragmentsContentIframe) {
        this.switchDeviceToSeePixelVal(3);
      } else {
        this.switchDeviceToSeePixelVal(1);
      }
      this.switchPreviewTab(0);
    });
  }
  clearContentDataBeforeLandingtoPageMethod() {
    if (this.simulateImageWidthHeight !== undefined) {
      let imageFulltagArea = this.simulateImageWidthHeight?.nativeElement;
      imageFulltagArea.src = '';
    }
    if (this.htmlTagIframeContent !== undefined) {
      let insertHtml = this.htmlTagIframeContent.nativeElement;
      insertHtml.contentDocument.head.innerHTML = '';
      insertHtml.contentDocument.body.innerHTML = '';
    }
  }
  getFullHtmlTagUrl(isFragmentUrl, tabId) { // HTML TAG  CALL
    let endpoint = this.ptagSimulateUrlBasePath + AppConstants.API_END_POINTS.GET_FULL_HTML_TAG_URL_API + this.getTagHashId;
    this.HttpService.getFullPath(endpoint).subscribe((res) => {
      if (res.body.status == 'SUCCESS') {
        let htmlTagUrl = res.body.response.tags.FUll_IMAGE_HTML_TAG;
        this.htmlTagUrlForSimulate = res.body.response.tags.SIMULATE_FUll_IMAGE_HTML_TAG;
    
        if(tabId == 4) {
          htmlTagUrl = this.htmlFullTagUrlAPIForLanding;
        }
        this.htmlFullTagUrlAPI = htmlTagUrl;
        this.getFragmentTagIdFromTagUrl(htmlTagUrl);
        // if (isFragmentUrl) {
        //   this.fragmentTagSimulateURL = this.htmlFullTagUrlAPI ? this.htmlFullTagUrlAPI.replace('/f/', '/ftag/'): '';
        // }
        this.updateURLWithWidthNHeightMethod();
      }
    });
  }

  getLandingPageTagUrl() { // Landing page tag CALL
    let endpoint = this.ptagSimulateUrlBasePath + AppConstants.API_END_POINTS.GET_LANDING_PAGE_TAG_URL_API + this.getTagHashId;
    this.HttpService.getFullPath(endpoint).subscribe((res) => {
      if (res.body.status == 'SUCCESS') {
        this.landingPageEnabled = res.body.response.landingPageEnabled;
        if(this.landingPageEnabled) {
          let htmlTagUrl = res.body.response.publishedLandingPageUrl;
          this.htmlTagUrlForSimulate = res.body.response.simulationLandingPageUrl;
          this.htmlFullTagUrlAPI = htmlTagUrl;
          this.htmlFullTagUrlAPIForLanding = htmlTagUrl;
          this.getFragmentTagIdFromTagUrl(htmlTagUrl);
        }
      }
    });
  }

  getFragmentTagIdFromTagUrl(strPath){
    if(strPath !== undefined){
      let url = strPath.split('.')[0];
      this.fragmentTagCode = url.split('/').findLast(x => x); 
    }       
  }
  copyToPaste(tooltip, refElVal: any) {
    this.ngZone.run(() => {
      if (tooltip.isOpen()) {
        tooltip.close();
      } else {
        let encodePipeStr = refElVal; //.replaceAll('|','%7C');
        tooltip.open({ encodePipeStr });
        this.clipboard.copy(encodePipeStr);
        setTimeout(() => {
          tooltip.close();
        }, 1000);
      }
    });
  }
  onClosePopup(isCl) {
    this.viewSimulatePopupEnable = false;
  }

  onClose(): void {
    if (this.bsModalRef !== undefined) {
      this.bsModalRef.hide();
    }
  }
  getDownloadHtmlFromResponseMethod(rawHtml){    
    this.fragmentHtmlContentForDownload = rawHtml;
  }
  addDynamicIframeMethod(target, htmlFragments, headStyle) {
    const html = htmlFragments;
    target.nativeElement.innerHTML = '';
    let iframe: any = document.createElement('iframe');
    target.nativeElement.appendChild(iframe);
    iframe.setAttribute('class', 'fragmentIframeSection');
    iframe.setAttribute('allowfullscreen', '');
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = 'calc(100vh - 266px)';
    iframe.contentDocument.head.innerHTML = headStyle;
    this.iframeContentLoaded = htmlFragments;
    iframe.contentDocument.body.innerHTML = htmlFragments;
    iframe.contentDocument.body.setAttribute('ng-app', 'pTagApp');
    iframe.contentDocument.body.setAttribute('ng-controller', 'pTagController');
    this.fragmentIframeEvent = iframe;
    this.showLoader = false;

    setTimeout(() => {      
      this.addScriptMethod(iframe);
    }, 0);
    //this.simulateLogMethod();
    setTimeout(() => {
      this.callOnHoverFragmentDiv(iframe);
    }, 3000);    
    this.logConsoleEnable = true;
  }
  async loadFragmentHtmlIntoIframeMethod(simulate) {
    this.showLoader = true;

    let params;
    // if(this.customSettings || this.isMobileDeviceEnabled){
    //   params = this.concactStrArry;
    // }else{
    //   params = this.strURLVal;
    // }
    params = this.concactStrArry;
    let enCodeParams = params.join('');
    if (enCodeParams !== undefined) {
      enCodeParams = enCodeParams.replaceAll('|', '%7C');
    }
    //let endpoint = this.basePTagUrl+AppConstants.API_END_POINTS.GET_FRAGMENT_SIMULATE_API+this.tagkey+'.html'+"?"+params.join('');
    let endpoint =
      this.ptagSimulateUrlBasePath +
      AppConstants.API_END_POINTS.GET_FRAGMENT_SIMULATE_API +
      this.tagkey +
      '.html' +
      '?' +
      enCodeParams;
    endpoint = this.urlSanitizer.sanitize(endpoint);
    this.fragmentHtmlContentToIframe = endpoint;

    try {
      const jsonData = await this.HttpService.getFragmentSimulate(endpoint).toPromise();
      this.fragmentTagSimulateURL = decodeURIComponent(jsonData.body.response.htmlUrl);
        let iframHeadStyle = `
      <style type='text/css'>table{width: 100% !important;}
      .fragment-type{
        font-family: "Poppins", sans-serif;
        height:100% !important;
        text-align:center !important;
        /* max-width: 99vw !important; */
      }      
      /*.fragment-type > a, .fragment-type > div,  .fragment-type > img, {
        height:calc(100vh - 350px);
      }*/
      .addFragMentDetails{
          position: absolute;
          top: 0;
          left: 0;
          max-width: 32%;          
          background: #777474;
          font-size: 0.7rem;
          padding: 3px 10px;   
          color:#FFF; 
          z-index:99;
      }
      .hide{
        display:none;
      }
      .iconFragment{
        margin-right:10px;
        cursor:pointer;
      }
      .verticalLine{
        vertical-align: super;
        margin-right: 10px;
      }
      .relative{
        position:relative;
      }
      .copyDivStyle{
        position: absolute;
        top: 0px;
        left: -79px;
        background: #000;
        padding: 5px 20px;
        border-radius: 5px;
      }
      .previewFragmentDiv{
        position: absolute;
        top: 32px;
        left: 0;
        background: #fff;
        color: #000;
        z-index: 999;
        width: 44rem;
        height: auto;
        padding: 12px;
        font-size: 12px;
        font-family: "Poppins", sans-serif;
        border: 1px solid #026FE9;
        border-radius: 5px;
        line-height: 25px;       
      }
      i.arrow-up {
        width: 0;
        height: 0;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-bottom: 7px solid #026FE9;
        position: absolute;
        top: -7px;
        left: 145px;
      }
      .closeCss{
        border: none;
        background: none;
        color: #026FE9;
        font-size: 11px;
        font-weight: 800;
        padding: 7px;
        float:right;
        cursor:pointer;
      }
      .copyBtnCss{
        border: 1px solid #026FE9;
        background: none;
        color: #026FE9;
        font-size: 11px;
        font-weight: 800;
        padding: 7px 14px;
        border-radius: 7px;
        float:right;
        cursor:pointer;
      }
      </style>  
      
      `;
        this.addDynamicIframeMethod(this.fragmentIframeElement, jsonData.body.response.simulateHtml, iframHeadStyle);
        this.getDownloadHtmlFromResponseMethod(jsonData.body.response.html); // New changes from 16-10-2024 as p0
        //let ele = this.fragmentIframeElement.nativeElement;

        // if(ele !== null){
        // ele.contentDocument.head.innerHTML = "";
        // let htmlHead = `
        // <style type='text/css'>table{width: 100% !important;}
        // .fragment-type{
        //   padding: 15px;
        //   border: 1px solid #09f;
        //   border-radius: 10px;
        //   background: #E6E5E5;
        //   margin-bottom: 10px;
        //   font-family: "Poppins", sans-serif;
        //   height:100% !important;
        //   max-width: 99vw !important;
        // }
        // /*.fragment-type > a, .fragment-type > div,  .fragment-type > img, {
        //   height:calc(100vh - 350px);
        // }*/
        // .addFragMentDetails{
        //     position: absolute;
        //     top: 0;
        //     right: 0;
        //     max-width: 28%;
        //     background: #777474;
        //     font-size: 0.7rem;
        //     padding: 3px 10px;
        //     color:#FFF;
        //     z-index:99;
        // }
        // .hide{
        //   display:none;
        // }
        // .iconFragment{
        //   margin-right:10px;
        //   cursor:pointer;
        // }
        // .verticalLine{
        //   vertical-align: super;
        //   margin-right: 10px;
        // }
        // .relative{
        //   position:relative;
        // }
        // .copyDivStyle{
        //   position: absolute;
        //   top: 0px;
        //   left: -79px;
        //   background: #000;
        //   padding: 5px 20px;
        //   border-radius: 5px;
        // }
        // .previewFragmentDiv{
        //   position: absolute;
        //   top: 25px;
        //   right: 0;
        //   background: #fff;
        //   color: #000;
        //   z-index: 999;
        //   width: 44rem;
        //   height: auto;
        //   padding: 12px;
        //   font-size: 12px;
        //   font-family: "Poppins", sans-serif;
        //   border: 1px solid #026FE9;
        //   border-radius: 5px;
        //   line-height: 25px;
        // }
        // i.arrow-up {
        //   width: 0;
        //   height: 0;
        //   border-left: 7px solid transparent;
        //   border-right: 7px solid transparent;
        //   border-bottom: 7px solid #026FE9;
        //   position: absolute;
        //   top: -7px;
        //   right: 22px;
        // }
        // .closeCss{
        //   border: none;
        //   background: none;
        //   color: #026FE9;
        //   font-size: 11px;
        //   font-weight: 800;
        //   padding: 7px;
        //   float:right;
        //   cursor:pointer;
        // }
        // .copyBtnCss{
        //   border: 1px solid #026FE9;
        //   background: none;
        //   color: #026FE9;
        //   font-size: 11px;
        //   font-weight: 800;
        //   padding: 7px 14px;
        //   border-radius: 7px;
        //   float:right;
        //   cursor:pointer;
        // }
        // </style>

        // `;
        // // if(simulate){

        // // }else{

        // // }
        // //let withBraketsHtml = htmlData.replaceAll('%7B','{').replaceAll('%7D','}');
        // //let withBraketsHtml = htmlData.replaceAll('pTagApp','pTagApp1').replaceAll('pTagController','pTagController1');
        // let withBraketsHtml = htmlData;
        // //this.iframeContentLoaded = withBraketsHtml;
        // this.ngZone.run(() => {
        //   //ele.contentDocument.body.innerHTML = withBraketsHtml;
        //   //ele.srcdoc = withBraketsHtml;
        //   //this.iframeContentLoaded = undefined;
        //   this.iframeContentLoaded = withBraketsHtml;
        //   ele.contentDocument.body.innerHTML = withBraketsHtml;
        //   //this.addScriptMethod(ele);
        //   //ele.contentDocument.body.appendChild(ele);
        // this.showLoader = false;
        // setTimeout(() => {
        //   this.callOnHoverFragmentDiv(this.fragmentIframeElement);
        // }, 700);
        // });
        // //console.log(htmlData); // Log the HTML content
        // }
      } catch (error) {
        this.showLoader = false;
        console.error("Error fetching data:", error);
      }
  }

  addScriptMethod(ele) {
    const iframeDoc = ele.contentDocument;
    // Check if AngularJS is already loaded
    const angularScript = iframeDoc.createElement('script');
    angularScript.src = `${this.CLOUD_FRONT_URL}/resources/js/masterJS-BEE.js`;
    iframeDoc.onload = function (e) {
      // Initialize AngularJS module and controller after AngularJS is loaded
      const initScript = iframeDoc.createElement('script');
      initScript.textContent = `angular.module("pTagApp", []).controller("pTagController", function($scope){});`;
      iframeDoc.documentElement.appendChild(initScript);
    };
    iframeDoc.documentElement.appendChild(angularScript);
  }
  async htmlTagSimulateCallMethod(isTrue) {
    this.showLoader = true;
    
    let filterUrlTag = this.htmlTagUrlForSimulate ? this.htmlTagUrlForSimulate.split('?'): '';
    let newUrl = filterUrlTag[0] + '?' + this.strURLVal.join('');
    //this.htmlFullTagUrlAPI = newUrl;
    let endpoint = newUrl + '&simulation=' + isTrue;

    try {
      const response = await this.HttpService.getHtmlSimulate(endpoint).toPromise();
        this.isHtmlTagContentPresent = response.body;
        let insertHtml = this.htmlTagIframeContent.nativeElement;
        insertHtml.contentDocument.body.innerHTML = response.body;
        this.showLoader = false;
        this.simulateLogMethod();
        this.logConsoleEnable = true;
      } catch (error) {
        this.showLoader = false;
        console.log("Error fetching data:", error);
        this.showLoader = false;
      }
  }

  async deepLinkTagSimulateCallMethod(isTrue) { // IMAGE MAP Call
    let params;

    params = this.concactStrArry;
    this.showLoader = true;
    let enCodeParams = params.join('');
    if (enCodeParams !== undefined) {
      enCodeParams = enCodeParams.replaceAll('|', '%7C');
    }
    //let endpoint = this.basePTagUrl+AppConstants.API_END_POINTS.GET_FRAGMENT_SIMULATE_API+this.tagkey+'.html'+"?"+params.join('');
    let endpoint =
      this.ptagSimulateUrlBasePath + AppConstants.API_END_POINTS.GET_DEEP_LINK_TAG_URL_API + this.tagkey + '?' + enCodeParams;
    this.fragmentHtmlContentToIframe = endpoint;

    try {
      const response = await this.HttpService.getHtmlSimulate(endpoint).toPromise();
      let finalResponse = JSON.parse(response.body);
      this.showLoader = false;
      if(finalResponse.status == 'SUCCESS'){
        this.deepTagSimulateData = finalResponse.response.simulation;
        this.deepTagPublishedData = finalResponse.response.published;
        this.deepIframeElement.nativeElement.innerHTML = this.deepTagSimulateData;
        this.shareService.deepLinkObj.next(this.deepTagPublishedData);
        this.deeplinkContentLoaded = true;
        this.logConsoleEnable = true;
      }else{
        this.showLoader = false;
        this.dataService.SwalValidationMsg(finalResponse.message);
      }      
    } catch (error) {
      this.showLoader = false;
      console.error("Error deepLinkTagSimulateCallMethod fetching data:", error);
      this.showLoader = false;
    }
  }

  openViewDeepLinkPopupModal() {
    this.viewSimulatePopupEnable = true;
    this.modalRef = this.modalService.show(ViewSimulateDeeplinkComponent, {
      class: 'modal-dialog-centered viewSimulatePopup',
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true,
    });
  }

  switchDeviceView(device) {
    this.ngZone.run(() => {
      if (device == 1) {
        this.isMobileView = false;
      } else if (device == 2) {
        this.isMobileView = true;
      }
    });
  }
}
